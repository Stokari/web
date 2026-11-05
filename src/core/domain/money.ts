export const MAX_SANTIM = 99_999_999_999;
export const MIN_SANTIM = 0;

export class MoneyValidationError extends Error {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "MoneyValidationError";
  }
}

/**
 * Parses and validates santim amount according to Stokari money vectors.
 * - Integer numbers are accepted as santim.
 * - Float numbers are rejected.
 * - Integer strings (e.g. "12345", "000123") are parsed as santim.
 * - 3-decimal fraction strings (e.g. "0.005", "0.015") represent fractional Birr
 *   and are converted to santim with half-up rounding.
 * - Other float strings (e.g. "100.50") are rejected.
 */
export function parseMoney(input: number | string): number {
  if (typeof input === "number") {
    if (!Number.isInteger(input)) {
      throw new MoneyValidationError("Float numbers are rejected; money must be in integer santim");
    }
    if (input < MIN_SANTIM) {
      throw new MoneyValidationError(`Money cannot be negative: ${input}`);
    }
    if (input > MAX_SANTIM) {
      throw new MoneyValidationError(
        `Money exceeds maximum allowed santim (${MAX_SANTIM}): ${input}`,
      );
    }
    return input;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new MoneyValidationError("Empty money string");
    }

    // Check if it has a decimal point
    if (trimmed.includes(".")) {
      const parts = trimmed.split(".");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new MoneyValidationError(`Invalid decimal string: ${trimmed}`);
      }

      const [wholeStr, fracStr] = parts;
      if (!/^\d+$/.test(wholeStr) || !/^\d+$/.test(fracStr)) {
        throw new MoneyValidationError(`Non-numeric characters in decimal string: ${trimmed}`);
      }

      // Only 3-decimal strings representing fractional birr are rounded
      if (fracStr.length === 3) {
        const wholeBirr = BigInt(wholeStr);
        const milliBirr = BigInt(fracStr); // thousandths of a Birr = tenths of a santim
        // 1 Birr = 100 santim = 1000 milliBirr
        // Total milliBirr = wholeBirr * 1000 + milliBirr
        // 1 santim = 10 milliBirr
        // To round to nearest santim with half-up: (totalMilliBirr + 5) / 10
        const totalMilliBirr = wholeBirr * 1000n + milliBirr;
        const roundedSantim = Number((totalMilliBirr + 5n) / 10n);

        if (roundedSantim < MIN_SANTIM || roundedSantim > MAX_SANTIM) {
          throw new MoneyValidationError(`Parsed money out of bounds: ${roundedSantim}`);
        }
        return roundedSantim;
      }

      // Other float strings are rejected
      throw new MoneyValidationError(`Float string rejected: ${trimmed}`);
    }

    if (!/^\d+$/.test(trimmed)) {
      throw new MoneyValidationError(`Invalid integer santim string: ${trimmed}`);
    }

    const parsed = Number(BigInt(trimmed));
    if (parsed < MIN_SANTIM) {
      throw new MoneyValidationError(`Money cannot be negative: ${parsed}`);
    }
    if (parsed > MAX_SANTIM) {
      throw new MoneyValidationError(`Money exceeds maximum allowed santim: ${parsed}`);
    }
    return parsed;
  }

  throw new MoneyValidationError(`Invalid input type for money: ${typeof input}`);
}

/**
 * Formats a santim amount into standard decimal Birr format (e.g. 10000 -> "100.00").
 */
export function formatMoney(santim: number | bigint): string {
  const value = BigInt(santim);
  const sign = value < 0n ? "-" : "";
  const absValue = value < 0n ? -value : value;

  const birr = absValue / 100n;
  const cents = absValue % 100n;
  const centsStr = cents.toString().padStart(2, "0");

  return `${sign}${birr.toString()}.${centsStr}`;
}

/**
 * Formats a santim amount with currency code (e.g. 10000 -> "ETB 100.00").
 */
export function formatMoneyWithCurrency(santim: number | bigint): string {
  return `ETB ${formatMoney(santim)}`;
}

/**
 * Safely adds two santim values using BigInt.
 */
export function addMoney(a: number | bigint, b: number | bigint): number {
  const sum = BigInt(a) + BigInt(b);
  if (sum > BigInt(MAX_SANTIM)) {
    throw new MoneyValidationError(`Money overflow on addition: ${sum}`);
  }
  return Number(sum);
}

/**
 * Safely subtracts two santim values using BigInt.
 */
export function subtractMoney(a: number | bigint, b: number | bigint): number {
  const diff = BigInt(a) - BigInt(b);
  return Number(diff);
}

/**
 * Multiplies santim by a quantity milli-units (1 kg = 1000 milli).
 * Returns total santim rounded half-up.
 */
export function multiplyMoneyByQuantity(priceSantim: number, qtyMilli: number): number {
  // lineTotal = (priceSantim * qtyMilli + 500) / 1000
  const product = BigInt(priceSantim) * BigInt(qtyMilli);
  const rounded = (product + 500n) / 1000n;
  return Number(rounded);
}
