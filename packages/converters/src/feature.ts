import { cleanBody, normalizeUnicode, renderFAQSection, type FAQItem } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface FeatureSection {
  title: string;
  content: string;
}

export interface FeatureRelatedLink {
  title: string;
  href: string;
}

export interface FeatureConverterConfig extends BaseConverterConfig {
  basePath: string;
  category?: string;
  siblings?: Array<{ slug: string; title: string }>;
}

export interface FeatureEntryData {
  title: string;
  description?: string;
  problem?: FeatureSection[];
  solution?: FeatureSection[];
  sections?: FeatureSection[];
  audience?: string[];
  useCases?: string[];
  docsUrl?: string;
  faqs?: FAQItem[];
  related?: FeatureRelatedLink[];
}

function renderSections(heading: string, items?: FeatureSection[]): string {
  if (!items || items.length === 0) return "";
  const blocks = items.map((s) => `### ${s.title}\n\n${s.content}`);
  return `\n## ${heading}\n\n${blocks.join("\n\n")}`;
}

export function featureConverter(
  config: FeatureConverterConfig,
): Converter<CollectionEntry<FeatureEntryData>> {
  const { basePath, siteUrl, category, siblings } = config;
  return (entry) => {
    const d = entry.data;
    const parts: string[] = [`# ${d.title}`];
    if (d.description) parts.push(`\n> ${d.description}`);

    parts.push(`\n- **URL**: ${siteUrl}${basePath}/${entry.id}`);
    if (category) parts.push(`- **Category**: ${category}`);
    if (d.docsUrl) parts.push(`- **Documentation**: ${d.docsUrl}`);
    if (d.audience && d.audience.length > 0) {
      parts.push(`- **For**: ${d.audience.join(", ")}`);
    }

    const problemBlock = renderSections("The problem", d.problem);
    if (problemBlock) parts.push(problemBlock);

    const solutionBlock = renderSections("The solution", d.solution);
    if (solutionBlock) parts.push(solutionBlock);

    const customBlock = renderSections("Details", d.sections);
    if (customBlock) parts.push(customBlock);

    if (d.useCases && d.useCases.length > 0) {
      parts.push(`\n## Use cases\n\n${d.useCases.map((u) => `- ${u}`).join("\n")}`);
    }

    if (entry.body) {
      parts.push(`\n---\n\n${cleanBody(entry.body)}`);
    }

    if (d.faqs && d.faqs.length > 0) {
      parts.push(`\n${renderFAQSection(d.faqs)}`);
    }

    const relatedLinks: FeatureRelatedLink[] = [];
    if (d.related) relatedLinks.push(...d.related);
    if (siblings) {
      for (const s of siblings) {
        if (s.slug === entry.id) continue;
        relatedLinks.push({ title: s.title, href: `${siteUrl}${basePath}/${s.slug}` });
      }
    }
    if (relatedLinks.length > 0) {
      parts.push("\n## Related");
      parts.push(relatedLinks.map((l) => `- [${l.title}](${l.href})`).join("\n"));
    }

    if (config.brandFooter) {
      parts.push(`\n---\n${config.brandFooter}`);
    }

    return normalizeUnicode(parts.join("\n"));
  };
}
