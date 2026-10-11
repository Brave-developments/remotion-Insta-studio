#!/usr/bin/env node
/**
 * Renders the three storyboard labs in waves while voice-overs are still being
 * generated.
 *
 *   node scripts/render-waves.cjs
 *
 * Each pass runs studio-kit/scripts/render-bank.cjs --with-audio for every
 * project, so reels whose voice-over has landed get rendered and everything
 * else is skipped instead of being rendered silent and then rendered again.
 * render-bank's signature cache makes a repeated pass free for finished reels.
 *
 * Stops after one full pass that started with voice-over generation complete,
 * or when --max-passes / --interval are reached.
 */
const {spawnSync} = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const renderBank = path.join(root, 'studio-kit', 'scripts', 'render-bank.cjs');
const setup = path.join(root, 'scripts', 'setup-season.cjs');
const statusPath = path.join(root, 'studio-kit', 'season-voiceover-status.json');
const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];

const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? Number(hit.split('=')[1]) : fallback;
};
const maxPasses = arg('max-passes', 60);
const intervalMs = arg('interval', 60) * 1000;
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

const readVo = () => {
  try {
    return JSON.parse(fs.readFileSync(statusPath, 'utf8'));
  } catch {
    return {status: 'unknown', completed: 0, expected: 0};
  }
};

const rendered = (project) => {
  const dir = path.join(root, 'projects', project, 'out');
  if (!fs.existsSync(dir)) return 0;
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mp4') && !f.includes(' - proof')).length;
};

let sawComplete = false;
for (let pass = 1; pass <= maxPasses; pass += 1) {
  const vo = readVo();
  if (vo.status === 'complete') sawComplete = true;
  const counts = PROJECTS.map((p) => `${p}:${rendered(p)}`).join(' ');
  console.log(
    `[pass ${pass}] voice-over ${vo.completed}/${vo.expected} (${vo.status}) · mp4s ${counts}` +
      (sawComplete ? ' · final pass' : ''),
  );

  // season/reels.json only regenerates when setup-season.cjs runs, so refresh it
  // first — otherwise --with-audio skips reels whose voice-over has already
  // landed in season/source.json.
  spawnSync(process.execPath, [setup], {stdio: 'ignore'});

  for (const project of PROJECTS) {
    const result = spawnSync(
      process.execPath,
      [renderBank, `--project=${project}`, '--with-audio'],
      {stdio: 'inherit'},
    );
    if (result.status !== 0 && result.status !== 2) {
      console.error(`[pass ${pass}] ${project} render failed with exit ${result.status}`);
    }
  }

  if (sawComplete) break;
  sleep(intervalMs);
}

const vo = readVo();
console.log(
  `DONE pass loop. voice-over ${vo.completed}/${vo.expected} (${vo.status}). ` +
    `mp4s: ${PROJECTS.map((p) => `${p}=${rendered(p)}`).join(', ')}`,
);
