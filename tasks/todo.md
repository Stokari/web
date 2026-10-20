# Stokari Task Tracking (Week 1 & Kickoff)

Baseline: [SDD v0.4](file:///home/abelmekonen/Desktop/INSA/backend/docs/implementation_plan.md) · Target: Two-Device Sync Prototype (AT-06)

---

## Phase 1: Foundations, Tenancy & Two-Device Prototype (Week 1)

### Developer D (Infrastructure, Identity & Shops)

- [ ] Task D1: Create `common/kernel` (Result type, DomainError, typed IDs).
- [ ] Task D2: Create `common/persistence` (`ShopScopedRepository` base class, `transaction.py` atomic wrapper).
- [ ] Task D3: Implement `apps/shops` models (`Shop`, `Membership`, `Invite`) with composite primary keys spike (`0001` migration).
- [ ] Task D4: Implement `apps/identity` models (`User`, `OfflineLease`, `RefreshToken`) and Google OIDC verification adapter.
- [ ] Task D5: Implement DRF `ActorAuthentication` and permission classes (`ActiveMembership`, `ShopOpen`, `RolePermission`).
- [ ] Task D6: Configure contract bundle export script (`scripts/export_contract.py`).

### Developer A (Server Core, Ledger & Sync)

- [ ] Task A1: Implement `apps/ledger/domain/money.py` and `quantity.py` with integer santim and milli-unit half-up rounding.
- [ ] Task A2: Implement `apps/ledger` models (`StockChange`, `StockLevel`) with `CompositePrimaryKey("shop", "id")`.
- [ ] Task A3: Add PostgreSQL `forbid_mutation()` trigger migration for append-only `stock_change`.
- [ ] Task A4: Implement `LedgerService.append()` with deterministic lock ordering (`select_for_update().order_by('product_id')`).
- [ ] Task A5: Implement `apps/sync` basic push/pull endpoints with per-shop write lock for the prototype.
- [ ] Task A6: Write concurrency test: two simulated devices with stock 10, sales 7 and 6 (AT-06 prototype).

### Developer B (Web Data Layer & Sync Engine)

- [ ] Task B1: Setup Dexie schema in `src/data/db.ts` with multi-tenant isolation (`stokari:{shopId}:{userId}`).
- [ ] Task B2: Implement `src/core/domain/money.ts` and `quantity.ts` using `BigInt` (verified against `money-vectors.json`).
- [ ] Task B3: Implement `src/session/` (token memory storage, refresh rotation, lease validity, clock-rollback guard).
- [ ] Task B4: Implement `src/data/unit-of-work.ts` for atomic Dexie transactions.
- [ ] Task B5: Build client push and pull stages in `src/sync/` with Web Lock (`stokari-sync-shopId`).

### Developer C (Web Features, Layout & UI)

- [ ] Task C1: Build PWA app shell, responsive navigation (bottom tab bar for mobile, sidebar for desktop).
- [ ] Task C2: Implement Google Sign-In button and authenticated route guards (`useAuth`).
- [ ] Task C3: Build Top Status Bar with `SyncPill` component (Offline, Syncing, Up to date, Needs review).
- [ ] Task C4: Build Staff management screen for owners (invitation link generator, member list, deactivate button).
- [ ] Task C5: Build base design system components in `src/ui/` (Button, Input, Sheet, StatusBadge).

---

## Definition of Done (Week 1 Exit Criteria)

- [ ] Automated CI passes: `uv run ruff check .`, `uv run python manage.py check`, `uv run python manage.py test`.
- [ ] Frontend tests pass: `vp check`, `vp test`, `vp build`.
- [ ] Cross-shop isolation test (T-20 / AT-10) passes.
- [ ] Two-device sync prototype demonstrates AT-06 (Stock 10: Sales 7 & 6 preserved, ledger −3, case opened).
