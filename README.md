# Visual QA v0.1

Consent-first AI-generated browser QA for GitHub Copilot in VS Code.

## V0.1 behavior

1. Copilot completes a browser-visible development task.
2. Its completion response asks: **Run Visual QA on what I just built?**
3. Nothing QA-specific is generated before the user accepts.
4. The user replies `yes` or invokes `/visual-qa`.
5. The `visual-qa` skill derives acceptance criteria, generates a temporary Playwright test, runs it, captures visual/runtime evidence, and reports PASS/FAIL.

## Why the Stop hook does not launch QA

A Stop hook can run a shell command at the end of an agent turn, but using it to force another agent turn would itself invoke the model before consent. V0.1 therefore keeps the hook token-free: it records a lightweight lifecycle marker only. A Copilot rule adds the consent question to the already-running completion response. The skill does not activate until the user explicitly accepts.

## Structure

```text
visual-qa/
├── plugin.json
├── README.md
├── LICENSE
├── skills/
│   └── visual-qa/
│       └── SKILL.md
├── scripts/
│   └── on-stop.mjs
└── com.github.copilot/
    ├── commands/
    │   └── visual-qa.md
    ├── hooks/
    │   └── hooks.json
    └── rules/
        └── visual-qa.md
```

## Local prerequisites

- Current VS Code with GitHub Copilot
- Agent Plugins enabled (`chat.plugins.enabled`)
- Agent hooks enabled (`chat.useHooks`)
- Node.js available for the lightweight Stop hook

## Local installation / testing

Agent Plugin installation UI and commands can change while the feature evolves. In VS Code, enable Agent Plugins and install this folder/repository as a local Agent Plugin using the currently available Agent Plugins workflow. After installation, verify that `visual-qa` appears under configured Skills and that the plugin is enabled for the workspace.

For an initial smoke test, open a disposable web project and ask Copilot Agent to implement a small visible feature, for example:

> Add a button labeled "Open welcome" that opens a modal with the heading "Welcome" and a Close button.

Expected behavior after Copilot finishes:

> **Run Visual QA on what I just built? Reply `yes` or run `/visual-qa`.**

Reply `yes`. Only then should the skill inspect the feature for QA, derive acceptance criteria, and generate/run Playwright.

## V0.1 limitations

- The consent prompt is enforced by an agent rule, not rendered as native VS Code buttons.
- Hooks are harness-specific and currently evolving in VS Code.
- Visual QA is intended for local/dev web applications.
- Playwright installation requires separate permission if it is not already present.
