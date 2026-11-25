import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const rawUrl =
  process.env.DB_MODE === "tx"
    ? process.env.DATABASE_URL
    : process.env.DIRECT_URL;

if (!rawUrl) {
  throw new Error(
    "Не найдена строка подключения DATABASE_URL или DIRECT_URL"
  );
}

const url = new URL(rawUrl);

url.searchParams.delete("sslmode");
url.searchParams.delete("connection_limit");

console.log(
  `[DB] mode=${process.env.DB_MODE}, host=${url.hostname}, port=${url.port}`
);

const adapter = new PrismaPg(
  {
    connectionString: url.toString(),
    ssl: {
      rejectUnauthorized: false,
    },
    max: 5,
    maxUses: 4,
    keepAlive: true,
    connectionTimeoutMillis: 10000,
    query_timeout: 30000,
  },
  {
    onPoolError: (error) => {
      console.error("[PG POOL ERROR]", {
        message: error.message,
        code: error.code,
        syscall: error.syscall,
      });
    },

    onConnectionError: (error) => {
      console.error("[PG CONNECTION ERROR]", {
        message: error.message,
        code: error.code,
        syscall: error.syscall,
      });
    },
  }
);

export const prisma = new PrismaClient({ adapter });
