---
name: Stokari
description: Offline-first retail inventory and point-of-sale interface for small retailers in Ethiopia
theme: light
colors:
  primary: "#1E40AF"
  primary-hover: "#1D4ED8"
  primary-active: "#172554"
  primary-contrast: "#FFFFFF"
  background: "#F8FAFC"
  surface: "#FFFFFF"
  surface-subtle: "#F1F5F9"
  border: "#E2E8F0"
  border-strong: "#CBD5E1"
  text: "#0F172A"
  text-secondary: "#475569"
  text-muted: "#64748B"
  success: "#065F46"
  success-bg: "#ECFDF5"
  success-border: "#A7F3D0"
  success-dot: "#10B981"
  warning: "#92400E"
  warning-bg: "#FFFBEB"
  warning-border: "#FDE68A"
  warning-dot: "#F59E0B"
  danger: "#991B1B"
  danger-bg: "#FEF2F2"
  danger-border: "#FECACA"
  danger-dot: "#EF4444"
  neutral-status: "#334155"
  neutral-status-bg: "#F1F5F9"
  neutral-status-border: "#CBD5E1"
  neutral-status-dot: "#64748B"
typography:
  fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  fontFamilyMono: "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace"
  fontFamilyEthiopic: "'Noto Sans Ethiopic', 'Abyssinica SIL', sans-serif"
  scale:
    display:
      fontSize: "30px"
      fontWeight: "700"
      lineHeight: "1.2"
    heading1:
      fontSize: "20px"
      fontWeight: "600"
      lineHeight: "1.3"
    heading2:
      fontSize: "16px"
      fontWeight: "600"
      lineHeight: "1.4"
    body:
      fontSize: "14px"
      fontWeight: "400"
      lineHeight: "1.5"
    caption:
      fontSize: "12px"
      fontWeight: "500"
      lineHeight: "1.4"
    badge:
      fontSize: "11px"
      fontWeight: "700"
      lineHeight: "1.2"
      textTransform: "uppercase"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
shadows:
  none: "none"
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
  popover: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
---

# Stokari Design System Specification

## 1. Product Identity & Design Rationale

Stokari is an **offline-first retail point-of-sale (POS) and inventory management application** designed for small Ethiopian retailers (neighborhood kiosks, mini-groceries, pharmacies, hardware shops).

The aesthetic is **industrial, utilitarian, and fast**, taking cues from operational software like **Square POS, Linear, Toast, and Stripe Dashboard**. It prioritizes high information density, touch-zone ergonomics, sunlight legibility, and unmistakable visual status.

---

## 2. Anti-AI-Slop Directives (MANDATORY)

Generative UI tools frequently introduce generic tropes that signal low-effort prototyping. **Every prompt and implementation must strictly adhere to the following constraints:**

### ❌ BANNED Tropes (Zero Tolerance)

- **NO Purple/Violet Gradients:** Never generate dark indigo backgrounds with neon violet radial glows, cosmic gradients, or cyberpunk accents.
- **NO Oversized "Bubble" Cards:** Do not use `rounded-3xl` (24px+) or inflated padding on functional containers. Keep radii compact (`4px` to `12px`).
- **NO Gratuitous Glassmorphism:** Never use heavy `backdrop-blur` or semi-transparent cards that degrade text legibility over data. Use solid, high-contrast surfaces (`#FFFFFF` on `#F8FAFC`).
- **NO Meaningless Decorative Elements:** No floating orbs, decorative mesh gradients, sparkles (✨), or 3D clay graphics. Every visual element must serve a business function.
- **NO Marketing Landing Page Formats:** Never output hero headers, testimonial carousels, or slogan banners inside operational application views.
- **NO Low-Density Sprawls:** Cashiers and store owners need to scan rows of items, prices, and stock quickly without excessive vertical scrolling.
- **NO Generic "Dashboard" Cards with Icons:** No "Users: 5" cards with generic user icons. Show real data: "3 attendants · 2 leases expiring · 1 deactivated".
- **NO Centered Empty States with Illustrations:** Empty states are inline, compact, and action-oriented. No floating basket illustrations.

### ✅ Required Aesthetic (Enforced by Component Library)

