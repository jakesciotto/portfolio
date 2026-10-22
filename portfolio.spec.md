# jakesciotto.com
A personal site that shows live numbers about Jake's life on a neon-on-glass bento grid.

## trust levels
- visitor: a browser on the public internet that loads a page or calls an API route
- upstream: a third-party API that answers the server, such as Spotify, Trakt, WakaTime or GitHub
- redis: the Upstash Redis keys that hold the refresh tokens and the snapshots
- operator: Jake's own machines, which run the importers and the vinelab collector

## entrances
- page /: the home page with the bento grid, for any visitor
  handler: app/page.jsx
  trust: visitor
- page blog: the list of blog posts, for any visitor
  handler: app/blog/page.jsx
  trust: visitor
- page blog/[slug]: one blog post by its slug, for any visitor
  handler: app/blog/[slug]/page.jsx
  trust: visitor
- page tweets: the archive tweets as cards, for any visitor
  handler: app/tweets/page.jsx
  trust: visitor
- page privacy: the privacy notice, for any visitor
  handler: app/privacy/page.jsx
  trust: visitor
- page terms: the terms of use, for any visitor
  handler: app/terms/page.jsx
  trust: visitor

## invariants
