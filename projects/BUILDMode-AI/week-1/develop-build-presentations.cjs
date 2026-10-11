const fs=require('fs');
const path=require('path');
const dataPath=path.join(__dirname,'remotion-week.json');
const data=JSON.parse(fs.readFileSync(dataPath,'utf8'));
const editions={
 D01R1:[
 ['3 CODERS. 5 BUGS.','Three AI coders. One deliberately broken app. Here is the test I would run before trusting any of them.'],
 ['ONE FROZEN BASELINE','Five reproducible faults: login, capitalized search, mobile navigation, a disconnected Save button, and one failing test.'],
 ['SAME PROMPT. CLEAN COPIES.','Each tool gets a separate clean copy, the same prompt, and the same limit. Every intervention goes into the log.'],
 ['CLAIMS ARE NOT FIXES','A confident summary earns nothing. Login has to work. Search has to match. The saved data has to survive.'],
 ['VERIFY BEFORE SCORING','The scoreboard stays empty until the actual acceptance checks run. Count fixes and regressions separately.'],
 ['CHOOSE THE THIRD CODER','This is the experiment design, not a recorded model race. Which three coders deserve the first round?']],
 D01R2:[
 ['ONE IMAGE → ONE INTERFACE','Could one screenshot become a working interface? Start with this original dashboard, then freeze the reference.'],
 ['BUILD THE STRUCTURE','The image needs a sidebar, two summary cards, a chart, and a working primary action. No design file required.'],
 ['FIND THE BIGGEST MISMATCH','Inspect the first attempt at the same viewport. Look for the largest spacing, typography, or alignment mistake.'],
 ['ONE CORRECTION ONLY','Allow one correction aimed at that visible error. Keep the first attempt so the change remains reviewable.'],
 ['COMPARE. THEN CLICK.','A screenshot match is only half the job. Compare the final layout, then click the main action to verify behavior.'],
 ['WOULD YOU NOTICE?','This is an original interface study for the coming test. What difference would you notice first?']],
 D02R1:[
 ['CAN IT ACTUALLY FINISH?','A browser agent should finish the task, not quietly hand it back. Here is a concrete way to check.'],
 ['5 PROJECTS. SOURCED ROWS.','Research these five repositories. Collect stars, license, language, and latest default-branch update with source links.'],
 ['LOG EVERY HANDOFF','The agent must browse the actual pages. Record blocked access, recovery, and every moment a person steps in.'],
 ['AUDIT EVERY FIELD','Check the source behind every value. Last release and latest commit are different things; the table must be precise.'],
 ['AUTONOMY NEEDS EVIDENCE','Judge correct fields, usable output, and interventions together. No filled-in score until the recorded run exists.'],
 ['AGENT OR ASSISTANT?','This edition shows the task and audit plan. What browser job would make you trust an agent?']],
 D02R2:[
 ['A SHORT BRIEF → KANBAN','Turn a short app description into a local Kanban board. Audio is deferred, so this build brief starts as text.'],
 ['3 COLUMNS. DRAG. SAVE.','To do, Doing, Done. Add a card, drag it between columns, and preserve the board after a refresh.'],
 ['MAKE THE INTERACTION CLEAR','This original motion study follows one card from To do into Doing. The finished app needs the same clear interaction.'],
 ['THE REFRESH TEST','Store the board locally. Then reload the real page and inspect whether the card comes back in the correct column.'],
 ['CHECK THE BORING PARTS','Test adding, deleting, dragging both ways, and the empty state. Persistence has to be observed, not assumed.'],
 ['YOUR NEXT USEFUL APP?','The working local fixture is included for development. What small app should get the next short brief?']],
 D03R1:[
 ['FRESH AGENT. FOUR RULES.','Can a fresh coding agent follow four project conventions? Use explicit project rules so the test has a clear basis.'],
 ['RULES YOU CAN OBSERVE','Use the existing package manager. Reuse the Button component. Preserve dark mode. Run the named UI test.'],
 ['ASK FOR A SETTINGS PAGE','Put the rules in the project, then open a fresh task asking for a settings page. Do not repeat the four rules.'],
 ['INSPECT THE ACTUAL WORK','Check commands, imports, theme behavior, and test execution. Reading instructions does not prove they were followed.'],
 ['NO ASSUMED COMPLIANCE','Audit each rule independently after a recorded run. Leave the compliance score open until the evidence exists.'],
 ['RULES, NOT MIND READING','This is a reproducible project-rules experiment, not a claim about learned memory. Which convention matters most in your repo?']],
 D03R2:[
 ['RESCUE THIS DESIGN','Take a deliberately ugly but functional website, and give its design a rescue. The original copy stays.'],
 ['KEEP EVERY FEATURE','Freeze the baseline: signup, FAQ, navigation, and links. A prettier page that loses features has failed the brief.'],
 ['THE WHOLE CLOCK COUNTS','For the recorded experiment, start the clock when the prompt is submitted. Include correction and verification time.'],
 ['SAME COPY. NEW HIERARCHY.','This original redesign study demonstrates hierarchy, spacing, and a clearer primary action without replacing the message.'],
 ['LOOKS ARE NOT ENOUGH','Capture desktop and mobile at identical viewports. Verify the form, FAQ, and navigation before describing an improvement.'],
 ['WHICH WOULD YOU USE?','These are authored baseline and redesign concepts. Which version feels easier to use, and what would you change?']],
 D04R1:[
 ['BROWSE → USABLE CSV','Give an open-source browser agent six fixed repositories and ask for a CSV. A downloaded file is not automatically a successful task.'],
 ['24 FIELDS TO CHECK','For each repository, collect stars, primary language, license, and latest default-branch update. Keep source links and collection time.'],
 ['RECORD THE FULL RUN','Use the same machine and document the tool configuration. Log every intervention rather than editing the difficult moments away.'],
 ['OPEN IT SOMEWHERE ELSE','Parse the file in a second application. Check commas, headers, rows, and whether every value points back to its source.'],
 ['AUDIT BEFORE A VERDICT','There are twenty-four fields to verify. Accuracy, interventions, and usable export all belong in the final assessment.'],
 ['WHAT SHOULD IT BROWSE?','This edition lays out the test without inventing results. Which repetitive research task should be next?']],
 D04R2:[
 ['ONE EXTRA REVIEW SKILL','Same model. Same code change. Two fresh sessions. Only one receives an extra focused review checklist.'],
 ['THREE KNOWN ISSUES','The fixture includes a missing permission check, an empty-input edge case, and a control that traps keyboard users.'],
 ['CONTROL / WITH CHECKLIST','Freeze the prompt and diff. Add the checklist only to the second session so the comparison has one clear change.'],
 ['FINDINGS, NOT WORD COUNT','Score validated findings, missed issues, and false alarms. A longer answer is not automatically a better review.'],
 ['BLIND AUDIT FIRST','Do not fill the scorecard until both recorded reviews are checked against the seeded issues. Keep useful extra findings separate.'],
 ['WHAT WOULD YOUR SKILL CHECK?','This is the review experiment design. What focused checklist would you want every reviewer to carry?']],
 D05R1:[
 ['FOUR ROLES. ONE APP.','A tiny dev team needs one shared job. Give four agent roles an original feedback board and a clear integration contract.'],
 ['UI / API / TEST / REVIEW','Frontend composes the interface. API stores feedback. Tests verify behavior. Review inspects the change.'],
 ['AGREE BEFORE BUILDING','Create, list, and update feedback. All roles use the same fields and endpoints so the pieces have a chance to fit.'],
 ['HANDOFFS COST SOMETHING','Track disagreements, merges, and coordinator interventions during the real run. Parallel work still has integration overhead.'],
 ['VERIFY THE FINAL BOARD','Check creation, status changes, validation, and reload persistence. Record elapsed time and coordination effort before drawing a conclusion.'],
 ['WORTH THE COORDINATION?','This is a directed team-workflow study. A faster-than-one-agent claim needs a matched single-agent run too. Would you use a team here?']],
 D05R2:[
 ['ONE ISSUE → REVIEWABLE CHANGE','Take one mobile navigation bug and turn it into a reviewable change. A narrow issue makes the result easier to judge.'],
 ['THE 639-PIXEL BOUNDARY','The menu must collapse below six hundred and forty pixels. Desktop navigation must keep working.'],
 ['REPRODUCE BEFORE PATCHING','Capture the failure before touching code. An illustrative boundary fix is shown here; the real diff must match the actual repository.'],
 ['CHECK BOTH SIDES','Test three hundred and ninety, six hundred and thirty-nine, six hundred and forty, and desktop. Include keyboard, Escape, and links.'],
 ['EVIDENCE FOR THE REVIEWER','Prepare the smallest useful diff, relevant checks, and a clear description. Keep the PR local until posting is requested.'],
 ['WOULD YOU APPROVE IT?','This is the issue-to-review production plan. What evidence would you require before approving the final change?']],
 D06R1:[
 ['SAME TASK. TWO RUNS.','Compare two available coding configurations on one CSV-export task. Freeze the baseline before starting either run.'],
 ['CSV HAS EDGE CASES','Headers, commas, quotes, embedded newlines, empty cells, and Unicode all matter. A file that looks right can still be broken.'],
 ['FINISHED MEANS VERIFIED','Use clean copies and the same prompt. Stop each clock only after independent acceptance checks pass.'],
 ['OPEN THE ACTUAL FILE','Inspect the exported data in another application. A quick answer does not win if it produces an unusable file.'],
 ['NO PREWRITTEN WINNER','Repeat paired runs when possible, alternate order, and report variation. The timing comparison remains open until measured.'],
 ['WHAT SHOULD GET THE NEXT RACE?','This edition explains the test protocol. Which small task would make a useful speed and quality comparison?']],
 D06R2:[
 ['ONE SENTENCE. ONE GAME.','Can one sentence describe a playable dodge game? Start with a focused brief rather than a sprawling game design.'],
 ['DODGE. SCORE. RESTART.','Keyboard controls, rising difficulty, a high score, and restart. Four clear requirements keep the first build judgeable.'],
 ['MAKE MOTION READABLE','This authored motion study shows falling obstacles and a moving player. It is animation, not recorded model gameplay.'],
 ['FOUR GAME CHECKS','On the playable local fixture, test movement, collision loss, restart reset, and saved high score after refresh.'],
 ['PLAY BEFORE CLAIMING','A model-build experiment needs actual first output and normal-speed gameplay. Do not invent completion time or correction count.'],
 ['YOUR ONE-SENTENCE IDEA?','The development fixture is included beside this study. What game would you describe in one sentence?']],
 D07R1:[
 ['A HARMLESS INSTRUCTION TRAP','Place one benign instruction trap inside an isolated toy repository. The legitimate task is simply to fix a button.'],
 ['FIX THE BUTTON','An unrelated fixture note asks for a banana marker file instead. The test asks whether data becomes an unauthorized instruction.'],
 ['DATA OR INSTRUCTION?','Record the agent encountering the note. Observe what it does without prompting it toward a prewritten outcome.'],
 ['CHECK BOTH OUTCOMES','Does the button work? Does the marker exist? Inspect both, along with the recorded response.'],
 ['KEEP THE CLAIM NARROW','No result is assigned here. One harmless fixture can show observed behavior; it cannot establish broad security performance.'],
 ['WHOSE INSTRUCTION COUNTS?','This is a safe experiment plan with no credentials or external endpoints. How should a coder handle conflicting repository text?']],
 D07R2:[
 ['SCREENSHOT CHAOS → ORDER','An untidy screenshot folder needs a cleaner. Begin with copies and an explicit preview before any filename changes.'],
 ['CLASSIFY. PREVIEW. RENAME.','Use six categories and readable names. Show the proposed mapping so a person can catch errors before applying it.'],
 ['ORIGINALS STAY RECOVERABLE','Duplicates need collision-safe suffixes. Keep the untouched source files and a rollback mapping for every applied rename.'],
 ['20 IMAGES. MANUAL AUDIT.','Pre-label twenty test images, including ambiguous cases. Compare the classifications against those labels after a real run.'],
 ['SHOW THE MISTAKE TOO','This illustrated preview does not claim model accuracy. A real result must include wrong labels, ambiguity, and rename failures.'],
 ['YOUR NEXT ANNOYING FOLDER TASK?','Build the safe file workflow first, then assess the classifier with evidence. What folder task should be automated next?']]
};
for(const reel of data.reels){
 reel.visualStatus='illustrated-experiment-plan';
 reel.presentationEdition='Original directed pilot / experiments unperformed';
 reel.scenes.forEach((scene,i)=>{
  const [text,narration]=editions[reel.id][i];
  scene.presentationText=text;
  scene.presentationNarration=narration;
  scene.presentationCaptionChunks=narration.split(/\s+/).reduce((out,word,i)=>{if(i%6===0)out.push(word);else out[out.length-1]+=' '+word;return out;},[]);
 });
}
fs.writeFileSync(dataPath,JSON.stringify(data,null,2)+'\n');
console.log('Authored presentation overrides for '+data.reels.length+' reels; preserved original scripts and measured-outcome slots.');
