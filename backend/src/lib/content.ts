import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { siteContent } from '../db/schema.js';

let contentCache: Record<string, unknown> = {};
let lastFetchTime = 0;
const CACHE_TTL_MS = 20_000; // 20 seconds warm cache

export async function getContent<T = unknown>(key: string, fallback: T): Promise<T> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && key in contentCache) {
    const val = contentCache[key];
    return val === null || val === undefined ? (null as T) : (val as T);
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const rows = await db
        .select()
        .from(siteContent)
        .where(eq(siteContent.key, key))
        .limit(1);

      if (!rows[0]) return fallback;
      if (rows[0].data === null || rows[0].data === undefined) {
        return null as T;
      }
      contentCache[key] = rows[0].data;
      return rows[0].data as T;
    } catch (err: any) {
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      if (key in contentCache) {
        console.warn(`[content] Database timed out for key "${key}", serving warm cache`);
        const val = contentCache[key];
        return val === null || val === undefined ? (null as T) : (val as T);
      }
      console.warn(`[content] Database timed out for key "${key}", serving default fallback`);
      return fallback;
    }
  }
  return fallback;
}

export async function setContent(key: string, data: unknown): Promise<void> {
  contentCache[key] = data;
  lastFetchTime = Date.now();

  await db
    .insert(siteContent)
    .values({ key, data, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { data, updatedAt: new Date() },
    });
}

export async function getAllContent(): Promise<Record<string, unknown>> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_TTL_MS && Object.keys(contentCache).length > 0) {
    return { ...contentCache };
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const rows = await db.select().from(siteContent);
      const out: Record<string, unknown> = {};
      for (const row of rows) out[row.key] = row.data;
      contentCache = out;
      lastFetchTime = Date.now();
      return out;
    } catch (err: any) {
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }
      if (Object.keys(contentCache).length > 0) {
        console.warn('[content] Database timed out for getAllContent, serving warm cache');
        return { ...contentCache };
      }
      throw err;
    }
  }
  return contentCache;
}
