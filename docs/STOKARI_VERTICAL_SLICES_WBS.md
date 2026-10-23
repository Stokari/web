# Stokari · 188-Task Granular Vertical Slices WBS

> **Architecture Baseline:** SDD v0.4 & SRS v0.5 · Total Tasks: **188 Discrete Deliverables**
> **Delivery Strategy:** Decomposed into **33 Cohesive Vertical Feature Slices** spanning Frontend UI, Backend API, Database Invariants, and Automated Tests.

---

## Master Vertical Slices Index

| Slice ID  | Vertical Feature Domain                                     |  Tasks  |   Task Range    | Core Subsystem Scope                                                                                                                         |
| :-------- | :---------------------------------------------------------- | :-----: | :-------------: | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **VS-01** | **System Baseline & Dual Repository Toolchain**             |  **2**  |   `#1` – `#2`   | Full-stack developer environments for Python 3.14 (Django + uv) and TypeScript (Vite+ + React 19).                                           |
| **VS-02** | **Contract-First Architecture & Kernel Primitives**         |  **8**  |  `#3` – `#10`   | Innermost domain primitives (Result, DomainError, typed IDs) and the automated contract sync loop.                                           |
| **VS-03** | **Store Registration, Tenancy & Store Switcher**            |  **6**  |  `#11` – `#16`  | Store onboarding, composite primary key tenancy, shop settings, store closure, and multi-store switcher UI.                                  |
| **VS-04** | **Google OIDC Authentication & Client Session Security**    |  **5**  |  `#17` – `#21`  | Google OAuth token validation, custom ActorAuthentication, token rotation, and clock-rollback guards.                                        |
| **VS-05** | **Staff Management, Invites & Offline Leases**              |  **6**  |  `#22` – `#27`  | Attendant invitations, lease expiration handling, instant deactivation, and persistent storage diagnostics.                                  |
| **VS-06** | **Money & Quantity Cross-Platform Math Engines**            |  **3**  |  `#28` – `#30`  | Shared Python and TypeScript mathematical engines for integer santim, fractional milli-units, and rounding.                                  |
| **VS-07** | **Master Product Catalog & Table/Card Views**               |  **8**  |  `#31` – `#38`  | Product model with composite PK, DRF viewsets, responsive DataTable (desktop) and card list (mobile).                                        |
| **VS-08** | **Product Packaging & Bulk Container Conversions**          |  **4**  |  `#39` – `#42`  | Packaging definition rules (crates vs pieces), container multipliers, and the product creation wizard.                                       |
| **VS-09** | **Bilingual Amharic Search Normalization**                  |  **4**  |  `#43` – `#46`  | Ethiopic homophone folding (ሀ/ሐ/ኀ, ሰ/ሠ), sub-second in-memory search trie, and Noto Sans Ethiopic typography.                                |
| **VS-10** | **POS Cashier Till & Staple Shortcuts**                     |  **4**  |  `#47` – `#50`  | Sub-10-second cashier till layout, 1-tap grocery staple shortcuts (Sugar, Rice, Oil, Coffee), and mobile segmented tabs.                     |
| **VS-11** | **POS Cart, Keypad & Payment Selector**                     |  **5**  |  `#51` – `#55`  | Cart management, line total math, 3-button tender selector, decimal keypad sheet, and 54px thumb CTA.                                        |
| **VS-12** | **POS Durable Sales & Local Checkout (INV-01)**             |  **6**  |  `#56` – `#61`  | Atomic Dexie transaction saving Sale + lines + outbox before UI confirmation, PostgreSQL sales schema, and immutability.                     |
| **VS-13** | **Sale Cancellations & Compensating Ledger Audits**         |  **2**  |  `#62` – `#63`  | Compensating SALE_CANCELLATION movements, reversesId foreign keys, idempotent double-cancels, and cancellation UI.                           |
| **VS-14** | **Append-Only Stock Movement Ledger Core**                  |  **5**  |  `#64` – `#68`  | PostgreSQL StockChange table with immutability triggers, StockLogService.append with ascending row locks, and reconciliation tool.           |
| **VS-15** | **Client Stock Projections & Dexie UnitOfWork**             |  **5**  |  `#69` – `#73`  | Dexie stock tables, local projection algorithm (confirmedQty + pendingDelta), atomic unit of work, and recovery rebuild.                     |
| **VS-16** | **Stock Receiving & Supplier Intake**                       |  **5**  |  `#74` – `#78`  | Multi-line supplier shipment receiving, container-to-unit cost calculation with half-up rounding, and Receive Stock modal.                   |
| **VS-17** | **Manual Stock Adjustments & Shrinkage**                    |  **6**  |  `#79` – `#84`  | Mandatory reason codes (Damage, Loss, Count Correction), delta adjustments, low-stock threshold badges, and summary cards.                   |
| **VS-18** | **Stock Movement History & Audit Drawer**                   |  **2**  |  `#85` – `#86`  | Stock overview screen, movement history list, and slide-out audit drawer displaying cryptographic hashes.                                    |
| **VS-19** | **Offline Sync Server Push Pipeline & Idempotency**         |  **8**  |  `#87` – `#94`  | POST /v1/sync/push, per-shop row locks, ProcessedOperation idempotency, ChangeLog sequence allocation, and outcome matrix.                   |
| **VS-20** | **Client Outbox Dispatcher & Multi-Tab Web Lock**           |  **4**  |  `#95` – `#98`  | Client outbox batch push (<=50 ops), exponential backoff with jitter, Web Lock coordinator, and ResultApplier.                               |
| **VS-21** | **Offline Sync Pull Pipeline & Device Hydration**           |  **8**  | `#99` – `#106`  | GET /v1/sync/pull cursor-based deltas, initial bootstrap, CURSOR_RESET, reachability probe, and header SyncPill.                             |
| **VS-22** | **AT-06 Conflict Detection & Review Queue**                 |  **8**  | `#107` – `#114` | StockBecameNegative event, ConflictCase model, Sell Anyway warning sheet, and owner review queue with parallel timeline.                     |
| **VS-23** | **Conflict Arbitration & Owner Resolution Actions**         |  **7**  | `#115` – `#121` | ResolveConflictHandler with optimistic locking, 3 resolution actions (Restock, Cancel, Acknowledge), and in-app notifications.               |
| **VS-24** | **Deactivated Staff Drain Flow & Security Quarantine**      |  **5**  | `#122` – `#126` | 10-minute drain token JWT, quarantine isolation (zero ledger impact), and owner Accept/Reject inspection tab.                                |
| **VS-25** | **Today's Revenue Dashboard (3-Bucket Accounting)**         |  **6**  | `#127` – `#132` | Offline Dexie aggregation grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review), and Today screen.                 |
| **VS-26** | **Inventory Capital Valuation & Restock Alerts**            |  **3**  | `#133` – `#135` | Store asset valuation calculation (sum max(qty, 0) x costSantim), uncosted item helper text, and restock warning cards.                      |
| **VS-27** | **Data Backup & Emergency Outbox Export**                   |  **3**  | `#136` – `#138` | Streaming CSV exports, client emergency backup file generator (stokari-pending-export/v1.json), and export buttons.                          |
| **VS-28** | **Physical Inventory Count & Variance Reconciliation**      |  **6**  | `#139` – `#144` | CountSession model, shelf count entry sheet, server proposed variance accounting for intermediate sales, and COUNT_CORRECTION movement.      |
| **VS-29** | **Standalone Local-Only Kiosk Mode**                        |  **4**  | `#145` – `#148` | meta.mode = 'LOCAL_ONLY' toggle, persistent offline banner, export/import migration bundle, and transition documentation.                    |
| **VS-30** | **Design System Primitives & Responsive Shell**             |  **8**  | `#149` – `#156` | CSS variables (Cobalt #1E40AF), primitive component library with 44px targets, desktop sidebar, virtualized DataTable, and light-only audit. |
| **VS-31** | **Concurrency, Property & End-to-End Simulation**           |  **9**  | `#157` – `#165` | Multi-threaded race condition tests, Hypothesis property tests (1,000 runs), fast-check, Playwright two-device conflict simulation (AT-06).  |
| **VS-32** | **Quality Gates, Accessibility & Traceability Enforcement** | **13**  | `#166` – `#178` | trace_check.py requirement gate, WCAG 2.1 AA axe-core audit, bundle size <=2MB, usability study with 5 users, and visual regressions.        |
| **VS-33** | **Deferred Cloud Infrastructure & Disaster Recovery**       | **10**  | `#179` – `#188` | Post-development cloud deployment: Render API, Vercel web, Neon cloud database, Sentry, and nightly backup restore tests.                    |
| **TOTAL** | **Full System Delivery**                                    | **188** |  `#1` – `#188`  | **33 End-to-End Vertical Slices**                                                                                                            |

---

## VS-01: System Baseline & Dual Repository Toolchain

> **Feature Scope:** Full-stack developer environments for Python 3.14 (Django + uv) and TypeScript (Vite+ + React 19).
> **Task Range:** `#1` through `#2` (2 tasks)

### Task #1: [VS-01-01] Init stokari-api Django + uv, Ruff, mypy, import-linter, pytest, drf-spectacular _(Orig #1)_

- **Layer:** `Backend / Tooling` | **Priority:** **Must**
- **Target Files:** `backend/pyproject.toml, backend/backend/settings.py`
- **Architectural Scope & Invariants:** Python 3.14 environment locked with uv. Strict mypy type-checking, import-linter boundary gates, and drf-spectacular OpenAPI generator.
- **Deliverable & Acceptance Criteria:** uv run ruff check . and uv run python manage.py check pass with 0 errors.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-01-01] #1 - Init stokari-api Django + uv, Ruff, mypy, import-linter, pyt..." --label "backend,tooling,must,vs-01" --body "### Architectural Scope\nPython 3.14 environment locked with uv. Strict mypy type-checking, import-linter boundary gates, and drf-spectacular OpenAPI generator.\n\n### Deliverable\nuv run ruff check . and uv run python manage.py check pass with 0 errors.\n\nFiles: backend/pyproject.toml, backend/backend/settings.py"
  ```

### Task #2: [VS-01-02] Init stokari-web Vite+React+TS + Vitest, Playwright, dependency-cruiser, ESLint _(Orig #2)_

- **Layer:** `Frontend / Tooling` | **Priority:** **Must**
- **Target Files:** `web/package.json, web/vite.config.ts, web/tsconfig.json`
- **Architectural Scope & Invariants:** React 19 + TypeScript strict mode with Vite+ unified toolchain (vp), Vitest test runner, and dependency-cruiser architecture rules.
- **Deliverable & Acceptance Criteria:** vp check and vp test execute cleanly.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-01-02] #2 - Init stokari-web Vite+React+TS + Vitest, Playwright, depende..." --label "frontend,tooling,must,vs-01" --body "### Architectural Scope\nReact 19 + TypeScript strict mode with Vite+ unified toolchain (vp), Vitest test runner, and dependency-cruiser architecture rules.\n\n### Deliverable\nvp check and vp test execute cleanly.\n\nFiles: web/package.json, web/vite.config.ts, web/tsconfig.json"
  ```

---

## VS-02: Contract-First Architecture & Kernel Primitives

> **Feature Scope:** Innermost domain primitives (Result, DomainError, typed IDs) and the automated contract sync loop.
> **Task Range:** `#3` through `#10` (8 tasks)

### Task #3: [VS-02-01] common/kernel: Result, DomainError, typed IDs (ShopId, OpId, ProductId), Clock port, event bus _(Orig #9)_

- **Layer:** `Backend / Core` | **Priority:** **Must**
- **Target Files:** `backend/common/kernel/{types,result,errors,bus,clock}.py`
- **Architectural Scope & Invariants:** Pure Python zero-dependency primitives. Strongly typed NewType identifiers prevent ID swaps. Result[T, E] monad replaces unhandled exceptions.
- **Deliverable & Acceptance Criteria:** Unit tests pass with 100% test coverage.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-01] #3 - common/kernel: Result, DomainError, typed IDs (ShopId, OpId,..." --label "backend,core,must,vs-02" --body "### Architectural Scope\nPure Python zero-dependency primitives. Strongly typed NewType identifiers prevent ID swaps. Result[T, E] monad replaces unhandled exceptions.\n\n### Deliverable\nUnit tests pass with 100% test coverage.\n\nFiles: backend/common/kernel/{types,result,errors,bus,clock}.py"
  ```

### Task #4: [VS-02-02] common/http: RFC 9457 handler, request-id middleware, throttles, StrictIntegerField, pagination _(Orig #10)_

- **Layer:** `Backend / HTTP` | **Priority:** **Must**
- **Target Files:** `backend/common/http/{errors,middleware,serializers,pagination}.py`
- **Architectural Scope & Invariants:** RFC 9457 Problem Details error schema. Request ID correlation tracking. StrictIntegerField preventing float coercion in money and quantities.
- **Deliverable & Acceptance Criteria:** HTTP base classes and serializers pass unit tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-02] #4 - common/http: RFC 9457 handler, request-id middleware, thrott..." --label "backend,http,must,vs-02" --body "### Architectural Scope\nRFC 9457 Problem Details error schema. Request ID correlation tracking. StrictIntegerField preventing float coercion in money and quantities.\n\n### Deliverable\nHTTP base classes and serializers pass unit tests.\n\nFiles: backend/common/http/{errors,middleware,serializers,pagination}.py"
  ```

### Task #5: [VS-02-03] common/persistence: TransactionManager (atomic + shop_lock), ShopScopedRepository, domain_event outbox _(Orig #11)_

- **Layer:** `Backend / Persistence` | **Priority:** **Must**
- **Target Files:** `backend/common/persistence/{manager,repository,outbox}.py`
- **Architectural Scope & Invariants:** ShopScopedRepository automatically scopes all database queries by shop_id. TransactionManager wraps multi-table writes under shop lock.
- **Deliverable & Acceptance Criteria:** Repository base classes verified with multi-tenant mock tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-03] #5 - common/persistence: TransactionManager (atomic + shop_lock),..." --label "backend,persistence,must,vs-02" --body "### Architectural Scope\nShopScopedRepository automatically scopes all database queries by shop_id. TransactionManager wraps multi-table writes under shop lock.\n\n### Deliverable\nRepository base classes verified with multi-tenant mock tests.\n\nFiles: backend/common/persistence/{manager,repository,outbox}.py"
  ```

### Task #6: [VS-02-04] apps/shops/domain/permissions.py → contract/fixtures/permissions.json _(Orig #12)_

- **Layer:** `Shared Contract` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/domain/permissions.py, contract/fixtures/permissions.json`
- **Architectural Scope & Invariants:** Role-Permission matrix mapping OWNER vs ATTENDANT permissions across all operations, exported to a machine-readable JSON fixture.
- **Deliverable & Acceptance Criteria:** Fixture generation script produces valid permissions.json.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-04] #6 - apps/shops/domain/permissions.py → contract/fixtures/permiss..." --label "shared contract,must,vs-02" --body "### Architectural Scope\nRole-Permission matrix mapping OWNER vs ATTENDANT permissions across all operations, exported to a machine-readable JSON fixture.\n\n### Deliverable\nFixture generation script produces valid permissions.json.\n\nFiles: backend/apps/shops/domain/permissions.py, contract/fixtures/permissions.json"
  ```

### Task #7: [VS-02-05] Contract bundle workflow: export_contract.py, contract-release.yml, contract.lock, pnpm contract:sync _(Orig #5)_

- **Layer:** `Tooling / Contract` | **Priority:** **Must**
- **Target Files:** `backend/scripts/export_contract.py, web/scripts/sync_contract.sh`
- **Architectural Scope & Invariants:** Automated contract synchronization loop pulling OpenAPI schema and generating TypeScript types in web/src/contract.
- **Deliverable & Acceptance Criteria:** Contract sync regenerates TypeScript types without manual edits.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-05] #7 - Contract bundle workflow: export_contract.py, contract-relea..." --label "tooling,contract,must,vs-02" --body "### Architectural Scope\nAutomated contract synchronization loop pulling OpenAPI schema and generating TypeScript types in web/src/contract.\n\n### Deliverable\nContract sync regenerates TypeScript types without manual edits.\n\nFiles: backend/scripts/export_contract.py, web/scripts/sync_contract.sh"
  ```

### Task #8: [VS-02-06] Shared fixtures: money-vectors.json, quantity-vectors.json, payload-hash-vectors.json, permissions.json, error-codes.json, sample-operations/*.json _(Orig #159)_

- **Layer:** `Shared Fixtures` | **Priority:** **Must**
- **Target Files:** `contract/fixtures/*.json`
- **Architectural Scope & Invariants:** Committed canonical test vectors shared between backend Python and frontend TypeScript test suites.
- **Deliverable & Acceptance Criteria:** All shared fixtures committed and verified.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-06] #8 - Shared fixtures: money-vectors.json, quantity-vectors.json, ..." --label "shared fixtures,must,vs-02" --body "### Architectural Scope\nCommitted canonical test vectors shared between backend Python and frontend TypeScript test suites.\n\n### Deliverable\nAll shared fixtures committed and verified.\n\nFiles: contract/fixtures/*.json"
  ```

### Task #9: [VS-02-07] Web contract tests: run every sample operation through Zod schemas; money/quantity vectors match Python _(Orig #167)_

- **Layer:** `Frontend / Contract` | **Priority:** **Must**
- **Target Files:** `web/src/contract/__tests__/contract-validation.test.ts`
- **Architectural Scope & Invariants:** Contract tests asserting frontend TypeScript schemas and vectors match Python backend outputs exactly.
- **Deliverable & Acceptance Criteria:** Vitest contract tests pass across all sample operations.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-07] #9 - Web contract tests: run every sample operation through Zod s..." --label "frontend,contract,must,vs-02" --body "### Architectural Scope\nContract tests asserting frontend TypeScript schemas and vectors match Python backend outputs exactly.\n\n### Deliverable\nVitest contract tests pass across all sample operations.\n\nFiles: web/src/contract/__tests__/contract-validation.test.ts"
  ```

### Task #10: [VS-02-08] OpenAPI diff in CI: fails if openapi.json stale vs code _(Orig #172)_

- **Layer:** `CI / Quality` | **Priority:** **Must**
- **Target Files:** `.github/workflows/contract-diff.yml`
- **Architectural Scope & Invariants:** CI check verifying that openapi.json matches current code before merging pull requests.
- **Deliverable & Acceptance Criteria:** CI fails when API changes are not reflected in openapi.json.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-02-08] #10 - OpenAPI diff in CI: fails if openapi.json stale vs code..." --label "ci,quality,must,vs-02" --body "### Architectural Scope\nCI check verifying that openapi.json matches current code before merging pull requests.\n\n### Deliverable\nCI fails when API changes are not reflected in openapi.json.\n\nFiles: .github/workflows/contract-diff.yml"
  ```

---

## VS-03: Store Registration, Tenancy & Store Switcher

> **Feature Scope:** Store onboarding, composite primary key tenancy, shop settings, store closure, and multi-store switcher UI.
> **Task Range:** `#11` through `#16` (6 tasks)

### Task #11: [VS-03-01] Django models: Shop, Membership, User, OfflineLease, RefreshToken, Invite, Device (composite PKs) _(Orig #13)_

- **Layer:** `Backend / Models` | **Priority:** **Must**
- **Target Files:** `backend/apps/{shops,identity}/models.py`
- **Architectural Scope & Invariants:** PostgreSQL schema using CompositePrimaryKey('shop', 'id') on all tenant tables. 5-attendant limit per shop. OfflineLease temporal windows.
- **Deliverable & Acceptance Criteria:** Initial Django migration (0001_initial.py) running cleanly on PostgreSQL.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-01] #11 - Django models: Shop, Membership, User, OfflineLease, Refresh..." --label "backend,models,must,vs-03" --body "### Architectural Scope\nPostgreSQL schema using CompositePrimaryKey('shop', 'id') on all tenant tables. 5-attendant limit per shop. OfflineLease temporal windows.\n\n### Deliverable\nInitial Django migration (0001_initial.py) running cleanly on PostgreSQL.\n\nFiles: backend/apps/{shops,identity}/models.py"
  ```

### Task #12: [VS-03-02] Migrations 0001 (composite PKs) + 0002_protections (immutability triggers, composite FKs via RunSQL) _(Orig #14)_

- **Layer:** `Backend / DB` | **Priority:** **Must**
- **Target Files:** `backend/apps/{shops,identity}/migrations/0002_protections.py`
- **Architectural Scope & Invariants:** PostgreSQL RunSQL migration adding foreign keys referencing composite (shop_id, id) keys and database-level immutability triggers.
- **Deliverable & Acceptance Criteria:** Database migrations execute idempotently and enforce composite referential integrity.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-02] #12 - Migrations 0001 (composite PKs) + 0002_protections (immutabi..." --label "backend,db,must,vs-03" --body "### Architectural Scope\nPostgreSQL RunSQL migration adding foreign keys referencing composite (shop_id, id) keys and database-level immutability triggers.\n\n### Deliverable\nDatabase migrations execute idempotently and enforce composite referential integrity.\n\nFiles: backend/apps/{shops,identity}/migrations/0002_protections.py"
  ```

