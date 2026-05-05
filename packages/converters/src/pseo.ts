import { cleanBody, joinLines, normalizeUnicode, slugToTitle } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface PseoFact {
  label: string;
  value: string;
}

export interface PseoRelatedGroup {
  title: string;
  basePath: string;
  slugs: string[];
  titleTransform?: "slug-to-title" | "uppercase" | ((slug: string) => string);
}

export interface PseoConverterConfig extends BaseConverterConfig {
  basePath: string;
}

export interface PseoEntryData {
  title: string;
  description?: string;
  facts?: PseoFact[];
  related?: PseoRelatedGroup[];
}

function applyTitleTransform(
  slug: string,
  transform: PseoRelatedGroup["titleTransform"],
): string {
  if (!transform || transform === "slug-to-title") return slugToTitle(slug);
  if (transform === "uppercase") return slug.toUpperCase();
  return transform(slug);
}

export function pseoConverter(
  config: PseoConverterConfig,
): Converter<CollectionEntry<PseoEntryData>> {
  const { basePath, siteUrl } = config;
  return (entry) => {
    const d = entry.data;
    const factLines = (d.facts ?? []).map((f) => `- **${f.label}**: ${f.value}`);

    const head = joinLines(
      `# ${d.title}`,
      d.description && `\n> ${d.description}`,
      "",
      ...factLines,
      `- **URL**: ${siteUrl}${basePath}/${entry.id}`,
      "\n---",
      entry.body && `\n${cleanBody(entry.body)}`,
    );

    const relatedSections: string[] = [];
    for (const group of d.related ?? []) {
      if (group.slugs.length === 0) continue;
      const items = group.slugs.map((slug) => {
        const title = applyTitleTransform(slug, group.titleTransform);
        return `- [${title}](${siteUrl}${group.basePath}/${slug})`;
      });
      relatedSections.push(`\n## ${group.title}\n\n${items.join("\n")}`);
    }

    const footer = config.brandFooter ? `\n---\n${config.brandFooter}` : "";
    return normalizeUnicode(head + relatedSections.join("") + footer);
  };
}
