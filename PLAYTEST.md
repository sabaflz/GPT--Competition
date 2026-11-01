# Revision 2 validation

## Automated
- Twelve engine/design tests: legal completion of all eight levels, asymmetric maps, essential bridge gaps, adjacency, occupied ground, one-piece capacity, required keepsakes, switch/gate latching, material conservation, mutual restart/advance, journey totals, invalid actions, and bounded quick signals.
- The solver replays actual move/offer/accept/place actions; no teleportation or inventory injection is used in completion fixtures.
- For each socket, the solver repeats the search with that build disabled. Every such search must fail, preventing the redundant near-home gap from the original prototype.
- TypeScript and production build checks.

## Browser
- Interactive tutorial: move, choose give mode, offer a star, accept as the partner, place beside the traveler, and finish practice.
- Two-client room, exchange, build, and shared victory checks.
- Expanded winding journey map, quick signals, and chapter/final celebrations inspected visually.

## Integration runner
`tests/multiplayer.mjs` creates two independent session credentials and tests all chapter solutions over HTTP. The managed preview URL is browser-only in this environment, so executor requests to it could not complete. Run this against an accessible test server; do not claim that HTTP integration passed based only on engine tests.

## Next human playtest
Invite two new players without verbal instructions. Observe:
1. Can they complete practice and make their first real exchange independently?
2. Does each person choose routes and timing, or does one direct everything?
3. Do they understand why a failed gift cut off a route?
4. Does difficulty rise without requiring repeated restarts from unclear rules?
5. Is the optional pace challenge enjoyable rather than distracting?

Adjust authored maps from these observations. Do not infer competition readiness from solution existence alone.
