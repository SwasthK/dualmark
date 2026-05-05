import { cleanBody, fmtDate, joinLines, normalizeUnicode } from "@dualmark/core";
import type { BaseConverterConfig, CollectionEntry, Converter } from "./types.js";

export type ChangelogChangeType = "added" | "changed" | "deprecated" | "removed" | "fixed" | "security";

export interface ChangelogChange {
  type: ChangelogChangeType;
  description: string;
}

export interface ChangelogConverterConfig extends BaseConverterConfig {
  basePath?: string;
}

export interface ChangelogEntryData {
  version: string;
  title?: string;
  releasedDate: Date;
  summary?: string;
  changes?: ChangelogChange[];
}

const ORDER: ChangelogChangeType[] = ["added", "changed", "deprecated", "removed", "fixed", "security"];
const HEADING: Record<ChangelogChangeType, string> = {
  added: "Added",
  changed: "Changed",
  deprecated: "Deprecated",
  removed: "Removed",
  fixed: "Fixed",
  security: "Security",
};

export function changelogConverter(
  config: ChangelogConverterConfig,
): Converter<CollectionEntry<ChangelogEntryData>> {
  const basePath = config.basePath ?? "/changelog";
  return (entry) => {
    const d = entry.data;
    const grouped = new Map<ChangelogChangeType, string[]>();
    for (const ch of d.changes ?? []) {
      const list = grouped.get(ch.type) ?? [];
      list.push(`- ${ch.description}`);
      grouped.set(ch.type, list);
    }

    const sections: string[] = [];
    for (const t of ORDER) {
      const items = grouped.get(t);
      if (items && items.length > 0) {
        sections.push(`\n## ${HEADING[t]}\n\n${items.join("\n")}`);
      }
    }

    const md = joinLines(
      `# ${d.title ?? d.version}`,
      d.summary && `\n> ${d.summary}`,
      "",
      `- **Version**: ${d.version}`,
      `- **Released**: ${fmtDate(d.releasedDate)}`,
      `- **URL**: ${config.siteUrl}${basePath}/${entry.id}`,
      sections.join(""),
      "\n---",
      entry.body && `\n${cleanBody(entry.body)}`,
      config.brandFooter && "\n---",
      config.brandFooter && `\n${config.brandFooter}`,
    );
    return normalizeUnicode(md);
  };
}
