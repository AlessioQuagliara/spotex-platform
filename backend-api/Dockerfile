# ==================== DOCKERFILE TEMPLATE - Backend Services ====================
# DRY Principle: Single Dockerfile pattern for all Node.js backend services

FROM node:18-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY shared/package*.json ./shared/
COPY backend-api/package*.json ./backend-api/

# Install dependencies
RUN cd shared && npm install --include=dev
RUN cd backend-api && npm install --include=dev

# Development image
FROM base AS dev
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/backend-api/node_modules ./backend-api/node_modules

# Copy source code
COPY shared ./shared
COPY backend-api ./backend-api

# Set working directory to service
WORKDIR /app/backend-api

# Expose port
EXPOSE 3000

# Start dev server
CMD ["npm", "run", "dev"]

# Production build
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/backend-api/node_modules ./backend-api/node_modules

# Copy source
COPY shared ./shared
COPY backend-api ./backend-api

# Build shared package
WORKDIR /app/shared
RUN npm run build

# Build backend-api
WORKDIR /app/backend-api
RUN npm run build

# Production image
FROM base AS production
WORKDIR /app

# Copy built files
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/backend-api/dist ./backend-api/dist
COPY --from=builder /app/backend-api/package.json ./backend-api/

# Install only production dependencies
RUN cd shared && npm install --omit=dev
RUN cd backend-api && npm install --omit=dev

WORKDIR /app/backend-api

EXPOSE 3000

CMD ["node", "dist/index.js"]
