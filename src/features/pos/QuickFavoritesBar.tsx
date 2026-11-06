import React from "react";
import { formatMoney } from "../../core/domain/money";
import type { Product } from "../catalog/types";
import "./Pos.css";

export interface QuickFavoritesBarProps {
  products: Product[];
  recentProductIds?: string[];
  onSelectProduct: (product: Product) => void;
  selectedProductId?: string;
}

const DEFAULT_STAPLE_KEYWORDS = ["sugar", "oil", "coffee", "rice", "salt", "flour"];

export const QuickFavoritesBar: React.FC<QuickFavoritesBarProps> = ({
  products,
  recentProductIds = [],
  onSelectProduct,
  selectedProductId,
}) => {
  // Determine top quick staple chips
  const quickProducts: Product[] = [];
  const addedIds = new Set<string>();

  // 1. Add recent products first
  for (const id of recentProductIds) {
    const found = products.find((p) => p.id === id);
    if (found && !addedIds.has(found.id)) {
      quickProducts.push(found);
      addedIds.add(found.id);
      if (quickProducts.length >= 6) break;
    }
  }

  // 2. If fewer than 6, fill with common staple keywords
  if (quickProducts.length < 6) {
    for (const keyword of DEFAULT_STAPLE_KEYWORDS) {
      const match = products.find(
        (p) =>
          !addedIds.has(p.id) &&
          (p.name.toLowerCase().includes(keyword) ||
            (p.nameAlt && p.nameAlt.toLowerCase().includes(keyword)) ||
            p.category.toLowerCase().includes(keyword)),
      );
      if (match) {
        quickProducts.push(match);
        addedIds.add(match.id);
        if (quickProducts.length >= 6) break;
      }
    }
  }

  // 3. Fallback: if still under 6, add first available active products
  if (quickProducts.length < 6) {
    for (const p of products) {
      if (!addedIds.has(p.id) && p.status === "ACTIVE") {
        quickProducts.push(p);
        addedIds.add(p.id);
        if (quickProducts.length >= 6) break;
      }
    }
  }

  if (quickProducts.length === 0) {
    return null;
  }

  return (
    <div className="quick-favorites-container" aria-label="Frequent staples bar">
      <div
        className="quick-favorites-scroll"
        role="region"
        aria-label="Frequent items horizontal scroll"
      >
        {quickProducts.map((product) => {
          const isSelected = selectedProductId === product.id;
          return (
            <button
              key={product.id}
              type="button"
              className={`quick-favorite-chip ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectProduct(product)}
              aria-label={`Select ${product.name}, ${formatMoney(product.priceSantim)} Birr per ${product.unit}`}
            >
              <div className="chip-content">
                <span className="chip-name">{product.name}</span>
                {product.nameAlt && (
                  <span className="chip-name-alt font-ethiopic">{product.nameAlt}</span>
                )}
              </div>
              <span className="chip-price">
                {formatMoney(product.priceSantim)} <small>ETB</small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
