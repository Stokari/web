---
name: react-typescript-application-engineering
description: Enforces React 19 and TypeScript architectural conventions for Stokari web. Use when creating components, managing server vs local state, integrating TanStack Query, writing forms, handling API errors, or testing UI.
---

# React + TypeScript Application Engineering

## Overview

This skill guides engineering judgment when building user interfaces and managing frontend state for Stokari's web application using **React 19**, **TypeScript ~6.0**, and the **Vite+ (`vp`)** toolchain.

Rather than copying prescriptive templates, use these principles, decision frameworks, and failure analyses to derive clean, accessible, and type-safe frontend implementations.

---

## Precedence Rule

When instructions, skills, or existing code conflict:

1. **Explicit product requirements and approved architecture decisions govern.**
2. If an instruction conflicts with technical correctness, data integrity, or security, **stop and explain the conflict** before proceeding.
3. Durable persistence, boundary validation, and TypeScript strictness take precedence over convenience patterns.

---

## Layer 1 — Invariants (Non-Negotiable System Guarantees)

Every frontend implementation in Stokari must strictly satisfy these core invariants:

### 1. State Source of Truth Invariant

_Never duplicate server state or persistent offline data into local component `useState` unless creating an isolated editable form draft._

- Local state that duplicates server or IndexedDB records drifts out of sync and creates phantom regressions.
- Derive computed values directly from existing queries or hooks during rendering.

### 2. Trust Boundary Runtime Validation Invariant

_Data entering the application from untrusted sources (HTTP APIs, IndexedDB, localStorage, or user input) must be validated at runtime before use._

- TypeScript types exist only at compile time; runtime data does not automatically adhere to interfaces.
- Validate shapes using runtime schemas (e.g. Zod when installed) or TypeScript type-guard narrowing functions.
- Never use `any` or unchecked type assertions (`data as Product`).

### 3. Safe Error Presentation Invariant

_Internal backend error strings, database exceptions, and technical stack traces must NEVER be exposed directly to end users._

- Map status codes and error codes to clear, actionable human copy.
- Retain technical diagnostics only in internal logs or telemetry.
- Offer retry actions only when the underlying operation is idempotent and safe to retry.

### 4. Accessible Form Invariant

_Every interactive input must have an accessible label and communicate validation states accessibly._

- Form fields must be linked to labels via `<label htmlFor="...">` or wrapping `<label>`.
- Invalid fields must communicate their state via `aria-invalid="true"` and `aria-describedby` pointing to error text.
- Submit buttons must be disabled during active submission to prevent duplicate network calls.

---

## Layer 2 — Decision Frameworks

Use these frameworks to determine the right architectural approach:

### 1. State Partitioning Decision Matrix

Ask: _What is the lifecycle and source of truth for this piece of data?_

| State Type         | Where It Belongs                | Decision Trigger                                                    | Example                                            |
| :----------------- | :------------------------------ | :------------------------------------------------------------------ | :------------------------------------------------- |
| **Server State**   | TanStack Query / Fetch cache    | Sourced from REST API; needs caching, revalidation, or refetching   | Product catalog, user profile, store settings      |
| **Offline Data**   | Dexie / IndexedDB               | Must survive page reloads, browser crashes, or offline sessions     | Unsynced sales, pending outbox, local stock count  |
| **URL State**      | Browser URL / Search Params     | Must be bookmarkable, shareable, or survive back/forward navigation | Search queries, filters, page numbers, active tabs |
| **Local UI State** | React `useState` / `useReducer` | Transient to a single component or view lifecycle                   | Modal open, dropdown active, temporary input draft |

### 2. Interface-Specific UI State Decision

Tailor rendered states to the specific interface type—do not force the 4-state pattern onto components that don't need it:

- **Collection & List Views:** Require explicit Loading (skeletons), Error (safe copy + retry), Empty (call-to-action), and Populated states.
- **Action Buttons / Mutations:** Require Idle, Pending/Submitting (disabled button + spinner), and Feedback (toast or inline notification).
- **Settings / Input Forms:** Require Pristine, Dirty, Submitting, and Field Error states.
- **Status Indicators:** Require distinct visual modes (e.g., Synced, Offline, Syncing, Needs Review).

### 3. Dependency & Toolchain Decision

Before importing or adding packages:

1. Inspect `package.json` to verify whether the package already exists.
2. If an architectural capability is required (e.g. `zod` for schemas, `dexie` for local DB, `@tanstack/react-query` for server state), propose and install the package explicitly rather than guessing it exists.
3. Use the Vite+ unified toolchain commands:
   - `vp test`: Run Vitest unit/component tests.
   - `vp check`: Run Oxfmt formatting, Oxlint linting, and type checking.
   - `vp build`: Verify production bundle compilation (`tsc -b && vp build`).

---

## Layer 3 — Failure Modes & Verification

Anticipate these common frontend pitfalls and implement explicit defenses:

### Failure Mode 1: Stale Local Duplication

- **The Bug:** A component fetches `product` and immediately calls `setProduct(data)`. When another tab or background query updates the product, the component displays stale data.
- **The Defense:** Read directly from the query hook (`const { data: product } = useProduct(id)`). Do not synchronize server queries into local component state.

### Failure Mode 2: Unchecked Type Assertions at the Boundary

- **The Bug:** Writing `const product = await res.json() as Product;`. When the API schema changes or returns an unexpected null field, the app crashes with `Cannot read property of undefined` during rendering.
- **The Defense:** Validate data at the boundary using a schema parser or type guard: `const product = ProductSchema.parse(await res.json());`.

### Failure Mode 3: Rapid Duplicate Form Submissions

- **The Bug:** A cashier clicks "Submit" three times rapidly on a slow connection. Three separate HTTP requests are fired.
- **The Defense:** Disable the submit button immediately upon submission (`disabled={isSubmitting || mutation.isPending}`).

### Required Automated Test Verifications

Before declaring any UI feature complete, write tests using React Testing Library verifying:

1. **User-Visible Behavior:** Test what the user observes (text, buttons, accessibility roles), not internal component implementation details.
2. **Context-Sensitive States:** Verify that loading indicators appear during fetch, errors display safe messages, and empty states offer clear calls-to-action.
3. **Form Submissions:** Verify that submitting valid input triggers the handler and disables the submit button during submission.

---

## Layer 4 — Minimal Reference Contrasts

### Unchecked Assertion vs Runtime Boundary Validation

```typescript
// UNSAFE: Compile-time lie; runtime crash if API changes
const data = (await response.json()) as ProductVariant;
console.log(data.sku.toUpperCase()); // Crashes if sku is null or missing!

// SAFE: Validates untrusted API data before execution
import { z } from "zod";

const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  sku: z.string().min(1),
  current_stock: z.number().int(),
});

const raw = await response.json();
const variant = ProductVariantSchema.parse(raw); // Throws clean boundary error if invalid
```

### Raw Error Leakage vs Safe User Copy

```tsx
// UNSAFE: Leaks database constraints or technical details to end users
<p className="error">{error.message}</p> // Displays: "relation 'inventory_product' does not exist"

// SAFE: Human-friendly message with safe action
<div role="alert" className="error-panel">
  <p>Unable to load inventory records. Please check your connection and try again.</p>
  <button onClick={() => refetch()}>Try Again</button>
</div>
```
