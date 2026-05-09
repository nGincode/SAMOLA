# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

# Copy file dependency
COPY package*.json ./
RUN npm install

# Copy source code dan build
COPY . .
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine
# Copy hasil build Vite ke folder default Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]