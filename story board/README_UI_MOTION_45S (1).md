# 45-Second UI / UX Remotion Content Bank

A production-ready first season derived from the useful ideas in the uploaded UI/motion Reel library. The source Reels are **idea references only**. Do not copy their wording, exact layouts, captions, branding, colors, or scene order.

## Season Format

- **27 videos**
- **Target length:** 42–48 seconds each
- **Canvas:** 1080 × 1920
- **FPS:** 30
- **Voice:** conversational, fast but clear
- **Visual approach:** one fictional product per video; demonstrate the problem instead of describing it
- **Caption chunks:** 3–7 words
- **Hook window:** first 1.5 seconds
- **Primary rule:** every 3–6 seconds, something meaningful changes on screen
- **Ending:** payoff, corrected UI, or memorable rule — not a generic “follow for more”

## Reusable Remotion Component Kit

Build these once and reuse across the full season:

`AppWindow`, `BrowserWindow`, `PhoneFrame`, `Cursor`, `ClickRipple`, `KineticCaption`, `CodeSnippet`, `TimingRuler`, `Counter`, `ProgressBar`, `Toast`, `Modal`, `Dropdown`, `Tooltip`, `FormField`, `SearchBox`, `DataTable`, `SkeletonRow`, `Chart`, `Toggle`, `FocusRing`, `ConnectionArrow`, `Spotlight`, `BeforeAfter`, `PerformanceHUD`, `AnimatedMask`, `DeviceSafeArea`.

Recommended Remotion primitives: `Sequence`, `AbsoluteFill`, `spring()`, `interpolate()`, `Img`, SVG paths, clip paths, masks, transform-origin animation, animated counters, cursor paths, and restrained camera zoom/pan.

---

# 01 — The Upload That Wasted 30 Seconds

**Theme:** file upload errors  
**Target:** ~45 sec

**Hook:** “The worst time to reject a file is after it finishes uploading.”

### Voiceover spine
A user drops a 48-megabyte design file into your app. The progress bar reaches one hundred percent. Then you tell them the format isn’t supported. Technically, the error is correct. The experience is terrible. Check file type and size before upload when you can. Show accepted formats near the drop zone. If processing can still fail, explain what happened without deleting the user’s work. Good upload UX answers three questions early: can I upload this, how long will it take, and what do I do if it fails? The best error is the one you prevent before the progress bar starts.

### Storyboard
- **0:00–0:04 — Hook:** Drag a large `design.psd` file into a beautiful upload zone. Text: **48 MB. HERE WE GO.**
- **0:04–0:12 — Tension:** Progress races 0 → 100%. Tiny network/data animation keeps moving. User waits.
- **0:12–0:17 — Failure:** At 100%, UI flashes **“.PSD NOT SUPPORTED.”** Cursor freezes. Everything desaturates.
- **0:17–0:29 — Rewind:** Timeline scrubs backwards. Rebuild the upload box with accepted formats and preflight validation. Invalid file is rejected instantly, before transfer.
- **0:29–0:39 — Better state:** Valid PNG uploads with remaining time, cancel button, and persistent filename.
- **0:39–0:45 — Payoff:** Three labels appear: **VALIDATE EARLY · SHOW PROGRESS · RECOVER CLEANLY**.

### How to make it
Create the whole upload UI in Remotion. Use a cursor-drag component, animated file chip, counter-based progress bar, and a timeline rewind transition. Make the first upload intentionally satisfying so the late rejection feels painful.

**Assets:** PSD/PNG file icons; optional cloud icon. No external screenshots required.

---

# 02 — Your Backend Is Fast. Your App Still Feels Slow.

**Theme:** animation timing / perceived performance  
**Target:** ~45 sec

**Hook:** “Your API can respond in 90 milliseconds and the app can still feel slow.”

### Voiceover spine
Speed isn’t only backend latency. The interface decides when the user *feels* the response. If a button does nothing for half a second, then a drawer slowly glides in, the product feels delayed even when the data was ready instantly. Give immediate click feedback. Keep frequent micro-interactions brief. Use easing so movement accelerates and settles naturally. Make menus originate from the control that opened them. And don’t spring every component like it’s made of rubber. Good motion is almost invisible. It makes the product feel immediate, connected, and calm — without changing the API at all.

### Storyboard
- **0:00–0:05:** Click **Open project**. HUD says **API 92ms ✓**, but drawer crawls in. Text: **WHY DOES THIS FEEL SLOW?**
- **0:05–0:13:** Zoom into timeline: click → dead pause → long animation.
- **0:13–0:22:** Rebuild: instant button press + shorter drawer movement.
- **0:22–0:31:** Show linear vs eased motion using two identical cards and timing curves.
- **0:31–0:38:** Menu first teleports from center, then correctly unfolds from avatar trigger.
- **0:38–0:45:** Same original interaction now feels fast. HUD still says **API 92ms**. Text: **THE BACKEND NEVER CHANGED.**

### How to make it
Use one app window for the entire story. Reuse identical UI before/after so motion is the only variable. Add a `TimingRuler`, `PerformanceHUD`, transform-origin menu, and two easing curves.

**Assets:** avatar placeholder; cursor SVG.

---

# 03 — Search That Pretends Nothing Exists

**Theme:** search UX  
**Target:** ~45 sec

**Hook:** “Your search can have the right result and still make users think it doesn’t.”

