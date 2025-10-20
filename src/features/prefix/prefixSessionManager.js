import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from 'discord.js';
import {
  clearGuildPrefix,
  setGuildPrefix,
} from '../../services/guildSettingsService.js';
import {
  buildErrorEmbed,
  buildInfoEmbed,
  buildSuccessEmbed,
} from '../../utils/embed.js';

export const formatPrefix = (value) => `\`${value}\``;
export const PREFIX_MANAGEMENT_TIMEOUT_MS = 60_000;

export const PREFIX_BUTTON_IDS = {
  MANAGE_SET: 'prefix_manage_set',
  MANAGE_RESET: 'prefix_manage_reset',
  RESET_CONFIRM: 'prefix_reset_confirm',
  RESET_CANCEL: 'prefix_reset_cancel',
  UPDATE_CANCEL: 'prefix_update_cancel',
};

export const prefixButtonCustomIds = new Set(Object.values(PREFIX_BUTTON_IDS));

const activePrefixSessions = new Map();

const buildPrefixManagementComponents = ({
  disabled = false,
  showReset = true,
} = {}) => {
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(PREFIX_BUTTON_IDS.MANAGE_SET)
      .setLabel('Update Prefix')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(disabled),
  );

  if (showReset) {
    row.addComponents(
      new ButtonBuilder()
        .setCustomId(PREFIX_BUTTON_IDS.MANAGE_RESET)
        .setLabel('Reset to Default')
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(disabled),
    );
  }

  return [row];
};

const buildResetConfirmationComponents = (disabled = false) => [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(PREFIX_BUTTON_IDS.RESET_CONFIRM)
      .setLabel('Confirm reset')
      .setStyle(ButtonStyle.Danger)
      .setDisabled(disabled),
    new ButtonBuilder()
      .setCustomId(PREFIX_BUTTON_IDS.RESET_CANCEL)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  ),
];

const buildUpdatePrefixComponents = (disabled = false) => [
  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(PREFIX_BUTTON_IDS.UPDATE_CANCEL)
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(disabled),
  ),
];

const buildTimestampFieldName = (expired) =>
  expired ? 'Actions expired' : 'Actions expire';

const buildTimestampFieldValue = (expiresAtSeconds, expired) =>
  expired
    ? `Expired <t:${expiresAtSeconds}:R>. Run the command again to manage the prefix.`
    : `Buttons disable <t:${expiresAtSeconds}:R>.`;

export const buildPrefixSessionPayload = ({
  mode,
  currentPrefix,
  defaultPrefix,
  settings,
  requestedBy,
  expiresAtSeconds,
  expired = false,
}) => {
  const usingDefault = currentPrefix === defaultPrefix;
  const baseDescription = usingDefault
    ? 'This server is using the default prefix.'
    : 'This server has a custom prefix configured.';

  const fields = [];

  if (mode === 'view' || mode === 'expired') {
    fields.push({
      name: 'Current Prefix',
      value: formatPrefix(currentPrefix),
    });

    if (settings?.updatedByTag) {
      fields.push({
        name: 'Last Updated By',
        value: settings.updatedByTag,
        inline: true,
      });
    }

    if (settings?.updatedAt) {
      fields.push({
        name: 'Last Updated',
        value: `<t:${Math.floor(new Date(settings.updatedAt).getTime() / 1000)}:R>`,
        inline: true,
      });
    }
  }

  if (expiresAtSeconds && mode !== 'collectPrefix') {
    fields.push({
      name: buildTimestampFieldName(expired),
      value: buildTimestampFieldValue(expiresAtSeconds, expired),
      inline: false,
    });
  }

  let description = baseDescription;

  if (mode === 'confirmReset') {
    description = [
      baseDescription,
      '',
      `Resetting will switch commands back to ${formatPrefix(defaultPrefix)}.`,
      'Confirm to proceed or cancel to keep the current prefix.',
    ].join('\n');
  } else if (mode === 'collectPrefix') {
    description = [
      baseDescription,
      '',
      `Current prefix is ${formatPrefix(currentPrefix)}.`,
      `Send the new prefix in this channel before <t:${expiresAtSeconds}:R>.`,
      'Prefixes must be 15 characters or fewer and cannot contain whitespace.',
    ].join('\n');
  }

  const embed = buildInfoEmbed({
    title: 'Server Prefix',
    description,
    fields,
    footer: {
      text: `Requested by ${requestedBy}`,
    },
  });

  const components =
    mode === 'confirmReset'
      ? buildResetConfirmationComponents(expired)
      : mode === 'collectPrefix'
        ? buildUpdatePrefixComponents(expired)
        : buildPrefixManagementComponents({
            disabled: expired,
            showReset: currentPrefix !== defaultPrefix,
          });

  return {
    embeds: [embed],
    components,
  };
};

