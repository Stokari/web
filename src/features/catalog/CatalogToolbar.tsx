import React from "react";
import type { ProductCategory, ProductStatus } from "./types";
import "./Catalog.css";

export type StatusFilterOption = "ALL" | ProductStatus | "LOW_STOCK";

export interface CatalogToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string; // 'ALL' or category slug
  onCategoryChange: (categorySlug: string) => void;
  selectedStatus: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  categories: ProductCategory[];
  totalCount: number;
  filteredCount: number;
  onOpenAddModal: () => void;
  onOpenWizard: () => void;
  onOpenCategoryModal: () => void;
  density: "comfortable" | "compact";
  onToggleDensity: () => void;
}

export const CatalogToolbar: React.FC<CatalogToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  categories,
  filteredCount,
  onOpenAddModal,
  onOpenWizard,
  onOpenCategoryModal,
  density,
  onToggleDensity,
}) => {
  return (
    <div className="catalog-toolbar-root">
      {/* Search & Main Actions Row */}
      <div className="toolbar-top-row">
        {/* Search input with Ethiopic homophone folding support */}
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, SKU, or Amharic (ስኳር, ዘይት)..."
            className="catalog-search-input"
            aria-label="Search products"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="search-clear-btn"
              aria-label="Clear search query"
            >
              ✕
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="toolbar-action-group">
          <button
            type="button"
            onClick={onToggleDensity}
            className="btn-toolbar-toggle"
            aria-label="Toggle table row density"
            title="Toggle Row Density"
          >
            {density === "comfortable" ? "Compact View" : "Comfortable View"}
          </button>

          <button type="button" onClick={onOpenCategoryModal} className="btn-secondary">
            Categories
          </button>

          <div className="add-btn-split">
            <button type="button" onClick={onOpenAddModal} className="btn-primary">
              + Add Product
            </button>
            <button
              type="button"
              onClick={onOpenWizard}
              className="btn-primary-alt"
              title="Launch Guided Product Wizard"
            >
              ✨ Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Category Chips Scroll Row */}
      <div className="toolbar-filters-row">
        <div className="category-chips-scroller" role="group" aria-label="Filter by category">
          <button
            type="button"
            className={`filter-chip ${selectedCategory === "ALL" ? "active" : ""}`}
            onClick={() => onCategoryChange("ALL")}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`filter-chip ${selectedCategory === cat.slug ? "active" : ""}`}
              onClick={() => onCategoryChange(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Status Filter & Count Badge */}
        <div className="status-filter-wrapper">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as StatusFilterOption)}
            className="status-select-filter"
            aria-label="Filter by stock status"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="LOW_STOCK">⚠️ Low Stock</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <span className="results-count-pill" aria-live="polite">
            {filteredCount} {filteredCount === 1 ? "product" : "products"}
          </span>
        </div>
      </div>
    </div>
  );
};
