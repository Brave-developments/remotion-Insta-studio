# BUILDMode AI — 45-Second Remotion Storyboard Library

Source pack analysed: **14 Instagram Reels** from the uploaded channel bundle.  
Goal: turn the useful ideas into **original 40–47 second vertical videos**, not copies of the source creator's wording, character, captions, visual design, or exact sequence.

This README is built as a production queue. Every idea below can be rendered as a faceless Remotion Reel.

---

## Global production spec

- **Canvas:** 1080 × 1920
- **FPS:** 30
- **Default length:** 45 seconds / 1,350 frames
- **Narration target:** roughly 90–110 spoken words
- **Scene count:** usually 5 meaningful scenes, not equal-duration slides
- **Visual rhythm:** meaningful change every 1.5–3 seconds inside a scene
- **Captions:** 3–7 words at once; highlight only the important word
- **Style:** premium developer/technology aesthetic; dark graphite/black base, restrained electric accent, real interfaces where possible
- **No presenter required:** use terminals, browser windows, app UI, diagrams, cursor movement, screenshots, counters and animated objects
- **Do not copy the source channel's illustrated presenter or composition**
- **Hook rule:** the first frame should already contain the problem, contradiction or reveal
- **Ending rule:** finish on a conclusion or visual payoff; do not waste 4–5 seconds on a generic CTA

### Reusable Remotion components to build once

`BrowserWindow` · `TerminalWindow` · `CodeEditor` · `KineticCaption` · `Cursor` · `TypingLine` · `LogoChip` · `Counter` · `Gauge` · `ProgressLine` · `ConnectionGraph` · `ScreenshotZoom` · `StackDiagram` · `ReceiptCard` · `RiskMeter` · `PhoneMockup` · `CheckPipeline` · `StateOrb` · `AgentCard` · `DiffViewer` · `Timeline`

### Fact-check labels

- **GREEN** — concept is suitable as an evergreen explainer, but still confirm product UI before recording.
- **AMBER** — current product behaviour, pricing or benchmark figures should be checked immediately before publishing.
- **RED** — legal/compliance content must be framed as a risk/example, not universal legal advice; verify jurisdiction-specific claims before using exact fines or dollar values.

---

# 01 — Most Claude Code Setups Are Backwards

**Hook:** “Most people upgrade the model first. That’s usually the wrong upgrade.”  
**Core story:** AI coding quality comes from the system around the model: effort, context, reusable skills, tools and verification.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | A huge shiny model chip upgrades twice, but a performance bar barely moves. | Model chip + tiny unchanged output gauge. |
| 3–11s | Pull the camera back to reveal five empty layers underneath: effort, context, skills, tools, verify. | 3D stack diagram. |
| 11–24s | Fill the first three layers rapidly: effort dial, `CLAUDE.md`, reusable skill cards. | Dial → editor → modular cards. |
| 24–36s | Connect Supabase/Vercel/browser-style tools, then run tests. | Animated connection graph + terminal test run. |
| 36–45s | Return to the full stack. The model is only one layer. | Final stack locks together; text: **CONTEXT · TOOLS · PROOF**. |

**How to make it:** Build the entire video around one evolving `StackDiagram` so every scene feels connected. Use `spring()` for layer lock-ins, SVG paths for tool connections, and a camera push/pull using `interpolate()`.

**Assets:** Claude/Anthropic mark, optional product screenshots for tool nodes.  
**Fact-check:** GREEN.

---

# 02 — You’re Probably Using the Wrong Effort Level

**Hook:** “Max reasoning is not the best setting for every coding task.”  
**Core story:** Match effort to task complexity instead of leaving one setting on permanently.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | MAX dial slams to 100%; timer and token meter explode upward. | Effort dial + cost/time meters. |
| 3–11s | A tiny task appears: rename a button. MAX looks absurd. | One-line diff next to huge reasoning animation. |
| 11–23s | Four task cards arrive: rename, feature, bug hunt, security review. | Cards snap onto LOW/MEDIUM/HIGH/MAX lanes. |
| 23–36s | Show why higher effort matters on hidden edge cases, not simple edits. | Bug branches multiply under a code card. |
| 36–45s | Final rule: “Use the cheapest effort that reliably solves the task.” | Dial settles; task cards stay mapped. |

**How to make it:** Use an `EffortDial` plus animated token/time counters. Keep the same dial on screen while task cards swap so the viewer understands the comparison instantly.

**Assets:** Current Claude Code effort UI screenshot if you name exact settings.  
**Fact-check:** AMBER — verify current effort labels/options before publishing.

