import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.VERCEL) {
    return process.env.DATABASE_URL;
  }
  
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    if (!fs.existsSync(tmpDbPath)) {
      const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
      if (fs.existsSync(sourceDbPath)) {
        try {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } catch (e) {
          console.error('Failed to copy SQLite database to /tmp:', e);
        }
      }
    }
    return `file:${tmpDbPath}`;
  }

  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  return `file:${dbPath}`;
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

