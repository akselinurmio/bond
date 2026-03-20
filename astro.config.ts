import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://lemppari.bond",
  output: "server",
  trailingSlash: "never",
  adapter: vercel(),
  i18n: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    routing: { prefixDefaultLocale: false },
    domains: {
      en: "https://whoisyourfavorite.bond",
    },
  },
});
