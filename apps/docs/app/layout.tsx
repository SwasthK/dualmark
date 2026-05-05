import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider";
import {
  Darker_Grotesque,
  Geist,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import type { ReactNode } from "react";
import { UnifiedNav } from "./_components/unified-nav";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const darkerGrotesque = Darker_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-darker-grotesque",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  title: "Dualmark — AEO infrastructure for marketing sites",
  description:
    "Open-source AEO (Answer Engine Optimization) infrastructure. Every page, dual-marked. Same URL, two formats — picked by HTTP content negotiation. Drop into Astro, Cloudflare, or Next.js in 30 seconds.",
  metadataBase: new URL("https://dualmark.dev"),
  openGraph: {
    title: "Dualmark — AEO infrastructure for marketing sites",
    description:
      "Your blog ranks #1 on Google. ChatGPT cites your competitor. That's an infrastructure problem. Dualmark fixes it.",
    url: "https://dualmark.dev",
    siteName: "Dualmark",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dualmark — AEO infrastructure for marketing sites",
    description:
      "Open-source AEO infrastructure. Every page, dual-marked. Drop into Astro, Cloudflare, or Next.js in 30 seconds.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${inter.variable} ${darkerGrotesque.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)] antialiased">
        <RootProvider theme={{ forcedTheme: "dark", defaultTheme: "dark" }}>
          <UnifiedNav />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
