import React, { useState } from "react";
import { formatMoney } from "../../core/domain/money";
import { formatQuantity } from "../../core/domain/quantity";
import { ProductSearchIndex } from "../catalog/ProductSearchIndex";
import type { Product } from "../catalog/types";
import { QuickFavoritesBar } from "./QuickFavoritesBar";
import type { CartLine, CompletedSale, TenderType } from "./types";
import "./Pos.css";

export interface SellScreenMobileProps {
  shopId: string;
  shopName?: string;
  products: Product[];
  recentProductIds?: string[];
  cart: CartLine[];
  onAddToCart: (product: Product, quantityMilli?: number) => void;
  onUpdateQuantity: (productId: string, nextQtyMilli: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onCompleteSale: (tender: TenderType) => void;
  selectedTender?: TenderType;
  onChangeTender?: (tender: TenderType) => void;
  lastSaleSuccess?: CompletedSale | null;
}

export const SellScreenMobile: React.FC<SellScreenMobileProps> = ({
  shopName = "Stokari Store",
  products,
  recentProductIds = [],
  cart,
  onAddToCart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCompleteSale,
  selectedTender,
  onChangeTender,
  lastSaleSuccess,
}) => {
  const [mobileTab, setMobileTab] = useState<"catalog" | "cart">("catalog");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTender, setCurrentTender] = useState<TenderType>(selectedTender ?? "CASH");

  function handleSelectTender(t: TenderType) {
    setCurrentTender(t);
    onChangeTender?.(t);
  }

  const searchIndex = new ProductSearchIndex(products);
  const filteredProducts = searchQuery.trim()
    ? searchIndex.search(searchQuery, 100)
    : products.filter((p) => p.status === "ACTIVE");

  const totalSantim = cart.reduce((sum, item) => sum + item.lineTotalSantim, 0);
  const totalItemsCount = cart.reduce(
    (sum, item) => sum + Math.round(item.quantityMilli / 1000),
    0,
  );

  function handleQuickTapProduct(product: Product) {
    onAddToCart(product);
  }

  return (
    <div
      className="sell-screen-mobile-root"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      {/* Mobile Header */}
      <header className="pos-top-bar" role="banner">
        <div className="pos-store-info">
          <h1 className="pos-store-title">{shopName}</h1>
          <span className="pos-badge-offline" aria-label="Offline Mode Active">
            ● Offline Ready (No Cloud Lag)
          </span>
        </div>
      </header>

      {/* Success Notification */}
      {lastSaleSuccess && (
        <div
          role="status"
          style={{
            backgroundColor: "#ecfdf5",
            color: "#065f46",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "center",
            borderBottom: "1px solid #a7f3d0",
          }}
        >
          ✓ Sale #{lastSaleSuccess.id.slice(-6)} completed (
          {formatMoney(lastSaleSuccess.totalSantim)} ETB)
        </div>
      )}