---

# 03 — `CLAUDE.md` Is Better Than Repeating Yourself

**Hook:** “If you explain your project rules in every chat, your setup is broken.”  
**Core story:** Persistent project instructions beat repeatedly pasting the same context.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | A giant prompt is pasted for the fifth time. | Prompt block fills the terminal. |
| 3–11s | Highlight repeated lines: build command, folder rules, test command. | Duplicate lines flash red. |
| 11–23s | Those rules detach and move into `CLAUDE.md`. | Code editor creates a clean project file. |
| 23–35s | Start a fresh session; the rules appear as compact context chips. | New terminal opens; chips dock automatically. |
| 35–45s | Compare: 40-line repeated prompt vs 1-line task request. | Split screen collapses to simple task prompt. |

**How to make it:** Create a reusable `CodeEditor` and animate selected lines into floating context chips. Use a masked transition from the old prompt into the file.

**Assets:** None required; make the editor UI in Remotion.  
**Fact-check:** GREEN.

---

# 04 — Give Your AI Coder Eyes and Hands

**Hook:** “Pasting screenshots into your coding agent is the slow version.”  
**Core story:** MCP-style connections let an agent inspect real systems instead of guessing from manually pasted context.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Screenshot drops into chat with “why is this broken?” | Blurry screenshot + confused cursor. |
| 3–11s | Pull out to show the agent isolated from database, deployment and browser. | Agent node in center; disconnected nodes around it. |
| 11–25s | Connect three nodes: database, deployment logs, browser DevTools. | SVG cables draw outward. |
| 25–36s | Agent reads an error, inspects a table, then checks the deployment. | Fast UI zooms inside each node. |
| 36–45s | “Better context beats better guessing.” | All nodes pulse together; screenshot is discarded. |

**How to make it:** Use one central `AgentCard` and a `ConnectionGraph`. Real screenshots should live inside consistent custom browser frames rather than appearing full-screen randomly.

**Assets:** Supabase/Vercel/Chrome DevTools or equivalent screenshots and logos.  
**Fact-check:** AMBER — confirm supported connectors/tools before naming them.

---

# 05 — The “Done” Trap

**Hook:** “Your coding agent saying ‘done’ proves almost nothing.”  
**Core story:** Completion should mean tests, logs, browser behaviour and review all agree.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Giant green `DONE ✓`. | Terminal result fills screen. |
| 3–10s | Camera pulls back: one test failed, console is red, deployment warning exists. | Hidden failures appear behind the DONE card. |
| 10–24s | Build a verification pipeline: TEST → LOGS → BROWSER → REVIEW. | Horizontal CI-like pipeline. |
| 24–36s | Each stage runs; one fails, agent fixes it, pipeline restarts. | Checkmarks + one red stop + diff patch. |
| 36–45s | Only after all four pass does `DONE` return. | Final green pipeline + restrained payoff. |

**How to make it:** This is mostly native Remotion UI. Build `CheckPipeline`, `TerminalLine` and `DiffViewer`; use a strong content-motivated transition where the original DONE card becomes the first pipeline node.

**Assets:** None required.  
**Fact-check:** GREEN.

---

# 06 — Two Models, One Pull Request

**Hook:** “The easiest way to make an AI coder less overconfident is to give it an opponent.”  
**Core story:** One model writes; another reviews the diff with a deliberately different role.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | One agent stamps its own code `APPROVED`. | Builder agent approving itself. |
| 3–11s | Split the screen: BUILDER on left, REVIEWER on right. | Two distinct agent cards. |
| 11–23s | Builder creates a diff; reviewer flags security, test and edge-case issues. | Diff viewer with three callouts. |
| 23–36s | Builder patches; reviewer re-runs review; issue count drops 3 → 1 → 0. | Animated issue counter. |
| 36–45s | Final line: “Independent review is the point — not the second logo.” | Two agents collapse into BUILD ↔ REVIEW loop. |

**How to make it:** Use `AgentCard`, `DiffViewer` and a looped arrow. Keep the models generic unless you have verified current model availability and terms.

**Assets:** Optional model logos.  
**Fact-check:** GREEN for the workflow; AMBER for named model combinations.

---

# 07 — Make Claude and Codex Argue Until the Code Survives

