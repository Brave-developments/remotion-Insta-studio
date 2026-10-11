#!/usr/bin/env node
/**
 * Authors the remaining season reels from the parsed banks + written narration.
 *
 *   node scripts/author-season.cjs [--bank=RETENTION] [--only=3,4,5]
 *
 * Reads:
 *   scripts/season-content/bank-briefs.json          (from parse-banks.cjs)
 *   scripts/season-content/retention.cjs|ui.cjs|buildmode.cjs   (narration)
 *   scripts/season-content/pad.cjs                   (closing sentences for
 *       narrations under 125 words, so every reel lands in the 42–45s window)
 *
 * Writes <PROJECT>/season/source.json — existing reels (the six already
 * rendered with measured audio) are preserved untouched; the remaining bank
 * entries are rebuilt from the brief + narration.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const briefs = JSON.parse(fs.readFileSync(path.join(__dirname, 'season-content', 'bank-briefs.json'), 'utf8'));

const args = process.argv.slice(2);
const bankArg = args.find((a) => a.startsWith('--bank='))?.split('=')[1];
const onlyArg = args.find((a) => a.startsWith('--only='))?.split('=')[1];
const only = onlyArg ? new Set(onlyArg.split(',').map(Number)) : null;

/** Bank entries whose reel already exists in season/source.json. */
const BUILT = {RETENTION: [1, 9], UI: [1, 2], BUILD: [1, 5]};

/**
 * Reels rendered before this script existed. They are preserved exactly as
 * they are (measured audio, refit timings) and never regenerated. Everything
 * else in source.json is rebuilt from bank-briefs + narration on every run,
 * so editing narration and re-running is safe.
 */
const KEEP = [
  'R01-BUG-REPORT',
  'R02-RETENTION-CLIFF',
  'U01-LATE-REJECT',
  'U02-PERCEIVED-SPEED',
  'B01-DONE-TRAP',
  'B02-SETUP-BACKWARDS',
];

const BANKS = [
  {key: 'RETENTION', dir: 'RETENTION-LAB', prefix: 'R', content: 'retention.cjs'},
  {key: 'UI', dir: 'UI-MOTION-LAB', prefix: 'U', content: 'ui.cjs'},
  {key: 'BUILD', dir: 'BUILDMODE-LAB', prefix: 'B', content: 'buildmode.cjs'},
];

const round2 = (n) => Math.round(n * 100) / 100;

function slug(title) {
  return title
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-')
    .toUpperCase()
    .slice(0, 24)
    .replace(/-$/, '');
}

/** "0–3s" / "0:00–0:05" -> [0, 3] */
function parseTime(range) {
  const m = /([\d:]+)[\u2013-]([\d:]+)/.exec(range);
  if (!m) return null;
  const toSec = (v) => (v.includes(':') ? v.split(':').reduce((a, b) => a * 60 + Number(b), 0) : Number(v));
  return [toSec(m[1]), toSec(m[2])];
}

/** Split narration into sentences, keeping terminal punctuation. */
function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Distribute sentences across scenes so word share tracks scene duration. */
function distribute(text, spans) {
  const lines = sentences(text);
  const totalWords = lines.join(' ').split(/\s+/).length;
  const totalDur = spans.reduce((n, [, end], i, a) => n + (end - (i ? a[i - 1][1] : 0)), 0) || 1;
  const out = [];
  let cursor = 0;
  let used = 0;
  spans.forEach(([start, end], i) => {
    const share = (end - start) / totalDur;
    const target = i === spans.length - 1 ? lines.length : Math.max(1, Math.round(share * lines.length));
    const picked = lines.slice(cursor, Math.min(lines.length, cursor + target));
    cursor += picked.length;
    used += picked.length;
    out.push(picked.join(' ') || lines[Math.min(cursor, lines.length - 1)] || '');
  });
  if (cursor < lines.length) out[out.length - 1] += ' ' + lines.slice(cursor).join(' ');
  return out;
}

const short = (s, n = 52) => {
  const clean = String(s || '').replace(/\s+/g, ' ').replace(/\*\*/g, '').trim();
  if (clean.length <= n) return clean;
  const cut = clean.slice(0, n);
  const word = cut.slice(0, cut.lastIndexOf(' '));
  return (word || cut).replace(/[,;:.]$/, '');
};

