# Ascenders Bot

A modular Discord.js bot for the Ascenders project. This initial iteration implements:

- A `/ping` slash command to check the bot latency.
- An automated GitHub update workflow that posts approval prompts in a designated channel and, upon owner approval, pulls the latest code, installs dependencies, and rebuilds the project.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in the values:

   ```env
   DISCORD_TOKEN=your-discord-bot-token
   APPLICATION_ID=your-application-id
   OWNER_IDS=comma,separated,discord,user,ids
   UPDATE_CHANNEL_ID=channel-id-for-updates
   GITHUB_REPOSITORY=owner/repository
   GITHUB_BRANCH=main
   ```

3. **Build and run**

   ```bash
   npm run build
   npm start
   ```

   During development you can run:

   ```bash
   npm run dev
   ```

## Update Workflow

- The bot periodically checks the configured GitHub repository for new commits on the selected branch.
- When a new commit is detected, it posts an embed in the configured channel with **Approve** and **Reject** buttons. Only allowed owners can approve.
- Approving runs `git pull`, `npm install`, and `npm run build`. Results are returned to the reviewer and the prompt embed is updated to reflect success or failure.
- Rejecting closes the prompt without applying the update.

## Future Work

- Add giveaway, moderation, reminder, and logging systems.
- Expand the command framework and help menu.
- Integrate MongoDB persistence.
