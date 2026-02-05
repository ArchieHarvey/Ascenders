import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");

const parseSemver = (version) => {
  const parts = String(version).split(".").map((value) => Number.parseInt(value, 10));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part) || part < 0)) {
    throw new Error(`Invalid semver version: ${version}`);
  }
  return parts;
};

const bumpVersion = (version, level) => {
  const parts = parseSemver(version);

  if (level === "major") {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
    return parts.join(".");
  }

  if (level === "minor") {
    parts[1] += 1;
    parts[2] = 0;
    return parts.join(".");
  }

  if (level === "patch") {
    parts[2] += 1;
    return parts.join(".");
  }

  throw new Error(`Unsupported bump level: ${level}`);
};

const detectBumpLevelFromCommitMessage = (message) => {
  const commitMessage = String(message ?? "").trim();
  const firstLine = commitMessage.split("\n", 1)[0] ?? "";

  const isBreaking = /BREAKING CHANGE:/i.test(commitMessage) || /!:/u.test(firstLine);
  if (isBreaking) {
    return "major";
  }

  if (/^feat(\(.+\))?:/u.test(firstLine)) {
    return "minor";
  }

  return "patch";
};

const parseCliArgs = (args) => {
  const defaults = {
    mode: "detect",
    commitMessageFile: null,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (["major", "minor", "patch"].includes(arg)) {
      defaults.mode = arg;
      continue;
    }

    if (arg === "--detect") {
      defaults.mode = "detect";
      continue;
    }

    if (arg === "--from-commit-msg-file") {
      defaults.commitMessageFile = args[index + 1] ?? null;
      index += 1;
    }
  }

  return defaults;
};

const options = parseCliArgs(process.argv.slice(2));
const raw = await readFile(packageJsonPath, "utf8");
const pkg = JSON.parse(raw);

const previousVersion = pkg.version;

let bumpLevel = options.mode;
if (options.mode === "detect") {
  let commitMessage = "";
  if (options.commitMessageFile) {
    commitMessage = await readFile(resolve(process.cwd(), options.commitMessageFile), "utf8");
  }
  bumpLevel = detectBumpLevelFromCommitMessage(commitMessage);
}

const nextVersion = bumpVersion(previousVersion, bumpLevel);
pkg.version = nextVersion;

await writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`Version bumped (${bumpLevel}): ${previousVersion} -> ${nextVersion}`);
