import React, { useState } from "react";
import type { Unit } from "../core/domain/units";
import { formatQuantity, parseQuantity, validateQty } from "../core/domain/quantity";
import "./QuantityInput.css";

export interface QuantityInputProps {
  valueMilli: number;
  unit: Unit;
  onChangeMilli: (milli: number) => void;
  minMilli?: number;
  maxMilli?: number;
  disabled?: boolean;
  quickChips?: number[]; // custom array of milli values for quick selection
  label?: string;
  id?: string;
  ariaDescribedby?: string;
}

const DEFAULT_QUICK_CHIPS: Record<Unit, { label: string; milli: number }[]> = {
  PIECE: [
    { label: "+1", milli: 1000 },
    { label: "+2", milli: 2000 },
    { label: "+5", milli: 5000 },
    { label: "+10", milli: 10000 },
    { label: "+25", milli: 25000 },
  ],
  KG: [
    { label: "250g", milli: 250 },
    { label: "500g", milli: 500 },
    { label: "1kg", milli: 1000 },
    { label: "2kg", milli: 2000 },
    { label: "5kg", milli: 5000 },
    { label: "25kg", milli: 25000 },
  ],
  LITER: [
    { label: "250mL", milli: 250 },
    { label: "500mL", milli: 500 },
    { label: "1L", milli: 1000 },
    { label: "2L", milli: 2000 },
    { label: "5L", milli: 5000 },
    { label: "20L", milli: 20000 },
  ],
  METER: [
    { label: "0.5m", milli: 500 },
    { label: "1m", milli: 1000 },
    { label: "2m", milli: 2000 },
    { label: "5m", milli: 5000 },
    { label: "10m", milli: 10000 },
  ],
};

