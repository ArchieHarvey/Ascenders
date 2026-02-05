import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");

const bumpPatch = (version) => {
  const parts = String(version).split(".").map((value) => Number.parseInt(value, 10));
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part) || part < 0)) {
    throw new Error(`Invalid semver version: ${version}`);
  }

  parts[2] += 1;
  return parts.join(".");
};

const raw = await readFile(packageJsonPath, "utf8");
const pkg = JSON.parse(raw);
const previousVersion = pkg.version;
const nextVersion = bumpPatch(previousVersion);

pkg.version = nextVersion;

await writeFile(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");

console.log(`Version bumped: ${previousVersion} -> ${nextVersion}`);
