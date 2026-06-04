# ──────────────────────────────────────────────
# Stage 1: Build
# ──────────────────────────────────────────────
FROM node:22-alpine AS builder

# Build-time Supabase env vars (pass via --build-arg or Coolify env)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_GOOGLE_PAY_MERCHANT_ID
ARG BASE_PATH=/cafe

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY
ENV VITE_GOOGLE_PAY_MERCHANT_ID=$VITE_GOOGLE_PAY_MERCHANT_ID
ENV BASE_PATH=$BASE_PATH

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests first (better layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/frontend/package.json ./packages/frontend/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/frontend/ ./packages/frontend/

# Build the frontend
WORKDIR /app/packages/frontend
RUN pnpm run build

# ──────────────────────────────────────────────
# Stage 2: Serve with nginx
# ──────────────────────────────────────────────
FROM nginx:stable-alpine AS production

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets into /cafe sub-path (matches Vite base path)
COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html/cafe

# Copy Apple Pay domain verification file to root (must be at /.well-known/)
COPY --from=builder /app/packages/frontend/dist/.well-known /usr/share/nginx/html/.well-known

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
