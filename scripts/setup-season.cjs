#!/usr/bin/env node
/**
 * Scaffolds the three storyboard projects and builds each bank's reel data.
 *
 *   node scripts/setup-season.cjs
 *
 * Writes, per project:
 *   package.json  tsconfig.json  remotion.config.ts  project.json
 *   src/index.ts  src/Root.tsx   season/reels.json   public/audio  out  README.md
 *
 * season/reels.json is GENERATED from season/source.json — edit source.json,
 * never reels.json. Captions are derived from each scene's narration so the
 * 3–7 word chunks always match what is spoken.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const PROJECTS = [
  {
    dir: 'RETENTION-LAB',
    slug: 'retention-lab',
    name: 'RETENTION LAB',
    position: 'Retention analytics, story structure and hook craft.',
    bank: 'story board/README_60_REMOTION_REELS (1).md',
    port: 3024,
    palette: {background: '#07070B', panel: '#12121A', accent: '#8B7CFF', secondary: '#C4B5FD', text: '#FFFFFF', muted: '#9AA0AE'},
  },
  {
    dir: 'UI-MOTION-LAB',
    slug: 'ui-motion-lab',
    name: 'UI MOTION LAB',
    position: 'Interface problems demonstrated, then rebuilt on screen.',
    bank: 'story board/README_UI_MOTION_45S (1).md',
    port: 3025,
    palette: {background: '#05090A', panel: '#0E1518', accent: '#2DD4BF', secondary: '#7DD3FC', text: '#FFFFFF', muted: '#93A3A8'},
  },
  {
    dir: 'BUILDMODE-LAB',
    slug: 'buildmode-lab',
    name: 'BUILD MODE LAB',
    position: 'AI coding systems, verification and real build evidence.',
    bank: 'story board/BUILDMode_AI_45s_Storyboards_README (1).md',
    port: 3026,
    palette: {background: '#060A07', panel: '#0F1611', accent: '#4ADE80', secondary: '#A3E635', text: '#FFFFFF', muted: '#96A69A'},
  },
];

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, content);
  console.log('wrote', path.relative(root, file));
};

/** Split a narration into 3–7 word chunks with emphasis on the longest word. */
function chunk(narration) {
  const words = narration.split(/\s+/).filter(Boolean);
  const groups = [];
  let index = 0;
  while (index < words.length) {
    const take = Math.min(words.length - index, 4 + (groups.length % 3));
    groups.push(words.slice(index, index + take));
    index += take;
  }
  return groups;
}

function buildCaptions(scenes) {
  const captions = [];
  for (const scene of scenes) {
    const words = String(scene.narration || '').split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    const groups = chunk(scene.narration);
    const total = words.length;
    let cursor = 0;
    for (const group of groups) {
      const start = scene.start + ((scene.end - scene.start) * cursor) / total;
      cursor += group.length;
      const end = scene.start + ((scene.end - scene.start) * cursor) / total;
      const emphasis = group.reduce((best, w) => (w.replace(/[^\w]/g, '').length > best.replace(/[^\w]/g, '').length ? w : best), group[0]);
      captions.push({text: group.join(' '), start: round2(start), end: round2(end), emphasis: emphasis.replace(/[^\w]/g, '')});
    }
  }
  return captions;
}

const round2 = (n) => Math.round(n * 100) / 100;

