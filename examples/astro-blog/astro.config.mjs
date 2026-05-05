import { defineConfig } from "astro/config";
import dualmark from "@dualmark/astro";

export default defineConfig({
  site: "https://astro-blog.dualmark.dev",
  trailingSlash: "never",
  build: { format: "file" },
  integrations: [
    dualmark({
      siteUrl: "https://astro-blog.dualmark.dev",
      collections: {
        blog: {
          converter: "blog",
          slugStrategy: "single",
          listingMetadata: {
            title: "Dualmark Blog",
            description: "All blog posts on the Dualmark example site.",
          },
        },
      },
      staticPages: [
        { pattern: "/", render: () => "# Dualmark Example Blog\n\nWelcome — every page is dual-marked." },
        { pattern: "/about", render: () => "# About\n\nThis is a Dualmark example site." },
      ],
      llmsTxt: {
        enabled: true,
        brandName: "Dualmark Example Blog",
        description: "A reference implementation of Dualmark on Astro 5.",
        sections: [
          {
            title: "Pages",
            links: [
              { title: "Home", href: "https://astro-blog.dualmark.dev/" },
              { title: "About", href: "https://astro-blog.dualmark.dev/about" },
              { title: "Blog", href: "https://astro-blog.dualmark.dev/blog" },
            ],
          },
        ],
      },
    }),
  ],
});