export const createPrefixSessionState = ({
  guildId,
  requestedById,
  requestedByTag,
  defaultPrefix,
  currentPrefix,
  settings,
}) => {
  const expiresAtMs = Date.now() + PREFIX_MANAGEMENT_TIMEOUT_MS;
  return {
    guildId,
    requestedById,
    requestedByTag,
    defaultPrefix,
    currentPrefix,
    settings,
    expiresAtMs,
    expiresAtSeconds: Math.floor(expiresAtMs / 1000),
    mode: 'view',
    message: null,
    timeout: null,
    channel: null,
    collector: null,
  };
};

export const registerPrefixSession = (messageId, session) => {
  activePrefixSessions.set(messageId, session);
};

export const getPrefixSession = (messageId) =>
  activePrefixSessions.get(messageId);

const clearSessionTimeout = (session) => {
  if (session?.timeout) {
    clearTimeout(session.timeout);
    session.timeout = null;
  }
};

const stopSessionCollector = (session, reason = 'stopped') => {
  if (session?.collector) {
    try {
      session.collector.stop(reason);
    } catch (error) {
      console.warn('Failed to stop prefix session collector:', error);
    } finally {
      session.collector = null;
    }
  }
};

export const endPrefixSession = (messageId) => {
  const session = activePrefixSessions.get(messageId);
  clearSessionTimeout(session);
  stopSessionCollector(session, 'ended');
  activePrefixSessions.delete(messageId);
  return session;
};

export const buildSessionPayloadFromSession = (
  session,
  mode,
  { expired = false } = {},
) =>
  buildPrefixSessionPayload({
    mode,
    currentPrefix: session.currentPrefix,
    defaultPrefix: session.defaultPrefix,
    settings: session.settings,
    requestedBy: session.requestedByTag,
    expiresAtSeconds: session.expiresAtSeconds,
    expired,
  });

export const scheduleSessionExpiry = (session, messageId) => {
  clearSessionTimeout(session);
  const remainingMs = Math.max(0, session.expiresAtMs - Date.now());

  if (remainingMs <= 0) {
    stopSessionCollector(session, 'expired');
    return false;
  }

  session.timeout = setTimeout(() => {
    session.mode = 'expired';
    stopSessionCollector(session, 'expired');
    const payload = buildSessionPayloadFromSession(session, 'expired', {
      expired: true,
    });

    session.message
      ?.edit(payload)
      .catch((error) => {
        console.error('Failed to finalize prefix controls:', error);
      })
      .finally(() => {
        activePrefixSessions.delete(messageId);
      });
  }, remainingMs);

  return true;
};

export const isPrefixButtonInteraction = (interaction) =>
  Boolean(
    interaction?.isButton?.() && prefixButtonCustomIds.has(interaction.customId),
  );

