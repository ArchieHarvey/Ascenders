import { access, mkdir, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const gitDir = resolve(root, ".git");
const hooksDir = resolve(gitDir, "hooks");
const hookPath = resolve(hooksDir, "commit-msg");

try {
  await access(gitDir, constants.F_OK);
} catch {
  console.log("No .git directory detected; skipping hook installation.");
  process.exit(0);
}

await mkdir(hooksDir, { recursive: true });

const hookScript = `#!/usr/bin/env bash
set -euo pipefail
node scripts/bump-version.js --detect --from-commit-msg-file "$1"

git add package.json
`;

await writeFile(hookPath, hookScript, { mode: 0o755 });

console.log("Installed git commit-msg hook for automatic semantic version bumping.");
