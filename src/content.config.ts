import { defineCollection } from "astro:content";

import { actorCollectionSchema, bondActorsLoader } from "lib/actor-collection";

const actors = defineCollection({
  loader: bondActorsLoader(),
  schema: actorCollectionSchema,
});

export const collections = { actors };
