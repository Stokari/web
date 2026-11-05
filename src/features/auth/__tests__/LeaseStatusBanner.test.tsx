import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import { LeaseStatusBanner } from "../LeaseStatusBanner";
import type { OfflineLease } from "../../../session/types";

describe("LeaseStatusBanner Component", () => {
  const baseLease: OfflineLease = {
    leaseId: "lease_01",
    membershipId: "mem_01",
    shopId: "shop_01",
    role: "ATTENDANT",
    deviceId: "dev_01",
    allowedOps: ["RecordSale"],
    issuedAt: new Date(1700000000000).toISOString(),
    expiresAt: new Date(1700000000000 + 7 * 86400 * 1000).toISOString(),
  };

  it("does not render when lease has plenty of time (>24h)", () => {
    const { container } = render(
      <LeaseStatusBanner lease={baseLease} currentTimeMs={1700000000000} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders countdown alert when lease has <24 hours remaining", () => {
    // Current time is 18 hours before expiration
    const expiryTime = new Date(baseLease.expiresAt).getTime();
    const eighteenHoursBefore = expiryTime - 18 * 3600 * 1000;

    render(<LeaseStatusBanner lease={baseLease} currentTimeMs={eighteenHoursBefore} />);

    expect(screen.getByRole("status")).toBeTruthy();
    expect(screen.getByText(/Offline lease ends in/i)).toBeTruthy();
    expect(screen.getByText(/18 hours/i)).toBeTruthy();
  });

  it("renders expired banner with emergency export when lease has expired", () => {
    const expiryTime = new Date(baseLease.expiresAt).getTime();
    const oneHourAfterExpiry = expiryTime + 3600 * 1000;

    render(
      <LeaseStatusBanner
        lease={baseLease}
        currentTimeMs={oneHourAfterExpiry}
        onExportBackup={() => {}}
      />,
    );

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(/Offline Lease Expired/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Emergency Export/i })).toBeTruthy();
  });
});
