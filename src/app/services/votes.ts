import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./db";

export async function getVotesForAllBonds(): Promise<
  ReadonlyMap<number, number>
> {
  "use cache";
  cacheLife("minutes");
  cacheTag("votes");

  const result = await prisma.actor.findMany({
    select: { tmdbId: true, numberOfVotes: true },
  });

  return new Map(
    result.map(({ tmdbId, numberOfVotes }) => [tmdbId, numberOfVotes]),
  );
}
