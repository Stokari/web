import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { ShopSelectorScreen } from "./ShopSelectorScreen";
import type { ShopMembership } from "./types";

afterEach(() => {
  cleanup();
});

const mockShops: ShopMembership[] = [
  {
    id: "shop-1",
    name: "Mercato Wholesale",
    slug: "mercato-ws",
    role: "OWNER",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 3,
    maxAttendants: 5,
  },
  {
    id: "shop-2",
    name: "Bole Retail Hub",
    slug: "bole-hub",
    role: "ATTENDANT",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 1,
    maxAttendants: 5,
  },
];

describe("ShopSelectorScreen", () => {
  it("renders the list of stores with their names and role badges", () => {
    render(<ShopSelectorScreen shops={mockShops} currentShopId="shop-1" onSelectShop={() => {}} />);

    expect(screen.getByText("Mercato Wholesale")).toBeTruthy();
    expect(screen.getByText("Bole Retail Hub")).toBeTruthy();
    expect(screen.getByText("OWNER")).toBeTruthy();
    expect(screen.getByText("ATTENDANT")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
  });

  it("calls onSelectShop when clicking a shop card", () => {
    const handleSelect = vi.fn();

    render(
      <ShopSelectorScreen shops={mockShops} currentShopId="shop-1" onSelectShop={handleSelect} />,
    );

    const switchBtn = screen.getByRole("button", { name: "Switch to Store" });
    fireEvent.click(switchBtn);

    expect(handleSelect).toHaveBeenCalledWith("shop-2");
  });

  it("calls onCreateNewShop when clicking the create button", () => {
    const handleCreate = vi.fn();

    render(
      <ShopSelectorScreen
        shops={mockShops}
        onSelectShop={() => {}}
        onCreateNewShop={handleCreate}
      />,
    );

    const createBtn = screen.getByRole("button", {
      name: "Create New Store",
    });
    fireEvent.click(createBtn);

    expect(handleCreate).toHaveBeenCalledTimes(1);
  });
});