- **Hairline Dividing Borders:** Clean `1px` borders (`#E2E8F0`) defining cards, list items, and table rows.
- **High-Contrast Text Hierarchy:** Bold Slate 900 (`#0F172A`) for primary numbers and names; Slate 600 (`#475569`) for metadata; Slate 500 (`#64748B`) for muted labels. Muted text meets WCAG AA contrast (≥ 4.5:1 against white).
- **Tabular Monospace Numerals:** Financial figures, quantities, barcodes, and SKUs use monospace font styling for vertical alignment.
- **Thumb-Zone Optimization:** On mobile viewports, primary interactive triggers (Save, Keypad, Payment selection) are anchored in the bottom 40% of the screen.
- **Zero-Decoration Information Density:** Every pixel conveys state. No "breathing room" that wastes vertical space.

---

## 3. Two Distinct UI Paradigms (Role-Based)

Stokari has **fundamentally different interfaces** for the two user types. They share the design system but NOT the layout patterns.

### 3.1 Attendant / Cashier Paradigm: "Notebook-Simple PWA"

**Target:** Users accustomed to paper notebooks. Zero training tolerance.

| Characteristic          | Specification                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| **Navigation**          | Bottom tab bar only (5 tabs: Sell, Products, Stock, Today, More). No sidebar. No drawer menus. |
| **Information Density** | Single-column card flow. One task per screen. No tables.                                       |
| **Primary Action**      | Giant thumb-zone button (54px tall) anchored at bottom.                                        |
| **Typography**          | Larger base size (16px body). High contrast. Minimal metadata.                                 |
| **Color Usage**         | Status colors ONLY for sync state and critical alerts. No decorative color.                    |
| **Interaction**         | Tap = immediate response. No drag, swipe, or multi-step wizards for core flow.                 |
| **Error Handling**      | Inline, contextual. Never modal dialogs for validation errors.                                 |

**Sell Screen Layout (Mobile Only):**

```
┌─────────────────────────────────────────┐
│ Stokari · Shop Name        [🟡 Off·3]  │ ← Sticky header (48px)
├─────────────────────────────────────────┤
│ [🔍 Search products...]                 │
│ Quick: [Sugar] [Rice] [Oil] [Coffee]    │
├─────────────────────────────────────────┤
│ CART                                    │
│  Sugar 1kg          ETB 125.00          │
│  [−]  2  [+]   ×125.00 = ETB 250.00    │
│  Oil 1L             ETB 340.00          │
│  [−]  1  [+]   ×340.00 = ETB 340.00    │
├─────────────────────────────────────────┤
│ Payment:  (●) Cash  ( ) Telebirr ( ) Oth│
├─────────────────────────────────────────┤
│ [ Complete Sale · ETB 590.00 ]          │ ← 54px, full width, sticky
└─────────────────────────────────────────┘
```

### 3.2 Owner / Manager Paradigm: "Enterprise Workstation"

**Target:** Business owners making financial decisions, resolving conflicts, managing staff.

| Characteristic          | Specification                                                                     |
| ----------------------- | --------------------------------------------------------------------------------- |
| **Navigation**          | Fixed left sidebar (240px) + top header. Tabs become sidebar sections.            |
| **Information Density** | High-density tables with sorting, filtering, bulk actions. Multi-column layouts.  |
| **Primary Actions**     | Toolbar buttons (not giant buttons). Keyboard shortcuts.                          |
| **Typography**          | Standard base size (14px). Monospace for all numbers. Compact rows (36px height). |
| **Color Usage**         | Semantic status colors for revenue buckets, stock levels, lease health.           |
| **Interaction**         | Hover states, right-click context menus, keyboard navigation, column resize.      |
| **Error Handling**      | Toast notifications + inline form validation. Modal for destructive actions.      |

**Owner Dashboard Layout (Desktop):**

```
┌──────────────────────┬──────────────────────────────────────┐
│ Sidebar (240px)      │ Header + SyncPill + User Menu        │
│                      ├──────────────────────────────────────┤
│ [Sell]               │ 3-Bucket Revenue Cards (Confirmed/    │
│ [Products]           │ Pending/Review) — full width row      │
│ [Stock]              ├──────────────────────────────────────┤
│ [Today]              │ Valuation Card + Low Stock Table      │
│ [Review] ← badge(2)  │ (sortable, filterable, 12-col dense)  │
│ [Staff]              ├──────────────────────────────────────┤
│ [Settings]           │ Quick Actions: [Receive] [Adjust]     │
│                      │ [Export] [Backup]                     │
└──────────────────────┴──────────────────────────────────────┘
```