**Hook:** “What if the second AI is paid to disagree with the first?”  
**Core story:** Turn multi-model review into an adversarial loop rather than simple duplication.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Code sits between two agent panels labelled CLAIM and CHALLENGE. | Debate arena layout. |
| 3–11s | Agent A proposes implementation and assumptions. | Left panel writes plan. |
| 11–23s | Agent B attacks assumptions: auth, race conditions, bad input. | Red challenge cards hit the plan. |
| 23–35s | Agent A must either fix or defend every item with evidence/tests. | Cards switch to FIXED / PROVED. |
| 35–45s | Ship only when the disagreement counter reaches zero. | Counter 5 → 0; merge button unlocks. |

**How to make it:** Avoid cartoon fighting. Make it look like a premium technical review board with evidence cards. Use `Sequence` for debate rounds and `spring()` when objections land.

**Assets:** Optional Claude/Codex logos; generic labels are safer for evergreen reuse.  
**Fact-check:** GREEN as a proposed workflow.

---

# 08 — Stop Copy-Pasting the Same Giant Prompt

**Hook:** “If your best prompt is 200 lines long, turn it into a workflow.”  
**Core story:** Stable repeated procedures belong in reusable skills, commands or plugins.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Endless prompt scroll races past camera. | Huge prompt ribbon. |
| 3–10s | Highlight four repeated sections: plan, code, test, review. | Sections get coloured borders. |
| 10–22s | Cut them into modular cards: `/plan`, `/build`, `/test`, `/review`. | Cards snap into a dock. |
| 22–35s | Invoke one card on a new task; it executes the stored workflow. | Terminal command → mini pipeline. |
| 35–45s | “Prompts describe. Workflows repeat.” | Prompt sheet folds into reusable modules. |

**How to make it:** Animated masks should physically slice the long prompt into modules. Reuse `SkillCard` and `PluginDock` across later videos.

**Assets:** None required.  
**Fact-check:** GREEN.

---

# 09 — What a Good AI Coding Plugin Actually Adds

**Hook:** “A plugin that only adds another prompt is barely a plugin.”  
**Core story:** The useful plugin layers are instructions/skills, agents, hooks and external tool connections.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | “PLUGIN INSTALLED” appears, followed by… one text file. | Underwhelming reveal. |
| 3–11s | Four empty sockets appear: SKILL, AGENT, HOOK, TOOL. | Hardware-like plugin board. |
| 11–26s | Fill each socket with one practical example. | Skill = review checklist; agent = specialist; hook = post-edit test; tool = external system. |
| 26–37s | Run a task; all four fire in sequence. | Compact task timeline. |
| 37–45s | “Judge plugins by what they automate, not the install count.” | Plugin board becomes scorecard. |

**How to make it:** Use a central `PluginBoard` with four sockets. Each layer should visibly change the execution pipeline so the story is not abstract.

**Assets:** Optional screenshots of current plugin marketplace/docs.  
**Fact-check:** AMBER — current plugin primitives may evolve.

---

# 10 — Your Browser Is Better Debug Context Than a Screenshot

**Hook:** “A screenshot shows the symptom. DevTools shows the cause.”  
**Core story:** Browser console, network requests and performance traces give agents far richer debugging context.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Broken checkout screenshot. | Red error toast only. |
| 3–10s | Ask “what can you actually learn from this image?” | Image zooms; almost no technical data. |
| 10–24s | Open DevTools: console error → failed network request → stack trace. | Browser panels slide out. |
| 24–36s | Agent follows the failed request back to one line of code. | Animated connection from request ID to editor line. |
| 36–45s | Fix, reload, successful request. | Network row turns 200; checkout succeeds. |

**How to make it:** Build one `BrowserWindow` with tabs for Console/Network/Performance. Avoid fake text walls; focus on one believable error path.

**Assets:** Chrome DevTools screenshot or a recreated generic DevTools UI.  
**Fact-check:** GREEN.

---

# 11 — Let the Agent Read Your Deployment Logs

**Hook:** “Your code can be correct and your deployment can still be broken.”  
**Core story:** Deployment logs are part of the debugging loop, not something checked only after the agent gives up.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Local terminal: `works on my machine ✓`. | Green local status. |
| 3–10s | Cut to production: 500 error. | Browser goes red. |
| 10–23s | Deployment timeline expands; failed build step is isolated. | Vercel-style deployment card + logs. |
| 23–35s | Agent patches env/config/build issue and re-deploys. | Diff + deployment progress bar. |
| 35–45s | Local and production both show green. | Two environment cards sync. |

**How to make it:** Use `Timeline`, `TerminalWindow`, `DiffViewer`. Animate from local terminal into a cloud deployment timeline rather than hard-cutting.

