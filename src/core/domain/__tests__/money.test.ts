import { describe, it, expect } from "vite-plus/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import {
  parseMoney,
  formatMoney,
  formatMoneyWithCurrency,
  addMoney,
  subtractMoney,
  multiplyMoneyByQuantity,
  MoneyValidationError,
} from "../money";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FIXTURES_PATH = path.resolve(__dirname, "../../../../contract/fixtures/money-vectors.json");

interface MoneyVector {
  name: string;
  input: number | string;
  expected_santim?: number;
  expected_formatted?: string;
  should_fail?: boolean;
  error_code?: string;
}

describe("Money Domain Math & Vector Parity", () => {
  const vectors: MoneyVector[] = JSON.parse(fs.readFileSync(FIXTURES_PATH, "utf-8"));

  for (const vector of vectors) {
    if (vector.should_fail) {
      it(`fails on invalid vector: ${vector.name}`, () => {
        expect(() => parseMoney(vector.input)).toThrow(MoneyValidationError);
      });
    } else {
      it(`parses and formats vector: ${vector.name}`, () => {
        const parsed = parseMoney(vector.input);
        expect(parsed).toBe(vector.expected_santim);

        if (vector.expected_formatted !== undefined) {
          const formatted = formatMoney(parsed);
          expect(formatted).toBe(vector.expected_formatted);
        }
      });
    }
  }

  describe("Arithmetic operations", () => {
    it("adds santim correctly", () => {
      expect(addMoney(100, 250)).toBe(350);
      expect(addMoney(0, 5000)).toBe(5000);
    });

    it("subtracts santim correctly", () => {
      expect(subtractMoney(500, 200)).toBe(300);
      expect(subtractMoney(100, 150)).toBe(-50);
    });

    it("multiplies price by quantity milli with half-up rounding", () => {
      // 100 santim (1 ETB) * 1500 milli (1.5 kg) = 150 santim
      expect(multiplyMoneyByQuantity(100, 1500)).toBe(150);

      // 33 santim * 333 milli (0.333 kg) = 10.989 -> 11 santim
      expect(multiplyMoneyByQuantity(33, 333)).toBe(11);
    });

    it("formats with currency prefix", () => {
      expect(formatMoneyWithCurrency(15000)).toBe("ETB 150.00");
    });
  });
});
