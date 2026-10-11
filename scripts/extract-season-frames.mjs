/**
 * Extracts three sample frames (15%, 50%, 85%) from every rendered season reel.
 *   node scripts/extract-season-frames.mjs [outDir]
 * Output: <outDir>/<reelId>/fNNNN.png
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const outRoot = process.argv[2] || path.join('out', 'season-check');
const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];

fs.rmSync(outRoot, {recursive: true, force: true});

let count = 0;
for (const project of PROJECTS) {
  const seasonFile = path.join('projects', project, 'season', 'reels.json');
  if (!fs.existsSync(seasonFile)) continue;
  const {reels} = JSON.parse(fs.readFileSync(seasonFile, 'utf8'));
  for (const reel of reels) {
    const mp4 = path.join('projects', project, 'out', `${reel.id}.mp4`);
    if (!fs.existsSync(mp4)) {
      console.log('skip (not rendered):', reel.id);
      continue;
    }
    const total = Math.round(reel.durationSeconds * 30);
    const frames = [Math.round(total * 0.15), Math.round(total * 0.5), Math.round(total * 0.85)];
    const dir = path.join(outRoot, reel.id);
    fs.mkdirSync(dir, {recursive: true});
    for (const frame of frames) {
      const output = path.join(dir, `f${String(frame).padStart(4, '0')}.png`);
      execFileSync('ffmpeg', [
        '-v', 'error',
        '-y',
        '-i', mp4,
        '-vf', `select=eq(n\\,${frame})`,
        '-vsync', '0',
        '-frames:v', '1',
        output,
      ]);
      count += 1;
    }
    console.log(`${reel.id}: frames ${frames.join(', ')}`);
  }
}

console.log(`extracted ${count} frame(s) into ${outRoot}`);
process.exitCode = count ? 0 : 1;
