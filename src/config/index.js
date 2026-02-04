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
  updateCheckIntervalMs: parseNumber(process.env.UPDATE_CHECK_INTERVAL_MS, 300_000),
  ownerIds: (process.env.BOT_OWNER_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
};
