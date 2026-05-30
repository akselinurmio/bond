import { neon } from "@neondatabase/serverless";
import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import type { Database } from "./types";

export const db = new Kysely<Database>({
  dialect: new NeonDialect({
    neon: neon(import.meta.env.POSTGRES_URL),
  }),
});