### Task #13: [VS-03-03] Endpoints: POST /shops (idempotency key), GET /shops/me, POST /shops/me/close (confirmation flow) _(Orig #17)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/views.py, backend/apps/shops/serializers.py`
- **Architectural Scope & Invariants:** Store creation with idempotency key, store settings inspection, and confirmation-protected store closure with cascade lease revocation.
- **Deliverable & Acceptance Criteria:** Shop lifecycle endpoints tested with role permission assertions.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-03] #13 - Endpoints: POST /shops (idempotency key), GET /shops/me, POS..." --label "backend,api,must,vs-03" --body "### Architectural Scope\nStore creation with idempotency key, store settings inspection, and confirmation-protected store closure with cascade lease revocation.\n\n### Deliverable\nShop lifecycle endpoints tested with role permission assertions.\n\nFiles: backend/apps/shops/views.py, backend/apps/shops/serializers.py"
  ```

### Task #14: [VS-03-04] Management commands: transfer_ownership, purge_closed_shop _(Orig #21)_

- **Layer:** `Backend / Ops` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/management/commands/{transfer_ownership,purge_closed_shop}.py`
- **Architectural Scope & Invariants:** CLI tools for store ownership transfer and soft-deleted store data purging after 30-day grace period.
- **Deliverable & Acceptance Criteria:** Management commands pass dry-run and execution tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-04] #14 - Management commands: transfer_ownership, purge_closed_shop..." --label "backend,ops,must,vs-03" --body "### Architectural Scope\nCLI tools for store ownership transfer and soft-deleted store data purging after 30-day grace period.\n\n### Deliverable\nManagement commands pass dry-run and execution tests.\n\nFiles: backend/apps/shops/management/commands/{transfer_ownership,purge_closed_shop}.py"
  ```

### Task #15: [VS-03-05] Web: Multi-shop selection screen (if user has >1 membership) _(Orig #25)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/shops/ShopSelectorScreen.tsx`
- **Architectural Scope & Invariants:** Store selection interface allowing users with multiple memberships to pick their active store workspace.
- **Deliverable & Acceptance Criteria:** Shop selector transitions smoothly and updates active tenant context.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-05] #15 - Web: Multi-shop selection screen (if user has >1 membership)..." --label "frontend,ui,must,vs-03" --body "### Architectural Scope\nStore selection interface allowing users with multiple memberships to pick their active store workspace.\n\n### Deliverable\nShop selector transitions smoothly and updates active tenant context.\n\nFiles: web/src/features/shops/ShopSelectorScreen.tsx"
  ```

### Task #16: [VS-03-06] Web: Create shop flow (first-time owner) + Accept invite flow (attendant) _(Orig #26)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/onboarding/{CreateShopWizard,AcceptInviteScreen}.tsx`
- **Architectural Scope & Invariants:** First-time owner store initialization wizard and attendant invite link redemption view.
- **Deliverable & Acceptance Criteria:** Onboarding flows complete end-to-end and initialize local database partition.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-03-06] #16 - Web: Create shop flow (first-time owner) + Accept invite flo..." --label "frontend,ui,must,vs-03" --body "### Architectural Scope\nFirst-time owner store initialization wizard and attendant invite link redemption view.\n\n### Deliverable\nOnboarding flows complete end-to-end and initialize local database partition.\n\nFiles: web/src/features/onboarding/{CreateShopWizard,AcceptInviteScreen}.tsx"
  ```

---

## VS-04: Google OIDC Authentication & Client Session Security

> **Feature Scope:** Google OAuth token validation, custom ActorAuthentication, token rotation, and clock-rollback guards.
> **Task Range:** `#17` through `#21` (5 tasks)

### Task #17: [VS-04-01] AuthProvider + ActorAuthentication DRF class (verifies access JWT/drain token → Actor dataclass) _(Orig #15)_

- **Layer:** `Backend / Auth` | **Priority:** **Must**
- **Target Files:** `backend/apps/identity/authentication.py`
- **Architectural Scope & Invariants:** Custom DRF authentication populating request.user with an immutable Actor dataclass. Completely bypasses django.contrib.auth production tables.
- **Deliverable & Acceptance Criteria:** Authentication tests asserting valid JWT resolves Actor and invalid token returns 401.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-04-01] #17 - AuthProvider + ActorAuthentication DRF class (verifies acces..." --label "backend,auth,must,vs-04" --body "### Architectural Scope\nCustom DRF authentication populating request.user with an immutable Actor dataclass. Completely bypasses django.contrib.auth production tables.\n\n### Deliverable\nAuthentication tests asserting valid JWT resolves Actor and invalid token returns 401.\n\nFiles: backend/apps/identity/authentication.py"
  ```

### Task #18: [VS-04-02] Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/refresh, POST /auth/lease, POST /auth/logout _(Orig #16)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/identity/views.py, backend/apps/identity/serializers.py`
- **Architectural Scope & Invariants:** Google ID token validation via google-auth library. PyJWT issuance for access/refresh pairs. Offline lease token generation (1-30 days duration).
- **Deliverable & Acceptance Criteria:** End-to-end API test suite covering full authentication handshake.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-04-02] #18 - Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/re..." --label "backend,api,must,vs-04" --body "### Architectural Scope\nGoogle ID token validation via google-auth library. PyJWT issuance for access/refresh pairs. Offline lease token generation (1-30 days duration).\n\n### Deliverable\nEnd-to-end API test suite covering full authentication handshake.\n\nFiles: backend/apps/identity/views.py, backend/apps/identity/serializers.py"
  ```

### Task #19: [VS-04-03] Permission classes: ActiveMembership, ShopOpen, RolePermission (reads from fixture) _(Orig #20)_

- **Layer:** `Backend / Security` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/permissions.py`
- **Architectural Scope & Invariants:** DRF permission gates: ActiveMembership ensures user is not deactivated, ShopOpen ensures store is not closed, RolePermission validates action against permissions.json.
- **Deliverable & Acceptance Criteria:** Permission tests verifying owner-only actions return 403 to attendants (T-19).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-04-03] #19 - Permission classes: ActiveMembership, ShopOpen, RolePermissi..." --label "backend,security,must,vs-04" --body "### Architectural Scope\nDRF permission gates: ActiveMembership ensures user is not deactivated, ShopOpen ensures store is not closed, RolePermission validates action against permissions.json.\n\n### Deliverable\nPermission tests verifying owner-only actions return 403 to attendants (T-19).\n\nFiles: backend/apps/shops/permissions.py"
  ```

### Task #20: [VS-04-04] Web: session management (tokens in memory, refresh in IndexedDB, lease check, clock-rollback guard) _(Orig #22)_

- **Layer:** `Frontend / Session` | **Priority:** **Must**
- **Target Files:** `web/src/session/{token-manager,lease-guard,clock}.ts`
- **Architectural Scope & Invariants:** Access token stored exclusively in memory (protecting against XSS). Refresh token in IndexedDB. Clock-rollback detector tracking meta.maxSeenTime.
- **Deliverable & Acceptance Criteria:** Session manager tests asserting clock tampering triggers immediate security lock.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-04-04] #20 - Web: session management (tokens in memory, refresh in Indexe..." --label "frontend,session,must,vs-04" --body "### Architectural Scope\nAccess token stored exclusively in memory (protecting against XSS). Refresh token in IndexedDB. Clock-rollback detector tracking meta.maxSeenTime.\n\n### Deliverable\nSession manager tests asserting clock tampering triggers immediate security lock.\n\nFiles: web/src/session/{token-manager,lease-guard,clock}.ts"
  ```

### Task #21: [VS-04-05] Web: Google Sign-In flow, Auth context (useAuth), authenticated route guards _(Orig #23)_

- **Layer:** `Frontend / Auth` | **Priority:** **Must**
- **Target Files:** `web/src/features/auth/{AuthContext,GoogleSignInButton,RequireAuth}.tsx`
- **Architectural Scope & Invariants:** React 19 context managing authentication state. Automatic silent refresh token rotation. Route guards redirecting unauthenticated users to login.
- **Deliverable & Acceptance Criteria:** Sign-in and session restore verified in browser integration tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-04-05] #21 - Web: Google Sign-In flow, Auth context (useAuth), authentica..." --label "frontend,auth,must,vs-04" --body "### Architectural Scope\nReact 19 context managing authentication state. Automatic silent refresh token rotation. Route guards redirecting unauthenticated users to login.\n\n### Deliverable\nSign-in and session restore verified in browser integration tests.\n\nFiles: web/src/features/auth/{AuthContext,GoogleSignInButton,RequireAuth}.tsx"
  ```

---

## VS-05: Staff Management, Invites & Offline Leases

> **Feature Scope:** Attendant invitations, lease expiration handling, instant deactivation, and persistent storage diagnostics.
> **Task Range:** `#22` through `#27` (6 tasks)

### Task #22: [VS-05-01] Endpoints: POST /shops/me/invites, POST /invites/{token}/accept _(Orig #18)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/invites.py`
- **Architectural Scope & Invariants:** Cryptographic invite token generator with 48-hour expiration. Atomic counter verification enforcing the 5-attendant quota under concurrency.
- **Deliverable & Acceptance Criteria:** Invitation generation and redemption verified with race condition test.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-01] #22 - Endpoints: POST /shops/me/invites, POST /invites/{token}/acc..." --label "backend,api,must,vs-05" --body "### Architectural Scope\nCryptographic invite token generator with 48-hour expiration. Atomic counter verification enforcing the 5-attendant quota under concurrency.\n\n### Deliverable\nInvitation generation and redemption verified with race condition test.\n\nFiles: backend/apps/shops/invites.py"
  ```

### Task #23: [VS-05-02] Endpoints: GET /shops/me/members, POST /shops/me/members/{id}/deactivate _(Orig #19)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/shops/members.py`
- **Architectural Scope & Invariants:** Immediate attendant deactivation: invalidates active leases, revokes refresh tokens, and provisions a 10-minute drain token.
- **Deliverable & Acceptance Criteria:** Deactivation endpoint tested asserting immediate rejection on subsequent requests (AT-09).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-02] #23 - Endpoints: GET /shops/me/members, POST /shops/me/members/{id..." --label "backend,api,must,vs-05" --body "### Architectural Scope\nImmediate attendant deactivation: invalidates active leases, revokes refresh tokens, and provisions a 10-minute drain token.\n\n### Deliverable\nDeactivation endpoint tested asserting immediate rejection on subsequent requests (AT-09).\n\nFiles: backend/apps/shops/members.py"
  ```

### Task #24: [VS-05-03] Web: Staff management screen (invite attendants, list members, deactivate) _(Orig #24)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/staff/{StaffScreen,MemberList,InviteModal}.tsx`
- **Architectural Scope & Invariants:** Owner UI showing active cashier leases, remaining days, invite link generator, and 1-tap attendant deactivation button.
- **Deliverable & Acceptance Criteria:** Staff screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-03] #24 - Web: Staff management screen (invite attendants, list member..." --label "frontend,ui,must,vs-05" --body "### Architectural Scope\nOwner UI showing active cashier leases, remaining days, invite link generator, and 1-tap attendant deactivation button.\n\n### Deliverable\nStaff screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/staff/{StaffScreen,MemberList,InviteModal}.tsx"
  ```

### Task #25: [VS-05-04] Web: navigator.storage.persist() requested at first run; quota warnings in Settings _(Orig #153)_

- **Layer:** `Frontend / Storage` | **Priority:** **Must**
- **Target Files:** `web/src/data/persistence-manager.ts`
- **Architectural Scope & Invariants:** Requests persistent storage permission from the browser to prevent automated cache eviction on Android Chrome and Safari.
- **Deliverable & Acceptance Criteria:** Storage persistence requested on app launch; returns granted status.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-04] #25 - Web: navigator.storage.persist() requested at first run; quo..." --label "frontend,storage,must,vs-05" --body "### Architectural Scope\nRequests persistent storage permission from the browser to prevent automated cache eviction on Android Chrome and Safari.\n\n### Deliverable\nStorage persistence requested on app launch; returns granted status.\n\nFiles: web/src/data/persistence-manager.ts"
  ```

### Task #26: [VS-05-05] Web: Persistent storage status shown in Settings (enabled/disabled) _(Orig #154)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/settings/StorageGauge.tsx`
- **Architectural Scope & Invariants:** Visual storage meter displaying used vs available disk space (navigator.storage.estimate()) with green Persistent Storage Active badge.
- **Deliverable & Acceptance Criteria:** Storage gauge renders accurately in staff_settings view.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-05] #26 - Web: Persistent storage status shown in Settings (enabled/di..." --label "frontend,ui,must,vs-05" --body "### Architectural Scope\nVisual storage meter displaying used vs available disk space (navigator.storage.estimate()) with green Persistent Storage Active badge.\n\n### Deliverable\nStorage gauge renders accurately in staff_settings view.\n\nFiles: web/src/features/settings/StorageGauge.tsx"
  ```

### Task #27: [VS-05-06] Web: Lease expiry UX — banner at 24h, read-only after expiry, export still works _(Orig #156)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/auth/LeaseStatusBanner.tsx`
- **Architectural Scope & Invariants:** Countdown alert when offline lease has <24 hours remaining. Disables sell buttons when expired while preserving emergency data export.
- **Deliverable & Acceptance Criteria:** Lease expiration states verified with mocked expired timestamps.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-05-06] #27 - Web: Lease expiry UX — banner at 24h, read-only after expiry..." --label "frontend,ui,must,vs-05" --body "### Architectural Scope\nCountdown alert when offline lease has <24 hours remaining. Disables sell buttons when expired while preserving emergency data export.\n\n### Deliverable\nLease expiration states verified with mocked expired timestamps.\n\nFiles: web/src/features/auth/LeaseStatusBanner.tsx"
  ```

---

## VS-06: Money & Quantity Cross-Platform Math Engines

> **Feature Scope:** Shared Python and TypeScript mathematical engines for integer santim, fractional milli-units, and rounding.
> **Task Range:** `#28` through `#30` (3 tasks)

### Task #28: [VS-06-01] Unit catalogue (apps/stock-log/domain/units.py) → contract/fixtures/units.json _(Orig #30)_

- **Layer:** `Shared Contract` | **Priority:** **Must**
- **Target Files:** `backend/apps/catalog/domain/units.py, contract/fixtures/units.json`
- **Architectural Scope & Invariants:** Canonical unit definitions (PIECE, KG, LITER, METER) with display symbols and decimal precision constraints exported to JSON contract.
- **Deliverable & Acceptance Criteria:** Export script generates versioned units.json fixture.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-06-01] #28 - Unit catalogue (apps/stock-log/domain/units.py) → contract/f..." --label "shared contract,must,vs-06" --body "### Architectural Scope\nCanonical unit definitions (PIECE, KG, LITER, METER) with display symbols and decimal precision constraints exported to JSON contract.\n\n### Deliverable\nExport script generates versioned units.json fixture.\n\nFiles: backend/apps/catalog/domain/units.py, contract/fixtures/units.json"
  ```

### Task #29: [VS-06-02] core/domain/quantity.py + core/domain/quantity.ts — parseQuantity, formatQuantity, validate_qty _(Orig #31)_

- **Layer:** `Shared Domain` | **Priority:** **Must**
- **Target Files:** `backend/core/domain/quantity.py, web/src/core/domain/quantity.ts`
- **Architectural Scope & Invariants:** Cross-language quantity math library using integer milli-units (1 kg = 1000 milli). Half-up rounding, bounds checking (0 to 1,000,000,000 milli).
- **Deliverable & Acceptance Criteria:** Both Python and TypeScript implementations pass identical test vectors (quantity-vectors.json).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-06-02] #29 - core/domain/quantity.py + core/domain/quantity.ts — parseQua..." --label "shared domain,must,vs-06" --body "### Architectural Scope\nCross-language quantity math library using integer milli-units (1 kg = 1000 milli). Half-up rounding, bounds checking (0 to 1,000,000,000 milli).\n\n### Deliverable\nBoth Python and TypeScript implementations pass identical test vectors (quantity-vectors.json).\n\nFiles: backend/core/domain/quantity.py, web/src/core/domain/quantity.ts"
  ```

### Task #30: [VS-06-03] Payload hash: RFC 8785 canonical JSON of {type, payload} → SHA-256 → base64url; shared vectors in contract/fixtures/payload-hash-vectors.json _(Orig #86)_

- **Layer:** `Shared Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/canonical_json.py, web/src/sync/canonical_json.ts`
- **Architectural Scope & Invariants:** RFC 8785 canonical JSON serializer generating identical SHA-256 base64url hashes across Python and TypeScript.
- **Deliverable & Acceptance Criteria:** Both implementations pass shared payload-hash-vectors.json tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-06-03] #30 - Payload hash: RFC 8785 canonical JSON of {type, payload} → S..." --label "shared sync,must,vs-06" --body "### Architectural Scope\nRFC 8785 canonical JSON serializer generating identical SHA-256 base64url hashes across Python and TypeScript.\n\n### Deliverable\nBoth implementations pass shared payload-hash-vectors.json tests.\n\nFiles: backend/apps/sync/canonical_json.py, web/src/sync/canonical_json.ts"
  ```

---

## VS-07: Master Product Catalog & Table/Card Views

> **Feature Scope:** Product model with composite PK, DRF viewsets, responsive DataTable (desktop) and card list (mobile).
> **Task Range:** `#31` through `#38` (8 tasks)

### Task #31: [VS-07-01] Django Product model (composite PK, unit immutable, name/nameAlt, price/cost santim, lowStockMilli, status) _(Orig #27)_

- **Layer:** `Backend / Models` | **Priority:** **Must**
- **Target Files:** `backend/apps/catalog/models.py`
- **Architectural Scope & Invariants:** Product table with CompositePrimaryKey('shop', 'id'). Integer price_santim and cost_santim. Bilingual fields (name, name_alt). Status enum (ACTIVE, ARCHIVED).
- **Deliverable & Acceptance Criteria:** Product model migration running cleanly on PostgreSQL with composite indices.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-01] #31 - Django Product model (composite PK, unit immutable, name/nam..." --label "backend,models,must,vs-07" --body "### Architectural Scope\nProduct table with CompositePrimaryKey('shop', 'id'). Integer price_santim and cost_santim. Bilingual fields (name, name_alt). Status enum (ACTIVE, ARCHIVED).\n\n### Deliverable\nProduct model migration running cleanly on PostgreSQL with composite indices.\n\nFiles: backend/apps/catalog/models.py"
  ```

### Task #32: [VS-07-02] CatalogService + ProductReader ports; ProductRepository (ShopScoped) _(Orig #28)_

- **Layer:** `Backend / Domain` | **Priority:** **Must**
- **Target Files:** `backend/apps/catalog/{services,repositories,ports}.py`
- **Architectural Scope & Invariants:** Decoupled domain service and scoped repository. Enforces tenant isolation so shops cannot query or modify another store's products.
- **Deliverable & Acceptance Criteria:** Unit and integration tests asserting repository returns only shop-owned products.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-02] #32 - CatalogService + ProductReader ports; ProductRepository (Sho..." --label "backend,domain,must,vs-07" --body "### Architectural Scope\nDecoupled domain service and scoped repository. Enforces tenant isolation so shops cannot query or modify another store's products.\n\n### Deliverable\nUnit and integration tests asserting repository returns only shop-owned products.\n\nFiles: backend/apps/catalog/{services,repositories,ports}.py"
  ```

### Task #33: [VS-07-03] Operations: CreateProduct (atomic with OPENING StockLog), UpdateProduct, SetProductStatus _(Orig #29)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/catalog/handlers.py`
- **Architectural Scope & Invariants:** Atomic product creation: if initial quantity > 0, atomically writes OPENING entry to StockChange ledger in the same database transaction.
- **Deliverable & Acceptance Criteria:** CreateProduct command handler verified emitting ledger entry and updating StockLevel.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-03] #33 - Operations: CreateProduct (atomic with OPENING StockLog), Up..." --label "backend,handlers,must,vs-07" --body "### Architectural Scope\nAtomic product creation: if initial quantity > 0, atomically writes OPENING entry to StockChange ledger in the same database transaction.\n\n### Deliverable\nCreateProduct command handler verified emitting ledger entry and updating StockLevel.\n\nFiles: backend/apps/catalog/handlers.py"
  ```

### Task #34: [VS-07-04] Web: Product detail (read-only unit badge, packaging editor [Stage 2]) _(Orig #36)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/ProductDetailDrawer.tsx`
- **Architectural Scope & Invariants:** Slide-out inspector showing barcodes, retail prices, wholesale costs, margins, and packaging configurations.
- **Deliverable & Acceptance Criteria:** Product detail drawer renders with role-gated cost visibility.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-04] #34 - Web: Product detail (read-only unit badge, packaging editor ..." --label "frontend,ui,must,vs-07" --body "### Architectural Scope\nSlide-out inspector showing barcodes, retail prices, wholesale costs, margins, and packaging configurations.\n\n### Deliverable\nProduct detail drawer renders with role-gated cost visibility.\n\nFiles: web/src/features/catalog/ProductDetailDrawer.tsx"
  ```

### Task #35: [VS-07-05] Web: Create/Edit Product modal (Zod validation mirroring backend) _(Orig #37)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/ProductFormModal.tsx`
- **Architectural Scope & Invariants:** React form with Zod schema validation mirroring backend DRF serializers. Live gross margin % calculator (price vs cost).
- **Deliverable & Acceptance Criteria:** Form validation catches invalid santim prices and negative stock thresholds.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-05] #35 - Web: Create/Edit Product modal (Zod validation mirroring bac..." --label "frontend,ui,must,vs-07" --body "### Architectural Scope\nReact form with Zod schema validation mirroring backend DRF serializers. Live gross margin % calculator (price vs cost).\n\n### Deliverable\nForm validation catches invalid santim prices and negative stock thresholds.\n\nFiles: web/src/features/catalog/ProductFormModal.tsx"
  ```

### Task #36: [VS-07-06] Web: Product card list (mobile) + DataTable (desktop) with density toggle _(Orig #38)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/ProductCatalogView.tsx`
- **Architectural Scope & Invariants:** Responsive presentation: high-density 8-column DataTable on desktop (>1024px) switching to tactile card stack on mobile (<1024px).
- **Deliverable & Acceptance Criteria:** Dual-view component renders cleanly at 390px and 1280px viewports.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-06] #36 - Web: Product card list (mobile) + DataTable (desktop) with d..." --label "frontend,ui,must,vs-07" --body "### Architectural Scope\nResponsive presentation: high-density 8-column DataTable on desktop (>1024px) switching to tactile card stack on mobile (<1024px).\n\n### Deliverable\nDual-view component renders cleanly at 390px and 1280px viewports.\n\nFiles: web/src/features/catalog/ProductCatalogView.tsx"
  ```

### Task #37: [VS-07-07] Product search toolbar: search input, category filter, status filter, 'Add Product' button _(Orig #41)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/CatalogToolbar.tsx`
- **Architectural Scope & Invariants:** Sticky search header with 1-tap category chips (Grains, Oils, Beverages) and quick-status filters (Low Stock, Out of Stock).
- **Deliverable & Acceptance Criteria:** Toolbar component matches stitch prototype styling and filter state.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-07] #37 - Product search toolbar: search input, category filter, statu..." --label "frontend,ui,must,vs-07" --body "### Architectural Scope\nSticky search header with 1-tap category chips (Grains, Oils, Beverages) and quick-status filters (Low Stock, Out of Stock).\n\n### Deliverable\nToolbar component matches stitch prototype styling and filter state.\n\nFiles: web/src/features/catalog/CatalogToolbar.tsx"
  ```

### Task #38: [VS-07-08] Category management (CRUD) [Should] _(Orig #42)_

- **Layer:** `Shared Domain` | **Priority:** **Should**
- **Target Files:** `backend/apps/catalog/categories.py, web/src/features/catalog/CategoryModal.tsx`
- **Architectural Scope & Invariants:** Custom store categories allowing owners to organize their inventory taxonomy.
- **Deliverable & Acceptance Criteria:** Category creation and filtering verified end-to-end.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-07-08] #38 - Category management (CRUD) [Should]..." --label "shared domain,should,vs-07" --body "### Architectural Scope\nCustom store categories allowing owners to organize their inventory taxonomy.\n\n### Deliverable\nCategory creation and filtering verified end-to-end.\n\nFiles: backend/apps/catalog/categories.py, web/src/features/catalog/CategoryModal.tsx"
  ```

