"use client";

import { useState } from "react";

const COMMAND = "bun add @dualmark/astro";

export function InstallCommandClient() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // ignore clipboard write failures (e.g. insecure context)
    }
  }

  const [bin, verb, ...rest] = COMMAND.split(" ");

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elev-1)] font-mono text-sm">
      <div className="flex h-11 items-center gap-2 px-3 text-[var(--color-fg-muted)]">
        <span className="text-[var(--color-fg-subtle)]">$</span>
        <span className="truncate">
          <span className="text-[var(--color-accent)]">{bin}</span>{" "}
          <span className="text-[var(--color-fg-muted)]">{verb}</span>{" "}
          <span className="text-[var(--color-fg)]">{rest.join(" ")}</span>
        </span>
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy install command"
        className="flex items-center gap-1.5 border-l border-[var(--color-border)] bg-[var(--color-bg-elev-2)] px-3 text-xs uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors hover:text-[var(--color-accent)]"
      >
        {copied ? (
          <>
            <CheckIcon className="size-3.5" />
            <span>Copied</span>
          </>
        ) : (
          <>
            <CopyIcon className="size-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 9V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4M5 9h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m4.5 12.5 5 5 10-11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
