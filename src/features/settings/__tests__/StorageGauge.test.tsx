import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import { StorageGauge } from "../StorageGauge";

describe("StorageGauge Component", () => {
  it("renders storage gauge with persistent badge when persisted", async () => {
    const mockStorage = {
      persist: vi.fn().mockResolvedValue(true),
      persisted: vi.fn().mockResolvedValue(true),
      estimate: vi.fn().mockResolvedValue({
        quota: 1024 * 1024 * 1024,
        usage: 50 * 1024 * 1024,
      }),
    };

    Object.defineProperty(globalThis, "navigator", {
      value: { storage: mockStorage },
      writable: true,
      configurable: true,
    });

    render(<StorageGauge />);

    expect(screen.getByRole("heading", { name: /Local Storage/i })).toBeTruthy();
    expect(await screen.findByText(/Persistent Storage Active/i)).toBeTruthy();
  });
});