**Assets:** Current deployment platform UI if naming Vercel/Netlify/etc.  
**Fact-check:** AMBER.

---

# 12 — Let the Agent Query the Database — But Not Production Blindly

**Hook:** “Database access makes an AI coder powerful. Production write access makes it dangerous.”  
**Core story:** Tool access should be scoped: inspect broadly, write narrowly, require confirmation for destructive actions.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Agent receives giant red button: `DROP / MIGRATE / DELETE`. | Danger UI. |
| 3–11s | Show three permission lanes: READ, STAGING WRITE, PROD WRITE. | Permission matrix. |
| 11–24s | Agent inspects schema and runs a read query safely. | Table browser + SQL query. |
| 24–36s | Migration is generated in staging, tests pass, prod approval stays locked. | Staging card green; prod lock icon. |
| 36–45s | “Tool access needs boundaries, not trust.” | Permission matrix becomes final rule. |

**How to make it:** Reuse `ConnectionGraph` but add permission badges. Keep destructive actions behind a visible confirmation gate.

**Assets:** Database dashboard screenshot if desired.  
**Fact-check:** GREEN as security guidance.

---

# 13 — The Hidden Prompt Is Part of the Product

**Hook:** “The model is only half the behaviour you’re talking to.”  
**Core story:** System instructions, tool definitions, safety rules and product orchestration heavily shape an assistant’s output.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | User prompt: “Book this trip.” | Tiny user prompt in center. |
| 3–10s | Camera pulls back; a huge hidden scaffold appears behind it. | Layers labelled SYSTEM / TOOLS / MEMORY / POLICY. |
| 10–24s | Show how the same user prompt routes through those layers. | Animated prompt packet travels through stack. |
| 24–36s | Remove the tool layer: capability disappears; remove instructions: behaviour changes. | Side-by-side controlled experiment. |
| 36–45s | “When judging an AI product, judge the orchestration too.” | Model logo shrinks to one component in larger product diagram. |

**How to make it:** Use a packet-routing animation. Do not quote or reproduce proprietary system prompts; the story is about architecture, not leaking hidden text.

**Assets:** Generic assistant UI.  
**Fact-check:** GREEN.

---

# 14 — Why Benchmarks Don’t Tell You Which Model to Use

**Hook:** “The highest coding score can still be the wrong model for your app.”  
**Core story:** Real choice is a multi-variable decision: quality, latency, price, effort scaling and tool/browser reliability.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | One benchmark bar wins dramatically. | Big 1st-place bar. |
| 3–10s | Add a price column; winner changes. | Cost axis slides in. |
| 10–21s | Add latency and tool-use reliability. | Scorecard grows to four dimensions. |
| 21–34s | Map three workloads: autocomplete, hard debugging, autonomous browser task. | Workload cards select different model profiles. |
| 34–45s | “Choose for the workload, not the leaderboard.” | Leaderboard morphs into workload router. |

**How to make it:** Build an animated comparison table and a radar/scorecard visual, but keep numbers fictional unless sourced immediately before publishing.

**Assets:** Current official benchmark/pricing screenshots if using real figures.  
**Fact-check:** AMBER.

---

# 15 — New Model? Run This Four-Test Scorecard

**Hook:** “Before switching your entire stack to a new model, run four tests.”  
**Core story:** A practical evaluation framework inspired by new-model launch content without repeating marketing numbers.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | “NEW MODEL” notification lands. | Product launch card. |
| 3–10s | Test 1: difficult coding task. | Benchmark card labelled QUALITY. |
| 10–18s | Test 2: same task at different reasoning/effort levels. | Effort dial + result score. |
| 18–28s | Test 3: cost and time for the full task, not token sticker price alone. | Cost/time meter. |
| 28–37s | Test 4: browser/computer/tool use on a real workflow. | Browser agent completing checkout-like flow. |
| 37–45s | Score all four; only then decide whether to migrate. | 4-quadrant decision card. |

**How to make it:** One `Scorecard` component drives the whole video. Each test lights one quadrant, then the final frame shows the full decision.

**Assets:** New-model logo/release page if covering a specific launch such as Opus 5.5.  
**Fact-check:** AMBER — verify every launch figure from the vendor’s official release.

---

# 16 — The Best AI UI Trick Is a Better Waiting State

