# Stokari User Experience & Interaction Flows (`docs/UX-FLOWS.md`)

**Companion Document to:** [docs/DESIGN.md](file:///home/abelmekonen/Desktop/INSA/web/docs/DESIGN.md) & [docs/SCREENS.md](file:///home/abelmekonen/Desktop/INSA/web/docs/SCREENS.md)
**Target:** Frontend Engineers, UX Reviewers, QA

---

## 1. Flow 1: High-Speed POS Checkout (≤ 10s, ≤ 3 Taps)

### 1.1 Happy Path (Online)

```mermaid
flowchart TD
    start(["Customer at Counter"]) --> find["1. Find Product<br/>(Barcode scan / Search / Quick Chip)"]
    find --> add["2. Add to Cart<br/>(Default qty 1)"]
    add --> more{"More Items?"}
    more -->|Yes| find
    more -->|No| pay["3. Verify Payment<br/>(Cash default)"]
    pay --> complete["4. Tap 'Complete Sale · ETB X.XX'<br/>(Thumb-reach, 54px button)"]
    complete --> probe["Reachability Probe<br/>(GET /v1/health, 2s timeout)"]
    probe -->|Online| online["Create Outbox Row<br/>(ONLINE_CONFIRMATION_REQUIRED)"]
    online --> submit["Submit to API in Background"]
    submit --> ui["UI: 'Sending, awaiting server confirmation'<br/>Till FREE for next sale immediately"]
    probe -->|Offline/Timeout| offline["Atomic Dexie Commit:<br/>Sale + Lines + Pending StockLog + Outbox"]
    offline --> ack["UI: 'Saved on this device. Waiting to sync.'<br/>Cart resets < 100ms"]
```

### 1.2 Key Interaction Rules (Non-Negotiable)

| Rule | Rationale |
|---|---|
| **Cart Never Freezes** | Network drops, server cold-starts — till stays 100% responsive |
| **Atomic Commit Precedes UI Success** | Green "Saved" shows ONLY after Dexie confirms write to disk (INV-01) |
| **Reachability Probe Decides Mode** | `GET /health` (2s) NOT `navigator.onLine` — avoids phantom online state |
| **Online = Non-Blocking** | Outbox row inserted, API called in background, UI shows "Sending…" |
| **Offline = Blocking Commit** | Full Dexie transaction before ANY UI success feedback |
| **Quantity Keypad = Sheet** | Slides from bottom, 40% height, live total preview, quick chips from unit config |
| **Sell Anyway = Alert Sheet** | Warns about projected stock, flags for review, NEVER blocks sale |

### 1.3 Edge Cases Handled Inline (No Modals)

| Scenario | UI Response |
|---|---|
| Qty > Projected Stock | "Sell Anyway" sheet with confirmed/projected comparison |
| Product Inactive | Inline error on line: "Product unavailable" — remove or swap |
| Duplicate Tap | Idempotent `opId` — second tap no-op, shows "Already processing" |
| Network Loss Mid-Submit | Retry same `opId` automatically, no user action |
| Server Rejects (Price Mismatch) | Line marked `REJECTED`, inline reason, "Re-enter" action |

---

## 2. Flow 2: Offline-to-Online Synchronization Lifecycle

```mermaid
sequenceDiagram
    actor C as Cashier (Device 1)
    participant UI as PWA UI
    participant IDB as Dexie (IndexedDB)
    participant SE as Sync Engine
    participant API as Django API
    participant DB as PostgreSQL

    Note over C,IDB: Device is offline
    C->>UI: Completes sale #104 (opId: 0191-A)
    UI->>IDB: Commit sale + outbox (status: WAITING_TO_SYNC)
    UI-->>C: "Saved on this device" (🟡 Offline · 1 waiting)

    Note over C,API: Wi-Fi reconnects
    SE->>SE: Online event fires; acquire Web Lock (stokari-sync-shopId)
    SE->>IDB: Fetch oldest outbox operations (batch ≤ 50, deviceSeq order)
    SE->>API: POST /v1/sync/push { ops: [opId: 0191-A, ...] }

    API->>DB: Shop lock FOR UPDATE → Check ProcessedOperation → Apply StockLog
    DB-->>API: Commit successful (serverSeq: 4821)
    API-->>SE: Push response: { opId: 0191-A, status: ACCEPTED, serverSeq: 4821, stockAfter: [...] }

    SE->>IDB: Single Dexie Tx: update sale to SYNCED, delete outbox item, apply stockAfter
    IDB-->>UI: LiveQuery updates header: 🟢 Synced just now
```

### 2.1 Timeout & Interruption Handling

| Failure Point | Client Behavior | Server Behavior |
|---|---|---|
| Wi-Fi drops during push | Retain in outbox, resend **exact same `opId`** | Unique constraint returns cached result (`replayed: true`) |
| Server 5xx / Timeout | Exponential backoff (2s, 4s, 8s… max 5min, full jitter) | No duplicate effect — `ProcessedOperation` prevents it |
| Server 429 Rate Limited | Honor `Retry-After` header | Throttle window |
| App Killed (SIGKILL) | On restart: outbox intact, `SyncPill` shows pending | No server state change |
| `opId` Reuse Different Payload | Never happens (client generates UUIDv7) | Returns `IDEMPOTENCY_KEY_REUSE`, audit log |

### 2.2 Pull & Bootstrap

```mermaid
sequenceDiagram
    participant SE as Sync Engine
    participant API as API
    participant DB as PostgreSQL
    participant L as Dexie

    Note over SE,L: After push or on timer (30s active)
    SE->>API: GET /v1/sync/pull?cursor=4800&limit=200
    API->>DB: SELECT change_log WHERE seq > 4800 ORDER BY seq LIMIT 200
    API->>DB: Load current entities, strip owner-only fields by role
    API-->>SE: { entities, nextCursor: 4890, hasMore: false, headSeq: 4890, serverTime }
    SE->>L: ONE TX: upsert by id, apply stockLevels if version > confirmedVersion
    SE->>L: Set pullCursor = 4890 in SAME TX
```

**New Device Bootstrap:** `cursor=0` → pull pages until `hasMore=false` → integrity check → ready.

---

## 3. Flow 3: Concurrent Offline Overselling & Owner Review (AT-06)

```mermaid
sequenceDiagram
    actor A as Register 1 (Hana, Offline)
    actor B as Register 2 (Dawit, Offline)
    participant S as Django Server
    actor O as Store Owner

    Note over S: Product Sugar: Current Stock = 10.000 kg
    A->>A: Sells 7.000 kg offline (opId: A1) → Saved locally
    B->>B: Sells 6.000 kg offline (opId: B1) → Saved locally

    Note over A,S: Register 1 syncs first
    A->>S: Push opId A1 (7 kg)
    S->>S: Stock decrements: 10 - 7 = 3 kg. StockLog updated.
    S-->>A: Result: ACCEPTED (Remaining: 3 kg)

    Note over B,S: Register 2 syncs second
    B->>S: Push opId B1 (6 kg)
    S->>S: Stock calculation: 3 - 6 = -3 kg (INSUFFICIENT STOCK!)
    Note over S: Sale is NOT discarded. Financial record preserved.
    S->>S: Transaction recorded. Status = NEEDS_REVIEW.
    S->>S: Product underReview = True. Open ConflictCase #0191-B7.
    S-->>B: Result: NEEDS_REVIEW (ConflictCase #0191-B7 opened)

    S-->>O: Real-time notification: Stock discrepancy on Sugar (-3 kg)
    O->>O: Inspects physical shelf, finds extra 3 kg bag from recent delivery
    O->>S: ResolveConflict: RECONCILE_STOCK (+3.000 kg)
    S->>S: StockLog adjustment +3 kg added. Balance = 0 kg.
    S->>S: ConflictCase #0191-B7 closed. underReview cleared.
    S-->>O: Case RESOLVED. Both sales preserved.
```

### 3.1 Conflict Resolution Rules

| Resolution Type | When Used | StockLog Effect | Case Outcome |
|---|---|---|---|
| `RECONCILE_STOCK` | Found missing stock | `RECEIPT` entry (+qty) | Closed, `underReview` cleared |
| `CANCEL_SALE` | Sale was error | `SALE_CANCELLATION` (-qty) | Closed, `underReview` cleared |
| `ACKNOWLEDGE` | Accept deficit | None | Closed, `underReview` cleared, negative balance stays |

**Stale Resolution Protection:** Owner submits `caseVersion`. If server version > submitted → `NEEDS_REVIEW` + `STALE_RESOLUTION` event, case stays `OPEN`.

---

## 4. Flow 4: Attendant Deactivation, Lease Expiry & Drain Flow

```mermaid
sequenceDiagram
    actor O as Store Owner
    participant S as Server
    actor A as Attendant (Offline Device)

    O->>S: Deactivate Attendant "Dawit"
    S->>S: Membership = DEACTIVATED. Revoke refresh token & leases.

    Note over A: Dawit still offline; device works until lease expires (7 days max)
    A->>A: Dawit completes 2 sales offline (saved in Dexie)

    Note over A,S: Dawit reconnects to Wi-Fi
    A->>S: Attempts token refresh
    S-->>A: HTTP 403 ACCOUNT_DEACTIVATED + drainToken (10m JWT, scope: sync:drain)

    Note over A: PWA switches to Drain Mode
    A->>S: POST /v1/sync/push with drainToken
    S->>S: Every operation forced to QUARANTINED (ZERO StockLog effect!)
    S->>S: QuarantinedOperation records created. AUTHORIZATION_REVIEW case opened.
    S-->>A: Result: QUARANTINED (Local sales marked NEEDS_REVIEW)

    S-->>O: Notification: "2 operations from deactivated attendant await review"
    O->>S: Owner reviews: ACCEPT (applies movements) or REJECT (archives with reason)
```

### 4.1 Lease Expiry (No Deactivation)

```mermaid
stateDiagram-v2
    [*] --> VALID: Issued at sign-in/renewal
    VALID --> VALID: Renewed while online
    VALID --> EXPIRING: < 24h remaining
    EXPIRING --> VALID: Renewed
    EXPIRING --> EXPIRED: 7 days since issue
    VALID --> REVOKED: Server deactivates membership
    EXPIRED --> VALID: Online renewal
    EXPIRED --> [*]: Read-only (local data accessible, no protected ops)
```

**Client UX:**
- `EXPIRING` (24h): Banner "Offline access ends in N days" + SyncPill warning
- `EXPIRED`: Read-only banner, protected ops blocked, export still works
- `REVOKED`: Immediate 403 on next request, drain flow if pending ops

---

## 5. Flow 5: Product Creation & Unit Selection

```mermaid
flowchart TD
    start(["Owner: Add Product"]) --> wizard["Wizard: 'How do you sell it?'"]
    wizard -->|"By piece/packet<br/>bottles, biscuits, sealed sacks"| counted["Counted: Piece or Pack<br/>Whole numbers only"]
    wizard -->|"By weight<br/>flour, sugar, grain"| measured1["Measured: Kilogram<br/>Advanced: Gram"]
    wizard -->|"By volume<br/>loose oil, loose water"| measured2["Measured: Litre<br/>Advanced: Millilitre"]
    counted --> name["Name (EN + Amharic)"]
    measured1 --> name
    measured2 --> name
    name --> price["Price per Unit + Optional Cost"]
    price --> opening["Opening Stock: How many units now?"]
    opening --> packaging{"Receive in bigger\ncontainers? [Should]"}
    packaging -->|Yes| pkg["Add packaging rules<br/>e.g., Crate = 12"]
    packaging -->|No| preview["Preview Sentence"]
    pkg --> preview
    preview --> save["Save Product"]
    save --> another{"Sell same goods\nin another form?"}
    another -->|Yes| clone["Add Another Form:<br/>Copies name, asks new unit"]
    another -->|No| done(["Done"])
```

### 5.1 Preview Sentence (Catches Unit Errors)

> "You sell **Cooking oil, loose (per L)** by the **litre**. Price **ETB 189.99** per litre. Stock: **20 L**."

**Unit Immutable After Save:** Changing unit later would reinterpret all history. "Create another form instead."

---

## 6. Flow 6: Stock Receive & Adjust (Owner Only)

### 6.1 Receive Stock

```mermaid
flowchart TD
    start(["Owner: Receive Stock"]) --> select["Select Product"]
    select --> qty["Enter Quantity"]
    qty --> packaging{"Product has\npackaging rules?"}
    packaging -->|Yes| pkgSel["Select Packaging<br/>e.g., Crate (12)"]
    pkgSel --> pkgPreview["Live: '3 crates = 36 pcs'"]
    packaging -->|No| unitEntry["Enter in base unit"]
    pkgPreview --> cost["Optional: Unit Cost or\nPackaging Cost"]
    unitEntry --> cost
    cost --> notes["Notes: Invoice #, Supplier"]
    notes --> save["Save Stock Receipt"]
    save --> atomic["Atomic: StockLog RECEIPT +\nProduct cost update +\nOutbox entry"]
```

### 6.2 Adjust Stock

```mermaid
flowchart TD
    start(["Owner: Adjust Stock"]) --> select["Select Product"]
    select --> direction{"Increase or\nDecrease?"}
    direction -->|Increase| inc["Enter +Qty"]
    direction -->|Decrease| dec["Enter -Qty"]
    inc --> reason["Select Reason:\nDAMAGE / LOSS / CORRECTION / OTHER"]
    dec --> reason
    reason -->|OTHER| note["Mandatory Note"]
    reason -->|DAMAGE/LOSS/CORRECTION| save
    note --> save["Save Adjustment"]
    save --> atomic["Atomic: StockLog ADJUSTMENT +\nOutbox entry"]
    save -.->|Online: would go negative| reject["REJECTED: INSUFFICIENT_STOCK"]
    save -.->|Offline: would go negative| quarantine["QUARANTINED: INVALID_STOCK_OPERATION"]
```

---

## 7. Flow 7: Conflict Review (Owner)

```mermaid
flowchart TD
    notif["Notification: Review Required"] --> review["Open Review Queue"]
    review --> select["Select Case<br/>(OFFLINE_OVERSELL / AUTH_REVIEW / etc.)"]
    select --> detail["Case Detail Drawer/Sheet"]
    detail --> timeline["View Concurrent Timeline"]
    timeline --> resolve{"Resolution Type"}
    resolve -->|Found Stock| restock["Record Restock: +Qty + Note"]
    resolve -->|Sale Error| cancel["Cancel Sale: Select + Reason"]
    resolve -->|Accept Deficit| ack["Acknowledge Deficit"]
    restock --> submit["Submit ResolveConflict"]
    cancel --> submit
    ack --> submit
    submit --> version{"caseVersion\nMatches Server?"}
    version -->|Yes| apply["Apply Resolution +\nClose Case +\nClear underReview"]
    version -->|No| stale["NEEDS_REVIEW +\nSTALE_RESOLUTION event"]
    apply --> done["Case RESOLVED\nBoth sales preserved"]
    stale --> redo["Owner: Review Again"]
```

---

## 8. Flow 8: End-of-Day / Dashboard Review

```mermaid
flowchart TD
    start(["Owner Opens Today Dashboard"]) --> buckets["3-Bucket Revenue Visible"]
    buckets --> confirmed["🟢 Confirmed: ETB X,XXX (Server-synced)"]
    buckets --> pending["🟡 Pending: ETB XXX (This device, unsynced)"]
    buckets --> review["🔴 Review: ETB XX (Conflicts)"]
    confirmed --> valuation["Valuation Card: ETB XX,XXX\n⚠️ N items no cost, M approximate"]
    valuation --> lowStock["Low Stock Warnings (Restock buttons)"]
    lowStock --> actions["Quick Actions: Receive / Adjust / Export / Backup"]
```

**Critical Rule:** Buckets are **mutually exclusive**. A sale appears in exactly ONE bucket. Never sum them for "total revenue".

---

## 9. Flow 9: Data Export & Backup

```mermaid
flowchart TD
    start(["Owner: Settings → Export"]) --> choose{"Export Type"}
    choose -->|Pending Records| pending["JSON Export\nstokari-pending-export/v1"]
    choose -->|Full Backup| full["SQLite/JSON Full Dump"]
    choose -->|Sales CSV| sales["GET /exports/sales.csv"]
    choose -->|Stock CSV| stock["GET /exports/stock-changes.csv"]
    pending --> warning["⚠️ Records NOT server-confirmed\nExport before device clear/repair"]
    full --> warning
    sales --> download["Download via Browser"]
    stock --> download
```

**Pending Export Structure:**
```json
{
  "version": "stokari-pending-export/v1",
  "exportedAt": "2026-10-12T14:30:00.000Z",
  "shopId": "0190f3a1-...",
  "deviceId": "0190f3a1-00a1-...",
  "pendingOperations": [
    { "opId": "...", "type": "RecordSale", "state": "WAITING_TO_SYNC", "payload": {...}, "createdAt": "..." }
  ],
  "unsyncedSales": [...],
  "unsyncedStockChanges": [...]
}
```

---

## 10. Error & Recovery Flows

| Error | User-Facing Message | Recovery Action |
|---|---|---|
| `INSUFFICIENT_STOCK` (online) | "Not enough stock. Available: 3.000 kg" | Reduce qty or "Sell Anyway" |
| `PRODUCT_UNDER_REVIEW` | "This item needs owner review. Ask manager." | Block sale, navigate to Review |
| `ACCOUNT_DEACTIVATED` | "Your access was revoked. Pending sales saved for owner review." | Drain flow auto-starts |
| `UPGRADE_REQUIRED` | "App update required. Tap to update." | Hard block, link to store |
| `CURSOR_RESET` | "Sync reset. Re-downloading data…" | Auto restart pull from 0 |
| `QUOTA_EXCEEDED` | "Storage full. Export data, then clear space." | Export button + storage settings |
| `LEASE_EXPIRED` | "Offline access expired. Connect to internet to renew." | Block protected ops, allow export |

---

## 11. Accessibility Flow Annotations

| Flow | `aria-live` | Focus Management | Screen Reader Announcement |
|---|---|---|---|
| Sale Complete | `polite` | Stay on Sell screen | "Sale saved. Waiting to sync." |
| Sync State Change | `assertive` | None | "Synced 3 operations. Up to date." |
| Conflict Opened | `assertive` | Move to Review tab | "Stock conflict opened. Review required." |
| Lease Expiring | `polite` | None | "Offline access ends in 2 days." |
| Error Toast | `assertive` | None | "Error: Insufficient stock. Retry available." |
| Modal Open | — | Trap focus, restore on close | "Dialog opened. Create Product." |

---

## 12. Performance Flow Targets

| Interaction | Target | Measurement Point |
|---|---|---|
| Tap Product → Cart Add | < 50ms | Touch → Cart re-render |
| Quantity Keypad Open | < 100ms | Tap qty → Sheet visible |
| Complete Sale (Offline) | < 200ms | Tap → "Saved" toast |
| Complete Sale (Online) | < 300ms | Tap → "Sending" toast |
| Search Keystroke → Results | < 16ms (60fps) | Input → Filtered list |
| Sync Push (50 ops) | < 5s (cold start) | Push start → All ACCEPTED |
| Pull Page (200 changes) | < 1s | Request → Dexie commit |
| Dashboard Mount | < 200ms | Route → Buckets visible |
| Review Case Open | < 150ms | Tap → Drawer/Sheet visible |

---

## 13. State Machine Summary (SyncPill)

```mermaid
stateDiagram-v2
    [*] --> OFFLINE: App start, no network
    OFFLINE --> SYNCING: Online event + outbox not empty
    SYNCING --> UP_TO_DATE: Push + Pull complete, no review
    SYNCING --> ATTENTION_REQUIRED: Push complete, review/quarantine > 0
    UP_TO_DATE --> SYNCING: Timer (30s) or online event
    UP_TO_DATE --> OFFLINE: Health probe fails
    ATTENTION_REQUIRED --> SYNCING: User taps "Sync Now"
    ATTENTION_REQUIRED --> UP_TO_DATE: Owner resolves all cases
    * --> LOCAL_ONLY: meta.mode = LOCAL_ONLY (persistent banner)
```

---

## 14. Testing Checklist per Flow

| Flow | Unit Tests | Integration | E2E (Playwright) | Device |
|---|---|---|---|---|
| POS Checkout | ✅ Cart logic, qty math | ✅ Dexie commit, outbox | ✅ 2 devices, offline→online | ✅ Low-end Android |
| Sync Lifecycle | ✅ Backoff, cursor | ✅ Push/pull, idempotency | ✅ Cold start, timeout | ✅ 320px width |
| Oversell Conflict | ✅ Case creation | ✅ AT-06 scenario | ✅ 2 registers, owner resolve | ✅ Real device |
| Deactivation/Drain | ✅ Token revoke | ✅ 403 + drainToken | ✅ Offline sales → quarantine | ✅ Lease expiry |
| Product Wizard | ✅ Unit selection | ✅ Create + opening stock | ✅ Amharic names | ✅ RTL-aware |
| Receive/Adjust | ✅ Packaging math | ✅ Atomic StockLog | ✅ Cost update | ✅ Quick chips |
| Dashboard | ✅ Bucket math | ✅ Dexie query | ✅ Offline buckets | ✅ Valuation accuracy |
| Export/Backup | ✅ JSON structure | ✅ Pending export | ✅ Restore test | ✅ File download |

---

## 15. Anti-Patterns (What NOT to Build)

| Anti-Pattern | Correct Approach |
|---|---|
| Modal for quantity input | Bottom sheet (mobile) / inline stepper (desktop) |
| Spinner for data loading | Skeleton matching exact layout |
| "Sync failed" toast with no action | "Retry" button + auto-retry |
| Color-only status badges | Icon + Text (always) |
| Separate "Review" modal | Slide-out drawer (desktop) / Full sheet (mobile) |
| Confirmation dialog for "Sell Anyway" | Alert sheet with destructive button |
| Separate "Cost" field visible to attendants | Server strips — client never receives |
| Floating "Sync" button | SyncPill in header + "Sync Now" in popover |
| "Total Revenue" summing buckets | Show 3 buckets separately, NEVER summed |