import React, { useState } from "react";
import type { Unit } from "../../core/domain/units";
import { UNITS } from "../../core/domain/units";
import { parseMoney, formatMoney } from "../../core/domain/money";
import { formatQuantity, parseQuantity } from "../../core/domain/quantity";
import { COMMON_PACKAGING_PRESETS, formatPackagingDescription } from "./packaging";
import type { Packaging, Product, ProductCategory } from "./types";
import { ProductFormSchema, birrToSantim } from "./types";
import "./Catalog.css";

export interface ProductFormModalProps {
  shopId: string;
  categories: ProductCategory[];
  initialProduct?: Product;
  userRole?: "OWNER" | "ATTENDANT";
  onClose: () => void;
  onSave: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  shopId,
  categories,
  initialProduct,
  userRole = "OWNER",
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(initialProduct);
  const isOwner = userRole === "OWNER";

  // Form Fields
  const [name, setName] = useState(initialProduct?.name ?? "");
  const [nameAlt, setNameAlt] = useState(initialProduct?.nameAlt ?? "");
  const [sku, setSku] = useState(initialProduct?.sku ?? "");
  const [barcode, setBarcode] = useState(initialProduct?.barcode ?? "");
  const [unit, setUnit] = useState<Unit>(initialProduct?.unit ?? "PIECE");
  const [category, setCategory] = useState(
    initialProduct?.category ?? categories[0]?.slug ?? "general",
  );

  // Price & Cost in Birr decimal display
  const [priceBirr, setPriceBirr] = useState(
    initialProduct ? formatMoney(initialProduct.priceSantim) : "",
  );
  const [costBirr, setCostBirr] = useState(
    initialProduct?.costSantim !== undefined ? formatMoney(initialProduct.costSantim) : "",
  );

  // Low stock threshold
  const [lowStockDisplay, setLowStockDisplay] = useState(
    initialProduct ? formatQuantity(initialProduct.lowStockMilli, initialProduct.unit) : "0",
  );

  // Packagings
  const [packagings, setPackagings] = useState<Packaging[]>(initialProduct?.packagings ?? []);
  const [pkgName, setPkgName] = useState("");
  const [pkgCount, setPkgCount] = useState<number>(12);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unit definition
  const unitDef = UNITS[unit];

  // Live Gross Margin Calculation
  const parsedPrice = parseFloat(priceBirr);
  const parsedCost = parseFloat(costBirr);
  let grossMarginPercent: number | null = null;
  if (!isNaN(parsedPrice) && parsedPrice > 0 && !isNaN(parsedCost) && parsedCost >= 0) {
    grossMarginPercent = Math.round(((parsedPrice - parsedCost) / parsedPrice) * 100);
  }

  // Unit is immutable if editing an existing product that has active inventory
  const isUnitLocked = isEditing && (initialProduct?.stockMilli ?? 0) > 0;

  function handleAddPackaging() {
    if (!pkgName.trim()) return;
    if (pkgCount <= 0) return;
    if (packagings.length >= 5) {
      setErrors((prev) => ({ ...prev, packagings: "Maximum 5 packaging options allowed" }));
      return;
    }

    const newPkg: Packaging = {
      id: `pkg_${Date.now()}_${packagings.length}`,
      name: pkgName.trim(),
      multiplierMilli: Math.round(pkgCount * 1000),
    };
    setPackagings([...packagings, newPkg]);
    setPkgName("");
    setPkgCount(12);
  }