---

## VS-08: Product Packaging & Bulk Container Conversions

> **Feature Scope:** Packaging definition rules (crates vs pieces), container multipliers, and the product creation wizard.
> **Task Range:** `#39` through `#42` (4 tasks)

### Task #39: [VS-08-01] Web: Product-creation wizard ('How do you sell it?' → unit chips, preview sentence, 'Add another form') _(Orig #33)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/ProductWizard.tsx`
- **Architectural Scope & Invariants:** Intuitive onboarding wizard asking cashiers 'How do you sell this?' (By the piece, by weight in kg, or by volume in liters) with live preview.
- **Deliverable & Acceptance Criteria:** Product wizard modal verified with step transitions and packaging chips.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-08-01] #39 - Web: Product-creation wizard ('How do you sell it?' → unit c..." --label "frontend,ui,must,vs-08" --body "### Architectural Scope\nIntuitive onboarding wizard asking cashiers 'How do you sell this?' (By the piece, by weight in kg, or by volume in liters) with live preview.\n\n### Deliverable\nProduct wizard modal verified with step transitions and packaging chips.\n\nFiles: web/src/features/catalog/ProductWizard.tsx"
  ```

### Task #40: [VS-08-02] Web: QuantityInput component — keypad by unit kind, quick chips from quickQtyMilli, g/mL toggle for KG/L _(Orig #34)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/ui/QuantityInput.tsx`
- **Architectural Scope & Invariants:** Unit-aware quantity input component rendering integer stepper for PIECE or decimal keypad with g/kg toggle for KG.
- **Deliverable & Acceptance Criteria:** QuantityInput verified across all 4 unit types with touch event tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-08-02] #40 - Web: QuantityInput component — keypad by unit kind, quick ch..." --label "frontend,component,must,vs-08" --body "### Architectural Scope\nUnit-aware quantity input component rendering integer stepper for PIECE or decimal keypad with g/kg toggle for KG.\n\n### Deliverable\nQuantityInput verified across all 4 unit types with touch event tests.\n\nFiles: web/src/ui/QuantityInput.tsx"
  ```

### Task #41: [VS-08-03] Packaging rules [Should]: Product.packagings[], ReceiveLineInput.packaging, StockChange.packaging snapshot _(Orig #39)_

- **Layer:** `Backend / Packaging` | **Priority:** **Should**
- **Target Files:** `backend/apps/catalog/packaging.py`
- **Architectural Scope & Invariants:** Packaging definition schema supporting bulk containers (e.g., Crate of 24, Carton of 12) with conversion multiplier to base units.
- **Deliverable & Acceptance Criteria:** Packaging models and serializers pass conversion calculation tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-08-03] #41 - Packaging rules [Should]: Product.packagings[], ReceiveLineI..." --label "backend,packaging,should,vs-08" --body "### Architectural Scope\nPackaging definition schema supporting bulk containers (e.g., Crate of 24, Carton of 12) with conversion multiplier to base units.\n\n### Deliverable\nPackaging models and serializers pass conversion calculation tests.\n\nFiles: backend/apps/catalog/packaging.py"
  ```

### Task #42: [VS-08-04] Opening stock supports openingPackaging (count × factor) _(Orig #40)_

- **Layer:** `Backend / Handlers` | **Priority:** **Should**
- **Target Files:** `backend/apps/catalog/handlers.py`
- **Architectural Scope & Invariants:** Enables entering opening inventory as '5 crates' which automatically records as '120 pieces' in the base ledger.
- **Deliverable & Acceptance Criteria:** Opening stock calculation verified with container multiplication tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-08-04] #42 - Opening stock supports openingPackaging (count × factor)..." --label "backend,handlers,should,vs-08" --body "### Architectural Scope\nEnables entering opening inventory as '5 crates' which automatically records as '120 pieces' in the base ledger.\n\n### Deliverable\nOpening stock calculation verified with container multiplication tests.\n\nFiles: backend/apps/catalog/handlers.py"
  ```

---

## VS-09: Bilingual Amharic Search Normalization

> **Feature Scope:** Ethiopic homophone folding (ሀ/ሐ/ኀ, ሰ/ሠ), sub-second in-memory search trie, and Noto Sans Ethiopic typography.
> **Task Range:** `#43` through `#46` (4 tasks)

### Task #43: [VS-09-01] core/search/normalize.ts — Latin + Ethiopic homophone folding (ሀ/ሐ/ኀ, ሰ/ሠ) _(Orig #32)_

- **Layer:** `Frontend / Search` | **Priority:** **Must**
- **Target Files:** `web/src/core/search/normalize.ts`
- **Architectural Scope & Invariants:** High-speed string normalizer mapping Ethiopic homophone glyphs to canonical forms. Enables searching 'ስኳር' or 'ስክዋር' interchangeably.
- **Deliverable & Acceptance Criteria:** Benchmarked search normalizer folding 2,000 product titles in < 2ms.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-09-01] #43 - core/search/normalize.ts — Latin + Ethiopic homophone foldin..." --label "frontend,search,must,vs-09" --body "### Architectural Scope\nHigh-speed string normalizer mapping Ethiopic homophone glyphs to canonical forms. Enables searching 'ስኳር' or 'ስክዋር' interchangeably.\n\n### Deliverable\nBenchmarked search normalizer folding 2,000 product titles in < 2ms.\n\nFiles: web/src/core/search/normalize.ts"
  ```

### Task #44: [VS-09-02] Web: Product list/search (in-memory normalized index, Amharic fold, virtualization) _(Orig #35)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/catalog/ProductSearchIndex.ts`
- **Architectural Scope & Invariants:** In-memory trie search index querying 2,000 cached products in under 50ms on mobile hardware, supporting Latin and Amharic queries.
- **Deliverable & Acceptance Criteria:** Search latency benchmark < 50ms on simulated low-end mobile CPU.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-09-02] #44 - Web: Product list/search (in-memory normalized index, Amhari..." --label "frontend,ui,must,vs-09" --body "### Architectural Scope\nIn-memory trie search index querying 2,000 cached products in under 50ms on mobile hardware, supporting Latin and Amharic queries.\n\n### Deliverable\nSearch latency benchmark < 50ms on simulated low-end mobile CPU.\n\nFiles: web/src/features/catalog/ProductSearchIndex.ts"
  ```

### Task #45: [VS-09-03] i18n: all strings in en.json from day one; Amharic am.json [Should] _(Orig #151)_

- **Layer:** `Shared i18n` | **Priority:** **Should**
- **Target Files:** `web/src/i18n/{en,am}.json, web/src/i18n/index.ts`
- **Architectural Scope & Invariants:** Bilingual string dictionary mapping all UI labels to English and Amharic with zero hardcoded English strings in components.
- **Deliverable & Acceptance Criteria:** Language switcher toggles UI strings without layout distortion.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-09-03] #45 - i18n: all strings in en.json from day one; Amharic am.json [..." --label "shared i18n,should,vs-09" --body "### Architectural Scope\nBilingual string dictionary mapping all UI labels to English and Amharic with zero hardcoded English strings in components.\n\n### Deliverable\nLanguage switcher toggles UI strings without layout distortion.\n\nFiles: web/src/i18n/{en,am}.json, web/src/i18n/index.ts"
  ```

### Task #46: [VS-09-04] Amharic text rendering: no baseline shift, proper font fallback (Noto Sans Ethiopic) _(Orig #186)_

- **Layer:** `Frontend / Typography` | **Priority:** **Must**
- **Target Files:** `web/src/index.css`
- **Architectural Scope & Invariants:** Font stack configuration ensuring Amharic glyphs render with consistent vertical metrics and zero character clipping.
- **Deliverable & Acceptance Criteria:** Amharic text renders cleanly across Chrome, Safari, and Firefox.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-09-04] #46 - Amharic text rendering: no baseline shift, proper font fallb..." --label "frontend,typography,must,vs-09" --body "### Architectural Scope\nFont stack configuration ensuring Amharic glyphs render with consistent vertical metrics and zero character clipping.\n\n### Deliverable\nAmharic text renders cleanly across Chrome, Safari, and Firefox.\n\nFiles: web/src/index.css"
  ```

---

## VS-10: POS Cashier Till & Staple Shortcuts

> **Feature Scope:** Sub-10-second cashier till layout, 1-tap grocery staple shortcuts (Sugar, Rice, Oil, Coffee), and mobile segmented tabs.
> **Task Range:** `#47` through `#50` (4 tasks)

### Task #47: [VS-10-01] Web: Sell screen — search → tap product → quantity chips → payment label → Save (≤10s, ≤3 taps) _(Orig #62)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/SellScreen.tsx`
- **Architectural Scope & Invariants:** High-velocity cashier till layout achieving sub-10-second checkout flow. Mobile segmented tab toggle between Catalog and Cart.
- **Deliverable & Acceptance Criteria:** Sell screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-10-01] #47 - Web: Sell screen — search → tap product → quantity chips → p..." --label "frontend,ui,must,vs-10" --body "### Architectural Scope\nHigh-velocity cashier till layout achieving sub-10-second checkout flow. Mobile segmented tab toggle between Catalog and Cart.\n\n### Deliverable\nSell screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/pos/SellScreen.tsx"
  ```

### Task #48: [VS-10-02] Web: Product quick chips (horizontal scroll, max 6 frequent items) _(Orig #71)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/QuickFavoritesBar.tsx`
- **Architectural Scope & Invariants:** Top-row 1-tap quick buttons for frequent grocery staples (Sugar, Rice, Oil, Coffee) with 44px touch targets.
- **Deliverable & Acceptance Criteria:** Quick chips add product to cart with a single tap.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-10-02] #48 - Web: Product quick chips (horizontal scroll, max 6 frequent ..." --label "frontend,component,must,vs-10" --body "### Architectural Scope\nTop-row 1-tap quick buttons for frequent grocery staples (Sugar, Rice, Oil, Coffee) with 44px touch targets.\n\n### Deliverable\nQuick chips add product to cart with a single tap.\n\nFiles: web/src/features/pos/QuickFavoritesBar.tsx"
  ```

### Task #49: [VS-10-03] Web: Recent products persisted in meta.recentProducts _(Orig #72)_

- **Layer:** `Frontend / Storage` | **Priority:** **Must**
- **Target Files:** `web/src/data/recent-products.ts`
- **Architectural Scope & Invariants:** Local storage tracking top 6 cashier-selected items across browser restarts without server network calls.
- **Deliverable & Acceptance Criteria:** Recent items persist in IndexedDB meta table across page refreshes.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-10-03] #49 - Web: Recent products persisted in meta.recentProducts..." --label "frontend,storage,must,vs-10" --body "### Architectural Scope\nLocal storage tracking top 6 cashier-selected items across browser restarts without server network calls.\n\n### Deliverable\nRecent items persist in IndexedDB meta table across page refreshes.\n\nFiles: web/src/data/recent-products.ts"
  ```

### Task #50: [VS-10-04] Mobile Sell screen: header, search, quick chips, cart, stepper, payment selector, complete sale button _(Orig #181)_

- **Layer:** `Frontend / Polish` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/SellScreenMobile.tsx`
- **Architectural Scope & Invariants:** Mobile-optimized cashier POS layout verified with 44px+ touch targets and zero horizontal overflow.
- **Deliverable & Acceptance Criteria:** Mobile POS verified on 375px and 390px viewport viewports.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-10-04] #50 - Mobile Sell screen: header, search, quick chips, cart, stepp..." --label "frontend,polish,must,vs-10" --body "### Architectural Scope\nMobile-optimized cashier POS layout verified with 44px+ touch targets and zero horizontal overflow.\n\n### Deliverable\nMobile POS verified on 375px and 390px viewport viewports.\n\nFiles: web/src/features/pos/SellScreenMobile.tsx"
  ```

---

## VS-11: POS Cart, Keypad & Payment Selector

> **Feature Scope:** Cart management, line total math, 3-button tender selector, decimal keypad sheet, and 54px thumb CTA.
> **Task Range:** `#51` through `#55` (5 tasks)

### Task #51: [VS-11-01] Web: Cart — line qty unit × price = lineTotal, rounded sum, 'Sell anyway' sheet when exceeding projected stock _(Orig #63)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/CartPanel.tsx`
- **Architectural Scope & Invariants:** Cart manager calculating line totals, applying half-up santim rounding, and triggering stock warning if cart exceeds available quantity.
- **Deliverable & Acceptance Criteria:** Cart calculations pass rounding tests; shows Sell Anyway alert on oversell.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-11-01] #51 - Web: Cart — line qty unit × price = lineTotal, rounded sum, ..." --label "frontend,ui,must,vs-11" --body "### Architectural Scope\nCart manager calculating line totals, applying half-up santim rounding, and triggering stock warning if cart exceeds available quantity.\n\n### Deliverable\nCart calculations pass rounding tests; shows Sell Anyway alert on oversell.\n\nFiles: web/src/features/pos/CartPanel.tsx"
  ```

### Task #52: [VS-11-02] Web: Payment Selector — segmented control (Cash/Telebirr/Other) _(Orig #64)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/PaymentSelector.tsx`
- **Architectural Scope & Invariants:** High-contrast 3-button tender label selector (Cash, Telebirr, Other). Label only, zero payment settlement integration.
- **Deliverable & Acceptance Criteria:** Payment selector tested with keyboard navigation and touch feedback.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-11-02] #52 - Web: Payment Selector — segmented control (Cash/Telebirr/Oth..." --label "frontend,component,must,vs-11" --body "### Architectural Scope\nHigh-contrast 3-button tender label selector (Cash, Telebirr, Other). Label only, zero payment settlement integration.\n\n### Deliverable\nPayment selector tested with keyboard navigation and touch feedback.\n\nFiles: web/src/features/pos/PaymentSelector.tsx"
  ```

### Task #53: [VS-11-03] Web: Complete Sale button (54px sticky footer mobile, auto-width desktop) _(Orig #65)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/CheckoutFooter.tsx`
- **Architectural Scope & Invariants:** Full-width 54px thumb-zone CTA bar on mobile viewports displaying live total and 1-tap checkout trigger.
- **Deliverable & Acceptance Criteria:** Checkout button renders in thumb zone without colliding with OS home bar.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-11-03] #53 - Web: Complete Sale button (54px sticky footer mobile, auto-w..." --label "frontend,component,must,vs-11" --body "### Architectural Scope\nFull-width 54px thumb-zone CTA bar on mobile viewports displaying live total and 1-tap checkout trigger.\n\n### Deliverable\nCheckout button renders in thumb zone without colliding with OS home bar.\n\nFiles: web/src/features/pos/CheckoutFooter.tsx"
  ```

### Task #54: [VS-11-04] Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, quick chips, live total preview) _(Orig #66)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/QuantityKeypadSheet.tsx`
- **Architectural Scope & Invariants:** Slide-up touch keypad optimized for entering arbitrary decimal weights (e.g. 2.750 kg) with standard increment chips (+0.25, +0.5, +1.0 kg).
- **Deliverable & Acceptance Criteria:** Keypad sheet verified with decimal entry and live total calculation.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-11-04] #54 - Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, q..." --label "frontend,ui,must,vs-11" --body "### Architectural Scope\nSlide-up touch keypad optimized for entering arbitrary decimal weights (e.g. 2.750 kg) with standard increment chips (+0.25, +0.5, +1.0 kg).\n\n### Deliverable\nKeypad sheet verified with decimal entry and live total calculation.\n\nFiles: web/src/features/pos/QuantityKeypadSheet.tsx"
  ```

### Task #55: [VS-11-05] Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick chips, live total) _(Orig #182)_

- **Layer:** `Frontend / Polish` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/QuantityKeypadMobile.tsx`
- **Architectural Scope & Invariants:** Slide-up touch keypad verified for one-handed operation on mobile devices.
- **Deliverable & Acceptance Criteria:** Keypad transitions smoothly with spring physics and zero tap lag.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-11-05] #55 - Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick..." --label "frontend,polish,must,vs-11" --body "### Architectural Scope\nSlide-up touch keypad verified for one-handed operation on mobile devices.\n\n### Deliverable\nKeypad transitions smoothly with spring physics and zero tap lag.\n\nFiles: web/src/features/pos/QuantityKeypadMobile.tsx"
  ```

---

## VS-12: POS Durable Sales & Local Checkout (INV-01)

> **Feature Scope:** Atomic Dexie transaction saving Sale + lines + outbox before UI confirmation, PostgreSQL sales schema, and immutability.
> **Task Range:** `#56` through `#61` (6 tasks)

### Task #56: [VS-12-01] Django Sale, SaleLine, SaleCancellation models (composite PKs, reversesId on cancellation) _(Orig #57)_

- **Layer:** `Backend / Models` | **Priority:** **Must**
- **Target Files:** `backend/apps/sales/models.py`
- **Architectural Scope & Invariants:** Sale and SaleLine tables using CompositePrimaryKey('shop', 'id'). ReversesId foreign key on SaleCancellation pointing to original sale.
- **Deliverable & Acceptance Criteria:** Sales models migration running cleanly on PostgreSQL with composite FKs.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-01] #56 - Django Sale, SaleLine, SaleCancellation models (composite PK..." --label "backend,models,must,vs-12" --body "### Architectural Scope\nSale and SaleLine tables using CompositePrimaryKey('shop', 'id'). ReversesId foreign key on SaleCancellation pointing to original sale.\n\n### Deliverable\nSales models migration running cleanly on PostgreSQL with composite FKs.\n\nFiles: backend/apps/sales/models.py"
  ```

### Task #57: [VS-12-02] RecordSaleHandler: validates lines, recomputes totals, price snapshots, builds SALE entries, calls StockLogService.append, applies outcome matrix by mode _(Orig #58)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/sales/handlers/record_sale.py`
- **Architectural Scope & Invariants:** Validates item lines, recomputes total santim, snapshots unit prices, and appends negative movements to the stock ledger atomically.
- **Deliverable & Acceptance Criteria:** RecordSaleHandler unit tests pass with price snapshot assertions.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-02] #57 - RecordSaleHandler: validates lines, recomputes totals, price..." --label "backend,handlers,must,vs-12" --body "### Architectural Scope\nValidates item lines, recomputes total santim, snapshots unit prices, and appends negative movements to the stock ledger atomically.\n\n### Deliverable\nRecordSaleHandler unit tests pass with price snapshot assertions.\n\nFiles: backend/apps/sales/handlers/record_sale.py"
  ```

### Task #58: [VS-12-03] Web recordSale.ts (offline: one Dexie tx → sale, lines, stock log, projection, outbox; online: outbox only, await confirmation) _(Orig #60)_

- **Layer:** `Frontend / UseCase` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/usecases/recordSale.ts`
- **Architectural Scope & Invariants:** INV-01 Durable Local Save: commits Sale, SaleLines, pending StockChange, and Outbox entry in a single atomic Dexie transaction before returning success.
- **Deliverable & Acceptance Criteria:** Integration test verifying tab kill or crash immediately after save preserves record (T-07).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-03] #58 - Web recordSale.ts (offline: one Dexie tx → sale, lines, stoc..." --label "frontend,usecase,must,vs-12" --body "### Architectural Scope\nINV-01 Durable Local Save: commits Sale, SaleLines, pending StockChange, and Outbox entry in a single atomic Dexie transaction before returning success.\n\n### Deliverable\nIntegration test verifying tab kill or crash immediately after save preserves record (T-07).\n\nFiles: web/src/features/pos/usecases/recordSale.ts"
  ```

### Task #59: [VS-12-04] Web: Pending confirmation list (online) + 'Awaiting confirmation' badge _(Orig #68)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/PendingSalesList.tsx`
- **Architectural Scope & Invariants:** Visual list of recent sales displaying 'Awaiting Confirmation' while sync outbox processes the batch.
- **Deliverable & Acceptance Criteria:** Pending badge transitions to Synced once server confirms.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-04] #59 - Web: Pending confirmation list (online) + 'Awaiting confirma..." --label "frontend,ui,must,vs-12" --body "### Architectural Scope\nVisual list of recent sales displaying 'Awaiting Confirmation' while sync outbox processes the batch.\n\n### Deliverable\nPending badge transitions to Synced once server confirms.\n\nFiles: web/src/features/pos/PendingSalesList.tsx"
  ```

### Task #60: [VS-12-05] Web: Sale history (localDay EAT grouping, sync state badges) _(Orig #69)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/sales/SaleHistoryScreen.tsx`
- **Architectural Scope & Invariants:** Sales journal grouping transactions by calendar date in Africa/Addis_Ababa timezone with status badges (Synced, Pending, Review).
- **Deliverable & Acceptance Criteria:** Sale history renders with proper timezone grouping and receipt preview.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-05] #60 - Web: Sale history (localDay EAT grouping, sync state badges)..." --label "frontend,ui,must,vs-12" --body "### Architectural Scope\nSales journal grouping transactions by calendar date in Africa/Addis_Ababa timezone with status badges (Synced, Pending, Review).\n\n### Deliverable\nSale history renders with proper timezone grouping and receipt preview.\n\nFiles: web/src/features/sales/SaleHistoryScreen.tsx"
  ```

### Task #61: [VS-12-06] Sale immutability: architecture test — UPDATE/DELETE on sale/stock log/cancellation fails _(Orig #70)_

- **Layer:** `Backend / Test` | **Priority:** **Must**
- **Target Files:** `backend/tests/architecture/test_immutability.py`
- **Architectural Scope & Invariants:** Automated architectural test proving SQL UPDATE and DELETE statements on sales tables raise database integrity errors.
- **Deliverable & Acceptance Criteria:** Architecture test passes against PostgreSQL database.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-12-06] #61 - Sale immutability: architecture test — UPDATE/DELETE on sale..." --label "backend,test,must,vs-12" --body "### Architectural Scope\nAutomated architectural test proving SQL UPDATE and DELETE statements on sales tables raise database integrity errors.\n\n### Deliverable\nArchitecture test passes against PostgreSQL database.\n\nFiles: backend/tests/architecture/test_immutability.py"
  ```

