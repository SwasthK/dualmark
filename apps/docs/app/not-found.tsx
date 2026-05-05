import Link from "next/link";
import { BrandMark } from "./_components/brand-mark";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0 -z-10 bg-grid mask-radial-fade opacity-40" />
      <div className="absolute left-1/2 top-1/2 -z-10 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,254,30,0.18),transparent_60%)]" />

      <div className="flex flex-col items-center gap-6 text-center">
        <BrandMark size={48} className="opacity-80" />
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-accent)]">
          404 · Page not found
        </div>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-[var(--color-fg)] md:text-5xl">
          That page is missing its{" "}
          <span className="bg-gradient-to-r from-[#e8ffa8] via-[#c6fe1e] to-[#9ee847] bg-clip-text text-transparent">
            markdown twin.
          </span>
        </h1>
        <p className="max-w-md text-pretty text-[var(--color-fg-muted)]">
          The URL you tried doesn&apos;t exist. Maybe the link was renamed, or
          you&apos;re looking for something else.
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-5 text-sm font-semibold text-[var(--color-accent-ink)] transition-all hover:bg-[var(--color-accent-strong)]"
          >
            ← Home
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)]"
          >
            Read the docs
          </Link>
          <Link
            href="/play"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] px-5 text-sm font-medium text-[var(--color-fg)] transition-colors hover:border-[var(--color-border-strong)]"
          >
            Score your site
          </Link>
        </div>
      </div>
    </main>
  );
}
