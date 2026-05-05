import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <h1 style={{ fontSize: "2.5rem", lineHeight: 1.1, marginBottom: "1rem" }}>
        Dualmark
      </h1>
      <p style={{ fontSize: "1.25rem", color: "var(--color-fd-muted-foreground)", marginBottom: "2rem" }}>
        Open-source AEO infrastructure. Every page, dual-marked.
      </p>
      <p>
        Built and battle-tested at <a href="https://dodopayments.com">Dodo Payments</a>.
        Dualmark gives every site a markdown twin for AI agents alongside its HTML for humans —
        same URL, picked by HTTP content negotiation.
      </p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link
          href="/docs"
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--color-fd-primary)",
            color: "var(--color-fd-primary-foreground)",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Read the docs →
        </Link>
        <a
          href="https://github.com/dodopayments/dualmark"
          style={{
            padding: "0.75rem 1.5rem",
            border: "1px solid var(--color-fd-border)",
            borderRadius: "0.5rem",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
