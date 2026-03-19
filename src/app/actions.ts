"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import { bondActorTmdbIds } from "app/constants";
import { prisma } from "./services/db";

const actorIdSchema = z.coerce
  .number()
  .refine((id) => bondActorTmdbIds.has(id));

export type VoteActionState = { error: string | null; voted: boolean };

export async function voteForActor(
  _prevState: VoteActionState,
  formData: FormData,
): Promise<VoteActionState> {
  console.log("Voting...", Object.fromEntries(formData.entries()));

  const language = formData.get("language");

  let id: number;
  try {
    id = actorIdSchema.parse(formData.get("id"));
  } catch (e) {
    console.error(e);
    return {
      error: language === "fi" ? "Epäkelpo ID." : "Invalid ID.",
      voted: false,
    };
  }

  await prisma.actor.upsert({
    where: {
      tmdbId: id,
    },
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

  revalidateTag("votes");

  return {
    error: null,
    voted: true,
  };
}
