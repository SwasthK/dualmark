# Dualmark: Open-Source AEO Infrastructure — Detailed Plan

**Status:** Draft v2 (name locked)
**Owner:** TBD
**Created:** 2026-05-04
**Last updated:** 2026-05-05 (renamed AEO-Kit → Dualmark)
**Source:** Extracted from `dodo-website` markdown-for-agents infrastructure

## Launch Identity

| Asset | Value | Status |
|---|---|---|
| **Project name** | Dualmark | ✅ Locked (May 2026) |
| **Repo** | `github.com/dodopayments/dualmark` | ✅ Available (no new org needed) |
| **npm** | `dualmark` (bare), `@dualmark/*` (scope) | ✅ Available, both reservable by Dodo Payments npm account |
| **Domain** | `dualmark.dev` (primary), `dualmark.io` (defensive) | ✅ Available |
| **Tagline** | *"Every page, dual-marked."* | Working |
| **Spec name** | The AEO Spec (canonical) — published at `dualmark.dev/spec` | Independent of framework name; preserves category-creating value |
| **Origin framing** | *"Built and battle-tested at [Dodo Payments](https://dodopayments.com)"* | Sponsor model, not vendor-lock framing |
| **Conflicts checked** | npm bare name, npm scope, GitHub repo path, USPTO (Class 9, 42), funded startups in AI/dev space | ✅ No active conflicts identified |

**Naming logic:** "Dualmark" describes the architecture directly — every page is dual-marked: HTML for browsers, markdown for AI agents. Same URL, two formats, picked by content negotiation. Self-documenting, low explanation cost, infrastructure-coded.

---

## 1. Vision & Positioning

### 1.1 The Category

**Answer Engine Optimization (AEO)** is to AI-powered answer engines (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) what SEO was to search engines. The category is nascent — there are tools (llms.txt generators, schema validators, citability scorers) but **no infrastructure framework**.

Dualmark fills that gap. It is the "Next.js for AEO" — a framework that gives every site:
- Native markdown serving for AI agents
- Transparent content negotiation (one URL, two formats)
- AI-bot detection at the edge
- Token-aware response headers
- Automatic discovery (llms.txt, sitemap.md, Link headers)

### 1.2 Why Now

1. **AI search traffic is growing**. ChatGPT search, Perplexity, Google AI Overviews route real users through AI answers. Sites that don't optimize for citation lose visibility.
2. **No standard exists yet**. The market is fragmented: some sites append `.md` to URLs, others rely on llms.txt, others do nothing. A reference implementation + spec creates the standard.
3. **The work is non-trivial**. We've spent months solving this. Other teams shouldn't have to.
4. **First-mover advantage on the term "AEO Infrastructure"**. Dodo Payments becomes known as the company that defined the category.

### 1.3 What It Is NOT

- Not an SEO tool (no rank tracking, no keyword research)
- Not a content management system
- Not a static site generator (it integrates with existing ones)
- Not a Cloudflare-only thing (Cloudflare is the first adapter, not the only one)

### 1.4 Success Metrics (12 months)

- 1,000+ GitHub stars on `dodopayments/dualmark`
- 50+ production sites using `@dualmark/astro`
- Dualmark headers contract referenced by 3+ AI providers (OpenAI, Anthropic, Perplexity) in their crawler docs
- "AEO Infrastructure" appears in 100+ third-party blog posts as a category

---

## 2. Architecture

### 2.1 Package Structure (Monorepo)

```
dualmark/                            # github.com/dodopayments/dualmark
├── packages/
│   ├── core/                        # @dualmark/core         — framework-agnostic primitives
│   ├── astro/                       # @dualmark/astro        — Astro integration
│   ├── cloudflare/                  # @dualmark/cloudflare   — Cloudflare Workers edge adapter
│   ├── converters/                  # @dualmark/converters   — domain-specific converters
│   ├── nextjs/                      # @dualmark/nextjs       — Next.js adapter (v0.3+)
│   └── express/                     # @dualmark/express      — Express middleware (v0.3+)
├── examples/
│   ├── astro-blog/                  # minimal blog (v0.1)
│   ├── astro-pseo/                  # programmatic SEO mirroring dodo-website (v0.2)
│   ├── astro-cloudflare-full/       # full edge integration (v0.2)
│   └── nextjs-app-router/           # Next.js 15 example (v0.3)
├── apps/
│   ├── docs/                        # Mintlify docs at dualmark.dev (v0.1)
│   └── playground/                  # Web playground for Accept header testing (v0.2)
├── spec/
│   ├── README.md                    # AEO Headers Contract spec (v0.1)
│   └── content-negotiation.md       # Detailed negotiation spec (v0.1)
├── .changeset/                      # Versioning via Changesets
├── package.json                     # Workspace root
├── pnpm-workspace.yaml              # pnpm workspaces
├── turbo.json                       # Turborepo for build caching
└── README.md
```

**Why pnpm + Turborepo over Bun workspaces:** Bun is fast but pnpm has wider ecosystem support for OSS contributors. Turborepo gives us remote caching for CI.

### 2.2 Dependency Graph

```
@dualmark/core              (zero deps — pure TypeScript)
   ├── @dualmark/astro      (depends on core + astro)
   ├── @dualmark/cloudflare (depends on core + @cloudflare/workers-types)
   ├── @dualmark/converters (depends on core only)
   ├── @dualmark/nextjs     (depends on core + next)
   └── @dualmark/express    (depends on core + express types)
```

The core has zero runtime dependencies. Adapters add their host-framework dep.

---

## 3. Package: `@dualmark/core`

### 3.1 Public API

```typescript
// Response construction
export function markdownResponse(
  body: string,
  options?: MarkdownResponseOptions
): Response;

export interface MarkdownResponseOptions {
  cacheControl?: string;           // default: "public, max-age=3600"
  noindex?: boolean;               // default: true (sets X-Robots-Tag)
  redirectFrom?: string;           // sets X-Redirect-From header
  redirectTo?: string;             // sets X-Redirect-To header
  extraHeaders?: HeadersInit;
}

// Token estimation
export function estimateTokens(text: string): number;
// Default: whitespace-split count. Pluggable via setTokenEstimator() for tiktoken/etc.
export function setTokenEstimator(fn: (text: string) => number): void;

// Text normalization
export function normalizeUnicode(text: string): string;
export function cleanBody(body: string, opts?: CleanBodyOptions): string;

export interface CleanBodyOptions {
  stripImages?: boolean;           // default: true
  htmlTagReplacements?: Record<string, string>; // <Highlighted> → **
  collapseBlankLines?: boolean;    // default: true (3+ → 2)
}

// Content negotiation
export function parseAcceptHeader(header: string): ParsedMediaType[];

// Generic format negotiation: caller declares which format keys are available,
// and the function returns the chosen key (or null if no acceptable type).
// Each format key maps to one or more media types via FORMAT_REGISTRY (built-in
// for "html" and "markdown"; extensible via registerFormat()).
export function negotiateFormat<T extends string = "html" | "markdown">(
  accept: string,
  available?: ReadonlyArray<T>  // default: ["html", "markdown"]
): T | null;

export function registerFormat(key: string, mediaTypes: Array<[string, string]>): void;
// Built-in: "html" → [["text","html"], ["application","xhtml+xml"]]
//           "markdown" → [["text","markdown"]]
// Custom registration enables A3 QA case: registerFormat("json", [["application","json"]])

export function mediaTypeMatches(
  pref: ParsedMediaType,
  type: string,
  subtype: string
): boolean;

export interface ParsedMediaType {
  type: string;
  subtype: string;
  quality: number;
}

// AI bot detection
export function detectAIBot(userAgent: string): AIBotInfo;
export interface AIBotInfo {
  isBot: boolean;
  name: string | null;          // e.g. "GPTBot"
  vendor: string | null;        // e.g. "OpenAI"
  purpose: "training" | "search" | "user-action" | "unknown" | null;
}

export const AI_BOTS: ReadonlyArray<AIBotEntry>;
export interface AIBotEntry {
  name: string;
  uaPattern: string | RegExp;
  vendor: string;
  purpose: "training" | "search" | "user-action" | "unknown";
  docsUrl?: string;
}

// Composition helpers
export function listingToMarkdown(opts: ListingOptions): string;
export interface ListingOptions {
  title: string;
  description: string;
  url: string;
  items: Array<{ title: string; href: string; description?: string }>;
  groupBy?: (item: ListingItem) => string;  // optional grouping
}

export function renderRelatedLinks(links: RelatedLinks): string;
export function renderFAQSection(faqs: FAQItem[]): string;
export function renderLinkAlternateHeader(htmlUrl: string, mdUrl: string): string;

export interface FAQItem {
  question: string;
  answer: string;
}

export interface RelatedLinks {
  [groupName: string]: Array<{ title: string; href: string }>;
}

// Header injection helper
export function injectMarkdownAlternateLink(
  response: Response,
  htmlUrl: string,
  mdUrl: string
): Response;
```

