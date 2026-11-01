# The Missing Piece

A two-player browser puzzle: every piece you give leaves a hole in your world.

## Rules
Join the same six-letter room from separate devices. Move your creature one neighboring tile at a time. Star-marked floor tiles can be offered to your partner once you step off them. The partner must accept before a tile leaves your island. Received pieces fill dotted bridge gaps. Both creatures must reach their houses to complete a chapter. Both players approve chapter advancement and restarts. No timer, elimination, accounts, or external voice call is required.

## Development
Node 22.13+; `npm ci`, `npm run db:generate`, `npm run dev`. See the Sites scripts for the managed hosting workflow. D1 holds room state; the server validates every action and uses versioned compare-and-swap updates to prevent lost moves. Clients poll every two seconds. Session credentials stay in browser session storage; the database stores their hashes. Rooms expire after 24 hours.

Run engine tests with `node --experimental-strip-types --test tests/game.test.ts`. Run type checks with `npx tsc --noEmit`.

## Milestones
1. Deterministic game rules and authored puzzles.
2. Durable multiplayer rooms, client interface, and accessibility.
3. Two-client verification and deployment.

Commit each completed milestone and push to GitHub whenever the GitHub remote is connected. Hosting source synchronization is separate from GitHub.

## Scope
This is a prototype with three short chapters, not a finished competition entry. Validate shared decision-making with external playtesters before expanding. A player may see their partner's world for coordination; each player can control only their own.