function scaffold(project) {
  const dir = path.join(root, 'projects', project.dir);

  write(
    path.join(dir, 'package.json'),
    JSON.stringify(
      {
        name: project.slug,
        version: '1.0.0',
        private: true,
        scripts: {
          start: `remotion studio src/index.ts --port=${project.port}`,
          typecheck: 'tsc --noEmit',
          'render:bank': `node ../../studio-kit/scripts/render-bank.cjs --project=${project.dir}`,
        },
        dependencies: {'@remotion/cli': '4.0.532', remotion: '4.0.532', react: '19.1.1', 'react-dom': '19.1.1'},
        devDependencies: {'@types/react': '19.1.10', '@types/react-dom': '19.1.7', typescript: '5.9.2'},
      },
      null,
      2,
    ) + '\n',
  );

  write(
    path.join(dir, 'tsconfig.json'),
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          skipLibCheck: true,
          resolveJsonModule: true,
          allowSyntheticDefaultImports: true,
          esModuleInterop: true,
          noEmit: true,
        },
        include: ['src', '../../reels-kit/src', 'remotion.config.ts'],
      },
      null,
      2,
    ) + '\n',
  );

  write(
    path.join(dir, 'remotion.config.ts'),
    `import {Config} from '@remotion/cli/config';\n\nConfig.setEntryPoint('./src/index.ts');\nConfig.setVideoImageFormat('jpeg');\nConfig.setOverwriteOutput(true);\n`,
  );

  write(path.join(dir, 'src', 'index.ts'), `import {registerRoot} from 'remotion';\nimport {Root} from './Root';\nregisterRoot(Root);\n`);

  write(
    path.join(dir, 'src', 'Root.tsx'),
    `import {SeasonCompositions} from '../../../reels-kit/src/player';\nimport type {Project, Reel} from '../../../reels-kit/src/types';\nimport project from '../project.json';\nimport season from '../season/reels.json';\n\nexport const Root = () => (\n  <SeasonCompositions project={project as Project} reels={season.reels as Reel[]} />\n);\n`,
  );

  write(
    path.join(dir, 'project.json'),
    JSON.stringify({name: project.name, position: project.position, bank: project.bank, port: project.port, palette: project.palette, fontFamily: 'Inter, Segoe UI, sans-serif'}, null, 2) + '\n',
  );

  fs.mkdirSync(path.join(dir, 'public', 'audio'), {recursive: true});
  fs.mkdirSync(path.join(dir, 'out'), {recursive: true});
}

function buildReels(project) {
  const dir = path.join(root, 'projects', project.dir);
  const sourcePath = path.join(dir, 'season', 'source.json');
  if (!fs.existsSync(sourcePath)) {
    console.log(`! ${project.dir}/season/source.json missing — scaffold only`);
    return;
  }
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const reels = source.reels.map((reel) => {
    const scenes = reel.scenes.map((s) => ({...s}));
    const nominal = Math.max(...scenes.map((s) => s.end));
    // Once the voice-over exists, the recording is the master: scale every
    // scene boundary to the measured audio length instead of forcing the
    // storyboard's nominal duration.
    let durationSeconds = nominal;
    if (typeof reel.audioSeconds === 'number' && reel.audioSeconds > 0) {
      const factor = reel.audioSeconds / nominal;
      for (const scene of scenes) {
        scene.start = round2(scene.start * factor);
        scene.end = round2(scene.end * factor);
      }
      durationSeconds = round2(reel.audioSeconds);
      console.log(`  ${reel.id}: refit ${nominal}s -> ${durationSeconds}s (measured audio)`);
    }
    const captions = buildCaptions(scenes);
    const overlaps = captions.some((c, i) => i > 0 && c.start < captions[i - 1].end - 0.001);
    if (overlaps) throw new Error(`${reel.id}: caption overlap`);
    return {
      id: reel.id,
      title: reel.title,
      bank: project.bank,
      format: reel.format || 'vertical-reel',
      durationSeconds,
      productionReady: false,
      audio: reel.audio ?? null,
      timingSource: 'Editorial timing authored from the supplied storyboard. Not transcribed from a recording.',
      scenes,
      captions,
    };
  });
  const ids = new Set();
  for (const reel of reels) {
    if (ids.has(reel.id)) throw new Error(`duplicate reel id ${reel.id}`);
    ids.add(reel.id);
    let previous = 0;
    for (const scene of reel.scenes) {
      if (scene.start < previous - 0.001) throw new Error(`${reel.id}/${scene.id}: scenes out of order`);
      if (scene.end <= scene.start) throw new Error(`${reel.id}/${scene.id}: empty scene`);
      previous = scene.end;
    }
  }
  write(path.join(dir, 'season', 'reels.json'), JSON.stringify({reels}, null, 2) + '\n');
  console.log(`  ${reels.length} reel(s), ${reels.reduce((n, r) => n + r.scenes.length, 0)} scenes, ${reels.reduce((n, r) => n + r.captions.length, 0)} captions`);
}

for (const project of PROJECTS) {
  console.log(`\n=== ${project.dir}`);
  scaffold(project);
  buildReels(project);
}

console.log('\nDone. Then: typecheck each project, generate voice-overs, render.');
