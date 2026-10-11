const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
for (const folder of ['TOMORROW-EXE']) {
  const projectDir = path.join(root, 'projects', folder);
  console.log('projectDir exists:', fs.existsSync(projectDir));
  for (const name of ['README.md', 'AGENTS.md']) {
    const rel = path.join('projects', folder, name);
    const file = path.join(root, rel);
    console.log(name, 'exists:', fs.existsSync(file), file);
    if (!fs.existsSync(file)) continue;
    let text = fs.readFileSync(file, 'utf8');
    const parts = text.split('../../../studio-kit');
    console.log('  split parts:', parts.length);
    text = text.split('../../../studio-kit').join('../../studio-kit');
    const next = text.replace(/(?<!\/)\.\.\/studio-kit/g, '../../studio-kit');
    console.log('  would change:', next !== text, '| has3 after split:', text.includes('../../../studio-kit'), '| has2:', text.includes('../../studio-kit'));
  }
}
