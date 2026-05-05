import { cleanBody, joinLines, normalizeUnicode, renderFAQSection, type FAQItem } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface PricingTier {
  name: string;
  price: string;
  billingPeriod?: string;
  description?: string;
  highlights?: string[];
  cta?: { label: string; href: string };
  recommended?: boolean;
}

export interface PricingConverterConfig extends BaseConverterConfig {
  basePath?: string;
}

export interface PricingEntryData {
  title: string;
  description?: string;
  tiers: PricingTier[];
  comparisonNotes?: string;
  faqs?: FAQItem[];
}

function renderTier(tier: PricingTier): string {
  const parts: string[] = [];
  const heading = tier.recommended ? `### ${tier.name} — recommended` : `### ${tier.name}`;
  parts.push(heading);
  const priceLine = tier.billingPeriod
    ? `**${tier.price}** / ${tier.billingPeriod}`
    : `**${tier.price}**`;
  parts.push(priceLine);
  if (tier.description) parts.push(tier.description);
  if (tier.highlights && tier.highlights.length > 0) {
    parts.push(tier.highlights.map((h) => `- ${h}`).join("\n"));
  }
  if (tier.cta) {
    parts.push(`[${tier.cta.label}](${tier.cta.href})`);
  }
  return parts.join("\n\n");
}

export function pricingConverter(
  config: PricingConverterConfig,
): Converter<CollectionEntry<PricingEntryData>> {
  const basePath = config.basePath ?? "/pricing";
  return (entry) => {
    const d = entry.data;
    const tierBlocks = d.tiers.map(renderTier).join("\n\n---\n\n");

    const md = joinLines(
      `# ${d.title}`,
      d.description && `\n> ${d.description}`,
      "",
      `- **URL**: ${config.siteUrl}${basePath}/${entry.id}`,
      "\n## Plans\n",
      tierBlocks,
      d.comparisonNotes && `\n## Notes\n\n${d.comparisonNotes}`,
      d.faqs && d.faqs.length > 0 && `\n${renderFAQSection(d.faqs)}`,
      entry.body && "\n---\n",
      entry.body && cleanBody(entry.body),
      config.brandFooter && "\n---",
      config.brandFooter && `\n${config.brandFooter}`,
    );
    return normalizeUnicode(md);
  };
}
