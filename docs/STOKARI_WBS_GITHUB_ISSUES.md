# Stokari 188-Task Work Breakdown Structure (GitHub Issues Register)

> **Document Baseline:** SDD v0.4 · SRS v0.5 · Total Tasks: **188 Discrete Issues**
> **Architecture Governance:** Structured into **10 Isolated Single-Assignee Work Packages** to guarantee zero merge conflicts and clear subsystem ownership.

---

## Executive Work Package Summary

| Package    | Short Code              | Assigned Subsystem Role                    |     Tasks     | Primary Technologies                                                                                                                                               |
| :--------- | :---------------------- | :----------------------------------------- | :-----------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PKG-01** | `INFRA-DEVOPS`          | Infrastructure & DevOps Engineer           | **13 tasks**  | Owns toolchains (uv/vite), CI pipelines, Postgres branching (Neon), observability (Sentry), rate limits, and automated disaster recovery tests                     |
| **PKG-02** | `BACKEND-CORE-IDENTITY` | Backend Core & Identity Engineer           | **13 tasks**  | Owns common/kernel, common/persistence, Shop/User/Membership models, Google OIDC token auth, permissions, and shop lifecycle endpoints                             |
| **PKG-03** | `CATALOG-PRODUCTS`      | Catalog & Inventory Feature Engineer       | **16 tasks**  | Owns Product models, units catalogue, Latin+Ethiopic search folding, packaging conversions (crates/pieces), and catalog UI components                              |
| **PKG-04** | `STOCK-LEDGER`          | Ledger & Inventory Invariants Engineer     | **24 tasks**  | Owns append-only StockChange ledger, DB immutability triggers, deterministic row locking, Dexie stock tables, projection algorithm, and stock receiving/adjusting  |
| **PKG-05** | `POS-SALES`             | POS & Sales Checkout Engineer              | **16 tasks**  | Owns Sale models, RecordSaleHandler, CancelSaleHandler, offline Dexie unit-of-work, cashier sell screen, cart stepper, decimal weight keypad, and payment selector |
| **PKG-06** | `SYNC-PUSH`             | Offline Sync Pipeline Engineer             | **14 tasks**  | Owns server push endpoint, per-shop row locks, ProcessedOperation idempotency ledger, Web Locks client manager, exponential backoff, and atomic Result Applier     |
| **PKG-07** | `SYNC-PULL`             | Sync Pull & Client Hydration Engineer      |  **8 tasks**  | Owns cursor-based delta pull endpoint, new-device bootstrap hydration, health/clock-skew probe, and header SyncPill component                                      |
| **PKG-08** | `CONFLICT-ARBITRATION`  | Conflict Arbitration & Security Engineer   | **16 tasks**  | Owns ConflictCase models, StockBecameNegative event subscriber, 3 owner resolution actions, deactivated staff drain token flow, and review queue UI                |
| **PKG-09** | `DASHBOARD-REPORTS`     | Management Experience & Reporting Engineer | **33 tasks**  | Owns 3-bucket revenue breakdown, store valuation calculation, physical counts, local-only mode, session UI, staff leases, and emergency JSON export                |
| **PKG-10** | `DESIGN-SYSTEM-QA`      | Design System & QA Lead                    | **35 tasks**  | Owns design tokens, primitive UI components, two-device Playwright E2E tests, Hypothesis/fast-check property tests, trace_check gate, and visual regressions       |
| **TOTAL**  | —                       | **Full System Delivery**                   | **188 tasks** | Python 3.14, Django, React 19, Dexie, Postgres                                                                                                                     |

---

## Work Package 1: Repository Infrastructure, CI/CD & Production Hardening

- **Primary Assignee Role:** Infrastructure & DevOps Engineer
- **GitHub Milestone / Epic Label:** `epic:infra-devops`
- **Subsystem Boundary & Rationale:** Owns toolchains (uv/vite), CI pipelines, Postgres branching (Neon), observability (Sentry), rate limits, and automated disaster recovery tests.

### GitHub Issues in this Package:

#### Issue #1: [INFRA-DEVOPS] Init stokari-api Django + uv, Ruff, mypy, import-linter, pytest, drf-spectacular

- **Labels:** `backend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Running CI pipeline, pyproject.toml locked with uv
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #1 - Init stokari-api Django + uv, Ruff, mypy, import-linter, pyt..." --label "backend,must,foundation" --body "### Deliverable\nRunning CI pipeline, pyproject.toml locked with uv\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #2: [INFRA-DEVOPS] Init stokari-web Vite+React+TS + Vitest, Playwright, dependency-cruiser, ESLint

- **Labels:** `frontend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Running CI pipeline, package.json with vp/vite
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #2 - Init stokari-web Vite+React+TS + Vitest, Playwright, depende..." --label "frontend,must,foundation" --body "### Deliverable\nRunning CI pipeline, package.json with vp/vite\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #3: [INFRA-DEVOPS] GitHub Actions API CI: ruff, mypy, import-linter, file-size, pytest (Postgres), check --deploy, OpenAPI diff

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #3 - GitHub Actions API CI: ruff, mypy, import-linter, file-size,..." --label "infra,must,foundation" --body "### Deliverable\nGreen badge on main/dev branches\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #4: [INFRA-DEVOPS] GitHub Actions Web CI: lint, types, dependency-cruiser, tests, bundle-size, trace-check

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #4 - GitHub Actions Web CI: lint, types, dependency-cruiser, test..." --label "infra,must,foundation" --body "### Deliverable\nGreen badge on main/dev branches\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #5: [INFRA-DEVOPS] Contract bundle workflow: export_contract.py, contract-release.yml, contract.lock, pnpm contract:sync

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Automated contract synchronization loop between backend and web
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #5 - Contract bundle workflow: export_contract.py, contract-relea..." --label "infra,must,foundation" --body "### Deliverable\nAutomated contract synchronization loop between backend and web\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #6: [INFRA-DEVOPS] Vercel (web) + Render (API) deployment pipelines with staging/prod

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Automated staging and production preview deployments
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #6 - Vercel (web) + Render (API) deployment pipelines with stagin..." --label "infra,must,foundation" --body "### Deliverable\nAutomated staging and production preview deployments\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #7: [INFRA-DEVOPS] Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABASE_URL

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Isolated database branches configured with zero-downtime migrations
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #7 - Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABA..." --label "infra,must,foundation" --body "### Deliverable\nIsolated database branches configured with zero-downtime migrations\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #8: [INFRA-DEVOPS] Sentry + UptimeRobot + nightly pg_dump cron + nightly reconciliation cron

- **Labels:** `infra`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Observability and automated nightly logical backup scripts active
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #8 - Sentry + UptimeRobot + nightly pg_dump cron + nightly reconc..." --label "infra,must,foundation" --body "### Deliverable\nObservability and automated nightly logical backup scripts active\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #143: [INFRA-DEVOPS] Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/sessions/CSRF, browsable API disabled, SECURE_SSL_REDIRECT, HSTS, CSP

- **Labels:** `backend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Production settings configuration passing security checklist
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #143 - Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/..." --label "backend,must,hardening" --body "### Deliverable\nProduction settings configuration passing security checklist\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #144: [INFRA-DEVOPS] Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (shared cache table across gunicorn workers)

- **Labels:** `backend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Distributed rate throttling protecting sync and auth endpoints
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #144 - Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (..." --label "backend,must,hardening" --body "### Deliverable\nDistributed rate throttling protecting sync and auth endpoints\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #145: [INFRA-DEVOPS] Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_SIZE hard cap

- **Labels:** `backend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Server upload payload limits protecting against memory exhaustion
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #145 - Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_..." --label "backend,must,hardening" --body "### Deliverable\nServer upload payload limits protecting against memory exhaustion\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #146: [INFRA-DEVOPS] Logging: JSON with requestId, shopId, opId only; no tokens/emails/payloads

- **Labels:** `backend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Structured log output scrubbed of sensitive PII and auth credentials
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #146 - Logging: JSON with requestId, shopId, opId only; no tokens/e..." --label "backend,must,hardening" --body "### Deliverable\nStructured log output scrubbed of sensitive PII and auth credentials\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

#### Issue #147: [INFRA-DEVOPS] Backup/restore test: staging restore from nightly dump → run reconciliation → verify

- **Labels:** `infra`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Automated disaster recovery test passing ledger reconciliation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[INFRA-DEVOPS] #147 - Backup/restore test: staging restore from nightly dump → run..." --label "infra,must,hardening" --body "### Deliverable\nAutomated disaster recovery test passing ledger reconciliation\n\nPart of Work Package 1: INFRA-DEVOPS"
  ```

---

## Work Package 2: Backend Architecture, Identity, Tenancy & Permissions

- **Primary Assignee Role:** Backend Core & Identity Engineer
- **GitHub Milestone / Epic Label:** `epic:backend-core-identity`
- **Subsystem Boundary & Rationale:** Owns common/kernel, common/persistence, Shop/User/Membership models, Google OIDC token auth, permissions, and shop lifecycle endpoints.

### GitHub Issues in this Package:

#### Issue #9: [BACKEND-CORE-IDENTITY] common/kernel: Result, DomainError, typed IDs (ShopId, OpId, ProductId), Clock port, event bus

- **Labels:** `backend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Pure Python domain primitives with 100% unit test coverage
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #9 - common/kernel: Result, DomainError, typed IDs (ShopId, OpId,..." --label "backend,must,foundation" --body "### Deliverable\nPure Python domain primitives with 100% unit test coverage\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #10: [BACKEND-CORE-IDENTITY] common/http: RFC 9457 handler, request-id middleware, throttles, StrictIntegerField, pagination

- **Labels:** `backend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Consistent error responses and request tracing across DRF views
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #10 - common/http: RFC 9457 handler, request-id middleware, thrott..." --label "backend,must,foundation" --body "### Deliverable\nConsistent error responses and request tracing across DRF views\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #11: [BACKEND-CORE-IDENTITY] common/persistence: TransactionManager (atomic + shop_lock), ShopScopedRepository, domain_event outbox

- **Labels:** `backend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Thread-safe and tenant-isolated data persistence base classes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #11 - common/persistence: TransactionManager (atomic + shop_lock),..." --label "backend,must,foundation" --body "### Deliverable\nThread-safe and tenant-isolated data persistence base classes\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #12: [BACKEND-CORE-IDENTITY] apps/shops/domain/permissions.py → contract/fixtures/permissions.json

