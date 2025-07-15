# Multi-stage Dockerfile for Expo Web Application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (use npm install instead of npm ci for now)
RUN npm install

# Copy source code
COPY . .

# Install Expo CLI globally
RUN npm install -g @expo/cli

# Build the web version using the recommended Expo command
RUN npx expo export -p web

# Production stage
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy built web files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
