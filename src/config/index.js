import dotenv from "dotenv";

dotenv.config();

const required = ["DISCORD_TOKEN", "CLIENT_ID"]; 

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  updateAlertChannelId: process.env.UPDATE_ALERT_CHANNEL_ID || null,
  updateCheckIntervalMs: parseNumber(process.env.UPDATE_CHECK_INTERVAL_MS, 300_000),
  ownerIds: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  worldClockChannelId: process.env.WORLD_CLOCK_CHANNEL_ID || null,
  worldClockTimezone: process.env.WORLD_CLOCK_TIMEZONE || "UTC",
  worldClockIntervalMs: parseNumber(process.env.WORLD_CLOCK_INTERVAL_MS, 60_000),
  worldClockNamePrefix: process.env.WORLD_CLOCK_NAME_PREFIX || "🕒",
  mongodbUri: process.env.MONGODB_URI || null,
  mongodbDbName: process.env.MONGODB_DB_NAME || null,
};
