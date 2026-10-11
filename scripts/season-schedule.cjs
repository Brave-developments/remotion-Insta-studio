#!/usr/bin/env node
/**
 * Start / pause / schedule the season pipeline (voice-over + wave rendering).
 *
 *   node scripts/season-schedule.cjs status              what is finished, what is queued
 *   node scripts/season-schedule.cjs run                 start now (resumes where it stopped)
 *   node scripts/season-schedule.cjs stop                pause everything
 *   node scripts/season-schedule.cjs wait [--at=00:00]   sleep until that time, then run
 *   node scripts/season-schedule.cjs install [--at=00:00] register a daily Windows task
 *   node scripts/season-schedule.cjs uninstall           remove that task
 *
 * Every stage is resumable, so pausing loses nothing:
 *   - generate-season-voiceovers.cjs keeps its state in studio-kit/season-voiceover-status.json
 *   - render-bank.cjs keeps per-reel signature receipts, so finished reels are skipped
 *   - author-season.cjs / setup-season.cjs rebuild season/*.json from the narration
 */
const {spawn, spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const kit = path.join(root, 'studio-kit');
const statusPath = path.join(kit, 'season-voiceover-status.json');
const stopFlag = path.join(kit, 'season-stop.flag');
const TASK_NAME = 'ArchilSeasonReels';

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const command = process.argv[2] || 'status';
const at = arg('at', '00:00');

const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function readVo() {
  try {
    return JSON.parse(fs.readFileSync(statusPath, 'utf8'));
  } catch {
    return {status: 'not started', completed: 0, expected: 117};
  }
}

function counts() {
  let reels = 0;
  let voiced = 0;
  let mp4 = 0;
  for (const project of PROJECTS) {
    try {
      const list = JSON.parse(fs.readFileSync(path.join(root, 'projects', project, 'season', 'reels.json'), 'utf8')).reels;
      reels += list.length;
      voiced += list.filter((r) => r.audio).length;
      const out = path.join(root, 'projects', project, 'out');
      if (fs.existsSync(out)) {
        mp4 += fs.readdirSync(out).filter((f) => f.endsWith('.mp4') && !f.includes(' - proof')).length;
      }
    } catch {
      /* project not scaffolded yet */
    }
  }
  return {reels, voiced, mp4};
}

/** node processes running one of the pipeline scripts (never this shell). */
function running() {
  const result = spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      // Restrict to node.exe: without this the query matches its own
      // PowerShell command line, which contains the same words.
      'Get-CimInstance Win32_Process | Where-Object { $_.Name -eq "node.exe" -and $_.CommandLine -match "render-waves|generate-season-voiceovers|render-bank" } | ForEach-Object { $_.ProcessId }',
    ],
    {encoding: 'utf8'},
  );
  return (result.stdout || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s))
    .map(Number);
}

function status() {
  const vo = readVo();
  const c = counts();
  const pids = running();
  console.log(`voice-over : ${vo.completed}/${vo.expected} (${vo.status})`);
  console.log(`reels      : ${c.reels} built, ${c.voiced} with audio, ${c.mp4} rendered`);
  console.log(`pipeline   : ${pids.length ? `RUNNING (pids ${pids.join(', ')})` : 'paused'}`);
  console.log(`stop flag  : ${fs.existsSync(stopFlag) ? 'SET (next run will refuse)' : 'clear'}`);
  return pids.length ? 0 : 0;
}

function stop() {
  const pids = running();
  if (!pids.length) {
    console.log('already paused');
    fs.writeFileSync(stopFlag, new Date().toISOString());
    return;
  }
  for (const pid of pids) {
    const result = spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], {encoding: 'utf8'});
    console.log(`stopped ${pid}: ${(result.stdout || result.stderr || '').trim().split('\n')[0]}`);
  }
  fs.writeFileSync(stopFlag, new Date().toISOString());
  console.log('paused. Nothing was lost — every stage resumes.');
}

function spawnLogged(script, logName) {
  const out = fs.openSync(path.join(kit, logName), 'a');
  return spawn(process.execPath, [path.join(root, 'scripts', script)], {
    cwd: root,
    stdio: ['ignore', out, out],
  });
}

function run() {
  if (fs.existsSync(stopFlag)) {
    fs.unlinkSync(stopFlag);
    console.log('cleared stop flag');
  }
  console.log(`starting pipeline at ${new Date().toLocaleTimeString()}`);
  const jobs = [
    spawnLogged('generate-season-voiceovers.cjs', 'season-vo.log'),
    spawnLogged('render-waves.cjs', 'season-render-waves.log'),
  ];
  let stopping = false;
  const children = new Map(jobs.map((j) => [j.pid, j]));

  const tearDown = () => {
    if (stopping) return;
    stopping = true;
    for (const pid of running()) spawnSync('taskkill', ['/PID', String(pid), '/T', '/F']);
  };
  process.on('SIGINT', tearDown);
  process.on('SIGTERM', tearDown);

  const poll = setInterval(() => {
    if (fs.existsSync(stopFlag)) {
      console.log('stop requested');
      tearDown();
    }
  }, 5000);

  let remaining = jobs.length;
  for (const job of jobs) {
    job.on('exit', () => {
      remaining -= 1;
      children.delete(job.pid);
      if (remaining === 0) {
        clearInterval(poll);
        const vo = readVo();
        const c = counts();
        console.log(`pipeline finished: voice-over ${vo.completed}/${vo.expected}, ${c.mp4}/${c.reels} rendered`);
        process.exit(0);
      }
    });
  }
}

/** Next time the given "HH:MM" occurs, as a Date. */
function nextOccurrence(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  const now = new Date();
  const next = new Date(now);
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  return next;
}

function wait() {
  const target = nextOccurrence(at);
  const ms = target - Date.now();
  console.log(`waiting until ${target.toLocaleString()} (${Math.round(ms / 60000)} min)`);
  console.log('run `node scripts/season-schedule.cjs stop` first if you change your mind.');
  while (Date.now() < target.getTime()) sleep(Math.min(60000, target - Date.now()));
  run();
}

function install() {
  const script = path.join(root, 'scripts', 'season-schedule.cjs');
  // No shell: the /TR value has to arrive as one argv entry, otherwise the
  // quoted script path gets split and schtasks reports an invalid argument.
  const result = spawnSync(
    'schtasks',
    ['/Create', '/F', '/TN', TASK_NAME, '/SC', 'DAILY', '/ST', at, '/TR', `node "${script}" run`],
    {encoding: 'utf8'},
  );
  if (result.status !== 0) {
    console.error(`schtasks failed (${result.status}): ${(result.stderr || result.stdout || '').trim()}`);
    process.exit(1);
  }
  console.log(`registered daily task "${TASK_NAME}" at ${at}`);
  console.log(`remove with: node scripts/season-schedule.cjs uninstall`);
  console.log(`(run now with: node scripts/season-schedule.cjs run)`);
}

function uninstall() {
  const result = spawnSync('schtasks', ['/Delete', '/F', '/TN', TASK_NAME], {encoding: 'utf8'});
  console.log((result.stdout || result.stderr || '').trim() || `removed "${TASK_NAME}"`);
}

const commands = {status, run, stop, wait, install, uninstall};
const handler = commands[command];
if (!handler) {
  console.error(`unknown command "${command}". Use: ${Object.keys(commands).join(' | ')}`);
  process.exit(2);
}
handler();
