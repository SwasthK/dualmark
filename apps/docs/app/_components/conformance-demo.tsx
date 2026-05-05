import { Section, SectionHeader } from "./section";

const checks = [
  { score: 20, name: "md.fetch", desc: "Markdown twin URL is reachable" },
  { score: 10, name: "md.contentType", desc: "Content-Type is text/markdown; charset=utf-8" },
  { score: 10, name: "md.tokensHeader", desc: "X-Markdown-Tokens header is present" },
  { score: 10, name: "md.noindex", desc: "X-Robots-Tag includes noindex" },
  { score: 10, name: "md.vary", desc: "Vary header includes Accept" },
  { score: 10, name: "md.body", desc: "Body is non-empty markdown" },
  { score: 10, name: "html.linkAlternate", desc: "HTML response advertises markdown twin" },
  { score: 10, name: "negotiation.botUa", desc: "GPTBot UA receives text/markdown" },
  { score: 10, name: "negotiation.acceptHeader", desc: "Accept: text/markdown receives text/markdown" },
];

export function ConformanceDemo() {
  return (
    <Section id="verify">
      <SectionHeader
        eyebrow="Verify"
        title={
          <>
            Score every page against{" "}
            <span className="text-[var(--color-accent)]">a public spec.</span>
          </>
        }
        description="Run one command. Get a 0–125 conformance score with line-item failures. Drop it in CI to fail the build when a page regresses. No black-box AI tooling."
      />

      <div className="mx-auto max-w-4xl overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-elev-2)] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-[oklch(0.65_0.22_27)]/70" />
            <span className="size-3 rounded-full bg-[oklch(0.78_0.16_85)]/70" />
            <span className="size-3 rounded-full bg-[oklch(0.72_0.19_145)]/70" />
          </div>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
            zsh — dualmark verify
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)] opacity-60">
            107ms
          </span>
        </div>

        <div className="space-y-3 px-6 py-6 font-mono text-sm">
          <div>
            <span className="text-[var(--color-fg-subtle)]">$ </span>
            <span className="text-[var(--color-accent)]">bunx @dualmark/cli</span> verify{" "}
            <span className="text-[var(--color-fg)]">
              https://yourcompany.com/pricing
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1 pt-3 sm:grid-cols-[140px_1fr]">
            <span className="text-[var(--color-fg-subtle)]">URL</span>
            <span className="text-[var(--color-fg)]">https://yourcompany.com/pricing</span>
            <span className="text-[var(--color-fg-subtle)]">Markdown</span>
            <span className="text-[var(--color-fg)]">https://yourcompany.com/pricing.md</span>
            <span className="text-[var(--color-fg-subtle)]">Score</span>
            <span className="font-medium text-[var(--color-success)]">125 / 125</span>
            <span className="text-[var(--color-fg-subtle)]">Conformance</span>
            <span className="font-medium text-[var(--color-success)]">Advanced ✓</span>
          </div>

          <div className="pt-4 text-[var(--color-fg-subtle)]">Passed:</div>

          <div className="space-y-1">
            {checks.map((c) => (
              <div key={c.name} className="flex items-start gap-3">
                <span className="inline-flex w-12 shrink-0 justify-end rounded bg-[var(--color-success)]/15 px-1.5 py-0.5 text-xs font-medium text-[var(--color-success)]">
                  +{c.score}
                </span>
                <span className="w-44 shrink-0 text-[var(--color-fg)]">{c.name}</span>
                <span className="text-[var(--color-fg-muted)]">— {c.desc}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1 pt-2">
            <span className="text-[var(--color-fg-subtle)]">$</span>
            <span className="ml-1 inline-block h-4 w-2 animate-[var(--animate-cursor)] bg-[var(--color-fg)]" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-cols-3 gap-3">
        {[
          { label: "Basic", threshold: "60%", color: "var(--color-warning)" },
          { label: "Standard", threshold: "80%", color: "var(--color-info)" },
          { label: "Advanced", threshold: "95%", color: "var(--color-success)" },
        ].map((tier) => (
          <div
            key={tier.label}
            className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-4 py-3"
          >
            <div>
              <div className="text-sm font-medium text-[var(--color-fg)]">{tier.label}</div>
              <div className="text-xs text-[var(--color-fg-subtle)]">conformance</div>
            </div>
            <span
              className="font-mono text-lg font-medium"
              style={{ color: tier.color }}
            >
              {tier.threshold}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}
