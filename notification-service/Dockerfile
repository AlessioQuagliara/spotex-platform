# ==================== DOCKERFILE - Notification Service ====================
# DRY Principle: Same pattern as other services

FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY shared/package*.json ./shared/
COPY notification-service/package*.json ./notification-service/
RUN cd shared && npm ci
RUN cd notification-service && npm ci

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/notification-service/node_modules ./notification-service/node_modules
COPY shared ./shared
COPY notification-service ./notification-service
WORKDIR /app/notification-service
EXPOSE 3006
CMD ["npm", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/notification-service/node_modules ./notification-service/node_modules
COPY shared ./shared
COPY notification-service ./notification-service
WORKDIR /app/shared
RUN npm run build
WORKDIR /app/notification-service
RUN npm run build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/deployment-service/dist ./deployment-service/dist
COPY --from=builder /app/deployment-service/package.json ./deployment-service/
RUN cd shared && npm install --omit=dev
RUN cd deployment-service && npm install --omit=dev
WORKDIR /app/deployment-service
EXPOSE 3006
CMD ["node", "dist/index.js"]