---

## 4. Responsive Breakpoints & Layout Architecture

```
320px                    640px                    1024px
  │                        │                        │
  ▼                        ▼                        ▼
Mobile Phone             Compact Tablet          Desktop / Workstation
Single-column card flow  2-column POS till flow  Left sidebar navigation
Bottom tab bar           Split tables             Full multi-column tables
Thumb-reach Save button  Compact modals           Split-pane conflict drawer
```

### 4.1 Mobile Viewports (< 640px) — Attendant Primary

- Viewport width down to **320px** must render without horizontal scrolling.
- Sticky top header with the `SyncPill` status indicator.
- Sticky bottom tab bar (Sell, Products, Stock, Today, More).
- Minimum touch target: **44 × 44 px** (54px for primary action button).
- Sheets slide from bottom for modals (keypad, payment, confirmation).
- No horizontal scrolling tables — use card stacks.

### 4.2 Tablet Viewports (640px – 1023px) — Hybrid

- **Sell Screen:** Split two-column layout (Product search/picker left, Cart + Checkout right).
- **Owner Screens:** Condensed tables with secondary columns collapsed into subtitle text.
- Modals are centered sheets with max-width 480px.
- Sidebar collapses to icon-only rail (48px) with hover/tooltip expansion.

### 4.3 Desktop Viewports (≥ 1024px) — Owner Primary

- Fixed left sidebar navigation (width `240px`, collapsible to 48px icon rail).
- Full tabular views with sorting, filtering, and bulk action toolbars.
- Split-pane conflict drawer (320px right panel) for review workflows.
- Keyboard shortcuts: `Cmd+K` search, `Cmd+S` sync, `Esc` close modal/drawer.

---

## 5. Reusable Component Specifications (Implementation-Ready)

### 5.1 Global Status Pill (`SyncPill`) — Universal Component

**Location:** Top header, right-aligned, always visible.

**States (mutually exclusive):**

| State             | Background | Border    | Text      | Icon | Label Format                |
| ----------------- | ---------- | --------- | --------- | ---- | --------------------------- |
| `synced`          | `#ECFDF5`  | `#A7F3D0` | `#065F46` | 🟢   | `Synced {relativeTime}`     |
| `offline_pending` | `#FFFBEB`  | `#FDE68A` | `#92400E` | 🟡   | `Offline · {count} waiting` |
| `syncing`         | `#F1F5F9`  | `#CBD5E1` | `#334155` | 🔄   | `Syncing…`                  |
| `review_required` | `#FEF2F2`  | `#FECACA` | `#991B1B` | 🔴   | `Review Required ({count})` |
| `local_only`      | `#F1F5F9`  | `#CBD5E1` | `#334155` | 📴   | `Local Only`                |

**Popover (on tap/click):**

- Fixed width 280px, anchored to pill.
- Content: Connection status, last sync (EAT), outbox count, storage used/available, persistent storage status.
- Primary button: "Sync Now" (disabled when syncing).
- Secondary: "View Details" → navigates to Settings > Sync.

### 5.2 Numeric & Currency Formatting (Strict Rules)

```typescript
// Currency (Ethiopian Birr) — ALWAYS
formatCurrency(12500); // "ETB 125.00" — exactly 2 decimals, tabular monospace
formatCurrency(0); // "ETB 0.00"
formatCurrency(-500); // "−ETB 5.00" (minus sign, not dash)

// Quantities — UNIT-AWARE
formatQuantity(3000, "PIECE"); // "3 pcs" (0 decimals)
formatQuantity(12000, "PACK"); // "12 pk" (0 decimals)
formatQuantity(2500, "KG"); // "2.500 kg" (exact 3 decimals)
formatQuantity(750, "LITRE"); // "0.750 L" (exact 3 decimals)
formatQuantity(250, "GRAM"); // "0.250 kg" (stored as KG milli-units)
formatQuantity(-3000, "KG"); // "−3.000 kg" (oversell)

// Confirmed vs Projected — ALWAYS SHOWN TOGETHER WHEN DIFFERENT
// "14.000 kg confirmed" + secondary "(11.000 kg projected)"
```

**CSS Class:** `.tabular-nums { font-variant-numeric: tabular-nums; font-family: var(--font-mono); }`

