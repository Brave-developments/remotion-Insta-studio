/**
 * Pixel-level verification of rendered Reel frames.
 *
 * Usage:
 *   npx remotion still Reel out/frames/fNNNN.png --frame=NNNN
 *   node scripts/check-frames.mjs [dir]
 *
 * Caption zones are read from src/video/data/reel.json, because each scene
 * declares its own caption anchor — a bottom-anchored scene keeps the top
 * band free for artwork, and a top-anchored scene reserves it for captions.
 *
 * Checks per frame:
 *   1. canvas is 1080x1920
 *   2. scene content rendered in the band the caption does NOT occupy
 *   3. captions rendered in the band the scene reserves for them
 *   4. nothing leaks into the right rail or bottom UI safe areas
 * Checks across the set:
 *   5. an accent colour is present reel-wide
 *   6. headlines really reach off-white
 *   7. mid-crossfade frames do not collapse toward black
 *   8. the backdrop stays flat across every frame (no flash between scenes)
 *
 * Presence uses a 70-luma threshold: the backdrop measures ~4.8, so 70 is
 * more than 14x background. Crossfades and fade-ins legitimately render text
 * at partial opacity, so full-brightness is reported, not asserted.
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const W = 1080;
const H = 1920;
const PRESENCE = 70;
const CONTENT_MIN = 3000;
const CAPTION_MIN = 400;

const CONTENT = {y0: 200, y1: 1460, x0: 64, x1: 930};
/** Where a caption sits, and the band the scene must keep free for it. */
const CAPTION_SLOT = {
  bottom: {y0: 1540, y1: 1780},
  'bottom-left': {y0: 1540, y1: 1780},
  top: {y0: 120, y1: 470},
  'top-left': {y0: 120, y1: 470},
};
const CAPTION_X = {left: 64, right: 930};
const RAIL = {y0: 900, y1: 1800, x0: 950, x1: 1075};
const BOTTOM = {y0: 1790, y1: 1915, x0: 0, x1: 1080};
const BACKDROP = {y0: 20, y1: 130, x0: 0, x1: 1080};

const reel = JSON.parse(fs.readFileSync('src/video/data/reel.json', 'utf8'));
const FPS = reel.meta.fps;

const anchorAt = (frame) => {
  const t = frame / FPS;
  const scene = reel.scenes.find((s) => t >= s.start && t < s.end);
  return scene?.captionAnchor ?? 'bottom';
};

/**
 * True while two scenes are crossfading. Presence is not asserted then: the
 * transition is verified separately by the brightness-ratio check below.
 */
const inTransition = (frame) => {
  const lead = reel.meta.leadFrames;
  return reel.scenes.some((s) => {
    const b = Math.round(s.start * FPS);
    if (b === 0) return false;
    return Math.abs(frame - b) <= lead + 2;
  });
};

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
  if (!ch) throw new Error(`${file}: color type ${colorType}`);

  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * ch;
  const out = Buffer.alloc(height * stride);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    const ft = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const cur = out.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? out.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (ft === 1) v += a;
      else if (ft === 2) v += b;
      else if (ft === 3) v += (a + b) >> 1;
      else if (ft === 4) {
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        v += pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
      }
      cur[x] = v & 255;
    }
  }

  return {width, height, ch, stride, data: out};
}

