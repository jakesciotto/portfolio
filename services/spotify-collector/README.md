# spotify-collector

Keeps the Spotify listening history behind jakesciotto.com current. Spotify's Web API
exposes only the last 50 plays, so this service polls that endpoint on a schedule, stores
every play in SQLite, and publishes the same five Redis keys the site reads.

## Data flow

1. `collect` runs every `COLLECT_INTERVAL_MINUTES`. It calls `GET /me/player/recently-played`
   with `after=` set to the newest stored play and appends the new plays.
2. `publish` runs after any collect that inserted plays. It aggregates every stored play and
   writes `spotify:overview`, `spotify:top_artists`, `spotify:top_tracks`,
   `spotify:yearly_hours` and `spotify:fun_facts` to Upstash.
3. `import <folder>` loads a Spotify extended streaming history export
   (`Streaming_History_Audio_*.json`) into the same table. Run `publish` after it.

Plays dedupe on the second-truncated timestamp plus the track URI, so the archive tail and the
collected head merge into one row per play. The API carries no `ms_played`; the collector uses
the gap to the previous play, capped at the track duration, so a skip counts as its real length.
The API omits podcasts and plays under 30 seconds.

The refresh token comes from Redis (`spotify_live_refresh_token`), the same key the site
uses, with `SPOTIFY_LIVE_REFRESH_TOKEN` as a fallback.

## Run on vinelab

```sh
cd ~/github/portfolio/services/spotify-collector
cp .env.example .env   # fill in the values
docker compose up -d --build
docker compose exec -T spotify-collector node src/cli.mjs status
```

Import an archive: copy the unzipped folder into `./data/archive`, then

```sh
docker compose exec -T spotify-collector node src/cli.mjs import /data/archive
docker compose exec -T spotify-collector node src/cli.mjs publish
```

The SQLite file lives at `./data/plays.db` in WAL mode. Back it up by stopping the container
and copying all three `plays.db*` files.

## Test

```sh
node --test "test/**/*.test.mjs"
```

No dependencies. Node 24 in the container, Node 22.13 or newer locally, for `node:sqlite`.