- **Labels:** `backend`, `priority:must`, `slice:foundation`
- **Priority:** **Must** | **Slice:** `Foundation`
- **Deliverable & Acceptance Criteria:** Role-permission matrix exported to versioned JSON contract
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #12 - apps/shops/domain/permissions.py → contract/fixtures/permiss..." --label "backend,must,foundation" --body "### Deliverable\nRole-permission matrix exported to versioned JSON contract\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #13: [BACKEND-CORE-IDENTITY] Django models: Shop, Membership, User, OfflineLease, RefreshToken, Invite, Device (composite PKs)

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Initial migration with composite primary keys (shop_id, id)
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #13 - Django models: Shop, Membership, User, OfflineLease, Refresh..." --label "backend,must,identity" --body "### Deliverable\nInitial migration with composite primary keys (shop_id, id)\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #14: [BACKEND-CORE-IDENTITY] Migrations 0001 (composite PKs) + 0002_protections (immutability triggers, composite FKs via RunSQL)

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Database level constraints and triggers active in PostgreSQL
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #14 - Migrations 0001 (composite PKs) + 0002_protections (immutabi..." --label "backend,must,identity" --body "### Deliverable\nDatabase level constraints and triggers active in PostgreSQL\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #15: [BACKEND-CORE-IDENTITY] AuthProvider + ActorAuthentication DRF class (verifies access JWT/drain token → Actor dataclass)

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Custom token auth resolving Actor without default Django user table
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #15 - AuthProvider + ActorAuthentication DRF class (verifies acces..." --label "backend,must,identity" --body "### Deliverable\nCustom token auth resolving Actor without default Django user table\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #16: [BACKEND-CORE-IDENTITY] Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/refresh, POST /auth/lease, POST /auth/logout

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Complete authenticated OIDC handshake and token life cycle API
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #16 - Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/re..." --label "backend,must,identity" --body "### Deliverable\nComplete authenticated OIDC handshake and token life cycle API\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #17: [BACKEND-CORE-IDENTITY] Endpoints: POST /shops (idempotency key), GET /shops/me, POST /shops/me/close (confirmation flow)

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Shop registration, metadata inspection, and shop closure endpoints
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #17 - Endpoints: POST /shops (idempotency key), GET /shops/me, POS..." --label "backend,must,identity" --body "### Deliverable\nShop registration, metadata inspection, and shop closure endpoints\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #18: [BACKEND-CORE-IDENTITY] Endpoints: POST /shops/me/invites, POST /invites/{token}/accept

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Invitation generator enforcing 5-attendant quota limit
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #18 - Endpoints: POST /shops/me/invites, POST /invites/{token}/acc..." --label "backend,must,identity" --body "### Deliverable\nInvitation generator enforcing 5-attendant quota limit\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #19: [BACKEND-CORE-IDENTITY] Endpoints: GET /shops/me/members, POST /shops/me/members/{id}/deactivate

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Member list and instant deactivation taking effect immediately
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #19 - Endpoints: GET /shops/me/members, POST /shops/me/members/{id..." --label "backend,must,identity" --body "### Deliverable\nMember list and instant deactivation taking effect immediately\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #20: [BACKEND-CORE-IDENTITY] Permission classes: ActiveMembership, ShopOpen, RolePermission (reads from fixture)

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** DRF permission gates protecting tenant boundaries
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #20 - Permission classes: ActiveMembership, ShopOpen, RolePermissi..." --label "backend,must,identity" --body "### Deliverable\nDRF permission gates protecting tenant boundaries\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

#### Issue #21: [BACKEND-CORE-IDENTITY] Management commands: transfer_ownership, purge_closed_shop

- **Labels:** `backend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** CLI operations tools for owner succession and compliance cleanup
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[BACKEND-CORE-IDENTITY] #21 - Management commands: transfer_ownership, purge_closed_shop..." --label "backend,must,identity" --body "### Deliverable\nCLI operations tools for owner succession and compliance cleanup\n\nPart of Work Package 2: BACKEND-CORE-IDENTITY"
  ```

---

## Work Package 3: Master Catalog, Products & Packaging Domain (Vertical Slice)

- **Primary Assignee Role:** Catalog & Inventory Feature Engineer
- **GitHub Milestone / Epic Label:** `epic:catalog-products`
- **Subsystem Boundary & Rationale:** Owns Product models, units catalogue, Latin+Ethiopic search folding, packaging conversions (crates/pieces), and catalog UI components.

### GitHub Issues in this Package:

#### Issue #27: [CATALOG-PRODUCTS] Django Product model (composite PK, unit immutable, name/nameAlt, price/cost santim, lowStockMilli, status)

- **Labels:** `backend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** PostgreSQL Product table with integer santim and milli-units
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #27 - Django Product model (composite PK, unit immutable, name/nam..." --label "backend,must,catalog" --body "### Deliverable\nPostgreSQL Product table with integer santim and milli-units\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #28: [CATALOG-PRODUCTS] CatalogService + ProductReader ports; ProductRepository (ShopScoped)

- **Labels:** `backend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Domain service and scoped repository with automated query tests
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #28 - CatalogService + ProductReader ports; ProductRepository (Sho..." --label "backend,must,catalog" --body "### Deliverable\nDomain service and scoped repository with automated query tests\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #29: [CATALOG-PRODUCTS] Operations: CreateProduct (atomic with OPENING StockLog), UpdateProduct, SetProductStatus

- **Labels:** `backend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Idempotent product creation emitting initial opening ledger movement
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #29 - Operations: CreateProduct (atomic with OPENING StockLog), Up..." --label "backend,must,catalog" --body "### Deliverable\nIdempotent product creation emitting initial opening ledger movement\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #30: [CATALOG-PRODUCTS] Unit catalogue (apps/stock-log/domain/units.py) → contract/fixtures/units.json

- **Labels:** `backend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Canonical unit definitions (PIECE, KG, LITER, METER) exported to contract
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #30 - Unit catalogue (apps/stock-log/domain/units.py) → contract/f..." --label "backend,must,catalog" --body "### Deliverable\nCanonical unit definitions (PIECE, KG, LITER, METER) exported to contract\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #31: [CATALOG-PRODUCTS] core/domain/quantity.py + core/domain/quantity.ts — parseQuantity, formatQuantity, validate_qty

- **Labels:** `shared`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Bilingual unit parser and half-up rounding passing vector tests
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #31 - core/domain/quantity.py + core/domain/quantity.ts — parseQua..." --label "shared,must,catalog" --body "### Deliverable\nBilingual unit parser and half-up rounding passing vector tests\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #32: [CATALOG-PRODUCTS] core/search/normalize.ts — Latin + Ethiopic homophone folding (ሀ/ሐ/ኀ, ሰ/ሠ)

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Phonetic Amharic text folding utility with sub-millisecond benchmark
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #32 - core/search/normalize.ts — Latin + Ethiopic homophone foldin..." --label "frontend,must,catalog" --body "### Deliverable\nPhonetic Amharic text folding utility with sub-millisecond benchmark\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #33: [CATALOG-PRODUCTS] Web: Product-creation wizard ('How do you sell it?' → unit chips, preview sentence, 'Add another form')

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Step-by-step intuitive modal for adding products with packaging
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #33 - Web: Product-creation wizard ('How do you sell it?' → unit c..." --label "frontend,must,catalog" --body "### Deliverable\nStep-by-step intuitive modal for adding products with packaging\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #34: [CATALOG-PRODUCTS] Web: QuantityInput component — keypad by unit kind, quick chips from quickQtyMilli, g/mL toggle for KG/L

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Touch numeric keypad component supporting fractional quantities
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #34 - Web: QuantityInput component — keypad by unit kind, quick ch..." --label "frontend,must,catalog" --body "### Deliverable\nTouch numeric keypad component supporting fractional quantities\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #35: [CATALOG-PRODUCTS] Web: Product list/search (in-memory normalized index, Amharic fold, virtualization)

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Fast client search filter handling 2,000 SKUs with zero lag
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #35 - Web: Product list/search (in-memory normalized index, Amhari..." --label "frontend,must,catalog" --body "### Deliverable\nFast client search filter handling 2,000 SKUs with zero lag\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #36: [CATALOG-PRODUCTS] Web: Product detail (read-only unit badge, packaging editor [Stage 2])

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Product inspector showing prices, costs, barcodes, and stock level
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #36 - Web: Product detail (read-only unit badge, packaging editor ..." --label "frontend,must,catalog" --body "### Deliverable\nProduct inspector showing prices, costs, barcodes, and stock level\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #37: [CATALOG-PRODUCTS] Web: Create/Edit Product modal (Zod validation mirroring backend)

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Modal form with margin calculator and strict boundary validation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #37 - Web: Create/Edit Product modal (Zod validation mirroring bac..." --label "frontend,must,catalog" --body "### Deliverable\nModal form with margin calculator and strict boundary validation\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #38: [CATALOG-PRODUCTS] Web: Product card list (mobile) + DataTable (desktop) with density toggle

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Responsive dual-view UI with density toggles
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #38 - Web: Product card list (mobile) + DataTable (desktop) with d..." --label "frontend,must,catalog" --body "### Deliverable\nResponsive dual-view UI with density toggles\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #39: [CATALOG-PRODUCTS] Packaging rules [Should]: Product.packagings[], ReceiveLineInput.packaging, StockChange.packaging snapshot

- **Labels:** `backend`, `priority:should`, `slice:catalog`
- **Priority:** **Should** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Packaging definition schema supporting crates, boxes, and cartons
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #39 - Packaging rules [Should]: Product.packagings[], ReceiveLineI..." --label "backend,should,catalog" --body "### Deliverable\nPackaging definition schema supporting crates, boxes, and cartons\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #40: [CATALOG-PRODUCTS] Opening stock supports openingPackaging (count × factor)

- **Labels:** `backend`, `priority:should`, `slice:catalog`
- **Priority:** **Should** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Product initialization accepting bulk container counts
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #40 - Opening stock supports openingPackaging (count × factor)..." --label "backend,should,catalog" --body "### Deliverable\nProduct initialization accepting bulk container counts\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #41: [CATALOG-PRODUCTS] Product search toolbar: search input, category filter, status filter, 'Add Product' button

- **Labels:** `frontend`, `priority:must`, `slice:catalog`
- **Priority:** **Must** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Clean filter pill toolbar matching stitch prototype
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #41 - Product search toolbar: search input, category filter, statu..." --label "frontend,must,catalog" --body "### Deliverable\nClean filter pill toolbar matching stitch prototype\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

#### Issue #42: [CATALOG-PRODUCTS] Category management (CRUD) [Should]

