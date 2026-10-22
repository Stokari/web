import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the Stokari brand navigation", () => {
    render(<App />);

    expect(screen.getByText("Stokari")).toBeTruthy();
    expect(screen.getByText("POS & Inventory")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Select Store Workspace" })).toBeTruthy();
  });

  it("switches to active store dashboard when a store is selected", () => {
    render(<App />);

    const selectButtons = screen.getAllByRole("button", {
      name: /Enter Active Store|Switch to Store/i,
    });
    const firstBtn = selectButtons[0];
    expect(firstBtn).toBeDefined();
    if (firstBtn) {
      fireEvent.click(firstBtn);
    }

    expect(screen.getByRole("heading", { name: "Mercato Central Wholesale" })).toBeTruthy();
    expect(screen.getByText(/Tenancy active/i)).toBeTruthy();
  });

  it("opens Create Store wizard when clicking Create New Store", () => {
    render(<App />);

    const createBtn = screen.getByRole("button", { name: "Create New Store" });
    fireEvent.click(createBtn);

    expect(screen.getByRole("heading", { name: "Set Up New Store" })).toBeTruthy();
  });
});
