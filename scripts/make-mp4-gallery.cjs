#!/usr/bin/env node
/**
 * Sync every finished MP4 into exports/ and (re)build MP4-GALLERY.html.
 *
 *   node scripts/make-mp4-gallery.cjs
 *
 * exports/ is a copy (never a move), so the project folders and the existing
 * galleries keep working. Safe to re-run any time — new and updated renders
 * are copied over, then the HTML index is regenerated with durations.
 */
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const root = path.resolve(__dirname, '..');
const exportsDir = path.join(root, 'exports');
const ffprobe = path.join(root, 'node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

/** Where finished MP4s live, per group. dest is relative to exports/. */
const SOURCES = [
  {title: 'Promo campaign', dest: 'promo', files: [
    'out/resource-hub-master.mp4',
    'out/resource-hub-30s.mp4',
    'out/resource-hub-reel.mp4',
    'out/hero-loop.mp4',
  ]},
  {title: 'Standalone reels', dest: 'misc', files: ['out/reel.mp4']},
  {title: 'RETENTION-LAB · season reels', dest: 'RETENTION-LAB', dir: 'projects/RETENTION-LAB/out', flat: true},
  {title: 'UI-MOTION-LAB · season reels', dest: 'UI-MOTION-LAB', dir: 'projects/UI-MOTION-LAB/out', flat: true},
  {title: 'BUILDMODE-LAB · season reels', dest: 'BUILDMODE-LAB', dir: 'projects/BUILDMODE-LAB/out', flat: true},
  {title: 'TOMORROW.EXE · week 1', dest: 'TOMORROW-EXE', subdirs: [
    {label: 'voiced', dir: 'projects/TOMORROW-EXE/out/week-1/voiced', dest: 'voiced'},
    {label: 'silent', dir: 'projects/TOMORROW-EXE/out/week-1', dest: 'silent'},
  ]},
  {title: 'BUILDMode AI · week 1', dest: 'BUILDMode-AI', subdirs: [
    {label: 'voiced', dir: 'projects/BUILDMode-AI/out/week-1/voiced', dest: 'voiced'},
    {label: 'silent', dir: 'projects/BUILDMode-AI/out/week-1', dest: 'silent'},
  ]},
  {title: 'TOOLPROOF · week 1', dest: 'TOOLPROOF', subdirs: [
    {label: 'voiced', dir: 'projects/TOOLPROOF/out/week-1/voiced', dest: 'voiced'},
    {label: 'silent', dir: 'projects/TOOLPROOF/out/week-1', dest: 'silent'},
  ]},
  {title: 'remotion-ai-agent-reel', dest: 'remotion-ai-agent-reel', files: [
    'projects/remotion-ai-agent-reel/ai-agent-era.mp4',
    'projects/remotion-ai-agent-reel/ai-agent-era-polished.mp4',
    'projects/remotion-ai-agent-reel/ai-agent-era-smooth.mp4',
  ]},
];

let copied = 0;
function copyInto(srcFile, destFile) {
  const from = path.join(root, srcFile);
  if (!fs.existsSync(from)) return;
  if (/\s-\sproof/.test(path.basename(from))) return;
  const to = path.join(exportsDir, destFile);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  const a = fs.existsSync(to) ? fs.statSync(to) : null;
  const b = fs.statSync(from);
  if (a && a.size === b.size && a.mtimeMs >= b.mtimeMs) return;
  fs.copyFileSync(from, to);
  copied += 1;
}

for (const source of SOURCES) {
  if (source.files) for (const f of source.files) copyInto(f, path.join(source.dest, path.basename(f)).replace(/\\/g, '/'));
  if (source.dir) {
    const from = path.join(root, source.dir);
    if (!fs.existsSync(from)) continue;
    for (const name of fs.readdirSync(from)) {
      if (name.endsWith('.mp4')) copyInto(path.join(source.dir, name), `${source.dest}/${name}`);
    }
  }
  for (const sub of source.subdirs || []) {
    const from = path.join(root, sub.dir);
    if (!fs.existsSync(from)) continue;
    for (const name of fs.readdirSync(from)) {
      if (name.endsWith('.mp4')) copyInto(path.join(sub.dir, name), `${source.dest}/${sub.dest}/${name}`);
    }
  }
}

/** All mp4s under exports/, grouped by the SOURCES dest folders. */
function collect() {
  const groups = new Map();
  const walk = (rel) => {
    const dir = path.join(exportsDir, rel);
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const child = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(child);
      else if (entry.name.endsWith('.mp4')) {
        const top = child.split('/')[0];
        if (!groups.has(top)) groups.set(top, []);
        groups.get(top).push(child);
      }
    }
  };
  walk('');
  for (const list of groups.values()) list.sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
  return groups;
}

function probe(rel) {
  const file = path.join(exportsDir, rel);
  const size = fs.statSync(file).size;
  let duration = null;
  const result = spawnSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], {encoding: 'utf8', timeout: 8000});
  if (result.status === 0) {
    const value = Number(String(result.stdout).trim());
    if (Number.isFinite(value) && value > 0) duration = value;
  }
  return {size, duration};
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (s) => s.split('/').map(encodeURIComponent).join('/');
const human = (bytes) => (bytes >= 1e9 ? (bytes / 1e9).toFixed(2) + ' GB' : bytes >= 1e6 ? (bytes / 1e6).toFixed(1) + ' MB' : Math.round(bytes / 1e3) + ' KB');

