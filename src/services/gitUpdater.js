import { git } from "../utils/git.js";
import { logger } from "./logger.js";

export class GitUpdater {
  constructor({ intervalMs }) {
    this.intervalMs = intervalMs;
    this.timer = null;
    this.updateAvailable = false;
    this.latestSha = null;
  }

  async checkNow() {
    try {
      await git.fetch();
      const [headSha, upstreamSha] = await Promise.all([
        git.getHeadSha(),
        git.getUpstreamSha(),
      ]);
      const hasUpdate = headSha !== upstreamSha;
      this.updateAvailable = hasUpdate;
      this.latestSha = upstreamSha;

      if (hasUpdate) {
        logger.info("Update available from remote.", { upstreamSha });
      } else {
        logger.info("No updates found.");
      }

      return { hasUpdate, headSha, upstreamSha };
    } catch (error) {
      logger.warn("Failed to check for updates.", { error: error?.message });
      return { hasUpdate: false, error };
    }
  }

  start() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      this.checkNow();
    }, this.intervalMs);
    logger.info("Git updater started.", { intervalMs: this.intervalMs });
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async applyUpdate() {
    await git.pull();
  }
}
