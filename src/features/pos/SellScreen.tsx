import React, { useEffect, useState } from "react";
import { formatMoney } from "../../core/domain/money";
import { formatQuantity } from "../../core/domain/quantity";
import { getRecentProductIds, recordRecentProduct } from "../../data/recent-products";
import { ProductSearchIndex } from "../catalog/ProductSearchIndex";
import type { Product } from "../catalog/types";
import { QuickFavoritesBar } from "./QuickFavoritesBar";
import { SellScreenMobile } from "./SellScreenMobile";
import type { CartLine, CompletedSale, TenderType } from "./types";
import { calculateLineTotalSantim } from "./types";
import "./Pos.css";

export interface SellScreenProps {
  shopId: string;
  shopName?: string;
  products: Product[];
  onCompleteSale?: (sale: CompletedSale) => void;
  userRole?: "OWNER" | "ATTENDANT";
  forceMobile?: boolean;
}

let saleIdCounter = 0;
function generateSaleId(): string {
  saleIdCounter += 1;
  return `sale_${saleIdCounter}`;
}

export const SellScreen: React.FC<SellScreenProps> = ({
  shopId,
  shopName = "Mercato Store #1",
  products,
  onCompleteSale,
  forceMobile,
}) => {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTender, setSelectedTender] = useState<TenderType>("CASH");
  const [recentProductIds, setRecentProductIds] = useState<string[]>([]);
  const [lastSaleSuccess, setLastSaleSuccess] = useState<CompletedSale | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() => {
    if (forceMobile !== undefined) return forceMobile;
    if (typeof window !== "undefined" && window.innerWidth > 0 && window.innerWidth <= 1024) {
      return true;
    }
    return false;
  });

  // Load recent products from Dexie / IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    void getRecentProductIds(shopId).then((ids) => {
      if (isMounted) setRecentProductIds(ids);
    });

    const handleResize = () => {
      if (typeof window !== "undefined") {
        setIsMobileViewport(window.innerWidth <= 1024);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      isMounted = false;
      window.removeEventListener("resize", handleResize);
    };
  }, [shopId]);

  // In-memory trie search index
  const searchIndex = new ProductSearchIndex(products);
  const filteredProducts = searchQuery.trim()
    ? searchIndex.search(searchQuery, 100)
    : products.filter((p) => p.status === "ACTIVE");

  // Cart operations
  function handleAddToCart(product: Product, quantityMilli = 1000) {
    // Record into recent products
    void recordRecentProduct(shopId, product.id).then((updated) => {
      setRecentProductIds(updated);
    });

    setCart((prevCart) => {
      const existing = prevCart.find((line) => line.productId === product.id);
      if (existing) {
        const nextQty = existing.quantityMilli + quantityMilli;
        return prevCart.map((line) =>
          line.productId === product.id
            ? {
                ...line,
                quantityMilli: nextQty,
                lineTotalSantim: calculateLineTotalSantim(line.unitPriceSantim, nextQty),
              }
            : line,
        );
      }

      const newLine: CartLine = {
        productId: product.id,
        product,
        quantityMilli,
        unitPriceSantim: product.priceSantim,
        lineTotalSantim: calculateLineTotalSantim(product.priceSantim, quantityMilli),
      };
      return [...prevCart, newLine];
    });
  }

  function handleUpdateQuantity(productId: string, nextQtyMilli: number) {
    if (nextQtyMilli <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantityMilli: nextQtyMilli,
              lineTotalSantim: calculateLineTotalSantim(line.unitPriceSantim, nextQtyMilli),
            }
          : line,
      ),
    );
  }

  function handleRemoveFromCart(productId: string) {
    setCart((prevCart) => prevCart.filter((line) => line.productId !== productId));
  }

  function handleClearCart() {
    setCart([]);
  }

  function handleCompleteSale(tender: TenderType) {
    if (cart.length === 0) return;

    const totalSantim = cart.reduce((sum, item) => sum + item.lineTotalSantim, 0);
    const completedSale: CompletedSale = {
      id: generateSaleId(),
      shopId,
      lines: [...cart],
      totalSantim,
      tender,
      createdAt: new Date().toISOString(),
    };

    setLastSaleSuccess(completedSale);
    setCart([]);
    onCompleteSale?.(completedSale);
  }

  // If in mobile layout, render SellScreenMobile
  if (isMobileViewport) {
    return (
      <SellScreenMobile
        shopId={shopId}
        shopName={shopName}
        products={products}
        recentProductIds={recentProductIds}
        cart={cart}
        onAddToCart={handleAddToCart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCompleteSale={handleCompleteSale}
        selectedTender={selectedTender}
        onChangeTender={setSelectedTender}
        lastSaleSuccess={lastSaleSuccess}
      />
    );
  }

  const totalSantim = cart.reduce((sum, item) => sum + item.lineTotalSantim, 0);

  return (
    <div className="sell-screen-root">
      {/* Top Bar */}
      <header className="pos-top-bar" role="banner">
        <div className="pos-store-info">
          <h1 className="pos-store-title">{shopName}</h1>
          <span className="pos-badge-offline">● Offline Ready (No Cloud Lag)</span>
        </div>
      </header>

      {/* Success banner */}
      {lastSaleSuccess && (
        <div
          role="status"
          style={{
            backgroundColor: "#ecfdf5",
            color: "#065f46",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            textAlign: "center",
            borderBottom: "1px solid #a7f3d0",
          }}
        >
          ✓ Sale #{lastSaleSuccess.id.slice(-6)} recorded successfully! (
          {formatMoney(lastSaleSuccess.totalSantim)} ETB via {lastSaleSuccess.tender})
        </div>
      )}

      {/* Quick Favorites Bar */}
      <QuickFavoritesBar
        products={products}
        recentProductIds={recentProductIds}
        onSelectProduct={(p) => handleAddToCart(p)}
      />

      {/* Split Desktop Layout (>1024px) */}
      <main className="pos-split-layout">
        {/* Left Column: Product Search & Catalog Grid */}
        <section className="pos-catalog-pane" aria-label="Product Catalog Selection">
          <div className="pos-search-wrapper">
            <input
              type="text"
              className="pos-search-input"
              placeholder="Search products by name, Amharic (ስኳር), SKU, or barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search catalog products"
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

          <div className="pos-products-grid">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                type="button"
                className="pos-product-card"
                onClick={() => handleAddToCart(p)}
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
        </section>

        {/* Right Column: Ticket / Cart Pane */}
        <aside className="pos-cart-pane" aria-label="Current Sale Ticket">
          <div className="pos-cart-header">
            <h2 className="pos-cart-header-title">Current Ticket ({cart.length})</h2>
            {cart.length > 0 && (
              <button type="button" onClick={handleClearCart} className="pos-cart-clear-link">
                Clear All
              </button>
            )}
          </div>

          <div className="pos-cart-items-scroll">
            {cart.length === 0 ? (
              <div className="pos-cart-empty">
                <span className="pos-cart-empty-icon">🛒</span>
                <p>No items in ticket.</p>
                <small>Tap products or frequent chips on the left to add.</small>
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
                        minWidth: "32px",
                        minHeight: "32px",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() =>
                        handleUpdateQuantity(line.productId, Math.max(0, line.quantityMilli - 1000))
                      }
                      aria-label={`Decrease ${line.product.name}`}
                    >
                      -
                    </button>
                    <span style={{ minWidth: "20px", textAlign: "center", fontWeight: "bold" }}>
                      {line.quantityMilli / 1000}
                    </span>
                    <button
                      type="button"
                      style={{
                        minWidth: "32px",
                        minHeight: "32px",
                        borderRadius: "4px",
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                      onClick={() =>
                        handleUpdateQuantity(line.productId, line.quantityMilli + 1000)
                      }
                      aria-label={`Increase ${line.product.name}`}
                    >
                      +
                    </button>
                    <div className="pos-line-total">{formatMoney(line.lineTotalSantim)} ETB</div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(line.productId)}
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

          <div className="pos-cart-footer">
            <div className="pos-totals-row">
              <span className="pos-total-label">Total to Pay</span>
              <span className="pos-total-amount">{formatMoney(totalSantim)} ETB</span>
            </div>

            {/* Tender Selector */}
            <div className="pos-tenders-grid" role="radiogroup" aria-label="Payment method">
              <button
                type="button"
                className={`pos-tender-btn ${selectedTender === "CASH" ? "active" : ""}`}
                onClick={() => setSelectedTender("CASH")}
                role="radio"
                aria-checked={selectedTender === "CASH"}
              >
                💵 Cash
              </button>
              <button
                type="button"
                className={`pos-tender-btn ${selectedTender === "TELEBIRR" ? "active" : ""}`}
                onClick={() => setSelectedTender("TELEBIRR")}
                role="radio"
                aria-checked={selectedTender === "TELEBIRR"}
              >
                📱 Telebirr
              </button>
              <button
                type="button"
                className={`pos-tender-btn ${selectedTender === "CBE_BIRR" ? "active" : ""}`}
                onClick={() => setSelectedTender("CBE_BIRR")}
                role="radio"
                aria-checked={selectedTender === "CBE_BIRR"}
              >
                🏦 CBE Birr
              </button>
            </div>

            {/* 54px Complete Sale CTA */}
            <button
              type="button"
              className="pos-complete-sale-btn"
              disabled={cart.length === 0}
              onClick={() => handleCompleteSale(selectedTender)}
              aria-label={`Complete Sale for ${formatMoney(totalSantim)} ETB`}
            >
              Complete Sale ({formatMoney(totalSantim)} ETB)
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
};
