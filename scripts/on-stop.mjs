import fs from "node:fs";

// V0.1 deliberately performs NO LLM work and NO test generation here.
// The Stop hook is only a lifecycle marker. The consent prompt itself is
// enforced by the Copilot rule so that declining QA does not start another
// model turn.
//
// Hook input is JSON on stdin in supported VS Code/Copilot harnesses.
let input = "";
for await (const chunk of process.stdin) input += chunk;

try {
  const event = input ? JSON.parse(input) : {};
  const cwd = event.cwd || process.cwd();
  const dir = `${cwd}/.visualqa`;
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    `${dir}/last-stop.json`,
    JSON.stringify({ stoppedAt: new Date().toISOString(), sessionId: event.session_id ?? event.sessionId ?? null }, null, 2)
  );
} catch {
  // Hooks must never break the developer's normal Copilot workflow.
}

process.exit(0);
