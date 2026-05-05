import { joinLines, fmtDate, cleanBody, normalizeUnicode } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface CaseStudyConverterConfig extends BaseConverterConfig {
  basePath?: string;
}

export interface CaseStudyEntryData {
  title: string;
  description?: string;
  company: string;
  industry?: string;
  publishedDate: Date;
  stats?: Array<{ value: string; label: string }>;
  quote?: { text: string; attribution?: string };
}

export function caseStudyConverter(
  config: CaseStudyConverterConfig,
): Converter<CollectionEntry<CaseStudyEntryData>> {
  const basePath = config.basePath ?? "/case-studies";
  return (entry) => {
    const d = entry.data;
    const statsBlock =
      d.stats && d.stats.length > 0
        ? "\n## Key Metrics\n\n" + d.stats.map((s) => `- **${s.value}** -- ${s.label}`).join("\n")
        : "";

    const quoteBlock =
      d.quote && d.quote.text
        ? `\n## Quote\n\n> ${d.quote.text}` +
          (d.quote.attribution ? `\n>\n> -- ${d.quote.attribution}` : "")
        : "";

    const md = joinLines(
      `# ${d.title}`,
      d.description && `\n> ${d.description}`,
      "",
      `- **Company**: ${d.company}`,
      d.industry && `- **Industry**: ${d.industry}`,
      `- **Published**: ${fmtDate(d.publishedDate)}`,
      `- **URL**: ${config.siteUrl}${basePath}/${entry.id}`,
      statsBlock,
      quoteBlock,
      "\n---",
      entry.body && `\n${cleanBody(entry.body)}`,
      config.brandFooter && "\n---",
      config.brandFooter && `\n${config.brandFooter}`,
    );
    return normalizeUnicode(md);
  };
}