### 3.2 What's Extracted From Where

| Source file (this repo) | Lines | → core export |
|-------------------------|-------|---------------|
| `src/utils/content-negotiation.ts` | 1-97 | `parseAcceptHeader`, `negotiateFormat`, `mediaTypeMatches`, `ParsedMediaType` |
| `src/utils/markdown-response.ts` | (response wrapping + headers) | `markdownResponse` |
| `src/utils/markdown-response.ts` | (estimateTokens equivalent) | `estimateTokens`, `setTokenEstimator` |
| `src/utils/markdown-response.ts` | (normalizeUnicode) | `normalizeUnicode` |
| `src/utils/markdown-response.ts` | (cleanBody) | `cleanBody` |
| `src/utils/markdown-response.ts` | (listingToMarkdown) | `listingToMarkdown` |
| `src/utils/markdown-response.ts` | (renderRelatedLinks, renderFAQSection) | same names |
| `worker-wrapper.ts` | `AI_BOTS` array + `identifyAiBot()` | `AI_BOTS`, `detectAIBot` |

### 3.3 Modifications During Extraction

1. **Remove Dodo branding.** Strip any references to "Dodo Payments", `SITE_URL` constants, `PRODUCT_SIBLINGS`, `SECTION_NAMES`.
2. **Remove `productToMarkdown`** — too project-specific. Replaced by user-supplied converter pattern in `@dualmark/converters`.
3. **Make token estimation pluggable.** Default whitespace-count; allow `setTokenEstimator(fn)` for users who want tiktoken/Anthropic tokenizer.
4. **Convert `renderRelatedLinks` data shape** from current platform-coupled format to generic `RelatedLinks` interface.
5. **Add `negotiateFormat(accept, available)` `available` parameter** so users can declare which formats they support (currently hardcoded to html+markdown).
6. **Generalize `AI_BOTS`** from string array to typed entries with vendor/purpose metadata. This becomes valuable for analytics.

### 3.4 Test Coverage Target

- Unit tests: 100% line + branch coverage on core
- Property tests for `parseAcceptHeader` with `fast-check` (random Accept headers must not throw)
- Snapshot tests for `listingToMarkdown`, `renderRelatedLinks`, `renderFAQSection`
- Conformance tests against the AEO spec (see §6)

---

## 4. Package: `@dualmark/astro`

### 4.1 User-Facing API

```typescript
// astro.config.mjs
import { defineConfig } from "astro/config";
import aeo from "@dualmark/astro";

export default defineConfig({
  integrations: [
    aeo({
      siteUrl: "https://example.com",

      collections: {
        blog: {
          converter: "blog",                // built-in converter
          route: "blogs",                   // → /blogs/[slug] + /blogs.md
          slugStrategy: "catch-all",        // [...slug] vs [slug]
          sortBy: (a, b) => b.data.publishedDate - a.data.publishedDate,
          filter: (entry) => entry.data.publishedDate <= new Date(),
        },
        glossary: {
          converter: "glossary",
          route: "glossary",
        },
        custom: {
          converter: myCustomConverter,     // user function
          route: "things",
          listingMetadata: {
            title: "All Things",
            description: "A list of things.",
          },
        },
      },

      // Static pages — single markdown content, no collection
      staticPages: {
        "/": () => "# Welcome\n\nMarkdown for the homepage.",
        "/pricing": () => "# Pricing\n\n...",
        "/about": () => "# About\n\n...",
      },

      // Parameterized routes — dynamic params not backed by a collection
      parameterizedRoutes: {
        "blogs/category/[category]": {
          getStaticPaths: async () => {
            const blogs = await getCollection("blog");
            const cats = [...new Set(blogs.map(b => b.data.category))];
            return cats.map(c => ({ params: { category: c } }));
          },
          render: async ({ params }) => {
            const posts = await getCollection("blog", b => b.data.category === params.category);
            return listingToMarkdown({ title: `${params.category} Posts`, items: posts.map(/*...*/) });
          },
        },
      },

      llmsTxt: {
        enabled: true,
        sections: [
          { title: "Products", path: "/products" },
          { title: "Blog", path: "/blogs" },
        ],
      },

      sitemap: {
        includeMarkdown: true,              // adds .md URLs to sitemap.xml
      },

      headers: {
        cacheControl: "public, max-age=3600",
        noindex: true,
      },
    }),
  ],
});
```

### 4.2 What The Integration Does

1. **Auto-generates `.md.ts` endpoints** at build time via Astro's integration hooks (`astro:config:setup` → `injectRoute()`).
   - For each configured collection: detail endpoint + listing endpoint
   - For each configured **static page**: single `.md` endpoint with user-supplied content function (covers `index.md.ts`, `pricing.md.ts`, `about.md.ts`, etc.)
   - For each configured **filtered/category route**: parameterized `.md.ts` endpoint with user-supplied filter function (covers `blogs/category/[category].md.ts`)
   - User never writes a `.md.ts` file
2. **Generates `llms.txt`** from config + collection metadata.
3. **Extends sitemap** with `.md` URLs (if `sitemap.includeMarkdown`).
4. **Validates config** against Zod schema at integration setup. Fails fast on misconfiguration.
5. **Provides `<MarkdownAlternate />` Astro component** that injects `<link rel="alternate" type="text/markdown" />` into HTML pages (for non-Cloudflare deployments).

**Coverage matrix (against the 43 existing `.md.ts` endpoints in dodo-website):**

| Endpoint type | Count | Integration support | Config example |
|---|---|---|---|
| Collection detail (`tax/[slug].md.ts`, etc.) | 14 | Built-in via `collections` config | `collections: { tax: { converter: "tax", route: "tax" } }` |
| Collection listing (`tax.md.ts`, etc.) | 16 | Built-in via `collections` config | (auto-generated alongside detail) |
| Static page (`index.md.ts`, `pricing.md.ts`, `about.md.ts`, `contact.md.ts`, `careers.md.ts`, `partner-program.md.ts`, `sentra.md.ts`, `wall-of-love.md.ts`, `brand.md.ts`, `write-for-us.md.ts`, `downloads.md.ts`, `support/why-has-dodo-payments-charged-me.md.ts`) | 12 | Built-in via `staticPages` config | `staticPages: { "/": () => "# Home...", "/pricing": () => "# Pricing..." }` |
| Filtered/category routes (`blogs/category/[category].md.ts`, `blogs/category/index.md.ts`) | 1+1 | Built-in via `parameterizedRoutes` config | `parameterizedRoutes: { "blogs/category/[category]": { params, render } }` |

Total: 14 + 16 + 12 + 2 = 44 endpoints supported (43 in current repo + 1 buffer for new additions). Phase 4 of §9 deletes all 43 only after the integration is verified to produce equivalent output for every endpoint type.

### 4.3 Implementation Strategy

```typescript
// packages/astro/src/index.ts
import type { AstroIntegration } from "astro";
import { z } from "zod";

const configSchema = z.object({ /* ... */ });

export default function aeo(userConfig: unknown): AstroIntegration {
  const config = configSchema.parse(userConfig);

  return {
    name: "@dualmark/astro",
    hooks: {
      "astro:config:setup": ({ injectRoute, addMiddleware, logger }) => {
        for (const [collectionName, opts] of Object.entries(config.collections)) {
          // Inject detail route
          injectRoute({
            pattern: `/${opts.route}/[${opts.slugStrategy === "catch-all" ? "..." : ""}slug].md`,
            entrypoint: createDetailEndpoint(collectionName, opts),
          });
          // Inject listing route
          injectRoute({
            pattern: `/${opts.route}.md`,
            entrypoint: createListingEndpoint(collectionName, opts),
          });
        }

        if (config.llmsTxt?.enabled) {
          injectRoute({
            pattern: "/llms.txt",
            entrypoint: createLlmsTxtEndpoint(config),
          });
        }
      },
      "astro:build:done": ({ pages, dir, logger }) => {
        // Validation: warn if .md routes failed to generate
      },
    },
  };
}
```

### 4.4 Built-In Converters Used By `@dualmark/astro`

The integration accepts converter names as strings (`"blog"`, `"glossary"`, `"tax"`, `"country"`, etc.) and resolves them to functions exported from `@dualmark/converters`. Users can also pass their own function.

---

## 5. Package: `@dualmark/cloudflare`