**Hook:** “AI apps feel slow because most of them show the same dead spinner.”  
**Core story:** Waiting feels shorter when the interface communicates meaningful state: thinking, searching, coding, verifying.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Generic spinner spins in silence. | Empty black screen + spinner. |
| 3–10s | Replace it with a reactive orb and state label. | Orb forms from particles. |
| 10–23s | Orb changes behaviour for THINKING / SEARCHING / CODING. | Three distinct motion patterns. |
| 23–35s | Add a small progress/status trail that reflects real state. | State timeline below orb. |
| 35–45s | Same wait time; one UI feels dramatically faster. | Split-screen perception comparison. |

**How to make it:** Create `StateOrb` from 100–300 points or rings using CSS/SVG/Canvas; state changes should alter motion, not merely colour.

**Assets:** None required, or reference an open-source orb library after checking its licence.  
**Fact-check:** GREEN; verify any specific repo licence before reuse.

---

# 17 — You Don’t Need a Designer for Every Loading Animation

**Hook:** “This premium AI animation can be open-source, not a week of custom motion work.”  
**Core story:** Use high-quality open-source UI primitives, but inspect licence, performance and accessibility before shipping.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Premium orb animation appears with a fake $3,000 invoice. | Orb + invoice. |
| 3–10s | Invoice tears away to reveal an open-source repository. | GitHub-style repo card. |
| 10–21s | Show multiple states/components available. | Grid of orb/loading variants. |
| 21–34s | Run three checks: licence, FPS/performance, reduced motion. | Three green/red check cards. |
| 34–45s | Drop it into an app waiting state. | Browser app preview with integrated component. |

**How to make it:** Use real repo screenshots only if licence/source is verified. Build the final integration demo yourself in Remotion rather than copying the repo demo design.

**Assets:** GitHub repo page, licence snippet, component demo.  
**Fact-check:** AMBER — repo activity/licence/performance can change.

---

# 18 — Build One Interface, Feed It Real Agent States

**Hook:** “Your AI interface doesn’t need ten animations. It needs one animation that understands state.”  
**Core story:** Drive UI animation from an agent state machine rather than arbitrary looping motion.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | One orb loops randomly while the app does different tasks. | Bad UI state. |
| 3–10s | Reveal state machine: idle → thinking → tool call → coding → verify. | Node diagram. |
| 10–25s | Map each state to orb movement + label + icon. | State chips trigger unique motion. |
| 25–36s | Simulate one agent run; UI follows the real state sequence. | Timeline drives visuals. |
| 36–45s | “Animation should explain what the system is doing.” | State machine and orb merge into final component. |

**How to make it:** Build `AgentStateMachine` and pass state as a prop to `StateOrb`, captions and progress components. This is a good reusable Remotion demo template.

**Assets:** None.  
**Fact-check:** GREEN.

---

# 19 — Your AI App Should Show What the Agent Is Doing

**Hook:** “A blank ‘thinking…’ screen is terrible debugging UX.”  
**Core story:** Users trust agentic apps more when they can see meaningful actions without exposing noisy internal chain-of-thought.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Screen says only `Thinking…` for 15 seconds. | Blank loader. |
| 3–11s | Replace it with action-level status: searching docs, checking build, running test. | Three compact status chips. |
| 11–25s | Show a real task and status updates as tools execute. | Browser/terminal actions synced to chips. |
| 25–36s | Hide private reasoning; expose only useful observable actions/results. | “internal reasoning” stays blurred/locked. |
| 36–45s | “Show progress, not private thoughts.” | Clean status timeline completes. |

**How to make it:** Create a `ToolActivityFeed` with short action messages generated from actual tool events. Visually distinguish activity from reasoning.

**Assets:** Generic agent UI.  
**Fact-check:** GREEN.

---

# 20 — One Giant Model Is Often Worse Than a Small Agent Team

**Hook:** “One AI doing planning, coding and reviewing is grading its own exam.”  
**Core story:** Separate roles can create better checks and clearer context boundaries.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | One giant agent wears PLAN / BUILD / REVIEW badges simultaneously. | Overloaded agent card. |
| 3–11s | Split into three smaller role cards. | Planner, Builder, Reviewer. |
| 11–24s | Planner outputs a spec; builder receives only needed context. | Spec packet passes to builder. |
| 24–35s | Reviewer examines diff and tests independently. | Review card finds one hidden bug. |
| 35–45s | Compare self-review vs role-separated loop. | Error counter shows why separation helps. |

**How to make it:** Use `AgentCard` components with visibly different inputs/outputs. The transfer of compact artifacts between agents should be the main motion motif.

**Assets:** None.  
**Fact-check:** GREEN as an architectural pattern, not a guarantee of better results.

---

# 21 — Zero Users Can Still Create a Cloud Bill

