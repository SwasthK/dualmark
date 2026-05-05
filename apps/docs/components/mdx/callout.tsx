import type { ReactNode } from "react";

type CalloutType = "info" | "tip" | "warn" | "warning" | "danger" | "success";

const VARIANTS: Record<
  CalloutType,
  { border: string; bg: string; icon: ReactNode; label: string; iconColor: string }
> = {
  info: {
    border: "var(--color-info)",
    bg: "oklch(0.72 0.15 240 / 0.08)",
    iconColor: "var(--color-info)",
    label: "Info",
    icon: <InfoIcon />,
  },
  tip: {
    border: "var(--color-accent)",
    bg: "var(--color-accent-soft)",
    iconColor: "var(--color-accent)",
    label: "Tip",
    icon: <BulbIcon />,
  },
  warn: {
    border: "var(--color-warning)",
    bg: "oklch(0.82 0.16 85 / 0.08)",
    iconColor: "var(--color-warning)",
    label: "Warning",
    icon: <AlertTriangleIcon />,
  },
  warning: {
    border: "var(--color-warning)",
    bg: "oklch(0.82 0.16 85 / 0.08)",
    iconColor: "var(--color-warning)",
    label: "Warning",
    icon: <AlertTriangleIcon />,
  },
  danger: {
    border: "var(--color-danger)",
    bg: "oklch(0.68 0.22 27 / 0.08)",
    iconColor: "var(--color-danger)",
    label: "Danger",
    icon: <AlertCircleIcon />,
  },
  success: {
    border: "var(--color-success)",
    bg: "oklch(0.78 0.18 150 / 0.08)",
    iconColor: "var(--color-success)",
    label: "Success",
    icon: <CheckCircleIcon />,
  },
};

interface CalloutProps {
  type?: CalloutType | string;
  title?: string;
  children?: ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const variant = VARIANTS[type as CalloutType] ?? VARIANTS.info;
  return (
    <aside
      className="my-5 flex gap-3 rounded-lg border-l-2 px-4 py-3"
      style={{
        borderLeftColor: variant.border,
        background: variant.bg,
      }}
    >
      <span
        className="mt-0.5 inline-flex shrink-0 items-center justify-center"
        style={{ color: variant.iconColor }}
      >
        {variant.icon}
      </span>
      <div className="flex-1 min-w-0 [&>:first-child]:mt-0 [&>:last-child]:mb-0">
        {title && (
          <div className="mb-1 font-semibold text-[var(--color-fg)]">
            {title}
          </div>
        )}
        <div className="text-sm text-[var(--color-fg-muted)] [&_p]:my-0 [&_code]:bg-[var(--color-bg-elev-2)]">
          {children}
        </div>
      </div>
    </aside>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 11v5m0-8.5h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M9 18h6m-5 3h4m-7-9a5 5 0 1 1 10 0c0 2-1 3-2 4v2H9v-2c-1-1-2-2-2-4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function AlertTriangleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <path
        d="M12 4 3 20h18L12 4Zm0 6v4m0 3h.01"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AlertCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 8v5m0 3h.01"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12 2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
