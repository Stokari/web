import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { CreateShopWizard } from "./CreateShopWizard";

afterEach(() => {
  cleanup();
});

describe("CreateShopWizard", () => {
  it("renders step 1 with store name input", () => {
    render(<CreateShopWizard onComplete={() => {}} onCancel={() => {}} />);

    expect(screen.getByRole("heading", { name: "Set Up New Store" })).toBeTruthy();
    expect(screen.getByLabelText(/Store Name/i)).toBeTruthy();
  });

  it("shows error when trying to continue without store name", () => {
    render(<CreateShopWizard onComplete={() => {}} onCancel={() => {}} />);

    const continueBtn = screen.getByRole("button", { name: "Continue" });
    fireEvent.click(continueBtn);

    expect(screen.getByText("Please enter a name for your store.")).toBeTruthy();
  });

  it("advances through steps and submits store details", () => {
    const handleComplete = vi.fn();

    render(<CreateShopWizard onComplete={handleComplete} onCancel={() => {}} />);

    // Step 1: Fill name
    const input = screen.getByLabelText(/Store Name/i);
    fireEvent.change(input, { target: { value: "Addis Supermart" } });

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    // Step 2: Select type
    expect(screen.getByText("Grocery & Mart")).toBeTruthy();
    fireEvent.click(screen.getByText("Grocery & Mart"));

    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    // Step 3: Review & Submit
    expect(screen.getByText("Addis Supermart")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Create Store" }));

    expect(handleComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Addis Supermart",
        slug: "addis-supermart",
        category: "grocery",
      }),
    );
  });
});
