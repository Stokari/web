import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { CategoryModal } from "../CategoryModal";
import { DEFAULT_CATEGORIES } from "../types";

afterEach(() => {
  cleanup();
});

describe("CategoryModal Component (VS-07-08 / Task #38)", () => {
  it("renders existing categories and allows adding a new category", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <CategoryModal
        categories={DEFAULT_CATEGORIES}
        onClose={handleClose}
        onSaveCategories={handleSave}
      />,
    );

    expect(screen.getByRole("heading", { name: /Store Categories/i })).toBeTruthy();
    expect(screen.getByText("Grains & Flour")).toBeTruthy();

    // Add new category "Dairy"
    const nameInput = screen.getByLabelText(/Category Name \(English\)/i);
    fireEvent.change(nameInput, { target: { value: "Dairy & Eggs" } });

    fireEvent.click(screen.getByRole("button", { name: /\+ Add Category/i }));

    expect(screen.getByText("Dairy & Eggs")).toBeTruthy();

    // Save changes
    fireEvent.click(screen.getByRole("button", { name: /Save Changes/i }));
    expect(handleSave).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "Dairy & Eggs", slug: "dairy-eggs" }),
      ]),
    );
  });

  it("edits an existing category", () => {
    const handleSave = vi.fn();
    const handleClose = vi.fn();

    render(
      <CategoryModal
        categories={DEFAULT_CATEGORIES}
        onClose={handleClose}
        onSaveCategories={handleSave}
      />,
    );

    const editBtn = screen.getByLabelText("Edit Grains & Flour");
    fireEvent.click(editBtn);

    const nameInput = screen.getByLabelText(/Category Name \(English\)/i) as HTMLInputElement;
    expect(nameInput.value).toBe("Grains & Flour");

    fireEvent.change(nameInput, { target: { value: "Organic Grains" } });
    fireEvent.click(screen.getByRole("button", { name: /Update Category/i }));

    expect(screen.getByText("Organic Grains")).toBeTruthy();
  });
});
