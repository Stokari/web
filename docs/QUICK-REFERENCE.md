# Stokari Quick Reference Card (`docs/QUICK-REFERENCE.md`)

**For:** Frontend Engineers implementing screens
**Use:** Keep open while coding — check before every PR

---

## 🎯 Two UIs, One Design System

|                    | **Attendant (Cashier)**       | **Owner (Manager)**        |
| ------------------ | ----------------------------- | -------------------------- |
| **Primary Device** | Mobile (320–640px)            | Desktop (≥1024px)          |
| **Navigation**     | Bottom Tab Bar (5 tabs)       | Left Sidebar (collapsible) |
| **Density**        | Single-column cards           | Multi-column tables        |
| **Primary Action** | 54px sticky footer button     | Toolbar buttons            |
| **Data Access**    | Read-only (no cost/valuation) | Full CRUD + conflicts      |
| **SyncPill**       | Top header                    | Top header                 |

---

## 🎨 Color Tokens (CSS Variables)

```css
/* Surfaces */
--color-background: #f8fafc; /* Page bg */
--color-surface: #ffffff; /* Cards, modals */
--color-surface-subtle: #f1f5f9; /* Hover, disabled */

/* Borders */
--color-border: #e2e8f0; /* Hairline (1px) */
--color-border-strong: #cbd5e1; /* Focus, selected */

/* Text */
--color-text: #0f172a; /* Primary (4.5:1) */
--color-text-secondary: #475569; /* Metadata */
--color-text-muted: #64748b; /* Muted (4.6:1) */

/* Semantic */
--color-success: #065f46; /* Confirmed, positive */
--color-warning: #92400e; /* Pending, expiring */
--color-danger: #991b1b; /* Review, negative, destructive */
--color-primary: #1e40af; /* Primary actions */
```

---

## 📐 Spacing & Sizing

| Token                           | Value | Use                          |
| ------------------------------- | ----- | ---------------------------- |
| `--space-xs`                    | 4px   | Icon gaps, badge padding     |
| `--space-sm`                    | 8px   | Standard gap, card padding   |
| `--space-md`                    | 16px  | Section gaps, modal padding  |
| `--space-lg`                    | 24px  | Page margins, large gaps     |
| `--touch-target-min`            | 44px  | **Minimum** touch target     |
| `--touch-target-primary-mobile` | 54px  | Primary mobile button height |
| `--radius-sm`                   | 4px   | Badges, chips                |
| `--radius-md`                   | 8px   | Inputs, buttons, cards       |
| `--radius-lg`                   | 12px  | Modals, sheets               |

---

## 🔤 Typography Scale

| Class           | Size | Weight | Line | Use              |
| --------------- | ---- | ------ | ---- | ---------------- |
| `.heading1`     | 20px | 600    | 1.3  | Screen titles    |
| `.heading2`     | 16px | 600    | 1.4  | Section headers  |
| `.body`         | 14px | 400    | 1.5  | Default text     |
| `.caption`      | 12px | 500    | 1.4  | Labels, metadata |
| `.badge`        | 11px | 700    | 1.2  | Status badges    |
| `.tabular-nums` | —    | —      | —    | **All numbers**  |

**Font Stack:** `Inter` → system fallbacks → `JetBrains Mono` (numbers) → `Noto Sans Ethiopic` (Amharic)

---

## ⚡ Component Checklist (Every Screen)

- [ ] **4 Data States:** Loading skeleton / Error + Retry / Empty + CTA / Populated
- [ ] **Responsive:** 320px / 640px / 1024px breakpoints work
- [ ] **Role Gates:** Attendant never sees cost/valuation/owner actions
- [ ] **SyncPill:** Present in header, accurate state
- [ ] **Numbers:** `.tabular-nums` + `font-mono` on ALL quantities, prices, totals
- [ ] **Badges:** Icon + Text (never color alone)
- [ ] **Focus Visible:** 2px primary border on all interactive
- [ ] **i18n Keys:** No hardcoded strings
- [ ] **Reduced Motion:** Pulse animations disabled
- [ ] **Ethiopic:** No baseline shift, proper font fallback

---

## 🧩 Reusable Components (Import Paths)

