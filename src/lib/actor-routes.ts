import { getAbsoluteLocaleUrl } from "astro:i18n";

export function getBondActorPath(
  actorId: number,
  slug: string,
  language: "en" | "fi",
): string {
  return language === "fi"
    ? `/bondit/${actorId}/${slug}`
    : `/bonds/${actorId}/${slug}`;
}

export function getBondActorUrl(
  actorId: number,
  slug: string,
  language: "en" | "fi",
): string {
  const path =
    language === "fi"
      ? `bondit/${actorId}/${slug}`
      : `bonds/${actorId}/${slug}`;
  return getAbsoluteLocaleUrl(language, path);
}
