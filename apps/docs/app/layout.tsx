import "fumadocs-ui/css/neutral.css";
import "fumadocs-ui/css/preset.css";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";

export const metadata = {
  title: "Dualmark — open-source AEO infrastructure",
  description: "Open-source AEO (Answer Engine Optimization) infrastructure. Every page, dual-marked.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
