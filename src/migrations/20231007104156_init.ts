import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("Actor")
    .ifNotExists()
    .addColumn("tmdbId", "integer", (col) => col.primaryKey())
    .addColumn("numberOfVotes", "integer", (col) => col.notNull())
    .addColumn("lastVotedAt", "timestamp")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("Actor").execute();
}
