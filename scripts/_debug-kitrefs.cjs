const fs = require('fs');
const files = [
  'projects/TOMORROW-EXE/AGENTS.md',
  'projects/TOMORROW-EXE/README.md',
  'projects/TOOLPROOF/AGENTS.md',
  'projects/BUILDMode-AI/README.md',
];
for (const f of files) {
  const t = fs.readFileSync(f, 'utf8');
  const all = t.match(/(?:\.\.\/)+studio-kit[^\s)\\]*/g) || [];
  console.log(f, '->', JSON.stringify([...new Set(all)]));
}
const day = JSON.parse(fs.readFileSync('projects/TOMORROW-EXE/week-1/day 1/package.json', 'utf8'));
console.log('day1 render:', day.scripts.render);
const day72 = JSON.parse(fs.readFileSync('projects/TOOLPROOF/week-1/day 7.2/package.json', 'utf8'));
console.log('tp day7.2 render:', day72.scripts.render);
