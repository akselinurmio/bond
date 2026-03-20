import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

import { bondMoviesTmdbListId } from "./constants";
import { getConfiguration, getMovieList, type MovieListItem } from "./tmdb";
import { getPosterImage } from "./tmdb-utils";

function getBondFilmSlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const imageSchema = z.object({ src: z.url(), srcset: z.string() });

const localizedBondFilmSchema = z.object({
  overview: z.string(),
  slug: z.string(),
  title: z.string(),
});

export const bondFilmCollectionSchema = z.object({
  listOrder: z.number().int().nonnegative(),
  posterImage: imageSchema.nullable(),
  releaseDate: z.string().nullable(),
  releaseYear: z.number().int().nullable(),
  tmdbId: z.number().int(),
  locales: z.object({
    en: localizedBondFilmSchema,
    fi: localizedBondFilmSchema,
  }),
});

export type BondFilmCollectionData = z.infer<typeof bondFilmCollectionSchema>;

function parseReleaseYear(
  releaseDate: string | null | undefined,
): number | null {
  if (!releaseDate) return null;

  const year = parseInt(releaseDate.slice(0, 4), 10);
  return isNaN(year) ? null : year;
}

function isMovie(item: MovieListItem): boolean {
  return item.media_type === undefined || item.media_type === "movie";
}

async function loadBondFilmCollectionEntries(): Promise<
  BondFilmCollectionData[]
> {
  const [configuration, listEn, listFi] = await Promise.all([
    getConfiguration(),
    getMovieList(bondMoviesTmdbListId, "en-US"),
    getMovieList(bondMoviesTmdbListId, "fi-FI"),
  ]);

  const englishItems = listEn.items.filter(isMovie);
  const finnishItemsById = new Map(
    listFi.items.filter(isMovie).map((item) => [item.id, item]),
  );

  return englishItems.map((item, listOrder) => {
    const localizedFi = finnishItemsById.get(item.id);
    const releaseDate = item.release_date ?? localizedFi?.release_date ?? null;
    const posterPath = item.poster_path ?? localizedFi?.poster_path ?? null;
    const finnishTitle = localizedFi?.title.trim();
    const finnishOverview = localizedFi?.overview.trim();

    return {
      listOrder,
      posterImage: posterPath
        ? getPosterImage(configuration, posterPath)
        : null,
      releaseDate,
      releaseYear: parseReleaseYear(releaseDate),
      tmdbId: item.id,
      locales: {
        en: {
          overview: item.overview,
          slug: getBondFilmSlug(item.title),
          title: item.title,
        },
        fi: {
          overview: finnishOverview || item.overview,
          slug: getBondFilmSlug(finnishTitle || item.title),
          title: finnishTitle || item.title,
        },
      },
    } satisfies BondFilmCollectionData;
  });
}

export function bondFilmsLoader() {
  return {
    name: "bond-films-loader",
    load: async ({ generateDigest, logger, parseData, store }) => {
      logger.info("Loading Bond films from TMDB");

      const entries = await loadBondFilmCollectionEntries();

      store.clear();

      for (const entry of entries) {
        const id = String(entry.tmdbId);
        const data = await parseData({ id, data: entry });

        store.set({
          id,
          data,
          digest: generateDigest(data),
        });
      }
    },
  } satisfies Loader;
}
