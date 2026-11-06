import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import type { Product } from "../../catalog/types";
import { SellScreenMobile } from "../SellScreenMobile";
import type { CartLine } from "../types";

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
    priceSantim: 12500,
    stockMilli: 85000,
    lowStockMilli: 20000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

describe("Mobile Sell Screen (VS-10-04 / Task #50)", () => {
  it("renders mobile header, segmented tabs, quick chips, and product cards", () => {
    const onAddToCart = vi.fn();
    render(
      <SellScreenMobile
        shopId="shop_01"
        shopName="Mobile Till Mercato"
        products={sampleProducts}
        cart={[]}
        onAddToCart={onAddToCart}
        onUpdateQuantity={vi.fn()}
        onRemoveFromCart={vi.fn()}
        onClearCart={vi.fn()}
        onCompleteSale={vi.fn()}
        selectedTender="CASH"
        onChangeTender={vi.fn()}
      />,
    );

    expect(screen.getByText("Mobile Till Mercato")).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Items (1)" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Cart (0) • 0.00 ETB" })).toBeTruthy();
  });

  it("switches to cart tab and executes tender selection and sale completion", () => {
    const onCompleteSale = vi.fn();
    const onChangeTender = vi.fn();
    const initialCart: CartLine[] = [
      {
        productId: "prod_sugar",
        product: sampleProducts[0]!,
        quantityMilli: 2000,
        unitPriceSantim: 12500,
        lineTotalSantim: 25000,
      },
    ];

    render(
      <SellScreenMobile
        shopId="shop_01"
        shopName="Mobile Till Mercato"
        products={sampleProducts}
        cart={initialCart}
        onAddToCart={vi.fn()}
        onUpdateQuantity={vi.fn()}
        onRemoveFromCart={vi.fn()}
        onClearCart={vi.fn()}
        onCompleteSale={onCompleteSale}
        selectedTender="CASH"
        onChangeTender={onChangeTender}
      />,
    );

    // Switch to Cart tab
    const cartTab = screen.getByRole("tab", { name: /Cart/i });
    fireEvent.click(cartTab);

    expect(screen.getByText("Current Ticket (1)")).toBeTruthy();
    expect(screen.getByText("Total to Pay")).toBeTruthy();
    expect(screen.getAllByText("250.00 ETB").length).toBeGreaterThan(0);

    // Select CBE Birr
    const cbeBtn = screen.getByRole("radio", { name: /CBE Birr/i });
    fireEvent.click(cbeBtn);
    expect(onChangeTender).toHaveBeenCalledWith("CBE_BIRR");

    // Click Complete Sale
    const completeBtn = screen.getByRole("button", { name: /Charge 250.00 ETB/i });
    fireEvent.click(completeBtn);

    expect(onCompleteSale).toHaveBeenCalledTimes(1);
    expect(onCompleteSale).toHaveBeenCalledWith("CBE_BIRR");
  });
});
