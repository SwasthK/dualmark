import { Section, SectionHeader } from "./section";

const features = [
  {
    title: "30-second install",
    detail:
      "One npm package. Three lines of config. Markdown twins generated for every page.",
    icon: BoltIcon,
    code: "$ bun add @dualmark/astro",
  },
  {
    title: "Type-safe everything",
    detail:
      "Full TypeScript inference across collections, converters, and config. No types? No ship.",
    icon: TypesIcon,
    code: "converter: \"blog\" | \"glossary\" | …",
  },
  {
    title: "Zero runtime deps in core",
    detail:
      "@dualmark/core is dependency-free. Edge-compatible. 14 KB ESM. No bloat.",
    icon: ZapIcon,
    code: "✓ @dualmark/core      14 KB",
  },
  {
    title: "One command verification",
    detail:
      "Run `dualmark verify` in CI. Get a 0–125 conformance score with line-item failures.",
    icon: ShieldIcon,
    code: "$ dualmark verify https://you.dev",
  },
  {
    title: "Public, versioned spec",
    detail:
      "RFC-2119 compliant AEO Spec v1.0. Implement it in any language. Your code follows the spec, not us.",
    icon: SpecIcon,
    code: "/spec/v1.0/conformance.md",
  },
  {
    title: "Hooks for everything",
    detail:
      "onAIRequest, onMarkdownRender, custom converters. Drop in your own analytics, tokens, or transforms.",
    icon: HookIcon,
    code: "onAIRequest: ({ bot, page }) => …",
  },
];

export function DX() {
  return (
    <Section id="dx">
      <SectionHeader
        eyebrow="Developer experience"
        title={
          <>
            Built for engineers who{" "}
            <span className="text-[var(--color-accent)]">ship.</span>
          </>
        }
        description="Every API is type-safe, edge-compatible, and obvious. We optimized for the time between `bun add` and `git push`."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/50 p-6 transition-all hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elev-1)]"
          >
            <div className="absolute -right-12 -top-12 size-32 rounded-full bg-[var(--color-accent)]/0 blur-3xl transition-all duration-500 group-hover:bg-[var(--color-accent)]/10" />

            <div className="relative">
              <div className="flex size-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] text-[var(--color-accent)]">
                <f.icon />
              </div>
            </div>

            <div className="relative flex flex-col gap-1.5">
              <h3 className="text-base font-semibold text-[var(--color-fg)]">
                {f.title}
              </h3>
              <p className="text-sm text-[var(--color-fg-muted)]">{f.detail}</p>
            </div>

            <div className="relative mt-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg)]/60 px-3 py-2 font-mono text-xs text-[var(--color-fg-muted)]">
              {f.code}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M13 3 4 14h7l-1 7 9-11h-7l1-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TypesIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M5 7h6m-3 0v10m6-7h4m-2 0v7m2 0h-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ZapIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9 12h6m-3-3v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SpecIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <rect
        x="5"
        y="3"
        width="14"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8h6M9 12h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
function HookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M9 5h6a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4h-3v6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="19" r="2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
