# ==================== DOCKERFILE - Ticket Service ====================
# DRY Principle: Same pattern as other services

FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY shared/package*.json ./shared/
COPY ticket-service/package*.json ./ticket-service/
# Install dependencies
RUN cd shared && npm install --include=dev
RUN cd ticket-service && npm install --include=dev

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/ticket-service/node_modules ./ticket-service/node_modules
COPY shared ./shared
COPY ticket-service ./ticket-service
WORKDIR /app/ticket-service
EXPOSE 3002
CMD ["npm", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/ticket-service/node_modules ./ticket-service/node_modules
COPY shared ./shared
COPY ticket-service ./ticket-service
WORKDIR /app/shared
RUN npm run build
WORKDIR /app/ticket-service
RUN npm run build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/ticket-service/dist ./ticket-service/dist
COPY --from=builder /app/ticket-service/package.json ./ticket-service/
RUN cd shared && npm install --omit=dev
RUN cd ticket-service && npm install --omit=dev
WORKDIR /app/ticket-service
EXPOSE 3002
CMD ["node", "dist/index.js"]
