/**
 * Narration for the remaining BUILDMODE-LAB reels, keyed by bank entry number.
 * Entries 1 and 5 are already rendered.
 */
module.exports = {
  2: `Max reasoning is not the best setting for every coding task.
Turning it on permanently feels safe and quietly costs you time and tokens.
Renaming a button does not need a wall of reasoning animation.
Match the effort to the task instead of leaving one dial stuck on maximum.
A rename belongs on low, a feature belongs somewhere in the middle.
A bug hunt across hidden edge cases earns the higher setting.
A security review earns the full budget, because being wrong there is expensive.
Higher effort helps where the answer is not already obvious in the diff.
It will not save a task you described badly.
Settle the dial on the cheapest level that reliably solves the task.
That one rule cuts most of the waiting, and most of the bill.`,
  3: `If you explain your project rules in every chat, your setup is broken.
The same build command, the same folder rules, pasted for the fifth time.
Repetition does not make the model smarter, it just makes the context longer.
So move the rules into a file the project owns.
Write them once, and every new session reads them before it writes anything.
Duplicate lines stop flashing, and the prompt shrinks to the actual task.
A fresh terminal opens with the context already docked in place.
Compare forty lines of history against one line of intent.
Persistent instructions beat repeated explanations every single time.
Explain the project once, then spend the conversation on the work.`,
  4: `Pasting screenshots into your coding agent is the slow version of context.
A blurry image and the question why is this broken, typed by hand.
The agent guesses from a picture because nobody gave it a door.
Pull the camera back and the agent sits alone in the middle.
Database, deployment logs and browser tools all live outside the conversation.
Connect them with cables and the agent can read instead of imagine.
It inspects the table, reads the error, checks the deployment state.
Each node pulses, and the screenshot quietly leaves the chat.
Real systems beat reconstructed guesses every single time.
Context you can query always outperforms context you pasted.
Give the model eyes and hands rather than a photograph of both.
Better context beats better guessing, and it starts with the connection.`,
  6: `The easiest way to make an AI coder less overconfident is to give it an opponent.
One agent approving its own code is a rubber stamp with extra steps.
Split the screen: builder on the left, reviewer on the right.
The builder writes the diff and the reviewer reads it with a different job.
Security, tests and edge cases get flagged by someone who did not write them.
The builder patches, the reviewer re-runs, and the counter falls.
Independent review is the point, not the second logo.
Two models only help when the second one is allowed to disagree.
If it just agrees politely, you paid for a mirror.
Give the reviewer a role and a reason to reject the change.
Then the pull request survives contact with production.`,
  7: `What if the second AI was paid to disagree with the first?
Code sits between two panels, one labelled claim, the other challenge.
The first agent writes the plan and states its assumptions out loud.
The second one attacks them: authentication, race conditions, bad input.
Every challenge card either gets fixed or gets proved wrong.
Defending with evidence means tests, not confidence.
The counter drops from five objections down to zero.
Only then does the merge button unlock.
Turn multi-model review into an argument, not a duplicate.
Two agents that agree are one agent with extra compute.
Adversarial review finds the edge case your first pass already liked.
Ship when the disagreement reaches zero, and not one commit earlier.`,
  8: `If your best prompt is two hundred lines long, it has become a workflow.
Pasting it again is not prompting; it is re-implementing your own tooling.
Watch the sections scroll past: plan, code, test, review.
Colour the borders and the repetition becomes obvious.
Cut those sections into modular cards you can invoke by name.
One card for planning, one for building, one for testing, one for review.
Call a single card on a new task and the stored procedure runs.
The prompt folds, the modules dock, and nothing has to be retyped.
Prompts describe; workflows repeat.
Repetition is a signal that something should already be code.
Turn the giant paste into a command and stop paying for it daily.`,
  9: `A plugin that only adds another prompt is barely a plugin.
Installed, and behind it sits one more text file.
Judge it by the sockets it fills, not by the install count.
Skills hold reusable instructions and checklists the agent can pull.
Agents add specialists with their own scope and tools.
Hooks fire after an edit, running tests before anything ships.
Connections reach external systems that the model cannot touch alone.
Fill those four sockets with real examples and the plugin earns its place.
Run one task and watch them fire in sequence.
Instructions, agents, hooks, tools, in that order down the board.
Anything beyond that is decoration with a version number.
Judge plugins by what they automate, not by what they promise.`,
  10: `A screenshot shows the symptom; DevTools shows the cause.
The broken checkout image tells you almost nothing technical.
Ask what you can actually learn from it and the answer is colour.
Open the console and the first real sentence appears.
Follow the failed network request, then the stack trace underneath it.
Trace the request id back to the exact line that produced it.
Console, network and performance are context a photograph can never carry.
Give the agent that instead of a picture of a red toast.
It reads the error, finds the handler, and writes the fix.
Reload, watch the row turn two hundred, and the checkout succeeds.
Symptoms get pasted; causes get inspected.
So hand over the browser, not the crop.`,
  11: `Your code can be correct and your deployment can still be broken.
It works on your machine, and production answers with a five hundred.
Deployment logs are part of the debugging loop, not a last resort.
Expand the deployment timeline and isolate the failed build step.
Let the agent read the environment variables, the config, the build output.
Then it patches the real cause instead of guessing at the code.
Re-deploy, watch the progress bar complete, and check both cards.
Local green and production green at the same time is the actual finish line.
Most agent failures are context failures wearing a different hat.
Read the logs first and the fix is usually obvious.
Debug the system, not just the file you were editing.`,
  12: `Database access makes an AI coder powerful; production write access makes it dangerous.
A giant red button labelled drop, migrate or delete is not a tool call.
Scope the permissions into lanes before you hand anything over.
Read everywhere, write in staging, and keep production approval locked.
Inspecting the schema and running a select is safe and useful.
Generating the migration in staging lets the tests speak first.
If they pass, a human approves the last step.
Destructive actions should require confirmation, never momentum.
Tool access needs boundaries, not trust.
Trust is what you extend after the boundary already worked.
Broad inspection gives the agent context; narrow writes keep the data alive.
That asymmetry is the whole safety model.`,
  13: `The model is only half the behaviour you are talking to.
Your request is one line; the scaffold behind it is enormous.
System instructions, tool definitions, memory and policy all shape the reply.
Pull the camera back and the hidden stack appears.
The same prompt routes through every layer before anyone sees an answer.
Remove the tools and the capability disappears entirely.
Remove the instructions and the behaviour changes without the model changing.
Nothing about the weights moved, and yet the product is different.
Judge an AI product by its orchestration, not by its logo.
Two assistants on the same model can ship completely different experiences.
Look at the layers you never see before you blame the model.`,
  14: `The highest coding score can still be the wrong model for your app.
One benchmark bar wins dramatically and everyone screenshots it.
Slide the price column in and the winner changes.
Add latency, then tool reliability, and the ranking moves again.
Real choice is a multi-variable decision, not a podium.
Autocomplete wants a fast, cheap model and nothing more.
Hard debugging wants reasoning depth and will wait for it.
An autonomous browser task wants tool reliability above everything else.
Three workloads, three different winners, no contradiction anywhere.
Choose for the workload, not for the leaderboard.
Scores are a starting filter, not a final answer.
Then the model you pick matches the job you actually run.`,
  15: `Before you switch your entire stack, run four tests and nothing else.
The launch notification lands and the benchmark card looks inevitable.
Test one: give it a genuinely difficult coding task from your own repo.
Test two: run the same task at different effort levels and compare the result.
Test three: measure cost and time for the whole job, not just the token price.
Sticker price lies when the model takes three times as long.
Test four: let it drive a browser through a real workflow.
Watch whether it recovers when a click does not do what it expected.
Score all four quadrants before anyone mentions migration.
A single leaderboard number cannot decide an architecture.
Then the decision is yours instead of the marketing team's.`,
  16: `AI apps feel slow because most of them show the same dead spinner.
An empty screen and a circle going nowhere tells the viewer nothing.
The user does not need certainty; they need evidence of movement.
Replace it with a state that actually reports what is happening.
Thinking, searching, coding, verifying, each one with its own motion.
The orb changes behaviour because the system changed, not because a timer fired.
Add a small trail underneath that reflects real progress.
Same wait time on both sides, and one feels dramatically faster.
Perception is a design surface you can actually work on.
Waiting feels shorter when the interface keeps talking.
A silent spinner is the interface giving up in public.
Report state, and the seconds stop feeling empty.`,
  17: `This premium animation can be open source instead of a week of motion work.
The invoice for three thousand dollars tears away and reveals a repository.
High quality UI primitives already exist, and most of them are free.
Before you ship one, run three checks on it.
Licence first, because free to view is not free to use.
Then performance: does it drop frames on a mid-range phone.
Then accessibility: does reduced motion actually disable it.
A grid of variants gives you the state you need without inventing it.
Drop the component into a real waiting state and watch it behave.
Inspection takes an afternoon; a custom animation takes a week.
Borrow the craft, keep the checks.`,
  18: `Your AI interface does not need ten animations; it needs one that understands state.
An orb looping randomly while the app does four different jobs is a lie.
Reveal the state machine underneath: idle, thinking, tool call, coding, verify.
Map each state to its own motion, label and icon.
Now simulate one run and watch the interface follow reality.
Every transition means something because a real transition caused it.
Arbitrary looping is decoration; state-driven motion is communication.
Animation should explain what the system is doing, not merely that it is alive.
One component, five states, zero guesswork for the person waiting.
Then the interface and the agent finally agree about what is happening.`,
  19: `A blank thinking screen for fifteen seconds is terrible debugging UX.
The user cannot tell whether it is working or quietly broken.
Show action-level status instead: searching docs, checking build, running test.
Those three chips cost almost nothing to render and buy enormous trust.
Sync them to the real tools as they execute.
Keep private reasoning blurred and locked away from the log.
Expose useful observable actions and results, nothing internal.
Transparency at the action level is a feature, not a debug panel.
Show progress, not private thoughts, and the wait becomes legible.
People forgive slowness far more easily than silence.
Tell them what happened and they will wait for what happens next.`,
  20: `One AI doing planning, coding and reviewing is grading its own exam.
It wrote the answer, so of course it thinks the answer is right.
Split the roles: planner, builder, reviewer, three smaller cards.
The planner outputs a spec and the builder receives only the context it needs.
The reviewer reads the diff and runs the tests independently.
You do not need a bigger model; you need a second opinion.
Independence is what makes the check mean something.
Compare self review against a role separated loop and the gap is visible.
Smaller roles also create cleaner context boundaries for each step.
Nobody is holding the whole conversation at once.
Separate the duties and the mistakes get caught by someone with no stake.`,
  21: `Your app can have zero customers and still generate a painful bill.
Analytics say zero users while the counter on the invoice keeps climbing.
Bots are hammering one expensive endpoint and nobody is watching.
No users does not mean no usage.
Compute, storage and egress, third party calls, all three keep metering.
Image generation and logging are the quiet ones that surprise you.
Guard the route: rate limit, spending cap, alert, cache, authenticate.
Add the cap before the first spike, not after the invoice.
Then watch the cost curve flatten while the traffic stays.
Traction and spend are separate numbers, and only one of them needs permission.
Cheap failure is still failure; make it cheap on purpose.`,
  22: `The scariest vibe-coding bug is the one your interface completely hides.
A gorgeous dashboard loads, and everything about it says safe.
Pass the camera through the UI and the database underneath is wide open.
Swap the user id and private rows appear on screen.
The frontend never checks anything, because the frontend cannot check anything.
Add per-user authorization or row level security and the same request is denied.
Write the test that attacks your own endpoint, then keep it.
Security is what the backend refuses, not what the button hides.
A polished surface is not a permission model.
Beautiful and exposed are not opposites; they are often neighbours.
Look under the skin before you ship the screenshot.`,
  23: `That analytics script may be watching the exact field you forgot to mask.
A session replay shows a user typing, character by character.
Zoom into one sensitive field and the red border finally appears.
Map the path: page, script, stored replay, third party storage.
Everything the browser sees, the tool sees too.
Passwords, payment fields and health data all need deliberate masking.
Turn the exclusion on, replay again, and the characters are blocks.
Install analytics after you decide what it must never collect.
The order of those two decisions determines your exposure.
Privacy is a configuration you choose before the first session starts.
Then the insight survives without the secrets going with it.`,
  24: `You can create compliance problems before the user ever reaches the dashboard.
The form looks harmless: email, password, maybe a name.
Behind each field sit data tags nobody wrote down.
Identity, age, marketing consent, analytics, all collected by default.
Every input box you ship is a promise you now have to keep.
Ask three questions about every field you add.
Do we need it, can minors use this, what consent does it require.
Then redesign the form to collect less and separate the optional.
Unneeded fields should delete themselves before launch.
The safest personal data is often the data you never collect.
Retention obligations start the moment you store the value.`,
  25: `Automating a message is easy; automating permission is the hard part.
The agent prepares ten thousand messages and reaches for send.
A consent gate slams shut before anything leaves the queue.
Every contact needs a record, a state, and an opt out that works.
Unsubscribe handling and suppression lists are not optional extras.
Only eligible contacts flow through; the rest are removed automatically.
Jurisdiction rules decide who may be messaged at all.
The final count is smaller, and every single one of them is allowed.
Automate the rules before you automate the reach.
Scale without permission is how a campaign becomes a complaint.
Consent, unsubscribe, suppression, in that order, checked every time.
Then volume stops being a liability.`,
  26: `One checkout button can turn a side project into an international business problem.
Press buy for twenty-nine dollars and the map lights up.
Four obligation cards arrive: tax, refunds, privacy, payments.
Each region answers those four questions differently, and none of them ask you first.
Consumer rules, refund windows and data residency all vary by market.
Merchant of record tooling, tax services and region rules are possible approaches, not prescriptions.
This is architecture, not legal advice, and the shape is worth knowing.
The checkout stays simple while the backend quietly becomes layered.
Global distribution is instant; compliance is neither instant nor automatic.
Selling worldwide is a decision you make in the infrastructure.
Then the first international order is not a surprise.`,
  27: `A perfect terms page cannot fix what your app actually does.
The model generates a polished twelve page policy in seconds.
Users read the policy after the product disappoints them, not before.
Put it beside the live product and the contradictions appear.
The policy promises no tracking while analytics runs on every page.
The cancellation language describes a control that does not exist.
Mapping every promise to a control is the real work.
Write the implementation checklist that the document implies.
Compliance is behaviour first and paperwork second.
If the product cannot honour the sentence, delete the sentence.
Text that outruns your controls is a liability with good grammar.
Then the document shrinks and the controls get stronger.`,
  28: `Spending thousands on creators before you know which message works is backwards.
Forty thumbnails and a cost counter, and not one of them has taught you anything.
Compress the wall into a single variable: the hook or the message.
Test five to ten opening lines with the same demo format underneath.
Watch time and click through bars separate the angles for free.
Two winners emerge before any production budget is committed.
Only then scale human production around the message that already proved itself.
Test the words first; pay for the performance later.
Synthetic creators can be one testing tool if they are disclosed and lawful.
Cheap tests buy information, expensive shoots only buy footage.
Order matters, and so does the receipt.`,
  29: `The fastest way to weaken an application is to sound like a pitch deck.
AI-powered next-gen platform disrupting something nobody can check.
Delete the adjectives one by one until only vague nothing remains.
Then write three factual cards instead.
Who uses it, what they do now, and what changed because of you.
Specific user, specific problem, specific traction, all verifiable in a sentence.
Compare a weak traction claim against one concrete number.
The concrete one survives a second reading; the buzzword does not.
Write like someone checking whether the business is real.
Readers trust specificity because specificity can be wrong, and they notice when it is not.
Remove the theatre and let the facts do the persuading.`,
  30: `When someone says AI killed an entire job, ask which exact step disappeared.
The headline cracks because the claim is too coarse to be true.
Break the role into blocks: research, concepts, production, critique, handoff.
Three of those blocks compress dramatically under automation.
Drafts, variants and boilerplate get faster, sometimes ten times faster.
Two blocks stay stubbornly human: direction and accountability.
The new role is directing, selecting, editing and validating the output.
Judgment did not disappear; it moved earlier in the chain.
Verification and responsibility still belong to a person with a name.
Jobs rarely vanish in one click; workflows get rewritten first.
Then the job title changes and the work underneath it changes shape.`,
};
