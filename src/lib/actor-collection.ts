import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

import { bondActorTmdbIds } from "./constants";
import { getConfiguration, getPerson } from "./tmdb";
import { getProfileImageUrlPrefix } from "./tmdb-utils";

function getBondActorSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const localizedActorSchema = z.object({
  biography: z.string().nullable(),
  name: z.string(),
  slug: z.string(),
});

export const actorCollectionSchema = z.object({
  order: z.number().int().nonnegative(),
  profileImageUrl: z.url().nullable(),
  tmdbId: z.number().int(),
  locales: z.object({
    en: localizedActorSchema,
    fi: localizedActorSchema,
  }),
});

export type ActorCollectionData = z.infer<typeof actorCollectionSchema>;

async function loadActorCollectionEntries(): Promise<ActorCollectionData[]> {
  const configuration = await getConfiguration();
  const profileImageUrlPrefix = getProfileImageUrlPrefix(configuration);

  return Promise.all(
    bondActorTmdbIds.map(async (tmdbId, order) => {
      const [actorEn, actorFi] = await Promise.all([
        getPerson(tmdbId, "en"),
        getPerson(tmdbId, "fi"),
      ]);
      const profilePath = actorEn.profile_path ?? actorFi.profile_path;

      return {
        order,
        profileImageUrl: profilePath
          ? profileImageUrlPrefix + profilePath
          : null,
        tmdbId,
        locales: {
          en: {
            biography: actorEn.biography,
            name: actorEn.name,
            slug: getBondActorSlug(actorEn.name),
          },
          fi: {
            biography: actorFi.biography,
            name: actorFi.name,
            slug: getBondActorSlug(actorFi.name),
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
