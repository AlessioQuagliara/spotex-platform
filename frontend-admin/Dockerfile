# Frontend Admin - Vite Dockerfile for Development
FROM node:20-alpine

WORKDIR /app

# Copy package files from the specific service directory
COPY frontend-admin/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend-admin/ ./

# Expose port
EXPOSE 5173

# Start development server
CMD ["npx", "vite"]