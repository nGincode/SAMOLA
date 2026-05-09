# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
# Pastikan npm install berjalan dengan bersih
RUN npm install

# Copy semua source code
COPY . .

# PAKSA IZIN EKSEKUSI untuk binari di node_modules
RUN chmod -R +x node_modules/.bin

# Baru jalankan build
RUN npm run build

# Stage 2: Production (Nginx)
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]