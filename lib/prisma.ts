
import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port || 4000),
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  database: decodeURIComponent(url.pathname.slice(1)),
  ssl: true,
  connectionLimit: 3,
});

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
