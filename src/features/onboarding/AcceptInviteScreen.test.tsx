import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { AcceptInviteScreen, type InviteDetails } from "./AcceptInviteScreen";

afterEach(() => {
  cleanup();
});

const mockInvite: InviteDetails = {
  token: "inv_token_123",
  shopName: "Mercato Central Wholesale",
  inviterName: "Amanuel",
  currentAttendants: 2,
  maxAttendants: 5,
  expiresInHours: 48,
};

describe("AcceptInviteScreen", () => {
  it("renders invite details and quota correctly", () => {
    render(<AcceptInviteScreen invite={mockInvite} onAccept={() => {}} onDecline={() => {}} />);

    expect(screen.getByRole("heading", { name: "Join Mercato Central Wholesale" })).toBeTruthy();
    expect(screen.getByText("Amanuel (Owner)")).toBeTruthy();
    expect(screen.getByText("2 / 5 Attendants")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Accept & Join Store" })).toBeTruthy();
  });

  it("submits the token and attendant name when accepted", () => {
    const handleAccept = vi.fn();
    render(<AcceptInviteScreen invite={mockInvite} onAccept={handleAccept} onDecline={() => {}} />);

    const input = screen.getByLabelText(/Your Full Name/i);
    fireEvent.change(input, { target: { value: "Hana Kebede" } });

    const acceptBtn = screen.getByRole("button", { name: "Accept & Join Store" });
    fireEvent.click(acceptBtn);

    expect(handleAccept).toHaveBeenCalledWith("inv_token_123", "Hana Kebede");
  });

  it("blocks acceptance when quota is at maximum", () => {
    const fullInvite: InviteDetails = {
      ...mockInvite,
      currentAttendants: 5,
    };

    render(<AcceptInviteScreen invite={fullInvite} onAccept={() => {}} onDecline={() => {}} />);

    expect(screen.getByText(/store is at capacity/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Accept & Join Store" })).toBeNull();
  });
});
