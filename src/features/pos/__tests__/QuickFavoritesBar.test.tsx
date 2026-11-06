import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import type { Product } from "../../catalog/types";
import { QuickFavoritesBar } from "../QuickFavoritesBar";

afterEach(() => {
  cleanup();
});

const sampleProducts: Product[] = [
  {
    id: "prod_sugar",
    shopId: "shop_01",
    name: "White Sugar",
    nameAlt: "ነጭ ስኳር",
    unit: "KG",
    category: "grains",
    priceSantim: 12500,
    stockMilli: 85000,
    lowStockMilli: 20000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_oil",
    shopId: "shop_01",
    name: "Sunflower Oil",
    nameAlt: "የሱፍ ዘይት",
    unit: "LITER",
    category: "oils",
    priceSantim: 18000,
    stockMilli: 12000,
    lowStockMilli: 15000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_coffee",
    shopId: "shop_01",
    name: "Yirgacheffe Coffee",
    nameAlt: "ይርጋጨፌ ቡና",
    unit: "PIECE",
    category: "beverages",
    priceSantim: 32000,
    stockMilli: 40000,
    lowStockMilli: 10000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

describe("QuickFavoritesBar (VS-10-02 / Task #48)", () => {
  it("renders quick staple chips for staples and displays prices in ETB", () => {
    const onSelect = vi.fn();
    render(<QuickFavoritesBar products={sampleProducts} onSelectProduct={onSelect} />);

    expect(screen.getByText("White Sugar")).toBeTruthy();
    expect(screen.getByText("ነጭ ስኳር")).toBeTruthy();
    expect(screen.getByText("Sunflower Oil")).toBeTruthy();
    expect(screen.getByText("Yirgacheffe Coffee")).toBeTruthy();
  });

  it("triggers onSelectProduct on 1 tap", () => {
    const onSelect = vi.fn();
    render(<QuickFavoritesBar products={sampleProducts} onSelectProduct={onSelect} />);

    const sugarBtn = screen.getByRole("button", { name: /Select White Sugar/i });
    fireEvent.click(sugarBtn);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(sampleProducts[0]);
  });

  it("prioritizes recent products passed via recentProductIds", () => {
    const onSelect = vi.fn();
    render(
      <QuickFavoritesBar
        products={sampleProducts}
        recentProductIds={["prod_coffee", "prod_oil"]}
        onSelectProduct={onSelect}
      />,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons[0]?.textContent).toContain("Yirgacheffe Coffee");
    expect(buttons[1]?.textContent).toContain("Sunflower Oil");
  });
});
