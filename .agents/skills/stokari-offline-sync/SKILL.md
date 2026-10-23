---
name: stokari-offline-sync
description: Enforces Stokari's offline-first architecture, Dexie/IndexedDB local persistence, outbox queue, client operation IDs, idempotent synchronization, and conflict resolution. Use when implementing offline capabilities, local data stores, background sync, or network status handling.
---

# Stokari Offline-First Synchronization

## Overview

This skill guides engineering reasoning for Stokari's offline-first architecture. It covers local persistence in IndexedDB (via Dexie.js), background outbox synchronization, conflict detection, and network recovery.

In retail, cashiers must ring up sales, scan merchandise, and print receipts without depending on real-time internet connectivity. Offline operation is a primary operational mode, not an edge case or error state.

---

## Precedence Rule

When instructions, skills, or existing code conflict:

1. **Explicit SRS/Domain requirements and approved architecture decisions govern.**
2. If an instruction conflicts with data durability, idempotency, or transaction safety, **stop and explain the conflict** before proceeding.
3. Durable IndexedDB persistence takes precedence over memory-only optimistic representations.

---

## Layer 1 — Invariants (Non-Negotiable System Guarantees)

Every offline-capable feature in Stokari must strictly satisfy these five invariants:

### 1. The Durable Write Invariant

_An offline mutation must be committed to durable local storage (IndexedDB) BEFORE the application reports success to the user or triggers receipt printing._

- Memory is volatile; disk storage is durable.
- Never display "Sale Completed" or clear the checkout cart based solely on an uncommitted in-memory React state.
- If the browser tab crashes, the device shuts down, or the battery dies immediately after the UI acknowledgment, the record must exist safely in IndexedDB.

### 2. Immutable Operation ID Invariant

_Every client-initiated mutation must be assigned a globally unique `operation_id` at the moment of creation, and that ID must NEVER change across retries, timeouts, or app reboots._

- Use a globally unique identifier (e.g. `crypto.randomUUID()` for standard UUIDv4, or a UUIDv7 generator if time-sorting is required).
- The `operation_id` serves as the idempotency key on the backend.

### 3. Atomic Local Acknowledgment Invariant

_When processing a backend sync response, updating the local domain record status (`SYNCED`, `NEEDS_REVIEW`, `FAILED`) and removing/archiving the outbox entry MUST occur in the exact same local database transaction._

- If the app crashes halfway through processing a sync response, it must not leave an outbox item deleted without updating the local sale status, or vice versa.

### 4. No Silent Data Loss Invariant

_Conflicting, rejected, or invalid offline operations must NEVER be deleted or ignored; they must transition into an observable review state (`NEEDS_REVIEW` or `FAILED`)._

- When an offline sale conflicts with server inventory (e.g. oversold scarce stock), the local record transitions to `NEEDS_REVIEW` and is preserved for manager reconciliation.
- It is removed from the active retry queue so it does not loop indefinitely, but remains visible in the local audit trail.

### 5. Multi-Tenant Store Scoping Invariant

_Every outbox operation, cached catalog item, and sync cursor must be strictly partitioned by `store_id`._

- Queued operations from Store A must never be pushed to Store B if an operator logs into a different account or store on the same physical terminal.

---

## Layer 2 — Decision Frameworks

Use these frameworks to make sound implementation choices:

### 1. State Classification & Persistence Decision Matrix

Before implementing state or data changes, determine the correct storage mechanism:

| Question                                               | Storage Mechanism                          | Example                                           |
| :----------------------------------------------------- | :----------------------------------------- | :------------------------------------------------ |
| Is this a completed business or financial transaction? | **Dexie / IndexedDB** (Atomic Transaction) | Completed sale, stock count adjustment            |
| Is this transient user interaction state?              | **React `useState` / `useReducer`**        | Modal visibility, dropdown toggle, barcode buffer |
| Is this shareable navigation or filter state?          | **URL Search Params**                      | Active category filter, table page number         |
| Is this read-only cache of server master data?         | **TanStack Query / Dexie Catalog Cache**   | Product catalog for offline barcode scanning      |

### 2. Network Response Triage & Retry Policy

When the background sync engine receives a response for an outbox operation:

```
                          Server Response Received
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
  HTTP 200 OK                  HTTP 4xx Error              HTTP 5xx / Timeout
         │                           │                           │
   Inspect status              Client error /              Transient network /
  in results array           Validation failure             server disruption
         │                           │                           │
  ┌──────┴──────┐                    ▼                           ▼
  │             │             Mark local record           Keep in outbox,
SUCCESS /   NEEDS_REVIEW      as FAILED. Remove           schedule retry
DUPLICATE   (Conflict)        from retry queue.           with exponential
  │             │             Alert user to fix.          backoff + jitter.
  ▼             ▼
Mark local  Mark local
record as   record as
SYNCED.     NEEDS_REVIEW.
Remove from Remove from
outbox.     retry queue.
```