**Hook:** “Your app can have zero customers and still generate a painful bill.”  
**Core story:** Public endpoints, bots, storage, image generation, logging or bandwidth can create costs before meaningful traction.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Analytics: `0 users`; bill counter keeps climbing. | Split analytics/billing card. |
| 3–11s | Reveal bot traffic repeatedly hitting one expensive endpoint. | Request dots flood API route. |
| 11–23s | Show three cost sources: compute, storage/egress, third-party API calls. | Meter trio. |
| 23–35s | Add rate limit, spending cap/alert, caching/auth. | Guardrails snap onto route. |
| 35–45s | Bill curve flattens. “No users does not mean no usage.” | Cost graph stabilises. |

**How to make it:** Build an animated request graph feeding a live cost counter. Avoid dramatic dollar values unless based on a reproducible pricing example.

**Assets:** Optional cloud billing screenshot.  
**Fact-check:** AMBER — pricing is provider-specific.

---

# 22 — A Beautiful App Can Still Have a Public Database

**Hook:** “The scariest vibe-coding bug is the one your UI completely hides.”  
**Core story:** A polished frontend can sit on top of weak database authorization or row-level security.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Gorgeous dashboard loads. | Premium app screen. |
| 3–10s | Camera passes through the UI into the database underneath. | 3D cutaway transition. |
| 10–22s | Another user ID is swapped; private rows suddenly appear. | Request inspector + unexpected data rows. |
| 22–35s | Add per-user authorization/RLS test; attack request now returns denied. | Policy rule + test cases. |
| 35–45s | “Security is what the backend refuses, not what the button hides.” | UI fades; backend lock remains. |

**How to make it:** Use a dramatic UI-to-database camera dive. Keep example data fake. Show a test case rather than instructions for exploiting a real app.

**Assets:** Generic database dashboard or your own recreated table UI.  
**Fact-check:** GREEN.

---

# 23 — Session Replay Can Record More Than You Think

**Hook:** “That analytics script may be watching the exact field you forgot to mask.”  
**Core story:** Session replay and analytics tools need deliberate masking for passwords, payment fields and other sensitive data.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Replay video shows a user typing into a form. | Phone/browser mockup. |
| 3–11s | Zoom into one sensitive field that is visible in the replay. | Field gets red border. |
| 11–23s | Map page → analytics script → stored replay. | Data flow diagram. |
| 23–35s | Turn on masking/exclusion and replay again. | Characters become blocked immediately. |
| 35–45s | “Install analytics after you decide what it must never collect.” | Final privacy checklist. |

**How to make it:** Use a fake form and a fake replay window. This keeps the visual concrete without exposing real personal data.

**Assets:** Optional official masking settings screenshot from the analytics vendor you cover.  
**Fact-check:** RED — privacy requirements depend on data/jurisdiction; avoid universal fine claims.

---

# 24 — Signup Is Where Legal Risk Starts

**Hook:** “You can create compliance problems before the user reaches the dashboard.”  
**Core story:** Signup decisions determine what personal data is collected, age assumptions, consent and retention obligations.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Simple signup form looks harmless. | Email/password form. |
| 3–11s | Data labels multiply behind each field: identity, age, marketing, analytics. | Hidden data tags appear. |
| 11–23s | Show three questions: do we need it, can minors use this, what consent is required? | Decision cards. |
| 23–35s | Redesign signup to collect less and separate optional consent. | Form becomes simpler. |
| 35–45s | “The safest personal data is often the data you never collect.” | Unneeded fields delete themselves. |

**How to make it:** Use one evolving signup form. Do not quote exact penalties unless the Reel is jurisdiction-specific and legally sourced.

**Assets:** None required.  
**Fact-check:** RED.

---

# 25 — Marketing Automation Can Become a Compliance Problem

**Hook:** “Automating a message is easy. Automating permission is the hard part.”  
**Core story:** SMS/email automation needs consent, unsubscribe handling, suppression logic and jurisdiction-aware rules.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | AI agent prepares 10,000 messages. | Send counter races upward. |
| 3–10s | Big SEND button gets blocked by `CONSENT?`. | Permission gate slams shut. |
| 10–23s | Show consent record, unsubscribe state and suppression list. | Three database rows/cards. |
| 23–35s | Only eligible contacts flow through; others are removed automatically. | Funnel animation. |
| 35–45s | “Automate the rules before you automate the reach.” | Final send count is smaller but clean. |

**How to make it:** Create a contact-flow diagram rather than quoting scary fines. Add exact law names only after legal research for the target market.

