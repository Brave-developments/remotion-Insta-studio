#!/usr/bin/env node
/**
 * Rebuild week.reels in projects/<channel>/week-1/remotion-week.json from the
 * per-day packages at week-1/day N/reel.json.
 *
 * A buggy JSON walk in scripts/migrate-projects-folder.cjs once deleted
 * array-valued properties while transforming string values, which dropped the
 * reels array from the three channels' remotion-week.json. Every reel still
 * exists verbatim in its day package (that is where the renderer reads it
 * from anyway), so the array is reconstructed here in day order.
 *
 *   node scripts/repair-remotion-week.cjs
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const CHANNELS = ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF'];
let changed = 0;

for (const channel of CHANNELS) {
  const weekDir = path.join(root, 'projects', channel, 'week-1');
  const weekPath = path.join(weekDir, 'remotion-week.json');
  const week = JSON.parse(fs.readFileSync(weekPath, 'utf8'));

  if (Array.isArray(week.reels) && week.reels.length) {
    console.log(`${channel}: reels already present (${week.reels.length})`);
    continue;
  }

  const reels = [];
  for (const entry of fs.readdirSync(weekDir)) {
    if (!entry.startsWith('day ')) continue;
    const reelPath = path.join(weekDir, entry, 'reel.json');
    if (!fs.existsSync(reelPath)) throw new Error(`missing ${reelPath}`);
    const reel = JSON.parse(fs.readFileSync(reelPath, 'utf8'));
    if (!reel.id || !Array.isArray(reel.scenes) || !reel.scenes.length) {
      throw new Error(`${reelPath}: incomplete reel`);
    }
    if (typeof reel.day !== 'number' || typeof reel.reelNumber !== 'number') {
      throw new Error(`${reelPath}: missing day/reelNumber`);
    }
    reels.push(reel);
  }
  reels.sort((a, b) => a.day - b.day || a.reelNumber - b.reelNumber);
  if (reels.length !== 14) throw new Error(`${channel}: expected 14 reels, found ${reels.length}`);
  const ids = new Set(reels.map((r) => r.id));
  if (ids.size !== reels.length) throw new Error(`${channel}: duplicate reel ids`);

  // Insert reels after the metadata block, keeping key order readable.
  const rebuilt = {};
  for (const [key, value] of Object.entries(week)) rebuilt[key] = value;
  rebuilt.reels = reels;
  fs.writeFileSync(weekPath, JSON.stringify(rebuilt, null, 2) + '\n');
  changed += 1;
  console.log(`${channel}: rebuilt ${reels.length} reels (${reels[0].id} .. ${reels[reels.length - 1].id})`);
}

console.log(`${changed} channel file(s) repaired.`);
