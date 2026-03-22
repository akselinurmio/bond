import { prisma } from "./db";

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

export async function getVotesForActor(tmdbId: number): Promise<number> {
  const result = await prisma.actor.findUnique({
    where: { tmdbId },
    select: { numberOfVotes: true },
  });

  return result?.numberOfVotes ?? 0;
}
