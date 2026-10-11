/**
 * Pixel-level verification for the storyboard-season reels.
 *
 * Usage:
 *   node scripts/check-season.mjs <framesDir> <reelId>
 *
 * Frames are PNGs named with their frame number (f0135.png ...).
 * Caption windows and scene spans are read from the project that owns <reelId>.
 *
 * Checks:
 *   1. canvas is 1080x1920
 *   2. scene content present in the content band (caption never uses it)
 *   3. captions present in the bottom caption slot during a cue
 *   4. right rail clear (x >= 950)
 *   5. bottom safe area clear (y >= 1860, below the footer line)
 *   6. accent colour present and headlines reach off-white
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const W = 1080;
const H = 1920;
const PRESENCE = 70;
const CONTENT_MIN = 2500;
const CAPTION_MIN = 300;

const CONTENT = {y0: 250, y1: 1490, x0: 96, x1: 930};
const CAPTION_SLOT = {y0: 1650, y1: 1770, x0: 150, x1: 930};
const RAIL = {y0: 300, y1: 1770, x0: 950, x1: 1075};
const BOTTOM = {y0: 1860, y1: 1915, x0: 0, x1: 1080};

const dir = process.argv[2];
const reelId = process.argv[3];
if (!dir || !reelId) {
  console.error('usage: node scripts/check-season.mjs <framesDir> <reelId>');
  process.exit(2);
}

const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];
let reel = null;
let project = null;
for (const p of PROJECTS) {
  const file = path.resolve('projects', p, 'season', 'reels.json');
  if (!fs.existsSync(file)) continue;
  const found = JSON.parse(fs.readFileSync(file, 'utf8')).reels.find((r) => r.id === reelId);
  if (found) {
    reel = found;
    project = JSON.parse(fs.readFileSync(path.resolve('projects', p, 'project.json'), 'utf8'));
    break;
  }
}
if (!reel) {
  console.error(`reel ${reelId} not found in any project`);
  process.exit(2);
}

let failures = 0;
const fail = (msg) => {
  failures += 1;
  console.log(`  FAIL ${msg}`);
};
const pass = (msg) => console.log(`  ok   ${msg}`);

function decode(file) {
  const buf = fs.readFileSync(file);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error(`${file}: not a PNG`);
  let off = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const data = buf.subarray(off + 8, off + 8 + len);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    off += 12 + len;
  }
  if (bitDepth !== 8) throw new Error(`${file}: bit depth ${bitDepth}`);
  const ch = colorType === 6 ? 4 : colorType === 2 ? 3 : 0;
  if (!ch) throw new Error(`${file}: colour type ${colorType}`);
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(height * stride);
  let p = 0;
  const paeth = (a, b, c) => {
    const q = a + b - c;
    const pa = Math.abs(q - a);
    const pb = Math.abs(q - b);
    const pc = Math.abs(q - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < height; y += 1) {
    const filter = raw[p++];
    const row = y * stride;
    const prev = (y - 1) * stride;
    for (let x = 0; x < stride; x += 1) {
      const v = raw[p++];
      const a = x >= ch ? out[row + x - ch] : 0;
      const b = y ? out[prev + x] : 0;
      const c = y && x >= ch ? out[prev + x - ch] : 0;
      let value = v;
      if (filter === 1) value = (v + a) & 255;
      else if (filter === 2) value = (v + b) & 255;
      else if (filter === 3) value = (v + ((a + b) >> 1)) & 255;
      else if (filter === 4) value = (v + paeth(a, b, c)) & 255;
      out[row + x] = value;
    }
  }
  return {width, height, ch, data: out};
}

const stats = (img, zone) => {
  let present = 0;
  let maxLuma = 0;
  let accent = 0;
  let nearWhite = 0;
  const accentRef = hexToRgb(project.palette.accent);
  for (let y = zone.y0; y < Math.min(zone.y1, img.height); y += 2) {
    for (let x = zone.x0; x < Math.min(zone.x1, img.width); x += 2) {
      const i = (y * img.width + x) * img.ch;
      const r = img.data[i];
      const g = img.data[i + 1];
      const b = img.data[i + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (luma > PRESENCE) present += 1;
      if (luma > maxLuma) maxLuma = luma;
      if (luma > 225 && r > 225 && g > 225 && b > 225) nearWhite += 1;
      const dist = Math.hypot(r - accentRef[0], g - accentRef[1], b - accentRef[2]);
      if (dist < 70 && luma > 60) accent += 1;
    }
  }
  return {present, maxLuma, accent, nearWhite};
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

const cueAt = (t) => reel.captions.some((c) => t >= c.start && t < c.end);

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.png'))
  .sort();

console.log(`${reel.id} — ${reel.title}`);
console.log(`${files.length} frame(s) · accent ${project.palette.accent}\n`);

let accentTotal = 0;
let whiteFrames = 0;

for (const file of files) {
  const frame = Number(file.match(/(\d+)\.png$/)[1]);
  const img = decode(path.join(dir, file));
  const t = frame / 30;
  const hasCue = cueAt(t);

  console.log(`frame ${frame}  (${t.toFixed(2)}s)  caption=${hasCue ? 'cue' : 'gap'}`);

  if (img.width !== W || img.height !== H) fail(`canvas is ${img.width}x${img.height}, expected ${W}x${H}`);
  else pass('canvas 1080x1920');

  const content = stats(img, CONTENT);
  if (content.present < CONTENT_MIN) fail(`scene content absent (${content.present} < ${CONTENT_MIN}, max=${content.maxLuma.toFixed(0)})`);
  else pass(`content present=${content.present} max=${content.maxLuma.toFixed(0)}`);

  if (hasCue) {
    const caption = stats(img, CAPTION_SLOT);
    if (caption.present < CAPTION_MIN) fail(`caption absent in slot (${caption.present} < ${CAPTION_MIN}, max=${caption.maxLuma.toFixed(0)})`);
    else pass(`caption present=${caption.present} max=${caption.maxLuma.toFixed(0)}`);
  } else {
    pass('no caption cue at this frame — slot not asserted');
  }

  const rail = stats(img, RAIL);
  if (rail.maxLuma > 120) fail(`right rail leak, maxLuma=${rail.maxLuma.toFixed(0)}`);
  else pass(`right rail clear (${rail.maxLuma.toFixed(0)})`);

  const bottom = stats(img, BOTTOM);
  if (bottom.maxLuma > 120) fail(`bottom safe-area leak, maxLuma=${bottom.maxLuma.toFixed(0)}`);
  else pass(`bottom clear (${bottom.maxLuma.toFixed(0)})`);

  accentTotal += content.accent;
  if (content.nearWhite > 400) whiteFrames += 1;
}

console.log('\nreel-wide');
if (accentTotal < 400) fail(`accent too scarce (total=${accentTotal})`);
else pass(`accent total=${accentTotal}`);
if (whiteFrames < 1) fail('headlines never reach off-white');
else pass(`off-white reached in ${whiteFrames}/${files.length} frames`);

console.log(`\n${files.length} frames checked, ${failures} failure(s)`);
process.exitCode = failures ? 1 : 0;