- **Labels:** `shared`, `priority:should`, `slice:catalog`
- **Priority:** **Should** | **Slice:** `Catalog`
- **Deliverable & Acceptance Criteria:** Custom category taxonomy manager for shop owners
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CATALOG-PRODUCTS] #42 - Category management (CRUD) [Should]..." --label "shared,should,catalog" --body "### Deliverable\nCustom category taxonomy manager for shop owners\n\nPart of Work Package 3: CATALOG-PRODUCTS"
  ```

---

## Work Package 4: Stock Movement Ledger, Projections & Inventory Receiving

- **Primary Assignee Role:** Ledger & Inventory Invariants Engineer
- **GitHub Milestone / Epic Label:** `epic:stock-ledger`
- **Subsystem Boundary & Rationale:** Owns append-only StockChange ledger, DB immutability triggers, deterministic row locking, Dexie stock tables, projection algorithm, and stock receiving/adjusting.

### GitHub Issues in this Package:

#### Issue #43: [STOCK-LEDGER] Django StockLevel + StockChange models (composite PK, immutability trigger, underReview flag)

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Append-only stock ledger tables with database update prohibition trigger
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #43 - Django StockLevel + StockChange models (composite PK, immuta..." --label "backend,must,ledger" --body "### Deliverable\nAppend-only stock ledger tables with database update prohibition trigger\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #44: [STOCK-LEDGER] StockLogService.append(entries, ctx) — locks StockLevel rows, increments version, writes StockChange, allocates serverSeq, returns crossed_below_zero

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Atomic append engine acquiring row locks in ascending product ID order
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #44 - StockLogService.append(entries, ctx) — locks StockLevel rows..." --label "backend,must,ledger" --body "### Deliverable\nAtomic append engine acquiring row locks in ascending product ID order\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #45: [STOCK-LEDGER] StockLogQueries: quantity, history, balance_at_version(baseVersion)

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Read-side queries optimized for fast ledger balance verification
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #45 - StockLogQueries: quantity, history, balance_at_version(baseV..." --label "backend,must,ledger" --body "### Deliverable\nRead-side queries optimized for fast ledger balance verification\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #46: [STOCK-LEDGER] Domain event: StockBecameNegative published in-transaction; ConflictService subscribes → opens/extends OFFLINE_OVERSELL case, sets underReview

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Event bus trigger detecting overselling race condition in-transaction
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #46 - Domain event: StockBecameNegative published in-transaction; ..." --label "backend,must,ledger" --body "### Deliverable\nEvent bus trigger detecting overselling race condition in-transaction\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #47: [STOCK-LEDGER] Nightly reconcile_stock_log management command (verifies qty = SUM(delta), version = COUNT)

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Automated verification job proving zero ledger balance corruption
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #47 - Nightly reconcile_stock_log management command (verifies qty..." --label "backend,must,ledger" --body "### Deliverable\nAutomated verification job proving zero ledger balance corruption\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #48: [STOCK-LEDGER] Web Dexie schema: stockChanges, stockLevels (projection with confirmedQty, pendingDelta, projectedQty)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Local IndexedDB tables partitioned by shop and user identity
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #48 - Web Dexie schema: stockChanges, stockLevels (projection with..." --label "frontend,must,ledger" --body "### Deliverable\nLocal IndexedDB tables partitioned by shop and user identity\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #49: [STOCK-LEDGER] Web StockLogRepository.appendPending(), recomputeFor(productIds) — projection algorithm (§5.10)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Client projection engine computing balance with zero double-counting
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #49 - Web StockLogRepository.appendPending(), recomputeFor(product..." --label "frontend,must,ledger" --body "### Deliverable\nClient projection engine computing balance with zero double-counting\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #50: [STOCK-LEDGER] Web UnitOfWork (Dexie transaction wrapping sale + lines + stock log + outbox)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Client atomic transaction wrapper ensuring all-or-nothing saves
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #50 - Web UnitOfWork (Dexie transaction wrapping sale + lines + st..." --label "frontend,must,ledger" --body "### Deliverable\nClient atomic transaction wrapper ensuring all-or-nothing saves\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #51: [STOCK-LEDGER] Web recovery: rebuildProjection(), integrity check (local confirmed = sum of confirmed entries)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Disaster recovery routine rebuilding Dexie state from local ledger
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #51 - Web recovery: rebuildProjection(), integrity check (local co..." --label "frontend,must,ledger" --body "### Deliverable\nDisaster recovery routine rebuilding Dexie state from local ledger\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #52: [STOCK-LEDGER] Stock history endpoint: GET /products/{id}/stock-changes (role-filtered, paged)

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Paginated movement history API stripping cost fields for attendants
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #52 - Stock history endpoint: GET /products/{id}/stock-changes (ro..." --label "backend,must,ledger" --body "### Deliverable\nPaginated movement history API stripping cost fields for attendants\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #53: [STOCK-LEDGER] Web: Stock screen card list (mobile) + DataTable (desktop) with Receive/Adjust/History actions

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Complete stock overview screen with quick-action buttons
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #53 - Web: Stock screen card list (mobile) + DataTable (desktop) w..." --label "frontend,must,ledger" --body "### Deliverable\nComplete stock overview screen with quick-action buttons\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #54: [STOCK-LEDGER] Web: StockLevelDisplay component — confirmed vs projected, low-stock threshold, unit badge

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Badge component visualizing stock health with warning indicators
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #54 - Web: StockLevelDisplay component — confirmed vs projected, l..." --label "frontend,must,ledger" --body "### Deliverable\nBadge component visualizing stock health with warning indicators\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #55: [STOCK-LEDGER] Web: Stock History drawer/sheet (chronological movements with actor, device, resulting balance)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Slide-out audit drawer displaying immutable event trail and hashes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #55 - Web: Stock History drawer/sheet (chronological movements wit..." --label "frontend,must,ledger" --body "### Deliverable\nSlide-out audit drawer displaying immutable event trail and hashes\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #56: [STOCK-LEDGER] Web: Receive Stock modal (packaging selector with live '3 crates = 36 pcs' preview)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Shipment intake modal with live container unit calculations
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #56 - Web: Receive Stock modal (packaging selector with live '3 cr..." --label "frontend,must,ledger" --body "### Deliverable\nShipment intake modal with live container unit calculations\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #73: [STOCK-LEDGER] ReceiveStockHandler (owner): multi-line, atomic, optional packaging per line, cost per unit or per container → updates product costSantim

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Atomic shipment receiver updating product cost and stock balances
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #73 - ReceiveStockHandler (owner): multi-line, atomic, optional pa..." --label "backend,must,ledger" --body "### Deliverable\nAtomic shipment receiver updating product cost and stock balances\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #74: [STOCK-LEDGER] AdjustStockHandler (owner): ADJUSTMENT entry with reason enum (DAMAGE, LOSS, CORRECTION, OTHER); online rejects negative, offline quarantines

- **Labels:** `backend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Stock adjustment service enforcing mandatory reason codes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #74 - AdjustStockHandler (owner): ADJUSTMENT entry with reason enu..." --label "backend,must,ledger" --body "### Deliverable\nStock adjustment service enforcing mandatory reason codes\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #75: [STOCK-LEDGER] Web: Receive Stock modal (segmented unit selector pc | Crate (12), live preview, optional cost per container)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Shipment modal with live container-to-unit cost calculations
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #75 - Web: Receive Stock modal (segmented unit selector pc | Crate..." --label "frontend,must,ledger" --body "### Deliverable\nShipment modal with live container-to-unit cost calculations\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #76: [STOCK-LEDGER] Web: Adjust Stock modal (reason picker, quantity input by unit, preview)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Adjustment modal requiring reason selection and delta confirmation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #76 - Web: Adjust Stock modal (reason picker, quantity input by un..." --label "frontend,must,ledger" --body "### Deliverable\nAdjustment modal requiring reason selection and delta confirmation\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #77: [STOCK-LEDGER] Stock log entries carry packaging snapshot (label, count, baseQtyMilli) for history render

- **Labels:** `shared`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Ledger snapshot schema preserving container details for audit trail
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #77 - Stock log entries carry packaging snapshot (label, count, ba..." --label "shared,must,ledger" --body "### Deliverable\nLedger snapshot schema preserving container details for audit trail\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #78: [STOCK-LEDGER] Web: Adjust reason enum with mandatory note for OTHER

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Form validation rule requiring explanatory text when OTHER is chosen
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #78 - Web: Adjust reason enum with mandatory note for OTHER..." --label "frontend,must,ledger" --body "### Deliverable\nForm validation rule requiring explanatory text when OTHER is chosen\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #79: [STOCK-LEDGER] Web: Receive cost per container → converts to cost per base unit with half-up rounding

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Math utility dividing wholesale carton cost into unit cost
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #79 - Web: Receive cost per container → converts to cost per base ..." --label "frontend,must,ledger" --body "### Deliverable\nMath utility dividing wholesale carton cost into unit cost\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #80: [STOCK-LEDGER] Web: Stock screen quick actions bar (Receive/Adjust/Export)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Sticky top action bar for inventory management workflows
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #80 - Web: Stock screen quick actions bar (Receive/Adjust/Export)..." --label "frontend,must,ledger" --body "### Deliverable\nSticky top action bar for inventory management workflows\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #81: [STOCK-LEDGER] Web: Low stock threshold display on product cards

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Visual alert tag indicating when item drops below minimum threshold
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #81 - Web: Low stock threshold display on product cards..." --label "frontend,must,ledger" --body "### Deliverable\nVisual alert tag indicating when item drops below minimum threshold\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

#### Issue #82: [STOCK-LEDGER] Web: Stock summary cards (Total SKUs, Low Stock Count)

- **Labels:** `frontend`, `priority:must`, `slice:ledger`
- **Priority:** **Must** | **Slice:** `Ledger`
- **Deliverable & Acceptance Criteria:** Summary metrics bar at the top of the inventory screen
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[STOCK-LEDGER] #82 - Web: Stock summary cards (Total SKUs, Low Stock Count)..." --label "frontend,must,ledger" --body "### Deliverable\nSummary metrics bar at the top of the inventory screen\n\nPart of Work Package 4: STOCK-LEDGER"
  ```

---

## Work Package 5: POS Sales Register, Cart & Local Cashier Persistence

- **Primary Assignee Role:** POS & Sales Checkout Engineer
- **GitHub Milestone / Epic Label:** `epic:pos-sales`
- **Subsystem Boundary & Rationale:** Owns Sale models, RecordSaleHandler, CancelSaleHandler, offline Dexie unit-of-work, cashier sell screen, cart stepper, decimal weight keypad, and payment selector.

### GitHub Issues in this Package:

#### Issue #57: [POS-SALES] Django Sale, SaleLine, SaleCancellation models (composite PKs, reversesId on cancellation)

- **Labels:** `backend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** PostgreSQL sales schema with immutable line records
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #57 - Django Sale, SaleLine, SaleCancellation models (composite PK..." --label "backend,must,sales" --body "### Deliverable\nPostgreSQL sales schema with immutable line records\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #58: [POS-SALES] RecordSaleHandler: validates lines, recomputes totals, price snapshots, builds SALE entries, calls StockLogService.append, applies outcome matrix by mode

