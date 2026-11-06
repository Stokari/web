import Dexie, { type Table } from "dexie";

interface MetaRecord {
  key: string;
  value: unknown;
}

class StokariDataDb extends Dexie {
  meta!: Table<MetaRecord, string>;

  constructor() {
    super("stokari_data_db");
    this.version(1).stores({
      meta: "key",
    });
  }
}

let dbInstance: StokariDataDb | null = null;

function getDb(): StokariDataDb {
  if (!dbInstance) {
    dbInstance = new StokariDataDb();
  }
  return dbInstance;
}

const MAX_RECENT_PRODUCTS = 6;

function getMetaKey(shopId: string): string {
  return `meta.recentProducts.${shopId}`;
}

/**
 * Retrieves the top 6 cashier-selected recent product IDs for the given shop.
 * Persists in IndexedDB meta table across browser restarts without server calls.
 */
export async function getRecentProductIds(shopId: string): Promise<string[]> {
  const metaKey = getMetaKey(shopId);

  // 1. Try IndexedDB
  try {
    const db = getDb();
    const record = await db.meta.get(metaKey);
    if (record && Array.isArray(record.value)) {
      return (record.value as string[]).slice(0, MAX_RECENT_PRODUCTS);
    }
  } catch {
    // Fallback to localStorage if IndexedDB is blocked or uninitialized
    if (typeof localStorage !== "undefined") {
      try {
        const raw = localStorage.getItem(metaKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            return parsed.slice(0, MAX_RECENT_PRODUCTS);
          }
        }
      } catch {
        // Ignore parse error
      }
    }
  }

  // 2. Fallback to localStorage if no DB record found
  if (typeof localStorage !== "undefined") {
    try {
      const raw = localStorage.getItem(metaKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, MAX_RECENT_PRODUCTS);
        }
      }
    } catch {
      // Ignore parse error
    }
  }

  return [];
}

/**
 * Records a product tap/selection, updating the MRU list (max 6 items)
 * and persisting to IndexedDB meta table.
 */
export async function recordRecentProduct(shopId: string, productId: string): Promise<string[]> {
  const currentList = await getRecentProductIds(shopId);
  const updatedList = [productId, ...currentList.filter((id) => id !== productId)].slice(
    0,
    MAX_RECENT_PRODUCTS,
  );

  const metaKey = getMetaKey(shopId);

  // Persist to IndexedDB
  try {
    const db = getDb();
    await db.meta.put({
      key: metaKey,
      value: updatedList,
    });
  } catch (err) {
    // If IndexedDB fails, fall back to localStorage
    console.warn("Could not save to IndexedDB meta table", err);
  }

  // Always mirror in localStorage for immediate sync & test stability
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(metaKey, JSON.stringify(updatedList));
    } catch {
      // Ignore localStorage error
    }
  }

  return updatedList;
}

/**
 * Clears recent products for a given store.
 */
export async function clearRecentProducts(shopId: string): Promise<void> {
  const metaKey = getMetaKey(shopId);
  try {
    const db = getDb();
    await db.meta.delete(metaKey);
  } catch {
    // Ignore error
  }
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.removeItem(metaKey);
    } catch {
      // Ignore error
    }
  }
}
