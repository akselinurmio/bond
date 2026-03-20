import { getAbsoluteLocaleUrl } from "astro:i18n";

export function getBondActorPath(actorId: number, slug: string): string {
  return `/bonds/${actorId}/${slug}`;
}

export function getBondActorUrl(
  actorId: number,
  slug: string,
  language: "en" | "fi",
): string {
  return getAbsoluteLocaleUrl(language, `bonds/${actorId}/${slug}`);
}
