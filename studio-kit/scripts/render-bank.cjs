const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {bundle} = require('@remotion/bundler');
const {openBrowser, selectComposition, renderMedia, renderStill} = require('@remotion/renderer');

const root = path.resolve(__dirname, '../..');
const args = process.argv.slice(2);
const projectArg = args.find((a) => a.startsWith('--project='))?.split('=')[1];
const idArg = args.find((a) => a.startsWith('--id='))?.split('=')[1];
const proof = args.includes('--proof');
// Render only reels whose voice-over already exists, so a bank can be rendered
// in waves while generate-season-voiceovers.cjs is still running.
const withAudio = args.includes('--with-audio');

if (!projectArg) {
  console.error('Usage: node ../studio-kit/scripts/render-bank.cjs --project=RETENTION-LAB [--id=R01-BUG-REPORT] [--proof]');
  process.exit(2);
}

const projectDir = path.join(root, 'projects', projectArg);
const project = JSON.parse(fs.readFileSync(path.join(projectDir, 'project.json'), 'utf8'));
const season = JSON.parse(fs.readFileSync(path.join(projectDir, 'season', 'reels.json'), 'utf8'));
const reels = season.reels.filter((r) => (!idArg || r.id === idArg) && (!withAudio || r.audio));
if (!reels.length) {
  console.error(`No reel matched ${idArg || '(all)'}${withAudio ? ' with audio' : ''}`);
  process.exit(2);
}

const outDir = path.join(projectDir, 'out');
fs.mkdirSync(outDir, {recursive: true});
const statePath = path.join(root, 'studio-kit', `bank-status-${projectArg}.json`);
const state = {
  startedAt: new Date().toISOString(),
  project: projectArg,
  mode: proof ? 'proof' : 'full',
  quality: '1080x1920 / 30fps / H.264 CRF 18',
  completed: 0,
  total: reels.length,
  reels: {},
};
const save = () => fs.writeFileSync(statePath, JSON.stringify({...state, updatedAt: new Date().toISOString()}, null, 2) + '\n');

const browserCandidates = [
  path.join(root, 'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'),
  path.join(projectDir, 'node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe'),
];
const browserExecutable = browserCandidates.find((p) => fs.existsSync(p));

const hash = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');

function validate(reel) {
  if (!reel.scenes.length) throw new Error(`${reel.id}: no scenes`);
  for (const scene of reel.scenes) {
    if (/\[[^\]]+\]/.test(scene.text + scene.narration)) throw new Error(`${reel.id}/${scene.id}: unresolved placeholder`);
    if (scene.end <= scene.start) throw new Error(`${reel.id}/${scene.id}: empty scene`);
  }
  if (reel.audio && !fs.existsSync(path.join(projectDir, 'public', reel.audio))) {
    throw new Error(`${reel.id}: audio ${reel.audio} missing from public/`);
  }
}

async function main() {
  save();
  const serveUrl = await bundle({
    entryPoint: path.join(projectDir, 'src', 'index.ts'),
    rootDir: projectDir,
    publicDir: path.join(projectDir, 'public'),
    outDir: path.join(projectDir, '.render-cache'),
    enableCaching: true,
  });
  const browser = await openBrowser('chrome', {browserExecutable, logLevel: 'error'});
  try {
    for (const reel of reels) {
      validate(reel);
      const output = path.join(outDir, `${reel.id}${proof ? ' - proof' : ''}.mp4`);
      const signature = hash({
        reel,
        project,
        kit: fs.readFileSync(path.join(root, 'reels-kit', 'src', 'player.tsx'), 'utf8'),
        components: fs.readFileSync(path.join(root, 'reels-kit', 'src', 'components.tsx'), 'utf8'),
        proof,
      });
      const receiptPath = `${output}.json`;
      if (fs.existsSync(output) && fs.existsSync(receiptPath)) {
        const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
        if (receipt.signature === signature) {
          state.reels[reel.id] = {status: 'verified-cache', output};
          state.completed += 1;
          save();
          console.log(`${reel.id}: verified cache`);
          continue;
        }
      }
      state.reels[reel.id] = {status: 'rendering', output, progress: 0};
      save();
      console.log(`${reel.id}: rendering ${reel.durationSeconds}s`);
      const inputProps = {project, reel};
      const composition = await selectComposition({serveUrl, id: reel.id, inputProps, puppeteerInstance: browser, logLevel: 'error'});
      const frameRange = proof ? [0, Math.min(89, composition.durationInFrames - 1)] : undefined;
      let last = 0;
      await renderMedia({
        serveUrl,
        composition,
        inputProps,
        codec: 'h264',
        outputLocation: output,
        crf: 18,
        imageFormat: 'png',
        pixelFormat: 'yuv420p',
        concurrency: 2,
        puppeteerInstance: browser,
        logLevel: 'error',
        overwrite: true,
        frameRange,
        onProgress: (p) => {
          if (Date.now() - last > 5000) {
            state.reels[reel.id].progress = Number(p.progress.toFixed(3));
            save();
            last = Date.now();
          }
        },
      });
      await renderStill({
        serveUrl,
        composition,
        inputProps,
        output: path.join(outDir, `${reel.id}.png`),
        frame: Math.round(reel.durationSeconds * 30 * 0.55),
        imageFormat: 'png',
        puppeteerInstance: browser,
        logLevel: 'error',
      });
      fs.writeFileSync(
        receiptPath,
        JSON.stringify({signature, id: reel.id, title: reel.title, audio: reel.audio, renderedAt: new Date().toISOString()}, null, 2) + '\n',
      );
      state.reels[reel.id] = {status: 'complete', output, progress: 1};
      state.completed += 1;
      save();
      console.log(`${reel.id}: complete`);
    }
    state.status = 'complete';
    save();
    console.log(`PASS: ${state.completed}/${state.total} reels rendered for ${projectArg}.`);
  } finally {
    await browser.close({silent: true});
  }
}

main().catch((error) => {
  state.status = 'failed';
  state.error = error.stack || String(error);
  save();
  console.error(error.message);
  process.exitCode = 1;
});
