import { db } from "./db";

export async function getVotesForAllBonds(): Promise<
  ReadonlyMap<number, number>
> {
  const rows = await db
    .selectFrom("Actor")
    .select(["tmdbId", "numberOfVotes"])
    .execute();

  return new Map(rows.map(({ tmdbId, numberOfVotes }) => [tmdbId, numberOfVotes]));
}

export async function getVotesForActor(tmdbId: number): Promise<number> {
  const row = await db
    .selectFrom("Actor")
    .select("numberOfVotes")
    .where("tmdbId", "=", tmdbId)
    .executeTakeFirst();

  return row?.numberOfVotes ?? 0;
}
