/**
 * Turns the supplied Tabler illustrations into transparent PNG cutouts.
 *
 * The "dark" illustrations ship as 8-bit palette PNGs on a flat #232B41
 * backdrop, which would show as an obvious rectangle on a charcoal canvas.
 * This script expands the palette to RGBA, flood-fills the backdrop from the
 * image border (so interior shapes of a similar colour survive), feathers the
 * anti-aliased rim, and writes RGBA PNGs to public/assets/cutouts/.
 *
 * Usage: node scripts/make-cutouts.mjs [name ...]
 */
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const SRC = path.resolve('pngs/tabler-illustrations/dark');
const OUT = path.resolve('public/assets/cutouts');

/** Flat backdrop colour of the supplied dark illustrations. */
const BG = [0x23, 0x2b, 0x41];
/** Pixels this close to the backdrop count as background. */
const TOL = 30;
/** Extra feather width for anti-aliased edges. */
const FEATHER = 34;

/* ---------------------------------------------------------------- PNG read */

function readChunks(buf) {
  const chunks = [];
  let off = 8;
  while (off < buf.length) {
    const len = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    chunks.push({type, data: buf.subarray(off + 8, off + 8 + len)});
    if (type === 'IEND') break;
    off += 12 + len;
  }
  return chunks;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decode(file) {
  const buf = fs.readFileSync(file);
  const chunks = readChunks(buf);
  const ihdr = chunks.find((c) => c.type === 'IHDR').data;
  const w = ihdr.readUInt32BE(0);
  const h = ihdr.readUInt32BE(4);
  const bitDepth = ihdr[8];
  const colorType = ihdr[9];
  if (bitDepth !== 8) throw new Error(`${file}: bit depth ${bitDepth} unsupported`);

  const plte = chunks.find((c) => c.type === 'PLTE');
  const trns = chunks.find((c) => c.type === 'tRNS');
  const idat = Buffer.concat(chunks.filter((c) => c.type === 'IDAT').map((c) => c.data));
  const raw = zlib.inflateSync(idat);

  let ch; // source bytes per pixel
  if (colorType === 6) ch = 4;
  else if (colorType === 2) ch = 3;
  else if (colorType === 3) ch = 1;
  else throw new Error(`${file}: color type ${colorType} unsupported`);

  const stride = w * ch;
  const src = Buffer.alloc(h * stride);
  let pos = 0;

  for (let y = 0; y < h; y++) {
    const filter = raw[pos++];
    const line = raw.subarray(pos, pos + stride);
    pos += stride;
    const cur = src.subarray(y * stride, (y + 1) * stride);
    const prev = y > 0 ? src.subarray((y - 1) * stride, y * stride) : null;

    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0;
      const b = prev ? prev[x] : 0;
      const c = prev && x >= ch ? prev[x - ch] : 0;
      let v = line[x];
      if (filter === 1) v += a;
      else if (filter === 2) v += b;
      else if (filter === 3) v += (a + b) >> 1;
      else if (filter === 4) v += paeth(a, b, c);
      cur[x] = v & 255;
    }
  }

  // Normalise to RGBA.
  const rgba = Buffer.alloc(w * h * 4);
  if (colorType === 3) {
    if (!plte) throw new Error(`${file}: palette PNG without PLTE`);
    const pal = plte.data;
    for (let i = 0; i < w * h; i++) {
      const idx = src[i];
      rgba[i * 4] = pal[idx * 3];
      rgba[i * 4 + 1] = pal[idx * 3 + 1];
      rgba[i * 4 + 2] = pal[idx * 3 + 2];
      rgba[i * 4 + 3] = trns && idx < trns.data.length ? trns.data[idx] : 255;
    }
  } else {
    for (let i = 0; i < w * h; i++) {
      rgba[i * 4] = src[i * ch];
      rgba[i * 4 + 1] = src[i * ch + 1];
      rgba[i * 4 + 2] = src[i * ch + 2];
      rgba[i * 4 + 3] = ch === 4 ? src[i * ch + 3] : 255;
    }
  }

  return {w, h, rgba};
}

