// Local, resumable Voicebox batch for the FiveM Resource Hub promo voice-over.
// Mirrors scripts/generate-voiceovers.cjs (same API routes, resumable status file).
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {spawnSync} = require('child_process');
const root = path.resolve(__dirname, '..');
const base = process.env.VOICEBOX_URL || 'http://127.0.0.1:17493';
const profileId = process.env.VOICEBOX_PROFILE_ID || '741b1aae-46cc-4941-b754-46245dfb69c9';
const projectName = 'FiveM Resource Hub — Promo';
const outFile = path.join(root, 'src/promo/audio/voiceover.wav');
const statusFile = path.join(root, 'src/promo/audio/voiceover-status.json');
const ffprobe = path.join(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

// Exact narration (GST): extracted from src/promo/copy.ts VOICE_LINES.
const TEXT = [
  'FiveM resources are everywhere.',
  "Finding the right one shouldn't feel like a full-time job.",
  'Meet FiveM Resource Hub — one place to discover free scripts, MLOs, vehicles, maps, UI packs, and more.',
  'Search exactly what you need, browse what’s trending, or jump straight into the latest releases.',
  'Every listing is built around the original resource, with clear publish dates and official project destinations.',
  'So you spend less time hunting and more time building.',
  'Want more eyes on what you’re building?',
  'Promote your server, stream, giveaway, or hosting brand and reach more of the FiveM community.',
  'Get featured, gain more visibility, and put your project in front of the right audience.',
  'And if you’ve built a resource worth sharing, submit it directly for review.',
  'One hub. More discovery. More visibility. Less searching.',
  'FiveM Resource Hub. Find it. Build it. Get seen.',
].join('\n');

// Style guidance is NOT sent to the API (unknown field risk); the voice
// profile carries the tone. The full TTS style prompt lives in
// docs/PROMO-VOICE.md for anyone generating manually.

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

function probe(file) {
  const r = spawnSync(ffprobe, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file], {encoding: 'utf8'});
  if (r.status !== 0) throw new Error(`invalid audio: ${r.stderr}`);
  const info = JSON.parse(r.stdout);
  const audio = info.streams.find(s => s.codec_type === 'audio');
  if (!audio || Number(info.format.duration) <= 0) throw new Error('no valid audio stream');
  return {duration: Number(info.format.duration), sampleRate: audio.sample_rate, channels: audio.channels};
}

async function main() {
  const profiles = await api('/profiles');
  const profile = profiles.find(p => p.id === profileId);
  if (!profile) throw new Error('Selected voice profile is unavailable.');
  const engine = profile.default_engine || profile.preset_engine || 'voxcpm';
  const sourceHash = crypto.createHash('sha256').update(JSON.stringify({text: TEXT, profileId, engine})).digest('hex');

  const state = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, 'utf8')) : {completed: false};
  if (state.completed && state.sourceHash === sourceHash && fs.existsSync(outFile)) {
    const dur = probe(outFile).duration;
    console.log(`PASS: voiceover.wav exists and matches (${dur.toFixed(2)}s). Nothing to do.`);
    return;
  }

  // One project folder for this campaign, reused on resume.
  const projects = await api('/voice-projects');
  const project = projects.find(p => p.name === projectName) || await api('/voice-projects', {name: projectName});

  let job = state.generationId
    ? {generationId: state.generationId}
    : null;
  if (!job) {
    const body = {
      profile_id: profileId,
      text: TEXT,
      language: 'en',
      engine,
      model_size: null,
      personality: false,
      project_id: project.id,
      normalize: true,
      effects_chain: [],
      max_chunk_chars: 800,
      crossfade_ms: 50,
    };
    const created = await api('/generate', body);
    job = {generationId: created.id};
    state.generationId = created.id;
    state.sourceHash = sourceHash;
    state.engine = engine;
    state.voice = profile.name;
    state.submittedAt = new Date().toISOString();
    fs.writeFileSync(statusFile, JSON.stringify(state, null, 2) + '\n');
    console.log(`queued ${created.id} (voice: ${profile.name}, engine: ${engine})`);
    await sleep(500);
  } else {
    console.log(`resuming ${job.generationId}`);
  }

  const deadline = Date.now() + 60 * 60 * 1000;
  while (Date.now() < deadline) {
    const rows = await api('/generate/status-batch', {ids: [job.generationId]});
    const row = rows.find(r => r.id === job.generationId);
    const status = row?.status || 'generating';
    if (status === 'completed') {
      const generation = await api('/history/' + job.generationId);
      if (generation.text !== TEXT) throw new Error('Voicebox changed the supplied script.');
      const response = await fetch(base + '/audio/' + job.generationId, {signal: AbortSignal.timeout(60000)});
      if (!response.ok) throw new Error(`audio download ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length < 1000) throw new Error('audio file is too small');
      fs.mkdirSync(path.dirname(outFile), {recursive: true});
      fs.writeFileSync(outFile + '.partial', bytes);
      const meta = probe(outFile + '.partial');
      fs.renameSync(outFile + '.partial', outFile);
      Object.assign(state, {status: 'complete', durationSeconds: meta.duration, sampleRate: meta.sampleRate, channels: meta.channels, bytes: bytes.length, completedAt: new Date().toISOString()});
      fs.writeFileSync(statusFile, JSON.stringify(state, null, 2) + '\n');
      console.log(`PASS: voiceover.wav saved (${meta.duration.toFixed(2)}s @ ${meta.sampleRate}Hz).`);
      console.log('Next: run the alignment script (scripts/align-promo-voiceover.py) to retime scenes from the real WAV.');
      return;
    }
    if (status === 'failed' || status === 'not_found') {
      throw new Error(row?.error || 'Voicebox generation failed');
    }
    console.log(`waiting on ${job.generationId} (${status})`);
    await sleep(5000);
  }
  throw new Error('timed out after 60 minutes; rerun to resume collecting.');
}

main().catch(error => {
  const s = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, 'utf8')) : {};
  s.status = 'error';
  s.error = error.message;
  fs.writeFileSync(statusFile, JSON.stringify(s, null, 2) + '\n');
  console.error(error.message);
  process.exitCode = 1;
});