export const handlePrefixButtonInteraction = async (interaction) => {
  try {
    const { customId, message: interactionMessage } = interaction;

    if (!interactionMessage?.id) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description: 'Unable to locate the original prefix message.',
            }),
          ],
          ephemeral: true,
        });
      }
      return;
    }

    const session = getPrefixSession(interactionMessage.id);

    if (!session) {
      if (!interaction.deferred && !interaction.replied) {
        await interaction.reply({
          content:
            'This prefix prompt is no longer active. Run the command again.',
          ephemeral: true,
        });
      }
      return;
    }

    session.message = interactionMessage;
    session.channel =
      session.channel ??
      interaction.channel ??
      interactionMessage.channel ??
      null;

    if (interaction.user.id !== session.requestedById) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [
            buildErrorEmbed({
              description:
                'Only the original requester can use these buttons.',
            }),
          ],
          ephemeral: true,
        });
      }
      return;
    }

    if (interaction.guildId !== session.guildId) {
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content: 'This prefix prompt is no longer valid for this server.',
          ephemeral: true,
        });
      }
      return;
    }

    const now = Date.now();
    const isExpired = now >= session.expiresAtMs;

    if (isExpired) {
      session.mode = 'expired';
      const payload = buildSessionPayloadFromSession(session, 'expired', {
        expired: true,
      });
      endPrefixSession(interactionMessage.id);

      try {
        await interaction.update(payload);
      } catch (error) {
        console.error('Failed to update expired prefix session:', error);
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({
            content: 'This prefix prompt has expired. Run the command again.',
            ephemeral: true,
          });
        }
      }
      return;
    }

    switch (customId) {
      case PREFIX_BUTTON_IDS.MANAGE_SET: {
        stopSessionCollector(session, 'mode-change');
        const remainingMs = Math.max(0, session.expiresAtMs - now);

        if (remainingMs <= 0) {
          session.mode = 'expired';
          const payload = buildSessionPayloadFromSession(session, 'expired', {
            expired: true,
          });
          endPrefixSession(interactionMessage.id);

          await interaction.update(payload);
          return;
        }

        const channel = interaction.channel ?? session.channel;

        if (
          !channel?.isTextBased?.() ||
          typeof channel.createMessageCollector !== 'function'
        ) {
          await interaction.reply({
            content: 'Unable to collect a new prefix in this channel.',
            ephemeral: true,
          });
          return;
        }

        session.channel = channel;
        session.mode = 'collectPrefix';
        const payload = buildSessionPayloadFromSession(
          session,
          'collectPrefix',
          {
            expired: false,
          },
        );

        await interaction.update(payload);

        const collector = channel.createMessageCollector({
          filter: (message) =>
            message.author.id === session.requestedById &&
            message.channelId === channel.id,
          time: remainingMs,
        });

        session.collector = collector;

        collector.on('collect', async (collected) => {
          const activeSession = getPrefixSession(interactionMessage.id);

          if (!activeSession || activeSession !== session) {
            collector.stop('inactive');
            return;
          }

          const proposed = collected.content.trim();

          if (!proposed) {
            return;
          }

          const previousPrefix = session.currentPrefix;

          try {
            const result = await setGuildPrefix({
              guildId: session.guildId,
              prefix: proposed,
              userId: collected.author.id,
              userTag: collected.author.tag,
            });

            const newPrefix = result?.prefix ?? proposed;
            session.currentPrefix = newPrefix;
            session.settings = result ?? session.settings;

            const successEmbed = buildSuccessEmbed({
              title: 'Prefix Updated',
              description: `Commands in this server now use ${formatPrefix(newPrefix)}.`,
              fields: [
                {
                  name: 'Previous Prefix',
                  value: formatPrefix(previousPrefix),
                  inline: true,
                },
                {
                  name: 'New Prefix',
                  value: formatPrefix(newPrefix),
                  inline: true,
                },
              ],
            });

            await session.message?.edit({
              embeds: [successEmbed],
              components: [],
            });

            collector.stop('success');
            endPrefixSession(interactionMessage.id);
          } catch (error) {
            console.error('Failed to set guild prefix via update prompt:', error);

            try {
              await collected.reply({
                embeds: [
                  buildErrorEmbed({
                    description:
                      error?.message ??
                      'Unable to update the prefix right now. Please try again later.',
                  }),
                ],
                allowedMentions: { repliedUser: false },
              });
            } catch (replyError) {
              console.warn(
                'Failed to notify about prefix update error:',
                replyError,
              );
            }
          }
        });

        collector.on('end', (_, reason) => {
          if (session.collector === collector) {
            session.collector = null;
          }

          if (
            reason === 'success' ||
            !activePrefixSessions.has(interactionMessage.id)
          ) {
            return;
          }

          if (reason === 'cancel') {
            session.mode = 'view';
          }
        });

        return;
      }

      case PREFIX_BUTTON_IDS.MANAGE_RESET: {
        stopSessionCollector(session, 'mode-change');
        session.mode = 'confirmReset';
        const payload = buildSessionPayloadFromSession(session, 'confirmReset', {
          expired: false,
        });

        await interaction.update(payload);
        return;
      }

      case PREFIX_BUTTON_IDS.RESET_CANCEL: {
        stopSessionCollector(session, 'cancel');
        session.mode = 'view';
        const payload = buildSessionPayloadFromSession(session, 'view', {
          expired: false,
        });

        await interaction.update(payload);
        scheduleSessionExpiry(session, interactionMessage.id);
        return;
      }

      case PREFIX_BUTTON_IDS.RESET_CONFIRM: {
        stopSessionCollector(session, 'mode-change');
        const remainingMs = Math.max(0, session.expiresAtMs - now);
        clearSessionTimeout(session);

        if (remainingMs <= 0) {
          session.mode = 'expired';
          const payload = buildSessionPayloadFromSession(session, 'expired', {
            expired: true,
          });
          endPrefixSession(interactionMessage.id);

          try {
            await interaction.update(payload);
          } catch (error) {
            console.error('Failed to finalize expired prefix session:', error);
            if (!interaction.replied && !interaction.deferred) {
              await interaction.reply({
                content: 'This prefix prompt has expired. Run the command again.',
                ephemeral: true,
              });
            }
          }
          return;
        }

        await interaction.deferUpdate();

        try {
          const result = await clearGuildPrefix({
            guildId: session.guildId,
            userId: interaction.user.id,
            userTag: interaction.user.tag,
          });

          session.currentPrefix = session.defaultPrefix;
          session.settings = result ?? session.settings;

          const successEmbed = buildSuccessEmbed({
            title: 'Prefix Reset',
            description:
              'The custom prefix has been cleared. This server now uses the default prefix.',
            fields: [
              {
                name: 'Current Prefix',
                value: formatPrefix(session.defaultPrefix),
                inline: true,
              },
            ],
          });

          await interaction.editReply({
            embeds: [successEmbed],
            components: [],
          });

          endPrefixSession(interactionMessage.id);
        } catch (error) {
          console.error('Failed to reset guild prefix via button:', error);

          await interaction.followUp({
            embeds: [
              buildErrorEmbed({
                description:
                  error?.message ??
                  'Unable to reset the prefix right now. Please try again later.',
              }),
            ],
            ephemeral: true,
          });

          session.mode = 'confirmReset';
          const rescheduled = scheduleSessionExpiry(
            session,
            interactionMessage.id,
          );

          const payload = buildSessionPayloadFromSession(
            session,
            rescheduled ? 'confirmReset' : 'expired',
            {
              expired: !rescheduled,
            },
          );

          try {
            await interaction.editReply(payload);
          } catch (editError) {
            console.error(
              'Failed to update prefix session after error:',
              editError,
            );
          }

          if (!rescheduled) {
            endPrefixSession(interactionMessage.id);
          }
        }

        return;
      }

      case PREFIX_BUTTON_IDS.UPDATE_CANCEL: {
        stopSessionCollector(session, 'cancel');
        session.mode = 'view';
        const payload = buildSessionPayloadFromSession(session, 'view', {
          expired: false,
        });

        await interaction.update(payload);
        scheduleSessionExpiry(session, interactionMessage.id);
        return;
      }

      default: {
        await interaction.reply({
          content: 'Working...',
          ephemeral: true,
        });
        return;
      }
    }
  } catch (error) {
    console.error('Failed to handle prefix button interaction:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        embeds: [
          buildErrorEmbed({
            description:
              'Unable to process that prefix interaction. Please try again.',
          }),
        ],
        ephemeral: true,
      });
    }
  }
};
