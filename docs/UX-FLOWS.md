# Stokari User Experience & Interaction Flows (`docs/UX-FLOWS.md`)

**Companion Document to:** [docs/DESIGN.md](file:///home/abelmekonen/Desktop/INSA/backend/docs/DESIGN.md) & [docs/SCREENS.md](file:///home/abelmekonen/Desktop/INSA/backend/docs/SCREENS.md)  
**Target:** Google Stitch, UX Designers, Frontend & Full-Stack Engineers

---

## 1. Flow 1: High-Speed POS Checkout Flow (≤ 10s, ≤ 3 taps)

```mermaid
flowchart TD
  start(["Customer at Counter"]) --> find["1. Cashier finds product<br/>(Barcode scan, search, or quick-chip)"]
  find --> add["2. Item added to cart<br/>(Quantity default 1; tap chip to edit)"]
  add --> more{"More items?"}
  more -->|"Yes"| find
  more -->|"No"| pay["3. Payment method verified<br/>(Cash selected by default)"]
  pay --> save["4. Tap 'Complete Sale · ETB X.XX'<br/>(Thumb-reach bottom button)"]
  save --> probe{"Reachability Probe<br/>(GET /v1/health, 2s timeout)"}
  probe -->|"Online"| on["Create outbox row (ONLINE_CONFIRMATION)<br/>Submit to API in background"]
  probe -->|"Offline / Timeout"| off["Atomic Dexie Commit:<br/>Sale + Lines + Pending Ledger + Outbox"]
  off --> ack["5. Instant UI feedback:<br/>'Saved on this device. Waiting to sync.'<br/>Cart resets in < 100ms for next sale"]
  on --> ack2["5b. UI feedback:<br/>'Sending, awaiting server confirmation'<br/>Till stays free for next sale"]
```

### Key Interaction Rules:

1. **The Cart Never Freezes:** Even if the network drops halfway through or the server cold-starts on Render, the cashier's till remains 100% responsive.
2. **Atomic Commit Precedes Confirmation:** The green success state is displayed ONLY after Dexie confirms the write to disk (INV-01).

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
  SE->>SE: Online event fires; acquire Web Lock
  SE->>IDB: Fetch oldest outbox operations (batch ≤ 50)
  SE->>API: POST /v1/sync/push { ops: [opId: 0191-A, ...] }

  API->>DB: Shop lock FOR UPDATE ➔ Check processed ➔ Apply ledger
  DB-->>API: Commit successful (serverSeq: 4821)
  API-->>SE: Push response: { opId: 0191-A, status: ACCEPTED, serverSeq: 4821 }

  SE->>IDB: Single Dexie Tx: update sale to SYNCED, delete outbox item
  IDB-->>UI: LiveQuery updates header: 🟢 Synced just now
```

### Timeout & Interruption Handling:

- If Wi-Fi drops while the server is processing the request, the client receives no response.
- **Rule:** The client retains the item in the outbox and resends the **exact same `opId`**.
- Upon receiving the retry, the server's unique constraint returns the cached result (`DUPLICATE`) without double-charging or re-decrementing stock.

---

## 3. Flow 3: Concurrent Offline Overselling & Owner Review (AT-06)

```mermaid
sequenceDiagram
  actor A as Register 1 (Hana, Offline)
  actor B as Register 2 (Dawit, Offline)
  participant S as Django Server
  actor O as Store Owner

  Note over S: Product Sugar: Current Stock = 10.000 kg
  A->>A: Sells 7.000 kg offline (opId: A1) ➔ Saved locally
  B->>B: Sells 6.000 kg offline (opId: B1) ➔ Saved locally

  Note over A,S: Register 1 syncs first
  A->>S: Push opId A1 (7 kg)
  S->>S: Stock decrements: 10 - 7 = 3 kg. Ledger updated.
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
  S->>S: Ledger adjustment +3 kg added. Balance = 0 kg.
  S->>S: ConflictCase #0191-B7 closed. underReview cleared.
  S-->>O: Case RESOLVED. Both sales preserved.
```

---

## 4. Flow 4: Attendant Deactivation, Lease Expiry & Drain Flow

```mermaid
sequenceDiagram
  actor O as Store Owner
  participant S as Server
  actor A as Attendant (Offline Device)

  O->>S: Deactivate Attendant "Dawit"
  S->>S: Membership status = DEACTIVATED. Revoke refresh token & leases.

  Note over A: Dawit is still offline; device works until lease expires
  A->>A: Dawit completes 2 sales offline (saved locally in Dexie)

  Note over A,S: Dawit reconnects to Wi-Fi
  A->>S: Attempts sync refresh
  S-->>A: HTTP 403 ACCOUNT_DEACTIVATED + drainToken (10m JWT)

  Note over A: PWA switches to Drain Mode
  A->>S: POST /v1/sync/push with drainToken
  S->>S: Every operation forced to QUARANTINED (Zero ledger effect!)
  S->>S: QuarantinedOperation records created. Case opened.
  S-->>A: Result: QUARANTINED (Local sales marked NEEDS_REVIEW)

  S-->>O: Notification: "2 operations from deactivated attendant await review"
  O->>S: Owner reviews: Option to ACCEPT or REJECT operations.
```
