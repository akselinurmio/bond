import { NextResponse, type NextRequest } from "next/server";

const locales = ["en", "fi"] as const;

function getLocale(hostname: string): (typeof locales)[number] {
  if (hostname.startsWith("whoisyourfavorite.bond")) {
    return "en";
  }

  return "fi";
}

function rewrite(request: NextRequest, locale: string, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.rewrite(url, {
    headers: { "x-lang": locale },
  });
}

export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const locale = getLocale(hostname);
  const { pathname } = request.nextUrl;

  // Rewrite Finnish about path to the canonical /about route
  if (locale === "fi" && pathname === "/tietoa") {
    return rewrite(request, locale, "/about");
  }

  // Block /about for Finnish locale (should use /tietoa)
  if (locale === "fi" && pathname === "/about") {
    return rewrite(request, locale, "/_");
  }

  // Block /tietoa for English locale
  if (locale === "en" && pathname === "/tietoa") {
    return rewrite(request, locale, "/_");
  }

  // Add locale prefix to all other paths
  return rewrite(request, locale, pathname);
}

export const config = {
  matcher: ["/((?!_next|favicon\\.png|.*\\.svg|.*\\.gif).*)"],
};