### Voiceover spine
Imagine searching for “invoice export.” The feature exists, but the search only matches exact titles, waits for Enter, hides filters, and returns a blank screen for one typo. That’s not a search box. That’s a memory test. A useful search reacts as the query becomes meaningful, tolerates small mistakes when appropriate, highlights why a result matched, preserves useful filters, and gives a recovery path when there’s no exact result. Search isn’t successful when it technically runs a query. It’s successful when the user can get from vague intent to the thing they meant.

### Storyboard
- **0:00–0:05:** User types **invoice export**. Empty result: **0 results**. Behind the panel, the actual “Export invoices” feature is visibly present.
- **0:05–0:12:** Search tries exact match only. Query characters lock into rigid blocks.
- **0:12–0:20:** One typo — `invocie` — makes results disappear completely.
- **0:20–0:31:** UI transforms: suggestions appear, matching terms highlight, filter chips remain visible, near-match result surfaces.
- **0:31–0:39:** No-result state offers **Try “invoice”**, recent searches, and category shortcut.
- **0:39–0:45:** Text: **SEARCH FOR INTENT, NOT PERFECT TYPING.**

### How to make it
Build a fake command/search palette with animated typing. Animate result relevance rather than showing static screenshots. Use highlight masks that sweep over matching words.

**Assets:** search icon; optional command-key icon.

---

# 04 — The Modal That Trapped the User

**Theme:** modal UX  
**Target:** ~45 sec

**Hook:** “If users can’t figure out how to close a popup, they’ll close your product instead.”

### Voiceover spine
A modal interrupts the entire interface, so it has to earn that interruption. The common failure isn’t just a missing X. It’s unclear escape behavior, hidden actions, dangerous defaults, and a dialog that grows until it becomes a second page. If the task is simple, keep the modal focused. Give it an obvious close path. Keep destructive actions visually distinct. Preserve work if closing is accidental. And if the content needs scrolling, navigation, or several decisions, it probably wants to be a real screen. A modal should reduce context — not create another application inside your application.

### Storyboard
- **0:00–0:04:** Giant modal covers app. Cursor searches corners. Text: **HOW DO I CLOSE THIS?**
- **0:04–0:12:** User clicks backdrop: nothing. Esc: nothing. Tiny hidden X appears only on hover.
- **0:12–0:21:** Modal expands with tabs, long text, two scrollbars, six buttons.
- **0:21–0:31:** Freeze. UI peels apart. Simple confirmation becomes compact modal; complex task becomes a full screen.
- **0:31–0:39:** Demonstrate clear close, Esc, cancel, and destructive action hierarchy.
- **0:39–0:45:** Text: **A MODAL IS A PAUSE, NOT A NEW APP.**

### How to make it
Use nested masks to make the bad modal literally grow inside the existing window. For the fix, split it into two paths with a morph transition: compact dialog vs full-page editor.

**Assets:** close icon, warning icon.

---

# 05 — Your Sign-In Button Is Invisible to the Keyboard

**Theme:** keyboard accessibility / focus order  
**Target:** ~45 sec

**Hook:** “Watch what happens when I try to sign in without touching the mouse.”

### Voiceover spine
Tab. Email field. Tab. Password. Tab… and the focus jumps straight past Sign in to a footer link. That tiny mistake can make the entire login unusable for someone navigating by keyboard. Focus order should follow the visual and logical task. Interactive controls need a visible focus state. Custom components need to behave like actual controls, not decorative divs with click handlers. And when a dialog opens, focus should move somewhere sensible. Accessibility isn’t a separate version of the interface. It’s whether the interface still works when the mouse disappears.

### Storyboard
- **0:00–0:06:** Mouse physically slides off screen. Text: **NO MOUSE. SIGN IN.**
- **0:06–0:14:** Animated Tab key drives focus: email → password → footer link, skipping primary button.
- **0:14–0:20:** User presses Enter. Wrong element activates.
- **0:20–0:31:** DOM-like layer rearranges. Focus order is repaired; strong focus ring appears.
- **0:31–0:39:** Open a small dialog and move focus correctly to its first meaningful action.
- **0:39–0:45:** Text: **IF TAB CAN’T REACH IT, IT’S NOT REALLY AVAILABLE.**

### How to make it
Create a reusable `FocusRing` that moves between components based on a timeline. Add a floating Tab-key HUD. Make focus movement the main animation language.

**Assets:** keyboard Tab key SVG or build in CSS.

---

# 06 — Back Should Take Me Back, Not Start Me Over

**Theme:** scroll restoration / state preservation  
**Target:** ~45 sec

**Hook:** “You scroll through 400 rows, open one item, hit Back… and the app sends you to row one.”

### Voiceover spine
This is one of those bugs that doesn’t look dramatic in a screenshot. But use the product for ten minutes and it becomes exhausting. If I open an item from a long list, Back should usually return me to the same place, with my sort, filters, and search state intact. Otherwise every detail view becomes a punishment. Preserve meaningful navigation state. Restore scroll position. Keep filters unless the user resets them. And don’t make them rebuild context you already had. Good navigation has memory. It lets people explore without being afraid of losing their place.

