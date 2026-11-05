import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { QuantityInput } from "../QuantityInput";

afterEach(() => {
  cleanup();
});

describe("QuantityInput Component (VS-08-02 / Task #40)", () => {
  it("renders PIECE stepper with whole integer controls", () => {
    const handleChange = vi.fn();
    render(
      <QuantityInput
        valueMilli={3000} // 3 pieces
        unit="PIECE"
        onChangeMilli={handleChange}
        label="Items to Count"
      />,
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("3");
    expect(screen.getByText("pcs")).toBeTruthy();

    // Increment
    const incBtn = screen.getByLabelText("Increase Items to Count");
    fireEvent.click(incBtn);
    expect(handleChange).toHaveBeenCalledWith(4000); // 4 pieces

    // Decrement
    const decBtn = screen.getByLabelText("Decrease Items to Count");
    fireEvent.click(decBtn);
    expect(handleChange).toHaveBeenCalledWith(2000); // 2 pieces
  });

  it("handles KG metric input and g/kg toggle", () => {
    const handleChange = vi.fn();
    render(
      <QuantityInput
        valueMilli={1500} // 1.500 kg
        unit="KG"
        onChangeMilli={handleChange}
        label="Sugar Weight"
      />,
    );

    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("1.500");
    expect(screen.getByText("kg")).toBeTruthy();

    // Toggle to grams
    const gramsBtn = screen.getByText("Grams (g)");
    fireEvent.click(gramsBtn);

    // In grams mode, 1500 milli displays as 1500 g
    expect(input.value).toBe("1500");
    expect(screen.getByText("g")).toBeTruthy();
  });

  it("updates value via quick quantity chips", () => {
    const handleChange = vi.fn();
    render(<QuantityInput valueMilli={0} unit="KG" onChangeMilli={handleChange} />);

    // Click 500g chip
    const chip500g = screen.getByText("500g");
    fireEvent.click(chip500g);
    expect(handleChange).toHaveBeenCalledWith(500);

    // Click 25kg chip
    const chip25kg = screen.getByText("25kg");
    fireEvent.click(chip25kg);
    expect(handleChange).toHaveBeenCalledWith(25000);
  });

  it("displays validation error when decimal is typed for PIECE unit", () => {
    const handleChange = vi.fn();
    render(<QuantityInput valueMilli={1000} unit="PIECE" onChangeMilli={handleChange} />);

    const input = screen.getByRole("spinbutton");
    fireEvent.change(input, { target: { value: "2.5" } });

    expect(screen.getByRole("alert").textContent).toContain("Pieces must be whole numbers");
  });
});
