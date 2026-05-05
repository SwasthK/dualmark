# dualmark-example-astro-cloudflare-full

Production-grade reference: a static Astro site deployed to Cloudflare Workers, with `@dualmark/cloudflare` wrapping the asset server so AI bots get markdown at the edge.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ Cloudflare Worker (worker.ts)                               │
│   createAEOWorker({                                         │
│     upstream: { fetch: (req, env) => env.ASSETS.fetch(req) }│
│     analytics: { binding: "AI_AGENT_ANALYTICS" }            │
│   })                                                        │
│                                                             │
│   ↓ AI bot UA + Accept: text/markdown                       │
│   → serves /blog/foo.md from ASSETS, sets headers           │
│                                                             │
│   ↓ Human / unknown UA                                      │
│   → falls through to env.ASSETS.fetch(req) → /blog/foo HTML │
│   → middleware appends `Link rel="alternate"` header        │
└─────────────────────────────────────────────────────────────┘
```

## Build

```bash
bun install
bun run build       # astro build → ./dist/ with HTML + .md twins + llms.txt
```

## Run locally with Wrangler

```bash
bun run wrangler:dev   # http://localhost:8787
```

Test the negotiation:

```bash
# As a browser → HTML
curl -sI http://localhost:8787/blog/edge-aeo

# As ChatGPT → markdown
curl -sI -H "User-Agent: GPTBot/1.0" -H "Accept: text/markdown" http://localhost:8787/blog/edge-aeo

# Direct .md path → markdown (works for any client)
curl -sI http://localhost:8787/blog/edge-aeo.md
```

## Deploy

```bash
bun run wrangler:deploy
```

## What's wired up

- Astro static output (`./dist/`) served via the `ASSETS` binding
- `createAEOWorker` adds AI bot detection, markdown serving, Link headers, and Analytics Engine telemetry
- 2 collections: `blog` (1 post) + `glossary` (2 terms) → auto-generated `.md` twins
- 2 static pages (`/`, `/about`) → auto-generated `.md` twins
- `llms.txt` listing all entry points

## Verify with the CLI

After `wrangler:dev`:

```bash
npx @dualmark/cli verify http://localhost:8787/blog/edge-aeo
```

Expect a high score because Wrangler preserves the response headers our worker sets.

## License

MIT
