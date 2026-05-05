import Link from "next/link";
import { Section } from "./section";

const CONVERTERS = [
  "blog",
  "case-study",
  "changelog",
  "compare",
  "docs",
  "feature",
  "glossary",
  "legal",
  "pricing",
  "pseo",
  "tool",
  "video",
];

export function Converters() {
  return (
    <Section id="converters" className="py-16 md:py-20">
      <div className="mx-auto max-w-4xl rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/40 px-6 py-10 md:px-10 md:py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
            @dualmark/converters
          </span>

          <h2 className="text-balance text-2xl font-semibold tracking-tight text-[var(--color-fg)] md:text-3xl">
            Drop-in converters for{" "}
            <span className="text-[var(--color-accent)]">12 page types</span>{" "}
            every marketing site has.
          </h2>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            {CONVERTERS.map((name) => (
              <span
                key={name}
                className="rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-2.5 py-1 font-mono text-xs text-[var(--color-fg-muted)]"
              >
                {name}
              </span>
            ))}
          </div>

          <p className="mt-2 text-pretty text-sm text-[var(--color-fg-muted)] md:text-base">
            Each takes your collection entry and returns AI-friendly markdown
            with the right shape (frontmatter, FAQ extraction, related links).
            Or write your own — converters are just functions.
          </p>

          <Link
            href="/docs/packages/converters"
            className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-fg)] underline-offset-4 hover:text-[var(--color-accent)] hover:underline"
          >
            See all 12 converters
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </Section>
  );
}
