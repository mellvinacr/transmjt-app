# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependensi untuk prisma (native binary)
RUN apk add --no-cache libc6-compat

COPY package*.json ./
COPY prisma ./prisma/ 
RUN npm install

COPY . .
# KRITIS: Generate client di sini agar engine prisma tersedia
RUN npx prisma generate
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set environment ke production
ENV NODE_ENV production

# Copy hasil build dan file penting lainnya
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma 

# Port standar Next.js
EXPOSE 3000

# Script start
CMD ["npm", "start"]