### Storyboard
- **0:00–0:05:** Counter flies past rows: 1…80…220…400. User opens row 417.
- **0:05–0:11:** Detail page. User taps Back.
- **0:11–0:17:** List returns to row 1. Filters vanish. Dramatic zoom out. Text: **START AGAIN.**
- **0:17–0:28:** Show user repeating the journey faster, building frustration as a trail of cursor paths stacks up.
- **0:28–0:38:** Repair state: Back returns directly to row 417 with filter chips and search intact.
- **0:38–0:45:** Text: **GOOD NAVIGATION REMEMBERS CONTEXT.**

### How to make it
Build a virtualized-looking table and animate scroll position using `interpolate()`. Use a breadcrumb/history stack component to visualize preserved state.

**Assets:** none.

---

# 07 — Nine Minutes of Writing. Gone in One Error.

**Theme:** draft persistence / failed submission  
**Target:** ~45 sec

**Hook:** “The send failed. The real bug is that the message disappeared.”

### Voiceover spine
A network request can fail. That’s normal. Destroying nine minutes of user input because it failed is not. Long text, forms, comments, and drafts should survive temporary errors whenever practical. Keep the content in the field. Tell the user what failed. Let them retry. Autosave longer work locally or remotely when it makes sense. And never use a generic error if the next action isn’t obvious. Reliability isn’t pretending nothing ever breaks. It’s designing the failure so the user doesn’t pay for it twice.

### Storyboard
- **0:00–0:06:** Timer reads **09:04** as user finishes a long message.
- **0:06–0:11:** Click Send. Network line snaps. Error toast appears.
- **0:11–0:16:** Textarea clears itself. Silence. Text: **EMPTY.**
- **0:16–0:27:** Timeline rewinds. Rebuild: message stays, error appears inline, Retry button becomes available.
- **0:27–0:38:** Brief autosave indicator: **Saved locally 2s ago**. Network returns. Retry succeeds.
- **0:38–0:45:** Text: **FAIL THE REQUEST. NOT THE USER’S WORK.**

### How to make it
Use a typewriter component for the message, but skip most typing with time jumps. Visualize network status as a tiny line between client and server nodes.

**Assets:** Wi-Fi/offline icon.

---

# 08 — Three UX Laws You Can Actually See

**Theme:** UX principles demonstrated visually  
**Target:** ~45 sec

**Hook:** “UX rules make more sense when you can watch them fail.”

### Voiceover spine
Here are three principles you can feel immediately. First: targets that are tiny take longer to hit, especially on touch. Second: choices get slower when every option screams for equal attention. Third: elements that look related are assumed to belong together. None of that requires a lecture. Make the icon bigger — the cursor lands faster. Give one action priority — the decision becomes easier. Move the label closer to the correct field — the relationship becomes obvious. Good UX principles aren’t magic formulas. They’re useful because they predict where people hesitate.

### Storyboard
- **0:00–0:04:** Text: **DON’T MEMORIZE UX LAWS. WATCH THEM.**
- **0:04–0:15:** Tiny close target. Cursor misses twice. Target expands; hit succeeds immediately.
- **0:15–0:26:** Six equally styled buttons. Cursor hesitates. One becomes primary, others quiet down.
- **0:26–0:37:** Two labels float between two fields. Move labels closer to their inputs; confusion disappears.
- **0:37–0:45:** Three cards lock into place: **TARGET · HIERARCHY · PROXIMITY**.

### How to make it
Treat this like three micro-experiments. Use the same cursor speed and start point before/after so the visual comparison feels fair.

**Assets:** none.

---

# 09 — The Login Form Isn’t Boring. It’s Trust.

**Theme:** login form UX  
**Target:** ~45 sec

**Hook:** “A login screen only has two fields. So why do so many of them feel bad?”

### Voiceover spine
Because every tiny decision is noticeable. Placeholder-only labels disappear as soon as you type. Password rules arrive after the error. The show-password control moves the layout. The submit button activates without explaining what’s missing. And an auth error can wipe both fields. A good login screen is boring in the best way. Labels stay visible. Errors sit beside the thing that needs fixing. Password visibility doesn’t move the interface. Autofill works. And failed authentication doesn’t erase valid input. Two fields are enough to reveal whether a product respects the user’s time.

### Storyboard
- **0:00–0:05:** Minimal login form. Text: **ONLY TWO FIELDS. STILL EASY TO GET WRONG.**
- **0:05–0:13:** Placeholder labels vanish while typing. User forgets which field is active.
- **0:13–0:20:** Password error appears only after submit; both inputs clear.
- **0:20–0:31:** Form rebuilds live: persistent labels, inline state, stable show-password icon, autofill visual.
- **0:31–0:39:** Wrong password error preserves email and password field state appropriately.
- **0:39–0:45:** Text: **LOGIN SHOULD FEEL UNEVENTFUL.**

### How to make it
Use a single `FormField` component with bad/good variants. Morph from placeholder text into persistent floating/above-field labels rather than cutting scenes.

**Assets:** eye / eye-off icon; lock icon.

---

# 10 — Why This Button Looks Expensive

**Theme:** button design / interaction states  
**Target:** ~45 sec

**Hook:** “These two buttons do the same thing. One feels noticeably better.”

### Voiceover spine
The difference isn’t a fancy gradient. It’s the decisions around the button. The label is specific. The contrast is clear. The hit area is comfortable. Hover doesn’t move the layout. Pressing it gives immediate feedback. Loading keeps the button stable instead of swapping it for a random spinner. And disabled doesn’t mean invisible. A polished button communicates state before, during, and after the click. The goal isn’t to decorate the primary action. It’s to remove uncertainty around the most important interaction on the screen.

