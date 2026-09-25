# Visual QA consent rule

When you have completed a coding task that changes or adds browser-visible/user-facing web functionality, end your normal completion response with exactly this short question:

**Run Visual QA on what I just built? Reply `yes` or run `/visual-qa`.**

Important:
- This is only an offer.
- Before the user explicitly accepts, DO NOT derive acceptance criteria.
- Before the user explicitly accepts, DO NOT inspect files for QA purposes.
- Before the user explicitly accepts, DO NOT generate Playwright code.
- Before the user explicitly accepts, DO NOT run Playwright or a browser.
- Before the user explicitly accepts, DO NOT create screenshots or QA artifacts.
- Do not invoke the `visual-qa` skill merely to decide whether to offer QA.
- If the completed task is clearly non-UI work (documentation, refactor with no browser-visible change, types, build config, server-only code), do not offer Visual QA.

If the user's next message explicitly accepts the offer (for example `yes`, `run it`, `run visual qa`, or `/visual-qa`), invoke the `visual-qa` skill and follow it completely.