export const QuantityInput: React.FC<QuantityInputProps> = ({
  valueMilli,
  unit,
  onChangeMilli,
  minMilli = 0,
  maxMilli = 1_000_000_000,
  disabled = false,
  quickChips,
  label = "Quantity",
  id = "quantity-input",
  ariaDescribedby,
}) => {
  // Metric sub-unit display mode toggle:
  // KG: 'kg' vs 'g'
  // LITER: 'L' vs 'mL'
  // METER: 'm' vs 'cm'
  const [subUnitMode, setSubUnitMode] = useState<"standard" | "fractional">("standard");
  const [prevProps, setPrevProps] = useState({ valueMilli, unit, subUnitMode });
  const [rawText, setRawText] = useState<string>(() =>
    formatDisplayValue(valueMilli, unit, "standard"),
  );
  const [inputError, setInputError] = useState<string | null>(null);

  // Synchronize internal display text when external props or mode change
  if (
    prevProps.valueMilli !== valueMilli ||
    prevProps.unit !== unit ||
    prevProps.subUnitMode !== subUnitMode
  ) {
    setPrevProps({ valueMilli, unit, subUnitMode });
    setRawText(formatDisplayValue(valueMilli, unit, subUnitMode));
    setInputError(null);
  }

  function getStepSizeMilli(): number {
    if (unit === "PIECE") return 1000;
    if (subUnitMode === "fractional") {
      // Step by 50g, 50mL, 10cm
      return unit === "METER" ? 100 : 50;
    }
    return 1000; // Step by 1 kg/L/m
  }

  function handleIncrement() {
    if (disabled) return;
    const step = getStepSizeMilli();
    const next = Math.min(valueMilli + step, maxMilli);
    if (validateQty(next, unit)) {
      onChangeMilli(next);
    }
  }

  function handleDecrement() {
    if (disabled) return;
    const step = getStepSizeMilli();
    const next = Math.max(valueMilli - step, minMilli);
    if (validateQty(next, unit)) {
      onChangeMilli(next);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setRawText(text);

    if (!text.trim()) {
      onChangeMilli(0);
      setInputError(null);
      return;
    }

    try {
      let parsedMilli: number;
      if (unit === "PIECE") {
        parsedMilli = parseQuantity(text, "PIECE");
      } else if (subUnitMode === "fractional") {
        // e.g. "500" in grams -> 500 milli
        const val = parseFloat(text);
        if (isNaN(val) || val < 0) throw new Error("Invalid fractional quantity");
        parsedMilli = unit === "METER" ? Math.round(val * 10) : Math.round(val);
      } else {
        parsedMilli = parseQuantity(text, unit);
      }

      if (parsedMilli < minMilli) {
        setInputError(`Quantity cannot be less than ${minMilli / 1000}`);
        return;
      }
      if (parsedMilli > maxMilli) {
        setInputError(`Quantity exceeds limit`);
        return;
      }

      setInputError(null);
      onChangeMilli(parsedMilli);
    } catch {
      setInputError(unit === "PIECE" ? "Pieces must be whole numbers" : "Invalid quantity number");
    }
  }

  function handleChipClick(chipMilli: number, isAdditive: boolean) {
    if (disabled) return;
    const targetMilli = isAdditive ? valueMilli + chipMilli : chipMilli;
    const clamped = Math.max(minMilli, Math.min(targetMilli, maxMilli));
    if (validateQty(clamped, unit)) {
      onChangeMilli(clamped);
    }
  }

  const chips =
    quickChips?.map((m) => ({ label: `${m / 1000}`, milli: m })) ?? DEFAULT_QUICK_CHIPS[unit] ?? [];

  const isMetric = unit !== "PIECE";
  const displayUnitSymbol = getDisplaySymbol(unit, subUnitMode);

  return (
    <div className={`quantity-input-root ${disabled ? "disabled" : ""}`}>
      {label && (
        <label htmlFor={id} className="quantity-input-label">
          {label}
        </label>
      )}

      <div className="quantity-stepper-row">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || valueMilli <= minMilli}
          className="quantity-step-btn"
          aria-label={`Decrease ${label}`}
        >
          <span className="step-btn-icon">−</span>
        </button>

        <div className="quantity-field-wrapper">
          <input
            id={id}
            type="text"
            inputMode={unit === "PIECE" ? "numeric" : "decimal"}
            value={rawText}
            onChange={handleTextChange}
            disabled={disabled}
            role="spinbutton"
            aria-valuenow={valueMilli / 1000}
            aria-valuemin={minMilli / 1000}
            aria-valuemax={maxMilli / 1000}
            aria-invalid={inputError !== null}
            aria-describedby={inputError ? `${id}-error` : ariaDescribedby}
            className={`quantity-text-input ${inputError ? "input-error" : ""}`}
          />

          <span className="quantity-unit-badge">{displayUnitSymbol}</span>
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || valueMilli >= maxMilli}
          className="quantity-step-btn"
          aria-label={`Increase ${label}`}
        >
          <span className="step-btn-icon">+</span>
        </button>
      </div>

      {isMetric && (
        <div className="quantity-unit-toggle-row">
          <button
            type="button"
            className={`unit-toggle-btn ${subUnitMode === "standard" ? "active" : ""}`}
            onClick={() => setSubUnitMode("standard")}
          >
            {unit === "KG" ? "Kilograms (kg)" : unit === "LITER" ? "Liters (L)" : "Meters (m)"}
          </button>
          <button
            type="button"
            className={`unit-toggle-btn ${subUnitMode === "fractional" ? "active" : ""}`}
            onClick={() => setSubUnitMode("fractional")}
          >
            {unit === "KG"
              ? "Grams (g)"
              : unit === "LITER"
                ? "Milliliters (mL)"
                : "Centimeters (cm)"}
          </button>
        </div>
      )}

      {chips.length > 0 && (
        <div className="quantity-chips-wrapper" role="group" aria-label="Quick quantity shortcuts">
          {chips.map((chip) => {
            const isAdditive = chip.label.startsWith("+");
            return (
              <button
                key={`${chip.label}-${chip.milli}`}
                type="button"
                className="quantity-chip"
                onClick={() => handleChipClick(chip.milli, isAdditive)}
                disabled={disabled}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      )}

      {inputError && (
        <p id={`${id}-error`} className="quantity-error-msg" role="alert">
          {inputError}
        </p>
      )}
    </div>
  );
};

function formatDisplayValue(milli: number, unit: Unit, mode: "standard" | "fractional"): string {
  if (unit === "PIECE") {
    return Math.floor(milli / 1000).toString();
  }

  if (mode === "fractional") {
    if (unit === "METER") {
      // meters to centimeters: 1 meter = 1000 milli = 100 cm (milli / 10)
      return (milli / 10).toString();
    }
    // kg to grams or L to mL: 1000 milli = 1000 g/mL (exact milli number)
    return milli.toString();
  }

  return formatQuantity(milli, unit);
}

function getDisplaySymbol(unit: Unit, mode: "standard" | "fractional"): string {
  if (unit === "PIECE") return "pcs";
  if (mode === "fractional") {
    if (unit === "KG") return "g";
    if (unit === "LITER") return "mL";
    return "cm";
  }
  if (unit === "KG") return "kg";
  if (unit === "LITER") return "L";
  return "m";
}