### 5.3 Form Inputs & Validation States

```css
/* Base Input */
.input {
  height: 42px;
  padding: 0 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  color: #0f172a;
  width: 100%;
  transition:
    border-color 150ms,
    background-color 150ms;
}

/* Focus-Visible (keyboard) */
.input:focus-visible {
  outline: none;
  border: 2px solid #1e40af;
}

/* Invalid / Error */
.input[aria-invalid="true"] {
  border: 2px solid #991b1b;
  background: #fef2f2;
}

/* Label (every input MUST have one) */
.label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  margin-bottom: 4px;
}

/* Error Message */
.error-message {
  font-size: 12px;
  color: #991b1b;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.error-message::before {
  content: "⚠";
}
```

**Quantity Input Specialization:**

- `inputmode="numeric"` for `PIECE`/`PACK` (no decimal key on mobile keypad).
- `inputmode="decimal"` for `KG`/`LITRE`/`GRAM`/`MILLILITRE` (decimal key shown).
- Stepper buttons `[-] [+]` always visible on desktop; on mobile, tap quantity opens bottom sheet keypad.

### 5.4 Buttons (Strict Variants)

| Variant         | Background  | Hover     | Active    | Text      | Border        | Height                     | Radius | Weight |
| --------------- | ----------- | --------- | --------- | --------- | ------------- | -------------------------- | ------ | ------ |
| **Primary**     | `#1E40AF`   | `#1D4ED8` | `#172554` | `#FFFFFF` | none          | 44px (54px mobile primary) | 8px    | 600    |
| **Secondary**   | `#FFFFFF`   | `#F8FAFC` | `#F1F5F9` | `#0F172A` | 1px `#CBD5E1` | 42px                       | 8px    | 500    |
| **Destructive** | `#FEF2F2`   | `#FEE2E2` | `#FECACA` | `#991B1B` | 1px `#FECACA` | 42px                       | 8px    | 500    |
| **Ghost**       | transparent | `#F1F5F9` | `#E2E8F0` | `#1E40AF` | none          | 42px                       | 8px    | 500    |
| **Disabled**    | `#F1F5F9`   | —         | —         | `#94A3B8` | 1px `#E2E8F0` | —                          | 8px    | 500    |

**Icon Buttons:** 40×40px minimum. Icon 20×20px. `aria-label` required.

### 5.5 Status Badges (Never Color Alone)

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  line-height: 1.2;
}

