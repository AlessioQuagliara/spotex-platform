# ==================== DOCKERFILE - Deployment Service ====================
# DRY Principle: Same pattern as other services

FROM node:20-alpine AS base

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

FROM base AS deps
WORKDIR /app
COPY shared/package*.json ./shared/
COPY deployment-service/package*.json ./deployment-service/
RUN cd shared && npm install --include=dev
RUN cd deployment-service && npm install --include=dev

FROM base AS dev
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/deployment-service/node_modules ./deployment-service/node_modules
COPY shared ./shared
COPY deployment-service ./deployment-service
WORKDIR /app/deployment-service
EXPOSE 3005
CMD ["npm", "run", "dev"]

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/shared/node_modules ./shared/node_modules
COPY --from=deps /app/deployment-service/node_modules ./deployment-service/node_modules
COPY shared ./shared
COPY deployment-service ./deployment-service
WORKDIR /app/shared
RUN npm run build
WORKDIR /app/deployment-service
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
EXPOSE 3005
CMD ["node", "dist/index.js"]
