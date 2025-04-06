# Sử dụng image Node.js chính thức
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn
COPY . .

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=4004

# Build TypeScript thành JavaScript
RUN npm run build

# Mở cổng dịch vụ
EXPOSE 4004

# Chạy ứng dụng
CMD ["node", "dist/index.js"]
