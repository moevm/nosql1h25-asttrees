FROM oven/bun:1.2.3-debian AS builder
WORKDIR /app

COPY . /app/
RUN rm bun.lock package-lock.json || true
RUN bun install

ENV NODE_ENV=production
RUN bun run build

FROM caddy:2.10.0-alpine
COPY --from=builder /app/dist/. /usr/share/caddy/
COPY Caddyfile /etc/caddy/Caddyfile