- **Ambiguous Timeouts (Network Drop):** If the fetch promise rejects due to a timeout or connection drop, you cannot know if the server processed the request. **Action:** Keep the item in the outbox with its original `operation_id` and retry. The server's idempotency engine will return `DUPLICATE` if it already succeeded.
- **Business Conflicts (`NEEDS_REVIEW`):** Remove from the retry loop immediately to prevent hammering the server, and update the local transaction's UI status to notify the cashier/manager.

### 3. Delta Pull & Monotonic Cursor Semantics

When pulling delta updates from the server:

- Always use a composite monotonic cursor (e.g. `timestamp:id` or sequence number) to prevent omitting records created during the exact same millisecond as the cursor.
- Apply catalog updates (`bulkPut`) and deletions (`bulkDelete` for tombstones) inside a single Dexie transaction.
- If `has_more` is true, immediately continue paging until the local catalog is fully synchronized.

---

## Layer 3 — Failure Modes & Verification

Anticipate these real-world failure modes and implement explicit defenses:

### Failure Mode 1: The Ambiguous Network Timeout (Duplicate Sales Hazard)

1. Cashier finishes sale offline; device connects and pushes operation `op-123`.
2. The server processes the sale, writes the database records, but the register loses Wi-Fi before receiving the HTTP 200 response.
3. If the client regenerates a new `operation_id` on the next sync attempt, the backend will treat it as a second distinct sale, charging the customer twice and double-deducting stock.

- **Defense:** Never regenerate an `operation_id` during retries. Retries must always resend the original `operation_id`.

### Failure Mode 2: The In-Memory False Acknowledgment

1. Cashier taps "Charge Cash". The component sets `isSuccess = true` in React state and displays the green receipt screen.
2. The cashier closes the laptop or the terminal loses power before the asynchronous IndexedDB write resolves.
3. The customer leaves with the merchandise, but no record of the sale exists anywhere.

- **Defense:** Always `await` the Dexie transaction committing both the sale record and the outbox entry _before_ updating React state to show the success confirmation.

### Failure Mode 3: Cross-Tenant Sync Leakage

1. A cashier works offline at "Main Store" (queued operations in IndexedDB).
2. A manager later logs into "Pop-Up Store" on the same device.
3. If the sync worker blindly flushes the outbox without filtering by the active authenticated store, "Main Store" operations are submitted under the "Pop-Up Store" authorization token.

- **Defense:** Tag every outbox entry with `storeId`. Before flushing, verify that `outboxItem.storeId === currentActiveStore.id`.

### Required Automated Test Verifications

Before shipping offline sync features, write tests verifying:

1. **Durable Persistence Test:** Mock an unexpected error or abort after the local write; verify that the outbox entry and sale record remain completely intact in Dexie.
2. **Ambiguous Timeout Replay:** Simulate a failed network request followed by a retry using the same `operation_id`; verify that the payload and ID are unchanged.
3. **Atomic Acknowledgment Test:** Verify that when `handlePushResponse` runs, the status update and outbox deletion happen within the same transaction.
4. **Conflict Status Transition:** Mock a `NEEDS_REVIEW` response from the backend; verify that the local sale updates to `NEEDS_REVIEW` and is removed from pending outbox items.

---

## Layer 4 — Minimal Reference Contrasts

### Unsafe Acknowledgment vs Safe Durable Commit

```typescript
// UNSAFE: Acknowledges before durable storage finishes
function handleSaleUnsafe(saleData) {
  setSuccessState(true); // User sees "Complete!" immediately
  void localDb.sales.add(saleData); // If tab crashes now, sale is lost forever!
}

// SAFE: Durable commit MUST complete before user acknowledgment
async function handleSaleSafe(storeId: string, saleData: SaleInput): Promise<string> {
  const operationId = crypto.randomUUID();

  // Commit sale and outbox atomically
  await localDb.transaction("rw", [localDb.sales, localDb.outbox], async () => {
    await localDb.sales.add({ ...saleData, id: operationId, storeId, syncStatus: "PENDING_SYNC" });
    await localDb.outbox.add({
      id: operationId,
      storeId,
      operationType: "SALE_CREATE",
      payload: saleData,
      createdAt: Date.now(),
    });
  });

  // Only acknowledged after durable persistence succeeds
  setSuccessState(true);
  return operationId;
}
```

### Atomic Response Processing

```typescript
// SAFE: Atomic update of status and outbox dequeue
await localDb.transaction("rw", [localDb.sales, localDb.outbox], async () => {
  if (result.status === "SUCCESS" || result.status === "DUPLICATE") {
    await localDb.sales.update(result.operation_id, { syncStatus: "SYNCED" });
    await localDb.outbox.delete(result.operation_id);
  } else if (result.status === "NEEDS_REVIEW") {
    await localDb.sales.update(result.operation_id, { syncStatus: "NEEDS_REVIEW" });
    await localDb.outbox.delete(result.operation_id); // Dequeue from retry loop
  }
});
```