### 5.1 User-Facing API

```typescript
// worker.ts
import astroWorker from "./dist/_worker.js/index.js";
import { createAEOWorker } from "@dualmark/cloudflare";

export default createAEOWorker({
  upstream: astroWorker,                    // wrap any Worker

  redirects: {
    internal: { "/old": "/new" },
    external: { "/login": "https://app.example.com" },
  },

  skip: {
    prefixes: ["/admin", "/api/"],
    extensions: [".css", ".png"],           // defaults provided
  },

  analytics: {
    binding: "AI_AGENT_ANALYTICS",          // Analytics Engine dataset name
    schema: "v1",                           // versioned schema
  },

  trailingSlash: "never",                   // "never" | "always" | "preserve"

  headers: {
    cacheControl: "public, max-age=3600",
  },

  hooks: {
    onAIRequest: (info) => { /* custom logging */ },
    onMiss: (info) => { /* fallback handler */ },
  },
});
```

### 5.2 Behavior

1. **Trailing slash enforcement** (configurable).
2. **Skip rules** for static assets and known prefixes.
3. **AI bot detection** via UA + Accept header negotiation.
4. **Markdown serving**: fetch pre-built `.md` from ASSETS binding, return with full AEO headers.
5. **Redirect handling**: internal redirects route to target's `.md`; external redirects return markdown notice.
6. **406 response** when Accept header has q=0 for everything.
7. **Link header injection** on HTML responses (`<url.md>; rel="alternate"; type="text/markdown"`).
8. **Analytics tracking** to Cloudflare Analytics Engine (optional binding).
9. **Hit/miss tracking** so users can monitor `.md` coverage.

### 5.3 Extracted From

`worker-wrapper.ts` lines 1-397 — almost the entire file becomes the package. The only changes:
- Redirect maps become user config (currently hardcoded `AI_REDIRECTS` / `EXTERNAL_REDIRECTS`)
- Skip rules become user config
- Analytics binding name is configurable
- Trailing slash policy is configurable
- Hooks system added for custom behavior

### 5.4 Why This Is The Killer Feature

The Cloudflare adapter is what makes Dualmark **transparent**. Without it, users have to:
- Append `.md` to URLs manually
- Manage their own AI bot detection
- Manually inject Link headers

With it, every existing site becomes AI-agent-friendly without changing a single page or URL. **This is the "wow" demo.**

---

## 6. Package: `@dualmark/converters`

### 6.1 What's Provided

```typescript
import {
  blogConverter,
  caseStudyConverter,
  glossaryConverter,
  legalConverter,
  compareConverter,
  toolConverter,
  videoConverter,
  taxConverter,
  countryConverter,
  paymentMethodConverter,
  currencyConverter,
} from "@dualmark/converters";
```

Each export is a **factory** that takes config and returns a converter function:

```typescript
const myBlogConverter = blogConverter({
  siteUrl: "https://example.com",
  brandFooter: "## About Acme\n\nAcme builds widgets.",
  authorLinks: true,
  includeRelatedPosts: 5,
});

// myBlogConverter is now: (entry) => string
```

### 6.2 Converter Contract

```typescript
export type Converter<TEntry> = (entry: TEntry) => string;
export type ConverterFactory<TConfig, TEntry> = (config: TConfig) => Converter<TEntry>;
```

### 6.3 Schema Compatibility

Each built-in converter declares the **frontmatter shape it requires** as a Zod schema. Users either match the schema in their content collection OR write a thin adapter:

```typescript
// User's collection has different field names
const myAdapter = (entry: MyEntry) => ({
  title: entry.data.headline,         // mapped
  description: entry.data.summary,    // mapped
  publishedDate: entry.data.date,     // mapped
  body: entry.body,
});

const myBlogConverter = blogConverter({
  adapter: myAdapter,
  siteUrl: "...",
});
```

### 6.4 Extending Converters

Users can compose:

```typescript
import { blogConverter, renderFAQSection } from "@dualmark/converters";

const customBlogConverter = (entry) => {
  const base = blogConverter({ siteUrl })(entry);
  return base + "\n\n" + renderFAQSection(entry.data.faqs ?? []);
};
```

---

## 7. The AEO Spec (`spec/README.md`)

This is the **strategic anchor**. Even people who never use the framework reference the spec.

### 7.1 Spec Structure

```
spec/
├── README.md                    # Overview
├── content-negotiation.md       # Accept header + Vary semantics
├── headers.md                   # All AEO-* and X-* headers
├── ai-bot-detection.md          # UA patterns, bot registry
├── llms-txt-extensions.md       # Extensions to llms.txt format
├── discovery.md                 # Link header, sitemap.md conventions
└── conformance.md               # Test suite for spec compliance
```

### 7.2 Headers Contract (Public Spec Document)

Defined headers:

| Header | Direction | Purpose |
|--------|-----------|---------|
| `Accept: text/markdown` | Request | Client requests markdown format |
| `Content-Type: text/markdown; charset=utf-8` | Response | Server delivers markdown |
| `Vary: Accept` | Response | CDN cache key includes Accept |
| `X-Markdown-Tokens: <n>` | Response | Estimated token count of body |
| `X-Robots-Tag: noindex` | Response | Markdown twins shouldn't be indexed as pages |
| `X-Content-Type-Options: nosniff` | Response | Prevent MIME sniffing |
| `Link: <url.md>; rel="alternate"; type="text/markdown"` | Response | HTML response advertises markdown twin |
| `X-AEO-Version: 1.0` | Response | (NEW) Spec version this server implements |
| `X-Redirect-From / X-Redirect-To` | Response | Markdown response was redirected |

### 7.3 Why The Spec Matters

1. **Adoption signal**. AI providers (OpenAI, Anthropic, Perplexity) can reference the spec instead of inventing their own conventions.
2. **Conformance tests**. Anyone can validate their site against the spec.
3. **Marketing leverage**. "Built on the AEO Spec" is more durable than "uses our framework."
4. **Decoupled from implementation**. Java sites, Go sites, anyone can implement the spec without using Dualmark.

### 7.4 Spec Authoring Plan

- Day 1: Draft v0.1 spec (extract from existing implementation)
- Day 2: Internal review
- Day 3: External feedback (post in r/SEO, HN, Hacker News, AI engineering Discord)
- Day 4-5: Iterate
- Day 6: Publish v1.0 alongside framework v0.1

---

## 8. Roadmap & Milestones

### 8.1 v0.0 — Internal Prep (Week 0, before public announcement)

- [ ] Repo setup: monorepo, pnpm, Turborepo, Changesets
- [ ] CI: GitHub Actions (test, lint, typecheck, build, release)
- [ ] License: MIT
- [ ] CONTRIBUTING.md, CODE_OF_CONDUCT.md
- [ ] Domain: `dualmark.dev` registered
- [ ] GitHub org: `dualmark`
- [ ] Twitter/X: `@dualmark`
- [ ] Discord server scaffolded

### 8.2 v0.1 — Foundation (Weeks 1-2)

**Goal:** Ship `@dualmark/core` + `@dualmark/astro` (1 collection type) + the spec + a simple example. Earn first stars.

**Deliverables:**
- [ ] `@dualmark/core` published to npm (full API per §3)
- [ ] `@dualmark/astro` published to npm (Astro integration with blog converter only)
- [ ] AEO Spec v1.0 published (`spec/README.md`, `spec/headers.md`, `spec/content-negotiation.md`)
- [ ] `examples/astro-blog` — minimal blog with 5 posts, deployed live at `astro-blog.dualmark.dev`
- [ ] Docs site at `dualmark.dev` (Mintlify-based)
  - [ ] Quickstart (5 min to working setup)
  - [ ] Core API reference
  - [ ] Astro integration guide
  - [ ] Spec link
- [ ] Launch blog post: "Introducing AEO Infrastructure" (cross-post Dodo blog + dev.to + HN + Reddit)
- [ ] Demo video (90 seconds): site with Dualmark being browsed by Claude/ChatGPT
- [ ] 100% test coverage on `@dualmark/core`
- [ ] Conformance test runner (`npx dualmark verify https://example.com`)

**Acceptance criteria:**
- A new Astro project can install `@dualmark/astro`, configure 1 collection, build, and have working `.md` endpoints in <10 minutes
- Conformance test passes on the example site
- 5+ external developers have tried it and given feedback

### 8.3 v0.2 — Edge + Full Converter Library (Weeks 3-6)

**Goal:** Ship the Cloudflare adapter (the killer feature) and all 11 production-tested converters. This is when the framework becomes irresistible.

