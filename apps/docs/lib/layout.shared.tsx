import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <span style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>Dualmark</span>
      ),
    },
    githubUrl: "https://github.com/dodopayments/dualmark",
    links: [
      { text: "Quickstart", url: "/docs/quickstart", active: "nested-url" },
      { text: "Spec", url: "/docs/spec/overview", active: "nested-url" },
    ],
  };
}
