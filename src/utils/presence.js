import { ActivityType } from 'discord.js';
import { getDefaultPrefix } from '../services/guildSettingsService.js';

const ACTIVITY_MAP = {
  LISTENING: ActivityType.Listening,
  PLAYING: ActivityType.Playing,
  WATCHING: ActivityType.Watching,
  COMPETING: ActivityType.Competing,
};

export const activityKeys = Object.keys(ACTIVITY_MAP);

export const resolveActivityKey = (value) => {
  if (!value) {
    return null;
  }

  const key = value.toString().toUpperCase();
  return ACTIVITY_MAP[key] ? key : null;
};

export const applyBotPresence = (client, status) => {
  const fallbackPrefix = client.defaultPrefix ?? getDefaultPrefix();
  const fallbackMessage = `${fallbackPrefix}help`;
  const activityKey = resolveActivityKey(status?.activityType) ?? 'LISTENING';
  const activityType = ACTIVITY_MAP[activityKey];
  const message = status?.message?.trim() || fallbackMessage;

  client.user?.setPresence({
    activities: [
      {
        name: message,
        type: activityType,
      },
    ],
    status: 'online',
  });
};