  function handleRemovePackaging(id: string) {
    setPackagings(packagings.filter((p) => p.id !== id));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // 1. Validate & convert prices
      let priceSantim = 0;
      try {
        priceSantim = parseMoney(birrToSantim(priceBirr));
      } catch (err) {
        setErrors((prev) => ({
          ...prev,
          price: err instanceof Error ? err.message : "Invalid price",
        }));
        setIsSubmitting(false);
        return;
      }

      let costSantim: number | undefined = undefined;
      if (isOwner && costBirr.trim()) {
        try {
          costSantim = parseMoney(birrToSantim(costBirr));
        } catch (err) {
          setErrors((prev) => ({
            ...prev,
            cost: err instanceof Error ? err.message : "Invalid cost",
          }));
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Validate & convert low stock threshold
      let lowStockMilli = 0;
      if (lowStockDisplay.trim()) {
        try {
          lowStockMilli = parseQuantity(lowStockDisplay, unit);
        } catch (err) {
          setErrors((prev) => ({
            ...prev,
            lowStock: err instanceof Error ? err.message : "Invalid low stock",
          }));
          setIsSubmitting(false);
          return;
        }
      }

      // 3. Validate against Zod schema
      const formPayload = {
        name,
        nameAlt: nameAlt.trim() || undefined,
        sku: sku.trim() || undefined,
        barcode: barcode.trim() || undefined,
        unit,
        category,
        priceSantim,
        costSantim,
        lowStockMilli,
        packagings,
      };

      const result = ProductFormSchema.safeParse(formPayload);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const field = issue.path[0]?.toString() ?? "general";
          fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        setIsSubmitting(false);
        return;
      }

      // 4. Submit product
      const productToSave: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
        shopId,
        name: result.data.name,
        nameAlt: result.data.nameAlt,
        sku: result.data.sku,
        barcode: result.data.barcode,
        unit: result.data.unit,
        category: result.data.category,
        priceSantim: result.data.priceSantim,
        costSantim: result.data.costSantim,
        stockMilli: initialProduct?.stockMilli ?? 0,
        lowStockMilli: result.data.lowStockMilli,
        status: initialProduct?.status ?? "ACTIVE",
        packagings: result.data.packagings,
      };

      onSave(productToSave);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="catalog-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="catalog-modal-card">
        <div className="catalog-modal-header">
          <div>
            <h2 id="modal-title" className="catalog-modal-title">
              {isEditing ? "Edit Product" : "Add Product"}
            </h2>
            <p className="catalog-modal-subtitle">
              {isEditing
                ? "Update product specifications and pricing"
                : "Enter product details for the store catalog"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="catalog-modal-close-btn"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="catalog-modal-body">
          <div className="form-group">
            <label htmlFor="prod-name-input" className="form-label">
              Product Name (English) <span className="required-star">*</span>
            </label>
            <input
              id="prod-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. White Sugar"
              className={`form-input ${errors.name ? "input-error" : ""}`}
              required
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="field-error" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="prod-name-alt-input" className="form-label">
              Alternative Name (Amharic)
            </label>
            <input
              id="prod-name-alt-input"
              type="text"
              value={nameAlt}
              onChange={(e) => setNameAlt(e.target.value)}
              placeholder="ስም (ለምሳሌ ነጭ ስኳር)"
              className="form-input font-ethiopic"
              maxLength={120}
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-sku-input" className="form-label">
                SKU
              </label>
              <input
                id="prod-sku-input"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. SUG-001"
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-barcode-input" className="form-label">
                Barcode
              </label>
              <input
                id="prod-barcode-input"
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="e.g. 6001234567890"
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-category-select" className="form-label">
                Category <span className="required-star">*</span>
              </label>
              <select
                id="prod-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name} {c.nameAlt ? `(${c.nameAlt})` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prod-unit-select" className="form-label">
                Unit of Measure <span className="required-star">*</span>
              </label>
              <select
                id="prod-unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value as Unit)}
                disabled={isUnitLocked}
                className="form-select"
              >
                <option value="PIECE">Piece (pcs) — Whole counted</option>
                <option value="KG">Kilogram (kg) — 3 decimals</option>
                <option value="LITER">Liter (L) — 3 decimals</option>
                <option value="METER">Meter (m) — 3 decimals</option>
              </select>
              {isUnitLocked && (
                <p className="field-hint">Unit cannot be changed once stock exists.</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-low-stock-input" className="form-label">
              Low Stock Alert ({unitDef.symbol})
            </label>
            <input
              id="prod-low-stock-input"
              type="number"
              step={unit === "PIECE" ? "1" : "0.01"}
              min="0"
              value={lowStockDisplay}
              onChange={(e) => setLowStockDisplay(e.target.value)}
              placeholder="0"
              className={`form-input font-mono ${errors.lowStock ? "input-error" : ""}`}
            />
            {errors.lowStock && (
              <p className="field-error" role="alert">
                {errors.lowStock}
              </p>
            )}
          </div>

          {/* Pricing Row */}
          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-price-input" className="form-label">
                Selling Price (ETB) <span className="required-star">*</span>
              </label>
              <input
                id="prod-price-input"
                type="number"
                step="0.01"
                min="0.01"
                value={priceBirr}
                onChange={(e) => setPriceBirr(e.target.value)}
                placeholder="0.00"
                className={`form-input font-mono ${errors.price ? "input-error" : ""}`}
                required
              />
              {errors.price && (
                <p className="field-error" role="alert">
                  {errors.price}
                </p>
              )}
            </div>

            {isOwner && (
              <div className="form-group">
                <label htmlFor="prod-cost-input" className="form-label">
                  Wholesale Cost (ETB) — Owner Only
                </label>
                <input
                  id="prod-cost-input"
                  type="number"
                  step="0.01"
                  min="0"
                  value={costBirr}
                  onChange={(e) => setCostBirr(e.target.value)}
                  placeholder="0.00"
                  className={`form-input font-mono ${errors.cost ? "input-error" : ""}`}
                />
                {errors.cost && (
                  <p className="field-error" role="alert">
                    {errors.cost}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Live Gross Margin Display (Owner Only) */}
          {isOwner && grossMarginPercent !== null && (
            <div className="margin-calculator-box">
              <span className="margin-label">Gross Margin:</span>
              <span
                className={`margin-value ${
                  grossMarginPercent >= 20
                    ? "margin-healthy"
                    : grossMarginPercent >= 0
                      ? "margin-low"
                      : "margin-negative"
                }`}
              >
                {grossMarginPercent}%
              </span>
              {grossMarginPercent < 0 && (
                <span className="margin-warning">⚠️ Warning: Selling price is below cost!</span>
              )}
            </div>
          )}

          {/* Packaging Definition Section */}
          <div className="packaging-section">
            <div className="packaging-header-row">
              <span className="form-label">Packaging / Bulk Containers (Optional)</span>
              {COMMON_PACKAGING_PRESETS[unit] && (
                <div className="quick-presets-chips">
                  {COMMON_PACKAGING_PRESETS[unit].slice(0, 2).map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      className="preset-btn"
                      onClick={() => {
                        if (packagings.length < 5) {
                          setPackagings([
                            ...packagings,
                            {
                              id: `pkg_${Date.now()}`,
                              name: p.label,
                              multiplierMilli: p.count * 1000,
                            },
                          ]);
                        }
                      }}
                    >
                      + {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {packagings.length > 0 && (
              <div className="active-packagings-list">
                {packagings.map((pkg) => (
                  <div key={pkg.id} className="active-packaging-pill">
                    <span>{formatPackagingDescription(pkg, unit)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePackaging(pkg.id)}
                      className="pill-remove-btn"
                      aria-label={`Remove ${pkg.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {packagings.length < 5 && (
              <div className="add-pkg-row">
                <input
                  type="text"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  placeholder="Container name (e.g. Crate)"
                  className="form-input flex-2"
                />
                <input
                  type="number"
                  min="1"
                  step={unit === "PIECE" ? "1" : "0.1"}
                  value={pkgCount}
                  onChange={(e) => setPkgCount(parseFloat(e.target.value) || 1)}
                  className="form-input font-mono flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddPackaging}
                  disabled={!pkgName.trim()}
                  className="btn-secondary"
                >
                  Add Container
                </button>
              </div>
            )}
          </div>

          <div className="catalog-modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