**Assets:** Generic CRM/SMS UI.  
**Fact-check:** RED.

---

# 26 — Global Checkout Means Global Obligations

**Hook:** “One checkout button can turn a local side project into an international business problem.”  
**Core story:** Selling globally can introduce tax, consumer, refund, privacy and payment obligations that differ by market.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | One `BUY $29` button. | Minimal checkout. |
| 3–10s | World map lights up with purchases from multiple regions. | Transaction arcs. |
| 10–23s | Four obligation cards appear: TAX, REFUNDS, PRIVACY, PAYMENTS. | Cards anchor to regions. |
| 23–35s | Show merchant-of-record / tax tooling / region rules as possible approaches. | Architecture options, not legal prescription. |
| 35–45s | “Global distribution is instant. Compliance isn’t.” | Checkout remains simple; backend becomes layered. |

**How to make it:** Use a clean map and card system. Do not present one tax percentage as globally applicable.

**Assets:** Optional checkout/provider logos.  
**Fact-check:** RED.

---

# 27 — AI-Written Terms Don’t Make You Compliant

**Hook:** “A perfect Terms page cannot fix what your app actually does.”  
**Core story:** Policies need to match product behaviour, data collection, subscription flow and operational controls.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | AI generates a polished 12-page policy instantly. | Document prints rapidly. |
| 3–10s | Put policy beside the live app; contradictions appear. | Side-by-side mismatch highlights. |
| 10–23s | Examples: policy says no tracking while analytics is active; cancellation language vs missing cancel control. | Two mismatch cards. |
| 23–35s | Create implementation checklist tied to each policy promise. | Promise → control mapping. |
| 35–45s | “Compliance is behaviour first, paperwork second.” | Document shrinks; product controls remain dominant. |

**How to make it:** `DocumentPanel` on left, `ProductUI` on right; animate red lines connecting mismatched promises to actual behaviour.

**Assets:** None required.  
**Fact-check:** RED.

---

# 28 — Your App Doesn’t Need 40 Paid UGC Creators on Day One

**Hook:** “Spending thousands on creators before you know which message works is backwards.”  
**Core story:** Test hooks cheaply first, then spend on human creators/production only after a message proves itself. Synthetic creators can be one testing tool if clearly disclosed and used lawfully.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Grid of 40 creator thumbnails + giant cost counter. | Creator wall. |
| 3–10s | Collapse them into one variable: the hook/message. | 40 cards compress into five hook cards. |
| 10–23s | Generate/test 5–10 message variants with a consistent demo format. | Same app, different opening lines. |
| 23–35s | Performance graph identifies two winning angles. | CTR/watch-time bars. |
| 35–45s | Only then scale production around winners. | Two winners expand into proper creator campaign. |

**How to make it:** Use a `VariantGrid` and performance chart. If using an AI/synthetic presenter, visibly label it where required and never imply a real-person endorsement that did not happen.

**Assets:** App screen, optional synthetic UGC examples you own/have rights to.  
**Fact-check:** AMBER/RED for ad disclosure rules and platform policies.

---

# 29 — The YC Application Mistake: Writing for Investors Instead of Users

**Hook:** “The fastest way to make a startup application weaker is to sound like a pitch deck.”  
**Core story:** Specific user/problem/traction language is stronger than buzzwords, market-size theatre and unnecessary tech-stack detail.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Application line: “AI-powered next-gen platform disrupting…” | Buzzword sentence stretches across screen. |
| 3–10s | Delete adjectives until only vague nothing remains. | Words vanish one by one. |
| 10–22s | Replace with: who uses it, what they do now, what changed. | Three factual cards. |
| 22–35s | Compare a weak traction claim with a concrete number/example. | Before/after application fields. |
| 35–45s | “Write like someone checking whether the business is real.” | Clean application answer locks in. |

**How to make it:** Recreate a generic startup application form, not YC’s exact layout. Use cursor edits and line-by-line rewrites as the main animation.

**Assets:** None required; optional public YC guidance screenshot if directly sourced.  
**Fact-check:** GREEN as writing guidance; do not claim insider selection criteria without sourcing.

---

# 30 — AI Didn’t “Kill” Designers — It Killed Parts of the Workflow

**Hook:** “When someone says AI killed an entire job, ask which exact step disappeared.”  
**Core story:** AI usually compresses specific tasks first — drafts, variants, research, boilerplate — while judgment, direction, verification and accountability remain.