- **Labels:** `backend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Complete sales transaction engine with price snapshot preservation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #58 - RecordSaleHandler: validates lines, recomputes totals, price..." --label "backend,must,sales" --body "### Deliverable\nComplete sales transaction engine with price snapshot preservation\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #59: [POS-SALES] CancelSaleHandler: inserts SaleCancellation (PK (shopId, saleId)), builds SALE_CANCELLATION entries with reversesId; quarantines on CANCELLATION_CONFLICT conditions

- **Labels:** `backend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Compensating cancellation handler with idempotency guard
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #59 - CancelSaleHandler: inserts SaleCancellation (PK (shopId, sal..." --label "backend,must,sales" --body "### Deliverable\nCompensating cancellation handler with idempotency guard\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #60: [POS-SALES] Web recordSale.ts (offline: one Dexie tx → sale, lines, stock log, projection, outbox; online: outbox only, await confirmation)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** INV-01 durable local persistence use case for cashier checkout
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #60 - Web recordSale.ts (offline: one Dexie tx → sale, lines, stoc..." --label "frontend,must,sales" --body "### Deliverable\nINV-01 durable local persistence use case for cashier checkout\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #61: [POS-SALES] Web cancelSale.ts (owner only, offline pending)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Owner cancellation flow generating compensating outbox operation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #61 - Web cancelSale.ts (owner only, offline pending)..." --label "frontend,must,sales" --body "### Deliverable\nOwner cancellation flow generating compensating outbox operation\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #62: [POS-SALES] Web: Sell screen — search → tap product → quantity chips → payment label → Save (≤10s, ≤3 taps)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** High-speed cashier POS interface achieving sub-10-second checkout
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #62 - Web: Sell screen — search → tap product → quantity chips → p..." --label "frontend,must,sales" --body "### Deliverable\nHigh-speed cashier POS interface achieving sub-10-second checkout\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #63: [POS-SALES] Web: Cart — line qty unit × price = lineTotal, rounded sum, 'Sell anyway' sheet when exceeding projected stock

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Cart management component with live subtotal and stock warnings
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #63 - Web: Cart — line qty unit × price = lineTotal, rounded sum, ..." --label "frontend,must,sales" --body "### Deliverable\nCart management component with live subtotal and stock warnings\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #64: [POS-SALES] Web: Payment Selector — segmented control (Cash/Telebirr/Other)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** 3-button payment tender selector with high-contrast tactile feedback
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #64 - Web: Payment Selector — segmented control (Cash/Telebirr/Oth..." --label "frontend,must,sales" --body "### Deliverable\n3-button payment tender selector with high-contrast tactile feedback\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #65: [POS-SALES] Web: Complete Sale button (54px sticky footer mobile, auto-width desktop)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Ergonomic thumb-zone checkout CTA bar for mobile viewports
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #65 - Web: Complete Sale button (54px sticky footer mobile, auto-w..." --label "frontend,must,sales" --body "### Deliverable\nErgonomic thumb-zone checkout CTA bar for mobile viewports\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #66: [POS-SALES] Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, quick chips, live total preview)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Slide-up touch keypad for entering arbitrary decimal weights (kg)
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #66 - Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, q..." --label "frontend,must,sales" --body "### Deliverable\nSlide-up touch keypad for entering arbitrary decimal weights (kg)\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #67: [POS-SALES] Web: Sell Anyway Alert Sheet (warns confirmed vs projected, flags for review, destructive button)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Explicit approval sheet allowing offline cashiers to oversell stock
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #67 - Web: Sell Anyway Alert Sheet (warns confirmed vs projected, ..." --label "frontend,must,sales" --body "### Deliverable\nExplicit approval sheet allowing offline cashiers to oversell stock\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #68: [POS-SALES] Web: Pending confirmation list (online) + 'Awaiting confirmation' badge

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Visual pending indicator showing sales awaiting server confirmation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #68 - Web: Pending confirmation list (online) + 'Awaiting confirma..." --label "frontend,must,sales" --body "### Deliverable\nVisual pending indicator showing sales awaiting server confirmation\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #69: [POS-SALES] Web: Sale history (localDay EAT grouping, sync state badges)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Transaction journal grouped by day with live sync status badges
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #69 - Web: Sale history (localDay EAT grouping, sync state badges)..." --label "frontend,must,sales" --body "### Deliverable\nTransaction journal grouped by day with live sync status badges\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #70: [POS-SALES] Sale immutability: architecture test — UPDATE/DELETE on sale/stock log/cancellation fails

- **Labels:** `backend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Automated architectural test proving immutability cannot be bypassed
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #70 - Sale immutability: architecture test — UPDATE/DELETE on sale..." --label "backend,must,sales" --body "### Deliverable\nAutomated architectural test proving immutability cannot be bypassed\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #71: [POS-SALES] Web: Product quick chips (horizontal scroll, max 6 frequent items)

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** 1-tap quick buttons for frequent staples (Sugar, Rice, Oil, Coffee)
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #71 - Web: Product quick chips (horizontal scroll, max 6 frequent ..." --label "frontend,must,sales" --body "### Deliverable\n1-tap quick buttons for frequent staples (Sugar, Rice, Oil, Coffee)\n\nPart of Work Package 5: POS-SALES"
  ```

#### Issue #72: [POS-SALES] Web: Recent products persisted in meta.recentProducts

- **Labels:** `frontend`, `priority:must`, `slice:sales`
- **Priority:** **Must** | **Slice:** `Sales`
- **Deliverable & Acceptance Criteria:** Client persistence tracking top 6 cashier-selected items across reloads
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[POS-SALES] #72 - Web: Recent products persisted in meta.recentProducts..." --label "frontend,must,sales" --body "### Deliverable\nClient persistence tracking top 6 cashier-selected items across reloads\n\nPart of Work Package 5: POS-SALES"
  ```

---

## Work Package 6: Synchronization Engine — Push Pipeline & Idempotency

- **Primary Assignee Role:** Offline Sync Pipeline Engineer
- **GitHub Milestone / Epic Label:** `epic:sync-push`
- **Subsystem Boundary & Rationale:** Owns server push endpoint, per-shop row locks, ProcessedOperation idempotency ledger, Web Locks client manager, exponential backoff, and atomic Result Applier.

### GitHub Issues in this Package:

#### Issue #83: [SYNC-PUSH] PushService: per-op transaction, shop lock → product locks (ascending ID), re-check ProcessedOperation

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Deterministic lock ordering preventing deadlocks during sync push
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #83 - PushService: per-op transaction, shop lock → product locks (..." --label "backend,must,sync" --body "### Deliverable\nDeterministic lock ordering preventing deadlocks during sync push\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #84: [SYNC-PUSH] Idempotency: ProcessedOperation table (opId, payloadHash, outcome, resultJson); same hash = stored result; different hash = IDEMPOTENCY_KEY_REUSE

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** PostgreSQL idempotency ledger caching past operation results
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #84 - Idempotency: ProcessedOperation table (opId, payloadHash, ou..." --label "backend,must,sync" --body "### Deliverable\nPostgreSQL idempotency ledger caching past operation results\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #85: [SYNC-PUSH] OperationDispatcher registry (built in config/container.py): maps OperationType → (payload parser, handler); architecture test asserts completeness

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Decoupled operation routing registry with completeness check
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #85 - OperationDispatcher registry (built in config/container.py):..." --label "backend,must,sync" --body "### Deliverable\nDecoupled operation routing registry with completeness check\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #86: [SYNC-PUSH] Payload hash: RFC 8785 canonical JSON of {type, payload} → SHA-256 → base64url; shared vectors in contract/fixtures/payload-hash-vectors.json

- **Labels:** `shared`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Deterministic canonical hashing passing cross-platform test vectors
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #86 - Payload hash: RFC 8785 canonical JSON of {type, payload} → S..." --label "shared,must,sync" --body "### Deliverable\nDeterministic canonical hashing passing cross-platform test vectors\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #87: [SYNC-PUSH] dependsOn resolution: dependent op gets REJECTED_DEPENDENCY or quarantined into same case

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Dependency resolver preserving operation ordering within batches
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #87 - dependsOn resolution: dependent op gets REJECTED_DEPENDENCY ..." --label "backend,must,sync" --body "### Deliverable\nDependency resolver preserving operation ordering within batches\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #88: [SYNC-PUSH] Lease validation at receipt time: membership ACTIVE, lease valid, device matches, op type allowed, clientCreatedAt in window ±5min

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Cryptographic lease validation enforcing temporal sync windows
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #88 - Lease validation at receipt time: membership ACTIVE, lease v..." --label "backend,must,sync" --body "### Deliverable\nCryptographic lease validation enforcing temporal sync windows\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #89: [SYNC-PUSH] Quarantine path: stores full payload, QUARANTINED outcome, AUTHORIZATION_REVIEW case, no stock log effect

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Quarantine storage isolating suspicious operations without ledger impact
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #89 - Quarantine path: stores full payload, QUARANTINED outcome, A..." --label "backend,must,sync" --body "### Deliverable\nQuarantine storage isolating suspicious operations without ledger impact\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #90: [SYNC-PUSH] Outcome matrix implementation (§6.8 table) for all operation types × situations

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Comprehensive outcome matrix covering all sync edge cases
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #90 - Outcome matrix implementation (§6.8 table) for all operation..." --label "backend,must,sync" --body "### Deliverable\nComprehensive outcome matrix covering all sync edge cases\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #91: [SYNC-PUSH] ChangeLog allocation under shop lock: shop.syncSeq += 1 per touched entity; written to ChangeLog + StockChange.serverSeq + Product.updatedSeq

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Monotonic gap-free change sequence numbering per shop
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #91 - ChangeLog allocation under shop lock: shop.syncSeq += 1 per ..." --label "backend,must,sync" --body "### Deliverable\nMonotonic gap-free change sequence numbering per shop\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #92: [SYNC-PUSH] Push response: per-op OperationResult with entries, stockAfter, conflictCaseId, reasonCode, replayed, noop

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Structured push response contract detailing exact per-op outcomes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #92 - Push response: per-op OperationResult with entries, stockAft..." --label "backend,must,sync" --body "### Deliverable\nStructured push response contract detailing exact per-op outcomes\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #93: [SYNC-PUSH] Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; retry same opId on transport failure; poison guard (8 failures → ATTENTION_REQUIRED)

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Client outbox dispatcher with poison pill quarantine protection
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #93 - Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; ..." --label "frontend,must,sync" --body "### Deliverable\nClient outbox dispatcher with poison pill quarantine protection\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #94: [SYNC-PUSH] Web backoff: exponential (base 2s, factor 2, cap 5min, full jitter)

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Network retry algorithm avoiding thundering herd server overload
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #94 - Web backoff: exponential (base 2s, factor 2, cap 5min, full ..." --label "frontend,must,sync" --body "### Deliverable\nNetwork retry algorithm avoiding thundering herd server overload\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #95: [SYNC-PUSH] Web: Sync Engine single-flight Web Lock (stokari-sync-{shopId}) for multi-tab safety

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Web Locks API coordinator ensuring only one tab syncs at a time
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #95 - Web: Sync Engine single-flight Web Lock (stokari-sync-{shopI..." --label "frontend,must,sync" --body "### Deliverable\nWeb Locks API coordinator ensuring only one tab syncs at a time\n\nPart of Work Package 6: SYNC-PUSH"
  ```