---

## VS-13: Sale Cancellations & Compensating Ledger Audits

> **Feature Scope:** Compensating SALE_CANCELLATION movements, reversesId foreign keys, idempotent double-cancels, and cancellation UI.
> **Task Range:** `#62` through `#63` (2 tasks)

### Task #62: [VS-13-01] CancelSaleHandler: inserts SaleCancellation (PK (shopId, saleId)), builds SALE_CANCELLATION entries with reversesId; quarantines on CANCELLATION_CONFLICT conditions _(Orig #59)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/sales/handlers/cancel_sale.py`
- **Architectural Scope & Invariants:** Appends compensating positive ledger movements. Idempotent on second cancellation attempt. Quarantines if sale was already cancelled.
- **Deliverable & Acceptance Criteria:** CancelSaleHandler verified asserting single compensating movement (AT-08).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-13-01] #62 - CancelSaleHandler: inserts SaleCancellation (PK (shopId, sal..." --label "backend,handlers,must,vs-13" --body "### Architectural Scope\nAppends compensating positive ledger movements. Idempotent on second cancellation attempt. Quarantines if sale was already cancelled.\n\n### Deliverable\nCancelSaleHandler verified asserting single compensating movement (AT-08).\n\nFiles: backend/apps/sales/handlers/cancel_sale.py"
  ```

### Task #63: [VS-13-02] Web cancelSale.ts (owner only, offline pending) _(Orig #61)_

- **Layer:** `Frontend / UseCase` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/usecases/cancelSale.ts`
- **Architectural Scope & Invariants:** Client cancellation use case: flags local sale as cancelled, updates local projected stock, and stages cancellation op in outbox.
- **Deliverable & Acceptance Criteria:** Cancel sale use case passes with outbox stage assertions.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-13-02] #63 - Web cancelSale.ts (owner only, offline pending)..." --label "frontend,usecase,must,vs-13" --body "### Architectural Scope\nClient cancellation use case: flags local sale as cancelled, updates local projected stock, and stages cancellation op in outbox.\n\n### Deliverable\nCancel sale use case passes with outbox stage assertions.\n\nFiles: web/src/features/pos/usecases/cancelSale.ts"
  ```

---

## VS-14: Append-Only Stock Movement Ledger Core

> **Feature Scope:** PostgreSQL StockChange table with immutability triggers, StockLogService.append with ascending row locks, and reconciliation tool.
> **Task Range:** `#64` through `#68` (5 tasks)

### Task #64: [VS-14-01] Django StockLevel + StockChange models (composite PK, immutability trigger, underReview flag) _(Orig #43)_

- **Layer:** `Backend / Models` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/models.py`
- **Architectural Scope & Invariants:** Append-only StockChange table and StockLevel projection table with CompositePrimaryKey('shop', 'id'). under_review flag for conflict tracking.
- **Deliverable & Acceptance Criteria:** Ledger models migration running cleanly on PostgreSQL.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-14-01] #64 - Django StockLevel + StockChange models (composite PK, immuta..." --label "backend,models,must,vs-14" --body "### Architectural Scope\nAppend-only StockChange table and StockLevel projection table with CompositePrimaryKey('shop', 'id'). under_review flag for conflict tracking.\n\n### Deliverable\nLedger models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/ledger/models.py"
  ```

### Task #65: [VS-14-02] StockLogService.append(entries, ctx) — locks StockLevel rows, increments version, writes StockChange, allocates serverSeq, returns crossed_below_zero _(Orig #44)_

- **Layer:** `Backend / Service` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/services/append.py`
- **Architectural Scope & Invariants:** Core inventory append engine acquiring row locks in ascending product ID order. Increments projection version and allocates monotonic serverSeq.
- **Deliverable & Acceptance Criteria:** LedgerService passes concurrency tests asserting zero lost updates under load.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-14-02] #65 - StockLogService.append(entries, ctx) — locks StockLevel rows..." --label "backend,service,must,vs-14" --body "### Architectural Scope\nCore inventory append engine acquiring row locks in ascending product ID order. Increments projection version and allocates monotonic serverSeq.\n\n### Deliverable\nLedgerService passes concurrency tests asserting zero lost updates under load.\n\nFiles: backend/apps/ledger/services/append.py"
  ```

### Task #66: [VS-14-03] StockLogQueries: quantity, history, balance_at_version(baseVersion) _(Orig #45)_

- **Layer:** `Backend / Queries` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/queries.py`
- **Architectural Scope & Invariants:** Optimized read queries retrieving current balance, movement history, and historical balance at specific projection versions.
- **Deliverable & Acceptance Criteria:** Query functions pass performance benchmarks on 50,000 movements.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-14-03] #66 - StockLogQueries: quantity, history, balance_at_version(baseV..." --label "backend,queries,must,vs-14" --body "### Architectural Scope\nOptimized read queries retrieving current balance, movement history, and historical balance at specific projection versions.\n\n### Deliverable\nQuery functions pass performance benchmarks on 50,000 movements.\n\nFiles: backend/apps/ledger/queries.py"
  ```

### Task #67: [VS-14-04] Nightly reconcile_stock_log management command (verifies qty = SUM(delta), version = COUNT) _(Orig #47)_

- **Layer:** `Backend / Ops` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/management/commands/reconcile_stock_log.py`
- **Architectural Scope & Invariants:** Automated verification job asserting StockLevel.quantity == SUM(StockChange.delta) across all products in the database.
- **Deliverable & Acceptance Criteria:** Command executes and reports zero discrepancies.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-14-04] #67 - Nightly reconcile_stock_log management command (verifies qty..." --label "backend,ops,must,vs-14" --body "### Architectural Scope\nAutomated verification job asserting StockLevel.quantity == SUM(StockChange.delta) across all products in the database.\n\n### Deliverable\nCommand executes and reports zero discrepancies.\n\nFiles: backend/apps/ledger/management/commands/reconcile_stock_log.py"
  ```

### Task #68: [VS-14-05] Stock history endpoint: GET /products/{id}/stock-changes (role-filtered, paged) _(Orig #52)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/views.py`
- **Architectural Scope & Invariants:** Paginated stock movement history endpoint with role-based field filtering (stripping wholesale costs for attendants per NFR-12).
- **Deliverable & Acceptance Criteria:** Endpoint tests verify attendants receive movement counts with cost fields removed.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-14-05] #68 - Stock history endpoint: GET /products/{id}/stock-changes (ro..." --label "backend,api,must,vs-14" --body "### Architectural Scope\nPaginated stock movement history endpoint with role-based field filtering (stripping wholesale costs for attendants per NFR-12).\n\n### Deliverable\nEndpoint tests verify attendants receive movement counts with cost fields removed.\n\nFiles: backend/apps/ledger/views.py"
  ```

---

## VS-15: Client Stock Projections & Dexie UnitOfWork

> **Feature Scope:** Dexie stock tables, local projection algorithm (confirmedQty + pendingDelta), atomic unit of work, and recovery rebuild.
> **Task Range:** `#69` through `#73` (5 tasks)

### Task #69: [VS-15-01] Web Dexie schema: stockChanges, stockLevels (projection with confirmedQty, pendingDelta, projectedQty) _(Orig #48)_

- **Layer:** `Frontend / Storage` | **Priority:** **Must**
- **Target Files:** `web/src/data/schema/stock.ts`
- **Architectural Scope & Invariants:** IndexedDB tables tracking confirmed server movements, confirmed stock levels, and computed local projected balances.
- **Deliverable & Acceptance Criteria:** Dexie schema version 1 initializes and passes table creation tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-15-01] #69 - Web Dexie schema: stockChanges, stockLevels (projection with..." --label "frontend,storage,must,vs-15" --body "### Architectural Scope\nIndexedDB tables tracking confirmed server movements, confirmed stock levels, and computed local projected balances.\n\n### Deliverable\nDexie schema version 1 initializes and passes table creation tests.\n\nFiles: web/src/data/schema/stock.ts"
  ```

### Task #70: [VS-15-02] Web StockLogRepository.appendPending(), recomputeFor(productIds) — projection algorithm (§5.10) _(Orig #49)_

- **Layer:** `Frontend / Data` | **Priority:** **Must**
- **Target Files:** `web/src/data/repositories/StockLogRepository.ts`
- **Architectural Scope & Invariants:** Client stock projection algorithm: projectedQty = confirmedQty + pendingDelta with zero double-counting of in-flight outbox operations.
- **Deliverable & Acceptance Criteria:** Projection algorithm passes fast-check property tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-15-02] #70 - Web StockLogRepository.appendPending(), recomputeFor(product..." --label "frontend,data,must,vs-15" --body "### Architectural Scope\nClient stock projection algorithm: projectedQty = confirmedQty + pendingDelta with zero double-counting of in-flight outbox operations.\n\n### Deliverable\nProjection algorithm passes fast-check property tests.\n\nFiles: web/src/data/repositories/StockLogRepository.ts"
  ```

### Task #71: [VS-15-03] Web UnitOfWork (Dexie transaction wrapping sale + lines + stock log + outbox) _(Orig #50)_

- **Layer:** `Frontend / Data` | **Priority:** **Must**
- **Target Files:** `web/src/data/UnitOfWork.ts`
- **Architectural Scope & Invariants:** Client atomic transaction wrapper ensuring multi-table consistency across sales, movements, and outbox tables in Dexie.
- **Deliverable & Acceptance Criteria:** UnitOfWork tests assert rollback on simulated IndexedDB write failure.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-15-03] #71 - Web UnitOfWork (Dexie transaction wrapping sale + lines + st..." --label "frontend,data,must,vs-15" --body "### Architectural Scope\nClient atomic transaction wrapper ensuring multi-table consistency across sales, movements, and outbox tables in Dexie.\n\n### Deliverable\nUnitOfWork tests assert rollback on simulated IndexedDB write failure.\n\nFiles: web/src/data/UnitOfWork.ts"
  ```

### Task #72: [VS-15-04] Web recovery: rebuildProjection(), integrity check (local confirmed = sum of confirmed entries) _(Orig #51)_

- **Layer:** `Frontend / Recovery` | **Priority:** **Must**
- **Target Files:** `web/src/data/recovery.ts`
- **Architectural Scope & Invariants:** Disaster recovery routine rebuilding local stock projection tables from raw movement records if IndexedDB is interrupted.
- **Deliverable & Acceptance Criteria:** Recovery routine passes state corruption test.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-15-04] #72 - Web recovery: rebuildProjection(), integrity check (local co..." --label "frontend,recovery,must,vs-15" --body "### Architectural Scope\nDisaster recovery routine rebuilding local stock projection tables from raw movement records if IndexedDB is interrupted.\n\n### Deliverable\nRecovery routine passes state corruption test.\n\nFiles: web/src/data/recovery.ts"
  ```

### Task #73: [VS-15-05] Web: StockLevelDisplay component — confirmed vs projected, low-stock threshold, unit badge _(Orig #54)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/ui/StockLevelDisplay.tsx`
- **Architectural Scope & Invariants:** Visual badge component displaying confirmed balance alongside pending outbox deltas.
- **Deliverable & Acceptance Criteria:** Badge renders confirmed vs projected numbers with status colors.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-15-05] #73 - Web: StockLevelDisplay component — confirmed vs projected, l..." --label "frontend,component,must,vs-15" --body "### Architectural Scope\nVisual badge component displaying confirmed balance alongside pending outbox deltas.\n\n### Deliverable\nBadge renders confirmed vs projected numbers with status colors.\n\nFiles: web/src/ui/StockLevelDisplay.tsx"
  ```

---

## VS-16: Stock Receiving & Supplier Intake

> **Feature Scope:** Multi-line supplier shipment receiving, container-to-unit cost calculation with half-up rounding, and Receive Stock modal.
> **Task Range:** `#74` through `#78` (5 tasks)

### Task #74: [VS-16-01] Web: Receive Stock modal (packaging selector with live '3 crates = 36 pcs' preview) _(Orig #56)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/ReceiveStockModal.tsx`
- **Architectural Scope & Invariants:** Shipment intake modal supporting bulk packaging selection and live unit piece conversion preview.
- **Deliverable & Acceptance Criteria:** Receive modal calculates unit quantities and updates stock.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-16-01] #74 - Web: Receive Stock modal (packaging selector with live '3 cr..." --label "frontend,ui,must,vs-16" --body "### Architectural Scope\nShipment intake modal supporting bulk packaging selection and live unit piece conversion preview.\n\n### Deliverable\nReceive modal calculates unit quantities and updates stock.\n\nFiles: web/src/features/stock/ReceiveStockModal.tsx"
  ```

### Task #75: [VS-16-02] ReceiveStockHandler (owner): multi-line, atomic, optional packaging per line, cost per unit or per container → updates product costSantim _(Orig #73)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/handlers/receive_stock.py`
- **Architectural Scope & Invariants:** Owner shipment intake command: updates stock balances, appends positive ledger movements, and updates product costSantim.
- **Deliverable & Acceptance Criteria:** ReceiveStockHandler passes multi-line atomic shipment tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-16-02] #75 - ReceiveStockHandler (owner): multi-line, atomic, optional pa..." --label "backend,handlers,must,vs-16" --body "### Architectural Scope\nOwner shipment intake command: updates stock balances, appends positive ledger movements, and updates product costSantim.\n\n### Deliverable\nReceiveStockHandler passes multi-line atomic shipment tests.\n\nFiles: backend/apps/ledger/handlers/receive_stock.py"
  ```

### Task #76: [VS-16-03] Web: Receive Stock modal (segmented unit selector pc | Crate (12), live preview, optional cost per container) _(Orig #75)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/ReceiveStockForm.tsx`
- **Architectural Scope & Invariants:** Segmented unit selector allowing cashiers to record deliveries by piece or crate with live cost calculation.
- **Deliverable & Acceptance Criteria:** Form converts carton wholesale cost into base unit cost.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-16-03] #76 - Web: Receive Stock modal (segmented unit selector pc | Crate..." --label "frontend,ui,must,vs-16" --body "### Architectural Scope\nSegmented unit selector allowing cashiers to record deliveries by piece or crate with live cost calculation.\n\n### Deliverable\nForm converts carton wholesale cost into base unit cost.\n\nFiles: web/src/features/stock/ReceiveStockForm.tsx"
  ```

### Task #77: [VS-16-04] Stock log entries carry packaging snapshot (label, count, baseQtyMilli) for history render _(Orig #77)_

- **Layer:** `Shared Domain` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/models.py, web/src/data/schema/stock.ts`
- **Architectural Scope & Invariants:** Movement schema preserving packaging metadata (e.g. 'Received 3 crates') for historical audit display.
- **Deliverable & Acceptance Criteria:** Movement entries preserve packaging snapshots in ledger history.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-16-04] #77 - Stock log entries carry packaging snapshot (label, count, ba..." --label "shared domain,must,vs-16" --body "### Architectural Scope\nMovement schema preserving packaging metadata (e.g. 'Received 3 crates') for historical audit display.\n\n### Deliverable\nMovement entries preserve packaging snapshots in ledger history.\n\nFiles: backend/apps/ledger/models.py, web/src/data/schema/stock.ts"
  ```

### Task #78: [VS-16-05] Web: Receive cost per container → converts to cost per base unit with half-up rounding _(Orig #79)_

- **Layer:** `Frontend / Math` | **Priority:** **Must**
- **Target Files:** `web/src/core/domain/container-cost.ts`
- **Architectural Scope & Invariants:** Client math utility dividing wholesale container cost into base unit santim with half-up rounding.
- **Deliverable & Acceptance Criteria:** Container cost calculations pass vector tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-16-05] #78 - Web: Receive cost per container → converts to cost per base ..." --label "frontend,math,must,vs-16" --body "### Architectural Scope\nClient math utility dividing wholesale container cost into base unit santim with half-up rounding.\n\n### Deliverable\nContainer cost calculations pass vector tests.\n\nFiles: web/src/core/domain/container-cost.ts"
  ```

---

## VS-17: Manual Stock Adjustments & Shrinkage

> **Feature Scope:** Mandatory reason codes (Damage, Loss, Count Correction), delta adjustments, low-stock threshold badges, and summary cards.
> **Task Range:** `#79` through `#84` (6 tasks)

### Task #79: [VS-17-01] AdjustStockHandler (owner): ADJUSTMENT entry with reason enum (DAMAGE, LOSS, CORRECTION, OTHER); online rejects negative, offline quarantines _(Orig #74)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/handlers/adjust_stock.py`
- **Architectural Scope & Invariants:** Manual stock adjustment service enforcing structured reason codes and mandatory notes for audit compliance.
- **Deliverable & Acceptance Criteria:** AdjustStockHandler passes reason code validation tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-01] #79 - AdjustStockHandler (owner): ADJUSTMENT entry with reason enu..." --label "backend,handlers,must,vs-17" --body "### Architectural Scope\nManual stock adjustment service enforcing structured reason codes and mandatory notes for audit compliance.\n\n### Deliverable\nAdjustStockHandler passes reason code validation tests.\n\nFiles: backend/apps/ledger/handlers/adjust_stock.py"
  ```

### Task #80: [VS-17-02] Web: Adjust Stock modal (reason picker, quantity input by unit, preview) _(Orig #76)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/AdjustStockModal.tsx`
- **Architectural Scope & Invariants:** Fast stock adjustment dialog requiring reason selection (Damage, Loss, Count Correction) before saving.
- **Deliverable & Acceptance Criteria:** Modal form enforces mandatory reason code selection.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-02] #80 - Web: Adjust Stock modal (reason picker, quantity input by un..." --label "frontend,ui,must,vs-17" --body "### Architectural Scope\nFast stock adjustment dialog requiring reason selection (Damage, Loss, Count Correction) before saving.\n\n### Deliverable\nModal form enforces mandatory reason code selection.\n\nFiles: web/src/features/stock/AdjustStockModal.tsx"
  ```

### Task #81: [VS-17-03] Web: Adjust reason enum with mandatory note for OTHER _(Orig #78)_

- **Layer:** `Frontend / Form` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/adjust-schema.ts`
- **Architectural Scope & Invariants:** Form validation rule requiring explanatory text when the OTHER adjustment reason is selected.
- **Deliverable & Acceptance Criteria:** Zod schema rejects OTHER reason without accompanying note.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-03] #81 - Web: Adjust reason enum with mandatory note for OTHER..." --label "frontend,form,must,vs-17" --body "### Architectural Scope\nForm validation rule requiring explanatory text when the OTHER adjustment reason is selected.\n\n### Deliverable\nZod schema rejects OTHER reason without accompanying note.\n\nFiles: web/src/features/stock/adjust-schema.ts"
  ```

### Task #82: [VS-17-04] Web: Stock screen quick actions bar (Receive/Adjust/Export) _(Orig #80)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/StockActionsBar.tsx`
- **Architectural Scope & Invariants:** Action bar at the top of the inventory screen providing 1-tap shortcuts to receive stock, adjust stock, or export ledger.
- **Deliverable & Acceptance Criteria:** Actions bar matches stitch prototype layout.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-04] #82 - Web: Stock screen quick actions bar (Receive/Adjust/Export)..." --label "frontend,component,must,vs-17" --body "### Architectural Scope\nAction bar at the top of the inventory screen providing 1-tap shortcuts to receive stock, adjust stock, or export ledger.\n\n### Deliverable\nActions bar matches stitch prototype layout.\n\nFiles: web/src/features/stock/StockActionsBar.tsx"
  ```

### Task #83: [VS-17-05] Web: Low stock threshold display on product cards _(Orig #81)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/LowStockBadge.tsx`
- **Architectural Scope & Invariants:** Warning badge tag displayed on product cards when stock drops below configured low-stock threshold.
- **Deliverable & Acceptance Criteria:** Badge displays amber warning when current stock <= threshold.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-05] #83 - Web: Low stock threshold display on product cards..." --label "frontend,component,must,vs-17" --body "### Architectural Scope\nWarning badge tag displayed on product cards when stock drops below configured low-stock threshold.\n\n### Deliverable\nBadge displays amber warning when current stock <= threshold.\n\nFiles: web/src/features/stock/LowStockBadge.tsx"
  ```

### Task #84: [VS-17-06] Web: Stock summary cards (Total SKUs, Low Stock Count) _(Orig #82)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/StockSummaryCards.tsx`
- **Architectural Scope & Invariants:** Summary metric cards displaying active SKU count, total items, and low-stock alert count.
- **Deliverable & Acceptance Criteria:** Summary cards render accurately from local Dexie data.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-17-06] #84 - Web: Stock summary cards (Total SKUs, Low Stock Count)..." --label "frontend,component,must,vs-17" --body "### Architectural Scope\nSummary metric cards displaying active SKU count, total items, and low-stock alert count.\n\n### Deliverable\nSummary cards render accurately from local Dexie data.\n\nFiles: web/src/features/stock/StockSummaryCards.tsx"
  ```

---

## VS-18: Stock Movement History & Audit Drawer

> **Feature Scope:** Stock overview screen, movement history list, and slide-out audit drawer displaying cryptographic hashes.
> **Task Range:** `#85` through `#86` (2 tasks)

### Task #85: [VS-18-01] Web: Stock screen card list (mobile) + DataTable (desktop) with Receive/Adjust/History actions _(Orig #53)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/StockScreen.tsx`
- **Architectural Scope & Invariants:** Central inventory management view displaying stock balances, low-stock alerts, and action triggers.
- **Deliverable & Acceptance Criteria:** Stock screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-18-01] #85 - Web: Stock screen card list (mobile) + DataTable (desktop) w..." --label "frontend,ui,must,vs-18" --body "### Architectural Scope\nCentral inventory management view displaying stock balances, low-stock alerts, and action triggers.\n\n### Deliverable\nStock screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/stock/StockScreen.tsx"
  ```

### Task #86: [VS-18-02] Web: Stock History drawer/sheet (chronological movements with actor, device, resulting balance) _(Orig #55)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/stock/StockHistoryDrawer.tsx`
- **Architectural Scope & Invariants:** Slide-out movement audit drawer showing chronological SKU event trail, timestamps, and cryptographic hashes.
- **Deliverable & Acceptance Criteria:** Audit drawer renders immutable event history.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-18-02] #86 - Web: Stock History drawer/sheet (chronological movements wit..." --label "frontend,ui,must,vs-18" --body "### Architectural Scope\nSlide-out movement audit drawer showing chronological SKU event trail, timestamps, and cryptographic hashes.\n\n### Deliverable\nAudit drawer renders immutable event history.\n\nFiles: web/src/features/stock/StockHistoryDrawer.tsx"
  ```

---

## VS-19: Offline Sync Server Push Pipeline & Idempotency

> **Feature Scope:** POST /v1/sync/push, per-shop row locks, ProcessedOperation idempotency, ChangeLog sequence allocation, and outcome matrix.
> **Task Range:** `#87` through `#94` (8 tasks)

