# Ascenders Discord Bot

A minimal Discord bot built with [discord.js](https://discord.js.org/) v14. It demonstrates how to:

- connect to Discord using a bot token stored in environment variables,
- register slash commands with the Discord API,
- respond to text commands via a configurable prefix, and
- persist bot status information in MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) 18.17+ or 20+
- A Discord application with a bot token (create one via the [Discord Developer Portal](https://discord.com/developers/applications))
- A running [MongoDB](https://www.mongodb.com/) instance (local or hosted)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the example environment file and add your credentials:
   ```bash
   cp .env.example .env
   ```
   Update the values for:
   - `DISCORD_TOKEN` - your bot token
   - `DISCORD_CLIENT_ID` - application (client) ID
   - `DISCORD_GUILD_ID` - optional; set to a development guild ID for faster slash command deployments
   - `COMMAND_PREFIX` - prefix used for traditional text commands (defaults to `!`)
   - `MONGO_URI` - connection string for your MongoDB database
   - `SUPERUSER_IDS` - optional comma-separated Discord IDs that can run elevated commands
   - `ADMIN_IDS` - optional comma-separated Discord IDs treated as admins
   - `PROCESS_MANAGER` - must be set to `pm2` (the bot will refuse to start otherwise)
   - `GIT_AUTO_PULL_ENABLED` - set to `true` to activate the git watcher (disabled by default)
   - `GIT_AUTO_PULL_CHANNEL_ID` - channel ID where update prompts should be posted
   - `GIT_AUTO_PULL_REPOSITORY_URL` - optional override for the repository URL (defaults to `https://github.com/ArchieHarvey/Ascenders.git`)
   - `GIT_AUTO_PULL_REMOTE` / `GIT_AUTO_PULL_BRANCH` - optional remote name and branch if you prefer a configured git remote instead of the default URL (defaults: `origin` / `main`)
   - `GIT_AUTO_PULL_INTERVAL_MS` - optional interval override in milliseconds (defaults to 5 minutes)
   - `GIT_AUTO_PULL_WORKDIR` - optional absolute path to the local repository (defaults to the bot working directory)

3. Ensure MongoDB is running and accessible via `MONGO_URI`.

4. Deploy the slash commands (re-run whenever you change command definitions):
   ```bash
   npm run deploy
   ```

5. Start the bot:
   ```bash
   npm run start
   ```

Use `npm run dev` for autoreload via `nodemon` during development.

Once the bot is running:

- Slash commands such as `/ping`, `/roll`, and `/status` are available wherever registered.
- Text commands use the configured prefix (default `!`) or a direct bot mention, e.g., `!help`, `@Bot ping`, `!roll 20`, `!avatar @User`, `!uptime`, `!shutdown`, `!restart`, `!status set playing Farming mats`.
- All bot responses are formatted as embeds to keep output consistent and readable.
- When git auto-pull is enabled the bot checks for remote updates on a schedule, posts a prompt in the configured channel, and waits for a superuser to run `!gitpull confirm` before pulling (defaulting to the public Ascenders repository unless overridden).
- Superusers can redeploy slash commands from Discord using `/register` or `!register`, then choosing between global or guild scopes via interactive buttons.
- Use `!gitpull status` (any user) or `!gitpull check|confirm|cancel` (superusers only) to inspect or manage the watcher.

## Project Structure

```
src/
  commands/
    restart.js         # /restart command handler
    shutdown.js        # /shutdown command handler
    uptime.js          # /uptime command handler
    avatar.js          # /avatar command handler
    ping.js            # /ping command handler
    register.js        # /register command deployment handler
    roll.js            # /roll command handler
    status.js          # /status view and update handler
  database/
    index.js           # MongoDB connection helpers
  jobs/
    gitAutoPullJob.js  # Git watcher and confirmation workflow
  events/
    interactionCreate.js # routes slash commands
    messageCreate.js     # routes text commands
    ready.js             # logs in and applies presence
  models/
    botStatus.js       # Mongo schema for bot status
  services/
    botStatusService.js          # status persistence helpers
    commandDeploymentService.js  # slash command deployment helpers
    roleService.js               # superuser/admin helpers
  textCommands/
    restart.js         # !restart command handler
    shutdown.js        # !shutdown command handler
    uptime.js          # !uptime command handler
    avatar.js          # !avatar command handler
    gitpull.js         # !gitpull watcher management
    help.js            # !help command handler
    ping.js            # !ping command handler
    register.js        # !register command deployment handler
    roll.js            # !roll command handler
    status.js          # !status view/update handler
  utils/
    embed.js           # shared embed builders
    presence.js        # shared presence utilities
  workflows/
    deployCommandsWorkflow.js # slash command registration workflow
  registerCommands.js  # deploys slash commands
  index.js             # bot entry point
```

## Inviting the Bot

Generate an OAuth2 URL in the Developer Portal with the `bot` and `applications.commands` scopes (minimal permissions: `Send Messages`). Visit the URL to add the bot to your server.

## License

MIT
