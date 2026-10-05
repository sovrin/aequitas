# Build the framework (dist/) and prerender the docs site, then serve the static output.
FROM node:26-alpine AS build
RUN npm install --global pnpm@11.15.1
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY site/package.json site/
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:site

FROM joseluisq/static-web-server:2
# Every route is prerendered as <route>/index.html; serve it without a trailing-slash redirect.
ENV SERVER_ROOT=/public \
    SERVER_ERROR_PAGE_404=/public/404.html \
    SERVER_REDIRECT_TRAILING_SLASH=false \
    SERVER_HEALTH=true
COPY --from=build /app/site/.output/public /public
EXPOSE 80