### Task #87: [VS-19-01] PushService: per-op transaction, shop lock → product locks (ascending ID), re-check ProcessedOperation _(Orig #83)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/services/push.py`
- **Architectural Scope & Invariants:** Server push engine acquiring shop lock followed by product locks in deterministic ascending ID order to prevent deadlocks.
- **Deliverable & Acceptance Criteria:** PushService passes deadlock stress tests under concurrent multi-device push.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-01] #87 - PushService: per-op transaction, shop lock → product locks (..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nServer push engine acquiring shop lock followed by product locks in deterministic ascending ID order to prevent deadlocks.\n\n### Deliverable\nPushService passes deadlock stress tests under concurrent multi-device push.\n\nFiles: backend/apps/sync/services/push.py"
  ```

### Task #88: [VS-19-02] Idempotency: ProcessedOperation table (opId, payloadHash, outcome, resultJson); same hash = stored result; different hash = IDEMPOTENCY_KEY_REUSE _(Orig #84)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/models/processed_op.py`
- **Architectural Scope & Invariants:** PostgreSQL idempotency tracking table caching operation results. Replays stored result on duplicate opId; rejects key reuse on payload mismatch.
- **Deliverable & Acceptance Criteria:** Idempotency tests verify duplicate opId returns identical response (AT-04).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-02] #88 - Idempotency: ProcessedOperation table (opId, payloadHash, ou..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nPostgreSQL idempotency tracking table caching operation results. Replays stored result on duplicate opId; rejects key reuse on payload mismatch.\n\n### Deliverable\nIdempotency tests verify duplicate opId returns identical response (AT-04).\n\nFiles: backend/apps/sync/models/processed_op.py"
  ```

### Task #89: [VS-19-03] OperationDispatcher registry (built in config/container.py): maps OperationType → (payload parser, handler); architecture test asserts completeness _(Orig #85)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/dispatcher.py`
- **Architectural Scope & Invariants:** Type-safe operation registry routing incoming sync operations (RECORD_SALE, RECEIVE_STOCK, ADJUST_STOCK) to appropriate domain handlers.
- **Deliverable & Acceptance Criteria:** Architecture test asserts 100% operation type coverage in dispatcher.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-03] #89 - OperationDispatcher registry (built in config/container.py):..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nType-safe operation registry routing incoming sync operations (RECORD_SALE, RECEIVE_STOCK, ADJUST_STOCK) to appropriate domain handlers.\n\n### Deliverable\nArchitecture test asserts 100% operation type coverage in dispatcher.\n\nFiles: backend/apps/sync/dispatcher.py"
  ```

### Task #90: [VS-19-04] dependsOn resolution: dependent op gets REJECTED_DEPENDENCY or quarantined into same case _(Orig #87)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/dependency_resolver.py`
- **Architectural Scope & Invariants:** Batch dependency resolver ensuring operations referencing prior operations within the same batch execute in causal order.
- **Deliverable & Acceptance Criteria:** Dependency resolver handles dependent operation failures gracefully.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-04] #90 - dependsOn resolution: dependent op gets REJECTED_DEPENDENCY ..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nBatch dependency resolver ensuring operations referencing prior operations within the same batch execute in causal order.\n\n### Deliverable\nDependency resolver handles dependent operation failures gracefully.\n\nFiles: backend/apps/sync/dependency_resolver.py"
  ```

### Task #91: [VS-19-05] Lease validation at receipt time: membership ACTIVE, lease valid, device matches, op type allowed, clientCreatedAt in window ±5min _(Orig #88)_

- **Layer:** `Backend / Security` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/lease_validator.py`
- **Architectural Scope & Invariants:** Server sync gate verifying device lease validity, temporal sync window, and operation permissions before execution.
- **Deliverable & Acceptance Criteria:** Lease validation tests verify expired leases are rejected.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-05] #91 - Lease validation at receipt time: membership ACTIVE, lease v..." --label "backend,security,must,vs-19" --body "### Architectural Scope\nServer sync gate verifying device lease validity, temporal sync window, and operation permissions before execution.\n\n### Deliverable\nLease validation tests verify expired leases are rejected.\n\nFiles: backend/apps/sync/lease_validator.py"
  ```

### Task #92: [VS-19-06] Outcome matrix implementation (§6.8 table) for all operation types × situations _(Orig #90)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/outcome_matrix.py`
- **Architectural Scope & Invariants:** Implementation of SDD §6.8 outcome matrix covering all operation types across active, oversold, and deactivated device states.
- **Deliverable & Acceptance Criteria:** Comprehensive test suite covering all outcome matrix scenarios.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-06] #92 - Outcome matrix implementation (§6.8 table) for all operation..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nImplementation of SDD §6.8 outcome matrix covering all operation types across active, oversold, and deactivated device states.\n\n### Deliverable\nComprehensive test suite covering all outcome matrix scenarios.\n\nFiles: backend/apps/sync/outcome_matrix.py"
  ```

### Task #93: [VS-19-07] ChangeLog allocation under shop lock: shop.syncSeq += 1 per touched entity; written to ChangeLog + StockChange.serverSeq + Product.updatedSeq _(Orig #91)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/change_log.py`
- **Architectural Scope & Invariants:** Monotonic sequence number generator allocating gap-free sequence IDs per shop under the shop row lock.
- **Deliverable & Acceptance Criteria:** ChangeLog sequence tests assert strictly increasing gap-free numbering.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-07] #93 - ChangeLog allocation under shop lock: shop.syncSeq += 1 per ..." --label "backend,sync,must,vs-19" --body "### Architectural Scope\nMonotonic sequence number generator allocating gap-free sequence IDs per shop under the shop row lock.\n\n### Deliverable\nChangeLog sequence tests assert strictly increasing gap-free numbering.\n\nFiles: backend/apps/sync/change_log.py"
  ```

### Task #94: [VS-19-08] Push response: per-op OperationResult with entries, stockAfter, conflictCaseId, reasonCode, replayed, noop _(Orig #92)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/serializers.py`
- **Architectural Scope & Invariants:** Structured push response contract detailing exact outcome, confirmed server sequence, and resulting stock balance for each operation.
- **Deliverable & Acceptance Criteria:** Push response schema validated against OpenAPI contract.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-19-08] #94 - Push response: per-op OperationResult with entries, stockAft..." --label "backend,api,must,vs-19" --body "### Architectural Scope\nStructured push response contract detailing exact outcome, confirmed server sequence, and resulting stock balance for each operation.\n\n### Deliverable\nPush response schema validated against OpenAPI contract.\n\nFiles: backend/apps/sync/serializers.py"
  ```

---

## VS-20: Client Outbox Dispatcher & Multi-Tab Web Lock

> **Feature Scope:** Client outbox batch push (<=50 ops), exponential backoff with jitter, Web Lock coordinator, and ResultApplier.
> **Task Range:** `#95` through `#98` (4 tasks)

### Task #95: [VS-20-01] Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; retry same opId on transport failure; poison guard (8 failures → ATTENTION_REQUIRED) _(Orig #93)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/push-stage.ts`
- **Architectural Scope & Invariants:** Client outbox dispatcher packaging batches of up to 50 operations in deviceSeq order. Poison pill guard flags unprocessable operations.
- **Deliverable & Acceptance Criteria:** Push stage tests verify batch transmission and poison pill quarantine.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-20-01] #95 - Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; ..." --label "frontend,sync,must,vs-20" --body "### Architectural Scope\nClient outbox dispatcher packaging batches of up to 50 operations in deviceSeq order. Poison pill guard flags unprocessable operations.\n\n### Deliverable\nPush stage tests verify batch transmission and poison pill quarantine.\n\nFiles: web/src/sync/push-stage.ts"
  ```

### Task #96: [VS-20-02] Web backoff: exponential (base 2s, factor 2, cap 5min, full jitter) _(Orig #94)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/backoff.ts`
- **Architectural Scope & Invariants:** Network retry algorithm using exponential backoff with full jitter to avoid thundering herd server overload when connectivity returns.
- **Deliverable & Acceptance Criteria:** Backoff tests verify delay bounds and randomized jitter.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-20-02] #96 - Web backoff: exponential (base 2s, factor 2, cap 5min, full ..." --label "frontend,sync,must,vs-20" --body "### Architectural Scope\nNetwork retry algorithm using exponential backoff with full jitter to avoid thundering herd server overload when connectivity returns.\n\n### Deliverable\nBackoff tests verify delay bounds and randomized jitter.\n\nFiles: web/src/sync/backoff.ts"
  ```

### Task #97: [VS-20-03] Web: Sync Engine single-flight Web Lock (stokari-sync-{shopId}) for multi-tab safety _(Orig #95)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/web-lock.ts`
- **Architectural Scope & Invariants:** Single-leader election using Web Locks API (navigator.locks.request) ensuring only one browser tab syncs at a time.
- **Deliverable & Acceptance Criteria:** Multi-tab simulation test verifies only one tab acquires sync lock.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-20-03] #97 - Web: Sync Engine single-flight Web Lock (stokari-sync-{shopI..." --label "frontend,sync,must,vs-20" --body "### Architectural Scope\nSingle-leader election using Web Locks API (navigator.locks.request) ensuring only one browser tab syncs at a time.\n\n### Deliverable\nMulti-tab simulation test verifies only one tab acquires sync lock.\n\nFiles: web/src/sync/web-lock.ts"
  ```

### Task #98: [VS-20-04] Web: Result Applier — updates Dexie rows in one atomic transaction (§5.10) _(Orig #96)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/result-applier.ts`
- **Architectural Scope & Invariants:** Client sync consumer updating local Dexie records with confirmed server IDs, clearing outbox rows, and updating projection balances.
- **Deliverable & Acceptance Criteria:** Result applier passes atomic Dexie update tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-20-04] #98 - Web: Result Applier — updates Dexie rows in one atomic trans..." --label "frontend,sync,must,vs-20" --body "### Architectural Scope\nClient sync consumer updating local Dexie records with confirmed server IDs, clearing outbox rows, and updating projection balances.\n\n### Deliverable\nResult applier passes atomic Dexie update tests.\n\nFiles: web/src/sync/result-applier.ts"
  ```

---

## VS-21: Offline Sync Pull Pipeline & Device Hydration

> **Feature Scope:** GET /v1/sync/pull cursor-based deltas, initial bootstrap, CURSOR_RESET, reachability probe, and header SyncPill.
> **Task Range:** `#99` through `#106` (8 tasks)

### Task #99: [VS-21-01] PullService: GET /v1/sync/pull?cursor=N&limit=200 → next limit ChangeLog rows → load current entities (role-filtered) → return nextCursor, hasMore, headSeq, serverTime _(Orig #97)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/services/pull.py`
- **Architectural Scope & Invariants:** Cursor-based delta synchronization service loading modified entities since cursor N, filtered by caller role.
- **Deliverable & Acceptance Criteria:** PullService integration tests verify delta pagination and headSeq tracking.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-01] #99 - PullService: GET /v1/sync/pull?cursor=N&limit=200 → next lim..." --label "backend,sync,must,vs-21" --body "### Architectural Scope\nCursor-based delta synchronization service loading modified entities since cursor N, filtered by caller role.\n\n### Deliverable\nPullService integration tests verify delta pagination and headSeq tracking.\n\nFiles: backend/apps/sync/services/pull.py"
  ```

### Task #100: [VS-21-02] Pull response: products, stockChanges, stockLevels, sales, saleCancellations, actors, conflicts (owner only) _(Orig #98)_

- **Layer:** `Backend / API` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/views.py`
- **Architectural Scope & Invariants:** Complete pull DTO contract returning delta arrays for products, ledger movements, sales, and conflicts.
- **Deliverable & Acceptance Criteria:** Pull endpoint verified with role-based field stripping.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-02] #100 - Pull response: products, stockChanges, stockLevels, sales, s..." --label "backend,api,must,vs-21" --body "### Architectural Scope\nComplete pull DTO contract returning delta arrays for products, ledger movements, sales, and conflicts.\n\n### Deliverable\nPull endpoint verified with role-based field stripping.\n\nFiles: backend/apps/sync/views.py"
  ```

### Task #101: [VS-21-03] Web pull stage: ONE Dexie tx — upsert by id, apply stockLevels only if version > confirmedVersion, recompute pendingDelta, update pullCursor _(Orig #99)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/pull-stage.ts`
- **Architectural Scope & Invariants:** Client pull consumer updating local IndexedDB cache in a single atomic transaction without overwriting pending local operations.
- **Deliverable & Acceptance Criteria:** Pull stage integration test passes asserting cursor advancement.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-03] #101 - Web pull stage: ONE Dexie tx — upsert by id, apply stockLeve..." --label "frontend,sync,must,vs-21" --body "### Architectural Scope\nClient pull consumer updating local IndexedDB cache in a single atomic transaction without overwriting pending local operations.\n\n### Deliverable\nPull stage integration test passes asserting cursor advancement.\n\nFiles: web/src/sync/pull-stage.ts"
  ```

### Task #102: [VS-21-04] New-device bootstrap: cursor=0 → pull pages until hasMore=false → integrity check → ready _(Orig #100)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/bootstrap.ts`
- **Architectural Scope & Invariants:** Initial device hydration loading entire store catalog and confirmed stock levels onto a clean device.
- **Deliverable & Acceptance Criteria:** Bootstrap routine hydrates 2,000 products cleanly.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-04] #102 - New-device bootstrap: cursor=0 → pull pages until hasMore=fa..." --label "frontend,sync,must,vs-21" --body "### Architectural Scope\nInitial device hydration loading entire store catalog and confirmed stock levels onto a clean device.\n\n### Deliverable\nBootstrap routine hydrates 2,000 products cleanly.\n\nFiles: web/src/sync/bootstrap.ts"
  ```

### Task #103: [VS-21-05] CURSOR_RESET handling: restart from 0 without touching outbox _(Orig #101)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/cursor-reset.ts`
- **Architectural Scope & Invariants:** Recovery protocol recovering from expired server cursors by restarting pull from 0 without touching pending outbox records.
- **Deliverable & Acceptance Criteria:** Cursor reset test asserts pending outbox operations preserved.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-05] #103 - CURSOR_RESET handling: restart from 0 without touching outbo..." --label "frontend,sync,must,vs-21" --body "### Architectural Scope\nRecovery protocol recovering from expired server cursors by restarting pull from 0 without touching pending outbox records.\n\n### Deliverable\nCursor reset test asserts pending outbox operations preserved.\n\nFiles: web/src/sync/cursor-reset.ts"
  ```

### Task #104: [VS-21-06] Health probe: GET /health (2s timeout, no DB heavy work); used for online/offline decision, warm-up _(Orig #102)_

- **Layer:** `Backend / Health` | **Priority:** **Must**
- **Target Files:** `backend/backend/views.py`
- **Architectural Scope & Invariants:** Lightweight health probe returning server timestamp for client clock-skew detection.
- **Deliverable & Acceptance Criteria:** Health probe returns 200 OK in < 10ms.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-06] #104 - Health probe: GET /health (2s timeout, no DB heavy work); us..." --label "backend,health,must,vs-21" --body "### Architectural Scope\nLightweight health probe returning server timestamp for client clock-skew detection.\n\n### Deliverable\nHealth probe returns 200 OK in < 10ms.\n\nFiles: backend/backend/views.py"
  ```

### Task #105: [VS-21-07] Web: Sync trigger schedule (app open, online event, tab visible, debounced 500ms, timer 30s) _(Orig #103)_

- **Layer:** `Frontend / Sync` | **Priority:** **Must**
- **Target Files:** `web/src/sync/sync-coordinator.ts`
- **Architectural Scope & Invariants:** Event-driven sync coordinator triggering on app launch, network online event, tab visibility, and periodic 30s timer.
- **Deliverable & Acceptance Criteria:** Coordinator triggers sync on network reconnect.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-07] #105 - Web: Sync trigger schedule (app open, online event, tab visi..." --label "frontend,sync,must,vs-21" --body "### Architectural Scope\nEvent-driven sync coordinator triggering on app launch, network online event, tab visibility, and periodic 30s timer.\n\n### Deliverable\nCoordinator triggers sync on network reconnect.\n\nFiles: web/src/sync/sync-coordinator.ts"
  ```

### Task #106: [VS-21-08] Web: SyncPill in header with popover (last sync, outbox count, storage, persistent status, 'Sync Now') _(Orig #104)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/ui/SyncPill.tsx`
- **Architectural Scope & Invariants:** Interactive header badge displaying 4 sync states (Synced, Syncing, Offline, Conflict) with detail popover.
- **Deliverable & Acceptance Criteria:** SyncPill verified matching stitch prototype styling and interactive popover.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-21-08] #106 - Web: SyncPill in header with popover (last sync, outbox coun..." --label "frontend,ui,must,vs-21" --body "### Architectural Scope\nInteractive header badge displaying 4 sync states (Synced, Syncing, Offline, Conflict) with detail popover.\n\n### Deliverable\nSyncPill verified matching stitch prototype styling and interactive popover.\n\nFiles: web/src/ui/SyncPill.tsx"
  ```

---

## VS-22: AT-06 Conflict Detection & Review Queue

> **Feature Scope:** StockBecameNegative event, ConflictCase model, Sell Anyway warning sheet, and owner review queue with parallel timeline.
> **Task Range:** `#107` through `#114` (8 tasks)

### Task #107: [VS-22-01] Domain event: StockBecameNegative published in-transaction; ConflictService subscribes → opens/extends OFFLINE_OVERSELL case, sets underReview _(Orig #46)_

- **Layer:** `Backend / Events` | **Priority:** **Must**
- **Target Files:** `backend/apps/ledger/events.py, backend/apps/conflicts/subscribers.py`
- **Architectural Scope & Invariants:** In-transaction domain event trigger: when balance drops below zero, flags StockLevel.under_review = True and opens an AT-06 ConflictCase.
- **Deliverable & Acceptance Criteria:** Integration test asserting oversell opens conflict case in same transaction (AT-06).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-01] #107 - Domain event: StockBecameNegative published in-transaction; ..." --label "backend,events,must,vs-22" --body "### Architectural Scope\nIn-transaction domain event trigger: when balance drops below zero, flags StockLevel.under_review = True and opens an AT-06 ConflictCase.\n\n### Deliverable\nIntegration test asserting oversell opens conflict case in same transaction (AT-06).\n\nFiles: backend/apps/ledger/events.py, backend/apps/conflicts/subscribers.py"
  ```

### Task #108: [VS-22-02] Web: Sell Anyway Alert Sheet (warns confirmed vs projected, flags for review, destructive button) _(Orig #67)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/SellAnywaySheet.tsx`
- **Architectural Scope & Invariants:** Explicit confirmation sheet warning cashier that sale exceeds stock, allowing them to proceed while tagging sale for owner review (AT-06).
- **Deliverable & Acceptance Criteria:** Sell Anyway sheet records sale with needs_review flag.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-02] #108 - Web: Sell Anyway Alert Sheet (warns confirmed vs projected, ..." --label "frontend,ui,must,vs-22" --body "### Architectural Scope\nExplicit confirmation sheet warning cashier that sale exceeds stock, allowing them to proceed while tagging sale for owner review (AT-06).\n\n### Deliverable\nSell Anyway sheet records sale with needs_review flag.\n\nFiles: web/src/features/pos/SellAnywaySheet.tsx"
  ```

### Task #109: [VS-22-03] ConflictCase model: type, productId, status, version, stateSnapshot, items[], quarantined[], resolution, resolvedBy _(Orig #105)_

- **Layer:** `Backend / Models` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/models.py`
- **Architectural Scope & Invariants:** ConflictCase table with optimistic locking version, conflicting sale line references, and audit resolution snapshots.
- **Deliverable & Acceptance Criteria:** Conflict models migration running cleanly on PostgreSQL.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-03] #109 - ConflictCase model: type, productId, status, version, stateS..." --label "backend,models,must,vs-22" --body "### Architectural Scope\nConflictCase table with optimistic locking version, conflicting sale line references, and audit resolution snapshots.\n\n### Deliverable\nConflict models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/conflicts/models.py"
  ```

### Task #110: [VS-22-04] ConflictService: opens/extends cases on StockBecameNegative, PRODUCT_INACTIVE, CANCELLATION_CONFLICT, INVALID_STOCK_OPERATION _(Orig #106)_

- **Layer:** `Backend / Conflicts` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/services.py`
- **Architectural Scope & Invariants:** Conflict engine grouping concurrent oversell events on the same product into a single open conflict case.
- **Deliverable & Acceptance Criteria:** ConflictService groups multiple oversell events into single case (AT-06).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-04] #110 - ConflictService: opens/extends cases on StockBecameNegative,..." --label "backend,conflicts,must,vs-22" --body "### Architectural Scope\nConflict engine grouping concurrent oversell events on the same product into a single open conflict case.\n\n### Deliverable\nConflictService groups multiple oversell events into single case (AT-06).\n\nFiles: backend/apps/conflicts/services.py"
  ```

### Task #111: [VS-22-05] Web: Review queue (owner) — card list (mobile) + split-pane (desktop) with case list + detail drawer _(Orig #110)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/ConflictReviewScreen.tsx`
- **Architectural Scope & Invariants:** Owner arbitration dashboard displaying active conflict queue with parallel cashier timelines.
- **Deliverable & Acceptance Criteria:** Conflict review screen matches stitch prototype layout and mobile responsiveness.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-05] #111 - Web: Review queue (owner) — card list (mobile) + split-pane ..." --label "frontend,ui,must,vs-22" --body "### Architectural Scope\nOwner arbitration dashboard displaying active conflict queue with parallel cashier timelines.\n\n### Deliverable\nConflict review screen matches stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/conflicts/ConflictReviewScreen.tsx"
  ```

### Task #112: [VS-22-06] Web: Conflict case card — type badge, product, current balance, timeline preview (last 3 events) _(Orig #111)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/ConflictCaseCard.tsx`
- **Architectural Scope & Invariants:** Card component displaying product, negative balance amount, and conflicting cashiers.
- **Deliverable & Acceptance Criteria:** Conflict card renders with appropriate severity badges.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-06] #112 - Web: Conflict case card — type badge, product, current balan..." --label "frontend,component,must,vs-22" --body "### Architectural Scope\nCard component displaying product, negative balance amount, and conflicting cashiers.\n\n### Deliverable\nConflict card renders with appropriate severity badges.\n\nFiles: web/src/features/conflicts/ConflictCaseCard.tsx"
  ```

### Task #113: [VS-22-07] Web: Conflict case detail drawer — discrepancy alert, concurrent timeline, 3 resolution actions _(Orig #112)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/ConflictDetailDrawer.tsx`
- **Architectural Scope & Invariants:** Parallel timeline comparison view showing Register 1 Hana vs Register 2 Dawit concurrent sales with deficit summary.
- **Deliverable & Acceptance Criteria:** Detail drawer renders concurrent timeline and resolution buttons.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-07] #113 - Web: Conflict case detail drawer — discrepancy alert, concur..." --label "frontend,ui,must,vs-22" --body "### Architectural Scope\nParallel timeline comparison view showing Register 1 Hana vs Register 2 Dawit concurrent sales with deficit summary.\n\n### Deliverable\nDetail drawer renders concurrent timeline and resolution buttons.\n\nFiles: web/src/features/conflicts/ConflictDetailDrawer.tsx"
  ```

### Task #114: [VS-22-08] Mobile Sell Anyway Sheet (destructive variant, confirmed vs projected) _(Orig #183)_

- **Layer:** `Frontend / Polish` | **Priority:** **Must**
- **Target Files:** `web/src/features/pos/SellAnywayMobile.tsx`
- **Architectural Scope & Invariants:** High-contrast warning dialog approving offline overselling on mobile screens.
- **Deliverable & Acceptance Criteria:** Alert dialog conforms to WCAG 2.2 touch-target and contrast rules.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-22-08] #114 - Mobile Sell Anyway Sheet (destructive variant, confirmed vs ..." --label "frontend,polish,must,vs-22" --body "### Architectural Scope\nHigh-contrast warning dialog approving offline overselling on mobile screens.\n\n### Deliverable\nAlert dialog conforms to WCAG 2.2 touch-target and contrast rules.\n\nFiles: web/src/features/pos/SellAnywayMobile.tsx"
  ```

