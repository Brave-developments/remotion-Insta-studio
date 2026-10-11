#!/usr/bin/env node
/**
 * One-shot migration: project folders now live under projects/.
 *
 *   node scripts/migrate-projects-folder.cjs
 *
 * Run AFTER moving the folders (the script creates projects/ and moves them
 * itself if they are still at the root). It then rewrites every reference:
 *   - pipeline scripts (path joins gain a 'projects' segment)
 *   - project internals (Root.tsx kit imports, tsconfig include, package.json
 *     render scripts, week-1 day package scripts)
 *   - state JSONs (studio-kit/*.json + week-1 voiceover.json file fields)
 *   - docs and the stats dashboard
 *
 * Idempotent: a pair whose replacement already exists is skipped; a pair that
 * matches nothing at all is reported so a missed reference cannot hide.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const projectsRoot = path.join(root, 'projects');
const FOLDERS = [
  'BUILDMode-AI',
  'BUILDMODE-LAB',
  'my Ui ideas',
  'PROMO VIDEO',
  'remotion-ai-agent-reel',
  'RETENTION-LAB',
  'TOMORROW-EXE',
  'TOOLPROOF',
  'UI-MOTION-LAB',
];

let edits = 0;
let moves = 0;
const missing = [];

/** Replace each [old, new] pair in a file; idempotent. quiet = tree walks
 *  where most files legitimately do not contain the pattern. */
function editFile(rel, pairs, quiet) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) {
    if (!quiet) missing.push(`${rel}: FILE MISSING`);
    return;
  }
  let text = fs.readFileSync(file, 'utf8');
  const before = text;
  for (const [oldStr, newStr] of pairs) {
    if (text.includes(newStr) && !text.includes(oldStr)) continue; // already done
    if (!text.includes(oldStr)) {
      if (!quiet) missing.push(`${rel}: no match for ${JSON.stringify(oldStr.slice(0, 90))}`);
      continue;
    }
    text = text.split(oldStr).join(newStr);
  }
  if (text !== before) {
    fs.writeFileSync(file, text);
    edits += 1;
    console.log('edited', rel);
  }
}

/** Apply string replacements to every file under dir matching ext. */
function editTree(dir, exts, pairs, only) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'out' || entry.name === '.render-cache') continue;
      editTree(full, exts, pairs, only);
    } else if (exts.includes(path.extname(entry.name)) && (!only || only(entry.name))) {
      editFile(path.relative(root, full), pairs, true);
    }
  }
}

// ---------------------------------------------------------------- Part 0: move
if (!fs.existsSync(projectsRoot)) fs.mkdirSync(projectsRoot);
for (const folder of FOLDERS) {
  const from = path.join(root, folder);
  const to = path.join(projectsRoot, folder);
  if (fs.existsSync(from) && !fs.existsSync(to)) {
    fs.renameSync(from, to);
    moves += 1;
    console.log('moved  ', folder, '-> projects/');
  }
}

