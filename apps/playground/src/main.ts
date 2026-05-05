import { detectAIBot, negotiateFormat, parseAcceptHeader } from "@dualmark/core";

const presets: Record<string, { accept: string; ua: string }> = {
  browser: {
    accept: "text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
    ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  },
  gptbot: {
    accept: "*/*",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot",
  },
  claudebot: {
    accept: "*/*",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com",
  },
  perplexity: {
    accept: "*/*",
    ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot",
  },
  "md-only": {
    accept: "text/markdown",
    ua: "curl/8.0",
  },
  "json-only": {
    accept: "application/json",
    ua: "curl/8.0",
  },
};

const acceptEl = document.getElementById("accept") as HTMLTextAreaElement;
const uaEl = document.getElementById("ua") as HTMLTextAreaElement;
const resultEl = document.getElementById("result") as HTMLElement;

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] as string));
}

function render() {
  const accept = acceptEl.value.trim();
  const ua = uaEl.value.trim();
  const bot = detectAIBot(ua);
  const fmt = negotiateFormat(accept);
  const parsed = parseAcceptHeader(accept);

  let serveAs: "markdown" | "html" | "notacceptable";
  let reason: string;

  if (bot.isBot) {
    serveAs = "markdown";
    reason = `Bot UA detected (${bot.name ?? "unknown"} / ${bot.vendor ?? "?"}) — serve markdown regardless of Accept`;
  } else if (fmt === "markdown") {
    serveAs = "markdown";
    reason = "Accept negotiation prefers text/markdown";
  } else if (fmt === "html") {
    serveAs = "html";
    reason = "Accept negotiation prefers text/html (default)";
  } else {
    serveAs = "notacceptable";
    reason = "Accept header excludes both text/html and text/markdown — return 406";
  }

  const verdictLabel = serveAs === "markdown"
    ? "→ Serve text/markdown"
    : serveAs === "html"
      ? "→ Serve text/html"
      : "→ 406 Not Acceptable";

  const parsedRows = parsed.length > 0
    ? parsed
        .map((p) => `<tr><td><code>${escapeHtml(p.type)}/${escapeHtml(p.subtype)}</code></td><td>q=${p.quality.toFixed(2)}</td></tr>`)
        .join("")
    : `<tr><td colspan="2" style="color: var(--muted)">(no media types parsed)</td></tr>`;

  resultEl.innerHTML = `
    <h2>Negotiation result</h2>
    <div class="verdict ${serveAs}">${escapeHtml(verdictLabel)}</div>
    <p>${escapeHtml(reason)}</p>

    <h3 style="margin-top:1.5rem;font-size:0.95rem;">AI bot detection</h3>
    <table>
      <tbody>
        <tr><th>Is bot</th><td class="${bot.isBot ? "pass" : "fail"}">${bot.isBot ? "yes" : "no"}</td></tr>
        <tr><th>Name</th><td>${escapeHtml(bot.name ?? "—")}</td></tr>
        <tr><th>Vendor</th><td>${escapeHtml(bot.vendor ?? "—")}</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top:1.5rem;font-size:0.95rem;">Parsed Accept (sorted by q)</h3>
    <table><tbody>${parsedRows}</tbody></table>
  `;
}

acceptEl.addEventListener("input", render);
uaEl.addEventListener("input", render);

document.querySelectorAll<HTMLButtonElement>(".presets button[data-preset]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.preset!;
    const preset = presets[key];
    if (!preset) return;
    acceptEl.value = preset.accept;
    uaEl.value = preset.ua;
    render();
  });
});

render();
