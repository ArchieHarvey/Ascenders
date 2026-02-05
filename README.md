# Ascenders Discord Bot

A minimal Discord.js bot with a clean structure, basic slash commands, and a git-based update workflow.

## Features
- `/ping` command
- `/avatar [user]` with global/server pages, requester-only page buttons, and download links
- `/update check` to detect git updates
- `/update apply confirm:true` to pull updates and restart (requires a process manager)
- Automatic remote update checks with owner approval buttons in a configured channel

## Setup
1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies: `npm install`
3. Deploy commands: `npm run deploy:commands`
4. Start the bot: `npm start`

## Notes
- Configure `BOT_OWNER_IDS` in `.env` to restrict update commands.
- Set `UPDATE_ALERT_CHANNEL_ID` to the channel where update approval prompts should be sent.
- Commands are auto-registered on each bot restart.
- `/avatar` page buttons expire after 1 minute and are then removed from the message.
- Use a process manager (PM2, systemd, Docker) to restart the bot after it exits.
