import GuildSettings from '../models/guildSettings.js';

const DEFAULT_EVENTS = Object.freeze({
  member: true,
  role: true,
  channel: true,
  thread: true,
  message: true,
  audit: true,
});

const DEFAULT_LOGGING_CONFIG = Object.freeze({
  channelId: null,
  enabled: false,
  events: { ...DEFAULT_EVENTS },
  updatedById: null,
  updatedByTag: null,
  updatedAt: null,
});

const loggingCache = new Map();

const deepClone = (input) => {
  if (input === null || typeof input !== 'object') {
    return input;
  }

  if (input instanceof Date) {
    return new Date(input.getTime());
  }

  if (Array.isArray(input)) {
    return input.map((item) => deepClone(item));
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, deepClone(value)]),
  );
};

const normalizeLoggingConfig = (raw) => {
  if (!raw) {
    return deepClone(DEFAULT_LOGGING_CONFIG);
  }

  const normalizedEvents = { ...DEFAULT_EVENTS, ...(raw.events ?? {}) };

  return {
    channelId: raw.channelId ?? null,
    enabled: Boolean(raw.enabled),
    events: normalizedEvents,
    updatedById: raw.updatedById ?? null,
    updatedByTag: raw.updatedByTag ?? null,
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt) : null,
  };
};

export const getDefaultLoggingConfig = () => deepClone(DEFAULT_LOGGING_CONFIG);

export const getGuildLoggingConfig = async (guildId) => {
  if (!guildId) {
    throw new Error('Guild ID is required to fetch logging settings.');
  }

  if (loggingCache.has(guildId)) {
    return deepClone(loggingCache.get(guildId));
  }

  const settings = await GuildSettings.findOne({ guildId })
    .select({ logging: 1 })
    .lean()
    .exec();

  const normalized = normalizeLoggingConfig(settings?.logging);
  loggingCache.set(guildId, normalized);
  return deepClone(normalized);
};

const updateCache = (guildId, config) => {
  loggingCache.set(guildId, normalizeLoggingConfig(config));
};

export const clearLoggingCache = (guildId) => {
  if (guildId) {
    loggingCache.delete(guildId);
  } else {
    loggingCache.clear();
  }
};

const buildLoggingUpdate = ({ channelId, enabled, events, userId, userTag }) => {
  const update = {
    'logging.updatedAt': new Date(),
    'logging.updatedById': userId ?? null,
    'logging.updatedByTag': userTag ?? null,
  };

  if (typeof channelId !== 'undefined') {
    update['logging.channelId'] = channelId;
  }

  if (typeof enabled !== 'undefined') {
    update['logging.enabled'] = enabled;
  }

  if (events) {
    for (const [key, value] of Object.entries(events)) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_EVENTS, key) && typeof value === 'boolean') {
        update[`logging.events.${key}`] = value;
      }
    }
  }

  return update;
};

const persistLoggingUpdate = async ({ guildId, update }) => {
  const doc = await GuildSettings.findOneAndUpdate(
    { guildId },
    { $set: update, $setOnInsert: { guildId } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
    .select({ logging: 1 })
    .lean()
    .exec();

  const normalized = normalizeLoggingConfig(doc.logging);
  updateCache(guildId, normalized);
  return normalized;
};

export const setLoggingChannel = async ({ guildId, channelId, userId, userTag }) => {
  if (!guildId) {
    throw new Error('Guild ID is required to set the logging channel.');
  }
  if (!channelId) {
    throw new Error('Channel ID is required to set the logging channel.');
  }

  const update = buildLoggingUpdate({
    channelId,
    enabled: true,
    userId,
    userTag,
  });

  return persistLoggingUpdate({ guildId, update });
};

export const disableLogging = async ({ guildId, userId, userTag }) => {
  if (!guildId) {
    throw new Error('Guild ID is required to disable logging.');
  }

  const update = buildLoggingUpdate({
    enabled: false,
    userId,
    userTag,
  });

  return persistLoggingUpdate({ guildId, update });
};

export const clearLoggingChannel = async ({ guildId, userId, userTag }) => {
  if (!guildId) {
    throw new Error('Guild ID is required to clear the logging channel.');
  }

  const update = buildLoggingUpdate({
    channelId: null,
    enabled: false,
    userId,
    userTag,
  });

  return persistLoggingUpdate({ guildId, update });
};

export const updateLoggingEvents = async ({ guildId, events, userId, userTag }) => {
  if (!guildId) {
    throw new Error('Guild ID is required to update logging events.');
  }

  if (!events || typeof events !== 'object') {
    throw new Error('Event updates must be provided.');
  }

  const update = buildLoggingUpdate({
    events,
    userId,
    userTag,
  });

  return persistLoggingUpdate({ guildId, update });
};