### Storyboard
- **0:00–0:05:** Two buttons: same words, same location. Text: **SAME ACTION. DIFFERENT FEELING.**
- **0:05–0:13:** Bad button: tiny hit area, weak contrast, hover shifts position.
- **0:13–0:22:** Click changes size; spinner causes layout jump.
- **0:22–0:34:** Rebuild the button: comfortable area, stable width, press scale, loading label, success state.
- **0:34–0:41:** Cursor rapidly tests default → hover → pressed → loading → success.
- **0:41–0:45:** Text: **DESIGN THE STATES, NOT JUST THE RECTANGLE.**

### How to make it
Create a `ButtonStateMachine` component. Keep the button centered throughout and change only one variable at a time so viewers see why each detail matters.

**Assets:** checkmark/spinner icons.

---

# 11 — A Bank Balance Without Context Is Just a Number

**Theme:** financial dashboard information design  
**Target:** ~45 sec

**Hook:** “$4,820. Is that good news or bad news?”

### Voiceover spine
A banking app can show perfectly accurate numbers and still make them hard to understand. A balance needs context. What changed? What’s pending? What’s safe to spend? When is the next bill? Which transaction caused the spike? Instead of turning the screen into a dashboard full of charts, reveal context where the decision happens. Show pending money differently from settled money. Pair unusual spending with the category or merchant. Make dates and signs unambiguous. Financial UI isn’t about showing more data. It’s about helping people answer the next question without doing mental accounting in their head.

### Storyboard
- **0:00–0:05:** Giant **$4,820** floats alone. Text: **GOOD OR BAD?**
- **0:05–0:13:** More raw numbers rain onto the screen: transactions, pending, due dates.
- **0:13–0:21:** User tries to calculate mentally; small calculator bubbles appear and pile up.
- **0:21–0:34:** UI reorganizes: available balance, pending amount, next bill, recent unusual spend.
- **0:34–0:41:** Tap transaction; merchant/category context expands in place.
- **0:41–0:45:** Text: **DATA NEEDS CONTEXT.**

### How to make it
Use animated number morphing and contextual cards that grow out of the number they explain. Avoid copying a real bank’s interface.

**Assets:** generic merchant icons, category icons.

---

# 12 — Your Onboarding Is Asking for Too Much, Too Soon

**Theme:** onboarding friction  
**Target:** ~45 sec

**Hook:** “The user just installed your app. Why are you already asking seven questions?”

### Voiceover spine
Name. Company size. Job title. Phone number. Notifications. Contacts. Location. Before the user has seen any value, the product has turned onboarding into paperwork. Ask only what you need to get them to the first useful moment. Defer optional profile questions. Request permissions when the feature actually needs them, not all at launch. Show progress only when the steps are real. And let users skip what can be skipped. Great onboarding doesn’t explain the whole product. It gets someone to one successful action quickly enough that they want to learn the rest.

### Storyboard
- **0:00–0:05:** User opens app. Seven permission/profile cards slam onto screen. Text: **WELCOME. FILL THIS OUT.**
- **0:05–0:15:** Progress says `1 of 9`; cursor visibly slows.
- **0:15–0:22:** User exits. Funnel counter drops: `100 → 71 → 43` as steps stack.
- **0:22–0:34:** Rebuild to two steps: choose goal → perform first useful action.
- **0:34–0:41:** Optional profile and permission prompts appear later, attached to relevant features.
- **0:41–0:45:** Text: **VALUE FIRST. QUESTIONS LATER.**

### How to make it
Animate onboarding cards as physical obstacles on a path. In the good version, remove them until the path to the first success is almost straight.

**Assets:** generic permission icons.

---

# 13 — Checkout Friction You Don’t Notice Until You Buy

**Theme:** checkout UX  
**Target:** ~45 sec

**Hook:** “The product didn’t lose the sale. The checkout did.”

### Voiceover spine
You’ve already convinced someone to buy. Then checkout asks them to create an account, hides the total until the end, rejects an address without saying why, resets the card form after one error, and makes the discount box look more important than the Pay button. Every extra uncertainty gives the buyer another chance to leave. Keep costs visible. Preserve valid input after errors. Make guest checkout obvious when it exists. Explain exactly what needs fixing. And keep the final action unmistakable. Checkout isn’t the place to be clever. It’s the place to make the decision the customer already made feel safe to finish.

### Storyboard
- **0:00–0:05:** Product card moves smoothly into cart. Text: **SALE WON.** Then checkout loads: **MAYBE NOT.**
- **0:05–0:15:** Forced account prompt, hidden shipping, coupon field dominates.
- **0:15–0:22:** Card error clears several correct fields. Cursor pulls away.
- **0:22–0:34:** Rebuild: guest path, visible total, stable fields, inline address correction.
- **0:34–0:41:** Pay button remains visually dominant; success receipt slides in.
- **0:41–0:45:** Text: **DON’T RESELL THE PURCHASE AT CHECKOUT.**

### How to make it
Use a vertical checkout flow and animate friction as added “distance” between cart and confirmation. Each bad decision physically stretches the path.

**Assets:** generic card/payment icons.

---

# 14 — A Spinner Tells Me Almost Nothing

**Theme:** loading states  
**Target:** ~45 sec

**Hook:** “Seven seconds feels much longer when the screen can’t explain what’s happening.”