const stats = (img, zone) => {
  let present = 0;
  let nearWhite = 0;
  let accent = 0;
  let lumaSum = 0;
  let maxLuma = 0;
  let n = 0;

  for (let y = zone.y0; y < Math.min(zone.y1, img.height); y++) {
    for (let x = zone.x0; x < Math.min(zone.x1, img.width); x++) {
      const i = y * img.stride + x * img.ch;
      const r = img.data[i];
      const g = img.data[i + 1];
      const b = img.data[i + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      lumaSum += luma;
      if (luma > maxLuma) maxLuma = luma;
      if (luma > PRESENCE) present++;
      if (luma > 220) nearWhite++;
      // any saturated hue — violet, blue, green, amber, coral
      const mx = Math.max(r, g, b);
      const mn = Math.min(r, g, b);
      if (luma > 60 && mx - mn > 45) accent++;
      n++;
    }
  }

  return {present, nearWhite, accent, mean: lumaSum / n, maxLuma};
};

const dir = path.resolve(process.argv[2] ?? 'out/frames');
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.png'))
  .sort();

if (files.length === 0) {
  console.error(`No PNGs in ${dir}`);
  process.exit(2);
}

let failures = 0;
const fail = (msg) => {
  failures++;
  console.log(`  FAIL ${msg}`);
};
const pass = (msg) => console.log(`  ok   ${msg}`);

const results = [];

for (const file of files) {
  const frame = Number(file.match(/(\d+)\.png$/)[1]);
  const img = decode(path.join(dir, file));
  const anchor = anchorAt(frame);
  const slot = CAPTION_SLOT[anchor];

  // Content must occupy the band the caption is NOT using.
  const contentZone =
    anchor === 'top' || anchor === 'top-left'
      ? {y0: 500, y1: 1460, x0: 64, x1: 930}
      : {y0: 200, y1: slot.y0 - 40, x0: 64, x1: 930};

  const content = stats(img, contentZone);
  const caption = stats(img, {...CAPTION_SLOT[anchor], x0: CAPTION_X.left, x1: CAPTION_X.right});
  const rail = stats(img, RAIL);
  const bottom = stats(img, BOTTOM);
  const backdrop = stats(img, BACKDROP);
  const transition = inTransition(frame);

  results.push({frame, anchor, content, caption, rail, bottom, backdrop, transition});

  console.log(`\nframe ${frame}  (${(frame / 30).toFixed(2)}s)  caption=${anchor}${transition ? '  [crossfade]' : ''}`);

  if (img.width !== W || img.height !== H) {
    fail(`canvas is ${img.width}x${img.height}, expected ${W}x${H}`);
  } else pass('canvas 1080x1920');

  if (transition) {
    // Mid-crossfade: outgoing and incoming layers share the frame, so absolute
    // presence thresholds are meaningless here. Brightness ratios are checked below.
    pass(`crossfade frame — presence skipped (content=${content.present} caption=${caption.present})`);
  } else {
    if (content.present < CONTENT_MIN) {
      fail(
        `scene content absent in ${JSON.stringify(contentZone)} (>${PRESENCE}: ${content.present}, max=${content.maxLuma.toFixed(0)})`,
      );
    } else {
      pass(`content present=${content.present} max=${content.maxLuma.toFixed(0)}`);
    }

    if (caption.present < CAPTION_MIN) {
      fail(`caption absent in ${anchor} zone (>${PRESENCE}: ${caption.present}, max=${caption.maxLuma.toFixed(0)})`);
    } else {
      pass(`caption present=${caption.present} max=${caption.maxLuma.toFixed(0)}`);
    }
  }

  if (rail.maxLuma > 120) fail(`right rail leak, maxLuma=${rail.maxLuma.toFixed(0)}`);
  else pass(`right rail clear (${rail.maxLuma.toFixed(0)})`);

  if (bottom.maxLuma > 120) fail(`bottom safe-area leak, maxLuma=${bottom.maxLuma.toFixed(0)}`);
  else pass(`bottom clear (${bottom.maxLuma.toFixed(0)})`);
}

console.log('\nreel-wide accent + contrast');

const totalAccent = results.reduce((s, r) => s + r.content.accent + r.caption.accent, 0);
const accentFrames = results.filter((r) => r.content.accent + r.caption.accent > 0).length;
const accentRatio = accentFrames / results.length;
if (totalAccent < 120000) fail(`accent too scarce reel-wide (total=${totalAccent})`);
else pass(`accent total=${totalAccent} across ${accentFrames}/${results.length} frames`);

if (accentRatio < 0.85) fail(`accent present in only ${Math.round(accentRatio * 100)}% of frames`);
else pass(`accent present in ${Math.round(accentRatio * 100)}% of frames`);

const whiteFrames = results.filter((r) => r.content.nearWhite > 1500).length;
if (whiteFrames < 8) fail(`headlines never reach off-white in enough frames (${whiteFrames})`);
else pass(`near-white pixels in ${whiteFrames}/${results.length} frames`);

const anchorsUsed = new Set(results.map((r) => r.anchor));
if (anchorsUsed.size < 3) fail(`captions barely move: only ${anchorsUsed.size} anchors used`);
else pass(`captions used ${anchorsUsed.size} anchors: ${[...anchorsUsed].join(', ')}`);

console.log('\ncrossfade brightness');
const byFrame = Object.fromEntries(results.map((r) => [r.frame, r]));
for (const {mid, a, b, label} of [
  {mid: 310, a: 280, b: 400, label: 's03>s04'},
  {mid: 610, a: 560, b: 720, label: 's05>s06'},
]) {
  if (!byFrame[mid] || !byFrame[a] || !byFrame[b]) {
    fail(`${label}: missing frames for comparison (render ${mid}, ${a}, ${b})`);
    continue;
  }
  const expected = (byFrame[a].content.mean + byFrame[b].content.mean) / 2;
  const ratio = byFrame[mid].content.mean / expected;
  const msg = `${label} frame ${mid}: mean=${byFrame[mid].content.mean.toFixed(1)} vs settled avg=${expected.toFixed(1)} (ratio ${ratio.toFixed(2)})`;
  if (ratio < 0.4) fail(msg);
  else pass(msg);
}

console.log('\nbackdrop constancy (must be flat across every frame)');
const means = results.map((r) => r.backdrop.mean);
const lo = Math.min(...means);
const hi = Math.max(...means);
const spread = (hi - lo) / ((hi + lo) / 2);
const spreadMsg = `min=${lo.toFixed(2)} max=${hi.toFixed(2)} spread=${(spread * 100).toFixed(1)}%`;
if (spread > 0.2) fail(spreadMsg);
else pass(spreadMsg);

console.log(`\n${files.length} frames checked, ${failures} failure(s)`);
process.exit(failures > 0 ? 1 : 0);
