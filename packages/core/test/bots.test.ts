import { describe, it, expect } from "vitest";
import { detectAIBot, AI_BOTS } from "../src/bots.js";

describe("detectAIBot", () => {
  it("returns isBot=false for empty UA", () => {
    expect(detectAIBot("")).toEqual({ isBot: false, name: null, vendor: null, purpose: null });
  });

  it("returns isBot=false for typical browser UA", () => {
    const chrome =
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
    expect(detectAIBot(chrome).isBot).toBe(false);
  });

  it("detects GPTBot", () => {
    const r = detectAIBot("Mozilla/5.0 GPTBot/1.0");
    expect(r).toMatchObject({ isBot: true, name: "GPTBot", vendor: "OpenAI", purpose: "training" });
  });

  it("detects ClaudeBot", () => {
    const r = detectAIBot("ClaudeBot/1.0 (+http://anthropic.com)");
    expect(r).toMatchObject({ isBot: true, name: "ClaudeBot", vendor: "Anthropic" });
  });

  it("detects PerplexityBot", () => {
    expect(detectAIBot("PerplexityBot/1.0").vendor).toBe("Perplexity");
  });

  it("detects Google-Extended", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Google-Extended/1.0)").name).toBe("Google-Extended");
  });

  it("is case-insensitive on UA matching strings", () => {
    expect(detectAIBot("gptbot/1.0").isBot).toBe(true);
  });

  it("returns first matching bot when UA contains multiple substrings", () => {
    const r = detectAIBot("ChatGPT-User and GPTBot");
    expect(["ChatGPT-User", "GPTBot"]).toContain(r.name);
  });

  it("includes Meta-ExternalAgent (case-insensitive)", () => {
    expect(detectAIBot("meta-externalagent/1.0").vendor).toBe("Meta");
  });

  it("detects DeepSeekBot", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; DeepSeekBot/1.0; +https://www.deepseek.com/bot)");
    expect(r).toMatchObject({ isBot: true, name: "DeepSeekBot", vendor: "DeepSeek", purpose: "training" });
  });

  it("detects Claude-SearchBot", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; Claude-SearchBot/1.0; searchbot@anthropic.com)");
    expect(r).toMatchObject({ isBot: true, name: "Claude-SearchBot", vendor: "Anthropic" });
  });

  it("detects Claude-User", () => {
    const r = detectAIBot("Mozilla/5.0 (compatible; Claude-User/1.0)");
    expect(r).toMatchObject({ isBot: true, name: "Claude-User", vendor: "Anthropic" });
  });

  it("detects Meta-ExternalFetcher", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Meta-ExternalFetcher/1.0)").name).toBe("Meta-ExternalFetcher");
  });

  it("detects Perplexity-User", () => {
    expect(detectAIBot("Mozilla/5.0 (compatible; Perplexity-User/1.0)").name).toBe("Perplexity-User");
  });

  it("AI_BOTS export has unique names", () => {
    const names = AI_BOTS.map((b) => b.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("every bot entry has required fields", () => {
    for (const b of AI_BOTS) {
      expect(b.name).toBeTruthy();
      expect(b.vendor).toBeTruthy();
      expect(b.uaPattern).toBeTruthy();
      expect(["training", "search", "user-action", "unknown"]).toContain(b.purpose);
    }
  });
});
