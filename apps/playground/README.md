# dualmark-playground

Web playground for testing the Dualmark content negotiation algorithm interactively.

Paste an `Accept` header and `User-Agent`, get the live verdict from `@dualmark/core`'s `negotiateFormat` + `detectAIBot`. All computation runs in the browser; no network requests.

## Run

```bash
pnpm install
pnpm dev      # http://localhost:5173
pnpm build    # static dist/
pnpm preview
```

## What it shows

- Whether the request would be served as **markdown**, **html**, or **406**
- AI bot detection (name + vendor) from the UA
- Parsed Accept header entries sorted by quality factor

Useful for:
- Debugging Accept-header behavior in CI/dev
- Demonstrating Dualmark behavior to stakeholders
- Catching weird UA strings that should/shouldn't trigger bot detection

## License

MIT
