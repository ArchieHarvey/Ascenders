import { EmbedBuilder, Colors } from 'discord.js';

const withDefaults = ({ color = Colors.Blurple, timestamp = true, ...rest }) => {
  const embed = new EmbedBuilder()
    .setColor(color);

  if (rest.title) {
    embed.setTitle(rest.title);
  }

  if (rest.description) {
    embed.setDescription(rest.description);
  }

  if (rest.fields?.length) {
    embed.addFields(rest.fields);
  }

  if (rest.footer) {
    embed.setFooter(rest.footer);
  }

  if (timestamp !== false) {
    embed.setTimestamp(new Date());
  }

  return embed;
};

export const buildInfoEmbed = (options) =>
  withDefaults({ color: Colors.Blurple, ...options });

export const buildSuccessEmbed = (options) =>
  withDefaults({ color: Colors.Green, ...options });

export const buildWarningEmbed = (options) =>
  withDefaults({ color: Colors.Orange, ...options });

export const buildErrorEmbed = (options) =>
  withDefaults({
    color: Colors.Red,
    title: options?.title ?? 'Something went wrong',
    ...options,
  });
