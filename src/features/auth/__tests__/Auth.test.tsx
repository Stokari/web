import "fake-indexeddb/auto";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { AuthProvider } from "../AuthContext";
import { RequireAuth } from "../RequireAuth";
import type { AuthUser, OfflineLease } from "../../../session/types";

afterEach(() => {
  cleanup();
});

const mockUser: AuthUser = {
  id: "user_test_01",
  email: "owner@stokari.com",
  name: "Owner Amanuel",
  role: "OWNER",
  shopId: "shop_01",
  membershipId: "mem_01",
  deviceId: "dev_01",
};

const mockLease: OfflineLease = {
  leaseId: "lease_01",
  membershipId: "mem_01",
  shopId: "shop_01",
  role: "OWNER",
  deviceId: "dev_01",
  allowedOps: ["*"],
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
};

describe("Authentication & Route Guards", () => {
  it("renders Google Sign-In button when unauthenticated", async () => {
    render(
      <AuthProvider initialUser={null} initialLease={null}>
        <RequireAuth>
          <div>Protected Store Dashboard</div>
        </RequireAuth>
      </AuthProvider>,
    );

    const btn = await screen.findByRole("button", { name: /Sign in with Google/i });
    expect(btn).toBeTruthy();
    expect(screen.queryByText("Protected Store Dashboard")).toBeNull();
  });

  it("renders protected content when user is authenticated", () => {
    render(
      <AuthProvider initialUser={mockUser} initialLease={mockLease}>
        <RequireAuth>
          <div>Protected Store Dashboard</div>
        </RequireAuth>
      </AuthProvider>,
    );

    expect(screen.getByText("Protected Store Dashboard")).toBeTruthy();
  });

  it("authenticates when clicking Google sign in", async () => {
    render(
      <AuthProvider initialUser={null} initialLease={null}>
        <RequireAuth>
          <div>Protected Store Dashboard</div>
        </RequireAuth>
      </AuthProvider>,
    );

    const btn = await screen.findByRole("button", { name: /Sign in with Google/i });
    fireEvent.click(btn);

    // After sign-in trigger, protected content renders
    expect(await screen.findByText("Protected Store Dashboard")).toBeTruthy();
  });
});