// ---------------------------------------------------------------- Part 1: scripts
const scriptEdits = {
  'studio-kit/scripts/render-bank.cjs': [
    ["const projectDir = path.join(root, projectArg);", "const projectDir = path.join(root, 'projects', projectArg);"],
  ],
  'studio-kit/scripts/render-week.cjs': [
    ["...folders.map(f=>path.join(root,f,'node_modules", "...folders.map(f=>path.join(root,'projects',f,'node_modules"],
    ["path.join(root,reel.channelFolder,'public',scene.asset)", "path.join(root,'projects',reel.channelFolder,'public',scene.asset)"],
    ["const project=path.join(root,folder);", "const project=path.join(root,'projects',folder);"],
  ],
  'scripts/generate-season-voiceovers.cjs': [
    ["const dir = path.join(root, project);", "const dir = path.join(root, 'projects', project);"],
    ["const sourcePath = path.join(root, item.project, 'season', 'source.json');", "const sourcePath = path.join(root, 'projects', item.project, 'season', 'source.json');"],
  ],
  'scripts/render-waves.cjs': [
    ["const dir = path.join(root, project, 'out');", "const dir = path.join(root, 'projects', project, 'out');"],
  ],
  'scripts/season-schedule.cjs': [
    ["path.join(root, project, 'season', 'reels.json')", "path.join(root, 'projects', project, 'season', 'reels.json')"],
    ["const out = path.join(root, project, 'out');", "const out = path.join(root, 'projects', project, 'out');"],
  ],
  'scripts/stats-server.cjs': [
    ["readJson(path.join(root, dir, 'project.json'), {})", "readJson(path.join(root, 'projects', dir, 'project.json'), {})"],
    ["readJson(path.join(root, dir, 'season', 'reels.json')", "readJson(path.join(root, 'projects', dir, 'season', 'reels.json')"],
    ["const outDir = path.join(root, dir, 'out');", "const outDir = path.join(root, 'projects', dir, 'out');"],
  ],
  'SEASON-STATS.html': [
    ["const fileUrl = (lab, rel) => '/files/' + lab + '/'", "const fileUrl = (lab, rel) => '/files/projects/' + lab + '/'"],
  ],
  'scripts/setup-season.cjs': [
    ["'render:bank': `node ../studio-kit/scripts/render-bank.cjs --project=${project.dir}`,", "'render:bank': `node ../../studio-kit/scripts/render-bank.cjs --project=${project.dir}`,"],
    ["include: ['src', '../reels-kit/src', 'remotion.config.ts'],", "include: ['src', '../../reels-kit/src', 'remotion.config.ts'],"],
    ["from '../../reels-kit/src/player'", "from '../../../reels-kit/src/player'"],
    ["from '../../reels-kit/src/types'", "from '../../../reels-kit/src/types'"],
    ["const dir = path.join(root, project.dir);", "const dir = path.join(root, 'projects', project.dir);"],
  ],
  'scripts/author-season.cjs': [
    ["path.join(root, bank.dir, 'season', 'source.json')", "path.join(root, 'projects', bank.dir, 'season', 'source.json')"],
    ["fs.existsSync(path.join(root, bank.dir, 'public', before.audio))", "fs.existsSync(path.join(root, 'projects', bank.dir, 'public', before.audio))"],
  ],
  'scripts/check-season.mjs': [
    ["path.resolve(p, 'season', 'reels.json')", "path.resolve('projects', p, 'season', 'reels.json')"],
    ["path.resolve(p, 'project.json')", "path.resolve('projects', p, 'project.json')"],
  ],
  'scripts/probe-season.mjs': [
    ["path.join(project, 'season', 'reels.json')", "path.join('projects', project, 'season', 'reels.json')"],
    ["path.join(project, 'out', `${reel.id}.mp4`)", "path.join('projects', project, 'out', `${reel.id}.mp4`)"],
  ],
  'scripts/extract-season-frames.mjs': [
    ["path.join(project, 'season', 'reels.json')", "path.join('projects', project, 'season', 'reels.json')"],
    ["path.join(project, 'out', `${reel.id}.mp4`)", "path.join('projects', project, 'out', `${reel.id}.mp4`)"],
  ],
  'scripts/generate-voiceovers.cjs': [
    ["path.join(root, item.channel, 'public/audio'", "path.join(root, 'projects', item.channel, 'public/audio'"],
  ],
  'scripts/export-voice-scripts.cjs': [
    ["path.join(root, item.channel, 'week-1', 'voice-scripts')", "path.join(root, 'projects', item.channel, 'week-1', 'voice-scripts')"],
    ["path.join(root, channel, 'week-1/VOICE-SCRIPTS.txt')", "path.join(root, 'projects', channel, 'week-1/VOICE-SCRIPTS.txt')"],
  ],
  'scripts/package-week-one.cjs': [
    ["const project=path.join(root,folder);", "const project=path.join(root,'projects',folder);"],
    ["output:`${folder}/out/week-1/${name}.mp4`", "output:`projects/${folder}/out/week-1/${name}.mp4`"],
  ],
  'scripts/prepare-week-one-capture.cjs': [
    ["const project=path.join(root,folder);", "const project=path.join(root,'projects',folder);"],
  ],
  'scripts/finish-week-one.cjs': [
    ["],path.join(root,folder));", "],path.join(root,'projects',folder));"],
  ],
  'scripts/validate-week-one.cjs': [
    ["const dir=path.join(root,folder,'week-1');", "const dir=path.join(root,'projects',folder,'week-1');"],
    ["path.join(root,folder,'src/Root.tsx')", "path.join(root,'projects',folder,'src/Root.tsx')"],
  ],
  'scripts/develop-week-one.cjs': [
    ["dir=path.join(root,def.folder,'week-1')", "dir=path.join(root,'projects',def.folder,'week-1')"],
    ["rootFile=path.join(root,def.folder,'src','Root.tsx')", "rootFile=path.join(root,'projects',def.folder,'src','Root.tsx')"],
    ["readme=path.join(root,def.folder,'README.md')", "readme=path.join(root,'projects',def.folder,'README.md')"],
  ],
  'scripts/build-toolproof-visuals.cjs': [
    ["path.join(root,'TOOLPROOF/week-1/remotion-week.json')", "path.join(root,'projects/TOOLPROOF/week-1/remotion-week.json')"],
    ["path.join(root,'TOOLPROOF/week-1/VISUAL_BUILD.md')", "path.join(root,'projects/TOOLPROOF/week-1/VISUAL_BUILD.md')"],
  ],
  'scripts/refine-channel-plans.cjs': [
    ["const file=def.folder+'/content/week-01.json';", "const file='projects/'+def.folder+'/content/week-01.json';"],
    ["const profile=JSON.parse(fs.readFileSync(def.folder+'/channel.json','utf8'));", "const profile=JSON.parse(fs.readFileSync('projects/'+def.folder+'/channel.json','utf8'));"],
    ["fs.writeFileSync(def.folder+'/channel.json'", "fs.writeFileSync('projects/'+def.folder+'/channel.json'"],
    ["const brief=def.folder+'/content/reels/'+reel.id+'.md';", "const brief='projects/'+def.folder+'/content/reels/'+reel.id+'.md';"],
  ],
  'scripts/setup-channel-workspaces.cjs': [
    // Route every write whose target is a channel folder into projects/.
    ["const write = (file, text) => {const target=path.join(root,file);",
     "const PROJECT_FOLDERS = defs.map(d => d.folder);\nconst write = (file, text) => {const routed = PROJECT_FOLDERS.some(f => file === f || file.startsWith(f + '/')) ? 'projects/' + file : file;const target=path.join(root,routed);"],
    ["if(fs.existsSync(path.join(root,d.folder))) throw", "if(fs.existsSync(path.join(root,'projects',d.folder))) throw"],
    ["path.join(root,'remotion-ai-agent-reel/src/components'", "path.join(root,'projects/remotion-ai-agent-reel/src/components'"],
    ["'render:reel':'node ../studio-kit/scripts/render-reel.cjs'", "'render:reel':'node ../../studio-kit/scripts/render-reel.cjs'"],
    ["include:['src','../studio-kit/src','remotion.config.ts']", "include:['src','../../studio-kit/src','remotion.config.ts']"],
    ["from '../../studio-kit/src/Engine'", "from '../../../studio-kit/src/Engine'"],
    ["from '../../studio-kit/src/types'", "from '../../../studio-kit/src/types'"],
    ["Keep ../studio-kit alongside this project.", "Keep ../../studio-kit alongside this project."],
    ["and ../studio-kit/PRODUCTION_RULES.md before", "and ../../studio-kit/PRODUCTION_RULES.md before"],
    ["Read ../studio-kit/PRODUCTION_RULES.md and content/CHANNEL_BRIEF.md.", "Read ../../studio-kit/PRODUCTION_RULES.md and content/CHANNEL_BRIEF.md."],
    ["(${d.folder}/README.md)", "(projects/${d.folder}/README.md)"],
  ],
  'scripts/verify-week-one-exports.py': [
    ["review=root/item['channel']/'out/week-1/review'", "review=root/'projects'/item['channel']/'out/week-1/review'"],
  ],
  'scripts/verify-voiced-exports.py': [
    ["video=root/item['channel']/'out/week-1/voiced'", "video=root/'projects'/item['channel']/'out/week-1/voiced'"],
  ],
  'scripts/review-week-one.py': [
    ["video = root / name / 'out/d01r1-draft-sample.mp4'", "video = root / 'projects' / name / 'out/d01r1-draft-sample.mp4'"],
    ["still = root / name / 'out/week-1-feed-check.png'", "still = root / 'projects' / name / 'out/week-1-feed-check.png'"],
  ],
  'scripts/review-channel-previews.py': [
    ["video=root/name/'out'/'channel-preview.mp4'", "video=root/'projects'/name/'out'/'channel-preview.mp4'"],
    ["poster=root/name/'out'/'poster.png'", "poster=root/'projects'/name/'out'/'poster.png'"],
  ],
  'scripts/review-all-reels.py': [
    ["edition=root/channel/('out/week-1/voiced' if voiced else 'out/week-1')", "edition=root/'projects'/channel/('out/week-1/voiced' if voiced else 'out/week-1')"],
  ],
};
for (const [rel, pairs] of Object.entries(scriptEdits)) editFile(rel, pairs);

