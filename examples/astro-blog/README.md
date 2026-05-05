# dualmark-example-astro-blog

Minimal Astro 5 site demonstrating the `@dualmark/astro` integration.

## Run

```bash
pnpm install
pnpm dev              # http://localhost:4321 — full Dualmark headers (recommended for verify)
pnpm build            # generates dist/ with html + .md twins (static)
pnpm preview          # serves static dist/ — note: response headers are NOT preserved by static serving
```

Visit `http://localhost:4321/blog/hello-world` (HTML) or `http://localhost:4321/blog/hello-world.md` (markdown).

## Verify with the CLI

In one terminal:
```bash
pnpm dev
```

In another:
```bash
pnpm verify
# or directly:
npx @dualmark/cli verify http://localhost:4321/blog/hello-world
```

Expected output: **Score 80/80 with `--skip-negotiation`** (full negotiation requires a public deployment behind a real edge), exit code `0`.

## What's wired up

- 1 collection (`blog`) → auto-generated `/blog/[slug].md` and `/blog.md`
- 2 static pages (`/`, `/about`) → auto-generated `/index.md` and `/about.md`
- `/llms.txt` auto-generated from config
- Astro middleware injects `Link rel="alternate" type="text/markdown"` on every HTML response
- Endpoints set spec headers: `X-Markdown-Tokens`, `X-Robots-Tag: noindex`, `Vary: Accept`, `X-AEO-Version: 1.0`, `X-Content-Type-Options: nosniff`

## Static vs. server mode

This example uses Astro's default **static** output. The `.md` files are written to disk at build time, but their HTTP headers are only set at request time by Astro's endpoint runtime — that means:

- ✅ `astro dev` serves them with full headers (use this for `dualmark verify`)
- ⚠️ `astro preview` serves the static files via Vite's static server and does **not** preserve those headers
- ✅ Real production deployments (Cloudflare, Netlify, Vercel) preserve headers via their edge runtimes — see `examples/astro-cloudflare-full` for the production pattern

## License

MIT
