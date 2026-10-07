import "server-only"

import { PrismaMariaDb } from "@prisma/adapter-mariadb"

import { PrismaClient } from "@/generated/prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set")

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL) })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