---

## VS-23: Conflict Arbitration & Owner Resolution Actions

> **Feature Scope:** ResolveConflictHandler with optimistic locking, 3 resolution actions (Restock, Cancel, Acknowledge), and in-app notifications.
> **Task Range:** `#115` through `#121` (7 tasks)

### Task #115: [VS-23-01] ResolveConflictHandler (owner): validates caseVersion, applies RECONCILE_STOCK / CANCEL_SALE / ACKNOWLEDGE via StockLogService, closes case, clears underReview _(Orig #107)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/handlers/resolve.py`
- **Architectural Scope & Invariants:** Owner resolution service executing corrective ledger movements, closing the conflict case, and clearing product under_review flag.
- **Deliverable & Acceptance Criteria:** ResolveConflictHandler closes case and clears underReview (AT-06).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-01] #115 - ResolveConflictHandler (owner): validates caseVersion, appli..." --label "backend,handlers,must,vs-23" --body "### Architectural Scope\nOwner resolution service executing corrective ledger movements, closing the conflict case, and clearing product under_review flag.\n\n### Deliverable\nResolveConflictHandler closes case and clears underReview (AT-06).\n\nFiles: backend/apps/conflicts/handlers/resolve.py"
  ```

### Task #116: [VS-23-02] Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STALE_RESOLUTION event, case stays OPEN _(Orig #108)_

- **Layer:** `Backend / Conflicts` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/handlers/stale_resolution.py`
- **Architectural Scope & Invariants:** Optimistic concurrency guard preventing conflicting owner resolutions if new concurrent sales occurred while reviewing.
- **Deliverable & Acceptance Criteria:** Stale resolution test asserts case remains OPEN on version conflict.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-02] #116 - Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STAL..." --label "backend,conflicts,must,vs-23" --body "### Architectural Scope\nOptimistic concurrency guard preventing conflicting owner resolutions if new concurrent sales occurred while reviewing.\n\n### Deliverable\nStale resolution test asserts case remains OPEN on version conflict.\n\nFiles: backend/apps/conflicts/handlers/stale_resolution.py"
  ```

### Task #117: [VS-23-03] Web: Resolution actions — Record Restock (qty + note), Cancel Sale (select + reason), Acknowledge Deficit _(Orig #113)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/ResolutionActionModals.tsx`
- **Architectural Scope & Invariants:** 3 functional owner resolution action dialogs executing atomic corrective actions.
- **Deliverable & Acceptance Criteria:** Action modals execute respective conflict resolution endpoints.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-03] #117 - Web: Resolution actions — Record Restock (qty + note), Cance..." --label "frontend,ui,must,vs-23" --body "### Architectural Scope\n3 functional owner resolution action dialogs executing atomic corrective actions.\n\n### Deliverable\nAction modals execute respective conflict resolution endpoints.\n\nFiles: web/src/features/conflicts/ResolutionActionModals.tsx"
  ```

### Task #118: [VS-23-04] Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDING → owner in-app + GET /notifications _(Orig #117)_

- **Layer:** `Shared Domain` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/notifications.py, web/src/features/notifications/NotificationDrawer.tsx`
- **Architectural Scope & Invariants:** In-app notification system alerting owner to overselling events and quarantine items.
- **Deliverable & Acceptance Criteria:** Notification drawer renders unread conflict alerts.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-04] #118 - Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDIN..." --label "shared domain,must,vs-23" --body "### Architectural Scope\nIn-app notification system alerting owner to overselling events and quarantine items.\n\n### Deliverable\nNotification drawer renders unread conflict alerts.\n\nFiles: backend/apps/conflicts/notifications.py, web/src/features/notifications/NotificationDrawer.tsx"
  ```

### Task #119: [VS-23-05] Web: Notifications screen (list + mark read) _(Orig #118)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/notifications/NotificationScreen.tsx`
- **Architectural Scope & Invariants:** Notification view listing store alerts with 1-tap mark read actions.
- **Deliverable & Acceptance Criteria:** Notification screen marks items read and updates badge.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-05] #119 - Web: Notifications screen (list + mark read)..." --label "frontend,ui,must,vs-23" --body "### Architectural Scope\nNotification view listing store alerts with 1-tap mark read actions.\n\n### Deliverable\nNotification screen marks items read and updates badge.\n\nFiles: web/src/features/notifications/NotificationScreen.tsx"
  ```

### Task #120: [VS-23-06] Web: Conflict state machine: OPEN → RESOLVED only via explicit ResolveConflict _(Orig #119)_

- **Layer:** `Frontend / State` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/state-machine.ts`
- **Architectural Scope & Invariants:** State machine preventing automatic or accidental dismissal of conflict cases.
- **Deliverable & Acceptance Criteria:** State machine asserts cases stay OPEN until explicit resolution.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-06] #120 - Web: Conflict state machine: OPEN → RESOLVED only via explic..." --label "frontend,state,must,vs-23" --body "### Architectural Scope\nState machine preventing automatic or accidental dismissal of conflict cases.\n\n### Deliverable\nState machine asserts cases stay OPEN until explicit resolution.\n\nFiles: web/src/features/conflicts/state-machine.ts"
  ```

### Task #121: [VS-23-07] Architecture test: every ConflictType has resolution paths; no auto-close _(Orig #120)_

- **Layer:** `Backend / Test` | **Priority:** **Must**
- **Target Files:** `backend/tests/architecture/test_conflict_completeness.py`
- **Architectural Scope & Invariants:** Automated architectural test verifying zero unhandled conflict states in backend.
- **Deliverable & Acceptance Criteria:** Architecture test asserts completeness of resolution paths.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-23-07] #121 - Architecture test: every ConflictType has resolution paths; ..." --label "backend,test,must,vs-23" --body "### Architectural Scope\nAutomated architectural test verifying zero unhandled conflict states in backend.\n\n### Deliverable\nArchitecture test asserts completeness of resolution paths.\n\nFiles: backend/tests/architecture/test_conflict_completeness.py"
  ```

---

## VS-24: Deactivated Staff Drain Flow & Security Quarantine

> **Feature Scope:** 10-minute drain token JWT, quarantine isolation (zero ledger impact), and owner Accept/Reject inspection tab.
> **Task Range:** `#122` through `#126` (5 tasks)

### Task #122: [VS-24-01] Quarantine path: stores full payload, QUARANTINED outcome, AUTHORIZATION_REVIEW case, no stock log effect _(Orig #89)_

- **Layer:** `Backend / Sync` | **Priority:** **Must**
- **Target Files:** `backend/apps/sync/quarantine.py`
- **Architectural Scope & Invariants:** Quarantine storage isolating unauthorized or suspicious operations without applying any mutations to the stock ledger.
- **Deliverable & Acceptance Criteria:** Quarantine tests assert quarantined operation produces zero ledger entries.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-24-01] #122 - Quarantine path: stores full payload, QUARANTINED outcome, A..." --label "backend,sync,must,vs-24" --body "### Architectural Scope\nQuarantine storage isolating unauthorized or suspicious operations without applying any mutations to the stock ledger.\n\n### Deliverable\nQuarantine tests assert quarantined operation produces zero ledger entries.\n\nFiles: backend/apps/sync/quarantine.py"
  ```

### Task #123: [VS-24-02] ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs original handler as original actor, returns inner[] per-op results) / REJECT_QUARANTINED _(Orig #109)_

- **Layer:** `Backend / Handlers` | **Priority:** **Must**
- **Target Files:** `backend/apps/conflicts/handlers/quarantine.py`
- **Architectural Scope & Invariants:** Quarantine review service executing late operations retrospectively or permanently rejecting them with an audit reason.
- **Deliverable & Acceptance Criteria:** Quarantine review handler executes accepted operations.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-24-02] #123 - ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs..." --label "backend,handlers,must,vs-24" --body "### Architectural Scope\nQuarantine review service executing late operations retrospectively or permanently rejecting them with an audit reason.\n\n### Deliverable\nQuarantine review handler executes accepted operations.\n\nFiles: backend/apps/conflicts/handlers/quarantine.py"
  ```

### Task #124: [VS-24-03] Web: Quarantined operations tab — table with Accept/Reject per operation or bulk per device _(Orig #114)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/QuarantinedOperationsTab.tsx`
- **Architectural Scope & Invariants:** Inspection table displaying operations sent by deactivated cashier devices with Accept/Reject actions.
- **Deliverable & Acceptance Criteria:** Quarantined tab renders with audit reason inputs.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-24-03] #124 - Web: Quarantined operations tab — table with Accept/Reject p..." --label "frontend,ui,must,vs-24" --body "### Architectural Scope\nInspection table displaying operations sent by deactivated cashier devices with Accept/Reject actions.\n\n### Deliverable\nQuarantined tab renders with audit reason inputs.\n\nFiles: web/src/features/conflicts/QuarantinedOperationsTab.tsx"
  ```

### Task #125: [VS-24-04] Web: Quarantine Accept → re-runs handler, shows per-op results in inner[] _(Orig #115)_

- **Layer:** `Frontend / UseCase` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/usecases/acceptQuarantine.ts`
- **Architectural Scope & Invariants:** Client action triggering server re-execution of quarantined operation.
- **Deliverable & Acceptance Criteria:** Accept quarantine updates local state with confirmed sale.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-24-04] #125 - Web: Quarantine Accept → re-runs handler, shows per-op resul..." --label "frontend,usecase,must,vs-24" --body "### Architectural Scope\nClient action triggering server re-execution of quarantined operation.\n\n### Deliverable\nAccept quarantine updates local state with confirmed sale.\n\nFiles: web/src/features/conflicts/usecases/acceptQuarantine.ts"
  ```

### Task #126: [VS-24-05] Web: Quarantine Reject → archives with reason, never deletes _(Orig #116)_

- **Layer:** `Frontend / UseCase` | **Priority:** **Must**
- **Target Files:** `web/src/features/conflicts/usecases/rejectQuarantine.ts`
- **Architectural Scope & Invariants:** Client action archiving quarantined operation with permanent audit note.
- **Deliverable & Acceptance Criteria:** Reject quarantine archives record without deleting.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-24-05] #126 - Web: Quarantine Reject → archives with reason, never deletes..." --label "frontend,usecase,must,vs-24" --body "### Architectural Scope\nClient action archiving quarantined operation with permanent audit note.\n\n### Deliverable\nReject quarantine archives record without deleting.\n\nFiles: web/src/features/conflicts/usecases/rejectQuarantine.ts"
  ```

---

## VS-25: Today's Revenue Dashboard (3-Bucket Accounting)

> **Feature Scope:** Offline Dexie aggregation grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review), and Today screen.
> **Task Range:** `#127` through `#132` (6 tasks)

### Task #127: [VS-25-01] Offline dashboard (Web): three buckets — Confirmed (SYNCED), Local Pending (WAITING_TO_SYNC/SYNCING), Needs Review (NEEDS_REVIEW + quarantined) — no double counting _(Orig #121)_

- **Layer:** `Frontend / Dashboard` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/useTodayRevenue.ts`
- **Architectural Scope & Invariants:** Client-side aggregation engine reading Dexie sales tables and grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review).
- **Deliverable & Acceptance Criteria:** Revenue buckets calculate with zero double-counting (AT-13).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-01] #127 - Offline dashboard (Web): three buckets — Confirmed (SYNCED),..." --label "frontend,dashboard,must,vs-25" --body "### Architectural Scope\nClient-side aggregation engine reading Dexie sales tables and grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review).\n\n### Deliverable\nRevenue buckets calculate with zero double-counting (AT-13).\n\nFiles: web/src/features/dashboard/useTodayRevenue.ts"
  ```

### Task #128: [VS-25-02] Server dashboard endpoint: GET /reports/dashboard?date= → DashboardReport (confirmed sales, needs-review sales, by payment label, low stock, open cases, quarantined count) _(Orig #122)_

- **Layer:** `Backend / Reports` | **Priority:** **Must**
- **Target Files:** `backend/apps/reporting/dashboard.py`
- **Architectural Scope & Invariants:** Server SQL aggregation query returning daily financial summary, payment label breakdowns, and open conflict counts.
- **Deliverable & Acceptance Criteria:** Dashboard endpoint returns confirmed revenue and review counts.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-02] #128 - Server dashboard endpoint: GET /reports/dashboard?date= → Da..." --label "backend,reports,must,vs-25" --body "### Architectural Scope\nServer SQL aggregation query returning daily financial summary, payment label breakdowns, and open conflict counts.\n\n### Deliverable\nDashboard endpoint returns confirmed revenue and review counts.\n\nFiles: backend/apps/reporting/dashboard.py"
  ```

### Task #129: [VS-25-03] Web: RevenueBucket component — 3 cards (Confirmed=Emerald, Pending=Amber, Review=Crimson) with amount + count _(Orig #124)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/RevenueBucketCards.tsx`
- **Architectural Scope & Invariants:** Tactile dashboard cards with high-contrast status colors (Emerald, Amber, Crimson) displaying ETB totals and transaction counts.
- **Deliverable & Acceptance Criteria:** Revenue cards match stitch prototype layout and responsive scaling.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-03] #129 - Web: RevenueBucket component — 3 cards (Confirmed=Emerald, P..." --label "frontend,component,must,vs-25" --body "### Architectural Scope\nTactile dashboard cards with high-contrast status colors (Emerald, Amber, Crimson) displaying ETB totals and transaction counts.\n\n### Deliverable\nRevenue cards match stitch prototype layout and responsive scaling.\n\nFiles: web/src/features/dashboard/RevenueBucketCards.tsx"
  ```

### Task #130: [VS-25-04] Web: Today screen — date selector (EAT), 3 buckets, valuation (owner), low stock list, quick actions _(Orig #127)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/TodayDashboardScreen.tsx`
- **Architectural Scope & Invariants:** Central store management dashboard displaying today's financial metrics, inventory valuation, and stock alerts.
- **Deliverable & Acceptance Criteria:** Today screen renders cleanly across mobile (390px) and desktop (1280px).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-04] #130 - Web: Today screen — date selector (EAT), 3 buckets, valuatio..." --label "frontend,ui,must,vs-25" --body "### Architectural Scope\nCentral store management dashboard displaying today's financial metrics, inventory valuation, and stock alerts.\n\n### Deliverable\nToday screen renders cleanly across mobile (390px) and desktop (1280px).\n\nFiles: web/src/features/dashboard/TodayDashboardScreen.tsx"
  ```

### Task #131: [VS-25-05] Web: Dashboard density toggle (compact/comfortable table rows) _(Orig #128)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/DensityToggle.tsx`
- **Architectural Scope & Invariants:** View density switcher allowing users to toggle between compact and comfortable data row spacing.
- **Deliverable & Acceptance Criteria:** Density toggle updates UI layout spacing instantaneously.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-05] #131 - Web: Dashboard density toggle (compact/comfortable table row..." --label "frontend,ui,must,vs-25" --body "### Architectural Scope\nView density switcher allowing users to toggle between compact and comfortable data row spacing.\n\n### Deliverable\nDensity toggle updates UI layout spacing instantaneously.\n\nFiles: web/src/features/dashboard/DensityToggle.tsx"
  ```

### Task #132: [VS-25-06] Date handling: Africa/Addis_Ababa timezone, localDay on sales for grouping _(Orig #132)_

- **Layer:** `Shared Domain` | **Priority:** **Must**
- **Target Files:** `web/src/core/time/eat-date.ts, backend/common/time.py`
- **Architectural Scope & Invariants:** Timezone normalizer mapping UTC timestamps to East Africa Time (UTC+3) calendar dates for sales grouping.
- **Deliverable & Acceptance Criteria:** Date grouping functions pass daylight and boundary tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-25-06] #132 - Date handling: Africa/Addis_Ababa timezone, localDay on sale..." --label "shared domain,must,vs-25" --body "### Architectural Scope\nTimezone normalizer mapping UTC timestamps to East Africa Time (UTC+3) calendar dates for sales grouping.\n\n### Deliverable\nDate grouping functions pass daylight and boundary tests.\n\nFiles: web/src/core/time/eat-date.ts, backend/common/time.py"
  ```

---

## VS-26: Inventory Capital Valuation & Restock Alerts

> **Feature Scope:** Store asset valuation calculation (sum max(qty, 0) x costSantim), uncosted item helper text, and restock warning cards.
> **Task Range:** `#133` through `#135` (3 tasks)

### Task #133: [VS-26-01] Inventory valuation (owner): GET /reports/inventory-value → Σ max(qty,0) × costSantim over products with cost; approximate flag if any negative/under-review/uncosted _(Orig #123)_

- **Layer:** `Backend / Reports` | **Priority:** **Must**
- **Target Files:** `backend/apps/reporting/valuation.py`
- **Architectural Scope & Invariants:** SQL query computing total inventory asset value, tagging approximate if any products have negative stock or missing wholesale costs.
- **Deliverable & Acceptance Criteria:** Valuation endpoint returns capital sum and uncosted SKU counts.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-26-01] #133 - Inventory valuation (owner): GET /reports/inventory-value → ..." --label "backend,reports,must,vs-26" --body "### Architectural Scope\nSQL query computing total inventory asset value, tagging approximate if any products have negative stock or missing wholesale costs.\n\n### Deliverable\nValuation endpoint returns capital sum and uncosted SKU counts.\n\nFiles: backend/apps/reporting/valuation.py"
  ```

### Task #134: [VS-26-02] Web: ValuationCard — large total, helper line 'N items have no cost recorded; M items approximate' _(Orig #125)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/ValuationCard.tsx`
- **Architectural Scope & Invariants:** Capital valuation widget displaying total store asset value in ETB with uncosted item helper text.
- **Deliverable & Acceptance Criteria:** ValuationCard renders in today_dashboard view.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-26-02] #134 - Web: ValuationCard — large total, helper line 'N items have ..." --label "frontend,component,must,vs-26" --body "### Architectural Scope\nCapital valuation widget displaying total store asset value in ETB with uncosted item helper text.\n\n### Deliverable\nValuationCard renders in today_dashboard view.\n\nFiles: web/src/features/dashboard/ValuationCard.tsx"
  ```

### Task #135: [VS-26-03] Web: Low stock warning cards — product name, current/threshold with unit, Restock button _(Orig #126)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/features/dashboard/LowStockAlertCard.tsx`
- **Architectural Scope & Invariants:** Alert cards highlighting products below reorder thresholds with 1-tap shortcut to receive shipment.
- **Deliverable & Acceptance Criteria:** Low stock alert links directly to receive stock modal.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-26-03] #135 - Web: Low stock warning cards — product name, current/thresho..." --label "frontend,component,must,vs-26" --body "### Architectural Scope\nAlert cards highlighting products below reorder thresholds with 1-tap shortcut to receive shipment.\n\n### Deliverable\nLow stock alert links directly to receive stock modal.\n\nFiles: web/src/features/dashboard/LowStockAlertCard.tsx"
  ```

---

## VS-27: Data Backup & Emergency Outbox Export

> **Feature Scope:** Streaming CSV exports, client emergency backup file generator (stokari-pending-export/v1.json), and export buttons.
> **Task Range:** `#136` through `#138` (3 tasks)

### Task #136: [VS-27-01] CSV exports [Should]: GET /exports/sales.csv, /stock-changes.csv (owner only) _(Orig #129)_

