import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { verifyClockIntegrity } from "../clock";
import { checkLeaseStatus, isOperationPermitted } from "../lease-guard";
import { TokenManager } from "../token-manager";
import type { AuthUser, OfflineLease, StoredRefreshToken } from "../types";

describe("Session Management & Clock Rollback Guard", () => {
  let manager: TokenManager;

  beforeEach(() => {
    manager = new TokenManager();
  });

  it("stores access token exclusively in memory and retrieves it while valid", () => {
    manager.setAccessToken("test_access_jwt", 900); // 15 mins
    expect(manager.getAccessToken()).toBe("test_access_jwt");

    manager.clearMemoryTokens();
    expect(manager.getAccessToken()).toBeNull();
  });

  it("detects clock tampering when device clock rolls backward by > 5 minutes", () => {
    const fixedNow = 1700000000000;
    // Advance max seen time
    const res1 = verifyClockIntegrity(fixedNow, fixedNow);
    expect(res1.valid).toBe(true);

    // Roll clock backward by 6 minutes (360,000 ms)
    const rolledBackTime = fixedNow - 6 * 60 * 1000;
    const res2 = verifyClockIntegrity(rolledBackTime, fixedNow);

    expect(res2.valid).toBe(false);
    expect(res2.reason).toBe("CLOCK_ROLLBACK_DETECTED");
  });

  it("locks token manager and revokes access token on clock rollback", () => {
    const now = Date.now();
    manager.setAccessToken("active_jwt", 900);
    expect(manager.getAccessToken()).toBe("active_jwt");

    // Simulate clock tampering
    const tamperedTime = now - 10 * 60 * 1000;
    const checkResult = manager.checkTimeIntegrity(tamperedTime, now);

    expect(checkResult).toBe(false);
    expect(manager.isSecurityLocked()).toBe(true);
    // Access token must immediately be nullified
    expect(manager.getAccessToken()).toBeNull();
  });

  it("evaluates lease expiration, remaining hours, and 24h warning state", () => {
    const now = Date.now();
    const lease: OfflineLease = {
      leaseId: "lease_01",
      membershipId: "mem_01",
      shopId: "shop_01",
      role: "ATTENDANT",
      deviceId: "dev_01",
      allowedOps: ["RecordSale"],
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 12 * 60 * 60 * 1000).toISOString(), // 12 hours left
    };

    const status = checkLeaseStatus(lease, now);
    expect(status.isValid).toBe(true);
    expect(status.isExpiringSoon).toBe(true); // <24 hours
    expect(status.remainingHours).toBe(12);

    expect(isOperationPermitted(lease, "RecordSale")).toBe(true);
    expect(isOperationPermitted(lease, "ReceiveStock")).toBe(false); // Attendant cannot receive stock

    // Expired lease
    const expiredStatus = checkLeaseStatus(lease, now + 13 * 60 * 60 * 1000);
    expect(expiredStatus.isValid).toBe(false);
    expect(expiredStatus.isExpired).toBe(true);
  });

  it("persists and restores refresh token and lease in IndexedDB", async () => {
    const refreshToken: StoredRefreshToken = {
      token: "refresh_secret_123",
      familyId: "family_1",
      expiresAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
      shopId: "shop_01",
      userId: "user_01",
      deviceId: "dev_01",
    };

    const lease: OfflineLease = {
      leaseId: "lease_01",
      membershipId: "mem_01",
      shopId: "shop_01",
      role: "OWNER",
      deviceId: "dev_01",
      allowedOps: ["*"],
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
    };

    const user: AuthUser = {
      id: "user_01",
      email: "amanuel@example.com",
      name: "Amanuel",
      role: "OWNER",
      shopId: "shop_01",
      membershipId: "mem_01",
      deviceId: "dev_01",
    };

    await manager.persistSessionData(refreshToken, lease, user);

    const loaded = await manager.loadStoredSession();
    expect(loaded.refreshToken?.token).toBe("refresh_secret_123");
    expect(loaded.lease?.leaseId).toBe("lease_01");
    expect(loaded.user?.name).toBe("Amanuel");

    await manager.clearSession();
    const afterClear = await manager.loadStoredSession();
    expect(afterClear.refreshToken).toBeNull();
  });
});