// ---------------------------------------------------------------- Part 2: project internals
for (const folder of FOLDERS) {
  const projectDir = path.join(projectsRoot, folder);
  if (!fs.existsSync(projectDir)) continue;
  // package.json render scripts: node ../studio-kit/ -> ../../studio-kit/
  editFile(path.join('projects', folder, 'package.json'), [
    ['node ../studio-kit/', 'node ../../studio-kit/'],
  ], true);
  // tsconfig include of the shared kit
  editFile(path.join('projects', folder, 'tsconfig.json'), [
    ['"../reels-kit/src"', '"../../reels-kit/src"'],
    ['"../studio-kit/src"', '"../../studio-kit/src"'],
  ], true);
  // Root.tsx (and any src file) imports of the shared kit gain one level
  editTree(path.join(projectDir, 'src'), ['.ts', '.tsx'], [
    ["'../../reels-kit/", "'../../../reels-kit/"],
    ['"../../reels-kit/', '"../../../reels-kit/'],
    ["'../../studio-kit/", "'../../../studio-kit/"],
    ['"../../studio-kit/', '"../../../studio-kit/'],
  ]);
  // week-1 day packages: ../../../studio-kit -> ../../../../studio-kit
  // \" anchors the escaped quote in package.json so an already-fixed 4x path
  // can never match the 3x pattern and gain a fifth level on re-run.
  editTree(path.join(projectDir, 'week-1'), ['.json'], [
    ['\\"../../../../../studio-kit/', '\\"../../../../studio-kit/'], // repair double-run
    ['\\"../../../studio-kit/', '\\"../../../../studio-kit/'],
  ]);
  // prose that points at the shared kit from inside a project
  for (const name of ['README.md', 'AGENTS.md']) {
    const rel = path.join('projects', folder, name);
    const file = path.join(root, rel);
    if (!fs.existsSync(file)) continue;
    const original = fs.readFileSync(file, 'utf8');
    // repair an earlier double-run, then normalise a single ../studio-kit
    let text = original.split('../../../studio-kit').join('../../studio-kit');
    const next = text.replace(/(?<!\/)\.\.\/studio-kit/g, '../../studio-kit');
    if (next !== original) {
      fs.writeFileSync(file, next);
      edits += 1;
      console.log('edited', rel);
    }
  }
}

