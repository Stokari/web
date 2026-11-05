import { describe, expect, it, vi } from "vite-plus/test";
import {
  checkIsStoragePersisted,
  getStorageEstimate,
  requestPersistentStorage,
} from "../persistence-manager";

describe("PersistenceManager (navigator.storage)", () => {
  it("requests storage persistence and returns status", async () => {
    // Mock navigator.storage
    const mockStorage = {
      persist: vi.fn().mockResolvedValue(true),
      persisted: vi.fn().mockResolvedValue(true),
      estimate: vi.fn().mockResolvedValue({ quota: 1000000000, usage: 50000000 }),
    };

    Object.defineProperty(globalThis, "navigator", {
      value: { storage: mockStorage },
      writable: true,
      configurable: true,
    });

    const persisted = await requestPersistentStorage();
    expect(persisted).toBe(true);
    expect(mockStorage.persist).toHaveBeenCalled();

    const isGranted = await checkIsStoragePersisted();
    expect(isGranted).toBe(true);
  });

  it("calculates storage usage percentage correctly", async () => {
    const mockStorage = {
      persist: vi.fn().mockResolvedValue(true),
      persisted: vi.fn().mockResolvedValue(true),
      estimate: vi.fn().mockResolvedValue({
        quota: 1000 * 1024 * 1024, // 1000 MB
        usage: 250 * 1024 * 1024, // 250 MB
      }),
    };

    Object.defineProperty(globalThis, "navigator", {
      value: { storage: mockStorage },
      writable: true,
      configurable: true,
    });

    const estimate = await getStorageEstimate();
    expect(estimate.percentUsed).toBe(25);
    expect(estimate.isPersisted).toBe(true);
  });
});
