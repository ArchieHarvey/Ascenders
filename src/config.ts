import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
  'DISCORD_TOKEN',
  'APPLICATION_ID',
  'UPDATE_CHANNEL_ID',
  'GITHUB_REPOSITORY'
] as const;

type RequiredEnv = (typeof requiredEnv)[number];

type Config = {
  discordToken: string;
  applicationId: string;
  guildId?: string;
  ownerIds: string[];
  updateChannelId: string;
  githubRepository: { owner: string; repo: string };
  githubBranch: string;
  githubToken?: string;
  updateCheckIntervalMs: number;
};

function ensureEnvValue(key: RequiredEnv): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function parseRepositorySlug(slug: string): { owner: string; repo: string } {
  const [owner, repo] = slug.split('/');
  if (!owner || !repo) {
    throw new Error('GITHUB_REPOSITORY must be in the form "owner/repo"');
  }
  return { owner, repo };
}

export const config: Config = {
  discordToken: ensureEnvValue('DISCORD_TOKEN'),
  applicationId: ensureEnvValue('APPLICATION_ID'),
  guildId: process.env.GUILD_ID,
  ownerIds: process.env.OWNER_IDS?.split(',').map((id) => id.trim()).filter(Boolean) ?? [],
  updateChannelId: ensureEnvValue('UPDATE_CHANNEL_ID'),
  githubRepository: parseRepositorySlug(ensureEnvValue('GITHUB_REPOSITORY')),
  githubBranch: process.env.GITHUB_BRANCH ?? 'main',
  githubToken: process.env.GITHUB_TOKEN,
  updateCheckIntervalMs: Number(process.env.UPDATE_CHECK_INTERVAL_MS ?? 1000 * 60 * 30)
};
