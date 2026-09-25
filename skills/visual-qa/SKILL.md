---
name: visual-qa
description: Generate and execute Playwright-based visual QA for browser-visible functionality after the user explicitly approves Visual QA. Use only after explicit approval such as "yes", "run it", "run visual qa", or /visual-qa following a completed development task.
---

# Visual QA

You are the QA pass that runs AFTER a user has explicitly approved testing of functionality that was just implemented.

## Hard consent boundary

Do not use this skill proactively.

The user must have explicitly accepted Visual QA before any work in this skill begins. If explicit approval is absent, stop and ask only:

**Run Visual QA on what I just built? Reply `yes` or run `/visual-qa`.**

Before consent, never generate tests, acceptance criteria, screenshots, test plans, or perform QA-specific code inspection.

Once consent exists, do not ask for a second QA confirmation.

## Goal

Validate the user's requested browser-visible functionality from the perspective of a real user. Prefer observable behavior over implementation details.

For V0.1, use Chromium only and create temporary artifacts under `.visualqa/`.

## 1. Recover the feature request

Use the immediately preceding development request as the source of truth.

Extract only requirements stated or strongly implied by that request. Do not invent product requirements.

Then inspect the implementation needed to locate:
- affected route(s)
- relevant components
- app start command
- expected user interactions
- expected visible states

Inspect the current git diff when useful to understand what was just changed. Do not revert or rewrite unrelated changes.

## 2. Derive concise acceptance criteria

Create the smallest set of observable criteria that proves the requested functionality works.

Examples of valid criteria:
- requested control is visible
- clicking the control opens the requested UI
- requested text/options are visible
- navigation reaches the expected page
- submitted input produces the requested visible state
- important UI is not clipped or outside the viewport
- no new uncaught page error occurs during the tested flow

Avoid criteria about internal component names, state variables, CSS classes, implementation libraries, or private functions unless the user's request specifically requires them.

## 3. Determine Playwright availability

First inspect the project for an existing Playwright setup and reuse it when practical.

Preferred detection signals:
- `@playwright/test` in package.json
- `playwright.config.*`
- existing Playwright test directories

If Playwright is not installed, explain that Visual QA needs Playwright and ask permission before installing dependencies. Dependency installation is separate from the user's approval to run QA because it modifies the project/environment.

Prefer:

`npm install -D @playwright/test`

and Chromium only:

`npx playwright install chromium`

Adapt commands for pnpm/yarn/bun when the repository clearly uses one of them.

## 4. Create temporary QA files

Use this structure:

`.visualqa/`
- `current/test.spec.ts`
- `current/acceptance-criteria.json`
- `current/result.json` when available
- `artifacts/` for screenshots/traces

Do not place generated V0.1 tests in the application's permanent test suite.

If `.visualqa/` is not already ignored, prefer not to modify `.gitignore` automatically in V0.1. Tell the user the directory is temporary.

## 5. Generate the Playwright test

Generate the minimum test necessary to validate the acceptance criteria.

Prefer resilient, user-facing locators in this order where appropriate:
1. `getByRole`
2. `getByLabel`
3. `getByPlaceholder`
4. `getByText`
5. `getByTestId`

Avoid brittle CSS/XPath selectors unless there is no reasonable accessible/user-facing locator.

The test should capture:
- console errors
- uncaught page errors
- failed requests relevant to the tested feature
- screenshots at visually significant states

Do not fail solely because of unrelated pre-existing console/network noise. Report such noise separately when identifiable.

Use a desktop viewport for V0.1 unless the request specifically concerns responsive/mobile behavior.

## 6. Start or locate the application

Inspect package scripts and project documentation to determine the normal development command and local URL.

If a server is already running, reuse it when possible.

If starting a server requires executing a command, follow the host's normal command-permission behavior.

Never guess a production URL or test a live production system unless the user explicitly asked for that.

## 7. Execute

Run only the generated Visual QA test, preferably in Chromium.

Capture screenshots into `.visualqa/artifacts/`.

Enable a Playwright trace on failure when compatible with the existing setup.

## 8. Visually inspect results

Use the captured screenshots as evidence, not merely the DOM assertions.

Check only things that can reasonably be judged from the available evidence, including:
- requested element/state is actually visible
- obvious clipping or overlap
- obvious horizontal overflow
- modal/dropdown/popover placement is usable
- requested copy/content is visible
- resulting visual state matches the user's request

Do not claim subjective design quality unless the user supplied a design requirement or reference.

## 9. Report

Return a concise report with one of these outcomes:

### PASS
State what flow was tested and which acceptance criteria passed. Mention screenshots/artifacts created.

### FAIL
State:
- failing criterion
- expected behavior
- observed behavior
- relevant assertion/runtime error
- screenshot/trace evidence when available
- likely cause only when supported by evidence

If it fails, offer to fix the implementation and rerun Visual QA. Do not automatically modify application code unless the user approves the fix.

## Safety / non-destructive behavior

- Never submit real purchases, payments, destructive account actions, or irreversible operations.
- Prefer test/local data.
- Do not expose secrets in generated tests or reports.
- Do not commit or push generated QA artifacts unless explicitly asked.
