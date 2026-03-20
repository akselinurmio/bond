import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://lemppari.bond",
  output: "server",
  trailingSlash: "never",
  adapter: vercel({
    isr: {
      expiration: 60 * 5,
      exclude: ["/api/vote"],
    },
  }),
  i18n: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    routing: { prefixDefaultLocale: false },
    domains: {
      en: "https://whoisyourfavorite.bond",
    },
  },
});
