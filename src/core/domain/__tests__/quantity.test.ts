import { describe, it, expect } from "vite-plus/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  parseQuantity,
  formatQuantity,
  validateQty,
  addQuantity,
  subtractQuantity,
  QuantityValidationError,
} from "../quantity";
import type { Unit } from "../units";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_PATH = path.resolve(
  __dirname,
  "../../../../contract/fixtures/quantity-vectors.json",
);

interface QuantityVector {
  name: string;
  input: number | string;
  unit: string;
  expected_milli?: number;
  expected_formatted?: string;
  should_fail?: boolean;
  error_code?: string;
}

describe("Quantity Domain Math & Vector Parity", () => {
  const vectors: QuantityVector[] = JSON.parse(fs.readFileSync(FIXTURES_PATH, "utf-8"));

  for (const vector of vectors) {
    const unit = vector.unit as Unit;

    if (vector.should_fail) {
      it(`fails on invalid vector: ${vector.name}`, () => {
        expect(() => parseQuantity(vector.input, unit)).toThrow(QuantityValidationError);
      });
    } else {
      it(`parses and formats vector: ${vector.name}`, () => {
        const parsedMilli = parseQuantity(vector.input, unit);
        expect(parsedMilli).toBe(vector.expected_milli);

        if (vector.expected_formatted !== undefined) {
          const formatted = formatQuantity(parsedMilli, unit);
          expect(formatted).toBe(vector.expected_formatted);
        }
      });
    }
  }

  describe("Validation and arithmetic", () => {
    it("validates legal bounds for units", () => {
      expect(validateQty(1000, "PIECE")).toBe(true);
      expect(validateQty(1500, "PIECE")).toBe(false); // Fractional pieces not allowed
      expect(validateQty(1500, "KG")).toBe(true);
      expect(validateQty(-1, "KG")).toBe(false);
    });

    it("adds and subtracts milli-quantities", () => {
      expect(addQuantity(1500, 2500)).toBe(4000);
      expect(subtractQuantity(5000, 1200)).toBe(3800);
    });
  });
});
