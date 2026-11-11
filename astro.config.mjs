// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://chalybesteel.com",
  trailingSlash: "never",
  build: {
    format: "file",
    // External stylesheets keep the CSP free of inline-style hashes.
    inlineStylesheets: "never",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/404"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline scripts as data URIs or inline tags; keeps CSP strict.
      assetsInlineLimit: 0,
    },
  },
});
