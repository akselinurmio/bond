import type { Configuration } from "./tmdb";

export function getProfileImageUrlPrefix(config: Configuration): string {
  const {
    images: { secure_base_url: baseUrl, profile_sizes: sizes },
  } = config;

  const size = sizes.reduce((sizeA, sizeB) => {
    const sizeAInt = parseInt(sizeA.replace(/\D/g, ""), 10);
    const sizeBInt = parseInt(sizeB.replace(/\D/g, ""), 10);

    if (isNaN(sizeAInt)) return sizeB;
    if (isNaN(sizeBInt)) return sizeA;

    return sizeAInt > sizeBInt ? sizeA : sizeB;
  });

  return baseUrl + size;
}
