# Issue #25: Docker Compose for Development — Implementation Plan

## Goal
Add Docker-based development environment with live reload for the Sudoku web game.

## Approach

### 1. Dockerfile (Development)
- Base: `node:22-alpine` (matches project's Node.js 22+ requirement)
- Copy `package.json` + `package-lock.json` first for layer caching
- Run `npm ci` for clean install
- Expose port 5173 (Vite default)
- Start `npm run dev -- --host 0.0.0.0` (Vite listening on all interfaces)

### 2. docker-compose.yml
- Single `dev` service
- Port mapping: `5173:5173`
- Volume mount: `.:/app` for live source code changes
- Anonymous volume `/app/node_modules` to preserve container-installed modules
- Environment: `NODE_ENV=development`

### 3. .dockerignore
- Exclude `node_modules`, `dist`, `.git`, logs, editor files from build context

### 4. README Update
- Add "Docker Development" section under Getting Started with usage instructions

### 5. Verification
- `docker compose build` — clean build with no engine warnings
- `docker compose up -d` — container starts, Vite ready in ~360ms
- `curl localhost:5173` — HTTP 200
- `npm run lint` — passes
- `npm run build` — passes