**Deliverables:**
- [ ] `@dualmark/cloudflare` published (full edge layer per §5)
- [ ] `@dualmark/converters` published (all 11 converters per §6)
- [ ] `examples/astro-pseo` — programmatic SEO example with 100+ pages, mirrors dodo-website pattern
- [ ] `examples/astro-cloudflare-full` — end-to-end with edge layer
- [ ] llms.txt auto-generation in `@dualmark/astro`
- [ ] Sitemap markdown integration
- [ ] Web playground (`apps/playground`) — paste an Accept header, see how it's negotiated
- [ ] Migration guide: "How dodo-website migrated to Dualmark"
- [ ] Case study from dodo-website with metrics

**Acceptance criteria:**
- dodo-website itself migrated to Dualmark (dogfooding) without functionality loss
- Cloudflare adapter handles 1M+ requests/day in production
- 500+ GitHub stars
- 10+ production deployments tracked

### 8.4 v0.3 — Multi-Framework (Weeks 7-12)

**Goal:** Beyond Astro. Become the universal AEO framework.

**Deliverables:**
- [ ] `@dualmark/nextjs` (App Router + Pages Router)
- [ ] `@dualmark/express` middleware
- [ ] `@dualmark/hono` middleware
- [ ] `@dualmark/sveltekit` adapter
- [ ] `examples/nextjs-app-router`, `examples/express-api`, `examples/hono-edge`
- [ ] Vercel adapter for the edge layer (alternative to Cloudflare)
- [ ] Conformance test runner v2 (with detailed scoring)
- [ ] CLI: `npx create-dualmark-app`

**Acceptance criteria:**
- 1,000+ GitHub stars
- 50+ production deployments
- AEO Spec referenced by external sources (blog posts, talks)

### 8.5 v1.0 — Stable (Month 4-6)

**Goal:** API stability commitment, ecosystem maturity.

**Deliverables:**
- [ ] All v0.x APIs frozen (semver-stable)
- [ ] Spec v1.0 frozen
- [ ] Performance benchmarks published
- [ ] Security audit completed
- [ ] Sponsorship program launched (Dodo Payments as anchor sponsor)
- [ ] Conference talk submitted (Astro Together, JSConf, etc.)

---

## 9. Migration Plan (dodo-website → Dualmark)

This is a **mandatory** step. Dogfooding is non-negotiable. The migration validates the framework works for real production scale.

Each phase below has executable QA scenarios. A phase is **complete only when all scenarios pass with the expected results listed**. Do not advance to the next phase until the current one passes.

### Phase 0: Baseline preparation (must complete before Phase 1)

This phase creates the artifacts referenced by later QA scenarios. Without these baselines, regression detection in Phases 1-5 is impossible.

**Tasks:**
- Create `scripts/migration/check-all-md-endpoints.sh`:
  ```bash
  #!/bin/bash
  # Iterates known-slugs.txt, hits each URL with bot UA, records status code
  set -euo pipefail
  HOST="${1:-https://website.dodopayments.tech}"
  while IFS= read -r slug; do
    code=$(curl -s -o /dev/null -A "GPTBot" -w "%{http_code}" "$HOST$slug")
    echo "$code $slug"
  done < scripts/migration/known-slugs.txt
  ```
- Create `scripts/migration/known-slugs.txt` by globbing existing `.md.ts` files and converting to URL paths. One-time generator: `find src/pages -name "*.md.ts" | sed -e 's|src/pages||' -e 's|\.md\.ts$||' -e 's|/index$|/|' -e 's|\[\.\.\.slug\]||g' -e 's|\[slug\]||g' | sort -u > scripts/migration/known-slugs.txt`. Manually expand `[slug]` placeholders to actual slugs by reading content collections (script: `bun run scripts/migration/expand-slugs.ts` — to be written, ~30 lines).
- Snapshot `dist-baseline/` by running `bun run build && cp -r dist dist-baseline-$(date +%Y%m%d)`.
- Run baseline crawl: `./scripts/migration/check-all-md-endpoints.sh https://website.dodopayments.tech > migration-baselines/all-endpoints-status.txt` against current production worker.
- Compute baseline token distribution: `bun run scripts/migration/token-distribution.ts > migration-baselines/token-distribution.json` (script: ~20 lines, fetches each `.md` URL with bot UA, parses `X-Markdown-Tokens` header, outputs `{slug, tokens}` array).
- Commit all baselines to git under `migration-baselines/` so future phases can diff against them.

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 0.1 | `wc -l scripts/migration/known-slugs.txt` | Count of slugs | Returns ≥43 (matches current `.md.ts` file count); manual review confirms each line is a valid URL path beginning with `/` |
| 0.2 | `bash scripts/migration/check-all-md-endpoints.sh https://website.dodopayments.tech \| head -5` | Smoke-test the crawl script | First 5 lines are `200 /<slug>` format |
| 0.3 | `wc -l migration-baselines/all-endpoints-status.txt` | Baseline crawl complete | Line count matches `wc -l scripts/migration/known-slugs.txt` |
| 0.4 | `grep -v "^200 " migration-baselines/all-endpoints-status.txt \| wc -l` | Count non-200 responses in baseline | Zero (current production should serve all known endpoints; if any fail, document as known-broken before Phase 1) |
| 0.5 | `cat migration-baselines/token-distribution.json \| jq 'length'` | Token distribution captured for all slugs | Equals slug count |
| 0.6 | `ls -d dist-baseline-*` | Baseline `dist/` snapshot exists | Directory present, contains `.md` files matching production state |

**Phase 0 complete when:** All 6 scenarios pass.

### Phase 1: Parallel install (no behavior change)

**Tasks:**
- Install `@dualmark/core` alongside existing utils (`bun add @dualmark/core`)
- Replace `src/utils/content-negotiation.ts` import with `@dualmark/core` import in `worker-wrapper.ts` and any callers
- Replace `markdownResponse()` import with `@dualmark/core` import in all 43 `.md.ts` files
- Keep old utility files in place (do not delete yet)

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 1.1 | `bun test tests/aeo/` | Run full AEO test suite | All tests pass; same count as pre-migration baseline |
| 1.2 | `bun run build` | Production build | Exit 0, no warnings about missing imports |
| 1.3 | `diff -r dist-baseline/ dist/` | Compare with pre-migration `dist/` snapshot taken before Phase 1 | No differences in any `.md` or `.html` file (allowed: timestamp metadata in headers) |
| 1.4 | `bunx wrangler dev` + `curl` | Run `curl -H "Accept: text/markdown" http://localhost:8787/blogs/<known-slug>` | Status 200, `Content-Type: text/markdown`, body byte-identical to pre-migration `dist/blogs/<slug>.md` |
| 1.5 | `bun run check-links` | Internal link check | Same pass/fail counts as baseline |

**Phase complete when:** All 5 scenarios pass.

### Phase 2: Replace converters

**Tasks:**
- Replace each `*ToMarkdown` function with a factory call from `@dualmark/converters` configured with Dodo-specific options (`PRODUCT_SIBLINGS`, brand footer, site URL)
- Move `PRODUCT_SIBLINGS` and `SECTION_NAMES` from `markdown-response.ts` into the converter config object

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 2.1 | `bun run build` | Production build | Exit 0 |
| 2.2 | `diff -r dist-phase1/ dist/` | Byte-compare every generated `.md` file against Phase 1 snapshot | Zero diffs (or: list of expected diffs documented in `migration-diff-allowlist.md` with reason) |
| 2.3 | `bun test tests/aeo/markdown-endpoints-build.test.ts` | Markdown output validation | All assertions pass |
| 2.4 | Manual spot check (5 files) | Open `dist/blogs/<slug>.md`, `dist/tax/<slug>.md`, `dist/glossary/<slug>.md`, `dist/payments-in/<slug>.md`, `dist/index.md` | Visual inspection: branding correct, related links present, FAQ rendered, footer matches Dodo voice |
| 2.5 | `grep -r "PRODUCT_SIBLINGS\|SECTION_NAMES" src/utils/` | Verify Dodo-specific constants moved out of utility | No matches in `src/utils/` (only matches in config files) |

**Phase complete when:** All 5 scenarios pass.

### Phase 3: Replace edge layer

