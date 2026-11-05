export type Unit = "PIECE" | "KG" | "LITER" | "METER";

export interface UnitDefinition {
  code: Unit;
  name: string;
  symbol: string;
  allowDecimals: boolean;
  maxQuantity: number;
}

export const UNITS: Record<Unit, UnitDefinition> = {
  PIECE: {
    code: "PIECE",
    name: "Piece",
    symbol: "pcs",
    allowDecimals: false,
    maxQuantity: 1_000_000_000,
  },
  KG: {
    code: "KG",
    name: "Kilogram",
    symbol: "kg",
    allowDecimals: true,
    maxQuantity: 1_000_000,
  },
  LITER: {
    code: "LITER",
    name: "Liter",
    symbol: "L",
    allowDecimals: true,
    maxQuantity: 1_000_000,
  },
  METER: {
    code: "METER",
    name: "Meter",
    symbol: "m",
    allowDecimals: true,
    maxQuantity: 1_000_000,
  },
};

export function isValidUnit(unit: string): unit is Unit {
  return unit in UNITS;
}
