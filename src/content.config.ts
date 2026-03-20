import { defineCollection } from "astro:content";

import { actorCollectionSchema, bondActorsLoader } from "lib/actor-collection";
import {
  bondFilmCollectionSchema,
  bondFilmsLoader,
} from "lib/bond-film-collection";

const actors = defineCollection({
  loader: bondActorsLoader(),
  schema: actorCollectionSchema,
});

const bondFilms = defineCollection({
  loader: bondFilmsLoader(),
  schema: bondFilmCollectionSchema,
});

export const collections = { actors, bondFilms };