### Voiceover spine
A spinner says one thing: wait. It doesn’t tell me whether the app started, whether anything is progressing, or whether it’s stuck. For short waits, you may need almost no loading UI. For predictable work, show progress. For content pages, skeletons can preserve layout while data arrives. For long operations, tell the user what the system is doing and whether they can leave safely. And don’t fake precision you don’t actually have. The best loading state doesn’t make the server faster. It gives the waiting time shape, context, and a clear next expectation.

### Storyboard
- **0:00–0:07:** Spinner rotates. Counter: `1s…3s…5s…7s`. Text: **STILL LOADING?**
- **0:07–0:15:** Duplicate spinner examples stack everywhere: button, page, card.
- **0:15–0:25:** Split by wait type: instant/no loader; skeleton for content; progress for known work.
- **0:25–0:36:** Long export shows current stage and lets user leave while background operation continues.
- **0:36–0:42:** Final app feels calmer even though timer shows same 7 seconds.
- **0:42–0:45:** Text: **GIVE WAITING A SHAPE.**

### How to make it
Use the same seven-second timer in the bad and good versions. That makes the perceived-speed point visible without making unsupported performance claims.

**Assets:** none.

---

# 15 — Pricing Tables Should Help Me Choose

**Theme:** pricing UX  
**Target:** ~45 sec

**Hook:** “If every pricing plan is highlighted, none of them is.”

### Voiceover spine
Pricing pages often present three plans as three equally loud boxes filled with checkmarks. But the user’s real question is simpler: which one fits me, and what changes if I pay more? Make the differences scannable. Group shared features instead of repeating them endlessly. Explain the limit that actually changes the decision. Use a recommendation only when you can justify who it’s for. Keep billing periods and total costs unambiguous. And don’t hide important restrictions in tiny text. A pricing table isn’t a feature database. It’s a decision interface.

### Storyboard
- **0:00–0:05:** Three giant plans flash `BEST`, `POPULAR`, `VALUE`. Text: **WHICH ONE?**
- **0:05–0:14:** Checkmarks duplicate down all columns until screen is visually noisy.
- **0:14–0:22:** Cursor jumps between tiny differences and billing toggle.
- **0:22–0:34:** Table simplifies: common features collapse; meaningful differences remain; one plan gets contextual “Best for teams of 5+”.
- **0:34–0:41:** Monthly/annual cost changes with total clearly displayed.
- **0:41–0:45:** Text: **PRICING IS A DECISION TOOL.**

### How to make it
Animate rows collapsing away to reveal the 3–4 real decision variables. Use a clean price counter and billing toggle.

**Assets:** none.

---

# 16 — Your Empty State Is Part of the Product

**Theme:** empty states  
**Target:** ~45 sec

**Hook:** “For a brand-new user, the empty state might be the entire product.”

### Voiceover spine
Designers often build the perfect populated dashboard and treat the zero-data version as an afterthought. But new users start with zero projects, zero messages, zero reports, and zero history. Don’t greet them with a giant blank rectangle and “No data.” Explain what belongs here. Give them one obvious first action. Add a small example when the result is unfamiliar. And distinguish “nothing created yet” from “nothing matched your search” or “something failed to load.” Empty isn’t one state. It’s several different moments that need different next steps.

### Storyboard
- **0:00–0:05:** Beautiful dashboard preview drains until every card becomes blank. Text: **THIS IS WHAT NEW USERS SEE.**
- **0:05–0:13:** Generic message: `No data.` Cursor wanders.
- **0:13–0:23:** Three empty causes branch: first use / no search results / loading error.
- **0:23–0:35:** First-use screen gets explanation, sample preview, and **Create first project** action.
- **0:35–0:41:** Search-empty and error states get different recovery actions.
- **0:41–0:45:** Text: **EMPTY IS A STATE, NOT A DEAD END.**

### How to make it
Build the populated dashboard first, then animate data cards evaporating. This visually connects what the empty state is preparing the user to create.

**Assets:** optional illustration; can be pure UI.

---

# 17 — Icon-Only Navigation Is a Memory Test

**Theme:** navigation clarity  
**Target:** ~45 sec

**Hook:** “Which one of these icons opens billing?”

### Voiceover spine
A house, a grid, a spark, a briefcase, a sliders icon, and a mysterious hexagon. Icon-only navigation can look beautifully minimal while forcing users to memorize your private visual language. Familiar icons are useful. Unfamiliar destinations usually need labels. Keep the current location obvious. Don’t move navigation items depending on the page. Separate global navigation from actions. And if an icon needs a tooltip every time, that may be evidence the label should simply be visible. Navigation should reduce the number of decisions required to move around — not turn every click into a guess.

### Storyboard
- **0:00–0:05:** Six unlabeled icons. Text: **FIND BILLING.** Timer starts.
- **0:05–0:13:** Cursor hovers three wrong icons; tooltips appear one by one.
- **0:13–0:20:** User finally finds billing; nav then reorders on next page.
- **0:20–0:33:** Rebuild with stable positions, clear active state, concise labels.
- **0:33–0:41:** Collapse to compact nav only after user-triggered action; tooltips remain secondary.
- **0:41–0:45:** Text: **NAVIGATION ISN’T A LOGO QUIZ.**

### How to make it
Make the hook interactive-looking: timer + cursor hesitation. Use icon-to-label morph animation rather than replacing the whole menu.

