# Development Dockerfile for Sudoku Web Game
FROM node:22-alpine

# Build args for host user UID/GID (avoids permission issues with volume mounts)
ARG UID=1000
ARG GID=1000

# Install shadow for usermod/groupmod to adjust user IDs
RUN apk add --no-cache shadow

# Modify existing node user/group to match host UID/GID
RUN groupmod -g ${GID} node && \
    usermod -u ${UID} -g ${GID} node

WORKDIR /app

# Install dependencies first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Give node user ownership of node_modules so it's writable at runtime
RUN chown -R node:node /app/node_modules

EXPOSE 5173

# Run as non-root user matching host UID/GID
USER node

# Start Vite dev server, listening on all interfaces
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
