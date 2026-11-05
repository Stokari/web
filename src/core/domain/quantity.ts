import { type Unit, UNITS } from "./units";

export const MAX_PIECE_UNITS = 1_000_000_000;
export const MAX_METRIC_MILLI = 1_000_000_000; // 1,000,000 KG/L/M * 1000 milli
export const MIN_MILLI = 0;

export class QuantityValidationError extends Error {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "QuantityValidationError";
  }
}

/**
 * Parses input into integer milli-units (1 piece = 1000 milli, 1 kg = 1000 milli).
 * Follows exact specifications in quantity-vectors.json:
 * - PIECE: Must be an integer (no floats). Max 1,000,000,000 pieces.
 * - Metric (KG, LITER, METER):
 *   - Integer string without decimal is interpreted as raw milli-units.
 *   - Decimal string is parsed and rounded half-up to 3 decimal places.
 *   - Max 1,000,000 units (1,000,000,000 milli).
 */
export function parseQuantity(input: number | string, unit: Unit): number {
  if (!(unit in UNITS)) {
    throw new QuantityValidationError(`Invalid unit: ${unit}`);
  }

  // Handle PIECE unit
  if (unit === "PIECE") {
    if (typeof input === "number") {
      if (!Number.isInteger(input)) {
        throw new QuantityValidationError("Floating point numbers are rejected for PIECE unit");
      }
      if (input < 0) {
        throw new QuantityValidationError(`Quantity cannot be negative: ${input}`);
      }
      if (input > MAX_PIECE_UNITS) {
        throw new QuantityValidationError(
          `Quantity exceeds maximum pieces (${MAX_PIECE_UNITS}): ${input}`,
        );
      }
      return input * 1000;
    }

    if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed.includes(".")) {
        throw new QuantityValidationError("Decimals are rejected for PIECE unit");
      }
      if (!/^\d+$/.test(trimmed)) {
        throw new QuantityValidationError(`Invalid integer piece string: ${trimmed}`);
      }
      const count = Number(trimmed);
      if (count < 0 || count > MAX_PIECE_UNITS) {
        throw new QuantityValidationError(`Piece quantity out of bounds: ${count}`);
      }
      return count * 1000;
    }

    throw new QuantityValidationError(`Invalid input type: ${typeof input}`);
  }

  // Metric units: KG, LITER, METER
  if (typeof input === "number") {
    if (input < 0) {
      throw new QuantityValidationError(`Quantity cannot be negative: ${input}`);
    }
    // If passed as number, convert to milli with half-up rounding
    const milli = Math.round(input * 1000);
    if (milli > MAX_METRIC_MILLI) {
      throw new QuantityValidationError(`Quantity exceeds maximum metric capacity: ${input}`);
    }
    return milli;
  }

  if (typeof input === "string") {
    const trimmed = input.trim();
    if (!trimmed) {
      throw new QuantityValidationError("Empty quantity string");
    }

    // Integer string without decimal is interpreted as direct milli-units
    if (!trimmed.includes(".")) {
      if (!/^\d+$/.test(trimmed)) {
        throw new QuantityValidationError(`Invalid metric quantity string: ${trimmed}`);
      }
      const milli = Number(trimmed);
      if (milli < 0 || milli > MAX_METRIC_MILLI) {
        throw new QuantityValidationError(`Milli quantity out of bounds: ${milli}`);
      }
      return milli;
    }

    // Decimal string
    const parts = trimmed.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1]) {
      throw new QuantityValidationError(`Invalid decimal quantity string: ${trimmed}`);
    }

    const [wholeStr, fracStr] = parts;
    if (!/^\d+$/.test(wholeStr) || !/^\d+$/.test(fracStr)) {
      throw new QuantityValidationError(`Non-numeric characters in quantity string: ${trimmed}`);
    }

    const wholeUnits = BigInt(wholeStr);
    // Convert fraction to ten-thousandths (4 decimals) for half-up rounding to thousandths (3 decimals)
    const normalizedFracStr = fracStr.padEnd(4, "0").slice(0, 4);
    const fractionTenThousandths = BigInt(normalizedFracStr);

    // If there were more than 4 decimals, check the 5th for half-up
    let addExtra = 0n;
    if (fracStr.length > 4 && Number(fracStr[4]) >= 5) {
      addExtra = 1n;
    }

    // Total in ten-thousandths = whole * 10000 + fraction + addExtra
    const totalTenThousandths = wholeUnits * 10000n + fractionTenThousandths + addExtra;
    // Round to milli (thousandths): (totalTenThousandths + 5) / 10
    const roundedMilli = Number((totalTenThousandths + 5n) / 10n);

    if (roundedMilli < 0 || roundedMilli > MAX_METRIC_MILLI) {
      throw new QuantityValidationError(`Metric quantity out of bounds: ${trimmed}`);
    }

    return roundedMilli;
  }

  throw new QuantityValidationError(`Invalid input type: ${typeof input}`);
}

/**
 * Formats milli-units into display string:
 * - PIECE: integer (e.g. 42000 -> "42")
 * - Metric: exactly 3 decimals (e.g. 1500 -> "1.500")
 */
export function formatQuantity(milli: number, unit: Unit): string {
  if (unit === "PIECE") {
    return Math.floor(milli / 1000).toString();
  }

  const whole = Math.floor(milli / 1000);
  const frac = Math.abs(milli % 1000)
    .toString()
    .padStart(3, "0");
  return `${whole}.${frac}`;
}

/**
 * Validates whether milli-units quantity is within legal bounds for the unit.
 */
export function validateQty(milli: number, unit: Unit): boolean {
  if (milli < MIN_MILLI) return false;
  if (unit === "PIECE") {
    if (milli % 1000 !== 0) return false;
    return milli <= MAX_PIECE_UNITS * 1000;
  }
  return milli <= MAX_METRIC_MILLI;
}

/**
 * Safely adds two milli-quantities.
 */
export function addQuantity(aMilli: number, bMilli: number): number {
  return aMilli + bMilli;
}

/**
 * Safely subtracts two milli-quantities.
 */
export function subtractQuantity(aMilli: number, bMilli: number): number {
  return aMilli - bMilli;
}
