import type { Unit } from "../../core/domain/units";
import type { Packaging } from "./types";

/**
 * Standard bulk container presets commonly used in Ethiopian retail and wholesale.
 */
export interface PackagingPreset {
  label: string;
  nameAlt?: string;
  count: number;
  unit: Unit;
}

export const COMMON_PACKAGING_PRESETS: Record<Unit, PackagingPreset[]> = {
  PIECE: [
    { label: "Pack of 6", count: 6, unit: "PIECE" },
    { label: "Carton of 12", count: 12, unit: "PIECE" },
    { label: "Crate of 24", count: 24, unit: "PIECE" },
    { label: "Box of 50", count: 50, unit: "PIECE" },
  ],
  KG: [
    { label: "Bag (5 kg)", count: 5, unit: "KG" },
    { label: "Sack (25 kg)", count: 25, unit: "KG" },
    { label: "Half-Quintal (50 kg)", count: 50, unit: "KG" },
    { label: "Quintal (100 kg)", count: 100, unit: "KG" },
  ],
  LITER: [
    { label: "Bottle (1 L)", count: 1, unit: "LITER" },
    { label: "Jug (5 L)", count: 5, unit: "LITER" },
    { label: "Jerrycan (20 L)", count: 20, unit: "LITER" },
    { label: "Barrel (200 L)", count: 200, unit: "LITER" },
  ],
  METER: [
    { label: "Half-Roll (25 m)", count: 25, unit: "METER" },
    { label: "Roll (50 m)", count: 50, unit: "METER" },
    { label: "Bundle (100 m)", count: 100, unit: "METER" },
  ],
};

/**
 * Calculates how many base milli-units are represented by a container quantity.
 * E.g., 5 Crates of 24 pieces = 5 * 24,000 milli = 120,000 milli (120 pieces).
 */
export function calculatePackagingTotalMilli(containerCount: number, packaging: Packaging): number {
  if (containerCount <= 0 || !Number.isFinite(containerCount)) {
    return 0;
  }
  return Math.round(containerCount * packaging.multiplierMilli);
}

/**
 * Calculates initial opening stock in milli-units, taking into account
 * whether opening count was specified in base units or in bulk containers.
 */
export function calculateOpeningStockMilli(
  count: number,
  _unit: Unit,
  selectedPackaging?: Packaging,
): number {
  if (count <= 0 || !Number.isFinite(count)) {
    return 0;
  }

  if (selectedPackaging) {
    return calculatePackagingTotalMilli(count, selectedPackaging);
  }

  // Base unit: 1 unit = 1,000 milli-units
  return Math.round(count * 1000);
}

/**
 * Formats a packaging rule into human-readable label.
 * E.g., "Crate (24 pcs)" -> "1 Crate = 24 pcs"
 */
export function formatPackagingDescription(packaging: Packaging, unit: Unit): string {
  const count = packaging.multiplierMilli / 1000;
  const symbol = unit === "PIECE" ? "pcs" : unit.toLowerCase();
  return `1 ${packaging.name} = ${count} ${symbol}`;
}