**Tasks:**
- Replace `worker-wrapper.ts` with a thin file calling `createAEOWorker({ ... })` from `@dualmark/cloudflare`
- Move `AI_REDIRECTS`, `EXTERNAL_REDIRECTS`, `SKIP_PREFIXES`, `ASSET_EXTENSIONS` into config object
- Pass `AI_AGENT_ANALYTICS` binding through config
- Deploy to dev (`bun run deploy:dev`)

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 3.1 | `bun run deploy:dev` | Deploy new worker to `dodo-website-dev` | Wrangler reports successful deploy, no validation errors |
| 3.2 | `curl -A "GPTBot" https://website.dodopayments.tech/blogs/<known-slug>` | AI bot UA | Status 200, `Content-Type: text/markdown`, `X-Markdown-Tokens` header present with integer value, body matches `dist/blogs/<slug>.md` |
| 3.3 | `curl -H "Accept: text/markdown" https://website.dodopayments.tech/blogs/<known-slug>` | Content negotiation | Same expected result as 3.2 |
| 3.4 | `curl -I https://website.dodopayments.tech/blogs/<known-slug>` | HTML request | `Link` header contains `<...md>; rel="alternate"; type="text/markdown"`, `Vary: Accept` present |
| 3.5 | `curl -A "GPTBot" https://website.dodopayments.tech/glossary/api-(application-programming-interface)` | Internal redirect path | Status 200, body matches the canonical target's `.md`, `X-Redirect-From` and `X-Redirect-To` headers set |
| 3.6 | `curl -A "GPTBot" https://website.dodopayments.tech/login` | External redirect path | Status 200, body contains markdown redirect notice referencing `app.dodopayments.com`, `X-Redirect-To` set |
| 3.7 | `curl -H "Accept: image/png, q=0" https://website.dodopayments.tech/blogs/<slug>` (where the value indicates html/markdown unacceptable) | 406 path: `Accept: image/png` | Status 406, body explains supported types |
| 3.8 | Loop: `for slug in $(cat known-slugs.txt); do curl -A "GPTBot" -o /dev/null -s -w "%{http_code} $slug\n" https://website.dodopayments.tech/$slug; done` (run script `scripts/migration/check-all-md-endpoints.sh`) | Hit every known `.md` URL with bot UA | All return 200; output diffed against pre-migration baseline file `migration-baselines/all-endpoints-status.txt` shows zero regressions |
| 3.9 | Cloudflare dashboard → Analytics Engine SQL: `SELECT count() FROM AI_AGENT_ANALYTICS WHERE timestamp > now() - INTERVAL '15' MINUTE` | Verify analytics writes | Count > 0 after running scenarios 3.2–3.7 |
| 3.10 | `bun test tests/aeo/crawlability-build.test.ts` | Crawlability suite | All pass |

**Phase complete when:** All 10 scenarios pass on the dev worker for at least 24 hours with no error rate increase >0.1% in Cloudflare logs.

### Phase 4: Replace endpoint generation

**Tasks:**
- Configure `@dualmark/astro` integration with all 15 collections (matching current `src/content.config.ts`)
- Run build to verify integration generates same routes
- Delete the 43 hand-written `.md.ts` files
- Re-run build and tests

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 4.1 | `bun run build` (with new files still alongside old) | First, integration generates routes alongside existing files | Build succeeds; check `.astro/routes.json` shows duplicate route conflicts (expected) — confirms integration is active |
| 4.2 | Delete 43 hand-written `.md.ts` files (`git rm src/pages/**/*.md.ts`); `bun run build` | Build with only integration-generated routes | Exit 0; `find dist -name "*.md" \| wc -l` returns same count as pre-migration baseline |
| 4.3 | `diff -r dist-phase3/ dist/` | Byte-compare every `.md` file | Zero diffs OR all diffs accounted for in `migration-diff-allowlist.md` |
| 4.4 | `bun test tests/aeo/` | Full AEO suite | All pass — note that `tests/aeo/markdown-endpoints.test.ts` (which validates source `.md.ts` files exist) will need updating to validate the integration config instead |
| 4.5 | Spot-check sitemap: `curl https://website.dodopayments.tech/sitemap-0.xml \| grep -c "\\.md<"` | Sitemap contains markdown URLs | Count matches expected (= number of pages × 2 if `sitemap.includeMarkdown: true`, else = number of HTML pages) |
| 4.6 | `git diff --stat src/pages/` | Confirm scope of deletion | Only `.md.ts` files removed; no `.astro` files modified |

**Phase complete when:** All 6 scenarios pass.

### Phase 5: Production deploy

**Tasks:**
- Merge to `prod` branch, deploy via `bun run deploy:prod`
- Monitor for 7 days

**QA scenarios:**

| # | Tool/command | Steps | Expected result |
|---|---|---|---|
| 5.1 | `bun run deploy:prod` | Deploy | Successful deploy, no errors |
| 5.2 | Smoke test: scenarios 3.2–3.8 against `https://dodopayments.com` | Repeat critical edge-layer scenarios on prod | All pass |
| 5.3 | Cloudflare dashboard: AI agent request volume over 7 days vs prior 7 days | Compare via Analytics Engine query `SELECT count() FROM AI_AGENT_ANALYTICS WHERE timestamp > now() - INTERVAL '7' DAY GROUP BY blob1` | No bot drops to zero requests; total volume within ±20% of prior week |
| 5.4 | Cloudflare logs: 5xx error rate for paths matching `/*.md` over 7 days | Query Logpush or dashboard | <0.1% error rate |
| 5.5 | Cloudflare cache hit ratio for `.md` paths | Dashboard | ≥90% (matching baseline) |
| 5.6 | Sentry / error tracking | Check for new error signatures introduced in 7-day window | Zero new error types attributable to Dualmark code paths |

**Phase complete when:** All 6 scenarios pass and 7 days have elapsed with no rollback required.

### 9.2 Risk Mitigation

- Keep old code in a `legacy/` branch for 30 days
- Add framework version to response headers (`X-AEO-Version`) for traceability
- A/B test by routing 10% of AI bot traffic to new system first (Cloudflare Workers split deployment)
- Monitor `X-Markdown-Tokens` distribution before/after for regression detection (alert if median changes by >5%)
- Rollback procedure: each phase has a documented `git revert <merge-commit>` command and `bun run deploy:prod` step that returns to last known-good state in <5 minutes
- **Baseline snapshots required before Phase 1:**
  - `dist-baseline/` — full `dist/` directory tar'd
  - `migration-baselines/all-endpoints-status.txt` — output of crawling every `.md` URL with bot UA
  - `migration-baselines/token-distribution.json` — `X-Markdown-Tokens` values per page

### 9.2 Risk Mitigation

- Keep old code in a `legacy/` branch for 30 days
- Add framework version to response headers (`X-AEO-Version`) for traceability
- A/B test by routing 10% of AI bot traffic to new system first
- Monitor `X-Markdown-Tokens` distribution before/after for regression detection

---

## 10. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AEO term doesn't catch on | Medium | High | Spec-first approach gives durable value even if term changes; fall back to "AI-friendly content delivery" framing |
| Converter API too coupled to specific schemas | High | Medium | Adapter pattern (§6.3) decouples user schema from converter expectations |
| Cloudflare-only initially limits adoption | Medium | Medium | Vercel + Netlify adapters in v0.3; documented manual integration for any platform |
| Maintenance burden of 11 converters | High | Medium | Move converters to community-maintained over time; core team owns only core |
| AI providers don't adopt the spec | Medium | Low | Spec value is independent — even self-adoption by Dualmark users is valuable |
| Dodo Payments seen as too commercial | Low | Medium | Truly OSS license (MIT), governance neutral, accept external maintainers |
| Performance regression in worker-wrapper | Low | High | Benchmark suite in CI; reject PRs that regress p99 latency >10% |
| Naming conflict with existing OSS | Low | Medium | `dualmark.dev` available, `dualmark` bare npm package available, `@dualmark` scope available, no active OSS or commercial conflicts identified (verified May 2026) |

---

## 11. Resource Requirements

### 11.1 People (Minimum)

- **1 Tech Lead** (40% time, 6 months) — architecture, spec, code review
- **1 Engineer** (80% time, 3 months) — implementation, examples, migration
- **1 DevRel/Writer** (20% time, 6 months) — docs, blog posts, community
- **1 Designer** (10 hours total) — logo, docs site visual identity

Total: ~1.5 FTE-months/month for 6 months = ~9 FTE-months

### 11.2 Money

- Domain + DNS: $50/year
- Cloudflare Pages for docs + examples: free tier sufficient initially
- Logo design (Figma freelancer): $500
- Launch ad spend (HN, Twitter promo, dev newsletters): $2,000
- Conference talk travel (post-v1.0): $3,000

Total: ~$5,500 to launch

### 11.3 Buy-In Required

- Engineering leadership: 1.5 FTE-months/month commitment
- Marketing: launch coordination, blog publishing
- Legal: MIT license sign-off, trademark check on "Dualmark"
- Brand: align on Dodo Payments' relationship to the project (sponsor vs originator vs maintainer)

---

## 12. Open Questions (Need Decisions Before Starting)