// ---------------------------------------------------------------- Part 3: state JSONs (values only)
function transformValue(v) {
  if (typeof v !== 'string') return v;
  for (const f of FOLDERS) {
    if (v.startsWith(f + '/')) return 'projects/' + v;
    if (v.startsWith(f + '\\')) return 'projects\\' + v;
    if (v.includes(`remotion video\\${f}\\`)) return v.split(`remotion video\\${f}\\`).join(`remotion video\\projects\\${f}\\`);
    if (v.includes(`remotion video/${f}/`)) return v.split(`remotion video/${f}/`).join(`remotion video/projects/${f}/`);
  }
  return v;
}
function transformJson(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) return;
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  let changed = false;
  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return node;
    }
    if (node && typeof node === 'object') {
      for (const key of Object.keys(node)) {
        const before = node[key];
        const after = typeof before === 'string' ? transformValue(before) : walk(before);
        if (after !== before) {
          node[key] = after;
          changed = true;
        }
      }
    }
    return node;
  };
  walk(parsed);
  if (changed) {
    fs.writeFileSync(file, JSON.stringify(parsed, null, 2) + '\n');
    edits += 1;
    console.log('edited', rel);
  }
}
for (const name of fs.readdirSync(path.join(root, 'studio-kit'))) {
  if (name.endsWith('.json')) transformJson(path.join('studio-kit', name));
}
for (const folder of FOLDERS) {
  const weekDir = path.join(projectsRoot, folder, 'week-1');
  if (!fs.existsSync(weekDir)) continue;
  transformJson(path.join('projects', folder, 'week-1', 'remotion-week.json'));
  const walkWeek = (dir) => {
    for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkWeek(full);
      else if (entry.name === 'voiceover.json') transformJson(path.relative(root, full));
    }
  };
  walkWeek(weekDir);
}

// ---------------------------------------------------------------- Part 4: docs
const docEdits = {
  'CHANNELS.md': ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF'].map((f) => [`](${f}/`, `](projects/${f}/`]),
  'WEEK-1.md': ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF'].map((f) => [`](${f}/`, `](projects/${f}/`]),
  'SEASON.md': [
    ['](RETENTION-LAB)', '](projects/RETENTION-LAB)'],
    ['](UI-MOTION-LAB)', '](projects/UI-MOTION-LAB)'],
    ['](BUILDMODE-LAB)', '](projects/BUILDMODE-LAB)'],
    ['cd RETENTION-LAB &&', 'cd projects/RETENTION-LAB &&'],
  ],
  'WEEK-1-PROJECTS.md': ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF'].map((f) =>
    [`(<${f}/`, `(<projects/${f}/`],
  ),
  'VOICEOVER-AUTOMATION.md': ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF'].map((f) =>
    [`- ${f}/public/audio`, `- projects/${f}/public/audio`],
  ),
};
for (const [rel, pairs] of Object.entries(docEdits)) editFile(rel, pairs);

// ---------------------------------------------------------------- report
console.log(`\n${moves} folder(s) moved, ${edits} file(s) edited.`);
if (missing.length) {
  console.error('\nMISSED REFERENCES (fix or re-run):');
  for (const line of missing) console.error('  ' + line);
  process.exit(1);
}
console.log('all references updated.');
