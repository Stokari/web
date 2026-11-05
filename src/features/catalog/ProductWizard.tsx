import React, { useState } from "react";
import type { Unit } from "../../core/domain/units";
import { UNITS } from "../../core/domain/units";
import { parseMoney } from "../../core/domain/money";
import {
  COMMON_PACKAGING_PRESETS,
  calculateOpeningStockMilli,
  formatPackagingDescription,
} from "./packaging";
import type { Packaging, Product, ProductCategory } from "./types";
import { birrToSantim } from "./types";
import "./Catalog.css";

export interface ProductWizardProps {
  shopId: string;
  categories: ProductCategory[];
  userRole?: "OWNER" | "ATTENDANT";
  onClose: () => void;
  onSaveProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

let pkgIdCounter = 0;
function createPkgId(name: string): string {
  pkgIdCounter += 1;
  const slug = name.toLowerCase().replace(/[^a-z0-9]/g, "_");
  return `pkg_${slug}_${pkgIdCounter}`;
}

export const ProductWizard: React.FC<ProductWizardProps> = ({
  shopId,
  categories,
  userRole = "OWNER",
  onClose,
  onSaveProduct,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [name, setName] = useState("");
  const [nameAlt, setNameAlt] = useState("");
  const [sku, setSku] = useState("");
  const [unit, setUnit] = useState<Unit>("PIECE");
  const [category, setCategory] = useState<string>(categories[0]?.slug ?? "general");

  // Step 2: Packaging rules
  const [packagings, setPackagings] = useState<Packaging[]>([]);
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgCount, setNewPkgCount] = useState<number>(12);

  // Step 3: Pricing & Opening Stock
  const [priceBirr, setPriceBirr] = useState("");
  const [costBirr, setCostBirr] = useState("");
  const [lowStockDisplay, setLowStockDisplay] = useState("0");
  const [openingCount, setOpeningCount] = useState<string>("0");
  const [openingPackagingId, setOpeningPackagingId] = useState<string>("base");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isOwner = userRole === "OWNER";

  // Dynamic preview sentence
  const unitDef = UNITS[unit];
  const previewSentence = name.trim()
    ? `You sell "${name.trim()}" by the ${unitDef.name.toLowerCase()} (${unitDef.symbol}).`
    : `Select how you sell this item in your store.`;

  function handleSelectPreset(preset: { label: string; count: number }) {
    if (packagings.length >= 5) {
      setErrorMsg("Maximum 5 packaging options allowed per product.");
      return;
    }
    const alreadyExists = packagings.some(
      (p) => p.name.toLowerCase() === preset.label.toLowerCase(),
    );
    if (alreadyExists) return;

    const newPkg: Packaging = {
      id: createPkgId(preset.label),
      name: preset.label,
      multiplierMilli: preset.count * 1000,
    };
    setPackagings([...packagings, newPkg]);
  }

  function handleAddCustomPackaging(e: React.FormEvent) {
    e.preventDefault();
    if (!newPkgName.trim()) return;
    if (newPkgCount <= 0) return;
    if (packagings.length >= 5) {
      setErrorMsg("Maximum 5 packaging options allowed.");
      return;
    }

    const newPkg: Packaging = {
      id: createPkgId(newPkgName.trim()),
      name: newPkgName.trim(),
      multiplierMilli: Math.round(newPkgCount * 1000),
    };
    setPackagings([...packagings, newPkg]);
    setNewPkgName("");
    setNewPkgCount(12);
  }

  function handleRemovePackaging(id: string) {
    setPackagings(packagings.filter((p) => p.id !== id));
    if (openingPackagingId === id) {
      setOpeningPackagingId("base");
    }
  }

  function handleNextStep1() {
    if (!name.trim()) {
      setErrorMsg("Please enter a product name.");
      return;
    }
    setErrorMsg(null);
    setStep(2);
  }

  function handleNextStep2() {
    setErrorMsg(null);
    setStep(3);
  }

  function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!priceBirr || parseFloat(priceBirr) <= 0) {
      setErrorMsg("Please provide a valid selling price greater than 0.");
      return;
    }

    try {
      const priceSantim = parseMoney(birrToSantim(priceBirr));
      const costSantim = isOwner && costBirr ? parseMoney(birrToSantim(costBirr)) : undefined;
      const lowStockMilli = Math.max(0, Math.round((parseFloat(lowStockDisplay) || 0) * 1000));

      const selectedPkg = packagings.find((p) => p.id === openingPackagingId);
      const openingCountNum = parseFloat(openingCount) || 0;
      const initialStockMilli = calculateOpeningStockMilli(openingCountNum, unit, selectedPkg);

      const productPayload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        shopId,
        name: name.trim(),
        nameAlt: nameAlt.trim() || undefined,
        sku: sku.trim() || undefined,
        unit,
        category,
        priceSantim,
        costSantim,
        stockMilli: initialStockMilli,
        lowStockMilli,
        status: "ACTIVE",
        packagings,
      };

