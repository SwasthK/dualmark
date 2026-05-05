import Link from "next/link";
import { Wordmark } from "./brand-mark";
import { Section } from "./section";

export function CTA() {
  return (
    <Section className="pt-12">
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/40 px-6 py-16 text-center md:px-12 md:py-20">
        <div className="absolute inset-0 bg-dots opacity-40" />
        <div className="absolute left-1/2 top-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,254,30,0.18),transparent_60%)]" />

        <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-[var(--color-fg)] md:text-5xl">
            Ship it{" "}
            <span className="bg-gradient-to-r from-[#e8ffa8] via-[#c6fe1e] to-[#9ee847] bg-clip-text text-transparent">
              in 30 seconds.
            </span>
          </h2>

          <p className="max-w-xl text-pretty text-base text-[var(--color-fg-muted)] md:text-lg">
            One install. One config. Every page gets a markdown twin and a
            conformance score. No content rewrite. No vendor lock-in.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/docs/quickstart"
              className="group inline-flex h-12 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-7 font-semibold text-[var(--color-accent-ink)] transition-all hover:bg-[var(--color-accent-strong)]"
            >
              Read the quickstart
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <Link
              href="https://github.com/dodopayments/dualmark"
              className="inline-flex h-12 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-7 font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)] hover:bg-[var(--color-bg-elev-2)]"
            >
              <GitHubIcon className="size-4" />
              Star on GitHub
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--color-fg-subtle)]">
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
              Apache 2.0
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
              Zero telemetry
            </span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--color-success)]" />
              Public spec
            </span>
          </div>
        </div>
      </div>

      <Footer />
    </Section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 flex flex-col gap-8 border-t border-[var(--color-border)] pt-12 text-sm text-[var(--color-fg-subtle)]">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-3 md:col-span-2">
          <Link href="/" className="inline-flex w-fit">
            <Wordmark size={20} />
          </Link>
          <p className="max-w-xs text-sm text-[var(--color-fg-muted)]">
            AEO infrastructure for marketing sites. Open source. Public spec.
          </p>
          <p className="text-xs text-[var(--color-fg-subtle)]">
            Built at{" "}
            <Link
              href="https://dodopayments.com"
              className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
            >
              Dodo Payments
            </Link>
            .
          </p>
        </div>
        <FooterColumn
          title="Product"
          links={[
            { href: "/docs/quickstart", label: "Quickstart" },
            { href: "/docs/integrations/astro", label: "Astro" },
            { href: "/docs/integrations/nextjs", label: "Next.js" },
            { href: "/docs/integrations/cloudflare-workers", label: "Cloudflare" },
            { href: "/play", label: "Playground" },
          ]}
        />
        <FooterColumn
          title="Resources"
          links={[
            { href: "/docs/spec/overview", label: "AEO Spec" },
            { href: "/docs/conformance/cli", label: "Conformance" },
            { href: "https://github.com/dodopayments/dualmark", label: "GitHub" },
            {
              href: "https://github.com/dodopayments/dualmark/blob/main/LICENSE",
              label: "Apache 2.0",
            },
          ]}
        />
      </div>
      <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-[var(--color-fg-subtle)] md:flex-row md:items-center">
        <span>© {new Date().getFullYear()} Dualmark contributors.</span>
        <span className="font-mono">
          Spec v1.0 · Apache 2.0 · pre-1.0 (APIs may change in patch releases)
        </span>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--color-fg)]">
        {title}
      </span>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-fg)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.77 1.07.77 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}