| Time | Story beat | What to show |
|---|---|---|
| 0–3s | Giant headline: `AI KILLED DESIGNERS`. | Viral-style claim flashes, then cracks. |
| 3–10s | Break “designer” into workflow blocks: research, concepts, production, critique, handoff. | Workflow chain. |
| 10–23s | AI accelerates three blocks; two remain human-heavy. | Blocks compress in duration. |
| 23–35s | Show the new role: directing, selecting, editing, validating. | Human decision nodes around AI outputs. |
| 35–45s | “Jobs rarely disappear in one click. Workflows get rewritten first.” | Old workflow morphs into shorter new workflow. |

**How to make it:** Use a timeline compression visual instead of a talking-head montage. The opening sensational headline should visibly be challenged by the rest of the video.

**Assets:** Generic design/code/content workflow icons; no need to use the original viral creator’s clips.  
**Fact-check:** GREEN if framed as analysis rather than a prediction certainty.

---

# Suggested publishing order

Do **not** upload all 30 in category order. Mix educational, tool, risk and contrarian stories so the page does not look repetitive.

### First 14 videos / first week at 2 per day

1. Most Claude Code Setups Are Backwards
2. Zero Users Can Still Create a Cloud Bill
3. You’re Probably Using the Wrong Effort Level
4. The Best AI UI Trick Is a Better Waiting State
5. The “Done” Trap
6. A Beautiful App Can Still Have a Public Database
7. Two Models, One Pull Request
8. The Hidden Prompt Is Part of the Product
9. Your Browser Is Better Debug Context Than a Screenshot
10. Your App Doesn’t Need 40 Paid UGC Creators on Day One
11. `CLAUDE.md` Is Better Than Repeating Yourself
12. AI-Written Terms Don’t Make You Compliant
13. Why Benchmarks Don’t Tell You Which Model to Use
14. AI Didn’t “Kill” Designers — It Killed Parts of the Workflow

This gives the first week a mix of **AI coding + visual tools + startup risk + creator/business content** rather than fourteen Claude Code videos in a row.

---

# Production workflow for every storyboard

1. **Choose the storyboard** and lock the single main takeaway.
2. **Research the named product/claim immediately before scripting.** Prefer official docs/releases for product behaviour; use primary legal/regulatory sources for legal claims.
3. **Write 90–110 words of narration.** Read it aloud; target ~40–45 seconds so there is room for pauses.
4. **Collect 3–6 real assets maximum.** Logos and screenshots should support the story, not become the whole video.
5. **Build the visual metaphor first.** Example: stack, pipeline, dial, connection graph, workflow chain.
6. **Add screenshots inside that system**, not as unrelated slideshow cards.
7. **Generate voice audio and timestamps.** Drive all `Sequence` timing from the actual narration.
8. **Create dynamic captions** in 3–7-word chunks; never display the whole narration.
9. **Add micro-motion inside scenes:** cursor, scrolling, line highlights, counters, small camera moves and progress animations.
10. **Render a silent preview first.** If the story is understandable with sound off, the visuals are doing enough work.
11. **Render final 1080×1920**, inspect on a phone, then tighten any scene that feels static for more than ~2–3 seconds.

---

# Recommended folder structure

```text
src/
  components/
    BrowserWindow.tsx
    TerminalWindow.tsx
    CodeEditor.tsx
    KineticCaption.tsx
    Cursor.tsx
    ConnectionGraph.tsx
    StackDiagram.tsx
    AgentCard.tsx
    DiffViewer.tsx
    CheckPipeline.tsx
    StateOrb.tsx
    RiskMeter.tsx
  videos/
    01-claude-setup-backwards/
    02-effort-level/
    03-claude-md/
    ...
    30-ai-workflow-not-jobs/
  assets/
    logos/
    screenshots/
    ui/
  audio/
  data/
    captions/
```

## Naming convention

Use:

`NN-short-topic-slug`

Example:

`05-done-trap`  
`21-zero-user-cloud-bill`  
`30-ai-workflow-not-jobs`

This lets an AI coding agent receive a request such as:

> Build storyboard 05 from the README as a 45-second Remotion composition. Reuse existing shared components first. Do not invent factual numbers. Use placeholders for any missing external screenshots.

---

# Important editorial rule

The uploaded Reels are **research inputs**, not visual templates. The final page should develop its own recognisable visual language. The strongest reusable identity for this library is:

**one clear technical metaphor per video + real interface evidence + fast cinematic UI motion + restrained kinetic typography.**

That will make the channel feel like a coherent original product instead of a collection of recreated Reels.