#### Issue #96: [SYNC-PUSH] Web: Result Applier — updates Dexie rows in one atomic transaction (§5.10)

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Client sync consumer updating local records with confirmed server IDs
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PUSH] #96 - Web: Result Applier — updates Dexie rows in one atomic trans..." --label "frontend,must,sync" --body "### Deliverable\nClient sync consumer updating local records with confirmed server IDs\n\nPart of Work Package 6: SYNC-PUSH"
  ```

---

## Work Package 7: Synchronization Engine — Pull Pipeline, Bootstrap & Storage

- **Primary Assignee Role:** Sync Pull & Client Hydration Engineer
- **GitHub Milestone / Epic Label:** `epic:sync-pull`
- **Subsystem Boundary & Rationale:** Owns cursor-based delta pull endpoint, new-device bootstrap hydration, health/clock-skew probe, and header SyncPill component.

### GitHub Issues in this Package:

#### Issue #97: [SYNC-PULL] PullService: GET /v1/sync/pull?cursor=N&limit=200 → next limit ChangeLog rows → load current entities (role-filtered) → return nextCursor, hasMore, headSeq, serverTime

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Cursor-based delta synchronization endpoint with role data-filtering
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #97 - PullService: GET /v1/sync/pull?cursor=N&limit=200 → next lim..." --label "backend,must,sync" --body "### Deliverable\nCursor-based delta synchronization endpoint with role data-filtering\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #98: [SYNC-PULL] Pull response: products, stockChanges, stockLevels, sales, saleCancellations, actors, conflicts (owner only)

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Complete sync pull DTO contract with actor metadata
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #98 - Pull response: products, stockChanges, stockLevels, sales, s..." --label "backend,must,sync" --body "### Deliverable\nComplete sync pull DTO contract with actor metadata\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #99: [SYNC-PULL] Web pull stage: ONE Dexie tx — upsert by id, apply stockLevels only if version > confirmedVersion, recompute pendingDelta, update pullCursor

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Client pull processor updating local cache without overwriting pending ops
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #99 - Web pull stage: ONE Dexie tx — upsert by id, apply stockLeve..." --label "frontend,must,sync" --body "### Deliverable\nClient pull processor updating local cache without overwriting pending ops\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #100: [SYNC-PULL] New-device bootstrap: cursor=0 → pull pages until hasMore=false → integrity check → ready

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Initial device hydration loading entire store catalog onto clean device
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #100 - New-device bootstrap: cursor=0 → pull pages until hasMore=fa..." --label "frontend,must,sync" --body "### Deliverable\nInitial device hydration loading entire store catalog onto clean device\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #101: [SYNC-PULL] CURSOR_RESET handling: restart from 0 without touching outbox

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Recovery protocol recovering from expired server cursors gracefully
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #101 - CURSOR_RESET handling: restart from 0 without touching outbo..." --label "frontend,must,sync" --body "### Deliverable\nRecovery protocol recovering from expired server cursors gracefully\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #102: [SYNC-PULL] Health probe: GET /health (2s timeout, no DB heavy work); used for online/offline decision, warm-up

- **Labels:** `backend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Lightweight health check returning server clock for skew detection
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #102 - Health probe: GET /health (2s timeout, no DB heavy work); us..." --label "backend,must,sync" --body "### Deliverable\nLightweight health check returning server clock for skew detection\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #103: [SYNC-PULL] Web: Sync trigger schedule (app open, online event, tab visible, debounced 500ms, timer 30s)

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Event-driven sync coordinator triggering on connectivity return
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #103 - Web: Sync trigger schedule (app open, online event, tab visi..." --label "frontend,must,sync" --body "### Deliverable\nEvent-driven sync coordinator triggering on connectivity return\n\nPart of Work Package 7: SYNC-PULL"
  ```

#### Issue #104: [SYNC-PULL] Web: SyncPill in header with popover (last sync, outbox count, storage, persistent status, 'Sync Now')

- **Labels:** `frontend`, `priority:must`, `slice:sync`
- **Priority:** **Must** | **Slice:** `Sync`
- **Deliverable & Acceptance Criteria:** Interactive status badge displaying 4 sync states and connection info
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[SYNC-PULL] #104 - Web: SyncPill in header with popover (last sync, outbox coun..." --label "frontend,must,sync" --body "### Deliverable\nInteractive status badge displaying 4 sync states and connection info\n\nPart of Work Package 7: SYNC-PULL"
  ```

---

## Work Package 8: Conflict Detection, Security Quarantine & Owner Arbitration (AT-06)

- **Primary Assignee Role:** Conflict Arbitration & Security Engineer
- **GitHub Milestone / Epic Label:** `epic:conflict-arbitration`
- **Subsystem Boundary & Rationale:** Owns ConflictCase models, StockBecameNegative event subscriber, 3 owner resolution actions, deactivated staff drain token flow, and review queue UI.

### GitHub Issues in this Package:

#### Issue #105: [CONFLICT-ARBITRATION] ConflictCase model: type, productId, status, version, stateSnapshot, items[], quarantined[], resolution, resolvedBy

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** PostgreSQL conflict arbitration case schema with optimistic locking
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #105 - ConflictCase model: type, productId, status, version, stateS..." --label "backend,must,conflicts" --body "### Deliverable\nPostgreSQL conflict arbitration case schema with optimistic locking\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #106: [CONFLICT-ARBITRATION] ConflictService: opens/extends cases on StockBecameNegative, PRODUCT_INACTIVE, CANCELLATION_CONFLICT, INVALID_STOCK_OPERATION

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Conflict manager grouping concurrent oversell events into single cases
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #106 - ConflictService: opens/extends cases on StockBecameNegative,..." --label "backend,must,conflicts" --body "### Deliverable\nConflict manager grouping concurrent oversell events into single cases\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #107: [CONFLICT-ARBITRATION] ResolveConflictHandler (owner): validates caseVersion, applies RECONCILE_STOCK / CANCEL_SALE / ACKNOWLEDGE via StockLogService, closes case, clears underReview

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Owner resolution service executing corrective ledger transactions
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #107 - ResolveConflictHandler (owner): validates caseVersion, appli..." --label "backend,must,conflicts" --body "### Deliverable\nOwner resolution service executing corrective ledger transactions\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #108: [CONFLICT-ARBITRATION] Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STALE_RESOLUTION event, case stays OPEN

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Optimistic concurrency guard preventing conflicting owner resolutions
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #108 - Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STAL..." --label "backend,must,conflicts" --body "### Deliverable\nOptimistic concurrency guard preventing conflicting owner resolutions\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #109: [CONFLICT-ARBITRATION] ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs original handler as original actor, returns inner[] per-op results) / REJECT_QUARANTINED

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Quarantine review endpoint executing late operations retrospectively
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #109 - ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs..." --label "backend,must,conflicts" --body "### Deliverable\nQuarantine review endpoint executing late operations retrospectively\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #110: [CONFLICT-ARBITRATION] Web: Review queue (owner) — card list (mobile) + split-pane (desktop) with case list + detail drawer

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Owner arbitration dashboard displaying active conflict queue
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #110 - Web: Review queue (owner) — card list (mobile) + split-pane ..." --label "frontend,must,conflicts" --body "### Deliverable\nOwner arbitration dashboard displaying active conflict queue\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #111: [CONFLICT-ARBITRATION] Web: Conflict case card — type badge, product, current balance, timeline preview (last 3 events)

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Summary card displaying conflicting registers and negative balance
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #111 - Web: Conflict case card — type badge, product, current balan..." --label "frontend,must,conflicts" --body "### Deliverable\nSummary card displaying conflicting registers and negative balance\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #112: [CONFLICT-ARBITRATION] Web: Conflict case detail drawer — discrepancy alert, concurrent timeline, 3 resolution actions

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Parallel timeline comparison view showing Hana vs Dawit concurrent sales
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #112 - Web: Conflict case detail drawer — discrepancy alert, concur..." --label "frontend,must,conflicts" --body "### Deliverable\nParallel timeline comparison view showing Hana vs Dawit concurrent sales\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #113: [CONFLICT-ARBITRATION] Web: Resolution actions — Record Restock (qty + note), Cancel Sale (select + reason), Acknowledge Deficit

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** 3 functional owner resolution action dialogs executing atomic fixes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #113 - Web: Resolution actions — Record Restock (qty + note), Cance..." --label "frontend,must,conflicts" --body "### Deliverable\n3 functional owner resolution action dialogs executing atomic fixes\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #114: [CONFLICT-ARBITRATION] Web: Quarantined operations tab — table with Accept/Reject per operation or bulk per device

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Table inspecting operations sent by deactivated cashier devices
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #114 - Web: Quarantined operations tab — table with Accept/Reject p..." --label "frontend,must,conflicts" --body "### Deliverable\nTable inspecting operations sent by deactivated cashier devices\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #115: [CONFLICT-ARBITRATION] Web: Quarantine Accept → re-runs handler, shows per-op results in inner[]

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Action executing quarantined operations into legitimate sales
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #115 - Web: Quarantine Accept → re-runs handler, shows per-op resul..." --label "frontend,must,conflicts" --body "### Deliverable\nAction executing quarantined operations into legitimate sales\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #116: [CONFLICT-ARBITRATION] Web: Quarantine Reject → archives with reason, never deletes

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Action rejecting quarantined records with permanent audit record
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #116 - Web: Quarantine Reject → archives with reason, never deletes..." --label "frontend,must,conflicts" --body "### Deliverable\nAction rejecting quarantined records with permanent audit record\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #117: [CONFLICT-ARBITRATION] Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDING → owner in-app + GET /notifications

