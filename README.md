# Dualmark

> Every page, dual-marked.

Dualmark is open-source **AEO (Answer Engine Optimization) infrastructure** — the framework that gives every site a markdown twin for AI agents alongside its HTML for humans. Same URL, two formats, picked by HTTP content negotiation.

Built and battle-tested at [Dodo Payments](https://dodopayments.com).

## What's in the box

| Package | Purpose |
|---|---|
| [`@dualmark/core`](./packages/core) | Framework-agnostic primitives — content negotiation, AI-bot detection, markdown response, token estimation, composition helpers |
| [`@dualmark/converters`](./packages/converters) | 11 production-tested converter factories (blog, glossary, tax, country, currency, payment-method, case-study, compare, tool, video, legal) |
| [`@dualmark/astro`](./packages/astro) | Astro integration — auto-generates `.md` endpoints from collection config, ships middleware for `Link rel="alternate"` headers, generates `llms.txt` |
| [`@dualmark/cloudflare`](./packages/cloudflare) | Cloudflare Workers edge adapter — wraps any upstream Worker, transparently serves markdown to AI bots, integrates Analytics Engine |
| [`@dualmark/cli`](./packages/cli) | `dualmark verify <url>` — conformance test runner against the AEO Spec |

Plus:

- [`spec/`](./spec) — the **AEO Specification** (HTTP content negotiation, headers contract, AI bot registry, discovery)
- [`apps/docs/`](./apps/docs) — Mintlify docs at [dualmark.dev](https://dualmark.dev)
- [`apps/playground/`](./apps/playground) — paste an Accept header, see how it negotiates
- [`examples/`](./examples) — astro-blog, astro-cloudflare-full, nextjs-app-router

## Quickstart (Astro)

```bash
pnpm add @dualmark/astro
```

```ts
// astro.config.mjs
import { defineConfig } from "astro/config";
import dualmark from "@dualmark/astro";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    dualmark({
      siteUrl: "https://example.com",
      collections: {
        blog: { converter: "blog", route: "blog" },
      },
      llmsTxt: { enabled: true },
    }),
  ],
});
```

That's it. Every blog post now has a markdown twin at `/blog/<slug>.md`, an `llms.txt` is auto-generated, and an Astro middleware injects the `Link: <…>; rel="alternate"; type="text/markdown"` header on every HTML response.

## Why this exists

AI search engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) consume websites differently from humans. They want clean markdown without nav chrome, ads, or JavaScript. Today, every team solves this independently — some append `.md`, some serve `llms.txt`, most do nothing.

Dualmark provides:

1. A **reference implementation** that's transparent to your existing site
2. A **public spec** any server (in any language) can implement
3. A **conformance CLI** so you can score any site

## Development

```bash
pnpm install
pnpm build   # turbo-orchestrated build of all packages
pnpm test    # vitest across all packages
pnpm typecheck
pnpm lint
```

## License

MIT — see [LICENSE](./LICENSE).

## Status

Pre-1.0. APIs may change. The AEO Spec is authoritative; framework code follows.
