import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = (context, next) => {
  const locale = context.currentLocale ?? "fi";
  const { pathname } = context.url;

  // Block /about on Finnish domain
  if (locale === "fi" && pathname === "/about") {
    return new Response(null, { status: 404 });
  }

  // Block /tietoa on English domain
  if (locale === "en" && pathname === "/tietoa") {
    return new Response(null, { status: 404 });
  }

  return next();
};
