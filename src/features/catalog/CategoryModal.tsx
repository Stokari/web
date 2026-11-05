import React, { useState } from "react";
import type { ProductCategory } from "./types";
import "./Catalog.css";

export interface CategoryModalProps {
  categories: ProductCategory[];
  onClose: () => void;
  onSaveCategories: (updatedCategories: ProductCategory[]) => void;
}

const PRESET_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6b7280"];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  categories,
  onClose,
  onSaveCategories,
}) => {
  const [list, setList] = useState<ProductCategory[]>(categories);
  const [name, setName] = useState("");
  const [nameAlt, setNameAlt] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleAddOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg("Category name is required.");
      return;
    }

    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    if (editingId) {
      setList(
        list.map((c) =>
          c.id === editingId
            ? { ...c, name: trimmed, nameAlt: nameAlt.trim() || undefined, color }
            : c,
        ),
      );
      setEditingId(null);
    } else {
      const exists = list.some(
        (c) => c.slug === slug || c.name.toLowerCase() === trimmed.toLowerCase(),
      );
      if (exists) {
        setErrorMsg("A category with this name already exists.");
        return;
      }

      const newCategory: ProductCategory = {
        id: `cat_${Date.now()}`,
        name: trimmed,
        slug,
        nameAlt: nameAlt.trim() || undefined,
        color,
      };
      setList([...list, newCategory]);
    }

    setName("");
    setNameAlt("");
    setColor(PRESET_COLORS[0]);
  }

  function handleStartEdit(category: ProductCategory) {
    setEditingId(category.id);
    setName(category.name);
    setNameAlt(category.nameAlt ?? "");
    setColor(category.color ?? PRESET_COLORS[0]);
    setErrorMsg(null);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
    setNameAlt("");
    setColor(PRESET_COLORS[0]);
    setErrorMsg(null);
  }

  function handleDelete(id: string) {
    setList(list.filter((c) => c.id !== id));
    if (editingId === id) {
      handleCancelEdit();
    }
  }

  function handleSaveAndClose() {
    onSaveCategories(list);
    onClose();
  }

  return (
    <div
      className="catalog-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-modal-title"
    >
      <div className="catalog-modal-card">
        <div className="catalog-modal-header">
          <div>
            <h2 id="cat-modal-title" className="catalog-modal-title">
              Store Categories
            </h2>
            <p className="catalog-modal-subtitle">Organize your store's inventory taxonomy</p>
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

        <div className="catalog-modal-body">
          {/* Category List */}
          <div className="category-items-list" role="list" aria-label="Category list">
            {list.map((cat) => (
              <div key={cat.id} className="category-item-card" role="listitem">
                <div className="category-item-left">
                  <span
                    className="category-dot"
                    style={{ backgroundColor: cat.color ?? "#3b82f6" }}
                  />
                  <div>
                    <span className="category-item-name">{cat.name}</span>
                    {cat.nameAlt && (
                      <span className="category-item-alt font-ethiopic">{cat.nameAlt}</span>
                    )}
                  </div>
                </div>

                <div className="category-item-actions">
                  <button
                    type="button"
                    onClick={() => handleStartEdit(cat)}
                    className="btn-icon"
                    aria-label={`Edit ${cat.name}`}
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="btn-icon delete-icon"
                    aria-label={`Delete ${cat.name}`}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit Form */}
          <form onSubmit={handleAddOrUpdate} className="category-form-section">
            <h3 className="section-title">{editingId ? "Edit Category" : "Add New Category"}</h3>

            <div className="form-group">
              <label htmlFor="cat-name-input" className="form-label">
                Category Name (English) <span className="required-star">*</span>
              </label>
              <input
                id="cat-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dairy, Cleaning Supplies"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cat-name-alt-input" className="form-label">
                Alternative Name (Amharic)
              </label>
              <input
                id="cat-name-alt-input"
                type="text"
                value={nameAlt}
                onChange={(e) => setNameAlt(e.target.value)}
                placeholder="የምድብ ስም (ለምሳሌ የወተት ተዋጽኦ)"
                className="form-input font-ethiopic"
              />
            </div>

            <div className="form-group">
              <span className="form-label">Color Tag:</span>
              <div
                className="color-presets-row"
                role="radiogroup"
                aria-label="Category color options"
              >
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-preset-circle ${color === c ? "selected" : ""}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                    aria-label={`Color ${c}`}
                  />
                ))}
              </div>
            </div>

            {errorMsg && (
              <p className="form-error-alert" role="alert">
                {errorMsg}
              </p>
            )}

            <div className="category-form-btns">
              {editingId && (
                <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                  Cancel Edit
                </button>
              )}
              <button type="submit" className="btn-primary">
                {editingId ? "Update Category" : "+ Add Category"}
              </button>
            </div>
          </form>
        </div>

        <div className="catalog-modal-footer">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSaveAndClose} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