```tsx
// Design System
import { Button, Input, Badge, Card, Modal, Sheet, Drawer } from "@/ui";
import { SyncPill, QuantityInput, CurrencyInput, UnitSelect } from "@/ui/specialized";
import { DataTable, ProductCard, RevenueBucket, ConflictCaseCard } from "@/ui/composite";
import { StockLevelDisplay, PaymentSelector, QuantityKeypadSheet, SellAnywaySheet } from "@/ui/pos";

// Hooks
import { useSync, useSession, useProducts, useStock, useReview } from "@/features/*/hooks";
```

---

## 📱 Mobile-First Patterns

### Sell Screen (Attendant Primary)

```
Header (48px) → Sticky
  Shop Name | SyncPill
Search + Quick Chips
Cart (scrollable)
  Line: Name | Stepper | × Price = Total
Payment Selector (segmented)
Sticky Footer (54px)
  [ Complete Sale · ETB XXX.XX ]  ← Primary, full-width
```

### QuantityKeypadSheet (40vh, drag handle)

```
Handle
Header: Product Name + Unit | Live Total
Keypad: Numeric (counted) / Decimal (measured) + Quick Chips
Footer: [Cancel] [Done] ← Primary
```

### SellAnywaySheet (Alert)

```
⚠️ Sell beyond stock?
Confirmed: 1.000 kg | Requested: 2.000 kg
Will flag for manager review.
[Cancel] [Sell Anyway] ← Destructive variant
```

---

## 🖥️ Desktop Patterns (Owner)

### Sidebar (240px → 48px icon rail)

```
Operations:    Sell | Products | Stock | Today
Management:    Review (2) | Staff (3) | Settings
System:        Sync | Backup | About
```

### DataTable (Owner Screens)

```
Sticky Header (th) | Hairline borders | 40px rows
Sortable columns | Filter toolbar | Bulk actions on select
Numeric: tabular-nums, right-align
```

### Split-Pane (Review, History)

```
List (320px) | Drawer (480px)
Virtualized | Scrollable detail
```

---

## 💰 Formatting Rules (Zero Exceptions)

```typescript
// Currency — ALWAYS 2 decimals, ETB prefix
formatCurrency(12500)    → "ETB 125.00"
formatCurrency(-500)     → "−ETB 5.00"  (minus sign!)

// Quantities — UNIT AWARE
formatQty(3000, 'PIECE')  → "3 pcs"
formatQty(2500, 'KG')     → "2.500 kg"   (exact 3 decimals)
formatQty(-3000, 'KG')    → "−3.000 kg"  (oversell)

// Confirmed vs Projected — SHOWN TOGETHER WHEN DIFFERENT
"14.000 kg confirmed" + secondary "(11.000 kg projected)"
```

---

## 🔄 SyncPill States (Header, Right)

| State             | BG        | Border    | Text      | Icon | Label                 |
| ----------------- | --------- | --------- | --------- | ---- | --------------------- |
| `synced`          | `#ECFDF5` | `#A7F3D0` | `#065F46` | 🟢   | `Synced 2m ago`       |
| `offline_pending` | `#FFFBEB` | `#FDE68A` | `#92400E` | 🟡   | `Offline · 3 waiting` |
| `syncing`         | `#F1F5F9` | `#CBD5E1` | `#334155` | 🔄   | `Syncing…`            |
| `review_required` | `#FEF2F2` | `#FECACA` | `#991B1B` | 🔴   | `Review Required (1)` |
| `local_only`      | `#F1F5F9` | `#CBD5E1` | `#334155` | 📴   | `Local Only`          |

**Popover:** Last sync (EAT), outbox count, storage, persistent status, [Sync Now] button.

---

## 🏷️ Status Badges (Record-Level)

| State             | Variant | Icon | Text            |
| ----------------- | ------- | ---- | --------------- |
| `WAITING_TO_SYNC` | Warning | 🟡   | Waiting to sync |
| `SYNCING`         | Info    | 🔄   | Syncing…        |
| `SYNCED`          | Success | 🟢   | Synced          |
| `NEEDS_REVIEW`    | Danger  | 🔴   | Needs review    |
| `REJECTED`        | Neutral | ⚪   | Rejected        |

**Conflict Types:** `OFFLINE_OVERSELL` (Danger), `AUTHORIZATION_REVIEW` (Warning), `PRODUCT_INACTIVE` (Neutral), `INVALID_STOCK_OPERATION` (Danger), `CANCELLATION_CONFLICT` (Danger)

