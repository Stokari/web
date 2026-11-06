import { useState } from "react";
import { AuthProvider } from "./features/auth/AuthContext";
import { RequireAuth } from "./features/auth/RequireAuth";
import { LeaseStatusBanner } from "./features/auth/LeaseStatusBanner";
import { useAuth } from "./features/auth/useAuth";
import { ShopSelectorScreen } from "./features/shops/ShopSelectorScreen";
import { CreateShopWizard, type CreateShopInput } from "./features/onboarding/CreateShopWizard";
import { AcceptInviteScreen, type InviteDetails } from "./features/onboarding/AcceptInviteScreen";
import { StaffScreen } from "./features/staff/StaffScreen";
import { StorageGauge } from "./features/settings/StorageGauge";
import { ProductCatalogView } from "./features/catalog/ProductCatalogView";
import { DEFAULT_CATEGORIES, type Product } from "./features/catalog/types";
import { SellScreen } from "./features/pos/SellScreen";
import { I18nProvider } from "./i18n";
import { LanguageSelector } from "./i18n/LanguageSelector";
import type { ShopMembership } from "./features/shops/types";
import type { StaffMember } from "./features/staff/types";
import type { AuthUser, OfflineLease } from "./session/types";
import "./App.css";

const INITIAL_SHOPS: ShopMembership[] = [
  {
    id: "shop-mercato-01",
    name: "Mercato Central Wholesale",
    slug: "mercato-central",
    role: "OWNER",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 2,
    maxAttendants: 5,
  },
  {
    id: "shop-bole-02",
    name: "Bole Medhanialem Mart",
    slug: "bole-medhanialem",
    role: "ATTENDANT",
    status: "ACTIVE",
    currency: "ETB",
    attendantCount: 1,
    maxAttendants: 5,
  },
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: "mem_owner",
    name: "Amanuel",
    email: "owner@stokari.com",
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "mem_attendant_1",
    name: "Dawit Tadesse",
    email: "dawit@stokari.com",
    role: "ATTENDANT",
    status: "ACTIVE",
    activeLeaseRemainingDays: 6,
    joinedAt: "2026-10-05T00:00:00Z",
  },
  {
    id: "mem_attendant_2",
    name: "Hana Kebede",
    email: "hana@stokari.com",
    role: "ATTENDANT",
    status: "ACTIVE",
    activeLeaseRemainingDays: 3,
    joinedAt: "2026-10-10T00:00:00Z",
  },
];

const MOCK_INVITE: InviteDetails = {
  token: "inv_mercato_demo",
  shopName: "Mercato Central Wholesale",
  inviterName: "Amanuel",
  currentAttendants: 2,
  maxAttendants: 5,
  expiresInHours: 48,
};

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "prod_sugar",
    shopId: "shop-mercato-01",
    name: "White Sugar",
    nameAlt: "ነጭ ስኳር",
    sku: "SUG-01",
    unit: "KG",
    category: "grains",
    priceSantim: 12500,
    costSantim: 9500,
    stockMilli: 85000,
    lowStockMilli: 20000,
    status: "ACTIVE",
    packagings: [{ id: "pkg_sugar_sack", name: "Sack (25 kg)", multiplierMilli: 25000 }],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_oil",
    shopId: "shop-mercato-01",
    name: "Sunflower Cooking Oil",
    nameAlt: "የሱፍ ዘይት",
    sku: "OIL-02",
    unit: "LITER",
    category: "oils",
    priceSantim: 18000,
    costSantim: 14500,
    stockMilli: 12000,
    lowStockMilli: 15000,
    status: "ACTIVE",
    packagings: [{ id: "pkg_oil_jerrycan", name: "Jerrycan (20 L)", multiplierMilli: 20000 }],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_coffee",
    shopId: "shop-mercato-01",
    name: "Yirgacheffe Coffee",
    nameAlt: "ይርጋጨፌ ቡና",
    sku: "COF-03",
    unit: "PIECE",
    category: "beverages",
    priceSantim: 32000,
    costSantim: 28000,
    stockMilli: 40000,
    lowStockMilli: 10000,
    status: "ACTIVE",
    packagings: [{ id: "pkg_coffee_carton", name: "Carton of 12", multiplierMilli: 12000 }],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_salt",
    shopId: "shop-mercato-01",
    name: "Table Salt",
    nameAlt: "የገበታ ጨው",
    sku: "SLT-04",
    unit: "PIECE",
    category: "spices",
    priceSantim: 2500,
    costSantim: 1800,
    stockMilli: 25000,
    lowStockMilli: 5000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

