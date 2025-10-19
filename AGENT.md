# Ascenders Bot Agent Notes

These guidelines capture ongoing expectations for feature work and maintenance. Keep this file current so contributors understand the shared conventions.

## Environment & Tooling
- Node.js 18.17+ (or 20+) with discord.js v14.
- MongoDB is required; connection string provided via `MONGO_URI`.
- Environment variables managed through `.env` (copy from `.env.example`).

## Command Design Rules
- Every slash command **must have** a matching text command implementation.
- Text commands respond to the configured prefix (default `!`) **and** direct bot mentions (e.g., `@Bot ping`).
- Commands (both slash and text) should share business logic wherever practical to avoid divergent behaviour.
- Any critical workflow (e.g., repository updates) must include a confirmation step and restrict actionable components (buttons) to superusers.
- Automatic systems (like the repository watcher) still require superuser confirmation before executing changes; make sure they respect the same embed + permissions conventions.

## Messaging Conventions
- All bot replies should use Discord embeds unless explicitly instructed otherwise.
- When replying to user messages, set `allowedMentions: { repliedUser: false }` to avoid pinging the author unless a ping is specifically requested.
- Provide clear, user-friendly feedback for success and error states; errors should also be wrapped in embeds.

## Presence & Status
- Bot presence is driven from MongoDB-stored status and updated via shared helper utilities.
- Status updates must synchronise presence immediately after persistence.

## Testing & Deployment
- Always run `npm run deploy` after modifying slash command definitions.
- Use `npm start` (or `npm run dev`) to validate functionality locally with the updated environment configuration.
- Maintain `.env.example` parity with runtime expectations (e.g., `SUPERUSER_IDS`, `ADMIN_IDS`, `REPO_PATH`).
- After wrapping up each task, increment the version in `package.json` before handing it off.

Keep this document in sync with future agreements or project conventions so new contributors ramp up quickly.
