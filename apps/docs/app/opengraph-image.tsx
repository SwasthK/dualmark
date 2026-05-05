import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const runtime = "edge";
export const alt = "ChatGPT cites your competitor — Dualmark fixes that.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return renderOgImage({
    eyebrow: "Open source · Apache 2.0",
    title: "ChatGPT cites your competitor.",
    description:
      "Not a content problem — an infrastructure problem. Give every page a markdown twin. Score it.",
    footer: "$ bunx @dualmark/cli verify",
  });
}
