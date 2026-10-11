const fs = require('fs');
const ts = require('typescript');
const source = fs.readFileSync('src/data/ai-agent-scenes.ts', 'utf8');
const js = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.CommonJS}}).outputText;
const mod = {exports: {}};
new Function('exports', 'require', js)(mod.exports, require);
let start = 0;
const concepts = [
 'Oversized AI letters dissolve into a six-tool agent network',
 'Chat messages remain inside a conversation window; the action stops',
 'Central agent connects Browser, Code, Mail, Calendar, Docs and Data',
 'A traced route carries a goal through planning to a completed outcome',
 'Cursor focuses a task input, types a laptop research goal and clicks Run',
 'Original laptop artwork becomes a budget comparison and completed shortlist',
 'Moving signal traces show the shift from concept to action',
 'An animated observe-plan-act-continue loop depicts always-on agents',
 'A connected workspace updates notes, a document and a calendar',
 'Parallel model/tool/workflow signals move toward action',
 'An answer window recedes as a progress ring resolves into a checkmark',
 'Code typing, research, email, document, calendar, data bars and software control',
 'Ten app icons converge into one agent and one request',
 'The agent mark and expanding orbital rings introduce the agent era'
];
const scenes = mod.exports.scenes.map((scene, i) => {
 const end = start + scene.duration;
 const result = {...scene, start, end, concept: concepts[i], assets: ['original React/SVG artwork'], transitionOut: ['pull-back','track-left','push-in','track-up','push-in','track-left','pull-back','track-left','track-up','pull-back','track-left','push-in','pull-back','hold'][i], timingSource: 'editorial script timing; audio deferred'};
 start = end;
 return result;
});
fs.writeFileSync('public/scene-data.json', JSON.stringify({width:1080,height:1920,fps:30,duration:start,audio:null,scenes}, null, 2));
fs.writeFileSync('public/script-timing.json', JSON.stringify({timingSource:'Estimated editorial pacing. Not transcribed from audio.', sentences:scenes.map(s=>({start:s.start,end:s.end,text:s.narration,captionChunks:s.captions.map(c=>({...c,start:c.start+s.start,end:c.end+s.start}))}))},null,2));
fs.writeFileSync('SCENE_PLAN.md', '# AI Agent Era — visual scene plan\n\nSilent 60-second editorial version. All artwork is authored in React/SVG; laptop specifications and workspace interfaces are illustrative. Caption emphasis follows estimated script pacing, not speech timestamps.\n\n' + scenes.map((s,i)=>`${i+1}. **${s.start.toFixed(1)}–${s.end.toFixed(1)}s / ${s.type}** — ${s.concept}`).join('\n\n'));

