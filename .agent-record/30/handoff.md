# Handoff: Fix #30 — Docker user permissions

## Status: DONE

## What changed
- **Dockerfile**: Added `ARG UID=1000/GID=1000`, installed `shadow` for `usermod`/`groupmod`, modified existing `node` user to match host IDs, added `USER node`, chown'd node_modules, removed redundant `COPY . .`
- **docker-compose.yml**: Added build args `UID`/`GID` from host env (defaults to 1000)

## Key decisions
- Used `shadow` package to modify the existing `node` user rather than creating/deleting users — simpler and avoids conflicts with Alpine's default user
- Removed `COPY . .` since the volume mount `.:/app` handles source at runtime
- `chown` only targets `node_modules` (the only build artifact that needs writability)

## Verified
- `docker compose build` succeeds
- Container runs as `node:1000` matching host user
- Both `node_modules` and `/app` are writable
- `npm run lint` passes
- `npm run build` passes

## PR: https://github.com/e23thr/sudoku-webgame/pull/34