function MainAppShell() {
  const { user, lease, logout } = useAuth();
  const [shops, setShops] = useState<ShopMembership[]>(INITIAL_SHOPS);
  const [currentShopId, setCurrentShopId] = useState<string>("shop-mercato-01");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeView, setActiveView] = useState<
    "store" | "selector" | "create" | "staff" | "invite" | "settings" | "products" | "pos"
  >("selector");

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

  const handleAcceptInvite = (token: string, attendantName: string) => {
    alert(`Accepted invite ${token} for ${attendantName}! Joined ${MOCK_INVITE.shopName}.`);
    setActiveView("store");
  };

  return (
    <div className="stokari-app">
      <LeaseStatusBanner lease={lease} />

      <nav className="stokari-top-nav">
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-name">Stokari</span>
          <span className="brand-badge">POS &amp; Inventory</span>
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

          <div className="nav-tabs">
            <button
              type="button"
              className={`nav-tab-btn ${activeView === "store" ? "active" : ""}`}
              onClick={() => setActiveView("store")}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeView === "pos" ? "active" : ""}`}
              onClick={() => setActiveView("pos")}
            >
              Sell (POS)
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeView === "products" ? "active" : ""}`}
              onClick={() => setActiveView("products")}
            >
              Products
            </button>
            <button
              type="button"
              className={`nav-tab-btn ${activeView === "selector" ? "active" : ""}`}
              onClick={() => setActiveView("selector")}
            >
              Stores
            </button>
            {currentShop?.role === "OWNER" && (
              <button
                type="button"
                className={`nav-tab-btn ${activeView === "staff" ? "active" : ""}`}
                onClick={() => setActiveView("staff")}
              >
                Staff
              </button>
            )}
            <button
              type="button"
              className={`nav-tab-btn ${activeView === "settings" ? "active" : ""}`}
              onClick={() => setActiveView("settings")}
            >
              Storage
            </button>
          </div>

          <LanguageSelector />

          <button
            type="button"
            className="btn-nav-switch"
            onClick={() => void logout()}
            title={`Signed in as ${user?.email}`}
          >
            Sign Out
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

        {activeView === "invite" && (
          <AcceptInviteScreen
            invite={MOCK_INVITE}
            onAccept={handleAcceptInvite}
            onDecline={() => setActiveView("selector")}
            defaultUserName={user?.name}
          />
        )}

        {activeView === "selector" && (
          <ShopSelectorScreen
            shops={shops}
            currentShopId={currentShopId}
            onSelectShop={handleSelectShop}
            onCreateNewShop={() => setActiveView("create")}
            userDisplayName={user?.name ?? "Merchant"}
          />
        )}

        {activeView === "staff" && currentShop && (
          <StaffScreen
            shopName={currentShop.name}
            initialMembers={INITIAL_STAFF}
            maxAttendants={5}
          />
        )}

        {activeView === "pos" && currentShop && (
          <SellScreen
            shopId={currentShop.id}
            shopName={currentShop.name}
            products={products}
            userRole={currentShop.role}
          />
        )}

        {activeView === "products" && currentShop && (
          <ProductCatalogView
            shopId={currentShop.id}
            userRole={currentShop.role}
            initialProducts={products}
            initialCategories={DEFAULT_CATEGORIES}
            onProductChange={setProducts}
          />
        )}

        {activeView === "settings" && (
          <div style={{ maxWidth: "720px", margin: "40px auto", padding: "0 24px" }}>
            <StorageGauge />
          </div>
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
                    Active (7 days)
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "24px" }}>
                <StorageGauge />
              </div>

              <div className="dashboard-actions">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveView("products")}
                >
                  Products Catalog ({products.length})
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveView("selector")}
                >
                  Change Store
                </button>
                {currentShop.role === "OWNER" && (
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setActiveView("staff")}
                  >
                    Manage Staff
                  </button>
                )}
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setActiveView("invite")}
                >
                  Simulate Redeem Invite
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const DEFAULT_TEST_USER: AuthUser = {
  id: "usr_amanuel_01",
  email: "amanuel@stokari.com",
  name: "Amanuel",
  role: "OWNER",
  shopId: "shop-mercato-01",
  membershipId: "mem_01",
  deviceId: "dev_01",
};

const DEFAULT_TEST_LEASE: OfflineLease = {
  leaseId: "lease_active_01",
  membershipId: "mem_01",
  shopId: "shop-mercato-01",
  role: "OWNER",
  deviceId: "dev_01",
  allowedOps: ["*"],
  issuedAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
};

export function App() {
  return (
    <I18nProvider>
      <AuthProvider initialUser={DEFAULT_TEST_USER} initialLease={DEFAULT_TEST_LEASE}>
        <RequireAuth>
          <MainAppShell />
        </RequireAuth>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
