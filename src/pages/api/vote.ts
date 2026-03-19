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
  let language: string;
  try {
    const formData = await request.formData();
    id = idSchema.parse(formData.get("id"));
    language = formData.get("language") === "en" ? "en" : "fi";
  } catch {
    return new Response(JSON.stringify({ error: "Invalid request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  await prisma.actor.upsert({
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

  const redirectPath = language === "en" ? "/en/" : "/";

  return new Response(null, {
    status: 303,
    headers: { Location: redirectPath },
  });
};
