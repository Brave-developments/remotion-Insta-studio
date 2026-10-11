/**
 * Narration for the remaining UI-MOTION-LAB reels, keyed by bank entry number.
 * Entries 1 and 2 are already rendered.
 *
 * The bank ships a "Voiceover spine" of 90–100 words per entry. That measures
 * ~30s against a 45s cut, so each spine is expanded here to 130–140 words while
 * keeping the spine's own argument and order.
 */
module.exports = {
  3: `Imagine searching for invoice export when the feature exists, and getting a blank screen.
Most search boxes only match exact titles, wait for Enter, and hide the filters.
One typo and every result disappears, so the user assumes the feature was removed.
That is not search, that is a memory test.
A useful search reacts as the query becomes meaningful instead of waiting for perfection.
It tolerates small mistakes, highlights why something matched, and keeps the filters on screen.
It also tells you what it actually searched, so nothing feels broken.
When there is no exact result, it offers a near match, a recent query, or a shortcut.
Search succeeds when a vague intent arrives at the thing the person meant.
Match intent, not perfect typing.
Then the box stops being a wall and becomes a way in.`,
  4: `A modal interrupts the whole interface, so it has to earn that interruption.
The common failure is not only a missing close icon.
It is unclear escape behaviour, hidden actions, dangerous defaults, and a dialog that grows.
The escape path should be the most obvious thing on the screen.
If the task is simple, keep the modal focused and give it an obvious way out.
Keep destructive actions visually distinct, and preserve the work if someone closes by accident.
If the content needs scrolling, navigation, or several decisions, it probably wants to be a real screen.
Watch a user hunt for the corner button and you have already lost their attention.
A modal should reduce context, not build another application inside your application.
Pause the user for one decision, then hand them back where they were.`,
  5: `Watch what happens when I try to sign in without touching the mouse.
Tab to email, tab to password, tab again, and focus jumps past the button.
It lands on a footer link while the primary action sits unreachable.
That tiny mistake can make an entire login unusable for keyboard navigation.
Focus order should follow the visual and logical order of the task.
Interactive controls need a visible focus state so the eye can follow the key.
Custom components must behave like real controls, not decorative divs with click handlers.
Accessibility is not a separate version of the interface.
It is whether the interface still works when the mouse disappears.
If tab cannot reach it, it is not really available.`,
  6: `You scroll through four hundred rows, open one item, hit back, and land at row one.
This bug does not look dramatic in a screenshot.
Use the product for ten minutes and it becomes exhausting.
Back should return you to the same place with sort, filters and search intact.
Otherwise every detail view is a punishment for having looked.
Preserve meaningful navigation state and restore the scroll position.
Keep the filters unless the user resets them on purpose.
Do not make people rebuild context that you already had.
The second trip through the list is entirely your fault.
Good navigation has memory, and memory is what makes exploration safe.
Let people look without being afraid of losing their place.`,
  7: `The send failed, and the real bug is that the message disappeared.
A network request failing is normal; destroying nine minutes of input is not.
The timer reads nine minutes and the textarea clears itself anyway.
Keep the content in the field and tell the user what failed.
Let them retry instead of asking them to write it again.
Autosave longer work locally or remotely when it makes sense.
Never show a generic error if the next action is not obvious.
An inline error and a retry button beat any toast.
Reliability is not pretending nothing ever breaks.
It is designing the failure so the user does not pay twice.
Fail the request, not the person's work.`,
  8: `Do not memorise UX laws; watch them fail in front of you.
You do not need the theory until you have seen the cost.
First, tiny targets take longer to hit, especially on touch.
The cursor misses twice, then the target expands and the hit lands.
Second, choices get slower when every option screams for equal attention.
Six identical buttons make a decision feel expensive.
Give one action priority and the decision becomes easy again.
Third, elements that look related are assumed to belong together.
Move a label closer to its field and the confusion disappears.
None of that requires a lecture, only a demonstration.
Target, hierarchy, proximity, three cards locking into place.
Good principles are useful because they predict where people hesitate.`,
  9: `A login screen has only two fields, so why do so many feel bad?
Because every tiny decision on it is noticeable.
Placeholder labels disappear the moment you start typing.
Password rules arrive after the error, when it is too late to use them.
The show password control shifts the layout, and the submit button glows without saying what is missing.
An auth error can wipe both fields and the user starts again.
A good login screen is boring in the best possible way.
Labels stay visible and errors sit beside the thing that needs fixing.
Password visibility does not move the interface, and autofill just works.
Failed authentication should never erase valid input.
Two fields are enough to reveal whether a product respects your time.`,
  10: `These two buttons do the same thing, and one feels noticeably better.
The difference is not a fancy gradient; it is the decisions around it.
The label is specific, the contrast is clear, the hit area is comfortable.
Hover does not move the layout, and pressing gives immediate feedback.
Loading keeps the button stable instead of swapping it for a random spinner.
Disabled does not mean invisible; it means explained.
Click and watch the size change, then the spinner jump the page.
Now rebuild it: stable width, press scale, loading label, success state.
Run the cursor through default, hover, pressed, loading and success.
A polished button communicates state before, during and after the click.
Design the states, not just the rectangle.`,
  11: `Four thousand eight hundred and twenty dollars. Good news or bad news?
A banking app can be perfectly accurate and still be unhelpful.
What changed, what is pending, what is actually safe to spend.
Numbers rain onto the screen and the user starts doing mental accounting.
Calculator bubbles pile up while the answer should have been obvious.
Reveal context where the decision happens, not on a separate dashboard.
Show pending money differently from settled money.
Pair unusual spending with the merchant and the category, in place.
Make dates and signs unambiguous, because money has no tone of voice.
Financial interface is not about showing more data.
It is about answering the next question before it is asked.`,
  12: `The user just installed your app, and you are already asking seven questions.
Name, company size, job title, phone number, notifications, contacts, location.
Progress says one of nine and the cursor visibly slows.
People exit, and the funnel drops from a hundred to forty.
Ask only what you need to reach the first useful moment.
Defer the optional profile questions until someone cares enough to answer.
Request permissions when the feature needs them, not all at launch.
Show progress only when the steps are real.
Let people skip what can be skipped, and say so out loud.
Rebuild it as two steps: choose a goal, then perform the first action.
Great onboarding does not explain the whole product.
It gets someone to one successful action quickly enough that they want the rest.`,
  13: `You already convinced someone to buy, and then checkout lost them.
Create an account, hide the total, reject the address without saying why.
Reset the card form after one error and highlight the coupon box.
Every extra uncertainty is another chance to leave.
The product did not lose the sale; the checkout did.
Keep costs visible from the first screen to the last.
Preserve valid input after errors instead of clearing the whole form.
Make guest checkout obvious when it exists, and explain exactly what needs fixing.
Keep the final action unmistakable and visually dominant.
Checkout is not the place to be clever.
It is the place to make a decision the customer already made feel safe.`,
  14: `Seven seconds feels much longer when the screen cannot explain itself.
A spinner says one thing: wait.
It does not tell me whether the app started or whether it is stuck.
For short waits you may need almost no loading interface at all.
For predictable work, show real progress instead of an indeterminate circle.
For content pages, a skeleton preserves the layout while data arrives.
For long operations, say what the system is doing and whether you can leave.
Do not fake precision you do not actually have.
The best loading state does not make the server faster.
It gives the waiting time shape, context and a clear next expectation.
Then the same seven seconds feel calmer.`,
  15: `If every plan is highlighted, none of them is.
Three equally loud boxes full of checkmarks is a database, not a decision.
The real question is simpler: which one fits me, and what changes if I pay more.
Make the differences scannable and the shared features quiet.
Group what is identical instead of repeating it down every column.
Explain the limit that actually changes the decision.
Use a recommendation only when you can say who it is for.
Keep billing periods and total cost unambiguous, with no small print surprises.
Hide an important restriction in tiny text and trust leaks.
A pricing table is a decision interface, not a feature inventory.
Help me choose and the choice gets made.`,
  16: `For a brand new user, the empty state might be the entire product.
Zero projects, zero messages, zero reports, zero history.
We build the perfect populated dashboard and treat zero data as an afterthought.
Then we greet a new user with a blank rectangle and the words no data.
Explain what belongs here instead.
Give one obvious first action and a small example when the result is unfamiliar.
Distinguish nothing created yet from no results for that search.
Also distinguish both from something that simply failed to load.
Empty is not one state; it is several moments with different next steps.
Each one needs its own recovery action, not the same shrug.
Then the first screen teaches instead of apologising.`,
  17: `Which one of these six icons opens billing?
A house, a grid, a spark, a briefcase, sliders, and a mysterious hexagon.
Icon-only navigation can look beautifully minimal while forcing people to memorise your private language.
The cursor hovers three wrong icons before the tooltip finally helps.
Then the navigation reorders on the next page and the test starts again.
Familiar icons are useful; unfamiliar destinations usually need labels.
Keep the current location obvious and the positions stable.
Do not move items depending on which page you are on.
Separate global navigation from the actions that belong to one screen.
If an icon needs a tooltip every time, the label should simply be visible.
Navigation should reduce decisions, not turn every click into a guess.
Then it stops being a logo quiz.`,
  18: `Zero results is not the end of the search; it is the next interface state.
The user searched for a customer, applied two filters, and got nothing.
A weak interface simply says nothing found and stops talking.
A useful one explains why the result is zero.
Show the active filters and make them removable in a single tap.
Suggest a broader query when the spelling is close.
Preserve the original search so the person can edit it instead of retyping.
Distinguish an empty database from a query that is simply too narrow.
Remove one chip and the results return underneath immediately.
The system already knows it is zero; the job is to reach something useful.
Zero should have a next step attached to it.`,
  19: `March fourth, or April third?
The string looks compact until two people read two different dates.
Dates are data, but they are also language, and language is ambiguous.
Where the consequence matters, remove the ambiguity completely.
Bookings, payments, deadlines, medicine and travel all qualify.
Use the locale when appropriate and spell out the month when there is room.
Keep the input format and the display format identical.
Do not make people guess whether the picker starts on Sunday or Monday.
Do not let a timezone move the day after they saved it.
Show the confirmation in the same format the field used.
A date field should communicate a moment, not test a convention.
Then nobody has to decode anything.`,
  20: `The form knew this was wrong three fields ago and waited until submit.
Click, the page turns red, and the scroll jumps somewhere else.
That is not validation; it is grading.
Validate at the moment the information becomes useful.
Explain required formatting before the person types, not after they fail.
Check a field once the user leaves it, and put the message beside it.
Server-only rules can wait until the server actually knows.
Keep every valid value intact when something else fails.
Move focus to what needs fixing instead of shouting from a banner.
Help people finish correctly as they go.
A form should not feel like an exam graded at the end.`,
  21: `The data is all here, and that is exactly the problem.
Twelve columns, tiny text, horizontal scrolling, and mystery abbreviations.
A checkbox column pushes the important value off the edge of the screen.
Enterprise tables become storage containers for every field the database owns.
Start with the task instead of the schema.
Which columns actually help someone make the decision in front of them.
Keep headers visible while scrolling and align numbers so they compare.
Make the sort state obvious and the row actions predictable.
Let secondary columns exist behind a menu rather than on the page.
Everything fits, and nothing scans, which is the same as showing nothing.
A powerful table lets someone scan, compare and act without fighting the grid.`,
  22: `Why is rename here while delete sits somewhere completely different?
Menus get slow when the structure changes every time you open them.
The same action moves, common tasks hide under more, and labels switch between nouns and verbs.
Destructive actions sit between everyday commands where a fast click can reach them.
Nested menus need pixel-perfect steering and the cursor overshoots.
Group actions by meaning and keep recurring items in stable positions.
Put dangerous actions apart from routine ones, always in the same corner.
Prefer clear labels over clever icons, and avoid nesting a flat group.
Open three different menus and rename should stay in the same predictable place.
Predictable menus feel faster because the decision was already made.
Then nobody has to hunt.`,
  23: `Nothing on this screen is technically broken, and it still feels wrong.
Every element is asking for attention at exactly the same volume.
The gaze dots scatter because nothing tells the eye where to begin.
Watch four small changes instead of rebuilding the feature.
First, increase the contrast between the page title and the metadata.
Second, group the controls that actually belong together.
Third, add space between unrelated sections instead of drawing borders around everything.
Fourth, make one primary action visually dominant and quiet the rest.
Same content, same features, and suddenly the eye knows where to start.
Four edits, no new features, and the screen finally reads.
Hierarchy is instructions without words.
The interface explains its structure before the user reads a single line.`,
  24: `This toggle looks personal, and it affects the whole company.
A tiny switch can rotate an API key or disable a workspace.
One casual click and twenty-four sessions end at the same moment.
Twenty-four people should not depend on one unlabelled switch.
Small control, large blast radius, and the interface showed neither.
The visual scale must match the real world consequence before activation.
Say who or what will be affected, in plain language.
Separate personal settings from organisation settings so nobody confuses the two.
Confirm with the exact consequence and a recovery path, not are you sure.
Show the blast radius before the click, not after it.
Then a dangerous action looks dangerous while it still costs nothing.`,
  25: `Can you click this card? The design should answer before the cursor does.
The whole surface raises on hover, and only the tiny title actually works.
Then the three-dot menu navigates instead of opening, which nobody expected.
Choose one interaction model and apply it to every card on the page.
Keep secondary actions separate from the primary card action.
Do not use hover as the only clue; touch users never see it.
Keyboard focus and touch tap should behave identically.
Make the hit area match the visual promise and experimentation stops.
A good card has a clear reading order and a clear interaction model.
The user should know what is clickable before trying.`,
  26: `This interface looks clean; now remove three things the designer assumed you had.
Remove perfect vision and the low contrast labels start disappearing.
Remove the mouse and the focus becomes invisible, so controls cannot be reached.
Remove colour as the only signal and the green and red dots mean nothing.
Those problems hide because the designer tests with their own abilities and device.
Use sufficient contrast, keep focus visible, and pair colour with another cue.
Give every control an understandable name and respect reduced motion preferences.
Accessible design is not a special mode you add later.
It is removing assumptions from the default one.
Then the same screen works for more people without changing.`,
  27: `Six filters, one refresh, and you are back to twelve hundred rows.
The user narrowed the list down to fourteen results on purpose.
Status, owner, date, region, risk and sort order were all chosen deliberately.
Then the data refreshes and the interface silently resets every decision.
Filters are part of the working context, not decoration you can discard.
Keep them through refreshes and pin the filter bar where it was.
Show how many are applied and let one be cleared without clearing all.
If something must reset because it is no longer valid, say exactly what changed.
Save useful views for complex workflows so the question survives a reload.
Refresh the data, never the question the user was asking.`,
};
