import { getAbsoluteLocaleUrl } from "astro:i18n";

export function getBondActorSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
