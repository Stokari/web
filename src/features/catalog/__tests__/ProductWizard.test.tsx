import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { ProductWizard } from "../ProductWizard";
import { DEFAULT_CATEGORIES } from "../types";

afterEach(() => {
  cleanup();
});

describe("ProductWizard Component (VS-08-01 / Task #39)", () => {
  it("renders step 1 with unit chips and live preview sentence", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <ProductWizard
        shopId="shop_01"
        categories={DEFAULT_CATEGORIES}
        onClose={handleClose}
        onSaveProduct={handleSave}
      />,
    );

    expect(screen.getByRole("heading", { name: /Product Setup Wizard/i })).toBeTruthy();
    expect(screen.getByText(/How do you sell it\?/i)).toBeTruthy();

    const nameInput = screen.getByLabelText(/Product Name/i);
    fireEvent.change(nameInput, { target: { value: "White Sugar" } });

    // Click Weight (kg) unit card
    const weightBtn = screen.getByText("Weight (kg)");
    fireEvent.click(weightBtn);

    // Live preview sentence
    expect(screen.getByText(/You sell "White Sugar" by the kilogram \(kg\)\./i)).toBeTruthy();
  });

  it("navigates through steps, adds bulk packaging, and saves product with converted stock", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    const { container } = render(
      <ProductWizard
        shopId="shop_01"
        categories={DEFAULT_CATEGORIES}
        onClose={handleClose}
        onSaveProduct={handleSave}
      />,
    );

    // Step 1: Fill Name and choose Piece unit
    const nameInput = screen.getByLabelText(/Product Name/i);
    fireEvent.change(nameInput, { target: { value: "Coca Cola" } });

    fireEvent.click(screen.getByText(/Next: Packaging/i));

    // Step 2: Packaging step
    expect(screen.getByText(/Bulk Containers & Packaging/i)).toBeTruthy();
    // Click Crate of 24 preset
    const crateBtn = screen.getByText(/\+ Crate of 24/i);
    fireEvent.click(crateBtn);

    expect(screen.getByText(/1 Crate of 24 = 24 pcs/i)).toBeTruthy();

    fireEvent.click(screen.getByText(/Next: Pricing & Stock/i));

    // Step 3: Pricing & Opening Stock
    const priceInput = screen.getByLabelText(/Selling Price/i);
    fireEvent.change(priceInput, { target: { value: "35.50" } });

    // Opening inventory: 2 Crates
    const openingSelect = screen.getByLabelText(/Opening unit or container/i) as HTMLSelectElement;
    expect(openingSelect.options.length).toBeGreaterThan(1);
    const crateOption = openingSelect.options[1];
    expect(crateOption).toBeDefined();
    if (crateOption) {
      fireEvent.change(openingSelect, { target: { value: crateOption.value } });
    }

    const countInput = container.querySelector("#wizard-opening-count") as HTMLInputElement;
    fireEvent.change(countInput, { target: { value: "2" } }); // 2 crates

    fireEvent.click(screen.getByRole("button", { name: /Save & Add Product/i }));

    expect(handleSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Coca Cola",
        unit: "PIECE",
        priceSantim: 3550, // 35.50 Birr -> 3550 santim
        status: "ACTIVE",
        packagings: expect.arrayContaining([
          expect.objectContaining({ name: "Crate of 24", multiplierMilli: 24000 }),
        ]),
      }),
    );
  });
});