/* Variants — ICON + TEXT MANDATORY */
.badge-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}
.badge-warning {
  background: #fffbeb;
  color: #92400e;
  border: 1px solid #fde68a;
}
.badge-danger {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}
.badge-neutral {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}
.badge-info {
  background: #eff6ff;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}
```

**Sync State Badges (Record-Level):**

| State             | Badge Variant | Icon | Text            |
| ----------------- | ------------- | ---- | --------------- |
| `WAITING_TO_SYNC` | warning       | 🟡   | Waiting to sync |
| `SYNCING`         | info          | 🔄   | Syncing…        |
| `SYNCED`          | success       | 🟢   | Synced          |
| `NEEDS_REVIEW`    | danger        | 🔴   | Needs review    |
| `REJECTED`        | neutral       | ⚪   | Rejected        |

### 5.6 Data Table (Owner/Desktop Only)

```css
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.table th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 1px solid #cbd5e1;
  font-weight: 600;
  color: #475569;
  background: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1;
}
.table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
  vertical-align: middle;
}
.table tbody tr:hover td {
  background: #f8fafc;
}
.table .numeric {
  font-variant-numeric: tabular-nums;
  font-family: var(--font-mono);
}
.table .truncated {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Row Height:** 40px compact / 48px comfortable (user preference in settings).
**Column Resize:** Draggable handles on desktop.

### 5.7 Mobile Card List (Attendant/Mobile)

```css
.card-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}
.card-title {
  font-weight: 600;
  color: #0f172a;
  font-size: 14px;
}
.card-subtitle {
  font-size: 13px;
  color: #475569;
}
.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}
.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}
```

### 5.8 Context-Sensitive Data View States (Every List)

Every data collection view MUST handle these four states explicitly:

1. **Loading Skeleton:** Rectangular pulse animations (`#F1F5F9`) matching exact row heights and card dimensions. **No spinning wheels.**
2. **Actionable Error State:** Solid card with red warning icon, human-friendly explanation, and safe **"Retry"** button.
3. **Empty State:** Bordered box with dashed border (`#CBD5E1`), clear title, descriptive call-to-action text, and primary button.
4. **Populated State:** High-density rows separated by hairline borders (`#E2E8F0`).

---

## 6. Owner-Specific Component Patterns

### 6.1 3-Bucket Revenue Card (Today Dashboard)

```tsx
// Three cards in a row (desktop) / stack (mobile)
interface RevenueBucketProps {
  label: "Confirmed" | "Pending" | "Needs Review";
  amount: number; // santim
  count: number; // transaction count
  variant: "success" | "warning" | "danger";
}
```

**Visual:**

- **Confirmed (Emerald):** `ETB 4,820.00` large / `32 sales` small
- **Pending (Amber):** `ETB 860.00` / `5 sales waiting to sync`
- **Review (Crimson):** `ETB 420.00` / `2 transactions with stock conflict`

**Critical Rule:** Buckets are **mutually exclusive**. A sale appears in exactly ONE bucket. Never sum them.

### 6.2 Inventory Valuation Card (Owner Only)

```tsx
interface ValuationCardProps {
  total: number; // santim
  uncostedCount: number;
  approximateCount: number;
  negativeOrReviewCount: number;
}
```

**Visual:**

- Large: `ETB 84,320.00`
- Helper line: `ℹ️ 4 items have no cost recorded; 1 item approximate.`
- Click "View Details" → opens full valuation table (modal on mobile, drawer on desktop).

### 6.3 Low Stock Warning Card

```tsx
interface LowStockCardProps {
  productName: string;
  productNameAm?: string;
  currentQty: number; // milli-units
  threshold: number; // milli-units
  unit: Unit;
  onRestock: () => void;
}
```

**Visual:** Compact card with product name, current/threshold with unit, "Restock" button (secondary variant).

### 6.4 Conflict Case Card (Review Queue)

```tsx
interface ConflictCaseCardProps {
  caseId: string;
  type:
    | "OFFLINE_OVERSELL"
    | "PRODUCT_INACTIVE"
    | "AUTHORIZATION_REVIEW"
    | "INVALID_STOCK_OPERATION"
    | "CANCELLATION_CONFLICT";
  productName: string;
  productNameAm?: string;
  currentBalance: number; // milli-units (can be negative)
  unit: Unit;
  timeline: ConflictEvent[];
  onResolve: (resolution: Resolution) => void;
}
```

**Timeline Row:** `14:02 · −7.000 kg · SALE · Hana (Register 1)` — monospace numbers, actor name, device.

**Resolution Actions (always these three for OFFLINE_OVERSELL):**

1. **Record Restock** — qty input + note → `RECEIPT` entry
2. **Cancel Sale** — select sale from list → mandatory reason → `SALE_CANCELLATION`
3. **Acknowledge Deficit** — confirmation checkbox → closes case, accepts negative balance

### 6.5 Lease Health Row (Staff Settings)

```tsx
interface LeaseHealthRowProps {
  attendantName: string;
  email: string;
  deviceName: string;
  leaseStatus: "valid" | "expiring" | "expired" | "revoked";
  daysRemaining: number;
  onDeactivate: () => void;
}
```

**Visual:** Row with avatar (initial), name/email, device, lease badge (variant by status), destructive "Deactivate" button.

---

## 7. Attendant-Specific Component Patterns

### 7.1 Product Search & Quick Chips (Sell Screen)

- **Search Input:** Full width, `placeholder="Search name, SKU, or scan barcode..."`, `autoComplete="off"`, `inputMode="search"`.
- **Quick Chips:** Horizontal scroll row of 4-6 frequent products. Tap = add to cart with default qty 1.
- **Recent Products:** Below search, shows last 5 sold items (persisted in `meta.recentProducts`).

### 7.2 Cart Line Item (Sell Screen)

```tsx
interface CartLineProps {
  productName: string;
  productNameAm?: string;
  qtyMilli: number;
  unit: Unit;
  unitPriceSantim: number;
  lineTotalSantim: number;
  onQtyChange: (delta: number) => void; // -1, +1, or keypad result
  onRemove: () => void;
}
```

**Visual:**

- Left: Product name (bold) + unit badge (e.g., "1 kg" / "pcs")
- Center: Stepper `[-] 2 [+]` with current qty
- Right: `× ETB 125.00 = ETB 250.00` (monospace, right-aligned)
- Swipe left to reveal delete (desktop: hover shows trash icon)

### 7.3 Payment Label Selector (Sell Screen)

- **Segmented Control** (not radio buttons): three equal-width segments.
- Options: **Cash** (default) / **Telebirr** / **Other**.
- Selected: Primary background, white text. Unselected: White background, border.
- Full width on mobile, auto-width on desktop.

### 7.4 Quantity Keypad Sheet (Mobile)

- Slides from bottom (40% screen height).
- **Counted Units (PIECE/PACK):** 3×3 numeric grid + backspace + "Done". No decimal key.
- **Measured Units (KG/L/GRAM/ML):** 3×3 numeric + decimal + backspace + "Done".
- Quick chips: `0.25`, `0.5`, `1`, `2`, `5` (from `quickQtyMilli` in unit catalogue).
- Live preview: `2.500 kg × ETB 125.00 = ETB 312.50`
- "Done" = primary button, closes sheet, updates cart.

### 7.5 "Sell Anyway" Alert Sheet (Mobile)

- Triggered when cart qty > projected stock.
- **Message:** `Confirmed stock is 1.000 kg. Selling 2.000 kg will flag this sale for manager review.`
- Buttons: `[Cancel]` (ghost) | `[Sell Anyway]` (destructive variant — red text, red border).
- Never blocks the sale; only warns and flags.

---

## 8. Navigation Architecture

### 8.1 Attendant Navigation (Mobile-First)

**Bottom Tab Bar (Fixed, 56px tall):**

| Tab      | Icon | Label    | Badge      | Screen                              |
| -------- | ---- | -------- | ---------- | ----------------------------------- |
| Sell     | 🛒   | Sell     | —          | POS till                            |
| Products | 📦   | Products | —          | Search/browse (read-only)           |
| Stock    | 📊   | Stock    | low-count  | View stock levels (read-only)       |
| Today    | 📈   | Today    | —          | Dashboard (read-only, no valuation) |
| More     | ⋮    | More     | sync-state | Settings, Sync, Profile, Export     |

**More Screen (Attendant):**

- Sync status detail (same as SyncPill popover)
- Device info, app version
- Export pending records (JSON)
- Sign out

### 8.2 Owner Navigation (Desktop-First)

**Left Sidebar (240px, collapsible to 48px icon rail):**

| Section        | Items                                                      | Badge Source     |
| -------------- | ---------------------------------------------------------- | ---------------- |
| **Operations** | Sell, Products, Stock, Today                               | —                |
| **Management** | Review (conflict count), Staff (attendant count), Settings | Real-time counts |
| **System**     | Sync, Backup, About                                        | —                |

**Responsive Behavior:**

- `< 640px`: Bottom tab bar (same as attendant) + "Owner Tools" tab for Review/Staff/Settings.
- `640–1023px`: Collapsible sidebar (icon rail default, expands on hover).
- `≥ 1024px`: Full sidebar expanded by default.

---

## 9. Modals, Sheets & Drawers

| Pattern                           | Mobile (< 640px)                          | Tablet (640–1023px)          | Desktop (≥ 1024px)           |
| --------------------------------- | ----------------------------------------- | ---------------------------- | ---------------------------- |
| **Confirmation / Simple Form**    | Bottom sheet (90% height, drag handle)    | Centered modal (max-w 480px) | Centered modal (max-w 480px) |
| **Complex Form (Create Product)** | Full-screen sheet (swipe down to dismiss) | Large modal (max-w 640px)    | Large modal (max-w 640px)    |
| **Conflict Review**               | Full-screen sheet                         | Right drawer (320px)         | Right drawer (320px)         |
| **Stock History / Audit**         | Full-screen sheet                         | Right drawer (400px)         | Right drawer (400px)         |
| **Settings Forms**                | Full-screen sheet                         | Modal                        | Modal                        |

**Sheet Handle:** Always visible drag indicator (24×4px, `#CBD5E1`).
**Backdrop:** `rgba(15, 23, 42, 0.4)` — click to dismiss (except destructive actions).

---

## 10. Accessibility & Inclusivity Rules (WCAG 2.1 AA — Non-Negotiable)

1. **Contrast Ratio:** Text contrast ≥ **4.5:1** for standard text, **3:1** for large headings (≥ 18px bold). Muted `#64748B` on `#FFFFFF` = 4.6:1 ✓.
2. **Dual Status Indicators:** Never convey status by color alone. Every badge, indicator, alert MUST combine **icon + explicit text label** (e.g., 🟢 + "Synced").
3. **Mobile Keypad Hints:** Number/quantity inputs declare `inputmode="decimal"` or `inputmode="numeric"`.
4. **Ethiopic Typography:** Native font stack fallback (`Noto Sans Ethiopic`) ensures Ge'ez script renders cleanly alongside Latin without baseline shifting.
5. **Focus Management:** Modals trap focus. Sheets restore focus to trigger on close. Skip links for keyboard users.
6. **Screen Reader:** All status changes announced via `aria-live="polite"`. SyncPill changes = `aria-live="assertive"`.
7. **Touch Targets:** Minimum **44×44px** (54px for primary mobile action). Spacing between adjacent targets ≥ 8px.
8. **Reduced Motion:** Respect `prefers-reduced-motion` — disable pulse animations, slide transitions.

---

## 11. Internationalization (i18n) Structure

```json
// en.json / am.json — flat keys with nested namespaces
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "search": "Search",
    "loading": "Loading…",
    "error": "Something went wrong",
    "retry": "Retry",
    "close": "Close",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "done": "Done"
  },
  "sync": {
    "synced": "Synced {{time}} ago",
    "offline": "Offline · {{count}} waiting",
    "syncing": "Syncing…",
    "reviewRequired": "Review Required ({{count}})",
    "lastSync": "Last synced: {{date}} at {{time}} (EAT)",
    "outboxCount": "{{count}} pending operations",
    "storageUsed": "{{used}} MB / {{total}} GB available",
    "persistentEnabled": "Persistent storage enabled",
    "persistentDisabled": "Persistent storage not granted",
    "syncNow": "Sync Now"
  },
  "sell": {
    "searchPlaceholder": "Search name, SKU, or scan barcode...",
    "cartEmpty": "Cart is empty. Tap a product or scan a barcode to begin.",
    "paymentLabel": "Payment Method",
    "cash": "Cash",
    "telebirr": "Telebirr",
    "other": "Other",
    "completeSale": "Complete Sale · {{amount}}",
    "sellAnywayTitle": "Sell beyond stock?",
    "sellAnywayMessage": "Confirmed stock is {{confirmed}}. Selling {{requested}} will flag this sale for manager review.",
    "sellAnywayCancel": "Cancel",
    "sellAnywayConfirm": "Sell Anyway"
  },
  "stock": {
    "receiveStock": "Receive Stock",
    "adjustStock": "Adjust Stock",
    "quantity": "Quantity",
    "unitCost": "Unit Cost (ETB)",
    "reason": "Reason",
    "reasonDamage": "Damage",
    "reasonLoss": "Loss",
    "reasonCorrection": "Correction",
    "reasonOther": "Other",
    "notes": "Notes",
    "saveReceipt": "Save Stock Receipt",
    "saveAdjustment": "Save Adjustment",
    "history": "Stock History",
    "movement": "{{time}} · {{delta}} {{unit}} · {{type}} · {{actor}}"
  },
  "units": {
    "PIECE": { "symbol": "pc", "symbolAm": "ቁራጭ" },
    "PACK": { "symbol": "pk", "symbolAm": "ፓኬት" },
    "KG": { "symbol": "kg", "symbolAm": "ኪ.ግ" },
    "GRAM": { "symbol": "g", "symbolAm": "ግ" },
    "LITRE": { "symbol": "L", "symbolAm": "ሊ" },
    "MILLILITRE": { "symbol": "mL", "symbolAm": "ሚ.ሊ" }
  },
  "review": {
    "offlineOversell": "Offline Oversell",
    "productInactive": "Product Inactive",
    "authReview": "Authorization Review",
    "invalidStockOp": "Invalid Stock Operation",
    "cancellationConflict": "Cancellation Conflict",
    "resolutionRestock": "Record Restock",
    "resolutionCancelSale": "Cancel Sale",
    "resolutionAcknowledge": "Acknowledge Deficit",
    "quarantined": "Quarantined Operations",
    "accept": "Accept Operation",
    "reject": "Reject Operation"
  },
  "dashboard": {
    "confirmedRevenue": "Confirmed Revenue",
    "pendingRevenue": "Pending on This Device",
    "needsReview": "Needs Owner Review",
    "valuation": "Inventory Valuation",
    "lowStock": "Low Stock Warnings",
    "restock": "Restock",
    "uncostedItems": "{{count}} items have no cost recorded",
    "approximate": "{{count}} items approximate"
  }
}
```

---

## 12. Component API Contracts (For Implementation)

### 12.1 `SyncPill` Component

```tsx
interface SyncPillProps {
  state: "synced" | "offline_pending" | "syncing" | "review_required" | "local_only";
  pendingCount?: number;
  reviewCount?: number;
  lastSyncAt?: string; // ISO timestamp
  onSyncNow: () => void;
  onDetailsClick: () => void;
}
```

### 12.2 `QuantityInput` Component

```tsx
interface QuantityInputProps {
  value: number; // milli-units
  unit: Unit;
  onChange: (value: number) => void;
  min?: number; // default 1
  max?: number; // default 999_999_999
  disabled?: boolean;
  showStepper?: boolean; // default true on desktop
  showQuickChips?: boolean; // default true
}
```

### 12.3 `DataTable` Component (Owner Only)

```tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  sortable?: boolean; // default true
  filterable?: boolean; // default true
  selectable?: boolean; // default false
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
  emptyState?: ReactNode;
  loading?: boolean;
  density?: "compact" | "comfortable"; // user preference
}
```

### 12.4 `RevenueBucket` Component

```tsx
interface RevenueBucketProps {
  variant: "confirmed" | "pending" | "review";
  amount: number; // santim
  count: number;
  label: string;
}
```

### 12.5 `ConflictCaseCard` Component

```tsx
interface ConflictCaseCardProps {
  case: ConflictCase;
  onResolve: (caseId: string, resolution: Resolution) => void;
  onViewDetails: (caseId: string) => void;
}
```

---

## 13. Design Token Reference (CSS Variables)

```css
:root {
  /* Colors */
  --color-primary: #1e40af;
  --color-primary-hover: #1d4ed8;
  --color-primary-active: #172554;
  --color-primary-contrast: #ffffff;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-subtle: #f1f5f9;
  --color-border: #e2e8f0;
  --color-border-strong: #cbd5e1;
  --color-text: #0f172a;
  --color-text-secondary: #475569;
  --color-text-muted: #64748b;
  --color-success: #065f46;
  --color-success-bg: #ecfdf5;
  --color-success-border: #a7f3d0;
  --color-warning: #92400e;
  --color-warning-bg: #fffbeb;
  --color-warning-border: #fde68a;
  --color-danger: #991b1b;
  --color-danger-bg: #fef2f2;
  --color-danger-border: #fecaca;
  --color-neutral: #334155;
  --color-neutral-bg: #f1f5f9;
  --color-neutral-border: #cbd5e1;

  /* Typography */
  --font-family:
    Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
  --font-family-ethiopic: "Noto Sans Ethiopic", "Abyssinica SIL", sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-popover: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Touch Targets */
  --touch-target-min: 44px;
  --touch-target-primary-mobile: 54px;
}
```

---

## 14. Implementation Checklist (Per Screen)

Every screen implementation must pass this checklist before merge:

- [ ] Uses only design tokens (no hardcoded colors, spacing, radii)
- [ ] Implements all 4 data view states (loading, error, empty, populated)
- [ ] Mobile: 320px no horizontal scroll, 44px touch targets, thumb-zone primary action
- [ ] Desktop: Sidebar navigation, full tables, keyboard shortcuts
- [ ] Attendant view: No cost/valuation fields, no owner actions
- [ ] Owner view: Full data density, bulk actions, conflict review
- [ ] SyncPill present and accurate in header
- [ ] Numbers use tabular monospace font
- [ ] Status badges = icon + text (never color alone)
- [ ] Ethiopic text renders without baseline shift
- [ ] `prefers-reduced-motion` respected
- [ ] Focus visible on all interactive elements
- [ ] `aria-live` for sync state changes
- [ ] i18n keys used (no hardcoded strings)
- [ ] Error states have retry action
- [ ] Empty states have primary CTA button
