import type { Configuration } from "./tmdb";

function getWPrefixedSizes(sizes: string[]): string[] {
  return sizes.filter((s) => /^w\d+$/.test(s));
}

function buildSrc(baseUrl: string, sizes: string[], imagePath: string): string {
  const size = sizes.includes("original")
    ? "original"
    : getWPrefixedSizes(sizes).reduce((a, b) =>
        parseInt(a.slice(1), 10) > parseInt(b.slice(1), 10) ? a : b,
      );
  return baseUrl + size + imagePath;
}

function buildSrcset(
  baseUrl: string,
  sizes: string[],
  imagePath: string,
  originalWidth?: number,
): string {
  const entries = getWPrefixedSizes(sizes).map(
    (size) => `${baseUrl}${size}${imagePath} ${size.slice(1)}w`,
  );
  if (originalWidth && sizes.includes("original")) {
    entries.push(`${baseUrl}original${imagePath} ${originalWidth}w`);
  }
  return entries.join(", ");
}

export function getProfileImage(
  config: Configuration,
  imagePath: string,
  originalWidth?: number,
): { src: string; srcset: string } {
  const {
    images: { secure_base_url: baseUrl, profile_sizes: sizes },
  } = config;
  return {
    src: buildSrc(baseUrl, sizes, imagePath),
    srcset: buildSrcset(baseUrl, sizes, imagePath, originalWidth),
  };
}

export function getPosterImage(
  config: Configuration,
  imagePath: string,
): { src: string; srcset: string } {
  const {
    images: { secure_base_url: baseUrl, poster_sizes: sizes },
  } = config;
  return {
    src: buildSrc(baseUrl, sizes, imagePath),
    srcset: buildSrcset(baseUrl, sizes, imagePath),
  };
}
