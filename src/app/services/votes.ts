import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getVotesForAllBonds(): Promise<
  ReadonlyMap<number, number>
> {
  const result = await prisma.actor.findMany({
    select: { tmdbId: true, numberOfVotes: true },
  });

  return new Map(
    result.map(({ tmdbId, numberOfVotes }) => [tmdbId, numberOfVotes]),
  );
}