/* --------------------------------------------------------------- cutout */

const dist = (rgba, i) => {
  const dr = rgba[i] - BG[0];
  const dg = rgba[i + 1] - BG[1];
  const db = rgba[i + 2] - BG[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

function cutout({w, h, rgba}) {
  const total = w * h;
  const isBg = new Uint8Array(total);

  // Flood fill from the border so same-coloured shapes inside the artwork
  // are preserved.
  const stack = [];
  const push = (x, y) => {
    const i = y * w + x;
    if (isBg[i]) return;
    if (dist(rgba, i * 4) > TOL) return;
    isBg[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  while (stack.length) {
    const i = stack.pop();
    const x = i % w;
    const y = (i / w) | 0;
    if (x > 0) push(x - 1, y);
    if (x < w - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < h - 1) push(x, y + 1);
  }

  // Feather: solid artwork near the rim keeps partial transparency so the
  // anti-aliased edge does not leave a navy fringe.
  for (let i = 0; i < total; i++) {
    if (isBg[i]) {
      rgba[i * 4 + 3] = 0;
      continue;
    }
    const x = i % w;
    const y = (i / w) | 0;
    let touches = false;
    for (let dy = -2; dy <= 2 && !touches; dy++) {
      for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (isBg[ny * w + nx]) {
          touches = true;
          break;
        }
      }
    }
    if (!touches) continue;
    const d = dist(rgba, i * 4);
    if (d < TOL + FEATHER) {
      const a = Math.max(0, Math.min(1, (d - TOL) / FEATHER));
      rgba[i * 4 + 3] = Math.round(rgba[i * 4 + 3] * a);
    }
  }

  // Trim fully transparent margins so the cutout can be positioned tightly.
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (rgba[(y * w + x) * 4 + 3] > 8) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;

  const cw = maxX - minX + 1;
  const chh = maxY - minY + 1;
  const out = Buffer.alloc(cw * chh * 4);
  for (let y = 0; y < chh; y++) {
    rgba.copy(out, y * cw * 4, ((y + minY) * w + minX) * 4, ((y + minY) * w + minX + cw) * 4);
  }
  return {w: cw, h: chh, rgba: out};
}

/* --------------------------------------------------------------- PNG write */

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng({w, h, rgba}) {
  const stride = w * 4;
  const raw = Buffer.alloc(h * (stride + 1));
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0; // filter: none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, {level: 9})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------------- main */

const DEFAULTS = [
  'ai',
  'chatbot',
  'conversation',
  'hybrid-work',
  'computer-fix',
  'email',
  'calendar',
  'chart',
  'contract',
  'to-do',
  'search',
  'version-control',
  'folders',
  'dart',
  'good-news',
  'message',
  'download',
  'project',
  'telescope',
  'loading',
];

const names = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULTS;
fs.mkdirSync(OUT, {recursive: true});

let ok = 0;
let skipped = 0;
for (const name of names) {
  const file = path.join(SRC, `${name}.png`);
  if (!fs.existsSync(file)) {
    console.log(`skip ${name}: not supplied`);
    skipped++;
    continue;
  }
  const decoded = decode(file);
  const cut = cutout(decoded);
  if (!cut) {
    console.log(`skip ${name}: nothing visible`);
    skipped++;
    continue;
  }
  fs.writeFileSync(path.join(OUT, `${name}.png`), encodePng(cut));
  const saved = Math.round(
    (1 - fs.statSync(path.join(OUT, `${name}.png`)).size / fs.statSync(file).size) * 100,
  );
  console.log(`ok   ${name}: ${decoded.w}x${decoded.h} -> ${cut.w}x${cut.h} (${saved}% smaller)`);
  ok++;
}

console.log(`\n${ok} cutouts written to public/assets/cutouts, ${skipped} skipped`);
process.exit(ok > 0 ? 0 : 1);