**Assets:** standard generic navigation icons.

---

# 18 — “No Results” Should Still Be Useful

**Theme:** search/filter empty-state recovery  
**Target:** ~45 sec

**Hook:** “Zero results is not the end of the search. It’s the next UI state.”

### Voiceover spine
The user searches for a customer, applies two filters, and gets zero results. A weak interface just says “Nothing found.” A useful one helps answer why. Show the active filters. Make them removable in one tap. Suggest a broader query when the spelling is close. Preserve the original search so the user can edit it. And distinguish between an empty database and a query that’s too narrow. The goal of a no-results screen isn’t to report zero. The system already knows that. The job is to help the user get from zero to something useful.

### Storyboard
- **0:00–0:05:** Search + filters → giant `0`. Text: **NOW WHAT?**
- **0:05–0:13:** Bad state says only **No results found**.
- **0:13–0:22:** Spotlight reveals hidden active filters causing the zero state.
- **0:22–0:33:** New state shows removable chips, spelling suggestion, and **Clear filters**.
- **0:33–0:40:** Remove one chip; results immediately return underneath.
- **0:40–0:45:** Text: **ZERO SHOULD HAVE A NEXT STEP.**

### How to make it
This is a perfect companion to video 16 but uses search recovery rather than first-time onboarding. Animate result cards returning the instant a restrictive filter chip disappears.

**Assets:** none.

---

# 19 — 03/04/26 Is a Bad Date

**Theme:** ambiguous dates / localization  
**Target:** ~45 sec

**Hook:** “March fourth… or April third?”

### Voiceover spine
`03/04/26` looks compact until two users read two different dates. Dates are data, but they’re also language. If the consequence matters — bookings, payments, deadlines, medicine, travel — remove unnecessary ambiguity. Use the user’s locale when appropriate. Spell out the month when space allows. Keep input and display formats consistent. And don’t make users guess whether the date picker starts on Sunday or Monday, or whether a timezone changed the day after they saved it. A date field should communicate a moment in time, not test which convention the user grew up with.

### Storyboard
- **0:00–0:05:** `03/04/26` fills screen. It splits into **MARCH 4?** and **APRIL 3?**
- **0:05–0:14:** Two users on opposite sides choose different interpretations; booking card duplicates into different days.
- **0:14–0:23:** Date picker and confirmation use different formats. Warning pulse.
- **0:23–0:34:** Rebuild with `4 Mar 2026` / locale-aware variant and explicit timezone where relevant.
- **0:34–0:41:** Input, picker, and confirmation stay consistent.
- **0:41–0:45:** Text: **DATES SHOULD NOT NEED DECODING.**

### How to make it
Use typography as the transition: numeric date characters physically rearrange into a spelled-out month. Avoid tying the story to one country’s “correct” format.

**Assets:** calendar icon, optional globe/timezone icon.

---

# 20 — Don’t Wait Until Submit to Explain the Form

**Theme:** form validation  
**Target:** ~45 sec

**Hook:** “The form knew this was wrong three fields ago. It waited until Submit to tell you.”

### Voiceover spine
There’s a difference between helpful validation and a screen full of red errors while someone is still typing. Validate at the moment it becomes useful. Required formatting can be explained before input. A field can be checked after the user leaves it. Server-only rules can wait until the server knows. When something fails, put the message next to the field, keep valid values intact, and move focus or summary attention to what needs fixing. A form shouldn’t feel like an exam that gets graded at the end. It should help the user finish correctly as they go.

### Storyboard
- **0:00–0:05:** User completes five-field form. Clicks Submit. Entire page turns red.
- **0:05–0:14:** Scroll jumps unpredictably; generic banner: **There are errors**.
- **0:14–0:22:** User hunts for the first problem.
- **0:22–0:34:** Rebuild timing: guidance before input, validation after blur, inline message beside exact field.
- **0:34–0:41:** Submit focuses first unresolved field while preserving everything else.
- **0:41–0:45:** Text: **HELP THEM FINISH. DON’T GRADE THEM.**

### How to make it
Use one form and a red “error wave” for the bad version. In the fix, messages attach directly to fields with small connector lines.

**Assets:** warning/check icons.

---

# 21 — The Table Has 12 Columns. I Need Two.

**Theme:** data-table UX  
**Target:** ~45 sec

**Hook:** “The data is all here. That’s exactly the problem.”

### Voiceover spine
Enterprise tables often become storage containers for every field the database owns. The user gets twelve columns, tiny text, horizontal scrolling, mystery abbreviations, and a checkbox column that pushes the important value off screen. Start with the task. Which columns help make the decision? Keep headers visible while scrolling. Align numbers so they can be compared. Make sort state obvious. Let secondary columns be optional. And keep row actions predictable. A powerful table doesn’t show the most data. It lets someone scan, compare, and act without fighting the grid.

### Storyboard
- **0:00–0:05:** Table expands wider than the phone frame. Text: **EVERYTHING FITS. NOTHING SCANS.**
- **0:05–0:14:** Horizontal scroll hides identity column; header disappears on vertical scroll.
- **0:14–0:22:** Currency and percentages misalign; user’s eyes zig-zag.
- **0:22–0:34:** Columns collapse to core decision set; sticky header/identity column, aligned numerics, clear sort arrow.
- **0:34–0:41:** Optional-columns menu reveals secondary data on demand.
- **0:41–0:45:** Text: **A TABLE IS FOR COMPARISON, NOT STORAGE.**

