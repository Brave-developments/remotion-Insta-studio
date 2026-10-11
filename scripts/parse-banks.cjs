#!/usr/bin/env node
/**
 * Parses the three supplied storyboard banks into a compact brief so the
 * remaining reels can be authored against a small file instead of 3700 lines
 * of markdown.
 *
 *   node scripts/parse-banks.cjs
 *
 * Writes scripts/season-content/bank-briefs.json:
 *   { RETENTION: [{n, title, hook, beats:[{time, visual, beat}], spine}], ... }
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const outPath = path.join(__dirname, 'season-content', 'bank-briefs.json');

const BANKS = {
  RETENTION: {
    file: 'story board/README_60_REMOTION_REELS (1).md',
    split: /^## (\d+)\. (.+)$/gm,
  },
  UI: {
    file: 'story board/README_UI_MOTION_45S (1).md',
    split: /^# (\d+) — (.+)$/gm,
  },
  BUILD: {
    file: 'story board/BUILDMode_AI_45s_Storyboards_README (1).md',
    split: /^# (\d+) — (.+)$/gm,
  },
};

/** Markdown table rows: | 0–3s | visual | beat | */
function tableRows(chunk) {
  const rows = [];
  for (const line of chunk.split('\n')) {
    const m = /^\|\s*\**([^|]*?)\**\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/.exec(line.trim());
    if (!m) continue;
    const time = m[1].replace(/\*/g, '').trim();
    if (!/\d/.test(time) || /^-{2,}$/.test(time) || /time/i.test(time)) continue;
    rows.push({time, visual: m[2].trim(), beat: m[3].trim()});
  }
  return rows;
}

/** UI bank bullets: `- **0:00–0:04 — Hook:** text` or `- **0:00–0:05:** text` */
function bulletRows(chunk) {
  const rows = [];
  for (const line of chunk.split('\n')) {
    const m = /^-\s*\*\*([\d:]+[\u2013-][\d:]+)(?:\s*[\u2014-]\s*([^:*]+))?:\*\*\s*(.+)$/.exec(line.trim());
    if (!m) continue;
    rows.push({time: m[1], beat: (m[2] || '').trim(), visual: m[3].trim()});
  }
  return rows;
}

function parseRetention(text) {
  const entries = [];
  const re = /^## (\d+)\. (.+)$/gm;
  const marks = [...text.matchAll(re)];
  marks.forEach((m, i) => {
    const chunk = text.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const hook = /^### Hook\s*\n>?\s*(.+)$/m.exec(chunk);
    const beats = tableRows(chunk);
    const core = /^\*\*Core idea:\*\*\s*(.+)$/m.exec(chunk);
    entries.push({
      n: Number(m[1]),
      title: m[2].trim(),
      hook: hook ? hook[1].trim().replace(/^“|”$/g, '') : '',
      core: core ? core[1].trim() : '',
      beats,
      spine: '',
    });
  });
  return entries;
}

function parseUi(text) {
  const entries = [];
  const marks = [...text.matchAll(/^# (\d+) — (.+)$/gm)];
  marks.forEach((m, i) => {
    const chunk = text.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const hook = /^\*\*Hook:\*\*\s*(.+)$/m.exec(chunk);
    const spine = /### Voiceover spine\s*\n+([\s\S]+?)\n+### /.exec(chunk);
    entries.push({
      n: Number(m[1]),
      title: m[2].trim(),
      hook: hook ? hook[1].trim().replace(/^“|”$/g, '') : '',
      core: '',
      beats: bulletRows(chunk),
      spine: spine ? spine[1].replace(/\s*\n\s*/g, ' ').trim() : '',
    });
  });
  return entries;
}

function parseBuild(text) {
  const entries = [];
  const marks = [...text.matchAll(/^# (\d+) — (.+)$/gm)];
  marks.forEach((m, i) => {
    const chunk = text.slice(m.index, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const hook = /^\*\*Hook:\*\*\s*(.+)$/m.exec(chunk);
    const core = /^\*\*Core story:\*\*\s*(.+)$/m.exec(chunk);
    entries.push({
      n: Number(m[1]),
      title: m[2].trim(),
      hook: hook ? hook[1].trim().replace(/^“|”$/g, '') : '',
      core: core ? core[1].trim() : '',
      beats: tableRows(chunk),
      spine: '',
    });
  });
  return entries;
}

const briefs = {};
briefs.RETENTION = parseRetention(fs.readFileSync(path.join(root, BANKS.RETENTION.file), 'utf8'));
briefs.UI = parseUi(fs.readFileSync(path.join(root, BANKS.UI.file), 'utf8'));
briefs.BUILD = parseBuild(fs.readFileSync(path.join(root, BANKS.BUILD.file), 'utf8'));

fs.mkdirSync(path.dirname(outPath), {recursive: true});
fs.writeFileSync(outPath, JSON.stringify(briefs, null, 1) + '\n');

for (const [key, list] of Object.entries(briefs)) {
  const incomplete = list.filter((e) => e.beats.length < 4);
  console.log(`${key}: ${list.length} entries, ${list.filter((e) => e.spine).length} with voiceover spine, ${incomplete.length} with <4 beats`);
  for (const e of incomplete) console.log(`   ! #${e.n} ${e.title} — ${e.beats.length} beats`);
}
console.log('wrote', path.relative(root, outPath));
