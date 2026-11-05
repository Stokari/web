import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { StaffScreen } from "../StaffScreen";
import type { StaffMember } from "../types";

afterEach(() => {
  cleanup();
});

const mockStaff: StaffMember[] = [
  {
    id: "mem_owner",
    name: "Amanuel",
    email: "amanuel@stokari.com",
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "mem_attendant_1",
    name: "Dawit Tadesse",
    email: "dawit@stokari.com",
    role: "ATTENDANT",
    status: "ACTIVE",
    activeLeaseRemainingDays: 5,
    joinedAt: "2026-10-05T00:00:00Z",
  },
];

describe("StaffScreen Component", () => {
  it("renders staff members list and quota badge", () => {
    render(<StaffScreen shopName="Mercato Central" initialMembers={mockStaff} maxAttendants={5} />);

    expect(screen.getByRole("heading", { name: /Staff & Attendants/i })).toBeTruthy();
    expect(screen.getByText("1 / 5 Attendants")).toBeTruthy();
    expect(screen.getByText("Dawit Tadesse")).toBeTruthy();
    expect(screen.getByText("5 days left")).toBeTruthy();
  });

  it("deactivates attendant in 1 tap and updates status", async () => {
    const handleDeactivate = vi.fn();

    render(
      <StaffScreen
        shopName="Mercato Central"
        initialMembers={mockStaff}
        onDeactivateMember={handleDeactivate}
      />,
    );

    const deactBtn = screen.getByRole("button", { name: /Deactivate Dawit Tadesse/i });
    fireEvent.click(deactBtn);

    expect(handleDeactivate).toHaveBeenCalledWith("mem_attendant_1");
    expect(await screen.findByText("DEACTIVATED")).toBeTruthy();
  });

  it("opens invite modal when clicking Invite Attendant", () => {
    render(<StaffScreen shopName="Mercato Central" initialMembers={mockStaff} />);

    const inviteBtn = screen.getByRole("button", { name: "Invite Attendant" });
    fireEvent.click(inviteBtn);

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(screen.getByRole("heading", { name: /Invite Store Attendant/i })).toBeTruthy();
  });
});
