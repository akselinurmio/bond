import type { APIRoute } from "astro";
import { z } from "zod";
import { bondActorTmdbIds } from "lib/constants";
import { db } from "lib/db";

const idSchema = z
  .string()
  .pipe(z.coerce.number())
  .refine((id) => bondActorTmdbIds.some((actorId) => actorId === id));

export const POST: APIRoute = async ({ request }) => {
  let id: number;
  try {
    const formData = await request.formData();
    id = idSchema.parse(formData.get("id"));
  } catch {
    return Response.json(
      { success: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const result = await db
    .insertInto("Actor")
    .values({ tmdbId: id, numberOfVotes: 1, lastVotedAt: new Date() })
    .onConflict((oc) =>
      oc.column("tmdbId").doUpdateSet((eb) => ({
        numberOfVotes: eb("Actor.numberOfVotes", "+", 1),
        lastVotedAt: new Date(),
      }))
    )
    .returning("numberOfVotes")
    .executeTakeFirstOrThrow();

  return Response.json({ success: true, votes: result.numberOfVotes });
};
