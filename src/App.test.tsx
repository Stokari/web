import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import App from "./App";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("renders the starter heading", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Get started" }).textContent).toBe("Get started");
  });

  it("increments the counter when clicked", () => {
    render(<App />);

    const button = screen.getByRole("button", { name: "Count is 0" });

    fireEvent.click(button);

    expect(button.textContent).toBe("Count is 1");
  });
});
