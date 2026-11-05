import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { ProductFormModal } from "../ProductFormModal";
import { DEFAULT_CATEGORIES } from "../types";

afterEach(() => {
  cleanup();
});

describe("ProductFormModal Component (VS-07-05 / Task #35)", () => {
  it("renders form and calculates gross margin % live", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProductFormModal
        shopId="shop_01"
        categories={DEFAULT_CATEGORIES}
        userRole="OWNER"
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    expect(screen.getByRole("heading", { name: /Add Product/i })).toBeTruthy();

    const priceInput = screen.getByLabelText(/Selling Price/i);
    const costInput = screen.getByLabelText(/Wholesale Cost/i);

    fireEvent.change(priceInput, { target: { value: "100.00" } });
    fireEvent.change(costInput, { target: { value: "75.00" } });

    // Margin = (100 - 75) / 100 = 25%
    expect(screen.getByText("25%")).toBeTruthy();
  });

  it("hides cost field from attendants per NFR-12", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProductFormModal
        shopId="shop_01"
        categories={DEFAULT_CATEGORIES}
        userRole="ATTENDANT"
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    expect(screen.queryByLabelText(/Wholesale Cost/i)).toBeNull();
    expect(screen.queryByText(/Gross Margin/i)).toBeNull();
  });

  it("submits valid form data with converted integer santim", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProductFormModal
        shopId="shop_01"
        categories={DEFAULT_CATEGORIES}
        userRole="OWNER"
        onClose={handleClose}
        onSave={handleSave}
      />,
    );

    fireEvent.change(screen.getByLabelText(/Product Name \(English\)/i), {
      target: { value: "Ethiopian Coffee Beans" },
    });
    fireEvent.change(screen.getByLabelText(/Selling Price/i), {
      target: { value: "250.00" },
    });
    fireEvent.change(screen.getByLabelText(/Wholesale Cost/i), {
      target: { value: "200.00" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Create Product/i }));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Ethiopian Coffee Beans",
        priceSantim: 25000,
        costSantim: 20000,
        unit: "PIECE",
      }),
    );
  });
});
