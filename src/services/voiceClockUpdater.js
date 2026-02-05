import { ChannelType, DiscordAPIError } from "discord.js";
import { logger } from "./logger.js";

export class VoiceClockUpdater {
  constructor({ channelId, timezone = "UTC", intervalMs = 60_000, namePrefix = "🕒" }) {
    this.channelId = channelId;
    this.timezone = timezone;
    this.intervalMs = intervalMs;
    this.namePrefix = namePrefix;
    this.client = null;
    this.timer = null;
    this.pausedUntil = 0;
    this.consecutiveRateLimits = 0;
    this.lastAppliedName = null;
  }

  setClient(client) {
    this.client = client;
  }

  isEnabled() {
    return Boolean(this.channelId);
  }

  formatClockName(now = new Date()) {
    const formatted = now.toLocaleTimeString("en-GB", {
      timeZone: this.timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    return `${this.namePrefix} ${formatted}`;
  }

  async updateNow() {
    if (!this.client || !this.channelId) {
      return;
    }

    if (Date.now() < this.pausedUntil) {
      return;
    }

    try {
      const nextName = this.formatClockName();
      if (nextName === this.lastAppliedName) {
        return;
      }
      const channel = await this.client.channels.fetch(this.channelId);
      if (!channel || channel.type !== ChannelType.GuildVoice) {
        logger.warn("Configured world clock channel is invalid.", {
          channelId: this.channelId,
          expectedType: "GuildVoice",
        });
        return;
      }

      await channel.setName(nextName, "World clock auto-update");
      this.lastAppliedName = nextName;
      this.consecutiveRateLimits = 0;
      logger.info("Updated world clock voice channel name.", {
        channelId: this.channelId,
        nextName,
      });
    } catch (error) {
      if (error instanceof DiscordAPIError && error.status === 429) {
        const retryAfterMs = Math.ceil((error.retryAfter ?? 60) * 1000);
        this.pausedUntil = Date.now() + retryAfterMs;
        this.consecutiveRateLimits += 1;

        if (this.consecutiveRateLimits >= 3) {
          this.pausedUntil = Date.now() + 30 * 60 * 1000;
          logger.warn("World clock updater hit repeated rate limits. Pausing for cooldown.", {
            channelId: this.channelId,
            cooldownMs: 30 * 60 * 1000,
          });
          return;
        }

        logger.warn("World clock updater rate-limited.", {
          channelId: this.channelId,
          retryAfterMs,
        });
        return;
      }

      logger.warn("Failed to update world clock voice channel.", {
        channelId: this.channelId,
        error: error?.message,
      });
    }
  }

  start() {
    if (!this.isEnabled()) {
      logger.info("World clock updater is disabled (no channel configured).");
      return;
    }

    if (this.timer) {
      return;
    }

    this.updateNow();

    this.timer = setInterval(() => {
      this.updateNow();
    }, this.intervalMs);

    logger.info("World clock updater started.", {
      channelId: this.channelId,
      intervalMs: this.intervalMs,
      timezone: this.timezone,
    });
  }

  stop() {
    if (!this.timer) {
      return;
    }

    clearInterval(this.timer);
    this.timer = null;
  }
}
