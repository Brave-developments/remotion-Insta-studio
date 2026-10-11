// Local, resumable Voicebox batch. Queue every remaining reel, then collect.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {spawnSync} = require('child_process');
const root = path.resolve(__dirname, '..');
const base = process.env.VOICEBOX_URL || 'http://127.0.0.1:17493';
const profileId = process.env.VOICEBOX_PROFILE_ID || '741b1aae-46cc-4941-b754-46245dfb69c9';
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'studio-kit/week-1-projects.json'), 'utf8'));
const statusFile = path.join(root, 'studio-kit/voiceover-batch-status.json');
const state = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, 'utf8')) : {expected: 42, completed: 0, reels: {}};
const ffprobe = path.join(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
const save = () => fs.writeFileSync(statusFile, JSON.stringify({...state, updatedAt: new Date().toISOString()}, null, 2) + '\n');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function api(route, body, method) {
  const verb = method || (body ? 'POST' : 'GET');
  let lastError;
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const response = await fetch(base + route, {method: verb, headers: {'Content-Type': 'application/json'}, ...(body ? {body: JSON.stringify(body)} : {}), signal: AbortSignal.timeout(60000)});
      if (!response.ok) throw new Error(`${route}: ${response.status} ${await response.text()}`);
      return response.json();
    } catch (error) {
      lastError = error;
      const transient = /fetch failed|ECONNREFUSED|UND_ERR|aborted|TimeoutError/i.test(String(error?.cause ?? error));
      if (!transient || attempt === 6) throw error;
      await sleep(2000 * attempt);
    }
  }
  throw lastError;
}
function sourceFor(item, engine) {
  const reel = JSON.parse(fs.readFileSync(path.join(root, item.project, 'reel.json'), 'utf8'));
  const text = reel.scenes.map(s => s.presentationNarration ?? s.narration).join('\n\n');
  const sourceHash = crypto.createHash('sha256').update(JSON.stringify({text, profileId, engine})).digest('hex');
  return {text, sourceHash, output: path.join(root, 'projects', item.channel, 'public/audio', item.name + '.wav')};
}
async function downloadJob(item, job, profile, text, sourceHash, output) {
  const generation = await api('/history/' + job.generationId);
  if (generation.text !== text) throw new Error(`${item.channel}/${item.name}: Voicebox changed the supplied script.`);
  const response = await fetch(base + '/audio/' + job.generationId, {signal: AbortSignal.timeout(60000)});
  if (!response.ok) throw new Error(`${item.channel}/${item.name}: audio download ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error(`${item.channel}/${item.name}: audio file is too small.`);
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output + '.partial', bytes);
  const probe = spawnSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', output + '.partial'], {encoding: 'utf8'});
  if (probe.status !== 0) throw new Error(`${item.channel}/${item.name}: invalid audio: ${probe.stderr}`);
  const info = JSON.parse(probe.stdout);
  const audio = info.streams.find(s => s.codec_type === 'audio');
  if (!audio || Number(info.format.duration) <= 0) throw new Error(`${item.channel}/${item.name}: no valid audio stream.`);
  fs.renameSync(output + '.partial', output);
  Object.assign(job, {status: 'complete', durationSeconds: Number(info.format.duration), sampleRate: audio.sample_rate, channels: audio.channels, bytes: bytes.length});
  fs.writeFileSync(path.join(root, item.project, 'voiceover.json'), JSON.stringify({voice: profile.name, profileId, engine: state.engine, file: job.output, generationId: job.generationId, sourceHash, durationSeconds: job.durationSeconds, scriptInputExact: true, synchronization: 'Audio generated; scene alignment and voiced video export still pending.'}, null, 2) + '\n');
  state.completed = Object.values(state.reels).filter(r => r.status === 'complete').length;
  save();
  console.log(`${item.channel}/${item.name}: complete (${state.completed}/42), ${job.durationSeconds.toFixed(2)}s`);
}
async function main() {
  const profiles = await api('/profiles');
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) throw new Error('Selected voice profile is unavailable.');
  const projects = await api('/voice-projects');
  const ids = {};
  state.profile = profile.name;
  state.engine = profile.default_engine || profile.preset_engine || 'voxcpm';
  state.status = 'generating';
  state.error = undefined;
  save();
  for (const channel of [...new Set(catalog.map(r => r.channel))]) {
    const name = `Remotion Week 1 — ${channel}`;
    ids[channel] = (projects.find(p => p.name === name) || await api('/voice-projects', {name})).id;
  }
  const pending = [];
  let submitted = 0;
  let alreadyQueued = 0;
  for (const item of catalog) {
    const key = `${item.channel}/${item.name}`;
    const {text, sourceHash, output} = sourceFor(item, state.engine);
    let job = state.reels[key];
    if (job?.sourceHash === sourceHash && job.status === 'complete' && fs.existsSync(output)) continue;
    if (!job || job.sourceHash !== sourceHash || !job.generationId) {
      const created = await api('/generate', {profile_id: profileId, text, language: 'en', engine: state.engine, model_size: null, personality: false, project_id: ids[item.channel], normalize: true, effects_chain: [], max_chunk_chars: 800, crossfade_ms: 50});
      job = state.reels[key] = {sourceHash, generationId: created.id, status: 'queued', output: path.relative(root, output), text};
      save();
      submitted += 1;
      console.log(`${key}: queued ${created.id}`);
      await sleep(250);
    } else {
      alreadyQueued += 1;
      if (job.status === 'complete') job.status = 'generating';
      job.output = path.relative(root, output);
      job.text = text;
      save();
      console.log(`${key}: already in Voicebox (${job.generationId})`);
    }
    pending.push({item, job, text, sourceHash, output});
  }
  console.log(`Voicebox queue ready: ${submitted} newly submitted, ${alreadyQueued} already generating/queued, ${pending.length} still to collect, ${state.completed || 0} already saved.`);
  const deadline = Date.now() + 12 * 60 * 60 * 1000;
  while (pending.length && Date.now() < deadline) {
    const rows = await api('/generate/status-batch', {ids: pending.map(p => p.job.generationId)});
    const byId = Object.fromEntries(rows.map(row => [row.id, row]));
    const remaining = [];
    for (const entry of pending) {
      const row = byId[entry.job.generationId];
      const status = row?.status || 'generating';
      if (status === 'completed') {
        await downloadJob(entry.item, entry.job, profile, entry.text, entry.sourceHash, entry.output);
        continue;
      }
      if (status === 'failed' || status === 'not_found') {
        throw new Error(`${entry.item.channel}/${entry.item.name}: ${row?.error || 'Voicebox generation failed'}`);
      }
      remaining.push(entry);
    }
    pending.length = 0;
    pending.push(...remaining);
    if (pending.length) {
      console.log(`Waiting on ${pending.length} Voicebox job(s); ${state.completed || 0}/42 saved.`);
      await sleep(5000);
    }
  }
  if (pending.length) throw new Error(`${pending.length} generation(s) timed out; resume to continue collecting.`);
  state.status = 'complete';
  save();
  console.log('PASS: all 42 exact-script voiceovers exported. Video synchronization is a separate step.');
}
main().catch(error => {state.status = 'error'; state.error = error.message; save(); console.error(error.message); process.exitCode = 1;});
