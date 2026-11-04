# ========================================================
# MobillsPro - Multi-Stage Production Dockerfile
# Alexandre & Amanda - Muriaé/MG
# ========================================================

# Stage 1: Build Frontend (Vite + React)
FROM node:22-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
COPY shared/ /app/shared/
RUN npm run build

# Stage 2: Production Server Environment
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Copy Server Package and Install Production Dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev

# Copy Root & Shared Modules
WORKDIR /app
COPY package*.json ./
COPY shared/ ./shared/
COPY prisma/ ./prisma/
COPY server/ ./server/

# Copy Client Static Production Assets
COPY --from=client-builder /app/client/dist ./client/dist

# Expose Service Port
EXPOSE 3001

# Container Healthcheck (Bacen/Cloud Standard)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

# Start Production Backend (Express serving API + Frontend SPA)
CMD ["node", "server/src/index.js"]

