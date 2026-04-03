import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Resolve the DB path relative to process.cwd() (project root) so it works
// in both dev mode and production bundles on any OS.
const dbPath = path.resolve(process.cwd(), "prisma", "dev.db");

const prismaClientSingleton = () =>
  new PrismaClient({
    datasourceUrl: `file:${dbPath}`,
  });

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Always cache the singleton to avoid exhausting connections in any environment
globalForPrisma.prisma = prisma;
