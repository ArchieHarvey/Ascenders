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
   - `SUPERUSER_IDS` - optional comma-separated Discord IDs that can confirm repository updates
   - `ADMIN_IDS` - optional comma-separated Discord IDs to treat as admins
   - `REPO_PATH` - optional filesystem path to the Git repository for update operations (defaults to process working directory)
   - `UPDATE_CHANNEL_ID` - optional text channel where automatic update notifications should be posted
   - `AUTO_UPDATE_INTERVAL_MINUTES` - optional frequency for auto-update checks (defaults to 15)

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
- Text commands use the configured prefix (default `!`) or a direct bot mention, e.g., `!help`, `@Bot ping`, `!roll 20`, `!status set playing Farming mats`.
- All bot responses are formatted as embeds to keep output consistent and readable.
- Repository updates can be requested via `/update` or `!update`, which trigger a button-based confirmation flow restricted to superusers.
- When `UPDATE_CHANNEL_ID` is configured, the bot automatically checks for remote repository updates on the configured interval and posts a confirmation prompt in that channel (still requiring a superuser to confirm the pull).
- Superusers can redeploy slash commands from Discord using `/register` or `!register`, then choosing between global or guild scopes via interactive buttons.

## Project Structure

```
src/
  commands/
    ping.js            # /ping command handler
    roll.js            # /roll command handler
    status.js          # /status view and update handler
    register.js        # /register command deployment handler
    update.js          # /update repository workflow
  database/
    index.js           # MongoDB connection helpers
  events/
    interactionCreate.js # routes slash commands
    messageCreate.js     # routes text commands
    ready.js             # logs in and applies presence
  models/
    botStatus.js       # Mongo schema for bot status
  services/
    botStatusService.js # status persistence helpers
    roleService.js      # helper utilities for superuser/admin roles
    updateService.js    # git pull helper logic
  textCommands/
    help.js            # !help command handler
    ping.js            # !ping command handler
    roll.js            # !roll command handler
    status.js          # !status view/update handler
    register.js        # !register command deployment handler
    update.js          # !update repository workflow
  utils/
    embed.js           # shared embed builders
    presence.js        # shared presence utilities
  workflows/
    updateWorkflow.js  # shared confirmation + git workflow
  registerCommands.js  # deploys slash commands
  index.js             # bot entry point
```

## Inviting the Bot

Generate an OAuth2 URL in the Developer Portal with the `bot` and `applications.commands` scopes (minimal permissions: `Send Messages`). Visit the URL to add the bot to your server.

## License

MIT
