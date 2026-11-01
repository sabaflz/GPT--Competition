# Prototype playtest

## Verified
- Two separate browser tabs create and join one room, each retaining its own seat.
- Both clients observe movement and reciprocal offers through polling.
- Accepting removes the donor floor and credits the recipient.
- Each client places its received piece, crosses its bridge, and sees shared victory.
- Six engine tests pass, including legal solutions for every chapter, two approaches to the introductory route, invalid actions, material conservation, and mutual restart/advance requirements.
- TypeScript and production build pass.

## Next human playtest
Give two new players the URL without explaining the rules. Observe whether they discover the give/accept/place sequence, whether both contribute, and whether either feels directed by the other. Record time to first successful exchange and the points where instructions were needed.

## Current limitations
Three short introductory chapters. No matchmaking or replacement for a departed player's seat. Rooms expire after 24 hours. No external-player enjoyment study yet. Mobile layout is implemented but has not been tested on physical phones. Chapter complexity and replayability need development before competition submission.

## GitHub
The GitHub integration was confirmed installed during the build, but its repository tools were not exposed to the active execution session. Milestone commits are preserved locally and in the hosting source repository. They have not yet been pushed to a GitHub repository.
