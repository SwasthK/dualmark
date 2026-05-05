import Link from "next/link";
import { BeamsBackground } from "./beams-bg";
import { CodeBlock, Tok } from "./code-block";
import { InstallCommandClient } from "./install-command";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-[var(--color-border)]">
      <BeamsBackground />
      <div className="absolute inset-0 -z-10 bg-grid mask-radial-fade opacity-30" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col items-center px-6 pb-24 pt-16 md:px-8 md:pb-32 md:pt-24">
        <Link
          href="https://github.com/dodopayments/dualmark"
          className="group mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elev-1)]/70 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-fg-muted)] backdrop-blur transition-colors hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
        >
          <span className="size-1.5 rounded-full bg-[var(--color-accent)]" />
          AEO Spec v1.0 — now open source
          <span aria-hidden className="opacity-60 transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </Link>

        <h1 className="max-w-4xl text-balance text-center text-5xl font-semibold tracking-tight text-[var(--color-fg)] md:text-7xl">
          AEO infrastructure{" "}
          <span className="bg-gradient-to-r from-[#e8ffa8] via-[#c6fe1e] to-[#9ee847] bg-clip-text text-transparent">
            built for developers.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-center text-lg text-[var(--color-fg-muted)] md:text-xl">
          One config. One spec. Every page gets a markdown twin for AI agents.
          <br className="hidden md:inline" />
          Drop into your stack in 30 seconds. Verify with one command.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/docs"
            className="group inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 font-semibold text-[var(--color-accent-ink)] transition-all hover:bg-[var(--color-accent-strong)]"
          >
            Read the docs
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
          <InstallCommand />
        </div>

        <div className="mt-20 w-full max-w-3xl animate-[var(--animate-fade-in-up)]">
          <CodeBlock filename="astro.config.mjs" language="js">
            <Tok c="kw">import</Tok>
            <Tok c="punct"> {"{ "}</Tok>
            <Tok c="var">defineConfig</Tok>
            <Tok c="punct">{" }"} </Tok>
            <Tok c="kw">from</Tok>
            <Tok c="str"> "astro/config"</Tok>
            <Tok c="punct">;</Tok>
            {"\n"}
            <Tok c="kw">import</Tok>
            <Tok c="var"> dualmark </Tok>
            <Tok c="kw">from</Tok>
            <Tok c="str"> "@dualmark/astro"</Tok>
            <Tok c="punct">;</Tok>
            {"\n\n"}
            <Tok c="kw">export default</Tok>
            <Tok c="fn"> defineConfig</Tok>
            <Tok c="punct">{"({"}</Tok>
            {"\n  "}
            <Tok c="prop">site</Tok>
            <Tok c="punct">: </Tok>
            <Tok c="str">"https://yourcompany.com"</Tok>
            <Tok c="punct">,</Tok>
            {"\n  "}
            <Tok c="prop">integrations</Tok>
            <Tok c="punct">: [</Tok>
            {"\n    "}
            <Tok c="fn">dualmark</Tok>
            <Tok c="punct">{"({"}</Tok>
            {"\n      "}
            <Tok c="prop">collections</Tok>
            <Tok c="punct">: {"{"}</Tok>
            {"\n        "}
            <Tok c="prop">blog</Tok>
            <Tok c="punct">: {"{ "}</Tok>
            <Tok c="prop">converter</Tok>
            <Tok c="punct">: </Tok>
            <Tok c="str">"blog"</Tok>
            <Tok c="punct">{" },"}</Tok>
            <Tok c="com">{"   // /blog/*.md auto-generated"}</Tok>
            {"\n        "}
            <Tok c="prop">glossary</Tok>
            <Tok c="punct">: {"{ "}</Tok>
            <Tok c="prop">converter</Tok>
            <Tok c="punct">: </Tok>
            <Tok c="str">"glossary"</Tok>
            <Tok c="punct">{" },"}</Tok>
            {"\n      "}
            <Tok c="punct">{"},"}</Tok>
            {"\n      "}
            <Tok c="prop">llmsTxt</Tok>
            <Tok c="punct">: {"{ "}</Tok>
            <Tok c="prop">enabled</Tok>
            <Tok c="punct">: </Tok>
            <Tok c="kw">true</Tok>
            <Tok c="punct">{" },"}</Tok>
            <Tok c="com">{"               // /llms.txt auto-generated"}</Tok>
            {"\n    "}
            <Tok c="punct">{"}),"}</Tok>
            {"\n  "}
            <Tok c="punct">{"],"}</Tok>
            {"\n"}
            <Tok c="punct">{"});"}</Tok>
          </CodeBlock>
        </div>
      </div>
    </section>
  );
}

function InstallCommand() {
  return <InstallCommandClient />;
}
