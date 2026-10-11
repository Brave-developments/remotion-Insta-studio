const path=require('path');
const {spawnSync}=require('child_process');
const root=path.resolve(__dirname,'..');
function run(executable,args){const result=spawnSync(executable,args,{cwd:root,stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)throw new Error('Stage failed: '+args[0]);}
run(process.execPath,['studio-kit/scripts/render-week.cjs','--voiced']);
const python='C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe';
run(python,['scripts/verify-voiced-exports.py']);
run(python,['scripts/review-all-reels.py','--voiced']);
run(process.execPath,['scripts/make-reel-gallery.cjs']);
console.log('All 42 voiced exports verified; visual review sheets ready.');
