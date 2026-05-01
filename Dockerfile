FROM node:20-alpine
WORKDIR /app

# Copy các file lock và package vào trước để tận dụng cache của Docker
COPY package*.json ./
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Chạy server
CMD ["npm", "run", "dev"]