### How to make it
Build a `DataTable` with configurable columns and animate low-priority columns folding into a “Columns” menu. Use subtle eye-path lines to show scanning difficulty.

**Assets:** sort/filter icons.

---

# 22 — Menus Should Not Make You Hunt

**Theme:** menus / action placement  
**Target:** ~45 sec

**Hook:** “Why is Rename here… but Delete is somewhere completely different?”

### Voiceover spine
Menus become slow when the structure changes every time you open them. The same action moves. Common tasks hide under “More.” Destructive actions sit between everyday commands. Labels switch between nouns and verbs. And nested menus require pixel-perfect steering. Group actions by meaning. Keep recurring items in stable positions. Put dangerous actions apart from routine ones. Prefer clear labels over clever icons. And avoid extra nesting when a flat group is easier to scan. A menu feels fast when the user can predict where the next action will be before they open it.

### Storyboard
- **0:00–0:05:** Three-dot menu opens. Text: **FIND RENAME.**
- **0:05–0:13:** Menu order reshuffles between two files; cursor overshoots.
- **0:13–0:21:** Nested submenu closes as cursor crosses a tiny gap.
- **0:21–0:33:** Rebuild into stable groups: edit actions / organization / danger zone.
- **0:33–0:41:** User opens three different item menus; Rename remains in same predictable location.
- **0:41–0:45:** Text: **PREDICTABLE MENUS FEEL FASTER.**

### How to make it
Use cursor-path traces to visualize extra travel. For the submenu failure, exaggerate the disappearing panel once, then fix with simpler structure.

**Assets:** common action icons.

---

# 23 — Four Tiny Layout Choices That Change the Whole Screen

**Theme:** visual hierarchy / UX laws  
**Target:** ~45 sec

**Hook:** “Nothing on this screen is technically broken. It still feels wrong.”

### Voiceover spine
Sometimes the problem isn’t a missing feature. It’s that every element is asking for attention at the same volume. Watch four small changes. Increase contrast between the page title and metadata. Group controls that belong together. Add space between unrelated sections instead of putting borders around everything. And make one primary action visually dominant. Same content. Same features. But the eye now knows where to start, what belongs together, and what to do next. Visual hierarchy isn’t decoration. It’s the interface explaining its structure before the user reads a word.

### Storyboard
- **0:00–0:05:** Flat dashboard with identical weights. Text: **NOT BROKEN. STILL CONFUSING.**
- **0:05–0:13:** Heatmap-like gaze dots scatter everywhere.
- **0:13–0:20:** Change 1: title hierarchy.
- **0:20–0:27:** Change 2: grouping/proximity.
- **0:27–0:34:** Change 3: whitespace replaces excess dividers.
- **0:34–0:41:** Change 4: primary action gains emphasis; eye path becomes simple.
- **0:41–0:45:** Text: **HIERARCHY IS INSTRUCTIONS WITHOUT WORDS.**

### How to make it
Keep all text/content identical while changing only size, spacing, grouping, and emphasis. Use animated gaze dots to make the improvement intuitive.

**Assets:** none.

---

# 24 — One Toggle Signed Out 24 People

**Theme:** settings scope / destructive consequences  
**Target:** ~45 sec

**Hook:** “This toggle looks personal. It actually affects the whole company.”

### Voiceover spine
Settings are dangerous when the visual scale doesn’t match the real-world consequence. A tiny toggle can rotate an API key, disable a workspace, remove access, or sign out an entire team. The control needs to communicate scope before activation. Say who or what will be affected. Separate personal settings from organization settings. Use confirmation when the consequence is difficult to reverse — but make the confirmation specific, not a generic “Are you sure?” And for high-impact actions, show the effect in plain language. Small control. Large blast radius. The interface should make that difference impossible to miss.

### Storyboard
- **0:00–0:05:** Tiny toggle: **Require SSO**. Cursor clicks casually.
- **0:05–0:11:** 24 avatar circles instantly turn grey. Counter: **24 sessions ended**.
- **0:11–0:20:** Zoom out reveals toggle lived beside harmless personal preferences.
- **0:20–0:32:** Settings restructure into **Your account** and **Organization**. Impact label: **Affects 24 members**.
- **0:32–0:40:** Confirmation states the exact consequence and recovery path.
- **0:40–0:45:** Text: **SHOW THE BLAST RADIUS BEFORE THE CLICK.**

### How to make it
Make member avatars the storytelling device. When the bad toggle fires, animate a connection graph disconnecting from the organization node.

**Assets:** generic user avatars/icons.

---

# 25 — Why Some Cards Feel Like Buttons and Others Don’t

**Theme:** card design / affordance  
**Target:** ~45 sec

**Hook:** “Can you click this card? The design should answer before the cursor does.”

### Voiceover spine
Cards get confusing when they’re simultaneously containers, links, menus, checkboxes, and action bars. If the whole card opens a detail view, make that behavior visually consistent. If only the title is a link, don’t add a giant hover shadow to the entire surface. Keep secondary actions separate from the primary card action. Avoid stacking too many borders inside borders. And don’t use hover as the only clue — touch users never see it. A good card has a clear reading order and a clear interaction model. The user should know what’s clickable before experimenting.

