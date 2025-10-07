# ==================== DOCKERFILE - Domain Service ====================
# DRY Principle: Same pattern as other services

FROM node:18-alpine AS base

FROM base AS deps
WORKDIR /app
COPY shared/package*.json ./shared/
COPY domain-service/package*.json ./domain-service/
RUN cd shared && npm install --include=dev
RUN cd domain-service && npm install --include=dev

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/domain-service/node_modules ./domain-service/node_modules
COPY shared ./shared
COPY domain-service ./domain-service
WORKDIR /app/domain-service
EXPOSE 3003
CMD ["npm", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/domain-service/node_modules ./domain-service/node_modules
COPY shared ./shared
COPY domain-service ./domain-service
WORKDIR /app/shared
RUN npm run build
WORKDIR /app/domain-service
RUN npm run build

FROM base AS production
WORKDIR /app
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/
COPY --from=builder /app/domain-service/dist ./domain-service/dist
COPY --from=builder /app/domain-service/package.json ./domain-service/
RUN cd shared && npm install --omit=dev
RUN cd domain-service && npm install --omit=dev
WORKDIR /app/domain-service
EXPOSE 3003
CMD ["node", "dist/index.js"]
