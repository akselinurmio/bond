import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

import { bondActorTmdbIds } from "./constants";
import { getConfiguration, getPerson, getPersonImages, getPersonMovieCredits } from "./tmdb";
import { getProfileImage, getPosterImage } from "./tmdb-utils";

function getBondActorSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const imageSchema = z.object({ src: z.url(), srcset: z.string() });

const movieCreditSchema = z.object({
  tmdbId: z.number().int(),
  title: z.string(),
  character: z.string(),
  releaseYear: z.number().int().nullable(),
  posterImage: imageSchema.nullable(),
  voteAverage: z.number(),
});

export type MovieCredit = z.infer<typeof movieCreditSchema>;

const localizedActorSchema = z.object({
  biography: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
  movieCredits: movieCreditSchema.array(),
});

export const actorCollectionSchema = z.object({
  birthday: z.iso.date().nullable(),
  deathday: z.iso.date().nullable(),
  placeOfBirth: z.string().nullable(),
  order: z.number().int().nonnegative(),
  profileImage: imageSchema.nullable(),
  tmdbId: z.number().int(),
  locales: z.object({
    en: localizedActorSchema,
    fi: localizedActorSchema,
  }),
});

export type ActorCollectionData = z.infer<typeof actorCollectionSchema>;

function parseReleaseYear(releaseDate: string): number | null {
  const year = parseInt(releaseDate.slice(0, 4), 10);
  return isNaN(year) ? null : year;
}

async function loadActorCollectionEntries(): Promise<ActorCollectionData[]> {
  const configuration = await getConfiguration();

  return Promise.all(
    bondActorTmdbIds.map(async (tmdbId, order) => {
      const [actorEn, actorFi, creditsEn, creditsFi, personImages] =
        await Promise.all([
          getPerson(tmdbId, "en"),
          getPerson(tmdbId, "fi"),
          getPersonMovieCredits(tmdbId, "en"),
          getPersonMovieCredits(tmdbId, "fi"),
          getPersonImages(tmdbId),
        ]);
      const profilePath = actorEn.profile_path ?? actorFi.profile_path;
      const profileWidth = profilePath
        ? personImages.profiles.find((p) => p.file_path === profilePath)?.width
        : undefined;

      const mapCredits = (
        credits: typeof creditsEn,
      ): MovieCredit[] =>
        credits.cast
          .toSorted((a, b) => {
            const yearA = parseReleaseYear(a.release_date);
            const yearB = parseReleaseYear(b.release_date);
            if (yearA === null && yearB === null) return 0;
            if (yearA === null) return 1;
            if (yearB === null) return -1;
            return yearB - yearA;
          })
          .map((entry) => ({
            tmdbId: entry.id,
            title: entry.title,
            character: entry.character,
            releaseYear: parseReleaseYear(entry.release_date),
            posterImage: entry.poster_path
              ? getPosterImage(configuration, entry.poster_path)
              : null,
            voteAverage: entry.vote_average,
          }));

      return {
        birthday: actorEn.birthday,
        deathday: actorEn.deathday,
        placeOfBirth: actorEn.place_of_birth,
        order,
        profileImage: profilePath
          ? getProfileImage(configuration, profilePath, profileWidth)
          : null,
        tmdbId,
        locales: {
          en: {
            biography: actorEn.biography,
            name: actorEn.name,
            slug: getBondActorSlug(actorEn.name),
            movieCredits: mapCredits(creditsEn),
          },
          fi: {
            biography: actorFi.biography,
            name: actorFi.name,
            slug: getBondActorSlug(actorFi.name),
            movieCredits: mapCredits(creditsFi),
          },
        },
      } satisfies ActorCollectionData;
    }),
  );
}

export function bondActorsLoader() {
  return {
    name: "bond-actors-loader",
    load: async ({ generateDigest, logger, parseData, store }) => {
      logger.info("Loading Bond actors from TMDB");

      const entries = await loadActorCollectionEntries();

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
