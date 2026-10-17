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

## 2. Anti-AI-Slop Directives

Generative UI tools frequently introduce generic tropes that signal low-effort prototyping. Stitch must strictly adhere to the following negative and positive constraints:

### ❌ BANNED Tropes

- **NO Purple/Violet Gradients:** Never generate dark indigo backgrounds with neon violet radial glows, cosmic gradients, or cyberpunk accents.
- **NO Oversized "Bubble" Cards:** Do not use `rounded-3xl` (24px+) or inflated padding on functional containers. Keep radii compact (`4px` to `12px`).
- **NO Gratuitous Glassmorphism:** Never use heavy `backdrop-blur` or semi-transparent cards that degrade text legibility over data. Use solid, high-contrast surfaces (`#FFFFFF` on `#F8FAFC`).
- **NO Meaningless Decorative Elements:** No floating orbs, decorative mesh gradients, sparkles (✨), or 3D clay graphics. Every visual element must serve a business function.
- **NO Marketing Landing Page Formats:** Never output hero headers, testimonial carousels, or slogan banners inside operational application views.
- **NO Low-Density Sprawls:** Cashiers and store owners need to scan rows of items, prices, and stock quickly without excessive vertical scrolling.

### ✅ Required Aesthetic

- **Hairline Dividing Borders:** Clean `1px` borders (`#E2E8F0`) defining cards, list items, and table rows.
- **High-Contrast Text Hierarchy:** Bold Slate 900 (`#0F172A`) for primary numbers and names; Slate 600 (`#475569`) for metadata; Slate 500 (`#64748B`) for muted labels. Muted text meets WCAG AA contrast (≥ 4.5:1 against white).
- **Tabular Monospace Numerals:** Financial figures, quantities, barcodes, and SKUs use monospace font styling for vertical alignment.
- **Thumb-Zone Optimization:** On mobile viewports, primary interactive triggers (Save, Keypad, Payment selection) are anchored in the bottom 40% of the screen.

---

## 3. Responsive Breakpoints & Layout Architecture

```text
320px                    640px                    1024px
  │                        │                        │
  ▼                        ▼                        ▼
Mobile Phone             Compact Tablet          Desktop / Workstation
Single-column card flow  2-column POS till flow  Left sidebar navigation
Bottom tab bar           Split tables             Full multi-column tables
Thumb-reach Save button  Compact modals           Split-pane conflict drawer
```

- **Mobile Viewports (< 640px):**
  - Viewport width down to **320px** must render without horizontal scrolling.
  - Sticky top header with the `SyncPill` status indicator.
  - Sticky bottom tab bar (Sell, Products, Stock, Today, More).
  - Minimum touch target: **44 × 44 px**.
- **Tablet Viewports (640px – 1023px):**
  - Sell Screen: Split two-column layout (Product search/picker on the left, Cart and Checkout on the right).
  - Compact tables with secondary columns (e.g. category) collapsed.
- **Desktop Viewports (≥ 1024px):**
  - Fixed left sidebar navigation (width `240px`).
  - Full tabular views with sorting, filtering, and bulk action toolbars.
  - Split-pane review drawer for conflict resolution.

---

## 4. Reusable Component Specifications

### 4.1 Global Status Pill (`SyncPill`)

The central connectivity indicator, anchored in the top header across all views:

- **Up to date:**
  - Background: `#ECFDF5`, Border: `#A7F3D0`, Text: `#065F46`, Icon: 🟢.
  - Label: `Synced 2m ago`.
- **Offline with pending queue:**
  - Background: `#FFFBEB`, Border: `#FDE68A`, Text: `#92400E`, Icon: 🟡.
  - Label: `Offline · 3 waiting`.
- **Sync in progress:**
  - Background: `#F1F5F9`, Border: `#CBD5E1`, Text: `#334155`, Icon: 🔄.
  - Label: `Syncing batch…`.
- **Review required:**
  - Background: `#FEF2F2`, Border: `#FECACA`, Text: `#991B1B`, Icon: 🔴.
  - Label: `Review Required (1)`.

_Popover Detail:_ Tapping opens a card showing: last sync timestamp, outbox count, IndexedDB storage quota, and an explicit **"Sync Now"** button.

### 4.2 Numeric & Currency Formatting

- **Currency (Ethiopian Birr):**
  - Format: `ETB 170.00` (always two decimal places, tabular monospace numerals).
- **Unit Quantities:**
  - Whole-number items (`PIECE`, `PACK`): `3 pcs`, `12 pk` (0 decimals).
  - Continuous items (`KG`, `GRAM`, `LITRE`, `MILLILITRE`): `1.250 kg`, `0.500 L` (exact 3 decimals).
- **Confirmed vs Projected Display:**
  - `14.000 kg confirmed` · `(11.000 kg projected)` in secondary text when pending sales exist.

### 4.3 Form Inputs & Validation States

- **Default:** Background `#FFFFFF`, Border `1px solid #CBD5E1`, Radius `8px`, Height `42px`, Padding `0 12px`.
- **Focus-Visible:** Border `2px solid #1E40AF`, Outline `none`.
- **Invalid / Error:** Border `2px solid #991B1B`, Background `#FEF2F2`.
  - Linked error message below field with `aria-describedby` in `#991B1B` font size `12px`.
- **Label Association:** Every input has a linked `<label>` with font size `13px`, font weight `500`, color `#475569`.

### 4.4 Buttons

- **Primary Button (Action / Save):**
  - Background `#1E40AF`, Hover `#1D4ED8`, Active `#172554`, Text `#FFFFFF`.
  - Height `44px` (or `54px` for mobile POS checkout button), Radius `8px`, Font Weight `600`.
- **Secondary / Outline Button:**
  - Background `#FFFFFF`, Border `1px solid #CBD5E1`, Hover `#F8FAFC`, Text `#0F172A`.
- **Destructive Button:**
  - Background `#FEF2F2`, Border `1px solid #FECACA`, Text `#991B1B`, Hover `#FEE2E2`.
- **Disabled State:**
  - Background `#F1F5F9`, Border `1px solid #E2E8F0`, Text `#94A3B8`, Cursor `not-allowed`.

### 4.5 Context-Sensitive Data View States

Every data list or collection view must explicitly handle:

1. **Loading Skeleton:** Rectangular pulse animations (`#F1F5F9`) matching the exact row heights and card dimensions (no spinning wheels for layout content).
2. **Actionable Error State:** Solid card with red warning icon, human-friendly explanation, and safe **"Retry"** button.
3. **Empty State:** Bordered box with dashed border (`#CBD5E1`), clear title, descriptive call-to-action text, and primary button.
4. **Populated State:** High-density rows separated by hairline borders (`#E2E8F0`).

---

## 5. Accessibility & Inclusivity Rules (WCAG 2.1 AA)

1. **Contrast Ratio:** Text contrast ratio is at least **4.5:1** for standard text and **3:1** for large headings (≥ 18px bold). Muted text `#64748B` on `#FFFFFF` provides a 4.6:1 ratio, strictly passing WCAG AA.
2. **Dual Status Indicators:** Never convey status by color alone. Every badge, indicator, and alert MUST combine an icon and an explicit text label (e.g. 🟢 + "Synced").
3. **Mobile Keypad Hints:** Number and quantity inputs must declare `inputmode="decimal"` or `inputmode="numeric"`.
4. **Ethiopic Typography:** Native font stack fallback (`Noto Sans Ethiopic`) ensures Ge'ez script renders cleanly alongside Latin characters without baseline shifting.