1. **Governance model.** Dodo Payments project, vendor-neutral foundation, or BDFL?
   - Recommendation: Start as Dodo project (faster decisions), move to vendor-neutral if it grows beyond 5 maintainers.

2. **Naming final lock.** "Dualmark"? "Answer Kit"? "AEO.dev"?
   - Recommendation: Dualmark. Short, descriptive, .dev domain available.

3. **Dual licensing for enterprise?**
   - Recommendation: No. Pure MIT. Enterprise value is in support contracts and managed Cloudflare deployment, not license fees.

4. **Public roadmap on GitHub Projects?**
   - Recommendation: Yes. Transparency drives contribution.

5. **Sponsorship from AI providers?**
   - Recommendation: Don't ask in v0.1. Ask in v0.3 once adoption is proven. Avoids appearance of capture.

6. **Should Dodo content stay in the OSS examples?**
   - Recommendation: No. Generic examples (recipe site, dev tools blog, marketplace). Dogfood Dodo internally as a private case study.

---

## 13. First-Week Concrete Tasks

Tasks are split by what blocks them. **Track A** can start immediately. **Track B** requires the leadership decisions in §14 to be resolved (specifically: org name lock, npm scope lock, license confirmation, sponsorship arrangement).

Each task has a specific QA scenario showing the tool/command, steps, and expected result. A task is complete only when its scenario passes.

### Track A — Unblocked work (start now, no decisions required)

These tasks can begin in a private repo or fork without the leadership decisions in §14, because they produce code/artifacts that aren't yet branded or published publicly.

#### A1. Extract `core` source code (Day 1, ~4 hours)

**Tasks:**
- Fork or branch this repo into a working directory
- Copy `src/utils/content-negotiation.ts` → `working/core/src/negotiation.ts`
- Copy relevant exports from `src/utils/markdown-response.ts` (excluding Dodo-specific `productToMarkdown`, `PRODUCT_SIBLINGS`, `SECTION_NAMES`) → `working/core/src/markdown.ts`, `tokens.ts`, `composition.ts`
- Copy `AI_BOTS` array + `identifyAiBot` from `worker-wrapper.ts:17-35,191-194` → `working/core/src/bots.ts`
- Strip all Dodo-specific imports/branding from extracted files

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `grep -ri "dodo\|payments" working/core/src/` | Search for Dodo branding leakage | Zero matches |
| `grep -ri "PRODUCT_SIBLINGS\|SECTION_NAMES" working/core/src/` | Search for Dodo-specific constants | Zero matches |
| Manual diff vs source | Compare each extracted function to its source line-by-line | Only changes are: import path updates, removal of Dodo-specific branches |

#### A2. Port test suite to standalone package (Day 1-2, ~6 hours)

**Tasks:**
- Copy `tests/aeo/content-negotiation.test.ts` → `working/core/test/negotiation.test.ts`
- Adapt imports to point at `working/core/src/` instead of `src/utils/`
- Add property tests using `fast-check` for `parseAcceptHeader` (random Accept headers must not throw)
- Add snapshot tests for `listingToMarkdown`, `renderRelatedLinks`, `renderFAQSection` using current production output as baseline

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd working/core && bun test` | Run full test suite | All tests pass |
| `cd working/core && bun test --coverage` | Generate coverage report | Line coverage ≥95%, branch coverage ≥90% |
| `cd working/core && bun test test/negotiation.test.ts -- --rerun=100` (with `fast-check` configured for 100 random cases) | Property-based testing | No exceptions thrown across all random Accept headers |

#### A3. Make core API framework-agnostic (Day 2-3, ~8 hours)

**Tasks:**
- Refactor `markdownResponse` to accept options object (per §3.1)
- Make `estimateTokens` pluggable via `setTokenEstimator()`
- Generalize `AI_BOTS` from string array to typed entries with `vendor`, `purpose`, `docsUrl`
- Add `negotiateFormat(accept, available?)` second parameter
- Update tests to cover new options

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd working/core && bun run typecheck` | Type-check with strict TypeScript config | Exit 0, no type errors |
| `cd working/core && bun test` | Full suite after refactor | All tests pass |
| Manual API test in REPL | Call `markdownResponse("test", { cacheControl: "no-cache" })` | Response has `Cache-Control: no-cache` header |
| Manual API test in REPL | Call `setTokenEstimator(t => t.length); estimateTokens("hello")` | Returns 5 (character count instead of word count) |
| Manual API test in REPL | Call `registerFormat("json", [["application","json"]]); negotiateFormat("application/json", ["json"])` | Returns `"json"` (custom format registration + generic negotiation work) |

#### A4. Draft AEO Spec v0.1 (Day 3-4, ~10 hours)

**Tasks:**
- Author `working/spec/README.md` (overview, scope, terminology)
- Author `working/spec/content-negotiation.md` (Accept header semantics, Vary, 406 behavior)
- Author `working/spec/headers.md` (full header table with semantics)
- Author `working/spec/ai-bot-detection.md` (UA registry, vendor mapping)
- Author `working/spec/discovery.md` (Link header, llms.txt, sitemap)
- Author `working/spec/conformance.md` (test levels: Basic, Standard, Advanced)

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| Internal review by 3 engineers (use `gh pr comment` or doc review tool) | Each reviewer answers: "Could you implement this from scratch in a different language using only this spec?" | All 3 answer yes; collected blocking comments resolved |
| `cd working/spec && npx markdown-link-check@3.x **/*.md` (generic CLI; the existing `scripts/check-links.ts` in this repo is hardcoded to `src/` per `scripts/check-links.ts:659` and CANNOT target `working/spec/`) | Validate all internal cross-references in spec files | Zero broken links reported |
| Manual: implement spec in a 50-line Go script | Independent implementation as conformance check | Script passes the same scenarios as `working/core` test suite for content negotiation |

#### A5. Build conformance test runner CLI (Day 4-5, ~8 hours)

