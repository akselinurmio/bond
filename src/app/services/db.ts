import { PrismaClient } from "generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL,
  ssl: true,
});

export const prisma = new PrismaClient({ adapter });
