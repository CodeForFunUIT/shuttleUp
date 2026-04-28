# ── Stage 1: Install production dependencies ─────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && \
    # Remove Prisma CLI + engines — NOT needed at runtime (generated .prisma client suffices)
    rm -rf node_modules/@prisma/engines node_modules/@prisma/engines-version \
           node_modules/prisma node_modules/@prisma/cli && \
    # Remove transitive deps not needed at runtime
    rm -rf node_modules/typescript node_modules/@electric-sql \
           node_modules/effect node_modules/react-dom && \
    # Strip test files, docs, type definitions, source maps from node_modules
    find node_modules \( -name '*.d.ts' -o -name '*.map' -o -name '*.md' \
      -o -name 'LICENSE*' -o -name 'CHANGELOG*' -o -name 'README*' \) -type f -delete && \
    find node_modules -type d \( -name '__tests__' -o -name 'test' -o -name 'tests' \
      -o -name 'docs' -o -name 'example' -o -name 'examples' \) -exec rm -rf {} + 2>/dev/null; \
    npm cache clean --force

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

# Copy pruned production node_modules (no devDeps, no Prisma engines)
COPY --from=deps /app/node_modules ./node_modules

# Copy built output
COPY --from=build /app/dist ./dist

# Copy Prisma generated client (query engine for Alpine/linux-musl)
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy Prisma schema (needed for runtime introspection)
COPY --from=build /app/prisma ./prisma

# Copy package.json (for metadata)
COPY package.json ./

EXPOSE 3000
CMD ["node", "dist/src/main.js"]
