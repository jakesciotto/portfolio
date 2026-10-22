# API routes
Server routes that read tokens and snapshots, call upstreams, shape a payload, and set edge caching.

## entrances
- route GET /api/github-stats: the GitHub contribution and repository numbers, for any visitor
  handler: GET in github-stats/route.js
  trust: visitor
- route GET /api/obsidian-stats: the Obsidian task snapshot from Redis, for any visitor
  handler: GET in obsidian-stats/route.js
  trust: visitor
- route GET /api/spotify-callback: the Spotify OAuth code exchange that stores a refresh token in Redis, for any caller with a code
  handler: GET in spotify-callback/route.js
  trust: visitor
- route GET /api/spotify-live: the live Spotify minutes for the current year from Redis, for any visitor
  handler: GET in spotify-live/route.js
  trust: visitor
- route GET /api/spotify-now-playing: the track Spotify plays now, for any visitor
  handler: GET in spotify-now-playing/route.js
  trust: visitor
- route GET /api/spotify-recent: the recent Spotify plays, for any visitor
  handler: GET in spotify-recent/route.js
  trust: visitor
- route GET /api/spotify-stats: the Spotify history snapshot from Redis, for any visitor
  handler: GET in spotify-stats/route.js
  trust: visitor
- route GET /api/spotify-top: the top Spotify artists and tracks, for any visitor
  handler: GET in spotify-top/route.js
  trust: visitor
- route GET /api/strava-stats: the Strava snapshot for one period from Redis, for any visitor
  handler: GET in strava-stats/route.js
  trust: visitor
- route GET /api/trakt-callback: the Trakt OAuth code exchange that stores a refresh token in Redis, for any caller with a code
  handler: GET in trakt-callback/route.js
  trust: visitor
- route GET /api/trakt-stats: the Trakt watch numbers, for any visitor
  handler: GET in trakt-stats/route.js
  trust: visitor
- route GET /api/wakatime-stats: the WakaTime coding numbers, for any visitor
  handler: GET in wakatime-stats/route.js
  trust: visitor

## invariants