**Tasks:**
- Scaffold `working/cli/` package
- Implement `verify <url>` command that hits a URL and validates AEO spec compliance
- Outputs a scored report: which spec sections pass/fail
- Support `--json` flag for machine-readable output
- Support `--skip-negotiation` flag for sites that serve markdown only at `.md` URLs without runtime content negotiation (used by A6 dogfood example which has no edge layer). In this mode, negotiation-related checks are skipped and score is reported out of 80 instead of 100.
- Uses only `working/core` primitives — no framework deps

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd working/cli && node dist/cli.js verify https://dodopayments.com/blogs/<slug>` | Run conformance test against current production site (has edge layer) | Report shows: content-negotiation PASS, headers PASS, link-alternate PASS, llms.txt PASS — overall score ≥90/100 |
| `node dist/cli.js verify https://example.com` (a site that doesn't implement AEO) | Run against non-conforming site | Report shows score <30/100, lists specific failed checks |
| `node dist/cli.js verify --json https://...` | JSON output mode | Valid JSON parseable by `jq`, with `score`, `passed`, `failed` arrays |
| `node dist/cli.js verify --skip-negotiation http://localhost:3000/blog/post-1.md` | Static-only mode against a `.md` URL with no runtime negotiation | Score reported out of 80; report explicitly notes "negotiation checks skipped"; static-content checks (headers on `.md` response, body format, token header) all pass |

#### A6. Build private dogfood example (Day 5-6, ~6 hours)

**Tasks:**
- Create `working/examples/astro-blog-private/` — minimal Astro site with 5 posts
- Wire it to `working/core` directly (no published package needed)
- Manually write `.md.ts` endpoints for the 5 posts + 1 listing (no `@dualmark/astro` integration yet — that's Track B)
- Build statically and serve `dist/` via any static server (or Cloudflare Pages preview)
- **Edge layer is NOT included in A6.** The `.md` URLs are accessed directly. Transparent content negotiation (HTML URL → markdown twin via Accept header) is validated in Track B (B4 onward, when the example uses the Astro integration + edge adapter).

**Important runtime note:** Astro's static build (`bun run build`) emits `.md` files as plain text. A generic static server like `bunx serve` will not preserve the headers set by `markdownResponse()` (those headers are part of the `Response` object returned by the endpoint, not embedded in the file). To validate header behavior, A6 uses Astro's `preview` command which evaluates endpoint code and serves the actual `Response` object. File-content validation runs against `dist/` directly without a server.

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd working/examples/astro-blog-private && bun run build` | Build site | Exit 0; `find dist -name "*.md" \| wc -l` returns 6 (5 posts + 1 listing) |
| `head -1 dist/blog/post-1.md` | File-content check (no server needed) | First line starts with `# ` |
| `wc -w dist/blog/post-1.md` | File-content check | Word count > 0 |
| `cd working/examples/astro-blog-private && bun run preview &` then `curl -I http://localhost:4321/blog/post-1.md` | Header check via Astro preview server (preserves endpoint Response object) | `Content-Type: text/markdown; charset=utf-8`, `X-Markdown-Tokens` header present with integer value, `X-Robots-Tag: noindex`, `Vary: Accept` |
| `curl http://localhost:4321/blog/post-1.md` | Body fetch via preview server | Body byte-identical to `dist/blog/post-1.md` |
| `node working/cli/dist/cli.js verify --skip-negotiation http://localhost:4321/blog/post-1.md` | Run conformance test in static-only mode (target the `.md` URL directly; skips Accept-header negotiation checks because A6 has no edge layer to do transparent HTML→markdown switching) | Score ≥80/100 (negotiation-related checks excluded; static-content checks all pass: headers correct, body well-formed, token header present) |

**Note:** The CLI from A5 must support a `--skip-negotiation` flag for this scenario. Add this requirement to A5: _CLI must accept `--skip-negotiation` to validate sites that serve markdown only at `.md` URLs without runtime content negotiation. The CLI in this mode targets the `.md` URL directly (caller's responsibility to know the URL), checks all response headers and body content, and skips Accept-header tests against the HTML URL. Score is reported out of 80 instead of 100._

**End of Track A:** Working code in private repo, spec drafted, conformance CLI works, test suite passes, dogfood example validates spec — all without any public branding or domain commitments.

---

### Track B — Blocked work (requires §14 decisions resolved)

These tasks involve public branding, domain registration, npm publishing, or external announcements. **Do not start until the 5 decisions in §14 are answered.**

#### B1. Public infrastructure setup (Day 1 of Track B, ~3 hours)

**Blockers:** Decisions §14.3 (license), §14.4 (Dodo sponsorship arrangement)

**Decision context:** The project ships under the existing `dodopayments` GitHub organization at `github.com/dodopayments/dualmark`. **No new GitHub org is created.** This intentionally signals "by Dodo Payments" while keeping the project under existing org governance.

**Tasks:**
- Create public repo `github.com/dodopayments/dualmark` (initialize as monorepo, see §2.1)
- Reserve `@dualmark/*` npm scope under a Dodo Payments-controlled npm account
- Register `dualmark.dev` domain (~$15/year via Dodo's existing registrar)
- Register `dualmark.io` as a defensive backup (~$50/year)
- Add MIT LICENSE, README skeleton, CONTRIBUTING.md, CODE_OF_CONDUCT.md
- Configure GitHub Actions: test, typecheck, lint, Changesets-based release
- Set up branch protection on `main`: require PR reviews, passing CI

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `gh api repos/dodopayments/dualmark` | Verify repo exists under existing org | Returns 200 with repo metadata; visibility is `public` |
| `npm access list packages @dualmark` (after scope creation) | Verify scope owned by Dodo's npm account | Lists scope; no packages yet (scope reserved) |
| `dig dualmark.dev NS` | Verify DNS configured | Returns NS records |
| `curl -I https://dualmark.dev` | Verify domain responds | Returns 200 (placeholder page) or expected redirect |
| Manual: GitHub Actions tab on the new repo | Push a test commit to a feature branch | CI workflow runs all jobs and they pass |
| `gh api repos/dodopayments/dualmark/branches/main/protection` | Verify branch protection | Returns protection rules including `required_status_checks` and `required_pull_request_reviews` |

#### B2. Move Track A code to public repo (Day 2-3 of Track B, ~6 hours)

**Blockers:** B1 complete

**Tasks:**
- Copy `working/core/` → public repo `packages/core/`
- Copy `working/cli/` → public repo `packages/cli/`
- Copy `working/spec/` → public repo `spec/`
- Copy `working/examples/astro-blog-private/` → public repo `examples/astro-blog/` (rename, generalize)
- Set up monorepo: pnpm workspaces, Turborepo, Changesets

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `pnpm install` at repo root | Workspace install | Exit 0, `node_modules/.pnpm/` populated |
| `pnpm turbo run test` | Run all package tests via Turbo | All packages' tests pass; second run hits cache (>5x faster) |
| `pnpm changeset` | Create a changeset | Generates `.changeset/*.md` file |
| `pnpm changeset version --snapshot` | Dry-run version bump | All packages get version preview without errors |

#### B3. Publish `@dualmark/core` v0.0.1-alpha (Day 3 of Track B, ~2 hours)

**Blockers:** B2 complete

**Tasks:**
- Tag release via Changesets
- Publish to npm with `--tag alpha`
- Verify install works in a separate test directory

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `pnpm publish --tag alpha --filter @dualmark/core` | Publish to npm | Exit 0, package appears at `npmjs.com/package/@dualmark/core` |
| `mkdir /tmp/test-install && cd /tmp/test-install && npm init -y && npm install @dualmark/core@alpha` | Install in fresh project | Exit 0, `node_modules/@dualmark/core/` populated |
| `node -e "const { negotiateFormat } = require('@dualmark/core'); console.log(negotiateFormat('text/markdown'))"` | Verify ESM/CJS exports work | Prints `markdown` |
| `node -e "import('@dualmark/core').then(m => console.log(typeof m.markdownResponse))"` | Verify ESM exports | Prints `function` |

#### B4. Build `@dualmark/astro` integration (Day 4-5 of Track B, ~12 hours)

**Blockers:** B3 complete

**Important scope note:** B4 ships only the Astro build-time integration. It does not include transparent content negotiation (Accept-header → markdown twin from the HTML URL) — that is the Cloudflare adapter's job, scheduled for v0.2. B4's example site serves markdown only at `.md` URLs.

**Tasks:**
- Scaffold `packages/astro/` package
- Implement integration with `astro:config:setup` hook + `injectRoute()` (per §4.3)
- Support blog converter only (other converters in v0.2)
- Support `staticPages` config (covers the `index.md.ts` / `pricing.md.ts` style endpoints from §4.2)
- Support `parameterizedRoutes` config (covers category-style endpoints from §4.2)
- Create `examples/astro-blog/astro.config.mjs` using the integration

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd packages/astro && pnpm test` | Unit + integration tests | All pass; covers config validation, route injection (collection / staticPages / parameterizedRoutes), build output |
| `cd examples/astro-blog && pnpm build` | Build example with integration | Exit 0; `dist/` contains `.md` files matching `.html` pages without any hand-written `.md.ts` files in source |
| `find examples/astro-blog/src/pages -name "*.md.ts"` | Verify no hand-written endpoints | Empty (zero results) |
| `cd examples/astro-blog && pnpm preview &` then `node packages/cli/dist/cli.js verify --skip-negotiation http://localhost:4321/blog/post-1.md` | Conformance test on integration output (static-only mode against `.md` URL — transparent negotiation deferred to v0.2 Cloudflare adapter) | Score ≥80/100 |
| `curl -I http://localhost:4321/blog/post-1.md` | Header check via Astro preview server | `Content-Type: text/markdown; charset=utf-8`, `X-Markdown-Tokens` present, `X-Robots-Tag: noindex`, `Vary: Accept` |
| `curl -I http://localhost:4321/blog/post-1` | HTML response check (must advertise markdown twin even without edge layer, via the `<MarkdownAlternate />` component or middleware that the integration installs) | Response includes `Link: </blog/post-1.md>; rel="alternate"; type="text/markdown"` (set via Astro middleware that the integration adds, not edge layer) |
| Manual: clone fresh, follow README quickstart | New developer follows docs from scratch | <10 minutes to working setup; record screen for demo video |

**Note on Link header:** §4.2 already specifies that the integration provides a `<MarkdownAlternate />` component or equivalent middleware mechanism for non-Cloudflare deployments. The 6th QA scenario validates this. If the integration cannot inject the Link header without the Cloudflare adapter, that scenario must be deferred to v0.2 and removed from B4's acceptance criteria — but in that case, document the limitation in the README so users understand what they get with B4 alone vs. B4 + Cloudflare adapter.

#### B5. Docs site (Day 5-6 of Track B, ~10 hours)

**Blockers:** B1 complete (domain), B3 complete (something to document)

**Tasks:**
- Set up Mintlify in `apps/docs/`
- Write quickstart, core API reference, Astro integration guide, spec link
- Deploy to `dualmark.dev`

**QA scenario:**

| Tool/command | Steps | Expected result |
|---|---|---|
| `cd apps/docs && pnpm dev` | Local dev server | Loads at `localhost:3000`, no broken links |
| `pnpm run check-links` | Mintlify link check | Zero broken links |
| `curl -I https://dualmark.dev` | Production deploy | Status 200, valid SSL |
| Read-aloud test: ask a non-team developer to follow quickstart | New user follows docs from scratch | They reach a working `.md` endpoint in <10 min, no questions asked |

#### B6. Launch coordination (Day 7 of Track B, ~6 hours)

**Blockers:** B1-B5 complete

**Tasks:**
- Write launch blog post: "Introducing Dualmark: Open-Source AEO Infrastructure" (co-published on `dodopayments.com/blogs/` and `dualmark.dev/blog/`)
- Working tagline: *"Every page, dual-marked."* Alternates: *"Mark it once. Serve it twice."* / *"The dual-format web."*
- Cross-post HN ("Show HN: Dualmark — markdown twins for AI agents"), Reddit (r/SEO, r/webdev, r/programming), dev.to
- Record 90-second demo video showing AI agent fetching markdown via the Dualmark edge layer
- Soft-launch in Dodo internal Slack first (24 hours before public)
- Schedule social media announcements (Dodo Payments official + personal accounts of co-authors)

**QA scenario (only includes checks the team controls — external engagement metrics are tracked but not gating):**

| Tool/command | Steps | Expected result |
|---|---|---|
| Manual review by 3 engineers + 1 marketer | Each reviewer rates: clarity, technical accuracy, call-to-action effectiveness | Average score ≥4/5; all blocking comments resolved |
| Demo video review | Watch video, time critical moments | Total length ≤90s; "wow moment" (AI agent gets markdown) visible by 30s mark |
| `curl -I https://dualmark.dev` and `curl -I https://dodopayments.com/blogs/<launch-post-slug>` | Verify both blog post URLs are live and reachable from the public internet | Both return 200; SSL valid; canonical tags present |
| `npx markdown-link-check apps/docs/launch-blog.md` and same for `dodo-website/src/content/blog/<launch-post>.md` | Verify zero broken links in launch content | Zero broken links |
| Internal Slack post 24h before launch | Post to `#engineering`, `#marketing` | ≥5 internal +1s, no blocking objections |
| Plausible/GA dashboard 24h after launch | Verify analytics actually firing on launch URLs | Pageview count > 0 on both `dualmark.dev` and the blog post URL; referrer breakdown shows traffic from at least 2 expected sources (HN, Reddit, Twitter) |
| `gh api repos/dodopayments/dualmark/stargazers \| jq length` | GitHub stars 7 days post-launch | Count tracked but not gating (informational metric — see §1.4 success metrics) |
| HN/Reddit submission completed | Posts published at planned times via team accounts | Post URLs captured and recorded in `launch-tracking.md`. Engagement metrics (front-page time, upvotes, comments) tracked but NOT gating, since they are not within team control |

---

**End of Week 1 Combined (A+B):**
- Public repo with `@dualmark/core@0.0.1-alpha` and `@dualmark/astro@0.0.1-alpha` published
- AEO Spec v0.1 published at `dualmark.dev/spec`
- One working example deployed
- Conformance CLI usable
- Launch blog post live
- Internal soft-launch complete

If §14 decisions are delayed: Track A still completes in 5 days and produces a fully working private codebase + spec + CLI. Public launch then needs only 3-4 days once decisions resolve.

---

## 14. Decision Required

**To proceed, the following decisions are needed from leadership.** Track A (§13) can begin without these. Track B (§13) is blocked until each is answered.

**Decisions already locked (May 2026):**
- **Name:** Dualmark (verified available across npm bare name, `@dualmark` scope, `dualmark.dev`, `dualmark.io`; no OSS or commercial conflicts)
- **GitHub home:** `github.com/dodopayments/dualmark` (under existing Dodo Payments org — no new org required)
- **npm scope:** `@dualmark/*` (under Dodo Payments-controlled npm account)
- **Project framing:** "Built and battle-tested at Dodo Payments" — sponsor model, not vendor-locked

**Open decisions:**

| # | Decision | Owner | Default if no decision in 2 weeks | Required for |
|---|----------|-------|-----------------------------------|--------------|
| 14.1 | License: MIT / Apache-2.0 / dual | Legal | MIT | B1 (LICENSE file) |
| 14.2 | Dodo Payments sponsorship visibility (logo on docs, blog co-author, "by the team at Dodo Payments" in README) | Marketing + Brand | Yes, light-touch (Dodo logo on docs footer, README mentions Dodo, launch blog co-published on dodopayments.com/blog) | B5 (docs), B6 (launch) |
| 14.3 | Trademark check on "Dualmark" in software/AI classes | Legal | 1-week sprint with external IP counsel; proceed if no Class 9 or 42 conflicts found | B1 (before public push) |
| 14.4 | Dogfooding migration approval (§9 on prod) | Eng leadership | Dev environment only initially; prod after v0.2 stabilizes | §9 Phase 5 only |
| 14.5 | Resource allocation: 1.5 FTE-months/month for 6 months | Eng leadership | Approve at reduced 1 FTE-month/month if budget tight | v0.2 onwards (v0.1 fits in Track A scope) |

**Resolution timeline:**
- Week 0: Circulate this plan to all owners
- End of Week 0: Decisions due
- If unresolved by end of Week 1: defaults apply, Track B starts with defaults

**No longer needed (resolved by Dualmark + dodopayments-org choices):**
- ~~Governance model~~ — Resolved: Dodo project under `github.com/dodopayments`; revisit graduation to vendor-neutral foundation if star count exceeds 5,000 by v1.0
- ~~Naming finalization~~ — Resolved: Dualmark
- ~~GitHub org availability~~ — Resolved: using existing `dodopayments` org

---

## Appendix A: Concrete Code Mapping

For implementation reference, here's exactly which lines of this repo map to which package:

```
src/utils/content-negotiation.ts:1-97
  → @dualmark/core/src/negotiation.ts (verbatim, change import only)

src/utils/markdown-response.ts (full file ~900 lines)
  → Split:
    - Response wrapping + normalizeUnicode + cleanBody → @dualmark/core/src/markdown.ts
    - Token estimation → @dualmark/core/src/tokens.ts
    - listingToMarkdown + renderRelatedLinks + renderFAQSection → @dualmark/core/src/composition.ts
    - Each *ToMarkdown converter → @dualmark/converters/src/{name}.ts as factory
    - PRODUCT_SIBLINGS / SECTION_NAMES → REMOVED (becomes user config)

worker-wrapper.ts:17-35 (AI_BOTS array)
  → @dualmark/core/src/bots.ts (with metadata expansion)

worker-wrapper.ts:191-194 (identifyAiBot)
  → @dualmark/core/src/bots.ts as detectAIBot()

worker-wrapper.ts:1-397 (full file)
  → @dualmark/cloudflare/src/index.ts as createAEOWorker(config)
  - AI_REDIRECTS, EXTERNAL_REDIRECTS → user config
  - SKIP_PREFIXES, ASSET_EXTENSIONS → user config (with defaults)
  - WorkerEnv interface → generic with binding name from config

tests/aeo/content-negotiation.test.ts
  → packages/core/test/negotiation.test.ts (verbatim)

tests/aeo/markdown-endpoints.test.ts
  → tests/integration/astro-integration.test.ts (rewritten for new API)
```

## Appendix B: AEO Spec v1.0 Skeleton

Full spec to be drafted Day 4. Skeleton:

```markdown
# AEO Specification v1.0

## 1. Scope
Defines HTTP conventions for serving content to AI agents alongside HTML.

## 2. Terminology
- "AI Agent": automated client identifying as one of the registered UAs (§5)
- "Markdown Twin": markdown representation of an HTML page at <url>.md
- "Conformant Server": implements §3 + §4 + §5 + §6

## 3. Content Negotiation
3.1 Server MUST honor Accept: text/markdown
3.2 Server MUST honor Accept: text/html (default)
3.3 Server MUST set Vary: Accept on negotiated responses
3.4 Server SHOULD return 406 if no acceptable type

## 4. Required Response Headers
4.1 Content-Type: text/markdown; charset=utf-8
4.2 X-Markdown-Tokens: <integer>
4.3 X-Robots-Tag: noindex
4.4 Vary: Accept

## 5. AI Agent Registry
List of canonical UA patterns and vendor mappings...

## 6. Discovery
6.1 Link header on HTML responses: <url.md>; rel="alternate"; type="text/markdown"
6.2 llms.txt extensions
6.3 sitemap.xml MAY include .md URLs

## 7. Conformance
7.1 Test suite reference
7.2 Levels: Basic, Standard, Advanced

## 8. Security Considerations
- noindex prevents duplicate indexing
- No new attack surface beyond standard HTTP negotiation
```
