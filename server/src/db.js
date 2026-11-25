import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const rawUrl =
  process.env.DB_MODE === "tx"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL;

const url = new URL(rawUrl);
url.searchParams.delete("sslmode");
url.searchParams.delete("pgbouncer");
url.searchParams.delete("connection_limit");

const maxUses = Number(process.env.DB_MAX_USES ?? 4); 

const adapter = new PrismaPg({
  connectionString: url.toString(),
  ssl: { rejectUnauthorized: false },
  max: 5,
  keepAlive: true,
  connectionTimeoutMillis: 8000,
    query_timeout: 10000,
  ...(maxUses > 0 ? { maxUses } : {}),
});

export const prisma = new PrismaClient({ adapter });