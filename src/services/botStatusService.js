import BotStatus from '../models/botStatus.js';

export const getOrCreateStatus = async () => {
  const existing = await BotStatus.findOne().sort({ updatedAt: -1 }).exec();
  if (existing) {
    return existing;
  }

  const created = new BotStatus();
  await created.save();
  return created;
};

export const updateStatus = async ({
  message,
  activityType,
  userId,
  userTag,
}) => {
  const status = await getOrCreateStatus();

  status.message = message ?? status.message;

  if (activityType) {
    status.activityType = activityType;
  }

  status.lastUpdatedById = userId ?? status.lastUpdatedById;
  status.lastUpdatedByTag = userTag ?? status.lastUpdatedByTag;

  await status.save();
  return status;
};