- **Labels:** `shared`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** In-app notification system alerting owner to overselling events
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #117 - Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDIN..." --label "shared,must,conflicts" --body "### Deliverable\nIn-app notification system alerting owner to overselling events\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #118: [CONFLICT-ARBITRATION] Web: Notifications screen (list + mark read)

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Notification drawer listing recent store alerts and sync warnings
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #118 - Web: Notifications screen (list + mark read)..." --label "frontend,must,conflicts" --body "### Deliverable\nNotification drawer listing recent store alerts and sync warnings\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #119: [CONFLICT-ARBITRATION] Web: Conflict state machine: OPEN → RESOLVED only via explicit ResolveConflict

- **Labels:** `frontend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Client state machine preventing automatic or accidental case dismissal
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #119 - Web: Conflict state machine: OPEN → RESOLVED only via explic..." --label "frontend,must,conflicts" --body "### Deliverable\nClient state machine preventing automatic or accidental case dismissal\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

#### Issue #120: [CONFLICT-ARBITRATION] Architecture test: every ConflictType has resolution paths; no auto-close

- **Labels:** `backend`, `priority:must`, `slice:conflicts`
- **Priority:** **Must** | **Slice:** `Conflicts`
- **Deliverable & Acceptance Criteria:** Automated architecture test verifying zero unhandled conflict states
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[CONFLICT-ARBITRATION] #120 - Architecture test: every ConflictType has resolution paths; ..." --label "backend,must,conflicts" --body "### Deliverable\nAutomated architecture test verifying zero unhandled conflict states\n\nPart of Work Package 8: CONFLICT-ARBITRATION"
  ```

---

## Work Package 9: Business Reports, Revenue Dashboard, Staff & Local Modes

- **Primary Assignee Role:** Management Experience & Reporting Engineer
- **GitHub Milestone / Epic Label:** `epic:dashboard-reports`
- **Subsystem Boundary & Rationale:** Owns 3-bucket revenue breakdown, store valuation calculation, physical counts, local-only mode, session UI, staff leases, and emergency JSON export.

### GitHub Issues in this Package:

#### Issue #22: [DASHBOARD-REPORTS] Web: session management (tokens in memory, refresh in IndexedDB, lease check, clock-rollback guard)

- **Labels:** `frontend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Client session layer guarding against clock tampering
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #22 - Web: session management (tokens in memory, refresh in Indexe..." --label "frontend,must,identity" --body "### Deliverable\nClient session layer guarding against clock tampering\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #23: [DASHBOARD-REPORTS] Web: Google Sign-In flow, Auth context (useAuth), authenticated route guards

- **Labels:** `frontend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Google OAuth popup/redirect with protected router routes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #23 - Web: Google Sign-In flow, Auth context (useAuth), authentica..." --label "frontend,must,identity" --body "### Deliverable\nGoogle OAuth popup/redirect with protected router routes\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #24: [DASHBOARD-REPORTS] Web: Staff management screen (invite attendants, list members, deactivate)

- **Labels:** `frontend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Owner UI showing lease countdowns and instant deactivation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #24 - Web: Staff management screen (invite attendants, list member..." --label "frontend,must,identity" --body "### Deliverable\nOwner UI showing lease countdowns and instant deactivation\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #25: [DASHBOARD-REPORTS] Web: Multi-shop selection screen (if user has >1 membership)

- **Labels:** `frontend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** Store switcher allowing owners to switch between retail locations
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #25 - Web: Multi-shop selection screen (if user has >1 membership)..." --label "frontend,must,identity" --body "### Deliverable\nStore switcher allowing owners to switch between retail locations\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #26: [DASHBOARD-REPORTS] Web: Create shop flow (first-time owner) + Accept invite flow (attendant)

- **Labels:** `frontend`, `priority:must`, `slice:identity`
- **Priority:** **Must** | **Slice:** `Identity`
- **Deliverable & Acceptance Criteria:** First-run onboarding wizards for new owners and hired attendants
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #26 - Web: Create shop flow (first-time owner) + Accept invite flo..." --label "frontend,must,identity" --body "### Deliverable\nFirst-run onboarding wizards for new owners and hired attendants\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #121: [DASHBOARD-REPORTS] Offline dashboard (Web): three buckets — Confirmed (SYNCED), Local Pending (WAITING_TO_SYNC/SYNCING), Needs Review (NEEDS_REVIEW + quarantined) — no double counting

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Local revenue aggregation engine grouping sales into 3 distinct buckets
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #121 - Offline dashboard (Web): three buckets — Confirmed (SYNCED),..." --label "frontend,must,dashboard" --body "### Deliverable\nLocal revenue aggregation engine grouping sales into 3 distinct buckets\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #122: [DASHBOARD-REPORTS] Server dashboard endpoint: GET /reports/dashboard?date= → DashboardReport (confirmed sales, needs-review sales, by payment label, low stock, open cases, quarantined count)

- **Labels:** `backend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Server financial summary endpoint aggregating daily retail metrics
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #122 - Server dashboard endpoint: GET /reports/dashboard?date= → Da..." --label "backend,must,dashboard" --body "### Deliverable\nServer financial summary endpoint aggregating daily retail metrics\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #123: [DASHBOARD-REPORTS] Inventory valuation (owner): GET /reports/inventory-value → Σ max(qty,0) × costSantim over products with cost; approximate flag if any negative/under-review/uncosted

- **Labels:** `backend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** SQL valuation query computing total store inventory capital value
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #123 - Inventory valuation (owner): GET /reports/inventory-value → ..." --label "backend,must,dashboard" --body "### Deliverable\nSQL valuation query computing total store inventory capital value\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #124: [DASHBOARD-REPORTS] Web: RevenueBucket component — 3 cards (Confirmed=Emerald, Pending=Amber, Review=Crimson) with amount + count

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Visual financial KPI cards with distinct status colors and counts
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #124 - Web: RevenueBucket component — 3 cards (Confirmed=Emerald, P..." --label "frontend,must,dashboard" --body "### Deliverable\nVisual financial KPI cards with distinct status colors and counts\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #125: [DASHBOARD-REPORTS] Web: ValuationCard — large total, helper line 'N items have no cost recorded; M items approximate'

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Owner valuation widget displaying total capital with uncosted warnings
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #125 - Web: ValuationCard — large total, helper line 'N items have ..." --label "frontend,must,dashboard" --body "### Deliverable\nOwner valuation widget displaying total capital with uncosted warnings\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #126: [DASHBOARD-REPORTS] Web: Low stock warning cards — product name, current/threshold with unit, Restock button

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Stock replenishment cards with 1-tap shortcut to receive inventory
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #126 - Web: Low stock warning cards — product name, current/thresho..." --label "frontend,must,dashboard" --body "### Deliverable\nStock replenishment cards with 1-tap shortcut to receive inventory\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #127: [DASHBOARD-REPORTS] Web: Today screen — date selector (EAT), 3 buckets, valuation (owner), low stock list, quick actions

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Full overview screen showing daily revenue, outbox status, and alerts
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #127 - Web: Today screen — date selector (EAT), 3 buckets, valuatio..." --label "frontend,must,dashboard" --body "### Deliverable\nFull overview screen showing daily revenue, outbox status, and alerts\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #128: [DASHBOARD-REPORTS] Web: Dashboard density toggle (compact/comfortable table rows)

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Table density switcher for customizing view on mobile vs desktop
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #128 - Web: Dashboard density toggle (compact/comfortable table row..." --label "frontend,must,dashboard" --body "### Deliverable\nTable density switcher for customizing view on mobile vs desktop\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #129: [DASHBOARD-REPORTS] CSV exports [Should]: GET /exports/sales.csv, /stock-changes.csv (owner only)

- **Labels:** `backend`, `priority:should`, `slice:dashboard`
- **Priority:** **Should** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Streaming CSV export endpoints for tax accounting and bookkeeping
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #129 - CSV exports [Should]: GET /exports/sales.csv, /stock-changes..." --label "backend,should,dashboard" --body "### Deliverable\nStreaming CSV export endpoints for tax accounting and bookkeeping\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #130: [DASHBOARD-REPORTS] Pending-records export (device): JSON stokari-pending-export/v1 from outbox/sales/stockChanges — never marked confirmed, sensitive data warning

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Client backup file generator exporting unsynced outbox records to JSON
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #130 - Pending-records export (device): JSON stokari-pending-export..." --label "frontend,must,dashboard" --body "### Deliverable\nClient backup file generator exporting unsynced outbox records to JSON\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #131: [DASHBOARD-REPORTS] Web: Export Pending Records button in Settings + Staff screens

- **Labels:** `frontend`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Functional export button triggering actual browser file download
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #131 - Web: Export Pending Records button in Settings + Staff scree..." --label "frontend,must,dashboard" --body "### Deliverable\nFunctional export button triggering actual browser file download\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #132: [DASHBOARD-REPORTS] Date handling: Africa/Addis_Ababa timezone, localDay on sales for grouping

- **Labels:** `shared`, `priority:must`, `slice:dashboard`
- **Priority:** **Must** | **Slice:** `Dashboard`
- **Deliverable & Acceptance Criteria:** Timezone normalizer ensuring transactions align to local Ethiopian date
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #132 - Date handling: Africa/Addis_Ababa timezone, localDay on sale..." --label "shared,must,dashboard" --body "### Deliverable\nTimezone normalizer ensuring transactions align to local Ethiopian date\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #133: [DASHBOARD-REPORTS] CountSession + CountLine models [Should]

- **Labels:** `backend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** PostgreSQL schema for physical inventory count sessions
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #133 - CountSession + CountLine models [Should]..." --label "backend,should,counts" --body "### Deliverable\nPostgreSQL schema for physical inventory count sessions\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #134: [DASHBOARD-REPORTS] SubmitCountHandler, DecideCountHandler [Should]

- **Labels:** `backend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** Commands to record observed shelf counts and decide variances
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #134 - SubmitCountHandler, DecideCountHandler [Should]..." --label "backend,should,counts" --body "### Deliverable\nCommands to record observed shelf counts and decide variances\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #135: [DASHBOARD-REPORTS] Server proposes delta = observedMilli − balanceAtVersion(baseVersion) (stock log query); shows movements after baseVersion [Should]

