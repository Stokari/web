import { useState } from "react";
import type { ShopSelectorScreenProps } from "./types";
import "./ShopSelectorScreen.css";

export function ShopSelectorScreen({
  shops,
  currentShopId,
  onSelectShop,
  onCreateNewShop,
  userDisplayName,
}: ShopSelectorScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredShops = shops.filter((shop) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return shop.name.toLowerCase().includes(query) || shop.slug.toLowerCase().includes(query);
  });

  return (
    <div className="shop-selector-container">
      <header className="shop-selector-header">
        <div className="shop-selector-header-text">
          <h1>Select Store Workspace</h1>
          <p className="shop-selector-subtitle">
            {userDisplayName ? `Signed in as ${userDisplayName}. ` : ""}
            Choose the store you want to operate in.
          </p>
        </div>

        {onCreateNewShop && (
          <div className="shop-selector-actions">
            <button type="button" className="btn-primary" onClick={onCreateNewShop}>
              <span aria-hidden="true">+</span> Create New Store
            </button>
          </div>
        )}
      </header>

      {shops.length > 3 && (
        <div className="shop-selector-search">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <input
            type="search"
            className="shop-search-input"
            placeholder="Search stores by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search stores"
          />
        </div>
      )}

      {filteredShops.length === 0 ? (
        <div className="empty-state">
          <h3>No stores found</h3>
          <p>
            {searchQuery
              ? `No stores matching "${searchQuery}". Try a different search.`
              : "You do not belong to any active stores."}
          </p>
          {onCreateNewShop && (
            <button
              type="button"
              className="btn-primary"
              onClick={onCreateNewShop}
              style={{ marginTop: "12px" }}
            >
              Create your first store
            </button>
          )}
        </div>
      ) : (
        <div className="shop-grid" role="list">
          {filteredShops.map((shop) => {
            const isCurrent = shop.id === currentShopId;
            const initials = shop.name.slice(0, 2).toUpperCase();

            return (
              <div
                key={shop.id}
                role="listitem"
                className={`shop-card ${isCurrent ? "current" : ""}`}
                onClick={() => onSelectShop(shop.id)}
              >
                <div className="shop-card-header">
                  <div className="shop-title-wrapper">
                    <div className="shop-avatar" aria-hidden="true">
                      {initials}
                    </div>
                    <div>
                      <h2 className="shop-name">{shop.name}</h2>
                      <p className="shop-slug">{shop.slug}</p>
                    </div>
                  </div>

                  <div className="badge-group">
                    <span
                      className={`badge ${
                        shop.role === "OWNER" ? "badge-owner" : "badge-attendant"
                      }`}
                    >
                      {shop.role}
                    </span>

                    {isCurrent && (
                      <span className="badge badge-current">
                        <span className="current-indicator-dot" />
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="shop-meta-list">
                  <div className="shop-meta-item">
                    <span>Currency</span>
                    <span className="meta-value">{shop.currency}</span>
                  </div>

                  {typeof shop.attendantCount === "number" && (
                    <div className="shop-meta-item">
                      <span>Staff</span>
                      <span className="meta-value">
                        {shop.attendantCount}
                        {shop.maxAttendants ? ` / ${shop.maxAttendants}` : ""} attendants
                      </span>
                    </div>
                  )}

                  {shop.status === "CLOSED" && (
                    <div className="shop-meta-item">
                      <span>Status</span>
                      <span className="meta-value" style={{ color: "#ef4444" }}>
                        Closed
                      </span>
                    </div>
                  )}
                </div>

                <div className="shop-card-footer">
                  <button
                    type="button"
                    className="btn-select"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectShop(shop.id);
                    }}
                  >
                    {isCurrent ? "Enter Active Store" : "Switch to Store"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ShopSelectorScreen;
