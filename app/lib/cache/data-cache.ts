import { unstable_cache } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { Prisma, PrismaClient } from '@prisma/client';

export type CacheKey = 'category' | 'color' | 'size' | 'supplier' | 'product' | 'order' | 'settings' | 'profile';

type PrismaModel = {
  [K in CacheKey]: any;
};

export const getCachedData = unstable_cache(
  async <T extends CacheKey>(key: T, query: any = {}) => {
    return (prisma[key] as any).findMany(query);
  },
  ['data-cache'],
  { revalidate: 30 }
);

export const getCachedSingleData = unstable_cache(
  async <T extends CacheKey>(key: T, id: string) => {
    return (prisma[key] as any).findUnique({
      where: { id }
    });
  },
  ['single-data-cache'],
  { revalidate: 30 }
);

export const invalidateCache = (key: CacheKey) => {
  // בעתיד נוסיף כאן לוגיקה לניקוי המטמון
}; 