- **Labels:** `backend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** Variance reconciliation calculation accounting for intermediate sales
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #135 - Server proposes delta = observedMilli − balanceAtVersion(bas..." --label "backend,should,counts" --body "### Deliverable\nVariance reconciliation calculation accounting for intermediate sales\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #136: [DASHBOARD-REPORTS] Owner edits delta, approves → COUNT_CORRECTION entry [Should]

- **Labels:** `backend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** Owner approval workflow generating audit ledger adjustment movement
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #136 - Owner edits delta, approves → COUNT_CORRECTION entry [Should..." --label "backend,should,counts" --body "### Deliverable\nOwner approval workflow generating audit ledger adjustment movement\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #137: [DASHBOARD-REPORTS] Web: Count screen — start session, enter observed per product, review proposed delta, decide [Should]

- **Labels:** `frontend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** Interactive inventory count counting sheet with live delta feedback
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #137 - Web: Count screen — start session, enter observed per produc..." --label "frontend,should,counts" --body "### Deliverable\nInteractive inventory count counting sheet with live delta feedback\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #138: [DASHBOARD-REPORTS] Web: Count session history [Should]

- **Labels:** `frontend`, `priority:should`, `slice:counts`
- **Priority:** **Should** | **Slice:** `Counts`
- **Deliverable & Acceptance Criteria:** List of historical count sessions and owner reconciliation approvals
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #138 - Web: Count session history [Should]..." --label "frontend,should,counts" --body "### Deliverable\nList of historical count sessions and owner reconciliation approvals\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #139: [DASHBOARD-REPORTS] meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission, no pull; persistent banner [Should]

- **Labels:** `frontend`, `priority:should`, `slice:localonly`
- **Priority:** **Should** | **Slice:** `LocalOnly`
- **Deliverable & Acceptance Criteria:** Standalone mode operating purely offline without server authentication
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #139 - meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission,..." --label "frontend,should,localonly" --body "### Deliverable\nStandalone mode operating purely offline without server authentication\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #140: [DASHBOARD-REPORTS] Explicit migration procedure to shared mode (out of MVP scope) [Should]

- **Labels:** `docs`, `priority:should`, `slice:localonly`
- **Priority:** **Should** | **Slice:** `LocalOnly`
- **Deliverable & Acceptance Criteria:** Documented migration guide for upgrading standalone phone to cloud
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #140 - Explicit migration procedure to shared mode (out of MVP scop..." --label "docs,should,localonly" --body "### Deliverable\nDocumented migration guide for upgrading standalone phone to cloud\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #141: [DASHBOARD-REPORTS] Data export/import for local-only → shared migration [Should]

- **Labels:** `frontend`, `priority:should`, `slice:localonly`
- **Priority:** **Should** | **Slice:** `LocalOnly`
- **Deliverable & Acceptance Criteria:** JSON bundle exporter and importer for transitioning local shops
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #141 - Data export/import for local-only → shared migration [Should..." --label "frontend,should,localonly" --body "### Deliverable\nJSON bundle exporter and importer for transitioning local shops\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #142: [DASHBOARD-REPORTS] Web: Local-only mode toggle in Settings with warning [Should]

- **Labels:** `frontend`, `priority:should`, `slice:localonly`
- **Priority:** **Should** | **Slice:** `LocalOnly`
- **Deliverable & Acceptance Criteria:** Settings UI toggle switching application into unclouded operation
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #142 - Web: Local-only mode toggle in Settings with warning [Should..." --label "frontend,should,localonly" --body "### Deliverable\nSettings UI toggle switching application into unclouded operation\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #153: [DASHBOARD-REPORTS] Web: navigator.storage.persist() requested at first run; quota warnings in Settings

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Automatic persistent storage request preventing browser cache eviction
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #153 - Web: navigator.storage.persist() requested at first run; quo..." --label "frontend,must,hardening" --body "### Deliverable\nAutomatic persistent storage request preventing browser cache eviction\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #154: [DASHBOARD-REPORTS] Web: Persistent storage status shown in Settings (enabled/disabled)

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Diagnostic storage meter displaying disk usage and persistence badge
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #154 - Web: Persistent storage status shown in Settings (enabled/di..." --label "frontend,must,hardening" --body "### Deliverable\nDiagnostic storage meter displaying disk usage and persistence badge\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #155: [DASHBOARD-REPORTS] Web: Clock skew banner (>5 min) with server time offset

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Warning banner alerting cashiers if phone clock drifts beyond 5 minutes
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #155 - Web: Clock skew banner (>5 min) with server time offset..." --label "frontend,must,hardening" --body "### Deliverable\nWarning banner alerting cashiers if phone clock drifts beyond 5 minutes\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #156: [DASHBOARD-REPORTS] Web: Lease expiry UX — banner at 24h, read-only after expiry, export still works

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Graceful lease expiration transitions disabling sales but allowing export
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #156 - Web: Lease expiry UX — banner at 24h, read-only after expiry..." --label "frontend,must,hardening" --body "### Deliverable\nGraceful lease expiration transitions disabling sales but allowing export\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #157: [DASHBOARD-REPORTS] Web: Error toasts with retry action (no bare 'something went wrong')

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Actionable toast notifications with clear resolution steps
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #157 - Web: Error toasts with retry action (no bare 'something went..." --label "frontend,must,hardening" --body "### Deliverable\nActionable toast notifications with clear resolution steps\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

#### Issue #158: [DASHBOARD-REPORTS] Web: Empty states with CTA button (no illustrations)

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Minimalist, utilitarian empty states guiding users to create data
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DASHBOARD-REPORTS] #158 - Web: Empty states with CTA button (no illustrations)..." --label "frontend,must,hardening" --body "### Deliverable\nMinimalist, utilitarian empty states guiding users to create data\n\nPart of Work Package 9: DASHBOARD-REPORTS"
  ```

---

## Work Package 10: Design System Primitives, Testing Gates & Contract Verification

- **Primary Assignee Role:** Design System & QA Lead
- **GitHub Milestone / Epic Label:** `epic:design-system-qa`
- **Subsystem Boundary & Rationale:** Owns design tokens, primitive UI components, two-device Playwright E2E tests, Hypothesis/fast-check property tests, trace_check gate, and visual regressions.

### GitHub Issues in this Package:

#### Issue #148: [DESIGN-SYSTEM-QA] Performance: Lighthouse + timers on target phone (2000 products, 50k movements); p95 ≤300ms local actions, search <1s, launch <3s, dashboard <2s

- **Labels:** `qa`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Performance audit report meeting all NFR benchmarks on low-end hardware
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #148 - Performance: Lighthouse + timers on target phone (2000 produ..." --label "qa,must,hardening" --body "### Deliverable\nPerformance audit report meeting all NFR benchmarks on low-end hardware\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #149: [DESIGN-SYSTEM-QA] Bundle size: ≤2MB compressed (code splitting, lazy routes)

- **Labels:** `frontend`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Optimized production Vite build within strict 2MB network budget
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #149 - Bundle size: ≤2MB compressed (code splitting, lazy routes)..." --label "frontend,must,hardening" --body "### Deliverable\nOptimized production Vite build within strict 2MB network budget\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #150: [DESIGN-SYSTEM-QA] Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no horizontal scroll, status = text + icon

- **Labels:** `qa`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Axe-core audit report verifying zero accessibility violations
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #150 - Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no hor..." --label "qa,must,hardening" --body "### Deliverable\nAxe-core audit report verifying zero accessibility violations\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #151: [DESIGN-SYSTEM-QA] i18n: all strings in en.json from day one; Amharic am.json [Should]

- **Labels:** `shared`, `priority:should`, `slice:hardening`
- **Priority:** **Should** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** Complete English string dictionary and bilingual Amharic fallback
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #151 - i18n: all strings in en.json from day one; Amharic am.json [..." --label "shared,should,hardening" --body "### Deliverable\nComplete English string dictionary and bilingual Amharic fallback\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #152: [DESIGN-SYSTEM-QA] Usability test: ≥5 outside users, ≥80% complete basic sale on first attempt

- **Labels:** `qa`, `priority:must`, `slice:hardening`
- **Priority:** **Must** | **Slice:** `Hardening`
- **Deliverable & Acceptance Criteria:** User research report proving cashier checkout usability in under 10 seconds
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #152 - Usability test: ≥5 outside users, ≥80% complete basic sale o..." --label "qa,must,hardening" --body "### Deliverable\nUser research report proving cashier checkout usability in under 10 seconds\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #159: [DESIGN-SYSTEM-QA] Shared fixtures: money-vectors.json, quantity-vectors.json, payload-hash-vectors.json, permissions.json, error-codes.json, sample-operations/*.json

- **Labels:** `shared`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Committed canonical fixture bundle shared between backend and web
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #159 - Shared fixtures: money-vectors.json, quantity-vectors.json, ..." --label "shared,must,qa" --body "### Deliverable\nCommitted canonical fixture bundle shared between backend and web\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #160: [DESIGN-SYSTEM-QA] API unit tests: money, quantity, status machines, permission table, conflict policy, projection

- **Labels:** `backend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Backend domain unit test suite achieving >90% test coverage
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #160 - API unit tests: money, quantity, status machines, permission..." --label "backend,must,qa" --body "### Deliverable\nBackend domain unit test suite achieving >90% test coverage\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #161: [DESIGN-SYSTEM-QA] API integration tests (pytest-django + factory_boy + Postgres): every handler, repository, endpoint

- **Labels:** `backend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Database integration tests covering all repositories and endpoints
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #161 - API integration tests (pytest-django + factory_boy + Postgre..." --label "backend,must,qa" --body "### Deliverable\nDatabase integration tests covering all repositories and endpoints\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #162: [DESIGN-SYSTEM-QA] API concurrency tests: parallel pushes, duplicate opId, pull during push (transaction=True + threads)

