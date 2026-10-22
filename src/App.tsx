import { useState } from "react";
import { ShopSelectorScreen } from "./features/shops/ShopSelectorScreen";
import { CreateShopWizard, type CreateShopInput } from "./features/onboarding/CreateShopWizard";
import type { ShopMembership } from "./features/shops/types";
import "./App.css";

const INITIAL_SHOPS: ShopMembership[] = [
  {
    id: "shop-mercato-01",
    name: "Mercato Central Wholesale",
    slug: "mercato-central",
    role: "OWNER",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 4,
    maxAttendants: 5,
  },
  {
    id: "shop-bole-02",
    name: "Bole Medhanialem Mart",
    slug: "bole-medhanialem",
    role: "ATTENDANT",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 2,
    maxAttendants: 5,
  },
  {
    id: "shop-piassa-03",
    name: "Piassa Hardware Depot",
    slug: "piassa-hardware",
    role: "OWNER",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 1,
    maxAttendants: 5,
  },
];

function App() {
  const [shops, setShops] = useState<ShopMembership[]>(INITIAL_SHOPS);
  const [currentShopId, setCurrentShopId] = useState<string>("shop-mercato-01");
  const [activeView, setActiveView] = useState<"selector" | "create" | "store">("selector");

  const currentShop = shops.find((s) => s.id === currentShopId);

  const handleSelectShop = (shopId: string) => {
    setCurrentShopId(shopId);
    setActiveView("store");
  };

  const handleCreateShop = (input: CreateShopInput) => {
    const newShop: ShopMembership = {
      id: `shop-${Date.now()}`,
      name: input.name,
      slug: input.slug,
      role: "OWNER",
      status: "ACTIVE",
      currency: input.currency,
      attendantCount: 0,
      maxAttendants: 5,
    };
    setShops((prev) => [newShop, ...prev]);
    setCurrentShopId(newShop.id);
    setActiveView("store");
  };

  return (
    <div className="stokari-app">
      <nav className="stokari-top-nav">
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-name">Stokari</span>
          <span className="brand-badge">POS & Inventory</span>
        </div>

        <div className="nav-actions">
          {currentShop && (
            <div className="nav-active-shop">
              <span className="nav-shop-label">Active Store:</span>
              <span className="nav-shop-name">{currentShop.name}</span>
              <span
                className={`badge ${currentShop.role === "OWNER" ? "badge-owner" : "badge-attendant"}`}
              >
                {currentShop.role}
              </span>
            </div>
          )}

          <button
            type="button"
            className="btn-nav-switch"
            onClick={() => setActiveView(activeView === "selector" ? "store" : "selector")}
          >
            {activeView === "selector" && currentShop ? "Return to Store" : "Switch Store"}
          </button>
        </div>
      </nav>

      <main className="stokari-main-content">
        {activeView === "create" && (
          <CreateShopWizard
            onComplete={handleCreateShop}
            onCancel={() => setActiveView("selector")}
          />
        )}

        {activeView === "selector" && (
          <ShopSelectorScreen
            shops={shops}
            currentShopId={currentShopId}
            onSelectShop={handleSelectShop}
            onCreateNewShop={() => setActiveView("create")}
            userDisplayName="Amanuel"
          />
        )}

        {activeView === "store" && currentShop && (
          <div className="store-dashboard-preview">
            <div className="store-dashboard-card">
              <div className="dashboard-header">
                <h2>{currentShop.name}</h2>
                <span className="dashboard-slug">Code: {currentShop.slug}</span>
              </div>
              <p className="dashboard-status">
                Tenancy active. Role: <strong>{currentShop.role}</strong> · Currency:{" "}
                <strong>{currentShop.currency}</strong>
              </p>
              <div className="dashboard-stats-row">
                <div className="stat-card">
                  <span className="stat-label">Attendants</span>
                  <span className="stat-val">
                    {currentShop.attendantCount} / {currentShop.maxAttendants}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Database Partition</span>
                  <span className="stat-val" style={{ color: "#22c55e" }}>
                    IndexedDB Ready
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Offline Lease</span>
                  <span className="stat-val" style={{ color: "#22c55e" }}>
                    Active (29 days)
                  </span>
                </div>
              </div>

              <div className="dashboard-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveView("selector")}
                >
                  Change Store
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
