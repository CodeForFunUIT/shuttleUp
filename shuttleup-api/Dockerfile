# ── Stage 1: Install production dependencies ─────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: Build application ───────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Stage 3: Production image ────────────────────────────────────────────────
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules (no devDeps)
COPY --from=deps /app/node_modules ./node_modules

# Copy built output
COPY --from=build /app/dist ./dist

# Copy Prisma client (generated in build stage)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema (needed for runtime introspection)
COPY --from=build /app/prisma ./prisma

# Copy package.json (for metadata)
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