- **Labels:** `backend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Multi-threaded race condition tests proving shop lock effectiveness
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #162 - API concurrency tests: parallel pushes, duplicate opId, pull..." --label "backend,must,qa" --body "### Deliverable\nMulti-threaded race condition tests proving shop lock effectiveness\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #163: [DESIGN-SYSTEM-QA] API property tests (Hypothesis): random interleavings → qty = Σ deltas, no duplicate effect, cursor safety

- **Labels:** `backend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Hypothesis property tests asserting ledger invariants across 1,000 runs
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #163 - API property tests (Hypothesis): random interleavings → qty ..." --label "backend,must,qa" --body "### Deliverable\nHypothesis property tests asserting ledger invariants across 1,000 runs\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #164: [DESIGN-SYSTEM-QA] API architecture tests: one handler per op, no direct Model.objects, composite keys present, no business logic in models

- **Labels:** `backend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Import-linter rules asserting clean architectural boundaries
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #164 - API architecture tests: one handler per op, no direct Model...." --label "backend,must,qa" --body "### Deliverable\nImport-linter rules asserting clean architectural boundaries\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #165: [DESIGN-SYSTEM-QA] Web unit tests (Vitest + fake-indexeddb): use cases, outbox, result applier, recovery, projection

- **Labels:** `frontend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Client unit test suite achieving >90% test coverage in Vitest
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #165 - Web unit tests (Vitest + fake-indexeddb): use cases, outbox,..." --label "frontend,must,qa" --body "### Deliverable\nClient unit test suite achieving >90% test coverage in Vitest\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #166: [DESIGN-SYSTEM-QA] Web property tests (fast-check): projection and outbox state

- **Labels:** `frontend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Fast-check property tests verifying client projection mathematical invariants
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #166 - Web property tests (fast-check): projection and outbox state..." --label "frontend,must,qa" --body "### Deliverable\nFast-check property tests verifying client projection mathematical invariants\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #167: [DESIGN-SYSTEM-QA] Web contract tests: run every sample operation through Zod schemas; money/quantity vectors match Python

- **Labels:** `frontend`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Contract tests proving frontend TypeScript matches Python vectors exactly
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #167 - Web contract tests: run every sample operation through Zod s..." --label "frontend,must,qa" --body "### Deliverable\nContract tests proving frontend TypeScript matches Python vectors exactly\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #168: [DESIGN-SYSTEM-QA] E2E tests (Playwright): two browser contexts as two devices; offline sale → sync → reload → conflict flow

- **Labels:** `qa`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Automated two-device conflict simulation verifying AT-06 end-to-end
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #168 - E2E tests (Playwright): two browser contexts as two devices;..." --label "qa,must,qa" --body "### Deliverable\nAutomated two-device conflict simulation verifying AT-06 end-to-end\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #169: [DESIGN-SYSTEM-QA] Device tests: real low-end Android (2GB RAM), 320px emulator — install, offline open, NFR-01/02/14

- **Labels:** `qa`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Low-spec device verification report confirming PWA installation and speed
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #169 - Device tests: real low-end Android (2GB RAM), 320px emulator..." --label "qa,must,qa" --body "### Deliverable\nLow-spec device verification report confirming PWA installation and speed\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #170: [DESIGN-SYSTEM-QA] Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test titles [FR-14][AT-04]; trace_check.py fails CI if Must req untagged

- **Labels:** `infra`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** CI script failing pull requests if any Must requirement lacks a test tag
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #170 - Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test ..." --label "infra,must,qa" --body "### Deliverable\nCI script failing pull requests if any Must requirement lacks a test tag\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #171: [DESIGN-SYSTEM-QA] AT-01..AT-20 mapping to test scenarios (T-01..T-35)

- **Labels:** `docs`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Complete test matrix document linking requirements to test code
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #171 - AT-01..AT-20 mapping to test scenarios (T-01..T-35)..." --label "docs,must,qa" --body "### Deliverable\nComplete test matrix document linking requirements to test code\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #172: [DESIGN-SYSTEM-QA] OpenAPI diff in CI: fails if openapi.json stale vs code

- **Labels:** `infra`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Automated CI check catching out-of-date API schemas before merge
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #172 - OpenAPI diff in CI: fails if openapi.json stale vs code..." --label "infra,must,qa" --body "### Deliverable\nAutomated CI check catching out-of-date API schemas before merge\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #173: [DESIGN-SYSTEM-QA] Coverage gates: 70% overall, 90% on domain/, core/, sync/

- **Labels:** `infra`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Enforced code coverage thresholds in GitHub Actions
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #173 - Coverage gates: 70% overall, 90% on domain/, core/, sync/..." --label "infra,must,qa" --body "### Deliverable\nEnforced code coverage thresholds in GitHub Actions\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #174: [DESIGN-SYSTEM-QA] Visual regression tests: all 4 states × 3 breakpoints × 2 roles per component

- **Labels:** `qa`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Automated visual snapshot suite catching accidental CSS regressions
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #174 - Visual regression tests: all 4 states × 3 breakpoints × 2 ro..." --label "qa,must,qa" --body "### Deliverable\nAutomated visual snapshot suite catching accidental CSS regressions\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #175: [DESIGN-SYSTEM-QA] Accessibility audit: axe-core in CI, manual screen reader test

- **Labels:** `qa`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Axe-core gate ensuring zero accessibility errors in pull requests
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #175 - Accessibility audit: axe-core in CI, manual screen reader te..." --label "qa,must,qa" --body "### Deliverable\nAxe-core gate ensuring zero accessibility errors in pull requests\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #176: [DESIGN-SYSTEM-QA] Performance regression: bundle size, TTI, sync latency tracked per PR

- **Labels:** `infra`, `priority:must`, `slice:qa`
- **Priority:** **Must** | **Slice:** `QA`
- **Deliverable & Acceptance Criteria:** Automated bundle and latency tracking on every pull request
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #176 - Performance regression: bundle size, TTI, sync latency track..." --label "infra,must,qa" --body "### Deliverable\nAutomated bundle and latency tracking on every pull request\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #177: [DESIGN-SYSTEM-QA] Design token implementation: CSS variables for all colors, spacing, radii, shadows, typography

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Central CSS tokens adhering strictly to utilitarian cobalt palette
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #177 - Design token implementation: CSS variables for all colors, s..." --label "frontend,must,ui" --body "### Deliverable\nCentral CSS tokens adhering strictly to utilitarian cobalt palette\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #178: [DESIGN-SYSTEM-QA] Component library: Button, Input, Badge, Card, Modal, Sheet, Drawer, DataTable with all variants

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Accessible primitive component library with 44px minimum tap targets
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #178 - Component library: Button, Input, Badge, Card, Modal, Sheet,..." --label "frontend,must,ui" --body "### Deliverable\nAccessible primitive component library with 44px minimum tap targets\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #179: [DESIGN-SYSTEM-QA] Specialized components: SyncPill, QuantityInput, CurrencyInput, UnitSelect, StockLevelDisplay, PaymentSelector

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Retail-specific composite UI controls for currency and units
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #179 - Specialized components: SyncPill, QuantityInput, CurrencyInp..." --label "frontend,must,ui" --body "### Deliverable\nRetail-specific composite UI controls for currency and units\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #180: [DESIGN-SYSTEM-QA] Composite components: RevenueBucket, ConflictCaseCard, LeaseHealthRow, ProductCard, LowStockCard

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Card components displaying complex domain metrics cleanly
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #180 - Composite components: RevenueBucket, ConflictCaseCard, Lease..." --label "frontend,must,ui" --body "### Deliverable\nCard components displaying complex domain metrics cleanly\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #181: [DESIGN-SYSTEM-QA] Mobile Sell screen: header, search, quick chips, cart, stepper, payment selector, complete sale button

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Mobile cashier POS layout verified on 375px and 390px screens
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #181 - Mobile Sell screen: header, search, quick chips, cart, stepp..." --label "frontend,must,ui" --body "### Deliverable\nMobile cashier POS layout verified on 375px and 390px screens\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #182: [DESIGN-SYSTEM-QA] Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick chips, live total)

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Touch decimal weight keypad optimized for fast one-handed entry
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #182 - Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick..." --label "frontend,must,ui" --body "### Deliverable\nTouch decimal weight keypad optimized for fast one-handed entry\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #183: [DESIGN-SYSTEM-QA] Mobile Sell Anyway Sheet (destructive variant, confirmed vs projected)

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** High-contrast warning dialog approving offline overselling
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #183 - Mobile Sell Anyway Sheet (destructive variant, confirmed vs ..." --label "frontend,must,ui" --body "### Deliverable\nHigh-contrast warning dialog approving offline overselling\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #184: [DESIGN-SYSTEM-QA] Desktop sidebar (240px → 48px icon rail), sticky header, split-pane drawers

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Collapsible desktop navigation sidebar adapting to wide displays
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #184 - Desktop sidebar (240px → 48px icon rail), sticky header, spl..." --label "frontend,must,ui" --body "### Deliverable\nCollapsible desktop navigation sidebar adapting to wide displays\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #185: [DESIGN-SYSTEM-QA] DataTable: sticky header, sortable columns, filter toolbar, bulk actions, density toggle

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** High-density data table component with horizontal scroll wrapper
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #185 - DataTable: sticky header, sortable columns, filter toolbar, ..." --label "frontend,must,ui" --body "### Deliverable\nHigh-density data table component with horizontal scroll wrapper\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #186: [DESIGN-SYSTEM-QA] Amharic text rendering: no baseline shift, proper font fallback (Noto Sans Ethiopic)

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Font stack verification eliminating Amharic glyph baseline distortion
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #186 - Amharic text rendering: no baseline shift, proper font fallb..." --label "frontend,must,ui" --body "### Deliverable\nFont stack verification eliminating Amharic glyph baseline distortion\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #187: [DESIGN-SYSTEM-QA] Reduced motion: pulse animations disabled, slide transitions instant

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** prefers-reduced-motion CSS media query compliance
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #187 - Reduced motion: pulse animations disabled, slide transitions..." --label "frontend,must,ui" --body "### Deliverable\nprefers-reduced-motion CSS media query compliance\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

#### Issue #188: [DESIGN-SYSTEM-QA] Dark mode: NOT SUPPORTED — verify light-only implementation

- **Labels:** `frontend`, `priority:must`, `slice:ui`
- **Priority:** **Must** | **Slice:** `UI`
- **Deliverable & Acceptance Criteria:** Confirmation audit ensuring high-contrast light-only daytime theme
- **GitHub CLI Command:**
  ```bash
  gh issue create --title "[DESIGN-SYSTEM-QA] #188 - Dark mode: NOT SUPPORTED — verify light-only implementation..." --label "frontend,must,ui" --body "### Deliverable\nConfirmation audit ensuring high-contrast light-only daytime theme\n\nPart of Work Package 10: DESIGN-SYSTEM-QA"
  ```

---
