import "fake-indexeddb/auto";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import type { Product } from "../../catalog/types";
import { SellScreen } from "../SellScreen";

afterEach(() => {
  cleanup();
});

const sampleProducts: Product[] = [
  {
    id: "prod_sugar",
    shopId: "shop_01",
    name: "White Sugar",
    nameAlt: "ነጭ ስኳር",
    sku: "SUG-01",
    unit: "KG",
    category: "grains",
    priceSantim: 12500, // 125.00 ETB
    costSantim: 9500,
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
    sku: "OIL-02",
    unit: "LITER",
    category: "oils",
    priceSantim: 18000, // 180.00 ETB
    costSantim: 14500,
    stockMilli: 12000,
    lowStockMilli: 15000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

describe("POS Cashier SellScreen (VS-10-01 / Task #47)", () => {
  it("renders cashier till layout with quick staples and catalog items", () => {
    render(<SellScreen shopId="shop_01" products={sampleProducts} forceMobile={false} />);

    expect(screen.getByText("Mercato Store #1")).toBeTruthy();
    expect(screen.getByText("● Offline Ready (No Cloud Lag)")).toBeTruthy();
    expect(screen.getByText("Current Ticket (0)")).toBeTruthy();
  });

  it("achieves sub-10s, 3-tap checkout flow: tap product -> tap tender -> complete sale", () => {
    const onCompleteSale = vi.fn();
    render(
      <SellScreen
        shopId="shop_01"
        products={sampleProducts}
        onCompleteSale={onCompleteSale}
        forceMobile={false}
      />,
    );

    // Tap 1: Add product from quick favorites or catalog
    const addSugarBtn = screen.getByRole("button", { name: "Add White Sugar to cart" });
    fireEvent.click(addSugarBtn);

    // Assert cart has 1 item and total is 125.00 ETB
    expect(screen.getByText("Current Ticket (1)")).toBeTruthy();
    expect(screen.getAllByText("125.00 ETB").length).toBeGreaterThan(0);

    // Tap 2: Select Telebirr payment
    const telebirrBtn = screen.getByRole("radio", { name: /Telebirr/i });
    fireEvent.click(telebirrBtn);
    expect(telebirrBtn.getAttribute("aria-checked")).toBe("true");

    // Tap 3: Complete sale via sticky CTA
    const completeBtn = screen.getByRole("button", { name: /Complete Sale/i });
    fireEvent.click(completeBtn);

    // Verified complete sale callback called with correct payload
    expect(onCompleteSale).toHaveBeenCalledTimes(1);
    const sale = onCompleteSale.mock.calls[0]?.[0];
    expect(sale).toBeDefined();
    if (sale) {
      expect(sale.tender).toBe("TELEBIRR");
      expect(sale.totalSantim).toBe(12500);
      expect(sale.lines.length).toBe(1);
      expect(sale.lines[0]?.productId).toBe("prod_sugar");
    }
  });

  it("adjusts quantities with stepper buttons and updates totals", () => {
    render(<SellScreen shopId="shop_01" products={sampleProducts} forceMobile={false} />);

    const addSugarBtn = screen.getByRole("button", { name: "Add White Sugar to cart" });
    fireEvent.click(addSugarBtn);

    const increaseBtn = screen.getByRole("button", { name: "Increase White Sugar" });
    fireEvent.click(increaseBtn);

    // 2 kg * 125 = 250.00 ETB
    expect(screen.getAllByText("250.00 ETB").length).toBeGreaterThan(0);

    const decreaseBtn = screen.getByRole("button", { name: "Decrease White Sugar" });
    fireEvent.click(decreaseBtn);

    // Back to 1 kg = 125.00 ETB
    expect(screen.getAllByText("125.00 ETB").length).toBeGreaterThan(0);
  });

  it("filters products using in-memory search trie with Amharic homophones", () => {
    render(<SellScreen shopId="shop_01" products={sampleProducts} forceMobile={false} />);

    const searchInput = screen.getByLabelText("Search catalog products");
    // Search using labialized variation 'ስክዋር' which folds to 'ስኳር'
    fireEvent.change(searchInput, { target: { value: "ስክዋር" } });

    const catalogPane = screen.getByLabelText("Product Catalog Selection");
    expect(within(catalogPane).getByText("White Sugar")).toBeTruthy();
    expect(within(catalogPane).queryByText("Sunflower Oil")).toBeNull();
  });
});
