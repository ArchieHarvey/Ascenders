import { git } from "../utils/git.js";
import { logger } from "./logger.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
} from "discord.js";

export class GitUpdater {
  constructor({ intervalMs, alertChannelId, ownerIds = [] }) {
    this.intervalMs = intervalMs;
    this.alertChannelId = alertChannelId;
    this.ownerIds = ownerIds;
    this.timer = null;
    this.updateAvailable = false;
    this.latestSha = null;
    this.lastNotifiedSha = null;
    this.pendingUpdateSha = null;
    this.client = null;
  }

  setClient(client) {
    this.client = client;
  }

  isOwner(userId) {
    if (this.ownerIds.length === 0) {
      return true;
    }
    return this.ownerIds.includes(userId);
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
        await this.notifyUpdateAvailable(upstreamSha);
      } else {
        logger.info("No updates found.");
      }

      return { hasUpdate, headSha, upstreamSha };
    } catch (error) {
      logger.warn("Failed to check for updates.", { error: error?.message });
      return { hasUpdate: false, error };
    }
  }

  async notifyUpdateAvailable(upstreamSha) {
    if (!this.client || !this.alertChannelId) {
      return;
    }

    if (this.lastNotifiedSha === upstreamSha) {
      return;
    }

    try {
      const channel = await this.client.channels.fetch(this.alertChannelId);
      if (!channel || channel.type !== ChannelType.GuildText) {
        logger.warn("Configured update alert channel is invalid.", {
          channelId: this.alertChannelId,
        });
        return;
      }

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`gitpull:confirm:${upstreamSha}`)
          .setLabel("Confirm Pull")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`gitpull:deny:${upstreamSha}`)
          .setLabel("Deny Pull")
          .setStyle(ButtonStyle.Danger)
      );

      await channel.send({
        content: `Update detected on remote (${upstreamSha}). Owners can approve pulling these changes.`,
        components: [row],
      });

      this.lastNotifiedSha = upstreamSha;
      this.pendingUpdateSha = upstreamSha;
    } catch (error) {
      logger.warn("Failed to send update approval message.", {
        error: error?.message,
      });
    }
  }

  async handleButtonInteraction(interaction) {
    if (!interaction.isButton()) {
      return false;
    }

    const [prefix, action, sha] = interaction.customId.split(":");
    if (prefix !== "gitpull" || !action || !sha) {
      return false;
    }

    if (!this.isOwner(interaction.user.id)) {
      await interaction.reply({
        content: "You are not authorized to approve or deny updates.",
        ephemeral: true,
      });
      return true;
    }

    if (sha !== this.pendingUpdateSha) {
      await interaction.reply({
        content: "This update request is no longer active.",
        ephemeral: true,
      });
      return true;
    }

    if (action === "deny") {
      this.pendingUpdateSha = null;
      await interaction.update({
        content: `Update denied by <@${interaction.user.id}> for ${sha}.`,
        components: [],
      });
      return true;
    }

    if (action === "confirm") {
      await interaction.update({
        content: `Update approved by <@${interaction.user.id}> for ${sha}. Pulling now...`,
        components: [],
      });

      try {
        await this.applyUpdate();
        this.pendingUpdateSha = null;
        logger.info("Git pull completed after owner confirmation.", { sha });
        process.exit(0);
      } catch (error) {
        logger.error("Git pull failed after owner confirmation.", {
          error: error?.message,
          sha,
        });
      }
      return true;
    }

    return false;
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
