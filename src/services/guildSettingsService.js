import GuildSettings from '../models/guildSettings.js';

const DEFAULT_PREFIX =
  process.env.COMMAND_PREFIX?.trim()?.length
    ? process.env.COMMAND_PREFIX.trim()
    : '!';

const prefixCache = new Map();

const normalizePrefix = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed;
};

const validatePrefix = (prefix) => {
  if (!prefix) {
    throw new Error('Prefix cannot be empty.');
  }

  if (/\s/.test(prefix)) {
    throw new Error('Prefix cannot contain whitespace.');
  }

  if (prefix.length > 15) {
    throw new Error('Prefix must be 15 characters or fewer.');
  }
};

const cachePrefix = (guildId, prefix) => {
  if (!guildId) {
    return;
  }
  prefixCache.set(guildId, prefix ?? DEFAULT_PREFIX);
};

export const clearGuildPrefixCache = (guildId) => {
  if (guildId) {
    prefixCache.delete(guildId);
  } else {
    prefixCache.clear();
  }
};

export const getDefaultPrefix = () => DEFAULT_PREFIX;

export const getGuildSettings = async (guildId) => {
  if (!guildId) {
    return null;
  }

  return GuildSettings.findOne({ guildId }).lean().exec();
};

export const getGuildPrefix = async (guildId) => {
  if (!guildId) {
    return DEFAULT_PREFIX;
  }

  if (prefixCache.has(guildId)) {
    return prefixCache.get(guildId);
  }

  const settings = await getGuildSettings(guildId);
  const prefix = normalizePrefix(settings?.prefix) ?? DEFAULT_PREFIX;
  cachePrefix(guildId, prefix);
  return prefix;
};

export const setGuildPrefix = async ({
  guildId,
  prefix,
  userId = null,
  userTag = null,
}) => {
  if (!guildId) {
    throw new Error('Guild ID is required to set a prefix.');
  }

  const normalized = normalizePrefix(prefix);
  validatePrefix(normalized);

  const update = await GuildSettings.findOneAndUpdate(
    { guildId },
    {
      $set: {
        guildId,
        prefix: normalized,
        updatedById: userId,
        updatedByTag: userTag,
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  )
    .lean()
    .exec();

  cachePrefix(guildId, normalized);
  return update;
};

export const clearGuildPrefix = async ({
  guildId,
  userId = null,
  userTag = null,
}) => {
  if (!guildId) {
    throw new Error('Guild ID is required to reset a prefix.');
  }

  const update = await GuildSettings.findOneAndUpdate(
    { guildId },
    {
      $set: {
        guildId,
        updatedById: userId,
        updatedByTag: userTag,
      },
      $unset: {
        prefix: '',
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    },
  )
    .lean()
    .exec();

  cachePrefix(guildId, DEFAULT_PREFIX);
  return update;
};

