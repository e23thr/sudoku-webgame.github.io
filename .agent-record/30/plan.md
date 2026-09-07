# Fix #30: Docker container should access/write host files as host user

## Problem
Docker container ran as root, causing permission issues with volume-mounted host files. `node_modules` and `dist` were owned by root, not the host user.

## Approach
- Modify the existing `node` user in the Alpine base image to match host UID/GID using `shadow` package (`usermod`/`groupmod`)
- Add `USER node` directive so the container runs as non-root
- `chown` node_modules during build so they're writable at runtime
- Pass host UID/GID as build args via docker-compose.yml

## Files Modified
- `Dockerfile` — Added UID/GID build args, shadow package, usermod/groupmod, USER directive, chown node_modules, removed redundant COPY
- `docker-compose.yml` — Added build args for UID/GID with host env fallback

## Verification
- Container runs as `node:1000` matching host user
- `node_modules` owned by `node:node`, writable at runtime
- Host-mounted source files readable and writable
- `npm run lint` passes
- `npm run build` passes

## PR
https://github.com/e23thr/sudoku-webgame/pull/34
