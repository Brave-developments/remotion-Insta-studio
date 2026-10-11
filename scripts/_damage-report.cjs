const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

// Files the migration's transformJson touched (from its log) + what should be there.
const suspects = [
  'studio-kit/audio-verification.json',
  'studio-kit/bank-status-RETENTION-LAB.json',
  'studio-kit/bank-status-UI-MOTION-LAB.json',
  'studio-kit/bank-status-BUILDMODE-LAB.json',
  'studio-kit/preview-verification.json',
  'studio-kit/render-week-status.json',
  'studio-kit/scene-review-catalog.json',
  'studio-kit/season-voiceover-status.json',
  'studio-kit/silent-render-batch-status.json',
  'studio-kit/voice-script-verification.json',
  'studio-kit/voiced-export-verification.json',
  'studio-kit/voiced-render-status.json',
  'studio-kit/voiced-scene-review-catalog.json',
  'studio-kit/voiceover-batch-status.json',
  'studio-kit/week-1-export-verification.json',
  'studio-kit/week-1-projects.json',
  'projects/TOMORROW-EXE/week-1/remotion-week.json',
  'projects/BUILDMode-AI/week-1/remotion-week.json',
  'projects/TOOLPROOF/week-1/remotion-week.json',
];

function shape(node, depth) {
  if (Array.isArray(node)) return `[array len=${node.length}${node.length && depth > 0 ? ' of ' + typeof node[0] : ''}]`;
  if (node && typeof node === 'object') {
    const out = {};
    for (const k of Object.keys(node)) out[k] = depth > 0 ? shape(node[k], depth - 1) : typeof node[k];
    return out;
  }
  return typeof node;
}

for (const rel of suspects) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) { console.log('MISSING FILE', rel); continue; }
  const j = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log('==', rel);
  console.log('  ', JSON.stringify(shape(j, 1)).slice(0, 400));
}

// Day-folder reel.json files: the reconstruction source for remotion-week reels.
for (const ch of ['TOMORROW-EXE', 'BUILDMode-AI', 'TOOLPROOF']) {
  const weekDir = path.join(root, 'projects', ch, 'week-1');
  const days = fs.readdirSync(weekDir).filter((d) => d.startsWith('day '));
  let ok = 0;
  let sampleKeys = null;
  for (const d of days) {
    const p = path.join(weekDir, d, 'reel.json');
    if (!fs.existsSync(p)) { console.log('  NO reel.json in', ch, d); continue; }
    const r = JSON.parse(fs.readFileSync(p, 'utf8'));
    if (!sampleKeys) sampleKeys = Object.keys(r);
    if (r.id && r.scenes && typeof r.durationSeconds === 'number') ok += 1;
    else console.log('  INCOMPLETE', ch, d, Object.keys(r));
  }
  console.log(`== ${ch}: ${ok}/${days.length} day reel.json usable; sample keys:`, JSON.stringify(sampleKeys));
}
