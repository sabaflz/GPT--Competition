# The Missing Piece

[Play the game](https://the-missing-piece-coop.feydell14.chatgpt.site/)

A cooperative browser puzzle for two players on separate devices. Every piece you give leaves a hole in your world.

## Play

1. Create a room and share its invite link with one friend.
2. Play the short interactive practice, or reopen it with **Practice**.
3. Move one orthogonal tile at a time.
4. Stand beside a star tile to offer it. Your partner must accept before it leaves your world. You cannot lift the tile you occupy.
5. Carry one received piece at a time. Stand beside a dotted gap to build.
6. Collect all your diamond keepsakes before returning home.
7. Stand on a round switch to open your partner's gate. Crossing latches a gate open.
8. Both travelers must reach home. Restarts and chapter advancement require both players' agreement.

Quick signals support coordination without a voice call. The Sound menu has separate music/effects switches and a volume slider; both start off. The light/dark toggle and sound choices persist on each device. All music and sound effects are original browser synthesis, dedicated to CC0 in AUDIO_LICENSE.md. The optional three-minute pace challenge adds a clock without eliminating anyone. Rooms expire after 24 hours; keep the original tab to retain your seat.

## Eight-stop progression

| Stop | New demand |
| --- | --- |
| The Clearing | Learn a reciprocal exchange on different maps |
| Fern Hollow | Visit a keepsake and preserve a route back |
| Moonlit Bend | Unequal bridge needs and one-piece carrying capacity |
| Split Creek | Order two bridges and gifts without stranding yourself |
| Lantern Marsh | Coordinate a switch and a gate across worlds |
| The Watchtowers | Help each other cross reciprocal gates |
| Starfall Pass | Combine multiple keepsakes with irreversible removal |
| Homeward Sky | Combine constrained gifts, keepsakes, and reciprocal gates |

Every socket serves a required route to home or a keepsake. The test suite searches for alternate solutions with each socket disabled and rejects redundant sockets.

## Development

Node 22.13+ and pnpm. Install with `pnpm install --frozen-lockfile`, then use `pnpm dev`. D1 migrations must be applied to the local preview database. The Sites workflow manages production builds, migration application, and hosting.

- `node --experimental-strip-types --test tests/game.test.ts tests/audio.test.ts`: engine and level-design tests.
- `node --experimental-strip-types tests/solver.ts --write`: regenerate legal solution fixtures after changing maps.
- `pnpm exec tsc --noEmit`: type checking.
- `GAME_TEST_URL=http://your-reachable-dev-server node tests/multiplayer.mjs`: two-client HTTP integration run against a test server. This creates one test room and completes all eight stops.

The server validates actions and uses compare-and-swap room versions to prevent lost updates. Clients poll every two seconds and safely refresh/retry stale moves. Session tokens are held in browser session storage; only hashes are stored in D1. Older prototype rooms restart under the updated rules.

## GitHub workflow

[Repository](https://github.com/sabaflz/GPT--Competition). Each completed milestone is committed locally and synchronized through the GitHub connector. The original three prototype milestones were imported with their source trees and messages. Connector-created commit SHAs differ from the local source history. Hosting uses its own source remote; no force pushes are required.

## Status

An expanded competition prototype. Technical correctness and level necessity are tested. Difficulty, enjoyment, and independence of both players still need external human playtests before calling it a finished competition entry.
