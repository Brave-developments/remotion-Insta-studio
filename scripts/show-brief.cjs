#!/usr/bin/env node
/**
 * Prints parsed bank briefs in a readable form so narration can be authored
 * against them.
 *
 *   node scripts/show-brief.cjs RETENTION 3 4 5
 *   node scripts/show-brief.cjs BUILD            # every entry
 */
const fs = require('fs');
const path = require('path');

const briefs = JSON.parse(fs.readFileSync(path.join(__dirname, 'season-content', 'bank-briefs.json'), 'utf8'));
const bank = (process.argv[2] || 'RETENTION').toUpperCase();
const picks = process.argv.slice(3).map(Number);
const list = briefs[bank] || [];
const BUILT = {RETENTION: [1, 9], UI: [1, 2], BUILD: [1, 5]};

for (const e of list) {
  if (picks.length && !picks.includes(e.n)) continue;
  const flag = BUILT[bank]?.includes(e.n) ? ' [BUILT]' : '';
  console.log(`\n### ${bank} #${e.n}${flag} — ${e.title}`);
  console.log(`HOOK: ${e.hook}`);
  if (e.core) console.log(`CORE: ${e.core}`);
  if (e.spine) console.log(`SPINE (${e.spine.split(/\s+/).length} words): ${e.spine}`);
  for (const b of e.beats) console.log(`  ${b.time} :: ${b.beat} :: ${b.visual}`);
}
