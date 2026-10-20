# Production Dockerfile for Nexus 0 (AICTE OneView)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root manifests and workspace package manifests
COPY package.json package-lock.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

# Install all dependencies
RUN npm ci

# Copy full source tree
COPY apps ./apps

# Initialize deterministic database seed
RUN npm run seed

# Build both frontend and backend
RUN npm run build

# Stage 2: Production Runtime
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/data ./apps/api/data
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

EXPOSE 4000

CMD ["node", "apps/api/dist/server.js"]