- **Layer:** `Backend / Export` | **Priority:** **Should**
- **Target Files:** `backend/apps/reporting/csv_exports.py`
- **Architectural Scope & Invariants:** Streaming CSV export endpoints for tax accounting, bookkeeping, and external ledger reconciliation.
- **Deliverable & Acceptance Criteria:** CSV exports stream large datasets without memory exhaustion.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-27-01] #136 - CSV exports [Should]: GET /exports/sales.csv, /stock-changes..." --label "backend,export,should,vs-27" --body "### Architectural Scope\nStreaming CSV export endpoints for tax accounting, bookkeeping, and external ledger reconciliation.\n\n### Deliverable\nCSV exports stream large datasets without memory exhaustion.\n\nFiles: backend/apps/reporting/csv_exports.py"
  ```

### Task #137: [VS-27-02] Pending-records export (device): JSON stokari-pending-export/v1 from outbox/sales/stockChanges — never marked confirmed, sensitive data warning _(Orig #130)_

- **Layer:** `Frontend / Export` | **Priority:** **Must**
- **Target Files:** `web/src/data/export-pending.ts`
- **Architectural Scope & Invariants:** Emergency client backup utility generating an unencrypted JSON export of all unsynced local outbox records to prevent data loss if phone is damaged.
- **Deliverable & Acceptance Criteria:** Export function generates valid stokari-pending-export/v1 JSON.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-27-02] #137 - Pending-records export (device): JSON stokari-pending-export..." --label "frontend,export,must,vs-27" --body "### Architectural Scope\nEmergency client backup utility generating an unencrypted JSON export of all unsynced local outbox records to prevent data loss if phone is damaged.\n\n### Deliverable\nExport function generates valid stokari-pending-export/v1 JSON.\n\nFiles: web/src/data/export-pending.ts"
  ```

### Task #138: [VS-27-03] Web: Export Pending Records button in Settings + Staff screens _(Orig #131)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/features/settings/ExportBackupButton.tsx`
- **Architectural Scope & Invariants:** Functional export button triggering actual client-side file download with sensitive data warning dialog.
- **Deliverable & Acceptance Criteria:** Button triggers browser download of backup JSON file.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-27-03] #138 - Web: Export Pending Records button in Settings + Staff scree..." --label "frontend,ui,must,vs-27" --body "### Architectural Scope\nFunctional export button triggering actual client-side file download with sensitive data warning dialog.\n\n### Deliverable\nButton triggers browser download of backup JSON file.\n\nFiles: web/src/features/settings/ExportBackupButton.tsx"
  ```

---

## VS-28: Physical Inventory Count & Variance Reconciliation

> **Feature Scope:** CountSession model, shelf count entry sheet, server proposed variance accounting for intermediate sales, and COUNT_CORRECTION movement.
> **Task Range:** `#139` through `#144` (6 tasks)

### Task #139: [VS-28-01] CountSession + CountLine models [Should] _(Orig #133)_

- **Layer:** `Backend / Models` | **Priority:** **Should**
- **Target Files:** `backend/apps/counts/models.py`
- **Architectural Scope & Invariants:** Physical inventory count schema tracking observed shelf counts against recorded ledger balances.
- **Deliverable & Acceptance Criteria:** Count models migration running cleanly on PostgreSQL.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-01] #139 - CountSession + CountLine models [Should]..." --label "backend,models,should,vs-28" --body "### Architectural Scope\nPhysical inventory count schema tracking observed shelf counts against recorded ledger balances.\n\n### Deliverable\nCount models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/counts/models.py"
  ```

### Task #140: [VS-28-02] SubmitCountHandler, DecideCountHandler [Should] _(Orig #134)_

- **Layer:** `Backend / Handlers` | **Priority:** **Should**
- **Target Files:** `backend/apps/counts/handlers.py`
- **Architectural Scope & Invariants:** Command handlers to record observed physical counts and apply owner variance decisions.
- **Deliverable & Acceptance Criteria:** Count handlers pass variance calculation tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-02] #140 - SubmitCountHandler, DecideCountHandler [Should]..." --label "backend,handlers,should,vs-28" --body "### Architectural Scope\nCommand handlers to record observed physical counts and apply owner variance decisions.\n\n### Deliverable\nCount handlers pass variance calculation tests.\n\nFiles: backend/apps/counts/handlers.py"
  ```

### Task #141: [VS-28-03] Server proposes delta = observedMilli − balanceAtVersion(baseVersion) (stock log query); shows movements after baseVersion [Should] _(Orig #135)_

- **Layer:** `Backend / Queries` | **Priority:** **Should**
- **Target Files:** `backend/apps/counts/reconciliation.py`
- **Architectural Scope & Invariants:** Reconciliation query calculating stock shrinkage delta while accounting for intermediate sales.
- **Deliverable & Acceptance Criteria:** Proposed delta correctly accounts for sales made during counting.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-03] #141 - Server proposes delta = observedMilli − balanceAtVersion(bas..." --label "backend,queries,should,vs-28" --body "### Architectural Scope\nReconciliation query calculating stock shrinkage delta while accounting for intermediate sales.\n\n### Deliverable\nProposed delta correctly accounts for sales made during counting.\n\nFiles: backend/apps/counts/reconciliation.py"
  ```

### Task #142: [VS-28-04] Owner edits delta, approves → COUNT_CORRECTION entry [Should] _(Orig #136)_

- **Layer:** `Backend / Handlers` | **Priority:** **Should**
- **Target Files:** `backend/apps/counts/approval.py`
- **Architectural Scope & Invariants:** Owner approval workflow appending COUNT_CORRECTION movements to the stock ledger.
- **Deliverable & Acceptance Criteria:** Approval emits audit adjustment ledger entry.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-04] #142 - Owner edits delta, approves → COUNT_CORRECTION entry [Should..." --label "backend,handlers,should,vs-28" --body "### Architectural Scope\nOwner approval workflow appending COUNT_CORRECTION movements to the stock ledger.\n\n### Deliverable\nApproval emits audit adjustment ledger entry.\n\nFiles: backend/apps/counts/approval.py"
  ```

### Task #143: [VS-28-05] Web: Count screen — start session, enter observed per product, review proposed delta, decide [Should] _(Orig #137)_

- **Layer:** `Frontend / UI` | **Priority:** **Should**
- **Target Files:** `web/src/features/counts/PhysicalCountScreen.tsx`
- **Architectural Scope & Invariants:** Interactive shelf count counting view with live variance feedback.
- **Deliverable & Acceptance Criteria:** Count screen renders product input rows and delta previews.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-05] #143 - Web: Count screen — start session, enter observed per produc..." --label "frontend,ui,should,vs-28" --body "### Architectural Scope\nInteractive shelf count counting view with live variance feedback.\n\n### Deliverable\nCount screen renders product input rows and delta previews.\n\nFiles: web/src/features/counts/PhysicalCountScreen.tsx"
  ```

### Task #144: [VS-28-06] Web: Count session history [Should] _(Orig #138)_

- **Layer:** `Frontend / UI` | **Priority:** **Should**
- **Target Files:** `web/src/features/counts/CountHistoryScreen.tsx`
- **Architectural Scope & Invariants:** Historical log of past physical counts and shrinkage adjustments.
- **Deliverable & Acceptance Criteria:** Count history renders past reconciliation sessions.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-28-06] #144 - Web: Count session history [Should]..." --label "frontend,ui,should,vs-28" --body "### Architectural Scope\nHistorical log of past physical counts and shrinkage adjustments.\n\n### Deliverable\nCount history renders past reconciliation sessions.\n\nFiles: web/src/features/counts/CountHistoryScreen.tsx"
  ```

---

## VS-29: Standalone Local-Only Kiosk Mode

> **Feature Scope:** meta.mode = 'LOCAL_ONLY' toggle, persistent offline banner, export/import migration bundle, and transition documentation.
> **Task Range:** `#145` through `#148` (4 tasks)

### Task #145: [VS-29-01] meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission, no pull; persistent banner [Should] _(Orig #139)_

- **Layer:** `Frontend / Local` | **Priority:** **Should**
- **Target Files:** `web/src/data/local-mode.ts`
- **Architectural Scope & Invariants:** Standalone mode operating purely offline without server authentication or cloud sync.
- **Deliverable & Acceptance Criteria:** Local-only mode disables outbox transmission and shows banner.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-29-01] #145 - meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission,..." --label "frontend,local,should,vs-29" --body "### Architectural Scope\nStandalone mode operating purely offline without server authentication or cloud sync.\n\n### Deliverable\nLocal-only mode disables outbox transmission and shows banner.\n\nFiles: web/src/data/local-mode.ts"
  ```

### Task #146: [VS-29-02] Explicit migration procedure to shared mode (out of MVP scope) [Should] _(Orig #140)_

- **Layer:** `Documentation` | **Priority:** **Should**
- **Target Files:** `docs/LOCAL_TO_CLOUD_MIGRATION.md`
- **Architectural Scope & Invariants:** Documented procedure for migrating a standalone local-only shop into the cloud platform.
- **Deliverable & Acceptance Criteria:** Migration guide reviewed and committed.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-29-02] #146 - Explicit migration procedure to shared mode (out of MVP scop..." --label "documentation,should,vs-29" --body "### Architectural Scope\nDocumented procedure for migrating a standalone local-only shop into the cloud platform.\n\n### Deliverable\nMigration guide reviewed and committed.\n\nFiles: docs/LOCAL_TO_CLOUD_MIGRATION.md"
  ```

### Task #147: [VS-29-03] Data export/import for local-only → shared migration [Should] _(Orig #141)_

- **Layer:** `Frontend / Migration` | **Priority:** **Should**
- **Target Files:** `web/src/data/migration-bundle.ts`
- **Architectural Scope & Invariants:** JSON bundle exporter and importer for transitioning standalone local shops to cloud tenancy.
- **Deliverable & Acceptance Criteria:** Migration bundle passes import/export roundtrip tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-29-03] #147 - Data export/import for local-only → shared migration [Should..." --label "frontend,migration,should,vs-29" --body "### Architectural Scope\nJSON bundle exporter and importer for transitioning standalone local shops to cloud tenancy.\n\n### Deliverable\nMigration bundle passes import/export roundtrip tests.\n\nFiles: web/src/data/migration-bundle.ts"
  ```

### Task #148: [VS-29-04] Web: Local-only mode toggle in Settings with warning [Should] _(Orig #142)_

- **Layer:** `Frontend / UI` | **Priority:** **Should**
- **Target Files:** `web/src/features/settings/LocalOnlyToggle.tsx`
- **Architectural Scope & Invariants:** Settings toggle allowing a shop to switch into standalone unclouded operation.
- **Deliverable & Acceptance Criteria:** Toggle displays confirmation warning before enabling.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-29-04] #148 - Web: Local-only mode toggle in Settings with warning [Should..." --label "frontend,ui,should,vs-29" --body "### Architectural Scope\nSettings toggle allowing a shop to switch into standalone unclouded operation.\n\n### Deliverable\nToggle displays confirmation warning before enabling.\n\nFiles: web/src/features/settings/LocalOnlyToggle.tsx"
  ```

---

## VS-30: Design System Primitives & Responsive Shell

