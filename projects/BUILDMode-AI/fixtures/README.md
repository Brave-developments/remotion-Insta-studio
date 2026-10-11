# Original functional local fixtures

Open `index.html` in a browser. It contains six original interfaces: dashboard, persistent Kanban, baseline/redesigned landing page, playable dodge game, valid CSV export, and metadata-only rename preview with rollback mapping. No installation or network access is needed.

The Kanban supports drag and a keyboard-accessible column selector. Browser local storage persists cards and the game high score. Signup validation is entirely local and sends nothing. Rename preview touches synthetic metadata only; it does not rename user files or claim AI classification. Revenue/chart values are explicitly synthetic. Dodge gameplay is functional; rendered Reel gameplay remains a deterministic motion illustration, not captured first-pass model output.

Run `node verify.cjs` here for focused fixture-logic checks. `verification.json` states the exact scope. Browser interaction acceptance and model experiments have not been performed by that check. The tests do not establish that an external coding tool produced any fixture, followed project rules, won a race or passed an instruction-trap experiment.

`node verify-browser.cjs` additionally opens the original fixtures in the cached local Chrome runtime. Seven actual browser interaction checks passed: dashboard action, Kanban add/move/reload persistence, Kanban delete persistence, redesign/function retention, CSV escaping, rename rollback, and game animation/restart. No browser runtime errors were observed. See `browser-verification.json` and the six genuine original-interface PNGs in `captures/`. This browser check still does not run or compare external AI models, verify mouse drag, assess keyboard gameplay end to end, or validate an AI classifier.

Related Reels: D01R2 dashboard, D02R2 Kanban, D03R2 redesign, D06R1 CSV, D06R2 dodge, D07R2 rename workflow. Other Reels contain directed experiments that still require access to the selected external tools and genuine recordings.
