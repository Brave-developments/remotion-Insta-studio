#!/usr/bin/env node
/**
 * Local Voicebox voice-over batch for the three storyboard projects.
 *
 *   node scripts/generate-season-voiceovers.cjs
 *
 * Voice: Brave 1 (override with VOICEBOX_PROFILE_ID).
 * Text: every scene narration of every reel, in scene order, joined by blank
 * lines — the exact words the captions are derived from.
 * Output: <PROJECT>/public/audio/<reelId>.wav, then season/source.json is
 * patched with the audio path and season/reels.json is regenerated.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const base = process.env.VOICEBOX_URL || 'http://127.0.0.1:17493';
const profileId = process.env.VOICEBOX_PROFILE_ID || '741b1aae-46cc-4941-b754-46245dfb69c9';
const statusFile = path.join(root, 'studio-kit/season-voiceover-status.json');
const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];

const state = fs.existsSync(statusFile)
  ? JSON.parse(fs.readFileSync(statusFile, 'utf8'))
  : {expected: 0, completed: 0, reels: {}};
const save = () => fs.writeFileSync(statusFile, JSON.stringify({...state, updatedAt: new Date().toISOString()}, null, 2) + '\n');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function api(route, body, method) {
  const verb = method || (body ? 'POST' : 'GET');
  let last;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(base + route, {
        method: verb,
        headers: {'Content-Type': 'application/json'},
        ...(body ? {body: JSON.stringify(body)} : {}),
        signal: AbortSignal.timeout(60000),
      });
      if (!response.ok) throw new Error(`${route}: ${response.status} ${await response.text()}`);
      return response.json();
    } catch (error) {
      last = error;
      const transient = /fetch failed|ECONNREFUSED|UND_ERR|aborted|TimeoutError/i.test(String(error?.cause ?? error));
      if (!transient || attempt === 6) throw error;
      await sleep(2000 * attempt);
    }
  }
  throw last;
}

function catalog() {
  const rows = [];
  for (const project of PROJECTS) {
    const dir = path.join(root, 'projects', project);
    const info = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8'));
    const season = JSON.parse(fs.readFileSync(path.join(dir, 'season', 'source.json'), 'utf8'));
    for (const reel of season.reels) {
      const text = reel.scenes.map((s) => s.narration).join('\n\n');
      rows.push({project, info, reel, text, output: path.join(dir, 'public', 'audio', `${reel.id}.wav`)});
    }
  }
  return rows;
}

const ffprobe = path.join(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

function probeDuration(file) {
  const {spawnSync} = require('child_process');
  const result = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8'});
  if (result.status !== 0) throw new Error(`ffprobe failed on ${file}: ${result.stderr}`);
  const seconds = Number(String(result.stdout).trim());
  if (!Number.isFinite(seconds) || seconds <= 0) throw new Error(`bad duration for ${file}`);
  return Math.round(seconds * 100) / 100;
}

function patchAudio(item, seconds) {
  const sourcePath = path.join(root, 'projects', item.project, 'season', 'source.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const target = source.reels.find((r) => r.id === item.reel.id);
  const wanted = `audio/${item.reel.id}.wav`;
  const changed = target.audio !== wanted || (seconds && target.audioSeconds !== seconds);
  target.audio = wanted;
  if (seconds) target.audioSeconds = seconds;
  if (changed) fs.writeFileSync(sourcePath, JSON.stringify(source, null, 2) + '\n');
  return changed;
}

async function download(item, job, profile, text, sourceHash, genId) {
  const generation = await api(`/history/${genId}`);
  if (generation.text !== text) throw new Error(`${item.project}/${item.reel.id}: Voicebox altered the submitted script.`);
  const response = await fetch(`${base}/audio/${genId}`, {signal: AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error(`${item.project}/${item.reel.id}: audio download ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 2000) throw new Error(`${item.project}/${item.reel.id}: audio too small (${bytes.length} bytes).`);
  fs.mkdirSync(path.dirname(item.output), {recursive: true});
  fs.writeFileSync(item.output + '.partial', bytes);
  fs.renameSync(item.output + '.partial', item.output);
  const durationSeconds = probeDuration(item.output);
  Object.assign(job, {status: 'complete', bytes: bytes.length, voice: profile.name, durationSeconds, generationId: genId});
  patchAudio(item, durationSeconds);
  state.completed = Object.values(state.reels).filter((r) => r.status === 'complete').length;
  save();
  console.log(`${item.project}/${item.reel.id}: saved (${state.completed}/${state.expected}) — ${durationSeconds}s, ${bytes.length} bytes`);
}

async function main() {
  const profiles = await api('/profiles');
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile) throw new Error(`Voice profile ${profileId} is unavailable. Available: ${profiles.map((p) => p.name).join(', ')}`);
  const engine = profile.default_engine || profile.preset_engine || 'voxcpm';
  const projects = await api('/voice-projects');

  const rows = catalog();
  state.expected = rows.length;
  state.profile = profile.name;
  state.engine = engine;
  state.status = 'generating';
  state.error = undefined;
  save();

  const ids = {};
  for (const name of [...new Set(rows.map((r) => r.info.name))]) {
    const label = `Remotion Season — ${name}`;
    ids[name] = (projects.find((p) => p.name === label) || (await api('/voice-projects', {name: label}))).id;
  }

  console.log(`Voice: ${profile.name} · engine ${engine} · ${rows.length} reels`);

  const pending = [];
  let submitted = 0;
  for (const item of rows) {
    const key = `${item.project}/${item.reel.id}`;
    const sourceHash = crypto.createHash('sha256').update(JSON.stringify({text: item.text, profileId, engine})).digest('hex');
    let job = state.reels[key];
    if (job?.sourceHash === sourceHash && job.status === 'complete' && fs.existsSync(item.output)) {
      patchAudio(item, job.durationSeconds || probeDuration(item.output));
      continue;
    }
    if (!job || job.sourceHash !== sourceHash || !job.generationId) {
      const created = await api('/generate', {
        profile_id: profileId,
        text: item.text,
        language: 'en',
        engine,
        model_size: null,
        personality: false,
        project_id: ids[item.info.name],
        normalize: true,
        effects_chain: [],
        max_chunk_chars: 800,
        crossfade_ms: 50,
      });
      job = state.reels[key] = {sourceHash, generationId: created.id, status: 'queued', output: path.relative(root, item.output)};
      save();
      submitted += 1;
      console.log(`${key}: queued ${created.id}`);
      await sleep(300);
    } else if (job.status === 'complete') {
      job.status = 'generating';
    }
    pending.push({item, job, sourceHash});
  }
  console.log(`${submitted} newly submitted, ${pending.length} to collect, ${state.completed} already saved.`);

  const deadline = Date.now() + 4 * 60 * 60 * 1000;
  while (pending.length && Date.now() < deadline) {
    // Voicebox caps this endpoint at 100 ids per call, and a full bank is 117.
    const ids = pending.map((p) => p.job.generationId);
    const list = [];
    for (let i = 0; i < ids.length; i += 100) {
      list.push(...(await api('/generate/status-batch', {ids: ids.slice(i, i + 100)})));
    }
    const byId = Object.fromEntries(list.map((row) => [row.id, row]));
    // Any generation already finished for identical text is usable, including
    // duplicates left behind by an interrupted run of this same script.
    const history = await api('/history');
    const adopted = new Map();
    for (const row of history.items ?? []) {
      if (row.status === 'completed' && !adopted.has(row.text)) adopted.set(row.text, row.id);
    }
    const remaining = [];
    for (const entry of pending) {
      const ownId = entry.job.generationId;
      const row = byId[ownId];
      const status = row?.status || 'generating';
      const usableId = status === 'completed' ? ownId : adopted.get(entry.item.text);
      if (usableId) {
        await download(entry.item, entry.job, profile, entry.item.text, entry.sourceHash, usableId);
        continue;
      }
      if (status === 'failed' || status === 'not_found') throw new Error(`${entry.item.project}/${entry.item.reel.id}: ${row?.error || 'generation failed'}`);
      remaining.push(entry);
    }
    pending.length = 0;
    pending.push(...remaining);
    if (pending.length) {
      console.log(`waiting on ${pending.length} job(s); ${state.completed}/${state.expected} saved`);
      await sleep(5000);
    }
  }
  if (pending.length) throw new Error(`${pending.length} generation(s) timed out; rerun to resume.`);

  state.status = 'complete';
  save();

  let patched = 0;
  for (const item of rows) {
    const job = state.reels[`${item.project}/${item.reel.id}`];
    if (patchAudio(item, job?.durationSeconds)) patched += 1;
  }
  if (patched) {
    console.log(`patched ${patched} audio path(s) into season/source.json`);
    require('child_process').spawnSync(process.execPath, [path.join(root, 'scripts', 'setup-season.cjs')], {stdio: 'inherit'});
  }
  console.log(`PASS: ${state.completed}/${state.expected} season voice-overs saved with ${profile.name}.`);
}

main().catch((error) => {
  state.status = 'error';
  state.error = error.message;
  save();
  console.error(error.message);
  process.exitCode = 1;
});