/** On-screen headline for a beat: authored override, bank text, then the visual. */
function headline(beat, visual, authored) {
  if (authored) return authored;
  const fromText = /(?:^|.*?\b)Text:\s*\*\*(.+?)\*\*/.exec(visual || '');
  if (fromText) return fromText[1].trim();
  const bold = [...String(visual || '').matchAll(/\*\*(.+?)\*\*/g)].pop();
  if (bold && bold[1].length <= 48) return bold[1].trim();
  const base = String(beat || visual || '').replace(/\*\*/g, '');
  if (!base) return '';
  const firstStop = base.split(/(?<=[.!?])\s/)[0];
  return short(firstStop.length >= 12 && firstStop.length <= 60 ? firstStop : base, 60);
}

function pickType(index, count, text, previous) {
  if (index === 0) return 'hook';
  if (index === count - 1) return 'payoff';
  const s = text.toLowerCase();
  const candidates = [];
  const push = (type, score) => candidates.push({type, score});
  if (/graph|curve|cliff|retention|drop|trend|chart|slope/.test(s)) push('graph', 5);
  if (/code|terminal|diff|commit|prompt|claude\.md|file|test|log|script/.test(s)) push('code', 4);
  if (/timeline|scrub|reorder|sequence|block|edit|drag|queue/.test(s)) push('timeline', 4);
  if (/stack|diagram|flow|layer|map|connection|node|architect|path/.test(s)) push('diagram', 4);
  if (/list|three|rules|steps|checklist|signs|must|each/.test(s)) push('checklist', 3);
  if (/versus|compare|before|after|linear|eased|split|instead of|vs/.test(s)) push('compare', 3);
  if (/browser|page|url|website|web |site/.test(s)) push('browser', 3);
  if (/phone|mobile|app |device|screen/.test(s)) push('browser', 2);
  if (!candidates.length) push('diagram', 1);
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0].type;
  if (best === previous && candidates.length > 1) return candidates[1].type;
  return best;
}

/** Items for checklist/timeline/diagram/compare scenes, from the bank's own words. */
function itemsFrom(visual, beat) {
  const source = String(visual || '');
  const afterColon = /:\s*(.+)$/.exec(source);
  let pool = afterColon ? afterColon[1] : source;
  pool = pool.replace(/\*\*/g, '');
  let parts = pool
    .split(/,|;|\u2014|\u2013|\s+and\s+|\s+then\s+/i)
    .map((p) => p.trim())
    .filter((p) => p.length > 3 && p.length < 46);
  if (parts.length < 2) {
    parts = String(beat || '')
      .replace(/\*\*/g, '')
      .split(/,|;|\u2014|\u2013/)
      .map((p) => p.trim())
      .filter((p) => p.length > 3 && p.length < 46);
  }
  return [...new Set(parts)].slice(0, 4);
}

function visualFor(type, label, beat, visual) {
  const items = itemsFrom(visual, beat);
  const note = short(beat, 64);
  switch (type) {
    case 'graph':
      return {label, drops: [16, 51, 85], note};
    case 'checklist':
    case 'timeline':
    case 'diagram':
      return {label, items: items.length >= 2 ? items : ['OPENING', 'MIDDLE', 'PAYOFF'], note};
    case 'compare':
      return {label, a: items[0] || short(beat, 34), b: items[1] || short(visual, 34), note};
    case 'code':
      return {
        label,
        file: 'reel.ts',
        code: [items[0] || short(beat, 40), items[1] || short(visual, 40)].map((l) => `// ${l}`),
        highlight: [0],
        note,
      };
    case 'browser':
      return {label, a: short(visual, 60) || short(beat, 60), items: items.length ? items : undefined, note};
    default:
      return {label, items, note};
  }
}

function labelFor(type, text) {
  const words = String(text || '').toUpperCase().replace(/[^A-Z0-9 %/.-]/g, ' ').replace(/\s+/g, ' ').trim();
  const base = words.split(' ').slice(0, 3).join(' ');
  return (base || type.toUpperCase()).slice(0, 22);
}

