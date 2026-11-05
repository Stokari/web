import React from "react";
import type { Product, ProductCategory } from "./types";
import { formatMoneyWithCurrency } from "../../core/domain/money";
import { formatQuantity } from "../../core/domain/quantity";
import { UNITS } from "../../core/domain/units";
import { formatPackagingDescription } from "./packaging";
import "./Catalog.css";

export interface ProductDetailDrawerProps {
  product: Product;
  categories: ProductCategory[];
  userRole?: "OWNER" | "ATTENDANT";
  onClose: () => void;
  onEdit: (product: Product) => void;
  onToggleStatus?: (product: Product) => void;
}

export const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({
  product,
  categories,
  userRole = "OWNER",
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  const isOwner = userRole === "OWNER";
  const unitDef = UNITS[product.unit];
  const category = categories.find((c) => c.slug === product.category);

  const isLowStock = product.lowStockMilli > 0 && product.stockMilli <= product.lowStockMilli;

  // Margin calculation
  let grossMargin: number | null = null;
  if (isOwner && product.costSantim !== undefined && product.priceSantim > 0) {
    grossMargin = Math.round(
      ((product.priceSantim - product.costSantim) / product.priceSantim) * 100,
    );
  }

  return (
    <div className="drawer-overlay" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
      <div className="drawer-panel" tabIndex={-1}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <div className="drawer-badge-row">
              <span className="unit-badge">
                {unitDef.name} ({unitDef.symbol})
              </span>
              <span className={`status-badge status-${product.status.toLowerCase()}`}>
                {product.status}
              </span>
              {isLowStock && <span className="warning-badge">⚠️ Low Stock</span>}
            </div>
            <h2 id="drawer-title" className="drawer-title">
              {product.name}
            </h2>
            {product.nameAlt && <p className="drawer-subtitle font-ethiopic">{product.nameAlt}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="drawer-close-btn"
            aria-label="Close inspector"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {/* Main Key Metrics Grid */}
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Selling Price</span>
              <span className="metric-value font-mono">
                {formatMoneyWithCurrency(product.priceSantim)}
              </span>
              <span className="metric-subtext">per {unitDef.symbol}</span>
            </div>

            {isOwner && (
              <div className="metric-card">
                <span className="metric-label">Wholesale Cost</span>
                <span className="metric-value font-mono">
                  {product.costSantim !== undefined
                    ? formatMoneyWithCurrency(product.costSantim)
                    : "—"}
                </span>
                {grossMargin !== null && (
                  <span
                    className={`metric-subtext ${grossMargin >= 20 ? "text-success" : "text-amber"}`}
                  >
                    Margin: {grossMargin}%
                  </span>
                )}
              </div>
            )}

            <div className="metric-card">
              <span className="metric-label">On Hand Stock</span>
              <span className="metric-value font-mono">
                {formatQuantity(product.stockMilli, product.unit)}
              </span>
              <span className="metric-subtext">{unitDef.symbol} available</span>
            </div>

            <div className="metric-card">
              <span className="metric-label">Low Stock Threshold</span>
              <span className="metric-value font-mono">
                {product.lowStockMilli > 0
                  ? formatQuantity(product.lowStockMilli, product.unit)
                  : "Off"}
              </span>
              <span className="metric-subtext">{unitDef.symbol} alert level</span>
            </div>
          </div>

          {/* Details List */}
          <div className="drawer-section">
            <h3 className="section-title">Product Details</h3>
            <div className="details-list">
              <div className="detail-row">
                <span className="detail-key">Category</span>
                <span className="detail-val">
                  {category ? `${category.name} (${category.slug})` : product.category}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-key">SKU Code</span>
                <span className="detail-val font-mono">{product.sku ?? "—"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Barcode</span>
                <span className="detail-val font-mono">{product.barcode ?? "—"}</span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Unit Precision</span>
                <span className="detail-val">
                  {unitDef.allowDecimals ? "Fractional (3 decimals)" : "Whole numbers only"}
                </span>
              </div>
            </div>
          </div>

          {/* Packaging Configurations */}
          <div className="drawer-section">
            <h3 className="section-title">Packaging & Containers</h3>
            {product.packagings.length === 0 ? (
              <p className="empty-subtext">No container rules configured for this item.</p>
            ) : (
              <div className="drawer-packaging-list">
                {product.packagings.map((pkg) => (
                  <div key={pkg.id} className="drawer-packaging-item">
                    <span className="pkg-name">{pkg.name}</span>
                    <span className="pkg-rule font-mono">
                      {formatPackagingDescription(pkg, product.unit)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Actions Footer */}
        <div className="drawer-footer">
          {onToggleStatus && (
            <button type="button" onClick={() => onToggleStatus(product)} className="btn-secondary">
              {product.status === "ACTIVE" ? "Archive Product" : "Activate Product"}
            </button>
          )}
          <button type="button" onClick={() => onEdit(product)} className="btn-primary">
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};
