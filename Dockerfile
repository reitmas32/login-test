# Dockerfile usando Bun para Next.js

###########
# Builder #
###########
FROM oven/bun:latest AS builder
WORKDIR /app

# Copia sólo package.json y lockfile de Bun
COPY package.json bun.lock ./

# Instala dependencias
RUN bun install

# Copia el resto del código y construye
COPY . .
RUN bun run build

##########
# Runner #
##########
FROM oven/bun:latest AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia desde el builder sólo lo necesario
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expón el puerto por defecto de Next.js
EXPOSE 3000

# Arranca Next.js en modo producción
CMD ["bun", "run", "start"]
