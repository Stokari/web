import Dexie, { type Table } from "dexie";
import { verifyClockIntegrity } from "./clock";
import type { AuthUser, ClockSecurityState, OfflineLease, StoredRefreshToken } from "./types";

interface MetaRecord {
  key: string;
  value: unknown;
}

class SessionStorageDb extends Dexie {
  refreshTokens!: Table<StoredRefreshToken, string>;
  leases!: Table<OfflineLease, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super("stokari_session_db");
    this.version(1).stores({
      refreshTokens: "token, shopId, userId",
      leases: "leaseId, shopId, membershipId",
      meta: "key",
    });
  }
}

// Memory-only access token storage (isolated from XSS access)
let inMemoryAccessToken: string | null = null;
let inMemoryExpiresAtMs: number | null = null;

let sessionDbInstance: SessionStorageDb | null = null;

function getDb(): SessionStorageDb {
  if (!sessionDbInstance) {
    sessionDbInstance = new SessionStorageDb();
  }
  return sessionDbInstance;
}

export class TokenManager {
  private clockState: ClockSecurityState = {
    clockOffsetMs: 0,
    maxSeenTimeMs: Date.now(),
    isTampered: false,
  };

  /**
   * Sets the short-lived access token in memory.
   */
  setAccessToken(token: string, expiresInSec: number): void {
    inMemoryAccessToken = token;
    inMemoryExpiresAtMs = Date.now() + expiresInSec * 1000;
  }

  /**
   * Returns the current memory-held access token, or null if expired/unset.
   */
  getAccessToken(): string | null {
    if (this.clockState.isTampered) {
      return null;
    }
    if (!inMemoryAccessToken || !inMemoryExpiresAtMs) {
      return null;
    }
    if (Date.now() >= inMemoryExpiresAtMs) {
      return null;
    }
    return inMemoryAccessToken;
  }

  /**
   * Clears in-memory tokens.
   */
  clearMemoryTokens(): void {
    inMemoryAccessToken = null;
    inMemoryExpiresAtMs = null;
  }

  /**
   * Saves refresh token and lease into IndexedDB.
   */
  async persistSessionData(
    refreshToken: StoredRefreshToken,
    lease: OfflineLease,
    user: AuthUser,
  ): Promise<void> {
    const db = getDb();
    const now = Date.now();

    this.checkTimeIntegrity(now);
    if (this.clockState.isTampered) {
      throw new Error("SECURITY_LOCK: Clock rollback detected");
    }

    await db.transaction("rw", [db.refreshTokens, db.leases, db.meta], async () => {
      await db.refreshTokens.put(refreshToken);
      await db.leases.put(lease);
      await db.meta.put({ key: "active_user", value: user });
      await db.meta.put({ key: "maxSeenTime", value: this.clockState.maxSeenTimeMs });
    });
  }

  /**
   * Loads the stored session from IndexedDB.
   */
  async loadStoredSession(): Promise<{
    refreshToken: StoredRefreshToken | null;
    lease: OfflineLease | null;
    user: AuthUser | null;
  }> {
    const db = getDb();
    const now = Date.now();

    const maxSeenRecord = await db.meta.get("maxSeenTime");
    const storedMaxSeen = typeof maxSeenRecord?.value === "number" ? maxSeenRecord.value : now;

    this.checkTimeIntegrity(now, storedMaxSeen);

    if (this.clockState.isTampered) {
      this.clearMemoryTokens();
      return { refreshToken: null, lease: null, user: null };
    }

    const refreshToken = (await db.refreshTokens.toCollection().first()) ?? null;
    const lease = (await db.leases.toCollection().first()) ?? null;
    const userRecord = await db.meta.get("active_user");
    const user = (userRecord?.value as AuthUser) ?? null;

    return { refreshToken, lease, user };
  }

  /**
   * Clears persistent session data (e.g. on logout).
   */
  async clearSession(): Promise<void> {
    this.clearMemoryTokens();
    const db = getDb();
    await db.transaction("rw", [db.refreshTokens, db.leases, db.meta], async () => {
      await db.refreshTokens.clear();
      await db.leases.clear();
      await db.meta.delete("active_user");
    });
  }

  /**
   * Checks current time against maxSeenTime to detect tampering.
   */
  checkTimeIntegrity(nowMs: number = Date.now(), storedMax?: number): boolean {
    const baseMax =
      storedMax !== undefined
        ? Math.max(storedMax, this.clockState.maxSeenTimeMs)
        : this.clockState.maxSeenTimeMs;
    const result = verifyClockIntegrity(nowMs, baseMax);

    if (!result.valid) {
      this.clockState.isTampered = true;
      this.clearMemoryTokens();
      return false;
    }

    this.clockState.maxSeenTimeMs = result.newMaxSeenTimeMs;
    return true;
  }

  isSecurityLocked(): boolean {
    return this.clockState.isTampered;
  }

  getClockState(): ClockSecurityState {
    return { ...this.clockState };
  }
}

export const tokenManager = new TokenManager();
