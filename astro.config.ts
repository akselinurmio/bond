import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

const isr = {
  expiration: 60 * 5,
  exclude: [/^\/api(?:\/.*)?$/],
};

export default defineConfig({
  site: "https://lemppari.bond",
  output: "server",
  adapter: vercel({ isr }),
  i18n: {
    locales: ["fi", "en"],
    defaultLocale: "fi",
    routing: { prefixDefaultLocale: false },
    domains: {
      en: "https://whoisyourfavorite.bond",
    },
  },
});