### Storyboard
- **0:00–0:05:** Product/project card. Cursor circles it. Text: **WHAT CAN I CLICK?**
- **0:05–0:14:** Hover raises whole card, but click only works on tiny title.
- **0:14–0:21:** Three-dot menu click accidentally triggers card navigation.
- **0:21–0:33:** Rebuild with one interaction model: full-card navigation + isolated secondary action.
- **0:33–0:40:** Keyboard focus and touch tap demonstrate same predictable behavior.
- **0:40–0:45:** Text: **MAKE THE HIT AREA MATCH THE VISUAL PROMISE.**

### How to make it
Use pointer hit-area overlays briefly to reveal the mismatch between visual card boundaries and actual clickable region.

**Assets:** optional thumbnail images; menu icon.

---

# 26 — Accessibility Problems Hiding in a “Clean” UI

**Theme:** accessibility fundamentals  
**Target:** ~45 sec

**Hook:** “This interface looks clean. Now remove three things the designer assumed you had.”

### Voiceover spine
First remove perfect vision: low-contrast labels start disappearing. Remove the mouse: focus becomes invisible and some controls can’t be reached. Remove color as the only signal: green and red status dots become meaningless without labels or icons. Accessibility problems often hide because the designer is testing the interface with the exact abilities and device they built it with. Use sufficient contrast. Keep visible focus. Pair color with another cue. Give controls understandable names. And respect reduced-motion preferences. Accessible design isn’t adding a special mode. It’s removing assumptions from the default one.

### Storyboard
- **0:00–0:05:** Beautiful polished dashboard. Text: **LOOKS CLEAN. TEST THE ASSUMPTIONS.**
- **0:05–0:13:** Contrast simulation fades secondary labels until they nearly disappear.
- **0:13–0:21:** Cursor vanishes. Tab navigation reveals missing focus.
- **0:21–0:29:** Color drains from green/red statuses; meaning disappears.
- **0:29–0:39:** Rebuild: stronger contrast, focus rings, icons + labels, reduced-motion toggle.
- **0:39–0:45:** Text: **ACCESSIBLE = FEWER ASSUMPTIONS.**

### How to make it
Use visual simulations carefully as communication devices, not as claims that one filter represents every user. The strongest part is the before/after interaction itself.

**Assets:** status icons, accessibility icon.

---

# 27 — Refresh Shouldn’t Delete My Filters

**Theme:** filters / state persistence  
**Target:** ~45 sec

**Hook:** “Six filters. One refresh. Back to 1,204 rows.”

### Voiceover spine
The user narrowed twelve hundred rows down to fourteen. Status, owner, date, region, risk, sort order — all chosen deliberately. Then the data refreshes and the interface silently resets everything. Filters are part of the user’s working context. Keep them through refreshes. Make active filters visible. Show how many are applied. Let users clear one without clearing all. For complex workflows, consider saving useful views. And if the system must reset something because it’s no longer valid, say exactly what changed. A refresh should refresh the data — not erase the question the user was asking.

### Storyboard
- **0:00–0:06:** Filter chips stack until table count becomes **14 results**.
- **0:06–0:11:** User clicks Refresh.
- **0:11–0:17:** Chips vanish. Counter explodes back to **1,204**. Text: **WHY?**
- **0:17–0:28:** Rebuild refresh: spinner affects only data layer; filter bar remains pinned and unchanged.
- **0:28–0:38:** Remove one filter, show count updating; save current configuration as a named view.
- **0:38–0:45:** Text: **REFRESH THE DATA. KEEP THE CONTEXT.**

### How to make it
Separate the screen into two conceptual layers: query state and result data. During refresh, animate only the result layer. This visually explains the product principle without extra narration.

**Assets:** refresh/filter icons.

---

# Suggested Publishing Order

Do not publish these in the same order as the source pack. Rotate categories so consecutive posts look different:

1. Backend Fast / UI Slow
2. Upload Rejected at 100%
3. Pricing Table Decision
4. Lost Draft on Send
5. Button States
6. Scroll Position Lost
7. Accessibility Assumptions
8. Checkout Friction
9. Search Intent
10. Dangerous Settings Scope
11. Loading States
12. Card Affordance
13. Onboarding Friction
14. Date Ambiguity
15. Modal Trap
16. Banking Context
17. Filter Persistence
18. Keyboard Sign-In
19. Data Table Overload
20. Empty State First Use
21. Menu Predictability
22. Form Validation
23. Navigation Labels
24. Visual Hierarchy
25. No-Results Recovery
26. Login Form Details
27. UX Laws Demonstration

## Production Rule for the Whole Season

Use the source Reels to discover **problems**, not to determine your visuals. Each finished video should look like a miniature product experiment made specifically for your channel:

**Hook → fail visibly → explain why → rebuild live → show payoff.**

That structure is ideal for Remotion because the UI itself becomes the animation. It also reduces the need for copyrighted screenshots or creator footage.

## Asset Strategy

Most videos can be made with generated UI and a small reusable icon set. For real products or standards mentioned in future scripts, collect official logos/screenshots only when they materially improve the story. Otherwise use fictional interfaces so the viewer focuses on the principle rather than the brand.

## Next Expansion

These 27 are the **core season**. After publishing data shows which categories perform best, each strong theme can be expanded into narrower 30–45 second videos — for example search can branch into autocomplete, typo tolerance, command palettes, filtering, recent queries, and no-results recovery — without recycling the same story.
