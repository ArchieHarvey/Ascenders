import { REST, Routes } from 'discord.js';

const buildCommandPayload = (client) => {
  if (!client?.commands?.size) {
    return [];
  }

  const payload = [];

  for (const command of client.commands.values()) {
    if (!command?.data || typeof command.data.toJSON !== 'function') {
      continue;
    }
    payload.push(command.data.toJSON());
  }

  return payload;
};

const resolveClientId = async (client) => {
  if (process.env.DISCORD_CLIENT_ID?.trim()) {
    return process.env.DISCORD_CLIENT_ID.trim();
  }

  if (!client.application) {
    await client.application?.fetch?.();
  }

  return client.application?.id ?? null;
};

export const deploySlashCommands = async (client, { guildId } = {}) => {
  const token = process.env.DISCORD_TOKEN;

  if (!token) {
    throw new Error('Missing DISCORD_TOKEN in environment.');
  }

  const clientId = await resolveClientId(client);

  if (!clientId) {
    throw new Error(
      'Unable to resolve application ID. Set DISCORD_CLIENT_ID or ensure the application context is available.',
    );
  }

  const commands = buildCommandPayload(client);

  const rest = new REST({ version: '10' }).setToken(token);

  const scope = guildId ? 'guild' : 'global';

  let response;

  if (guildId) {
    response = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );
  } else {
    response = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });
  }

  return {
    scope,
    guildId: guildId ?? null,
    commandCount: Array.isArray(response) ? response.length : commands.length,
  };
};
