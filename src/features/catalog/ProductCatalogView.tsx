import React, { useState, useMemo } from "react";
import type { Product, ProductCategory } from "./types";
import { DEFAULT_CATEGORIES } from "./types";
import { formatMoneyWithCurrency } from "../../core/domain/money";
import { formatQuantity } from "../../core/domain/quantity";
import { UNITS } from "../../core/domain/units";
import { matchesSearch } from "../../core/search/normalize";
import { CatalogToolbar, type StatusFilterOption } from "./CatalogToolbar";
import { ProductFormModal } from "./ProductFormModal";
import { ProductWizard } from "./ProductWizard";
import { ProductDetailDrawer } from "./ProductDetailDrawer";
import { CategoryModal } from "./CategoryModal";
import "./Catalog.css";

export interface ProductCatalogViewProps {
  shopId: string;
  initialProducts?: Product[];
  initialCategories?: ProductCategory[];
  userRole?: "OWNER" | "ATTENDANT";
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onProductChange?: (products: Product[]) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  shopId,
  initialProducts = [],
  initialCategories = DEFAULT_CATEGORIES,
  userRole = "OWNER",
  isLoading = false,
  error = null,
  onRetry,
  onProductChange,
}) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<ProductCategory[]>(initialCategories);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterOption>("ALL");
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  // Modals & Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const isOwner = userRole === "OWNER";

  // Filtered Products using normalized bilingual search (Latin + Ethiopic)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Status Filter
      if (selectedStatus === "ACTIVE" && product.status !== "ACTIVE") return false;
      if (selectedStatus === "ARCHIVED" && product.status !== "ARCHIVED") return false;
      if (
        selectedStatus === "LOW_STOCK" &&
        !(product.lowStockMilli > 0 && product.stockMilli <= product.lowStockMilli)
      ) {
        return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "ALL" && product.category !== selectedCategory) {
        return false;
      }

      // 3. Normalized Bilingual Search
      if (searchQuery.trim()) {
        const matchesName = matchesSearch(product.name, searchQuery);
        const matchesAlt = product.nameAlt ? matchesSearch(product.nameAlt, searchQuery) : false;
        const matchesSku = product.sku ? matchesSearch(product.sku, searchQuery) : false;
        const matchesBarcode = product.barcode
          ? matchesSearch(product.barcode, searchQuery)
          : false;

        if (!matchesName && !matchesAlt && !matchesSku && !matchesBarcode) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  function handleSaveProduct(newProductData: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    if (editingProduct) {
      const updatedList = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...newProductData,
              updatedAt: new Date().toISOString(),
            }
          : p,
      );
      setProducts(updatedList);
      onProductChange?.(updatedList);
      if (selectedProduct?.id === editingProduct.id) {
        setSelectedProduct({ ...selectedProduct, ...newProductData });
      }
      setEditingProduct(null);
    } else {
      const created: Product = {
        ...newProductData,
        id: `prod_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedList = [created, ...products];
      setProducts(updatedList);
      onProductChange?.(updatedList);
    }
  }

  function handleToggleProductStatus(product: Product) {
    const nextStatus: Product["status"] = product.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
    const updatedList = products.map((p) =>
      p.id === product.id ? { ...p, status: nextStatus, updatedAt: new Date().toISOString() } : p,
    );
    setProducts(updatedList);
    onProductChange?.(updatedList);
    if (selectedProduct?.id === product.id) {
      setSelectedProduct({ ...selectedProduct, status: nextStatus });
    }
  }

  function handleSaveCategories(updatedCategories: ProductCategory[]) {
    setCategories(updatedCategories);
  }

  return (
    <div className="product-catalog-container">
      {/* Catalog Header */}
      <div className="catalog-header">
        <div>
          <h1 className="catalog-title">Product Catalog</h1>
          <p className="catalog-subtitle">
            Manage your store's items, packaging variants, prices, and stock thresholds.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <CatalogToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        categories={categories}
        totalCount={products.length}
        filteredCount={filteredProducts.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenCategoryModal={() => setIsCategoryModalOpen(true)}
        density={density}
        onToggleDensity={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
      />

      {/* Context-Sensitive State 1: Loading Skeleton */}
      {isLoading && (
        <div className="catalog-skeleton-wrapper" aria-busy="true" aria-label="Loading products">
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
          <div className="skeleton-row" />
        </div>
      )}

      {/* Context-Sensitive State 2: Safe Error Presentation */}
      {!isLoading && error && (
        <div className="catalog-error-card" role="alert">
          <span className="error-icon">⚠️</span>
          <div>
            <h3 className="error-title">Unable to Load Products</h3>
            <p className="error-copy">{error}</p>
          </div>
          {onRetry && (
            <button type="button" onClick={onRetry} className="btn-secondary">
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Context-Sensitive State 3: Empty State */}
      {!isLoading && !error && filteredProducts.length === 0 && (
        <div className="catalog-empty-card">
          <span className="empty-icon">📦</span>
          <h3 className="empty-title">
            {products.length === 0 ? "No Products in Catalog" : "No Matching Products"}
          </h3>
          <p className="empty-copy">
            {products.length === 0
              ? "Start adding grocery items, wholesale goods, or staple products to your store."
              : "Try adjusting your search terms, category chip, or status filters."}
          </p>
          <div className="empty-actions">
            {products.length === 0 ? (
              <button type="button" onClick={() => setIsWizardOpen(true)} className="btn-primary">
                Launch Product Setup Wizard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ALL");
                  setSelectedStatus("ALL");
                }}
                className="btn-secondary"
              >
                Reset Filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Context-Sensitive State 4: Populated Views */}
      {!isLoading && !error && filteredProducts.length > 0 && (
        <>
          {/* Desktop DataTable (>1024px) */}
          <div className="desktop-table-wrapper">
            <table
              className={`catalog-datatable density-${density}`}
              role="table"
              aria-label="Products table"
            >
              <thead>
                <tr>
                  <th scope="col" className="col-product">
                    Product
                  </th>
                  <th scope="col" className="col-category">
                    Category
                  </th>
                  <th scope="col" className="col-unit">
                    Unit
                  </th>
                  <th scope="col" className="col-price text-right">
                    Price (ETB)
                  </th>
                  {isOwner && (
                    <th scope="col" className="col-cost text-right">
                      Cost (ETB)
                    </th>
                  )}
                  <th scope="col" className="col-stock text-right">
                    Stock
                  </th>
                  <th scope="col" className="col-status text-center">
                    Status
                  </th>
                  <th scope="col" className="col-actions text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => {
                  const unitDef = UNITS[p.unit];
                  const isLow = p.lowStockMilli > 0 && p.stockMilli <= p.lowStockMilli;
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="catalog-table-row"
                    >
                      <td className="col-product">
                        <div className="product-title-cell">
                          <span className="product-name-text">{p.name}</span>
                          {p.nameAlt && (
                            <span className="product-alt-text font-ethiopic">{p.nameAlt}</span>
                          )}
                          {p.sku && <span className="product-sku-tag font-mono">{p.sku}</span>}
                        </div>
                      </td>

                      <td className="col-category">
                        <span className="category-pill">{p.category}</span>
                      </td>

                      <td className="col-unit">
                        <span className="unit-pill">{unitDef.symbol}</span>
                      </td>

                      <td className="col-price text-right font-mono font-bold">
                        {formatMoneyWithCurrency(p.priceSantim)}
                      </td>

                      {isOwner && (
                        <td className="col-cost text-right font-mono">
                          {p.costSantim !== undefined ? formatMoneyWithCurrency(p.costSantim) : "—"}
                        </td>
                      )}

                      <td className="col-stock text-right font-mono">
                        <div className="stock-cell">
                          <span>{formatQuantity(p.stockMilli, p.unit)}</span>
                          {isLow && (
                            <span className="low-stock-dot" title="Low Stock Warning">
                              ⚠️
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="col-status text-center">
                        <span className={`status-badge status-${p.status.toLowerCase()}`}>
                          {p.status}
                        </span>
                      </td>

                      <td className="col-actions text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setEditingProduct(p)}
                          className="btn-table-edit"
                          aria-label={`Edit ${p.name}`}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Stack (<1024px) */}
          <div className="mobile-cards-stack" role="feed" aria-label="Products card feed">
            {filteredProducts.map((p) => {
              const unitDef = UNITS[p.unit];
              const isLow = p.lowStockMilli > 0 && p.stockMilli <= p.lowStockMilli;
              return (
                <div
                  key={p.id}
                  className="mobile-product-card"
                  onClick={() => setSelectedProduct(p)}
                  role="article"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedProduct(p);
                    }
                  }}
                >
                  <div className="card-top-row">
                    <div>
                      <h4 className="card-product-name">{p.name}</h4>
                      {p.nameAlt && <p className="card-product-alt font-ethiopic">{p.nameAlt}</p>}
                    </div>
                    <span className={`status-badge status-${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </div>

                  <div className="card-metrics-row">
                    <div className="card-metric">
                      <span className="metric-label">Price</span>
                      <span className="metric-value font-mono">
                        {formatMoneyWithCurrency(p.priceSantim)}
                      </span>
                    </div>

                    <div className="card-metric">
                      <span className="metric-label">Stock</span>
                      <span className="metric-value font-mono">
                        {formatQuantity(p.stockMilli, p.unit)} {unitDef.symbol}
                      </span>
                      {isLow && <span className="low-stock-text">⚠️ Low</span>}
                    </div>

                    {p.packagings.length > 0 && (
                      <div className="card-metric">
                        <span className="metric-label">Containers</span>
                        <span className="metric-value">{p.packagings.length} forms</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Slide-out Inspector Drawer */}
      {selectedProduct && (
        <ProductDetailDrawer
          product={selectedProduct}
          categories={categories}
          userRole={userRole}
          onClose={() => setSelectedProduct(null)}
          onEdit={(prod) => {
            setSelectedProduct(null);
            setEditingProduct(prod);
          }}
          onToggleStatus={handleToggleProductStatus}
        />
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <ProductFormModal
          shopId={shopId}
          categories={categories}
          userRole={userRole}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <ProductFormModal
          shopId={shopId}
          categories={categories}
          initialProduct={editingProduct}
          userRole={userRole}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProduct}
        />
      )}

      {/* Guided Setup Wizard */}
      {isWizardOpen && (
        <ProductWizard
          shopId={shopId}
          categories={categories}
          userRole={userRole}
          onClose={() => setIsWizardOpen(false)}
          onSaveProduct={handleSaveProduct}
        />
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <CategoryModal
          categories={categories}
          onClose={() => setIsCategoryModalOpen(false)}
          onSaveCategories={handleSaveCategories}
        />
      )}
    </div>
  );
};
