import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export const git = {
  async run(args, options = {}) {
    const { stdout } = await execFileAsync("git", args, options);
    return stdout.trim();
  },
  async fetch() {
    await git.run(["fetch", "--prune"]);
  },
  async getHeadSha() {
    return git.run(["rev-parse", "HEAD"]);
  },
  async getUpstreamSha() {
    return git.run(["rev-parse", "@{u}"]);
  },
  async pull() {
    await git.run(["pull", "--ff-only"]);
  },
};
