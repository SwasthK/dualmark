# @dualmark/cloudflare

Cloudflare Workers edge adapter for the Dualmark AEO framework. Wraps any upstream Worker and transparently serves markdown to AI bots — no changes to your existing site.

## Install

```bash
bun add @dualmark/cloudflare @dualmark/core
```

## Usage

```ts
import astroWorker from "./dist/_worker.js/index.js";
import { createAEOWorker } from "@dualmark/cloudflare";

export default createAEOWorker({
  upstream: astroWorker,

  redirects: {
    internal: { "/old-path": "/new-path" },
    external: { "/login": "https://app.example.com" },
  },

  analytics: { binding: "AI_AGENT_ANALYTICS" },

  trailingSlash: "never",

  hooks: {
    onAIRequest: (info) => console.log(`${info.botName} hit ${info.pathname}`),
    onMiss: (info) => console.warn(`miss: ${info.pathname}`),
  },
});
```

## Wrangler config

```jsonc
{
  "name": "my-site",
  "main": "./worker.ts",
  "compatibility_date": "2026-05-04",
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "analytics_engine_datasets": [
    { "binding": "AI_AGENT_ANALYTICS", "dataset": "ai_agent_events" }
  ]
}
```

## What it does

1. Trailing-slash enforcement (configurable: `never`, `always`, `preserve`)
2. AI bot detection via UA
3. Content negotiation via Accept header
4. Serves pre-built `.md` from `env.ASSETS` with full AEO headers
5. Internal redirects: routes to target's `.md`
6. External redirects: returns markdown notice
7. 406 when neither HTML nor markdown is acceptable
8. Link header injection (`<…>; rel="alternate"; type="text/markdown"`) on HTML responses
9. Analytics Engine tracking (hit/miss, bot, country, tokens)
10. Falls through to upstream Worker for everything else

## License

MIT
