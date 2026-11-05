export interface StorageEstimateInfo {
  quotaBytes: number;
  usageBytes: number;
  percentUsed: number;
  isPersisted: boolean;
}

/**
 * Requests durable persistent storage permission from the browser
 * to prevent automatic eviction of IndexedDB data on Android Chrome and Safari.
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persist) {
    try {
      const isPersisted = await navigator.storage.persist();
      return isPersisted;
    } catch (err) {
      console.warn("Storage persist request failed", err);
      return false;
    }
  }
  return false;
}

/**
 * Checks whether persistent storage is currently granted.
 */
export async function checkIsStoragePersisted(): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.persisted) {
    try {
      return await navigator.storage.persisted();
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Retrieves storage quota and usage estimation.
 */
export async function getStorageEstimate(): Promise<StorageEstimateInfo> {
  let quota = 0;
  let usage = 0;

  if (typeof navigator !== "undefined" && navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      quota = estimate.quota ?? 0;
      usage = estimate.usage ?? 0;
    } catch (err) {
      console.warn("Storage estimate failed", err);
    }
  }

  const isPersisted = await checkIsStoragePersisted();
  const percentUsed = quota > 0 ? Math.round((usage / quota) * 100) : 0;

  return {
    quotaBytes: quota,
    usageBytes: usage,
    percentUsed,
    isPersisted,
  };
}
