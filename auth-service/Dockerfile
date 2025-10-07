# ==================== DOCKERFILE - Auth Service ====================
# DRY Principle: Same pattern as other services

FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY shared/package*.json ./shared/
COPY auth-service/package*.json ./auth-service/
# Install dependencies
RUN cd shared && npm install --include=dev
RUN cd auth-service && npm install --include=dev

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/auth-service/node_modules ./auth-service/node_modules
COPY shared ./shared
COPY auth-service ./auth-service
WORKDIR /app/auth-service
EXPOSE 3001
CMD ["npm", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/auth-service/node_modules ./auth-service/node_modules
COPY shared ./shared
COPY auth-service ./auth-service
WORKDIR /app/shared
RUN npm run build
WORKDIR /app/auth-service
RUN npm run build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/auth-service/dist ./auth-service/dist
COPY --from=builder /app/auth-service/package.json ./auth-service/
RUN cd shared && npm install --omit=dev
RUN cd auth-service && npm install --omit=dev
WORKDIR /app/auth-service
EXPOSE 3001
CMD ["node", "dist/index.js"]
