import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("Actor")
    .alterColumn("lastVotedAt", (col) => col.setDataType(sql`timestamptz(3)`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("Actor")
    .alterColumn("lastVotedAt", (col) => col.setDataType("timestamp"))
    .execute();
}