---

## 🚫 BANNED (Zero Tolerance)

- ❌ Purple/violet gradients
- ❌ `rounded-3xl` (24px+) on functional containers
- ❌ Glassmorphism / `backdrop-blur`
- ❌ Decorative illustrations (orbs, sparkles, 3D clay)
- ❌ Marketing hero sections in app views
- ❌ Low-density card sprawls
- ❌ Centered empty states with illustrations
- ❌ Generic "dashboard cards" with icons
- ❌ Color-only status indicators
- ❌ Spinners for content loading (use skeletons)

---

## ✅ REQUIRED (Enforced)

- ✅ Hairline borders (`1px #E2E8F0`)
- ✅ Tabular monospace numerals on ALL numbers
- ✅ 44px minimum touch targets (54px primary mobile)
- ✅ Thumb-zone primary actions (bottom 40% mobile)
- ✅ Dual status: Icon + Text (never color alone)
- ✅ Skeleton loading matching exact layout
- ✅ Inline error states with Retry button
- ✅ Compact empty states with CTA button
- ✅ `inputmode="numeric/decimal"` on quantity inputs
- ✅ Amharic font stack fallback

---

## 🔑 Key Flows (Must Work Offline-First)

1. **POS Checkout** — ≤10s, ≤3 taps, atomic Dexie commit before UI success
2. **Offline→Online Sync** — Same `opId` retry, exponential backoff, pull cursor in same TX
3. **Oversell Conflict** — Both sales preserved, case opened, owner resolves (Restock/Cancel/Acknowledge)
4. **Deactivation/Drain** — 403 + drainToken → QUARANTINED (zero StockLog effect) → Owner Accept/Reject
5. **Product Wizard** — "How do you sell it?" → Unit → Preview sentence → Immutable unit
6. **Receive/Adjust** — Packaging live preview, reason enum, atomic StockLog
7. **3-Bucket Dashboard** — Confirmed / Pending / Review (mutually exclusive, never summed)

---

## 🧪 Test Gates (Pre-Merge)

```bash
# Run locally before push
pnpm lint          # ESLint + design token usage
pnpm typecheck     # TypeScript strict
pnpm test          # Vitest (unit) + Playwright (E2E)
pnpm test:visual   # Chromatic / Percy (all 4 states × 3 breakpoints × 2 roles)
```

**Coverage Gates:** 70% overall, 90% on `core/`, `sync/`, `data/`

---

## 📦 Bundle Budgets

| Metric             | Target   |
| ------------------ | -------- |
| Compressed JS      | ≤ 2 MB   |
| 200 Sales Payload  | ≤ 200 KB |
| Initial Paint (3G) | < 3s     |
| TTI (low-end)      | < 4s     |

---

## 🌍 i18n Key Namespaces

```json
{
  "common": { "save", "cancel", "delete", "retry", "close" },
  "sync": { "synced", "offline", "syncing", "reviewRequired", "syncNow" },
  "sell": { "searchPlaceholder", "cartEmpty", "completeSale", "sellAnyway*" },
  "stock": { "receiveStock", "adjustStock", "reason*", "history" },
  "review": { "offlineOversell", "resolution*", "quarantined", "accept", "reject" },
  "dashboard": { "confirmedRevenue", "pendingRevenue", "needsReview", "valuation", "lowStock" },
  "units": { "PIECE": { "symbol", "symbolAm" }, ... }
}
```

---

## 📋 PR Review Checklist

- [ ] No hardcoded colors/spacing (uses design tokens)
- [ ] Attendant view verified: no cost, no valuation, no owner actions
- [ ] Owner view verified: full density, bulk actions, conflict detail
- [ ] Mobile: 320px no horizontal scroll, thumb-zone primary action
- [ ] Desktop: Sidebar, tables, keyboard shortcuts work
- [ ] SyncPill state matches actual sync status
- [ ] Numbers use `.tabular-nums` + `font-mono`
- [ ] Badges = Icon + Text
- [ ] All 4 data states implemented
- [ ] i18n keys used (search for hardcoded strings)
- [ ] Focus visible on all interactive elements
- [ ] Reduced motion respected
- [ ] Ethiopic text renders correctly
- [ ] Visual regression tests pass