      {/* Mobile Segmented Tab (Catalog vs Cart) */}
      <div className="pos-mobile-segmented-bar" role="tablist" aria-label="POS Views">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "catalog"}
          className={`pos-segment-btn ${mobileTab === "catalog" ? "active" : ""}`}
          onClick={() => setMobileTab("catalog")}
        >
          Items ({products.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "cart"}
          className={`pos-segment-btn ${mobileTab === "cart" ? "active" : ""}`}
          onClick={() => setMobileTab("cart")}
        >
          Cart ({totalItemsCount}) • {formatMoney(totalSantim)} ETB
        </button>
      </div>

      {/* Tab 1: Catalog Screen */}
      {mobileTab === "catalog" && (
        <div
          className="pos-catalog-pane"
          style={{
            flex: 1,
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {/* Quick Staple Chips */}
          <QuickFavoritesBar
            products={products}
            recentProductIds={recentProductIds}
            onSelectProduct={handleQuickTapProduct}
          />

          {/* Search Header */}
          <div className="pos-search-wrapper">
            <input
              type="text"
              className="pos-search-input"
              placeholder="Search staples, name, barcode, Amharic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products in mobile POS"
            />
            {searchQuery && (
              <button
                type="button"
                className="pos-clear-btn"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Products List/Grid */}
          <div
            className="pos-products-grid"
            style={{ gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}
          >
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                className="pos-product-card"
                onClick={() => handleQuickTapProduct(p)}
                aria-label={`Add ${p.name} to cart`}
              >
                <div className="pos-card-header">
                  <div>
                    <h3 className="pos-card-title">{p.name}</h3>
                    {p.nameAlt && <p className="pos-card-title-alt font-ethiopic">{p.nameAlt}</p>}
                  </div>
                </div>
                <div className="pos-card-footer">
                  <span className="pos-card-price">{formatMoney(p.priceSantim)} ETB</span>
                  <span className="pos-card-unit">/{p.unit.toLowerCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Cart Screen */}
      {mobileTab === "cart" && (
        <div
          className="pos-cart-pane"
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <div className="pos-cart-header">
            <h2 className="pos-cart-header-title">Current Ticket ({cart.length})</h2>
            {cart.length > 0 && (
              <button type="button" onClick={onClearCart} className="pos-cart-clear-link">
                Clear All
              </button>
            )}
          </div>

          <div className="pos-cart-items-scroll">
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <span className="pos-cart-empty-icon">🛒</span>
                <p>Your cart is empty.</p>
                <small>Tap products from the catalog tab to begin sale.</small>
              </div>
            ) : (
              cart.map((line) => (
                <div key={line.productId} className="pos-cart-line-item">
                  <div className="pos-line-info">
                    <div className="pos-line-name">{line.product.name}</div>
                    <div className="pos-line-math">
                      {formatQuantity(line.quantityMilli, line.product.unit)} ×{" "}
                      {formatMoney(line.unitPriceSantim)} ETB
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      type="button"
                      style={{
                        minWidth: "36px",
                        minHeight: "36px",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() =>
                        onUpdateQuantity(line.productId, Math.max(0, line.quantityMilli - 1000))
                      }
                      aria-label={`Decrease ${line.product.name}`}
                    >
                      -
                    </button>
                    <span style={{ minWidth: "24px", textAlign: "center", fontWeight: "bold" }}>
                      {line.quantityMilli / 1000}
                    </span>
                    <button
                      type="button"
                      style={{
                        minWidth: "36px",
                        minHeight: "36px",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() => onUpdateQuantity(line.productId, line.quantityMilli + 1000)}
                      aria-label={`Increase ${line.product.name}`}
                    >
                      +
                    </button>
                    <div className="pos-line-total">{formatMoney(line.lineTotalSantim)} ETB</div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromCart(line.productId)}
                      className="pos-line-remove-btn"
                      aria-label={`Remove ${line.product.name}`}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Payment Selector */}
          <div className="pos-cart-footer">
            <div className="pos-totals-row">
              <span className="pos-total-label">Total to Pay</span>
              <span className="pos-total-amount">{formatMoney(totalSantim)} ETB</span>
            </div>

            {/* 3-Tender Payment Buttons */}
            <div className="pos-tenders-grid" role="radiogroup" aria-label="Payment method">
              <button
                type="button"
                className={`pos-tender-btn ${currentTender === "CASH" ? "active" : ""}`}
                onClick={() => handleSelectTender("CASH")}
                role="radio"
                aria-checked={currentTender === "CASH"}
              >
                💵 Cash
              </button>
              <button
                type="button"
                className={`pos-tender-btn ${currentTender === "TELEBIRR" ? "active" : ""}`}
                onClick={() => handleSelectTender("TELEBIRR")}
                role="radio"
                aria-checked={currentTender === "TELEBIRR"}
              >
                📱 Telebirr
              </button>
              <button
                type="button"
                className={`pos-tender-btn ${currentTender === "CBE_BIRR" ? "active" : ""}`}
                onClick={() => handleSelectTender("CBE_BIRR")}
                role="radio"
                aria-checked={currentTender === "CBE_BIRR"}
              >
                🏦 CBE Birr
              </button>
            </div>

            {/* 54px Thumb Checkout CTA */}
            <button
              type="button"
              className="pos-complete-sale-btn"
              disabled={cart.length === 0}
              onClick={() => onCompleteSale(currentTender)}
              aria-label={`Charge ${formatMoney(totalSantim)} ETB`}
            >
              Complete Sale ({formatMoney(totalSantim)} ETB)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
