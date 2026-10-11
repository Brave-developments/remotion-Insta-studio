module.exports = [
[
['This free app turns a keyboard shortcut into a menu around your cursor.', 'A MENU WHERE YOU ARE', 'evidence', 'Real Kando invocation; opening action is the hook, not a logo.'],
['Kando uses a radial menu. You point toward an action instead of searching through a list.', 'POINT TO THE ACTION', 'evidence', 'Capture one deliberate gesture at normal speed with cursor visible.'],
['You can launch apps, open folders, and trigger shortcuts from the same place.', 'APPS. FOLDERS. SHORTCUTS.', 'evidence', 'Three real actions with their actual resulting windows.'],
['Its official site lists Windows, macOS, and Linux. The project is free and open source.', 'FREE AND OPEN SOURCE', 'evidence', 'Dated official platform and license capture; no popularity counters.'],
['The part I want to test is habit. A clever menu is only useful if it is easier to use.', 'COOL DOES NOT MEAN FASTER', 'workflow', 'Same tasks align under Kando and Start menu; no result yet.'],
['Next: ten tasks against the Start menu. Which would you bet on?', '10 TASKS. ONE COMPARISON.', 'question', 'Return to menu; end with cursor poised over the first task.']
],
[
['I tested Kando against the Start menu on ten everyday tasks.', 'KANDO VS START', 'evidence', 'Matched task one in both methods; keep normal-speed proof moment.'],
['The list stays fixed: launch apps, open folders, and reach common commands.', 'SAME TASK LIST', 'workflow', 'Actual ten-task sheet, not ten claimed benchmark categories.'],
['I counted setup separately, practiced both methods, then alternated three timed rounds.', 'SETUP + PRACTICE + 3 ROUNDS', 'evidence', 'Real setup notes and run timestamps; visibly label accelerated footage.'],
['I logged wrong selections too. Fast clicking does not help if I open the wrong thing.', 'MISTAKES COUNT', 'evidence', 'Replay actual misclick or verified clean selection; show timer resumes through recovery.'],
['Kando took [KANDO_MEDIAN]. Start took [START_MEDIAN]. [MISCLICK_AND_SETUP_RESULT].', '[MEASURED RESULT]', 'result', 'Median across measured rounds and range; measured memory snapshot separately.'],
['[EVIDENCE_BASED_FIT]. Would the setup be worth it for your workflow?', 'WORTH THE SETUP?', 'question', 'Use the task where the difference was clearest, even if Kando loses.']
],
[
['Sending a file between different devices should not need a cloud upload.', 'PHONE ↔ COMPUTER', 'evidence', 'Real device pair and named non-sensitive sample file.'],
['LocalSend transfers over your local network. Both devices need to discover each other there.', 'SAME LOCAL NETWORK', 'workflow', 'Two devices connect through a router diagram, not a cloud.'],
['The official project supports Android, iOS, Windows, macOS, and Linux.', 'FIVE PLATFORM FAMILIES', 'evidence', 'Official platform card; distinguish supported platforms from devices tested here.'],
['It does not require an account. Pick a device, accept the request, and check the received file.', 'NO ACCOUNT REQUIRED', 'evidence', 'Actual send, accept and open sequence; no fabricated progress bar.'],
['That is useful at home. It also means network discovery and device permissions matter.', 'LOCAL DOES NOT MEAN EVERYWHERE', 'evidence', 'Show actual network setting and permission screen, hiding network identifiers.'],
['Next I am testing photos, a large video, and a folder against a cloud workflow.', 'CAN IT BEAT THE CLOUD?', 'question', 'Received sample file becomes first item of the test dataset.']
],
[
['I tested LocalSend against a cloud transfer with exactly the same files.', 'LOCAL VS CLOUD', 'evidence', 'Source dataset and both destinations shown in matched panes.'],
['One hundred photos, a one-gigabyte video, and a five-gigabyte folder.', 'PHOTOS / VIDEO / FOLDER', 'workflow', 'Show true file counts and byte sizes; define decimal gigabytes in run sheet.'],
['The timer includes sending and receiving. The cloud route includes upload and download.', 'COUNT THE WHOLE JOURNEY', 'evidence', 'Timestamp start and usable destination; identify chosen cloud provider and account tier.'],
['I checked the received files, then interrupted Wi-Fi during a separate recovery test.', 'INTEGRITY + RECOVERY', 'evidence', 'Checksums and destination counts; disconnect only isolated test network.'],
['[DATASET_TIMES]. [HASH_AND_RECOVERY_RESULT].', '[VERIFIED TRANSFER RESULT]', 'result', 'Dataset-by-dataset measured results; network conditions pinned below.'],
['[LOCAL_USE_CASE_AND_REMOTE_LIMIT]. Would you use it for devices on the same network?', 'WHERE WOULD YOU USE IT?', 'question', 'Return to the actual device pair and successfully opened file.']
],
[
['Before uploading a private PDF, check whether you can do the job locally.', 'KEEP THE PDF LOCAL?', 'evidence', 'Synthetic document with invented personal details; never show private records.'],
['Stirling PDF brings merging, splitting, compression, OCR, and other PDF operations into one workspace.', 'ONE PDF WORKSPACE', 'evidence', 'Real app navigation through three installed operations; exact version captured.'],
['Its project describes desktop and self-hosted options. Choose the actual local setup before making a privacy claim.', 'LOCAL SETUP MATTERS', 'evidence', 'Show installed mode and relevant official docs; do not equate hosted access with local processing.'],
['The project is open core. That means the license and paid feature boundaries deserve a look.', 'CHECK THE LICENSE', 'evidence', 'Official repository license and plan pages; avoid saying every feature is free.'],
['For me, the useful question is whether the exported file is right, especially after redaction.', 'OPEN THE OUTPUT', 'evidence', 'Preview synthetic redaction test; label unverified until independent inspection.'],
['Next: seven real jobs against Acrobat. Which one would you test first?', '7 JOBS VS ACROBAT', 'question', 'Seven named input files become the next test slate.']
],
[
['Can Stirling PDF replace Acrobat for these seven jobs?', '7 PDF JOBS', 'evidence', 'Both installed app versions beside identical input files.'],
['Edit, merge, compress, OCR, redact, sign, and reorder. Each starts from a fresh copy.', 'MATCHED INPUTS', 'workflow', 'Seven task cards; distinguish drawn signature from certificate-based signing.'],
['I compared correct output first, then time and how much setup each task needed.', 'CORRECTNESS FIRST', 'evidence', 'Real action capture plus output opening in a third viewer.'],
['For redaction, I searched and copied the hidden text. A black rectangle alone does not prove it is gone.', 'IS THE TEXT REALLY REMOVED?', 'evidence', 'Synthetic secret token searched in extracted text and output viewer.'],
['[TASK_PASS_RESULTS]. [OCR_COMPRESSION_AND_REDACTION_OBSERVATION].', '[VERIFIED PDF VERDICT]', 'result', 'Seven-row checklist; compression includes size and visual quality, not bytes alone.'],
['[SUPPORTED_USE_CASE]. [TASK_THAT_STILL_NEEDS_ACROBAT_OR_NO_GAP_FOUND]. Would you switch for these jobs?', 'WOULD YOU SWITCH?', 'question', 'Open strongest and weakest output side by side; scope conclusion to tested workflows.']
],
[
['The free Loom alternative has a licensing detail you should read.', 'FREE FOR WHICH USE?', 'evidence', 'Cap recording window alongside official pricing page, dated.'],
['Cap is a screen-recording tool. Its pricing page separates personal use from commercial use.', 'PERSONAL ≠ COMMERCIAL', 'evidence', 'Crop exact relevant terms; no outdated price taken from the source chat.'],
['So I would not call it free for every work recording.', 'CHECK YOUR USE CASE', 'workflow', 'Personal tutorial and client demo cards branch to their documented terms.'],
['The workflow I want is simple: record a useful demo, make it readable, and get it to someone.', 'RECORD → EDIT → DELIVER', 'evidence', 'Actual app recording controls and available installed editor; features depend on version.'],
['Export and sharing limits matter as much as the recording button.', 'WHAT LEAVES THE APP?', 'evidence', 'Show genuine export and share dialogs; capture account plan state.'],
['Next I am recording the same demo in Cap and Loom. Which deserves the place in your workflow?', 'SAME DEMO. TWO TOOLS.', 'question', 'Demo webpage remains fixed while recording controls change.']
],
[
['I recorded the same sixty-second demo in Cap and Loom.', 'CAP VS LOOM', 'evidence', 'Same local demo page and selected recording region.'],
['Same resolution, frame-rate target, microphone, and script. Setup time stays in the comparison.', 'MATCH THE CONDITIONS', 'workflow', 'Show actual settings and plans; note settings that cannot be matched.'],
['I checked readable text, cursor movement, edits, captions, and whether sharing worked for another viewer.', 'CAN SOMEONE USE THE RECORDING?', 'evidence', 'Identical five-second output crops; anonymous share test in fresh browser session.'],
['A feature I could not access on my plan is a limit, not an automatic failure of the entire product.', 'FEATURE / PLAN / LIMIT', 'evidence', 'Actual gated feature screen and dated terms, if encountered.'],
['[OUTPUT_AND_WORKFLOW_RESULTS]. [CURRENT_LICENSE_AND_COST_OBSERVATION].', '[TESTED RECORDING VERDICT]', 'result', 'Evidence-based comparison with captures; no invented winner or price.'],
['[PERSONAL_COMMERCIAL_AND_TEAM_FIT]. Which recording job matters most to you?', 'WHAT DO YOU RECORD?', 'question', 'Play readable output at normal speed beneath the final question.']
],
[
['A free editor can be exciting without being your next production tool.', 'HYPE VS A USABLE EDITOR', 'evidence', 'Real OpenCut interface; show installed or web build identification.'],
['OpenCut is an open-source editor. Its current README says the project is being rewritten, with the classic version still available.', 'CLASSIC / REWRITE', 'evidence', 'Dated official README status capture; distinguish classic app from rewrite preview.'],
['I am testing the classic version people can use today: can it handle an ordinary vertical edit?', 'TEST THE USABLE VERSION', 'evidence', 'Real classic version import and timeline clip; capture build identifier and unsupported formats.'],
['Then I need text, sound, and an export I can actually open.', 'TEXT. SOUND. EXPORT.', 'evidence', 'Actual available controls; never animate unavailable features as evidence.'],
['Open source tells me something about access. It does not tell me whether this version fits my deadline.', 'OPEN SOURCE IS NOT A VERDICT', 'workflow', 'License source sits beside production checklist; no arbitrary maturity score.'],
['Next: the same Reel in OpenCut and CapCut, with every missing step recorded.', 'SAME REEL. FULL CHECKLIST.', 'question', 'Timeline freezes at first clip, ready for paired test.']
],
[
['I edited the same Reel in OpenCut and CapCut.', 'ONE REEL. TWO EDITORS.', 'evidence', 'Identical original footage and edit reference, visible in both project bins.'],
['Eight jobs: import, trim, split, text, music, transition, vertical resize, and export.', '8 PRACTICAL JOBS', 'workflow', 'Reveal checklist beside exact installed versions and plans.'],
['If a step was missing, I recorded the workaround and its time. I did not pretend the button existed.', 'WORKAROUNDS COUNT', 'evidence', 'Capture actual blocker or functioning operation; accelerate waits only.'],
['The finish line is a playable ten-eighty vertical file, not just a completed timeline.', 'OPEN THE EXPORTED FILE', 'evidence', 'Open both exports in independent player; inspect dimensions and visible quality.'],
['[EIGHT_TASK_RESULTS]. [EXPORT_TIME_AND_OUTPUT_RESULT].', '[EDITOR AUDIT]', 'result', 'Actual checklist and timings; hold an example of any export defect.'],
['[PRODUCTION_FIT_TODAY]. Promising project, or a replacement for your current edits?', 'READY FOR YOUR WORKFLOW?', 'question', 'Match final frames, avoiding a winner label unsupported by evidence.']
],
[
['An open-source workspace can still have a paid cloud plan.', 'OPEN SOURCE. PAID CLOUD?', 'evidence', 'AppFlowy app and current official pricing, not a generic dashboard mockup.'],
['AppFlowy offers a workspace for pages and structured work. The client and hosted service are different parts of the decision.', 'CLIENT / HOSTED SERVICE', 'workflow', 'Two clearly named cards branch from the same workspace.'],
['Before comparing it with Notion, I want to know what works locally and what my plan includes.', 'WHAT WORKS ON THIS PLAN?', 'evidence', 'Actual account plan, available workspace features and local mode evidence.'],
['The free hosted tier has limits. Team size, storage, and AI usage need a current check.', 'READ THE FREE LIMITS', 'evidence', 'Dated official limits crop; no unverified permanent pricing claim.'],
['The useful question is whether my pages and tables still work when the network disappears.', 'THE OFFLINE QUESTION', 'evidence', 'Prepare a synthetic project workspace; no offline claim until tested.'],
['Next I am rebuilding one workspace in AppFlowy and Notion, then testing offline use and export.', 'SAME WORKSPACE. REAL TEST.', 'question', 'Workspace specification becomes the next comparison checklist.']
],
[
['I rebuilt the same small workspace in AppFlowy and Notion.', 'APPFLOWY VS NOTION', 'evidence', 'Matched synthetic task table with identical rows and properties.'],
['A table, board, calendar, project page, and form. If a feature was unavailable, I marked it.', 'MATCHED WORKSPACE', 'workflow', 'Feature cards map to actual implementation or recorded gap.'],
['Then I disconnected the test device and tried opening, editing, and saving the workspace.', 'OFFLINE: OPEN / EDIT / SAVE', 'evidence', 'Actual network state and document edit; reconnect and inspect persisted result.'],
['I also exported the data and opened it elsewhere. A download is not enough if fields disappear.', 'CHECK THE EXPORTED DATA', 'evidence', 'Independent viewer or parser; compare rows, properties and attachments.'],
['[OFFLINE_AND_EXPORT_RESULTS]. [TEAM_AND_FEATURE_LIMITS].', '[WORKSPACE TEST RESULT]', 'result', 'Measured fidelity counts and observed account limits; no blanket Notion-killer claim.'],
['[WHO_SHOULD_SWITCH_AND_WHO_SHOULD_STAY]. What would your workspace need?', 'WHAT WOULD YOU NEED?', 'question', 'Show the use case that determines the recommendation.']
],
[
['This open-source notebook starts with a canvas, not a subscription pitch.', 'AN OPEN-SOURCE NOTEBOOK', 'evidence', 'Real Butterfly canvas and installed version; use synthetic notes.'],
['Butterfly is a local-first, cross-platform note app. I want to see the workflow, not just the feature list.', 'LOCAL-FIRST NOTES', 'evidence', 'Official README with current platform evidence; state only tested device in overlay.'],
['Import a sample PDF, write on it, and move one note without rebuilding the page.', 'IMPORT. WRITE. MOVE.', 'evidence', 'Actual supported actions at normal speed; show gaps honestly.'],
['Then export the page and open it in another viewer.', 'DOES THE EXPORT SURVIVE?', 'evidence', 'Real export dialog and independent PDF view; verify annotation placement.'],
['Handwriting, organization, and collaboration can behave very differently across devices and versions.', 'TEST THE DEVICE YOU USE', 'workflow', 'Device and version card; label experimental features when official docs do.'],
['Next I am using the same PDF in Butterfly and Goodnotes. What would make you switch?', 'SAME PDF. TWO NOTE APPS.', 'question', 'Sample PDF returns blank, ready for paired annotation.']
],
[
['Can Butterfly replace my paid notebook app for this PDF workflow?', 'BUTTERFLY VS GOODNOTES', 'evidence', 'Same device and stylus where both supported; disclose unequal device if necessary.'],
['Five minutes to annotate the same pages: write, highlight, draw a shape, and move a note.', 'SAME PAGES. SAME TASKS.', 'workflow', 'Exact reference annotations and task order; recording retains writing speed.'],
['I checked organization, responsiveness, and whether the exported PDF kept the marks in place.', 'CHECK THE NOTES AND OUTPUT', 'evidence', 'Independent export viewer beside original annotations at same zoom.'],
['Sync or collaboration only gets a verdict if I can actually test it on these accounts and devices.', 'UNTESTED MEANS UNTESTED', 'evidence', 'Show tested account/device scope and explicit unavailable items.'],
['[WRITING_ORGANIZATION_AND_EXPORT_RESULTS]. [DEVICE_AND_SYNC_LIMIT].', '[NOTEBOOK VERDICT]', 'result', 'Evidence-based task results; no subjective latency measurement without instrument.'],
['[SPECIFIC_FIT_AND_GAP]. Would these notes cover what you need?', 'WOULD YOU SWITCH?', 'question', 'Finish on exported notes, not a pricing screenshot.']
]
];
