import Link from "next/link";

interface Signal {
  label: string;
  detail: string;
  href: string;
  icon: "github" | "npm" | "score" | "license";
}

const SIGNALS: Signal[] = [
  {
    icon: "github",
    label: "Open source",
    detail: "github.com/dodopayments/dualmark",
    href: "https://github.com/dodopayments/dualmark",
  },
  {
    icon: "npm",
    label: "5 packages on npm",
    detail: "@dualmark/* · published with provenance",
    href: "https://www.npmjs.com/org/dualmark",
  },
  {
    icon: "score",
    label: "Dogfooded",
    detail: "This site scores 110/125 on its own spec",
    href: "https://dualmark.dev/play",
  },
  {
    icon: "license",
    label: "Apache 2.0",
    detail: "Patent grant included",
    href: "https://github.com/dodopayments/dualmark/blob/main/LICENSE",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/40">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-4">
        {SIGNALS.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center gap-4 bg-[var(--color-bg)] px-6 py-7 transition-colors hover:bg-[var(--color-bg-elev-1)]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-2)] text-[var(--color-fg-muted)] group-hover:border-[var(--color-accent)]/40 group-hover:text-[var(--color-accent)]">
              <SignalIcon kind={s.icon} className="size-5" />
            </span>
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[15px] font-medium text-[var(--color-fg)]">
                {s.label}
              </span>
              <span className="truncate font-mono text-xs text-[var(--color-fg-muted)]">
                {s.detail}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SignalIcon({
  kind,
  className,
}: {
  kind: Signal["icon"];
  className?: string;
}) {
  switch (kind) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a10.94 10.94 0 0 1 5.74 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.39-5.26 5.68.41.36.77 1.07.77 2.16 0 1.56-.01 2.81-.01 3.19 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
        </svg>
      );
    case "npm":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
          <path d="M2 4h20v16H2V4zm10 4h-2v8h-4V8H2v10h6v-2h2v2h12V8h-8v6h-2V8z" />
        </svg>
      );
    case "score":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 2 4 6v6c0 4.97 3.5 9.3 8 10 4.5-.7 8-5.03 8-10V6l-8-4z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "license":
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
        </svg>
      );
  }
}