> **Feature Scope:** CSS variables (Cobalt #1E40AF), primitive component library with 44px targets, desktop sidebar, virtualized DataTable, and light-only audit.
> **Task Range:** `#149` through `#156` (8 tasks)

### Task #149: [VS-30-01] Design token implementation: CSS variables for all colors, spacing, radii, shadows, typography _(Orig #177)_

- **Layer:** `Frontend / Tokens` | **Priority:** **Must**
- **Target Files:** `web/src/index.css`
- **Architectural Scope & Invariants:** CSS variables implementing deep cobalt (#1E40AF), neutral slate canvas, and hairline borders.
- **Deliverable & Acceptance Criteria:** Design tokens used consistently across components.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-01] #149 - Design token implementation: CSS variables for all colors, s..." --label "frontend,tokens,must,vs-30" --body "### Architectural Scope\nCSS variables implementing deep cobalt (#1E40AF), neutral slate canvas, and hairline borders.\n\n### Deliverable\nDesign tokens used consistently across components.\n\nFiles: web/src/index.css"
  ```

### Task #150: [VS-30-02] Component library: Button, Input, Badge, Card, Modal, Sheet, Drawer, DataTable with all variants _(Orig #178)_

- **Layer:** `Frontend / Components` | **Priority:** **Must**
- **Target Files:** `web/src/ui/*.tsx`
- **Architectural Scope & Invariants:** Accessible primitive component library with 44px minimum touch targets and clear focus rings.
- **Deliverable & Acceptance Criteria:** Component library passes unit and accessibility tests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-02] #150 - Component library: Button, Input, Badge, Card, Modal, Sheet,..." --label "frontend,components,must,vs-30" --body "### Architectural Scope\nAccessible primitive component library with 44px minimum touch targets and clear focus rings.\n\n### Deliverable\nComponent library passes unit and accessibility tests.\n\nFiles: web/src/ui/*.tsx"
  ```

### Task #151: [VS-30-03] Specialized components: SyncPill, QuantityInput, CurrencyInput, UnitSelect, StockLevelDisplay, PaymentSelector _(Orig #179)_

- **Layer:** `Frontend / Components` | **Priority:** **Must**
- **Target Files:** `web/src/ui/specialized/*.tsx`
- **Architectural Scope & Invariants:** Domain-specific composite components for retail transactions and stock display.
- **Deliverable & Acceptance Criteria:** Specialized components tested with mock data.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-03] #151 - Specialized components: SyncPill, QuantityInput, CurrencyInp..." --label "frontend,components,must,vs-30" --body "### Architectural Scope\nDomain-specific composite components for retail transactions and stock display.\n\n### Deliverable\nSpecialized components tested with mock data.\n\nFiles: web/src/ui/specialized/*.tsx"
  ```

### Task #152: [VS-30-04] Composite components: RevenueBucket, ConflictCaseCard, LeaseHealthRow, ProductCard, LowStockCard _(Orig #180)_

- **Layer:** `Frontend / Components` | **Priority:** **Must**
- **Target Files:** `web/src/ui/composite/*.tsx`
- **Architectural Scope & Invariants:** Dashboard and conflict domain card components rendering complex metrics cleanly.
- **Deliverable & Acceptance Criteria:** Composite components render across all responsive breakpoints.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-04] #152 - Composite components: RevenueBucket, ConflictCaseCard, Lease..." --label "frontend,components,must,vs-30" --body "### Architectural Scope\nDashboard and conflict domain card components rendering complex metrics cleanly.\n\n### Deliverable\nComposite components render across all responsive breakpoints.\n\nFiles: web/src/ui/composite/*.tsx"
  ```

### Task #153: [VS-30-05] Desktop sidebar (240px → 48px icon rail), sticky header, split-pane drawers _(Orig #184)_

- **Layer:** `Frontend / Layout` | **Priority:** **Must**
- **Target Files:** `web/src/app/DesktopShell.tsx`
- **Architectural Scope & Invariants:** Responsive layout shell expanding into desktop sidebar on >1024px displays with icon rail collapsing.
- **Deliverable & Acceptance Criteria:** Desktop layout scales cleanly without content distortion.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-05] #153 - Desktop sidebar (240px → 48px icon rail), sticky header, spl..." --label "frontend,layout,must,vs-30" --body "### Architectural Scope\nResponsive layout shell expanding into desktop sidebar on >1024px displays with icon rail collapsing.\n\n### Deliverable\nDesktop layout scales cleanly without content distortion.\n\nFiles: web/src/app/DesktopShell.tsx"
  ```

### Task #154: [VS-30-06] DataTable: sticky header, sortable columns, filter toolbar, bulk actions, density toggle _(Orig #185)_

- **Layer:** `Frontend / Component` | **Priority:** **Must**
- **Target Files:** `web/src/ui/DataTable.tsx`
- **Architectural Scope & Invariants:** Virtualizable data table component with sticky header and horizontal scroll wrapper for data density.
- **Deliverable & Acceptance Criteria:** DataTable handles 2,000 rows with 60fps scrolling.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-06] #154 - DataTable: sticky header, sortable columns, filter toolbar, ..." --label "frontend,component,must,vs-30" --body "### Architectural Scope\nVirtualizable data table component with sticky header and horizontal scroll wrapper for data density.\n\n### Deliverable\nDataTable handles 2,000 rows with 60fps scrolling.\n\nFiles: web/src/ui/DataTable.tsx"
  ```

### Task #155: [VS-30-07] Reduced motion: pulse animations disabled, slide transitions instant _(Orig #187)_

- **Layer:** `Frontend / A11y` | **Priority:** **Must**
- **Target Files:** `web/src/index.css`
- **Architectural Scope & Invariants:** prefers-reduced-motion CSS media queries disabling pulse animations and slide transitions.
- **Deliverable & Acceptance Criteria:** Animations disabled when reduced-motion is requested.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-07] #155 - Reduced motion: pulse animations disabled, slide transitions..." --label "frontend,a11y,must,vs-30" --body "### Architectural Scope\nprefers-reduced-motion CSS media queries disabling pulse animations and slide transitions.\n\n### Deliverable\nAnimations disabled when reduced-motion is requested.\n\nFiles: web/src/index.css"
  ```

### Task #156: [VS-30-08] Dark mode: NOT SUPPORTED — verify light-only implementation _(Orig #188)_

- **Layer:** `Frontend / Audit` | **Priority:** **Must**
- **Target Files:** `docs/DESIGN.md`
- **Architectural Scope & Invariants:** Verification audit confirming pure high-contrast light-only daytime shop theme per task 188 specification.
- **Deliverable & Acceptance Criteria:** Audit confirms light-mode only consistency across all screens.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-30-08] #156 - Dark mode: NOT SUPPORTED — verify light-only implementation..." --label "frontend,audit,must,vs-30" --body "### Architectural Scope\nVerification audit confirming pure high-contrast light-only daytime shop theme per task 188 specification.\n\n### Deliverable\nAudit confirms light-mode only consistency across all screens.\n\nFiles: docs/DESIGN.md"
  ```

---

## VS-31: Concurrency, Property & End-to-End Simulation

> **Feature Scope:** Multi-threaded race condition tests, Hypothesis property tests (1,000 runs), fast-check, Playwright two-device conflict simulation (AT-06).
> **Task Range:** `#157` through `#165` (9 tasks)

### Task #157: [VS-31-01] API unit tests: money, quantity, status machines, permission table, conflict policy, projection _(Orig #160)_

- **Layer:** `Backend / Test` | **Priority:** **Must**
- **Target Files:** `backend/tests/unit/*.py`
- **Architectural Scope & Invariants:** Backend domain unit test suite achieving >90% coverage on core business logic.
- **Deliverable & Acceptance Criteria:** Unit test suite passes in < 5 seconds.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-01] #157 - API unit tests: money, quantity, status machines, permission..." --label "backend,test,must,vs-31" --body "### Architectural Scope\nBackend domain unit test suite achieving >90% coverage on core business logic.\n\n### Deliverable\nUnit test suite passes in < 5 seconds.\n\nFiles: backend/tests/unit/*.py"
  ```

### Task #158: [VS-31-02] API integration tests (pytest-django + factory_boy + Postgres): every handler, repository, endpoint _(Orig #161)_

- **Layer:** `Backend / Test` | **Priority:** **Must**
- **Target Files:** `backend/tests/integration/*.py`
- **Architectural Scope & Invariants:** PostgreSQL integration tests exercising every command handler, repository, and DRF endpoint.
- **Deliverable & Acceptance Criteria:** Integration test suite passes on local PostgreSQL database.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-02] #158 - API integration tests (pytest-django + factory_boy + Postgre..." --label "backend,test,must,vs-31" --body "### Architectural Scope\nPostgreSQL integration tests exercising every command handler, repository, and DRF endpoint.\n\n### Deliverable\nIntegration test suite passes on local PostgreSQL database.\n\nFiles: backend/tests/integration/*.py"
  ```

### Task #159: [VS-31-03] API concurrency tests: parallel pushes, duplicate opId, pull during push (transaction=True + threads) _(Orig #162)_

- **Layer:** `Backend / Concurrency` | **Priority:** **Must**
- **Target Files:** `backend/tests/concurrency/test_sync_concurrency.py`
- **Architectural Scope & Invariants:** Multi-threaded race condition tests proving shop-level row lock prevents lost updates and deadlocks.
- **Deliverable & Acceptance Criteria:** Concurrency tests pass with 10 simulated parallel devices.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-03] #159 - API concurrency tests: parallel pushes, duplicate opId, pull..." --label "backend,concurrency,must,vs-31" --body "### Architectural Scope\nMulti-threaded race condition tests proving shop-level row lock prevents lost updates and deadlocks.\n\n### Deliverable\nConcurrency tests pass with 10 simulated parallel devices.\n\nFiles: backend/tests/concurrency/test_sync_concurrency.py"
  ```

### Task #160: [VS-31-04] API property tests (Hypothesis): random interleavings → qty = Σ deltas, no duplicate effect, cursor safety _(Orig #163)_

- **Layer:** `Backend / Property` | **Priority:** **Must**
- **Target Files:** `backend/tests/property/test_ledger_properties.py`
- **Architectural Scope & Invariants:** Hypothesis property tests asserting stock ledger mathematical invariants across 1,000 randomized operation sequences.
- **Deliverable & Acceptance Criteria:** Property tests run 1,000 randomized iterations without invariant failure.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-04] #160 - API property tests (Hypothesis): random interleavings → qty ..." --label "backend,property,must,vs-31" --body "### Architectural Scope\nHypothesis property tests asserting stock ledger mathematical invariants across 1,000 randomized operation sequences.\n\n### Deliverable\nProperty tests run 1,000 randomized iterations without invariant failure.\n\nFiles: backend/tests/property/test_ledger_properties.py"
  ```

### Task #161: [VS-31-05] API architecture tests: one handler per op, no direct Model.objects, composite keys present, no business logic in models _(Orig #164)_

- **Layer:** `Backend / Architecture` | **Priority:** **Must**
- **Target Files:** `backend/tests/architecture/test_layer_boundaries.py`
- **Architectural Scope & Invariants:** Import-linter rules asserting clean architectural boundaries and zero direct ORM calls from views.
- **Deliverable & Acceptance Criteria:** Architecture test suite passes.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-05] #161 - API architecture tests: one handler per op, no direct Model...." --label "backend,architecture,must,vs-31" --body "### Architectural Scope\nImport-linter rules asserting clean architectural boundaries and zero direct ORM calls from views.\n\n### Deliverable\nArchitecture test suite passes.\n\nFiles: backend/tests/architecture/test_layer_boundaries.py"
  ```

### Task #162: [VS-31-06] Web unit tests (Vitest + fake-indexeddb): use cases, outbox, result applier, recovery, projection _(Orig #165)_

- **Layer:** `Frontend / Test` | **Priority:** **Must**
- **Target Files:** `web/src/**/__tests__/*.test.ts`
- **Architectural Scope & Invariants:** Frontend unit test suite achieving >90% coverage using fake-indexeddb.
- **Deliverable & Acceptance Criteria:** Vitest suite passes with zero warnings.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-06] #162 - Web unit tests (Vitest + fake-indexeddb): use cases, outbox,..." --label "frontend,test,must,vs-31" --body "### Architectural Scope\nFrontend unit test suite achieving >90% coverage using fake-indexeddb.\n\n### Deliverable\nVitest suite passes with zero warnings.\n\nFiles: web/src/**/__tests__/*.test.ts"
  ```

### Task #163: [VS-31-07] Web property tests (fast-check): projection and outbox state _(Orig #166)_

- **Layer:** `Frontend / Property` | **Priority:** **Must**
- **Target Files:** `web/src/data/__tests__/projection-property.test.ts`
- **Architectural Scope & Invariants:** Fast-check property tests verifying client projection mathematical invariants across randomized outbox states.
- **Deliverable & Acceptance Criteria:** Fast-check property tests pass 500 iterations.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-07] #163 - Web property tests (fast-check): projection and outbox state..." --label "frontend,property,must,vs-31" --body "### Architectural Scope\nFast-check property tests verifying client projection mathematical invariants across randomized outbox states.\n\n### Deliverable\nFast-check property tests pass 500 iterations.\n\nFiles: web/src/data/__tests__/projection-property.test.ts"
  ```

### Task #164: [VS-31-08] E2E tests (Playwright): two browser contexts as two devices; offline sale → sync → reload → conflict flow _(Orig #168)_

- **Layer:** `E2E / Concurrency` | **Priority:** **Must**
- **Target Files:** `web/e2e/two-device-conflict.spec.ts`
- **Architectural Scope & Invariants:** Automated two-device conflict simulation verifying AT-06: Device 1 sells 7, Device 2 sells 6 from stock 10, asserting ledger -3 and case opened.
- **Deliverable & Acceptance Criteria:** Two-device Playwright test passes cleanly.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-08] #164 - E2E tests (Playwright): two browser contexts as two devices;..." --label "e2e,concurrency,must,vs-31" --body "### Architectural Scope\nAutomated two-device conflict simulation verifying AT-06: Device 1 sells 7, Device 2 sells 6 from stock 10, asserting ledger -3 and case opened.\n\n### Deliverable\nTwo-device Playwright test passes cleanly.\n\nFiles: web/e2e/two-device-conflict.spec.ts"
  ```

### Task #165: [VS-31-09] Device tests: real low-end Android (2GB RAM), 320px emulator — install, offline open, NFR-01/02/14 _(Orig #169)_

- **Layer:** `QA / Device` | **Priority:** **Must**
- **Target Files:** `docs/DEVICE_VERIFICATION_REPORT.md`
- **Architectural Scope & Invariants:** Low-spec hardware verification verifying PWA launch in < 3s and smooth scrolling on 320px viewport.
- **Deliverable & Acceptance Criteria:** Device verification report documented and approved.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-31-09] #165 - Device tests: real low-end Android (2GB RAM), 320px emulator..." --label "qa,device,must,vs-31" --body "### Architectural Scope\nLow-spec hardware verification verifying PWA launch in < 3s and smooth scrolling on 320px viewport.\n\n### Deliverable\nDevice verification report documented and approved.\n\nFiles: docs/DEVICE_VERIFICATION_REPORT.md"
  ```

---

## VS-32: Quality Gates, Accessibility & Traceability Enforcement

> **Feature Scope:** trace_check.py requirement gate, WCAG 2.1 AA axe-core audit, bundle size <=2MB, usability study with 5 users, and visual regressions.
> **Task Range:** `#166` through `#178` (13 tasks)

### Task #166: [VS-32-01] Performance: Lighthouse + timers on target phone (2000 products, 50k movements); p95 ≤300ms local actions, search <1s, launch <3s, dashboard <2s _(Orig #148)_

- **Layer:** `QA / Perf` | **Priority:** **Must**
- **Target Files:** `docs/PERFORMANCE_BENCHMARK_REPORT.md`
- **Architectural Scope & Invariants:** Performance benchmark on simulated low-spec Android device meeting all NFR latency requirements.
- **Deliverable & Acceptance Criteria:** All NFR performance benchmarks verified and documented.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-01] #166 - Performance: Lighthouse + timers on target phone (2000 produ..." --label "qa,perf,must,vs-32" --body "### Architectural Scope\nPerformance benchmark on simulated low-spec Android device meeting all NFR latency requirements.\n\n### Deliverable\nAll NFR performance benchmarks verified and documented.\n\nFiles: docs/PERFORMANCE_BENCHMARK_REPORT.md"
  ```

### Task #167: [VS-32-02] Bundle size: ≤2MB compressed (code splitting, lazy routes) _(Orig #149)_

- **Layer:** `Frontend / Build` | **Priority:** **Must**
- **Target Files:** `web/vite.config.ts`
- **Architectural Scope & Invariants:** Production bundle optimization using route-level code splitting and tree shaking.
- **Deliverable & Acceptance Criteria:** Compressed production bundle verified <= 2MB.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-02] #167 - Bundle size: ≤2MB compressed (code splitting, lazy routes)..." --label "frontend,build,must,vs-32" --body "### Architectural Scope\nProduction bundle optimization using route-level code splitting and tree shaking.\n\n### Deliverable\nCompressed production bundle verified <= 2MB.\n\nFiles: web/vite.config.ts"
  ```

### Task #168: [VS-32-03] Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no horizontal scroll, status = text + icon _(Orig #150)_

- **Layer:** `QA / A11y` | **Priority:** **Must**
- **Target Files:** `docs/ACCESSIBILITY_AUDIT_REPORT.md`
- **Architectural Scope & Invariants:** Full accessibility review asserting 44px touch targets and non-color dependent status indicators.
- **Deliverable & Acceptance Criteria:** Audit report confirms WCAG 2.1 AA compliance.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-03] #168 - Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no hor..." --label "qa,a11y,must,vs-32" --body "### Architectural Scope\nFull accessibility review asserting 44px touch targets and non-color dependent status indicators.\n\n### Deliverable\nAudit report confirms WCAG 2.1 AA compliance.\n\nFiles: docs/ACCESSIBILITY_AUDIT_REPORT.md"
  ```

### Task #169: [VS-32-04] Usability test: ≥5 outside users, ≥80% complete basic sale on first attempt _(Orig #152)_

- **Layer:** `QA / UX` | **Priority:** **Must**
- **Target Files:** `docs/USABILITY_TEST_REPORT.md`
- **Architectural Scope & Invariants:** Usability study with external users validating cashier checkout completion in under 10 seconds.
- **Deliverable & Acceptance Criteria:** Usability test report documenting >= 80% first-attempt success.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-04] #169 - Usability test: ≥5 outside users, ≥80% complete basic sale o..." --label "qa,ux,must,vs-32" --body "### Architectural Scope\nUsability study with external users validating cashier checkout completion in under 10 seconds.\n\n### Deliverable\nUsability test report documenting >= 80% first-attempt success.\n\nFiles: docs/USABILITY_TEST_REPORT.md"
  ```

### Task #170: [VS-32-05] Web: Clock skew banner (>5 min) with server time offset _(Orig #155)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/ui/ClockSkewBanner.tsx`
- **Architectural Scope & Invariants:** Warning banner displayed at the top of the app if client device clock differs from server time by more than 5 minutes.
- **Deliverable & Acceptance Criteria:** Banner displays with computed offset when time drift is detected.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-05] #170 - Web: Clock skew banner (>5 min) with server time offset..." --label "frontend,ui,must,vs-32" --body "### Architectural Scope\nWarning banner displayed at the top of the app if client device clock differs from server time by more than 5 minutes.\n\n### Deliverable\nBanner displays with computed offset when time drift is detected.\n\nFiles: web/src/ui/ClockSkewBanner.tsx"
  ```

### Task #171: [VS-32-06] Web: Error toasts with retry action (no bare 'something went wrong') _(Orig #157)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/ui/ToastManager.tsx`
- **Architectural Scope & Invariants:** Context-sensitive toast notification system with machine-readable error codes and 1-tap retry actions.
- **Deliverable & Acceptance Criteria:** Toasts render with appropriate semantic color and retry callbacks.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-06] #171 - Web: Error toasts with retry action (no bare 'something went..." --label "frontend,ui,must,vs-32" --body "### Architectural Scope\nContext-sensitive toast notification system with machine-readable error codes and 1-tap retry actions.\n\n### Deliverable\nToasts render with appropriate semantic color and retry callbacks.\n\nFiles: web/src/ui/ToastManager.tsx"
  ```

### Task #172: [VS-32-07] Web: Empty states with CTA button (no illustrations) _(Orig #158)_

- **Layer:** `Frontend / UI` | **Priority:** **Must**
- **Target Files:** `web/src/ui/EmptyState.tsx`
- **Architectural Scope & Invariants:** Utilitarian empty state component guiding users to action (e.g., 'No staff members yet - Invite Attendant').
- **Deliverable & Acceptance Criteria:** Clean empty state renders without heavy decorative SVGs.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-07] #172 - Web: Empty states with CTA button (no illustrations)..." --label "frontend,ui,must,vs-32" --body "### Architectural Scope\nUtilitarian empty state component guiding users to action (e.g., 'No staff members yet - Invite Attendant').\n\n### Deliverable\nClean empty state renders without heavy decorative SVGs.\n\nFiles: web/src/ui/EmptyState.tsx"
  ```

### Task #173: [VS-32-08] Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test titles [FR-14][AT-04]; trace_check.py fails CI if Must req untagged _(Orig #170)_

- **Layer:** `CI / Quality` | **Priority:** **Must**
- **Target Files:** `scripts/trace_check.py`
- **Architectural Scope & Invariants:** Quality gate script verifying every Must requirement in SRS v0.5 is linked to at least one automated test.
- **Deliverable & Acceptance Criteria:** trace_check.py passes with 100% requirement coverage.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-08] #173 - Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test ..." --label "ci,quality,must,vs-32" --body "### Architectural Scope\nQuality gate script verifying every Must requirement in SRS v0.5 is linked to at least one automated test.\n\n### Deliverable\ntrace_check.py passes with 100% requirement coverage.\n\nFiles: scripts/trace_check.py"
  ```

### Task #174: [VS-32-09] AT-01..AT-20 mapping to test scenarios (T-01..T-35) _(Orig #171)_

- **Layer:** `Documentation` | **Priority:** **Must**
- **Target Files:** `docs/ACCEPTANCE_TEST_MATRIX.md`
- **Architectural Scope & Invariants:** Comprehensive traceability matrix document linking all 20 acceptance tests to automated test cases.
- **Deliverable & Acceptance Criteria:** Acceptance test matrix document committed.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-09] #174 - AT-01..AT-20 mapping to test scenarios (T-01..T-35)..." --label "documentation,must,vs-32" --body "### Architectural Scope\nComprehensive traceability matrix document linking all 20 acceptance tests to automated test cases.\n\n### Deliverable\nAcceptance test matrix document committed.\n\nFiles: docs/ACCEPTANCE_TEST_MATRIX.md"
  ```

### Task #175: [VS-32-10] Coverage gates: 70% overall, 90% on domain/, core/, sync/ _(Orig #173)_

- **Layer:** `CI / Quality` | **Priority:** **Must**
- **Target Files:** `pyproject.toml, vite.config.ts`
- **Architectural Scope & Invariants:** Hard coverage thresholds in CI enforcing 90% test coverage on critical business logic.
- **Deliverable & Acceptance Criteria:** Pull requests blocked if coverage drops below threshold.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-10] #175 - Coverage gates: 70% overall, 90% on domain/, core/, sync/..." --label "ci,quality,must,vs-32" --body "### Architectural Scope\nHard coverage thresholds in CI enforcing 90% test coverage on critical business logic.\n\n### Deliverable\nPull requests blocked if coverage drops below threshold.\n\nFiles: pyproject.toml, vite.config.ts"
  ```

### Task #176: [VS-32-11] Visual regression tests: all 4 states × 3 breakpoints × 2 roles per component _(Orig #174)_

- **Layer:** `QA / Visual` | **Priority:** **Must**
- **Target Files:** `web/e2e/visual-regression.spec.ts`
- **Architectural Scope & Invariants:** Automated snapshot tests asserting visual stability across desktop, tablet, and mobile viewports.
- **Deliverable & Acceptance Criteria:** Visual snapshots committed and passing.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-11] #176 - Visual regression tests: all 4 states × 3 breakpoints × 2 ro..." --label "qa,visual,must,vs-32" --body "### Architectural Scope\nAutomated snapshot tests asserting visual stability across desktop, tablet, and mobile viewports.\n\n### Deliverable\nVisual snapshots committed and passing.\n\nFiles: web/e2e/visual-regression.spec.ts"
  ```

### Task #177: [VS-32-12] Accessibility audit: axe-core in CI, manual screen reader test _(Orig #175)_

- **Layer:** `QA / A11y` | **Priority:** **Must**
- **Target Files:** `web/e2e/accessibility.spec.ts`
- **Architectural Scope & Invariants:** Axe-core automated accessibility audit enforcing WCAG 2.1 AA compliance.
- **Deliverable & Acceptance Criteria:** Zero critical accessibility violations across all screens.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-12] #177 - Accessibility audit: axe-core in CI, manual screen reader te..." --label "qa,a11y,must,vs-32" --body "### Architectural Scope\nAxe-core automated accessibility audit enforcing WCAG 2.1 AA compliance.\n\n### Deliverable\nZero critical accessibility violations across all screens.\n\nFiles: web/e2e/accessibility.spec.ts"
  ```

### Task #178: [VS-32-13] Performance regression: bundle size, TTI, sync latency tracked per PR _(Orig #176)_

- **Layer:** `CI / Perf` | **Priority:** **Must**
- **Target Files:** `.github/workflows/perf-tracking.yml`
- **Architectural Scope & Invariants:** Automated bundle size and latency tracking on every pull request.
- **Deliverable & Acceptance Criteria:** PR comments report bundle size and regression diffs.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-32-13] #178 - Performance regression: bundle size, TTI, sync latency track..." --label "ci,perf,must,vs-32" --body "### Architectural Scope\nAutomated bundle size and latency tracking on every pull request.\n\n### Deliverable\nPR comments report bundle size and regression diffs.\n\nFiles: .github/workflows/perf-tracking.yml"
  ```

---

## VS-33: Deferred Cloud Infrastructure & Disaster Recovery

> **Feature Scope:** Post-development cloud deployment: Render API, Vercel web, Neon cloud database, Sentry, and nightly backup restore tests.
> **Task Range:** `#179` through `#188` (10 tasks)

### Task #179: [VS-33-01] GitHub Actions API CI: ruff, mypy, import-linter, file-size, pytest (Postgres), check --deploy, OpenAPI diff _(Orig #3)_

- **Layer:** `Cloud CI/CD` | **Priority:** **Must**
- **Target Files:** `.github/workflows/api-ci.yml`
- **Architectural Scope & Invariants:** Automated backend CI workflow running linters, tests, and deployment verification on pull requests.
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-01] #179 - GitHub Actions API CI: ruff, mypy, import-linter, file-size,..." --label "cloud ci/cd,must,vs-33" --body "### Architectural Scope\nAutomated backend CI workflow running linters, tests, and deployment verification on pull requests.\n\n### Deliverable\nGreen badge on main/dev branches.\n\nFiles: .github/workflows/api-ci.yml"
  ```

### Task #180: [VS-33-02] GitHub Actions Web CI: lint, types, dependency-cruiser, tests, bundle-size, trace-check _(Orig #4)_

- **Layer:** `Cloud CI/CD` | **Priority:** **Must**
- **Target Files:** `.github/workflows/web-ci.yml`
- **Architectural Scope & Invariants:** Automated frontend CI workflow running linters, tests, and bundle size tracking.
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-02] #180 - GitHub Actions Web CI: lint, types, dependency-cruiser, test..." --label "cloud ci/cd,must,vs-33" --body "### Architectural Scope\nAutomated frontend CI workflow running linters, tests, and bundle size tracking.\n\n### Deliverable\nGreen badge on main/dev branches.\n\nFiles: .github/workflows/web-ci.yml"
  ```

### Task #181: [VS-33-03] Vercel (web) + Render (API) deployment pipelines with staging/prod _(Orig #6)_

- **Layer:** `Cloud Hosting` | **Priority:** **Must**
- **Target Files:** `render.yaml, vercel.json`
- **Architectural Scope & Invariants:** Cloud hosting deployment pipelines with staging and production environment branches.
- **Deliverable & Acceptance Criteria:** Live staging deployment accessible over HTTPS.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-03] #181 - Vercel (web) + Render (API) deployment pipelines with stagin..." --label "cloud hosting,must,vs-33" --body "### Architectural Scope\nCloud hosting deployment pipelines with staging and production environment branches.\n\n### Deliverable\nLive staging deployment accessible over HTTPS.\n\nFiles: render.yaml, vercel.json"
  ```

### Task #182: [VS-33-04] Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABASE_URL _(Orig #7)_

- **Layer:** `Cloud Database` | **Priority:** **Must**
- **Target Files:** `backend/backend/settings.py`
- **Architectural Scope & Invariants:** Neon serverless PostgreSQL branching with isolated staging and production connection pooling.
- **Deliverable & Acceptance Criteria:** Automated database branch migrations functional.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-04] #182 - Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABA..." --label "cloud database,must,vs-33" --body "### Architectural Scope\nNeon serverless PostgreSQL branching with isolated staging and production connection pooling.\n\n### Deliverable\nAutomated database branch migrations functional.\n\nFiles: backend/backend/settings.py"
  ```

### Task #183: [VS-33-05] Sentry + UptimeRobot + nightly pg_dump cron + nightly reconciliation cron _(Orig #8)_

- **Layer:** `Cloud Monitoring` | **Priority:** **Must**
- **Target Files:** `.github/workflows/nightly-backup.yml`
- **Architectural Scope & Invariants:** Production error tracking with Sentry, external uptime pinging, and nightly automated logical dumps.
- **Deliverable & Acceptance Criteria:** Monitoring active and backup cron scheduled.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-05] #183 - Sentry + UptimeRobot + nightly pg_dump cron + nightly reconc..." --label "cloud monitoring,must,vs-33" --body "### Architectural Scope\nProduction error tracking with Sentry, external uptime pinging, and nightly automated logical dumps.\n\n### Deliverable\nMonitoring active and backup cron scheduled.\n\nFiles: .github/workflows/nightly-backup.yml"
  ```

### Task #184: [VS-33-06] Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/sessions/CSRF, browsable API disabled, SECURE_SSL_REDIRECT, HSTS, CSP _(Orig #143)_

- **Layer:** `Production Hardening` | **Priority:** **Must**
- **Target Files:** `backend/backend/settings_prod.py`
- **Architectural Scope & Invariants:** Production Django security settings disabling unused middleware and enforcing strict HSTS and CSP headers.
- **Deliverable & Acceptance Criteria:** Django deployment check passes with zero warnings (check --deploy).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-06] #184 - Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/..." --label "production hardening,must,vs-33" --body "### Architectural Scope\nProduction Django security settings disabling unused middleware and enforcing strict HSTS and CSP headers.\n\n### Deliverable\nDjango deployment check passes with zero warnings (check --deploy).\n\nFiles: backend/backend/settings_prod.py"
  ```

### Task #185: [VS-33-07] Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (shared cache table across gunicorn workers) _(Orig #144)_

- **Layer:** `Production Security` | **Priority:** **Must**
- **Target Files:** `backend/common/http/throttles.py`
- **Architectural Scope & Invariants:** Distributed Redis or PostgreSQL cache-backed rate limiting protecting auth and sync endpoints.
- **Deliverable & Acceptance Criteria:** Rate limits enforced across concurrent requests.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-07] #185 - Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (..." --label "production security,must,vs-33" --body "### Architectural Scope\nDistributed Redis or PostgreSQL cache-backed rate limiting protecting auth and sync endpoints.\n\n### Deliverable\nRate limits enforced across concurrent requests.\n\nFiles: backend/common/http/throttles.py"
  ```

### Task #186: [VS-33-08] Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_SIZE hard cap _(Orig #145)_

- **Layer:** `Production Security` | **Priority:** **Must**
- **Target Files:** `backend/backend/settings.py`
- **Architectural Scope & Invariants:** Hard memory and upload payload caps preventing memory exhaustion attacks on sync endpoints.
- **Deliverable & Acceptance Criteria:** Uploads > 200KB rejected with 413 Payload Too Large.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-08] #186 - Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_..." --label "production security,must,vs-33" --body "### Architectural Scope\nHard memory and upload payload caps preventing memory exhaustion attacks on sync endpoints.\n\n### Deliverable\nUploads > 200KB rejected with 413 Payload Too Large.\n\nFiles: backend/backend/settings.py"
  ```

### Task #187: [VS-33-09] Logging: JSON with requestId, shopId, opId only; no tokens/emails/payloads _(Orig #146)_

- **Layer:** `Production Logging` | **Priority:** **Must**
- **Target Files:** `backend/common/logging.py`
- **Architectural Scope & Invariants:** Structured JSON logging for Datadog or CloudWatch scrubbed of sensitive PII, passwords, and tokens.
- **Deliverable & Acceptance Criteria:** Logs output clean structured JSON without credentials.
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-09] #187 - Logging: JSON with requestId, shopId, opId only; no tokens/e..." --label "production logging,must,vs-33" --body "### Architectural Scope\nStructured JSON logging for Datadog or CloudWatch scrubbed of sensitive PII, passwords, and tokens.\n\n### Deliverable\nLogs output clean structured JSON without credentials.\n\nFiles: backend/common/logging.py"
  ```

### Task #188: [VS-33-10] Backup/restore test: staging restore from nightly dump → run reconciliation → verify _(Orig #147)_

- **Layer:** `Disaster Recovery` | **Priority:** **Must**
- **Target Files:** `scripts/test_disaster_recovery.sh`
- **Architectural Scope & Invariants:** Disaster recovery exercise restoring staging database from backup and verifying ledger reconciliation passes.
- **Deliverable & Acceptance Criteria:** Disaster recovery test verified and documented (T-28 / AT-15).
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[VS-33-10] #188 - Backup/restore test: staging restore from nightly dump → run..." --label "disaster recovery,must,vs-33" --body "### Architectural Scope\nDisaster recovery exercise restoring staging database from backup and verifying ledger reconciliation passes.\n\n### Deliverable\nDisaster recovery test verified and documented (T-28 / AT-15).\n\nFiles: scripts/test_disaster_recovery.sh"
  ```

---
