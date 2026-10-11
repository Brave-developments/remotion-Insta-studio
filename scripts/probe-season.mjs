/**
 * Stream + duration verification for rendered season reels.
 *   node scripts/probe-season.mjs
 * Passes only when: h264 1080x1920 30/1, an audio stream exists, and the file
 * duration matches the audio-driven scene timeline within 0.15s.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const ff = path.join('node_modules', '@remotion', 'compositor-win32-x64-msvc', 'ffprobe.exe');
const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];
let bad = 0;
let checked = 0;

for (const project of PROJECTS) {
  const seasonFile = path.join('projects', project, 'season', 'reels.json');
  if (!fs.existsSync(seasonFile)) continue;
  const {reels} = JSON.parse(fs.readFileSync(seasonFile, 'utf8'));
  for (const reel of reels) {
    const file = path.join('projects', project, 'out', `${reel.id}.mp4`);
    if (!fs.existsSync(file)) {
      console.log('MISS', project.padEnd(14), reel.id.padEnd(22), 'not rendered');
      bad += 1;
      continue;
    }
    checked += 1;
    const info = JSON.parse(execFileSync(ff, ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', file]));
    const video = info.streams.find((s) => s.codec_type === 'video');
    const audio = info.streams.find((s) => s.codec_type === 'audio');
    const duration = Number(info.format.duration);
    const drift = Math.abs(duration - reel.durationSeconds);
    const problems = [];
    if (!video) problems.push('no video stream');
    else {
      if (video.codec_name !== 'h264') problems.push(`codec ${video.codec_name}`);
      if (video.width !== 1080 || video.height !== 1920) problems.push(`${video.width}x${video.height}`);
      if (video.r_frame_rate !== '30/1') problems.push(`fps ${video.r_frame_rate}`);
    }
    if (!audio) problems.push('NO AUDIO STREAM');
    if (drift >= 0.15) problems.push(`drift ${drift.toFixed(3)}s`);

    const ok = problems.length === 0;
    if (!ok) bad += 1;
    const v = video ? `${video.codec_name} ${video.width}x${video.height} ${video.r_frame_rate} ${video.nb_frames}f` : 'no video';
    const a = audio ? `${audio.codec_name} ${Number(audio.duration).toFixed(2)}s` : 'MISSING';
    console.log(
      ok ? 'ok  ' : 'FAIL',
      project.padEnd(14),
      reel.id.padEnd(22),
      v.padEnd(34),
      '| audio',
      a.padEnd(14),
      '| dur',
      duration.toFixed(2),
      'expected',
      reel.durationSeconds,
      ok ? '' : `| ${problems.join(', ')}`,
    );
  }
}

console.log(`\n${checked} rendered, ${bad} problem(s)`);
process.exitCode = bad ? 1 : 0;
