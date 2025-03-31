# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies including TypeScript types
RUN npm cache clean --force && \
    npm install && \
    npm install --save-dev @types/react @types/react-dom typescript@latest

# Copy source code
COPY . .

# Type check and build
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets and necessary files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 5173

# Modified command to allow external access
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]