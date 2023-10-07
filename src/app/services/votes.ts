import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getVotesForBond(id: number): Promise<number> {
  const result = await prisma.actor.findUnique({
    where: { tmdbId: id },
    select: { numberOfVotes: true },
  });

  return result ? result.numberOfVotes : 0;
}

export async function addVoteForBond(id: number): Promise<number> {
  const result = await prisma.actor.upsert({
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

  return result.numberOfVotes;
}