const groups = collect();
const titles = Object.fromEntries(SOURCES.map((s) => [s.dest, s.title]));
let totalBytes = 0;
let totalCount = 0;
const sections = [];
const buttons = ['<button class="active" data-filter="all">All</button>'];
for (const [top, files] of groups) {
  const title = titles[top] || top;
  buttons.push(`<button data-filter="${esc(top)}">${esc(title)}</button>`);
  const cards = files.map((rel) => {
    const {size, duration} = probe(rel);
    totalBytes += size;
    totalCount += 1;
    const name = rel.split('/').slice(1).join(' / ');
    const badge = rel.split('/').length > 2 ? `<span class="badge ${rel.includes('/voiced/') ? 'voiced' : 'silent'}">${rel.includes('/voiced/') ? 'voiced' : 'silent'}</span>` : '';
    const dur = duration ? `${duration.toFixed(1)}s` : '—';
    return `<article data-group="${esc(top)}"><video controls playsinline preload="metadata" src="${url('exports/' + rel)}"></video><div class="copy"><div class="name">${esc(name)}${badge}</div><div class="meta">${dur} · ${human(size)}</div><a href="${url('exports/' + rel)}">Open file</a></div></article>`;
  }).join('\n');
  sections.push(`<section data-group="${esc(top)}"><h2>${esc(title)} <span>${files.length}</span></h2><div class="grid">${cards}</div></section>`);
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MP4 exports · ${totalCount} videos</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; background: #080b10; color: #eef2f7; font-family: 'Segoe UI', Arial, sans-serif; }
  main { max-width: 1500px; margin: auto; padding: 40px 24px 80px; }
  .eyebrow { color: #8fa8ff; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; }
  h1 { font-size: clamp(30px, 5vw, 50px); letter-spacing: -2px; margin: 12px 0 8px; }
  header p { max-width: 900px; line-height: 1.7; color: #9cabc1; margin: 0; }
  nav { display: flex; gap: 10px; flex-wrap: wrap; margin: 26px 0 12px; position: sticky; top: 0; background: #080b10; padding: 12px 0; z-index: 5; }
  button { font: inherit; color: #c3ccda; background: #121a25; border: 1px solid #2b3a50; border-radius: 30px; padding: 10px 18px; cursor: pointer; }
  button:hover { border-color: #4a6183; }
  button.active { background: #dfe8ff; color: #0d1933; border-color: #dfe8ff; }
  section h2 { font-size: 21px; margin: 34px 0 14px; letter-spacing: -0.5px; }
  section h2 span { color: #9cabc1; font-weight: 400; font-size: 15px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 18px; }
  article { background: #111821; border: 1px solid #263244; border-radius: 14px; overflow: hidden; }
  video { display: block; width: 100%; aspect-ratio: 16 / 9; background: #05070b; }
  .copy { padding: 14px 16px 16px; }
  .name { font-size: 14px; font-weight: 600; word-break: break-word; }
  .badge { display: inline-block; margin-left: 8px; font-size: 10.5px; letter-spacing: 1.5px; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; vertical-align: 1px; }
  .badge.voiced { background: #123b2a; color: #4ade80; }
  .badge.silent { background: #1d2433; color: #93a6c7; }
  .meta { color: #9cabc1; font-size: 12.5px; margin: 6px 0 10px; }
  a { color: #acd0ff; text-decoration: none; font-size: 13.5px; }
  a:hover { text-decoration: underline; }
  footer { color: #6d7688; font-size: 12.5px; margin-top: 46px; line-height: 1.7; }
  article[hidden], section[hidden] { display: none; }
</style>
</head>
<body>
<main>
  <header>
    <span class="eyebrow">Freebuff studio</span>
    <h1>Every finished MP4.</h1>
    <p>${totalCount} videos · ${human(totalBytes)} · synced copies of the renders, one folder per project. Re-run <code>node scripts/make-mp4-gallery.cjs</code> to refresh after new renders.</p>
  </header>
  <nav>${buttons.join('')}</nav>
  ${sections.join('\n')}
  <footer>Source of truth stays in each project's <code>out/</code> folder — <code>exports/</code> is a flat, easy-to-browse copy. Season labs still have ${117 - 104} reels queued; the promo campaign is complete.</footer>
</main>
<script>
  for (const button of document.querySelectorAll('nav button')) button.addEventListener('click', () => {
    document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b === button));
    const filter = button.dataset.filter;
    for (const section of document.querySelectorAll('section')) {
      const show = filter === 'all' || section.dataset.group === filter;
      section.hidden = !show;
      if (show) for (const card of section.querySelectorAll('article')) { card.hidden = false; card.querySelector('video').pause(); }
    }
    if (filter !== 'all') document.querySelector('section[data-group="' + filter + '"]')?.scrollIntoView({behavior: 'smooth'});
  });
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(root, 'MP4-GALLERY.html'), html);
console.log(`MP4-GALLERY.html: ${totalCount} videos, ${human(totalBytes)} (${copied} file(s) newly copied).`);
