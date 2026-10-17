# Stokari Screen Specifications & Stitch Prompts (`docs/SCREENS.md`)

**Companion Document to:** [docs/DESIGN.md](file:///home/abelmekonen/Desktop/INSA/backend/docs/DESIGN.md)  
**Target:** Google Stitch, UI Designers, Frontend Engineers

---

## 1. Staged Generation Workflow for Google Stitch

Do not attempt to prompt Stitch to generate all six screens simultaneously. Stitch produces significantly higher quality when screens are generated and refined in **focused stages**:

```text
┌────────────────────────────────────────────────────────┐
│ Stage 1: POS Sell Screen (Establishes till ergonomics) │
├────────────────────────────────────────────────────────┤
│ Stage 2: Product Catalog (Establishes table density)   │
├────────────────────────────────────────────────────────┤
│ Stage 3: Today Dashboard (Establishes financial cards) │
├────────────────────────────────────────────────────────┤
│ Stage 4: Stock Ledger (Establishes audit history)      │
├────────────────────────────────────────────────────────┤
│ Stage 5: Conflict Review (Establishes discrepancy UX)  │
├────────────────────────────────────────────────────────┤
│ Stage 6: Staff & Settings (Establishes settings forms) │
└────────────────────────────────────────────────────────┘
```

1. **Stage 1 (Anchor):** Generate the POS Sell screen first. Refine component tokens (buttons, chips, badges, inputs).
2. **Stage 2:** Generate the Product Catalog screen. Reuse the established tokens and verify table density and mobile card transformations.
3. **Stage 3–6:** Generate remaining screens, applying the design system components established in Stages 1 & 2.

---

## 2. Screen Specifications & Stitch Prompts

---

### Screen 1: The POS Sell / Till Screen (High-Speed Checkout)

**Primary User:** Cashier / Attendant or Owner  
**Goal:** Scan/find items, build cart, select payment label, and complete checkout in **≤ 10 seconds and ≤ 3 taps**.

#### Component Breakdown & Wireframe:

```text
┌────────────────────────────────────────────────────────┐
│ Stokari · Central Kiosk             [🟡 Offline · 3 ]  │
├────────────────────────────────────────────────────────┤
│ [ 🔍 Search name, SKU, or scan barcode...            ] │
│ Quick: [Sugar 1kg] [Rice 2kg] [Sunflower Oil] [Coffee] │
├────────────────────────────────────────────────────────┤
│ CART (2 items)                                         │
│                                                        │
│  White Sugar (1 kg)               ETB 125.00           │
│  [ - ]   1   [ + ]  x 125.00    = ETB 125.00           │
│                                                        │
│  Sunflower Oil (1 Litre)          ETB 340.00           │
│  [ - ]   2   [ + ]  x 170.00    = ETB 340.00           │
├────────────────────────────────────────────────────────┤
│ Payment Method:                                        │
│ (●) Cash      ( ) Telebirr      ( ) Other Label        │
├────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┐ │
│ │  Complete Sale  ·  ETB 465.00                      │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

#### Consistent Sample Data:

- White Sugar (1 kg): Unit Price `ETB 125.00`.
- Sunflower Oil (1 Litre): Unit Price `ETB 170.00` (2 units = `ETB 340.00`).
- Total: `ETB 465.00`.

#### Key UI States:

- **Empty Cart:** Centered illustration of a clean shopping basket, text _"Cart is empty. Tap a product or scan a barcode to begin."_
- **Quantity Keypad Sheet:** Slides from bottom when tapping quantity number; displays numeric keypad with decimal point for weight-based units (`2.750 kg`).
- **"Sell Anyway" Alert Sheet:** Appears when selling items with insufficient local projected stock. Explains: _"Confirmed stock is 1.000 kg. Selling 2.000 kg will flag this sale for manager review."_ Buttons: `[Cancel]` and `[Sell Anyway]`.

#### Copy-Paste Prompt for Google Stitch (Stage 1):

> _"Design a mobile-first Point of Sale (POS) register screen for a retail kiosk in Ethiopia using the Stokari Design System in docs/DESIGN.md. The background is crisp #F8FAFC, with white cards bordered by 1px #E2E8F0. At the top is a header with shop name 'Stokari · Central Kiosk' and an amber status pill '🟡 Offline · 3 waiting'. Below is a clean search input with quick-tap pill buttons for 'Sugar 1kg', 'Rice 2kg', 'Sunflower Oil', and 'Coffee'. The active cart displays 2 items with quantity stepper buttons [- 1 +], unit prices in ETB, and tabular alignment. Above the checkout button is a 3-segment payment label selector for Cash, Telebirr, and Other. Anchored at the bottom is a 54px deep cobalt (#1E40AF) primary button reading 'Complete Sale · ETB 465.00'. High density, tactile, industrial aesthetic. No purple gradients, no 3D illustrations."_

---

### Screen 2: Global Header & The 4-State `SyncPill`

**Primary User:** All users  
**Goal:** Provide continuous, ambient visibility of network connectivity, outbox queue count, and server sync state.

#### Component Breakdown & Popover Mockup:

```text
Header: [ Stokari ]                   [ 🟢 Synced 2m ago ▼ ]

When tapped, opens compact popover:
┌──────────────────────────────────────────────┐
│ Connection & Storage Details                 │
├──────────────────────────────────────────────┤
│ Status: 🟢 Connected to Cloud                │
│ Last Synced: Today at 14:32 (EAT)            │
│ Local Outbox: 0 pending operations           │
│ Local Storage: 14.2 MB used / 2.0 GB avail   │
│ Persistent Storage: Enabled (Safe from disk  │
│                     cleanup pressure)        │
├──────────────────────────────────────────────┤
│ [ 🔄 Sync Now ]         [ Close ]            │
└──────────────────────────────────────────────┘
```

#### States:

- `🟢 Synced`: Background `#ECFDF5`, Text `#065F46`, Icon `🟢`.
- `🟡 Offline · N waiting`: Background `#FFFBEB`, Text `#92400E`, Icon `🟡`.
- `🔄 Syncing…`: Background `#F1F5F9`, Text `#334155`, Icon `🔄`.
- `🔴 Review Required (N)`: Background `#FEF2F2`, Text `#991B1B`, Icon `🔴`.

---

### Screen 3: Master Product Catalog & Search Screen

**Primary User:** Owner (full edit & cost access) or Attendant (browse & search only)  
**Security Note:** Attendant view excludes unit cost and valuation fields. (Enforced server-side per NFR-12; client DOM must not receive cost fields).

#### Desktop View (≥ 1024px) & Tablet View (640px – 1023px):

- Top toolbar: Search input, Category filter dropdown, Status filter (Active/Inactive), `[+ Add Product]` button.
- Multi-column table with hairline borders:
  - Columns: `Product Name`, `SKU / Barcode`, `Category`, `Unit Price (ETB)`, `Cost (Owner)`, `Stock Level`, `Status`, `Actions`.
  - Tablet mode collapses SKU and Category into secondary subtitle text under the Product Name.

#### Mobile View (< 640px):

- Single-column dense card list:
  ```text
  ┌────────────────────────────────────────────────────────┐
  │ White Sugar (1 kg)                          ETB 125.00 │
  │ Grains · SKU-0091 · 60012            14.000 kg in stock│
  │ 🟢 Active                                       [Edit] │
  └────────────────────────────────────────────────────────┘
  ```

#### Add/Edit Product Modal:

- Clean two-column modal on desktop, full-width sheet on mobile.
- Fields: Name (English), Alternative Name (Amharic: ስም), Category, Unit of Measure (`Piece`, `Pack`, `Kg`, `Gram`, `Litre`, `Millilitre`), Price in ETB, Cost in ETB (owner-only), Low Stock Threshold.
- Inline validation errors: `aria-invalid="true"`, red border `#991B1B`, and helper text below.

#### Copy-Paste Prompt for Google Stitch (Stage 2):

> _"Design a high-density Product Catalog screen for Stokari using docs/DESIGN.md. Top toolbar features an input searching both English and Amharic, category filter chips, and a primary blue button '+ Add Product'. Render an 8-column table with hairline borders (#E2E8F0) showing Product Name, SKU, Category, Price in ETB, Cost in ETB, Stock Level with units (e.g. 14.000 kg), and status badge (Active in emerald, Inactive in slate). Include a mobile card variant for <640px. Clean typography with Inter and JetBrains Mono for numbers. Utilitarian, accessible, no decorative purple gradients."_

---

### Screen 4: Stock Ledger & Adjustment Center

**Primary User:** Store Owner  
**Goal:** Track inventory movements, receive supplier stock, record damaged/lost items, and inspect the immutable audit ledger.

#### Component Breakdown:

1. **Stock Overview Header:** Total SKUs tracked, low stock alert count.
2. **"Receive Stock" Modal:** Select Product ➔ Quantity added (`+N`) ➔ Unit purchase cost (updates latest known cost) ➔ Notes ➔ `[Save Stock Receipt]`.
3. **"Adjust Stock" Modal:** Select Product ➔ Signed quantity delta (`-N` or `+N`) ➔ Mandatory Reason Dropdown:
   - `DAMAGE` (Broken / spoiled items)
   - `LOSS` (Theft / unexplained shortage)
   - `CORRECTION` (Counting error)
   - `OTHER` (Requires note)
4. **Movement Audit History Drawer (Slide-out):**
   - Chronological append-only list of movements:
     ```text
     14:30 · +50.000 kg · RECEIPT (Supplier Invoice #104) · by Owner
     14:45 ·  -1.000 kg · SALE (Receipt #41) · by Hana
     15:10 ·  -0.500 kg · ADJUSTMENT (DAMAGE - Spilled) · by Owner
     Resulting Balance: 48.500 kg
     ```

#### Copy-Paste Prompt for Google Stitch (Stage 4):

> _"Design a Stock Management and Audit History screen for Stokari per docs/DESIGN.md. Header shows 'Stock Inventory' with an 'Adjust Stock' button. The main table lists items, units of measure, confirmed stock level, and low stock warnings. On the right is a slide-out audit ledger drawer displaying chronological, immutable stock movements (+50 receipt, -2 sale, -1 damage) with timestamps, actor names, and resulting balance in tabular monospace numbers. Include the modal for 'Adjust Stock' requiring a reason dropdown (DAMAGE, LOSS, CORRECTION, OTHER). Utilitarian, high contrast, industrial style."_

---

### Screen 5: Today Dashboard (The 3-Bucket System)

**Primary User:** Store Owner & Attendants  
**Goal:** Instant operational visibility of today's financial performance and sync status without conflating pending with confirmed revenue.

#### Wireframe:

```text
┌────────────────────────────────────────────────────────┐
│ Today's Activity (EAT)              [🟢 All Synced]    │
├────────────────────────────────────────────────────────┤
│ SALES SUMMARY                                          │
│ ┌──────────────────────┐  ┌──────────────────────────┐ │
│ │ 🟢 CONFIRMED REVENUE │  │ 🟡 PENDING ON THIS DEVICE│ │
│ │ ETB 4,820.00         │  │ ETB 860.00               │ │
│ │ 32 sales completed   │  │ 5 sales waiting to sync  │ │
│ └──────────────────────┘  └──────────────────────────┘ │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 🔴 NEEDS OWNER REVIEW                              │ │
│ │ ETB 420.00 (2 transactions with stock conflict)    │ │
│ └────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ INVENTORY VALUATION (Owner Only)                       │
│ Total Valuation: ETB 84,320.00                         │
│ ℹ️ 4 items have no cost recorded; 1 item approximate.  │
├────────────────────────────────────────────────────────┤
│ ⚠️ LOW STOCK WARNINGS (3 Items)                         │
│ • Sunflower Oil: 2 L left (Threshold: 5)     [Restock] │
│ • Salt 500g: 0 pcs left (Threshold: 10)      [Restock] │
└────────────────────────────────────────────────────────┘
```

#### Copy-Paste Prompt for Google Stitch (Stage 3):

> _"Design a clean, high-density Today Dashboard for Stokari per docs/DESIGN.md. Features the 3-Bucket Financial Summary: Card 1 (Emerald #ECFDF5) for 'Confirmed Revenue: ETB 4,820.00' (32 sales); Card 2 (Amber #FFFBEB) for 'Pending On This Device: ETB 860.00' (5 sales waiting to sync); Card 3 (Crimson #FEF2F2) for 'Needs Owner Review: ETB 420.00' (2 conflicting sales). Below is the Owner Valuation Card showing 'Total Valuation: ETB 84,320.00' with helper note indicating uncosted products. Bottom section displays compact Low Stock Warning cards with Restock action buttons. High contrast, sharp typography, zero AI purple gradients."_

---

### Screen 6: Owner Conflict & Quarantine Review Queue

**Primary User:** Store Owner Only  
**Goal:** Inspect and arbitrate concurrent offline overselling conflicts and quarantined operations from deactivated attendants.

#### Discrepancy Case View:

```text
┌────────────────────────────────────────────────────────┐
│ Case #0191-B7 · OFFLINE OVERSELL                       │
│ Product: White Sugar (1 kg)                            │
├────────────────────────────────────────────────────────┤
│ ⚠️ Discrepancy: Confirmed balance is -3.000 kg         │
│                                                        │
│ CONCURRENT TIMELINE:                                   │
│ • Opening Stock: +10.000 kg                            │
│ • 14:02 (Register 1 / Hana): Sold 7.000 kg             │
│ • 14:05 (Register 2 / Dawit): Sold 6.000 kg            │
│ Resulting Deficit: -3.000 kg                           │
│                                                        │
│ Both sales occurred offline. Customers paid cash and   │
│ received physical merchandise.                         │
├────────────────────────────────────────────────────────┤
│ OWNER RESOLUTION ACTIONS:                              │
│                                                        │
│ [ 📦 Option 1: Record Restock / Found Stock ]          │
│   Add +3.000 kg to reconcile shelf inventory           │
│                                                        │
│ [ ↩️ Option 2: Cancel One Sale ]                        │
│   Requires mandatory reason; reverses stock movement   │
│                                                        │
│ [ 👁️ Option 3: Acknowledge & Keep Deficit ]             │
│   Closes case, accepts deficit for end-of-month audit  │
└────────────────────────────────────────────────────────┘
```

#### Quarantined Operations Tab:

- Table listing operations submitted by deactivated attendants or expired leases.
- Actions: `[Accept Operation]` (applies movements) or `[Reject Operation]` (archives with reason; never deletes).

#### Copy-Paste Prompt for Google Stitch (Stage 5):

> _"Design an Owner Conflict Review interface for Stokari per docs/DESIGN.md. Left side lists active conflict cases with badges ('OFFLINE OVERSELL' in crimson, 'AUTHORIZATION REVIEW' in amber). Main pane displays Case #0191-B7 for 'White Sugar (1 kg)' with a confirmed negative balance of -3.000 kg. Features a vertical timeline showing competing offline transactions from Register 1 (Hana, sold 7 kg) and Register 2 (Dawit, sold 6 kg). Below the timeline are three distinct resolution action cards: Option 1 (Record Restock), Option 2 (Cancel Sale with mandatory reason input), and Option 3 (Acknowledge Deficit). Industrial, clear, high visual hierarchy."_

---

### Screen 7: Staff Management & Device Lease Settings

**Primary User:** Store Owner  
**Goal:** Manage attendants (up to 5), monitor offline lease expiry, and provide emergency unconfirmed data export.

#### Wireframe:

```text
┌────────────────────────────────────────────────────────┐
│ Staff & Device Settings                                │
├────────────────────────────────────────────────────────┤
│ ACTIVE ATTENDANTS (2 of 5 slots used)   [+ Invite New] │
│                                                        │
│ • Hana Bekele (Attendant)                              │
│   hana@gmail.com · Device: Pixel 4a                    │
│   Lease: 🟢 Valid (5 days remaining)      [Deactivate] │
│                                                        │
│ • Dawit Tadesse (Attendant)                            │
│   dawit@gmail.com · Device: Galaxy A12                 │
│   Lease: 🟢 Valid (3 days remaining)      [Deactivate] │
├────────────────────────────────────────────────────────┤
│ OFFLINE STORAGE & LEASE HEALTH                         │
│ Storage: 14.2 MB used of 2.1 GB available              │
│ Persistent Storage: Enabled (Reduces risk of automatic │
│                     browser eviction under pressure)   │
├────────────────────────────────────────────────────────┤
│ EMERGENCY BACKUP & EXPORT                              │
│ [ ⬇️ Export Pending Records as JSON ]                   │
│ ⚠️ Warning: These records have not yet synced to the    │
│ cloud. Export before clearing or repairing this device.│
└────────────────────────────────────────────────────────┘
```

#### Copy-Paste Prompt for Google Stitch (Stage 6):

> _"Design a Staff & Device Settings screen for Stokari per docs/DESIGN.md. Section 1 lists active shop attendants with Google email, registered device, and offline lease validity badge ('🟢 Valid (5 days remaining)') alongside a destructive 'Deactivate' button. Section 2 shows local storage health with IndexedDB storage quota and persistent storage status. Section 3 features an Emergency Backup box with a secondary button 'Export Pending Records as JSON' accompanied by an amber warning callout stating records have not yet synchronized to the cloud. Clean, structured, enterprise UI."_
