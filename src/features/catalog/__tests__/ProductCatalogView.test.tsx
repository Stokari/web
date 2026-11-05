import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { ProductCatalogView } from "../ProductCatalogView";
import type { Product } from "../types";
import { DEFAULT_CATEGORIES } from "../types";

afterEach(() => {
  cleanup();
});

const mockProducts: Product[] = [
  {
    id: "prod_1",
    shopId: "shop_01",
    name: "White Sugar",
    nameAlt: "ነጭ ስኳር",
    sku: "SUG-01",
    unit: "KG",
    category: "grains",
    priceSantim: 12500, // 125.00 ETB
    costSantim: 9500, // 95.00 ETB
    stockMilli: 50000, // 50.000 kg
    lowStockMilli: 20000, // 20.000 kg
    status: "ACTIVE",
    packagings: [{ id: "pkg_1", name: "Sack (25 kg)", multiplierMilli: 25000 }],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_2",
    shopId: "shop_01",
    name: "Sunflower Cooking Oil",
    nameAlt: "የሱፍ ዘይት",
    sku: "OIL-02",
    unit: "LITER",
    category: "oils",
    priceSantim: 18000, // 180.00 ETB
    costSantim: 14000, // 140.00 ETB
    stockMilli: 5000, // 5.000 L (Low stock!)
    lowStockMilli: 10000, // 10.000 L
    status: "ACTIVE",
    packagings: [{ id: "pkg_2", name: "Jerrycan (20 L)", multiplierMilli: 20000 }],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_3",
    shopId: "shop_01",
    name: "Table Salt",
    nameAlt: "የገበታ ጨው",
    sku: "SLT-03",
    unit: "PIECE",
    category: "spices",
    priceSantim: 2500,
    costSantim: 1800,
    stockMilli: 10000,
    lowStockMilli: 5000,
    status: "ARCHIVED",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

describe("ProductCatalogView Component (VS-07-06 / Task #36)", () => {
  it("renders products table with price, stock, and role-gated cost visibility for owners", () => {
    render(
      <ProductCatalogView
        shopId="shop_01"
        initialProducts={mockProducts}
        initialCategories={DEFAULT_CATEGORIES}
        userRole="OWNER"
      />,
    );

    expect(screen.getByRole("heading", { name: /Product Catalog/i })).toBeTruthy();

    const table = screen.getByRole("table");
    expect(within(table).getByText("White Sugar")).toBeTruthy();
    expect(within(table).getByText("Sunflower Cooking Oil")).toBeTruthy();

    // Cost column is present for OWNER
    expect(within(table).getByText("Cost (ETB)")).toBeTruthy();
    expect(within(table).getByText("ETB 95.00")).toBeTruthy();
  });

  it("hides wholesale cost column for attendants per NFR-12", () => {
    render(
      <ProductCatalogView
        shopId="shop_01"
        initialProducts={mockProducts}
        initialCategories={DEFAULT_CATEGORIES}
        userRole="ATTENDANT"
      />,
    );

    const table = screen.getByRole("table");
    expect(within(table).queryByText("Cost (ETB)")).toBeNull();
    expect(within(table).queryByText("ETB 95.00")).toBeNull();
  });

  it("filters products using bilingual Amharic search normalization", () => {
    render(
      <ProductCatalogView
        shopId="shop_01"
        initialProducts={mockProducts}
        initialCategories={DEFAULT_CATEGORIES}
        userRole="OWNER"
      />,
    );

    const searchInput = screen.getByLabelText("Search products");

    // Search by Amharic text "ስኳር"
    fireEvent.change(searchInput, { target: { value: "ስኳር" } });

    const table = screen.getByRole("table");
    expect(within(table).getByText("White Sugar")).toBeTruthy();
    expect(within(table).queryByText("Sunflower Cooking Oil")).toBeNull();
  });

  it("filters products by category chip", () => {
    render(
      <ProductCatalogView
        shopId="shop_01"
        initialProducts={mockProducts}
        initialCategories={DEFAULT_CATEGORIES}
        userRole="OWNER"
      />,
    );

    // Click Oils & Fats category chip
    const oilsChip = screen.getByRole("button", { name: "Oils & Fats" });
    fireEvent.click(oilsChip);

    const table = screen.getByRole("table");
    expect(within(table).getByText("Sunflower Cooking Oil")).toBeTruthy();
    expect(within(table).queryByText("White Sugar")).toBeNull();
  });

  it("opens slide-out detail drawer on product row click", () => {
    render(
      <ProductCatalogView
        shopId="shop_01"
        initialProducts={mockProducts}
        initialCategories={DEFAULT_CATEGORIES}
        userRole="OWNER"
      />,
    );

    const table = screen.getByRole("table");
    const sugarRow = within(table).getByText("White Sugar");
    fireEvent.click(sugarRow);

    // Drawer should open displaying product details
    const drawer = screen.getByRole("dialog");
    expect(drawer).toBeTruthy();
    expect(within(drawer).getByText("On Hand Stock")).toBeTruthy();
    expect(within(drawer).getByText("50.000")).toBeTruthy();
    expect(within(drawer).getByText("Sack (25 kg)")).toBeTruthy();
  });
});
