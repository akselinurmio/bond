import { neon } from "@neondatabase/serverless";
import { defineConfig } from "kysely-ctl";
import { NeonDialect } from "kysely-neon";

export default defineConfig({
  dialect: new NeonDialect({
    neon: neon(process.env.POSTGRES_URL ?? ""),
  }),
  migrations: {
    migrationFolder: "src/migrations",
  },
});