function buildReel(entry, bank, authored) {
  const beats = entry.beats;
  const spans = beats.map((b) => parseTime(b.time)).filter(Boolean);
  if (spans.length !== beats.length) throw new Error(`${entry.n}: unparsed beat time`);
  for (let i = 1; i < spans.length; i += 1) {
    if (spans[i][0] < spans[i - 1][0]) throw new Error(`${entry.n}: beats out of order`);
  }
  const narration = typeof authored === 'string' ? authored : authored.narration;
  if (!narration) throw new Error(`${entry.n}: no narration`);
  const lines = distribute(narration, spans);

  const textOverride = typeof authored === 'object' ? authored.headlines : null;
  const typeOverride = typeof authored === 'object' ? authored.types : null;
  const visualOverride = typeof authored === 'object' ? authored.visuals : null;

  // Types are chosen in a second pass so each scene can avoid repeating the
  // type the previous scene already used.
  const finalTypes = beats.map((b, i) =>
    i === 0 ? 'hook' : i === beats.length - 1 ? 'payoff' : null,
  );
  for (let i = 1; i < beats.length - 1; i += 1) {
    if (typeOverride?.[i]) {
      finalTypes[i] = typeOverride[i];
      continue;
    }
    const pool = `${beats[i].beat} ${beats[i].visual}`;
    finalTypes[i] = pickType(i, beats.length, pool, finalTypes[i - 1]);
  }

  const built = beats.map((b, i) => {
    const [start, end] = spans[i];
    const type = finalTypes[i];
    const text = headline(b.beat, b.visual, textOverride?.[i]);
    const label = labelFor(type, text);
    const visual = visualOverride?.[i] || visualFor(type, label, b.beat, b.visual);
    return {
      id: `s${i + 1}`,
      start,
      end,
      type,
      text,
      narration: lines[i],
      visual,
    };
  });

  return {
    id: `${bank.prefix}${String(entry.n).padStart(2, '0')}-${slug(entry.title)}`,
    title: entry.title,
    format: 'vertical-reel',
    scenes: built,
  };
}

function loadContent(file) {
  const p = path.join(__dirname, 'season-content', file);
  if (!fs.existsSync(p)) return {};
  delete require.cache[require.resolve(p)];
  return require(p);
}

/** Narrations shorter than this are padded to the measured 42s floor. */
const MIN_WORDS = 125;

let authored_total = 0;
for (const bank of BANKS) {
  if (bankArg && bank.key !== bankArg) continue;
  const sourcePath = path.join(root, 'projects', bank.dir, 'season', 'source.json');
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const preserved = source.reels.filter((r) => KEEP.includes(r.id));
  const previous = new Map(source.reels.map((r) => [r.id, r]));
  const existingIds = new Set(preserved.map((r) => r.id));
  const content = loadContent(bank.content);
  const pads = loadContent('pad.cjs');
  const briefList = briefs[bank.key];
  const kept = [];
  let added = 0;
  for (const entry of briefList) {
    if (BUILT[bank.key].includes(entry.n)) continue;
    if (only && !only.has(entry.n)) {
      continue;
    }
    let authored = content[entry.n];
    if (!authored) continue;
    const pad = pads[bank.key]?.[entry.n];
    if (pad && authored.split(/\s+/).length < MIN_WORDS) authored = `${authored}\n${pad}`;
    const reel = buildReel(entry, bank, authored);
    if (existingIds.has(reel.id)) throw new Error(`duplicate id ${reel.id}`);
    existingIds.add(reel.id);
    // Carry the generated voice-over forward only when the narration is
    // byte-identical to what it was generated from; otherwise the audio is
    // stale and must be regenerated (generate-season-voiceovers.cjs hashes
    // exactly this string).
    const before = previous.get(reel.id);
    if (before?.audio) {
      const oldText = before.scenes.map((s) => s.narration).join('\n\n');
      const newText = reel.scenes.map((s) => s.narration).join('\n\n');
      if (oldText === newText && fs.existsSync(path.join(root, 'projects', bank.dir, 'public', before.audio))) {
        reel.audio = before.audio;
        reel.audioSeconds = before.audioSeconds;
      }
    }
    for (const scene of reel.scenes) {
      if (/\[[^\]]+\]/.test(scene.text + scene.narration)) throw new Error(`${reel.id}/${scene.id}: placeholder`);
      if (scene.end <= scene.start) throw new Error(`${reel.id}/${scene.id}: empty scene`);
      if (!scene.text) throw new Error(`${reel.id}/${scene.id}: no headline`);
    }
    kept.push(reel);
    added += 1;
  }
  const merged = preserved.concat(kept);
  const dropped = source.reels.length - preserved.length;
  const words = kept.reduce((n, r) => n + r.scenes.reduce((m, s) => m + s.narration.split(/\s+/).length, 0), 0);
  authored_total += added;
  fs.writeFileSync(sourcePath, JSON.stringify({reels: merged}, null, 2) + '\n');
  console.log(
    `${bank.dir}: ${merged.length} reels (${preserved.length} preserved + ${added} rebuilt${dropped ? `, ${dropped} replaced` : ''}), ${words} narration words`,
  );
}
console.log(`authored ${authored_total} reel(s)`);