      onSaveProduct(productPayload);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Validation failed";
      setErrorMsg(msg);
    }
  }

  return (
    <div
      className="catalog-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wizard-title"
    >
      <div className="catalog-modal-card wizard-card">
        {/* Header */}
        <div className="catalog-modal-header">
          <div>
            <h2 id="wizard-title" className="catalog-modal-title">
              Product Setup Wizard
            </h2>
            <p className="catalog-modal-subtitle">
              Step {step} of 3:{" "}
              {step === 1 ? "Product & Unit" : step === 2 ? "Bulk Containers" : "Pricing & Stock"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="catalog-modal-close-btn"
            aria-label="Close wizard"
          >
            ✕
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div
          className="wizard-progress-bar"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={3}
        >
          <div className="wizard-progress-fill" style={{ width: `${(step / 3) * 100}%` }} />
        </div>

        {/* Step 1: Unit & Product Info */}
        {step === 1 && (
          <div className="wizard-step-body">
            <div className="form-group">
              <label htmlFor="wizard-product-name" className="form-label">
                Product Name (English) <span className="required-star">*</span>
              </label>
              <input
                id="wizard-product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. White Sugar, Sunflower Oil, Red Lentils"
                className="form-input"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="wizard-product-name-alt" className="form-label">
                Alternative Name (Amharic)
              </label>
              <input
                id="wizard-product-name-alt"
                type="text"
                value={nameAlt}
                onChange={(e) => setNameAlt(e.target.value)}
                placeholder="ስም (ለምሳሌ ነጭ ስኳር)"
                className="form-input font-ethiopic"
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="wizard-sku" className="form-label">
                  SKU / Short Code
                </label>
                <input
                  id="wizard-sku"
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SUG-01"
                  className="form-input font-mono"
                />
              </div>

              <div className="form-group">
                <label htmlFor="wizard-category" className="form-label">
                  Category
                </label>
                <select
                  id="wizard-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name} {cat.nameAlt ? `(${cat.nameAlt})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* "How do you sell it?" Unit Selector Chips */}
            <div className="form-group">
              <span className="form-label">
                How do you sell it? <span className="required-star">*</span>
              </span>
              <div className="unit-chips-grid">
                <button
                  type="button"
                  className={`unit-selection-card ${unit === "PIECE" ? "selected" : ""}`}
                  onClick={() => setUnit("PIECE")}
                >
                  <span className="unit-card-title">Piece (pcs)</span>
                  <span className="unit-card-desc">
                    Sold individually by count. No decimal fractions.
                  </span>
                </button>

                <button
                  type="button"
                  className={`unit-selection-card ${unit === "KG" ? "selected" : ""}`}
                  onClick={() => setUnit("KG")}
                >
                  <span className="unit-card-title">Weight (kg)</span>
                  <span className="unit-card-desc">
                    Sold by kilograms & grams (3 decimals precision).
                  </span>
                </button>

                <button
                  type="button"
                  className={`unit-selection-card ${unit === "LITER" ? "selected" : ""}`}
                  onClick={() => setUnit("LITER")}
                >
                  <span className="unit-card-title">Volume (L)</span>
                  <span className="unit-card-desc">
                    Sold by liters & milliliters (3 decimals precision).
                  </span>
                </button>

                <button
                  type="button"
                  className={`unit-selection-card ${unit === "METER" ? "selected" : ""}`}
                  onClick={() => setUnit("METER")}
                >
                  <span className="unit-card-title">Length (m)</span>
                  <span className="unit-card-desc">
                    Sold by meters & centimeters (3 decimals precision).
                  </span>
                </button>
              </div>
            </div>

            {/* Live Preview Sentence */}
            <div className="wizard-preview-sentence" role="status">
              <span className="preview-icon">ℹ️</span>
              <p>{previewSentence}</p>
            </div>

            {errorMsg && (
              <p className="form-error-alert" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="catalog-modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={handleNextStep1} className="btn-primary">
                Next: Packaging →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Packaging & Bulk Containers */}
        {step === 2 && (
          <div className="wizard-step-body">
            <div className="wizard-step-info">
              <h3 className="section-title">Bulk Containers & Packaging</h3>
              <p className="section-desc">
                Do you buy from suppliers or sell in crates, cartons, or sacks? Define container
                sizes here.
              </p>
            </div>

            {/* Suggested Presets */}
            {COMMON_PACKAGING_PRESETS[unit] && (
              <div className="presets-section">
                <span className="form-label">Quick Suggestions for {unitDef.name}:</span>
                <div className="presets-chips-row">
                  {COMMON_PACKAGING_PRESETS[unit].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      className="preset-chip-btn"
                      onClick={() => handleSelectPreset(preset)}
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Current Added Packagings */}
            <div className="packagings-list-section">
              <span className="form-label">Active Container Rules ({packagings.length}/5):</span>
              {packagings.length === 0 ? (
                <p className="empty-subtext">
                  No container rules added yet. Items will only be tracked in base {unitDef.symbol}.
                </p>
              ) : (
                <div className="packagings-chips-list">
                  {packagings.map((pkg) => (
                    <div key={pkg.id} className="packaging-item-row">
                      <span className="pkg-desc">{formatPackagingDescription(pkg, unit)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePackaging(pkg.id)}
                        className="pkg-remove-btn"
                        aria-label={`Remove ${pkg.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Custom Packaging Input Form */}
            {packagings.length < 5 && (
              <div className="add-packaging-form">
                <span className="form-label">Add Custom Container:</span>
                <div className="custom-pkg-inputs">
                  <input
                    type="text"
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    placeholder="Container label (e.g. Crate, Jerrycan)"
                    className="form-input flex-2"
                  />
                  <div className="pkg-multiplier-input flex-1">
                    <input
                      type="number"
                      step={unit === "PIECE" ? "1" : "0.1"}
                      min="1"
                      value={newPkgCount}
                      onChange={(e) => setNewPkgCount(parseFloat(e.target.value) || 1)}
                      className="form-input"
                    />
                    <span className="unit-suffix">{unitDef.symbol}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustomPackaging}
                    disabled={!newPkgName.trim()}
                    className="btn-secondary shrink-btn"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="form-error-alert" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="catalog-modal-footer">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                ← Back
              </button>
              <button type="button" onClick={handleNextStep2} className="btn-primary">
                Next: Pricing & Stock →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Opening Stock */}
        {step === 3 && (
          <form onSubmit={handleFinish} className="wizard-step-body">
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="wizard-price" className="form-label">
                  Selling Price (ETB) per {unitDef.symbol} <span className="required-star">*</span>
                </label>
                <input
                  id="wizard-price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={priceBirr}
                  onChange={(e) => setPriceBirr(e.target.value)}
                  placeholder="0.00"
                  className="form-input font-mono"
                  required
                />
              </div>

              {isOwner && (
                <div className="form-group">
                  <label htmlFor="wizard-cost" className="form-label">
                    Wholesale Cost (ETB) — Owner Only
                  </label>
                  <input
                    id="wizard-cost"
                    type="number"
                    step="0.01"
                    min="0"
                    value={costBirr}
                    onChange={(e) => setCostBirr(e.target.value)}
                    placeholder="0.00"
                    className="form-input font-mono"
                  />
                </div>
              )}
            </div>

            {/* Opening Inventory */}
            <div className="form-group opening-stock-box">
              <span className="form-label">Opening Inventory (Initial Stock):</span>
              <p className="opening-stock-hint">
                How many units or containers do you currently have on the shelf?
              </p>
              <div className="opening-stock-inputs">
                <input
                  id="wizard-opening-count"
                  type="number"
                  step={unit === "PIECE" && openingPackagingId === "base" ? "1" : "0.01"}
                  min="0"
                  value={openingCount}
                  onChange={(e) => setOpeningCount(e.target.value)}
                  placeholder="0"
                  className="form-input font-mono flex-1"
                />
                <select
                  value={openingPackagingId}
                  onChange={(e) => setOpeningPackagingId(e.target.value)}
                  className="form-select flex-1"
                  aria-label="Opening unit or container"
                >
                  <option value="base">
                    Individual {unitDef.name} ({unitDef.symbol})
                  </option>
                  {packagings.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.multiplierMilli / 1000} {unitDef.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Low stock threshold */}
            <div className="form-group">
              <label htmlFor="wizard-low-stock" className="form-label">
                Low Stock Alert Level ({unitDef.symbol}):
              </label>
              <input
                id="wizard-low-stock"
                type="number"
                step={unit === "PIECE" ? "1" : "0.01"}
                min="0"
                value={lowStockDisplay}
                onChange={(e) => setLowStockDisplay(e.target.value)}
                placeholder="0"
                className="form-input font-mono"
              />
              <p className="field-hint">
                Alerts when shelf stock falls below this amount. 0 to disable.
              </p>
            </div>

            {errorMsg && (
              <p className="form-error-alert" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="catalog-modal-footer">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary">
                ← Back
              </button>
              <button type="submit" className="btn-primary">
                Save & Add Product
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
