import { cleanBody, joinLines, normalizeUnicode } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export interface DocsConverterConfig extends BaseConverterConfig {
  basePath?: string;
}

export interface DocsEntryData {
  title: string;
  description?: string;
  section?: string;
  order?: number;
  updatedDate?: Date;
}

export function docsConverter(
  config: DocsConverterConfig,
): Converter<CollectionEntry<DocsEntryData>> {
  const basePath = config.basePath ?? "/docs";
  return (entry) => {
    const d = entry.data;
    const md = joinLines(
      `# ${d.title}`,
      d.description && `\n> ${d.description}`,
      "",
      d.section && `- **Section**: ${d.section}`,
      `- **URL**: ${config.siteUrl}${basePath}/${entry.id}`,
      d.updatedDate && `- **Updated**: ${d.updatedDate.toISOString().slice(0, 10)}`,
      "\n---",
      entry.body && `\n${cleanBody(entry.body)}`,
      config.brandFooter && "\n---",
      config.brandFooter && `\n${config.brandFooter}`,
    );
    return normalizeUnicode(md);
  };
}
