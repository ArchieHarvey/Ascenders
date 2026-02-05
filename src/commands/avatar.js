import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";

const AVATAR_SIZE = 4096;
const COLLECTOR_TIMEOUT_MS = 60_000;

const isAnimatedHash = (hash) => typeof hash === "string" && hash.startsWith("a_");

const buildScopeData = ({ targetUser, targetMember, scope }) => {
  const isServer = scope === "server";
  const avatarHash = isServer
    ? (targetMember?.avatar ?? targetUser.avatar)
    : targetUser.avatar;

  const animated = isAnimatedHash(avatarHash);
  const base = isServer
    ? targetMember?.displayAvatarURL({ size: AVATAR_SIZE }) ??
      targetUser.displayAvatarURL({ size: AVATAR_SIZE })
    : targetUser.displayAvatarURL({ size: AVATAR_SIZE });

  const png = isServer
    ? targetMember?.displayAvatarURL({ extension: "png", size: AVATAR_SIZE }) ??
      targetUser.displayAvatarURL({ extension: "png", size: AVATAR_SIZE })
    : targetUser.displayAvatarURL({ extension: "png", size: AVATAR_SIZE });

  const jpg = isServer
    ? targetMember?.displayAvatarURL({ extension: "jpg", size: AVATAR_SIZE }) ??
      targetUser.displayAvatarURL({ extension: "jpg", size: AVATAR_SIZE })
    : targetUser.displayAvatarURL({ extension: "jpg", size: AVATAR_SIZE });

  const webp = isServer
    ? targetMember?.displayAvatarURL({ extension: "webp", size: AVATAR_SIZE }) ??
      targetUser.displayAvatarURL({ extension: "webp", size: AVATAR_SIZE })
    : targetUser.displayAvatarURL({ extension: "webp", size: AVATAR_SIZE });

  const gif = animated
    ? isServer
      ? targetMember?.displayAvatarURL({ extension: "gif", size: AVATAR_SIZE }) ??
        targetUser.displayAvatarURL({ extension: "gif", size: AVATAR_SIZE })
      : targetUser.displayAvatarURL({ extension: "gif", size: AVATAR_SIZE })
    : null;

  return {
    scope,
    base,
    png,
    jpg,
    webp,
    gif,
  };
};

const buildEmbed = ({ scopeData, targetUser, requester }) => {
  const scopeLabel = scopeData.scope === "server" ? "server" : "global";
  return new EmbedBuilder()
    .setDescription(`<@${targetUser.id}>’s ${scopeLabel} avatar`)
    .setImage(scopeData.base)
    .setFooter({ text: `Requested by @${requester.username} • ID: ${targetUser.id}` });
};

const buildComponents = ({ scopeData, requesterId, targetUserId }) => {
  const isGlobal = scopeData.scope === "global";

  const pageRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`avatar:page:global:${requesterId}:${targetUserId}`)
      .setLabel("Global")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(isGlobal),
    new ButtonBuilder()
      .setCustomId(`avatar:page:server:${requesterId}:${targetUserId}`)
      .setLabel("Server")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(!isGlobal)
  );

  const links = [
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("PNG").setURL(scopeData.png),
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("JPG").setURL(scopeData.jpg),
    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("WEBP").setURL(scopeData.webp),
  ];

  if (scopeData.gif) {
    links.push(
      new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel("GIF").setURL(scopeData.gif)
    );
  }

  const linkRow = new ActionRowBuilder().addComponents(links);

  return [pageRow, linkRow];
};

const parseAvatarButton = (customId) => {
  const parts = customId.split(":");
  if (parts.length !== 5) {
    return null;
  }

  const [prefix, type, scope, requesterId, targetUserId] = parts;
  if (prefix !== "avatar" || type !== "page") {
    return null;
  }

  if (scope !== "global" && scope !== "server") {
    return null;
  }

  return { scope, requesterId, targetUserId };
};

export const avatarCommand = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View a user's global and server avatar.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user to view avatar for.").setRequired(false)
    ),
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user") ?? interaction.user;
    const targetMember = interaction.guild
      ? await interaction.guild.members.fetch(targetUser.id).catch(() => null)
      : null;

    let scopeData = buildScopeData({ targetUser, targetMember, scope: "global" });

    await interaction.reply({
      embeds: [
        buildEmbed({
          scopeData,
          targetUser,
          requester: interaction.user,
        }),
      ],
      components: buildComponents({
        scopeData,
        requesterId: interaction.user.id,
        targetUserId: targetUser.id,
      }),
    });

    const reply = await interaction.fetchReply();

    const collector = reply.createMessageComponentCollector({
      time: COLLECTOR_TIMEOUT_MS,
    });

    collector.on("collect", async (buttonInteraction) => {
      if (!buttonInteraction.isButton()) {
        return;
      }

      const payload = parseAvatarButton(buttonInteraction.customId);
      if (!payload) {
        return;
      }

      if (buttonInteraction.user.id !== payload.requesterId) {
        await buttonInteraction.reply({
          content: "Only the command requester can use these buttons.",
          ephemeral: true,
        });
        return;
      }

      scopeData = buildScopeData({
        targetUser,
        targetMember,
        scope: payload.scope,
      });

      await buttonInteraction.update({
        embeds: [
          buildEmbed({
            scopeData,
            targetUser,
            requester: interaction.user,
          }),
        ],
        components: buildComponents({
          scopeData,
          requesterId: interaction.user.id,
          targetUserId: targetUser.id,
        }),
      });
    });

    collector.on("end", async () => {
      try {
        await interaction.editReply({ components: [] });
      } catch {
        // Message was deleted or no longer editable.
      }
    });
  },
};
