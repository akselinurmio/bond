import type { Insertable, Selectable, Updateable } from "kysely";

export interface Database {
  Actor: ActorTable;
}

interface ActorTable {
  tmdbId: number;
  numberOfVotes: number;
  lastVotedAt: Date | null;
}

export type Actor = Selectable<ActorTable>;
export type NewActor = Insertable<ActorTable>;
export type ActorUpdate = Updateable<ActorTable>;
