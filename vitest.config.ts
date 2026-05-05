import { defineConfig } from "vitest/config";

/**
 * Root Vitest config — coverage settings live here because v8 coverage
 * runs on the main thread and per-workspace coverage config is ignored.
 */
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/test/**",
        "**/*.test.ts",
        "**/*.config.ts",
        "**/examples/**",
        "**/apps/**",
      ],
    },
  },
});
