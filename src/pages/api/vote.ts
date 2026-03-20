import type { APIRoute } from "astro";
import { z } from "zod";
import { bondActorTmdbIds } from "lib/constants";
import { prisma } from "lib/db";

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

  const actor = await prisma.actor.upsert({
    where: { tmdbId: id },
    update: {
      numberOfVotes: { increment: 1 },
      lastVotedAt: new Date(),
    },
    create: {
      tmdbId: id,
      numberOfVotes: 1,
      lastVotedAt: new Date(),
    },
  });

  return Response.json({ success: true, votes: actor.numberOfVotes });
};
