import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = (context, next) => {
  const locale = context.currentLocale ?? "fi";
  const { pathname } = context.url;

  if (locale === "fi" && pathname === "/tietoa") {
    return new Response(null, { status: 301, headers: { Location: "/about" } });
  }

  return next();
};
