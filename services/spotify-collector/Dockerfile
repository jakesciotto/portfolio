FROM node:24-alpine
RUN apk add --no-cache tzdata
WORKDIR /app
COPY package.json ./
COPY src ./src
RUN mkdir -p /data && chown node:node /data
ENV SPOTIFY_DB_PATH=/data/plays.db NODE_ENV=production
VOLUME /data
USER node
CMD ["node", "src/cli.mjs", "serve"]
