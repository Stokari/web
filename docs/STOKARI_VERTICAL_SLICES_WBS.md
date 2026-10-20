# Stokari · 188-Task Vertical Slices Work Breakdown Structure
> **Document Baseline:** SDD v0.4 · SRS v0.5 · Total Tasks: **188 Discrete Deliverables**
> **Architecture Governance:** Organized into **4 Full-Stack Vertical Domain Slices** for 4 engineers, plus shared operations, testing gates, and deferred cloud infrastructure.

---

## Executive Team Lane Summary

| Slice Code | Vertical Domain & Subsystem | Primary Assignee | Task Range | Count | Architectural Ownership |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **VS-1** | **Identity, Multi-Tenancy & Store Administration** | Person 1 (Identity & Tenancy Lead) | `#1` – `#26` | **26** | Enforces tenant isolation via ShopScopedRepository |
| **VS-2** | **Master Catalog, Products & Packaging Domain** | Person 2 (Catalog & Pricing Lead) | `#27` – `#44` | **18** | Enforces immutable base unit on products |
| **VS-3** | **POS Register, Cashier Cart & Durable Sales** | Person 3 (POS & Checkout Lead) | `#45` – `#69` | **25** | INV-01 atomic Dexie transaction committing Sale + lines + outbox before UI confirmation |
| **VS-4** | **Stock Movement Ledger, Offline Sync Engine & AT-06 Arbitration** | Person 4 (Ledger, Sync & Conflict Lead) | `#70` – `#131` | **62** | Append-only StockChange ledger protected by PostgreSQL triggers |
| **VS-5** | **Store Analytics, Physical Counts & Local-Only Mode** | Shared Operations (Persons 2, 3 & 4) | `#132` – `#147` | **16** | SQL inventory valuation queries excluding uncosted items |
| **VS-6** | **Design System, Test Gates & Contract Verification** | Shared Quality Gates (All 4 Developers / QA) | `#148` – `#178` | **31** | Contract loop synchronizing openapi |
| **VS-7** | **Deferred Cloud Infrastructure & Production Hardening (Post-Development)** | Deferred Sprint (Post-Local Development) | `#179` – `#188` | **10** | Intentionally deferred until after local vertical slices are functioning and passing all automated test suites locally |
| **TOTAL** | **Full System Delivery** | **4 Engineers + QA** | `#1` – `#188` | **188** | **Zero Merge Conflict Architecture** |

---

## Vertical Slice 1: Identity, Multi-Tenancy & Store Administration

- **Primary Assignee Track:** **Person 1 (Identity & Tenancy Lead)**
- **Subsystem Mission:** Full-stack ownership of store onboarding, tenancy isolation, Google OIDC token auth, staff leases, session lifecycle, and responsive app shell.
- **Architectural Invariants:** Enforces tenant isolation via ShopScopedRepository. Composite keys (shop_id, id). Custom Actor dataclass bypassing Django auth tables. Zero-trust lease expiration and clock-rollback detection in IndexedDB.

### Task Register:

#### Task #1: [VS-1-01] Init stokari-api Django + uv, Ruff, mypy, import-linter, pytest, drf-spectacular *(Orig #1)*
- **Layer:** `Backend / Tooling` | **Priority:** **Must** | **Files:** `backend/pyproject.toml, backend/backend/settings.py`
- **Architectural Scope:** Configures Python 3.14 + uv toolchain with strict type checking (mypy), import linting to prevent cyclic layer leaks, and drf-spectacular for OpenAPI generation.
- **Deliverable & Acceptance Criteria:** Local backend environment running with zero warnings on `uv run ruff check .` and `uv run python manage.py check`.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-01] #1 - Init stokari-api Django + uv, Ruff, mypy, import-linter, pyt..." --label "backend,tooling,must" --body "### Architectural Scope\nConfigures Python 3.14 + uv toolchain with strict type checking (mypy), import linting to prevent cyclic layer leaks, and drf-spectacular for OpenAPI generation.\n\n### Deliverable\nLocal backend environment running with zero warnings on `uv run ruff check .` and `uv run python manage.py check`.\n\nFiles: backend/pyproject.toml, backend/backend/settings.py"
  ```

#### Task #2: [VS-1-02] Init stokari-web Vite+React+TS + Vitest, Playwright, dependency-cruiser, ESLint *(Orig #2)*
- **Layer:** `Frontend / Tooling` | **Priority:** **Must** | **Files:** `web/package.json, web/vite.config.ts, web/tsconfig.json`
- **Architectural Scope:** Sets up React 19, TypeScript strict mode, Vite+, and Vitest test runner. Enforces architectural boundaries via dependency-cruiser.
- **Deliverable & Acceptance Criteria:** Local web environment running with zero errors on `vp check` and `vp test`.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-02] #2 - Init stokari-web Vite+React+TS + Vitest, Playwright, depende..." --label "frontend,tooling,must" --body "### Architectural Scope\nSets up React 19, TypeScript strict mode, Vite+, and Vitest test runner. Enforces architectural boundaries via dependency-cruiser.\n\n### Deliverable\nLocal web environment running with zero errors on `vp check` and `vp test`.\n\nFiles: web/package.json, web/vite.config.ts, web/tsconfig.json"
  ```

#### Task #3: [VS-1-03] common/kernel: Result, DomainError, typed IDs (ShopId, OpId, ProductId), Clock port, event bus *(Orig #9)*
- **Layer:** `Backend / Core` | **Priority:** **Must** | **Files:** `backend/common/kernel/{types,result,errors,bus,clock}.py`
- **Architectural Scope:** Innermost zero-dependency domain primitives. Strongly typed NewType identifiers prevent primitive obsession (accidental ID swapping). Result[T, E] monad replaces unhandled exceptions.
- **Deliverable & Acceptance Criteria:** Pure Python unit test suite passing with 100% test coverage.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-03] #3 - common/kernel: Result, DomainError, typed IDs (ShopId, OpId,..." --label "backend,core,must" --body "### Architectural Scope\nInnermost zero-dependency domain primitives. Strongly typed NewType identifiers prevent primitive obsession (accidental ID swapping). Result[T, E] monad replaces unhandled exceptions.\n\n### Deliverable\nPure Python unit test suite passing with 100% test coverage.\n\nFiles: backend/common/kernel/{types,result,errors,bus,clock}.py"
  ```

#### Task #4: [VS-1-04] common/http: RFC 9457 handler, request-id middleware, throttles, StrictIntegerField, pagination *(Orig #10)*
- **Layer:** `Backend / HTTP` | **Priority:** **Must** | **Files:** `backend/common/http/{errors,middleware,serializers,pagination}.py`
- **Architectural Scope:** RFC 9457 Problem Details error schema for uniform client error handling. Request ID correlation tracking. StrictIntegerField preventing float coercion in currency/quantities.
- **Deliverable & Acceptance Criteria:** HTTP middleware and base serializers verified by unit tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-04] #4 - common/http: RFC 9457 handler, request-id middleware, thrott..." --label "backend,http,must" --body "### Architectural Scope\nRFC 9457 Problem Details error schema for uniform client error handling. Request ID correlation tracking. StrictIntegerField preventing float coercion in currency/quantities.\n\n### Deliverable\nHTTP middleware and base serializers verified by unit tests.\n\nFiles: backend/common/http/{errors,middleware,serializers,pagination}.py"
  ```

#### Task #5: [VS-1-05] common/persistence: TransactionManager (atomic + shop_lock), ShopScopedRepository, domain_event outbox *(Orig #11)*
- **Layer:** `Backend / DB` | **Priority:** **Must** | **Files:** `backend/common/persistence/{manager,repository,outbox}.py`
- **Architectural Scope:** ShopScopedRepository automatically injects WHERE shop_id = :shop_id on all queries. TransactionManager acquires deterministic row locks before multi-table writes.
- **Deliverable & Acceptance Criteria:** Repository base classes and transactional wrappers verified by integration tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-05] #5 - common/persistence: TransactionManager (atomic + shop_lock),..." --label "backend,db,must" --body "### Architectural Scope\nShopScopedRepository automatically injects WHERE shop_id = :shop_id on all queries. TransactionManager acquires deterministic row locks before multi-table writes.\n\n### Deliverable\nRepository base classes and transactional wrappers verified by integration tests.\n\nFiles: backend/common/persistence/{manager,repository,outbox}.py"
  ```

#### Task #6: [VS-1-06] apps/shops/domain/permissions.py → contract/fixtures/permissions.json *(Orig #12)*
- **Layer:** `Shared Contract` | **Priority:** **Must** | **Files:** `backend/apps/shops/domain/permissions.py, contract/fixtures/permissions.json`
- **Architectural Scope:** Role-Permission matrix mapping OWNER vs ATTENDANT permissions across all operations, exported to a machine-readable JSON contract.
- **Deliverable & Acceptance Criteria:** Fixture generation script producing canonical permissions.json.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-06] #6 - apps/shops/domain/permissions.py → contract/fixtures/permiss..." --label "shared contract,must" --body "### Architectural Scope\nRole-Permission matrix mapping OWNER vs ATTENDANT permissions across all operations, exported to a machine-readable JSON contract.\n\n### Deliverable\nFixture generation script producing canonical permissions.json.\n\nFiles: backend/apps/shops/domain/permissions.py, contract/fixtures/permissions.json"
  ```

#### Task #7: [VS-1-07] Django models: Shop, Membership, User, OfflineLease, RefreshToken, Invite, Device (composite PKs) *(Orig #13)*
- **Layer:** `Backend / Models` | **Priority:** **Must** | **Files:** `backend/apps/{shops,identity}/models.py`
- **Architectural Scope:** PostgreSQL schema using CompositePrimaryKey('shop', 'id') on all tenant tables. 5-attendant limit per shop. OfflineLease with temporal validity windows.
- **Deliverable & Acceptance Criteria:** Initial Django migration (0001_initial.py) running cleanly on PostgreSQL.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-07] #7 - Django models: Shop, Membership, User, OfflineLease, Refresh..." --label "backend,models,must" --body "### Architectural Scope\nPostgreSQL schema using CompositePrimaryKey('shop', 'id') on all tenant tables. 5-attendant limit per shop. OfflineLease with temporal validity windows.\n\n### Deliverable\nInitial Django migration (0001_initial.py) running cleanly on PostgreSQL.\n\nFiles: backend/apps/{shops,identity}/models.py"
  ```

#### Task #8: [VS-1-08] Migrations 0001 (composite PKs) + 0002_protections (immutability triggers, composite FKs via RunSQL) *(Orig #14)*
- **Layer:** `Backend / DB` | **Priority:** **Must** | **Files:** `backend/apps/{shops,identity}/migrations/0002_protections.py`
- **Architectural Scope:** PostgreSQL RunSQL migration adding foreign keys referencing composite (shop_id, id) keys and database-level immutability triggers.
- **Deliverable & Acceptance Criteria:** Database migrations execute idempotently and enforce composite referential integrity.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-08] #8 - Migrations 0001 (composite PKs) + 0002_protections (immutabi..." --label "backend,db,must" --body "### Architectural Scope\nPostgreSQL RunSQL migration adding foreign keys referencing composite (shop_id, id) keys and database-level immutability triggers.\n\n### Deliverable\nDatabase migrations execute idempotently and enforce composite referential integrity.\n\nFiles: backend/apps/{shops,identity}/migrations/0002_protections.py"
  ```

#### Task #9: [VS-1-09] AuthProvider + ActorAuthentication DRF class (verifies access JWT/drain token → Actor dataclass) *(Orig #15)*
- **Layer:** `Backend / Auth` | **Priority:** **Must** | **Files:** `backend/apps/identity/authentication.py`
- **Architectural Scope:** Custom DRF authentication populating request.user with an immutable Actor dataclass. Completely bypasses django.contrib.auth production tables.
- **Deliverable & Acceptance Criteria:** Authentication tests asserting valid JWT resolves Actor and invalid token returns 401.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-09] #9 - AuthProvider + ActorAuthentication DRF class (verifies acces..." --label "backend,auth,must" --body "### Architectural Scope\nCustom DRF authentication populating request.user with an immutable Actor dataclass. Completely bypasses django.contrib.auth production tables.\n\n### Deliverable\nAuthentication tests asserting valid JWT resolves Actor and invalid token returns 401.\n\nFiles: backend/apps/identity/authentication.py"
  ```

#### Task #10: [VS-1-10] Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/refresh, POST /auth/lease, POST /auth/logout *(Orig #16)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/identity/views.py, backend/apps/identity/serializers.py`
- **Architectural Scope:** Google ID token validation via google-auth library. PyJWT issuance for access/refresh pairs. Offline lease token generation (1-30 days duration).
- **Deliverable & Acceptance Criteria:** End-to-end API test suite covering full authentication handshake.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-10] #10 - Endpoints: GET /auth/nonce, POST /auth/google, POST /auth/re..." --label "backend,api,must" --body "### Architectural Scope\nGoogle ID token validation via google-auth library. PyJWT issuance for access/refresh pairs. Offline lease token generation (1-30 days duration).\n\n### Deliverable\nEnd-to-end API test suite covering full authentication handshake.\n\nFiles: backend/apps/identity/views.py, backend/apps/identity/serializers.py"
  ```

#### Task #11: [VS-1-11] Endpoints: POST /shops (idempotency key), GET /shops/me, POST /shops/me/close (confirmation flow) *(Orig #17)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/shops/views.py, backend/apps/shops/serializers.py`
- **Architectural Scope:** Store creation with idempotency key, store settings inspection, and confirmation-protected store closure with cascade lease revocation.
- **Deliverable & Acceptance Criteria:** Shop lifecycle endpoints tested with role permission assertions.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-11] #11 - Endpoints: POST /shops (idempotency key), GET /shops/me, POS..." --label "backend,api,must" --body "### Architectural Scope\nStore creation with idempotency key, store settings inspection, and confirmation-protected store closure with cascade lease revocation.\n\n### Deliverable\nShop lifecycle endpoints tested with role permission assertions.\n\nFiles: backend/apps/shops/views.py, backend/apps/shops/serializers.py"
  ```

#### Task #12: [VS-1-12] Endpoints: POST /shops/me/invites, POST /invites/{token}/accept *(Orig #18)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/shops/invites.py`
- **Architectural Scope:** Cryptographic invite token generator with 48-hour expiration. Atomic counter verification enforcing the 5-attendant quota under concurrency.
- **Deliverable & Acceptance Criteria:** Invitation generation and redemption verified with race condition test.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-12] #12 - Endpoints: POST /shops/me/invites, POST /invites/{token}/acc..." --label "backend,api,must" --body "### Architectural Scope\nCryptographic invite token generator with 48-hour expiration. Atomic counter verification enforcing the 5-attendant quota under concurrency.\n\n### Deliverable\nInvitation generation and redemption verified with race condition test.\n\nFiles: backend/apps/shops/invites.py"
  ```

#### Task #13: [VS-1-13] Endpoints: GET /shops/me/members, POST /shops/me/members/{id}/deactivate *(Orig #19)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/shops/members.py`
- **Architectural Scope:** Immediate attendant deactivation: invalidates active leases, revokes refresh tokens, and provisions a 10-minute drain token.
- **Deliverable & Acceptance Criteria:** Deactivation endpoint tested asserting immediate rejection on subsequent requests (AT-09).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-13] #13 - Endpoints: GET /shops/me/members, POST /shops/me/members/{id..." --label "backend,api,must" --body "### Architectural Scope\nImmediate attendant deactivation: invalidates active leases, revokes refresh tokens, and provisions a 10-minute drain token.\n\n### Deliverable\nDeactivation endpoint tested asserting immediate rejection on subsequent requests (AT-09).\n\nFiles: backend/apps/shops/members.py"
  ```

#### Task #14: [VS-1-14] Permission classes: ActiveMembership, ShopOpen, RolePermission (reads from fixture) *(Orig #20)*
- **Layer:** `Backend / Security` | **Priority:** **Must** | **Files:** `backend/apps/shops/permissions.py`
- **Architectural Scope:** DRF permission gates: ActiveMembership ensures user is not deactivated, ShopOpen ensures store is not closed, RolePermission validates action against permissions.json.
- **Deliverable & Acceptance Criteria:** Permission tests verifying owner-only actions return 403 to attendants (T-19).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-14] #14 - Permission classes: ActiveMembership, ShopOpen, RolePermissi..." --label "backend,security,must" --body "### Architectural Scope\nDRF permission gates: ActiveMembership ensures user is not deactivated, ShopOpen ensures store is not closed, RolePermission validates action against permissions.json.\n\n### Deliverable\nPermission tests verifying owner-only actions return 403 to attendants (T-19).\n\nFiles: backend/apps/shops/permissions.py"
  ```

#### Task #15: [VS-1-15] Management commands: transfer_ownership, purge_closed_shop *(Orig #21)*
- **Layer:** `Backend / Ops` | **Priority:** **Must** | **Files:** `backend/apps/shops/management/commands/{transfer_ownership,purge_closed_shop}.py`
- **Architectural Scope:** CLI tools for store ownership transfer and soft-deleted store data purging after 30-day grace period.
- **Deliverable & Acceptance Criteria:** Management commands pass dry-run and execution tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-15] #15 - Management commands: transfer_ownership, purge_closed_shop..." --label "backend,ops,must" --body "### Architectural Scope\nCLI tools for store ownership transfer and soft-deleted store data purging after 30-day grace period.\n\n### Deliverable\nManagement commands pass dry-run and execution tests.\n\nFiles: backend/apps/shops/management/commands/{transfer_ownership,purge_closed_shop}.py"
  ```

#### Task #16: [VS-1-16] Web: session management (tokens in memory, refresh in IndexedDB, lease check, clock-rollback guard) *(Orig #22)*
- **Layer:** `Frontend / Session` | **Priority:** **Must** | **Files:** `web/src/session/{token-manager,lease-guard,clock}.ts`
- **Architectural Scope:** Access token stored exclusively in memory (protecting against XSS). Refresh token in IndexedDB. Clock-rollback detector tracking meta.maxSeenTime.
- **Deliverable & Acceptance Criteria:** Session manager tests asserting clock tampering triggers immediate security lock.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-16] #16 - Web: session management (tokens in memory, refresh in Indexe..." --label "frontend,session,must" --body "### Architectural Scope\nAccess token stored exclusively in memory (protecting against XSS). Refresh token in IndexedDB. Clock-rollback detector tracking meta.maxSeenTime.\n\n### Deliverable\nSession manager tests asserting clock tampering triggers immediate security lock.\n\nFiles: web/src/session/{token-manager,lease-guard,clock}.ts"
  ```

#### Task #17: [VS-1-17] Web: Google Sign-In flow, Auth context (useAuth), authenticated route guards *(Orig #23)*
- **Layer:** `Frontend / Auth` | **Priority:** **Must** | **Files:** `web/src/features/auth/{AuthContext,GoogleSignInButton,RequireAuth}.tsx`
- **Architectural Scope:** React 19 context managing authentication state. Automatic silent refresh token rotation. Route guards redirecting unauthenticated users to login.
- **Deliverable & Acceptance Criteria:** Sign-in and session restore verified in browser integration tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-17] #17 - Web: Google Sign-In flow, Auth context (useAuth), authentica..." --label "frontend,auth,must" --body "### Architectural Scope\nReact 19 context managing authentication state. Automatic silent refresh token rotation. Route guards redirecting unauthenticated users to login.\n\n### Deliverable\nSign-in and session restore verified in browser integration tests.\n\nFiles: web/src/features/auth/{AuthContext,GoogleSignInButton,RequireAuth}.tsx"
  ```

#### Task #18: [VS-1-18] Web: Staff management screen (invite attendants, list members, deactivate) *(Orig #24)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/staff/{StaffScreen,MemberList,InviteModal}.tsx`
- **Architectural Scope:** Owner UI showing active cashier leases, remaining days, invite link generator, and 1-tap attendant deactivation button.
- **Deliverable & Acceptance Criteria:** Staff screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-18] #18 - Web: Staff management screen (invite attendants, list member..." --label "frontend,ui,must" --body "### Architectural Scope\nOwner UI showing active cashier leases, remaining days, invite link generator, and 1-tap attendant deactivation button.\n\n### Deliverable\nStaff screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/staff/{StaffScreen,MemberList,InviteModal}.tsx"
  ```

#### Task #19: [VS-1-19] Web: Multi-shop selection screen (if user has >1 membership) *(Orig #25)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/shops/ShopSelectorScreen.tsx`
- **Architectural Scope:** Store selection interface allowing users with multiple memberships to pick their active store workspace.
- **Deliverable & Acceptance Criteria:** Shop selector transitions smoothly and updates active tenant context.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-19] #19 - Web: Multi-shop selection screen (if user has >1 membership)..." --label "frontend,ui,must" --body "### Architectural Scope\nStore selection interface allowing users with multiple memberships to pick their active store workspace.\n\n### Deliverable\nShop selector transitions smoothly and updates active tenant context.\n\nFiles: web/src/features/shops/ShopSelectorScreen.tsx"
  ```

#### Task #20: [VS-1-20] Web: Create shop flow (first-time owner) + Accept invite flow (attendant) *(Orig #26)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/onboarding/{CreateShopWizard,AcceptInviteScreen}.tsx`
- **Architectural Scope:** First-time owner store initialization wizard and attendant invite link redemption view.
- **Deliverable & Acceptance Criteria:** Onboarding flows complete end-to-end and initialize local database partition.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-20] #20 - Web: Create shop flow (first-time owner) + Accept invite flo..." --label "frontend,ui,must" --body "### Architectural Scope\nFirst-time owner store initialization wizard and attendant invite link redemption view.\n\n### Deliverable\nOnboarding flows complete end-to-end and initialize local database partition.\n\nFiles: web/src/features/onboarding/{CreateShopWizard,AcceptInviteScreen}.tsx"
  ```

#### Task #21: [VS-1-21] Web: navigator.storage.persist() requested at first run; quota warnings in Settings *(Orig #153)*
- **Layer:** `Frontend / Storage` | **Priority:** **Must** | **Files:** `web/src/data/persistence-manager.ts`
- **Architectural Scope:** Requests persistent storage permission from the browser to prevent automated cache eviction on Android Chrome and Safari.
- **Deliverable & Acceptance Criteria:** Storage persistence requested on app launch; returns granted status.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-21] #21 - Web: navigator.storage.persist() requested at first run; quo..." --label "frontend,storage,must" --body "### Architectural Scope\nRequests persistent storage permission from the browser to prevent automated cache eviction on Android Chrome and Safari.\n\n### Deliverable\nStorage persistence requested on app launch; returns granted status.\n\nFiles: web/src/data/persistence-manager.ts"
  ```

#### Task #22: [VS-1-22] Web: Persistent storage status shown in Settings (enabled/disabled) *(Orig #154)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/settings/StorageGauge.tsx`
- **Architectural Scope:** Visual storage meter displaying used vs available disk space (navigator.storage.estimate()) with green Persistent Storage Active badge.
- **Deliverable & Acceptance Criteria:** Storage gauge renders accurately in staff_settings view.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-22] #22 - Web: Persistent storage status shown in Settings (enabled/di..." --label "frontend,ui,must" --body "### Architectural Scope\nVisual storage meter displaying used vs available disk space (navigator.storage.estimate()) with green Persistent Storage Active badge.\n\n### Deliverable\nStorage gauge renders accurately in staff_settings view.\n\nFiles: web/src/features/settings/StorageGauge.tsx"
  ```

#### Task #23: [VS-1-23] Web: Clock skew banner (>5 min) with server time offset *(Orig #155)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/ui/ClockSkewBanner.tsx`
- **Architectural Scope:** Warning banner displayed at the top of the app if client device clock differs from server time by more than 5 minutes.
- **Deliverable & Acceptance Criteria:** Banner displays with computed offset when time drift is detected.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-23] #23 - Web: Clock skew banner (>5 min) with server time offset..." --label "frontend,ui,must" --body "### Architectural Scope\nWarning banner displayed at the top of the app if client device clock differs from server time by more than 5 minutes.\n\n### Deliverable\nBanner displays with computed offset when time drift is detected.\n\nFiles: web/src/ui/ClockSkewBanner.tsx"
  ```

#### Task #24: [VS-1-24] Web: Lease expiry UX — banner at 24h, read-only after expiry, export still works *(Orig #156)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/auth/LeaseStatusBanner.tsx`
- **Architectural Scope:** Countdown alert when offline lease has <24 hours remaining. Disables sell buttons when expired while preserving emergency data export.
- **Deliverable & Acceptance Criteria:** Lease expiration states verified with mocked expired timestamps.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-24] #24 - Web: Lease expiry UX — banner at 24h, read-only after expiry..." --label "frontend,ui,must" --body "### Architectural Scope\nCountdown alert when offline lease has <24 hours remaining. Disables sell buttons when expired while preserving emergency data export.\n\n### Deliverable\nLease expiration states verified with mocked expired timestamps.\n\nFiles: web/src/features/auth/LeaseStatusBanner.tsx"
  ```

#### Task #25: [VS-1-25] Web: Error toasts with retry action (no bare 'something went wrong') *(Orig #157)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/ui/ToastManager.tsx`
- **Architectural Scope:** Context-sensitive toast notification system with machine-readable error codes and 1-tap retry actions.
- **Deliverable & Acceptance Criteria:** Toasts render with appropriate semantic color and retry callbacks.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-25] #25 - Web: Error toasts with retry action (no bare 'something went..." --label "frontend,ui,must" --body "### Architectural Scope\nContext-sensitive toast notification system with machine-readable error codes and 1-tap retry actions.\n\n### Deliverable\nToasts render with appropriate semantic color and retry callbacks.\n\nFiles: web/src/ui/ToastManager.tsx"
  ```

#### Task #26: [VS-1-26] Web: Empty states with CTA button (no illustrations) *(Orig #158)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/ui/EmptyState.tsx`
- **Architectural Scope:** Utilitarian empty state component guiding users to action (e.g., 'No staff members yet - Invite Attendant').
- **Deliverable & Acceptance Criteria:** Clean empty state renders without heavy decorative SVGs.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-1-26] #26 - Web: Empty states with CTA button (no illustrations)..." --label "frontend,ui,must" --body "### Architectural Scope\nUtilitarian empty state component guiding users to action (e.g., 'No staff members yet - Invite Attendant').\n\n### Deliverable\nClean empty state renders without heavy decorative SVGs.\n\nFiles: web/src/ui/EmptyState.tsx"
  ```

---

## Vertical Slice 2: Master Catalog, Products & Packaging Domain

- **Primary Assignee Track:** **Person 2 (Catalog & Pricing Lead)**
- **Subsystem Mission:** Full-stack ownership of products, packaging definitions (crates vs pieces), bilingual Amharic search normalization, integer santim pricing, and catalog UI.
- **Architectural Invariants:** Enforces immutable base unit on products. Santim pricing with half-up rounding. Packaging factor conversions (e.g. 1 crate = 24 bottles) snapshotting into historical records. Ethiopic homophone folding index.

### Task Register:

#### Task #27: [VS-2-01] Django Product model (composite PK, unit immutable, name/nameAlt, price/cost santim, lowStockMilli, status) *(Orig #27)*
- **Layer:** `Backend / Models` | **Priority:** **Must** | **Files:** `backend/apps/catalog/models.py`
- **Architectural Scope:** Product table with CompositePrimaryKey('shop', 'id'). Integer price_santim and cost_santim. Bilingual fields (name, name_alt). Status enum (ACTIVE, ARCHIVED).
- **Deliverable & Acceptance Criteria:** Product model migration running cleanly on PostgreSQL with composite indices.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-01] #27 - Django Product model (composite PK, unit immutable, name/nam..." --label "backend,models,must" --body "### Architectural Scope\nProduct table with CompositePrimaryKey('shop', 'id'). Integer price_santim and cost_santim. Bilingual fields (name, name_alt). Status enum (ACTIVE, ARCHIVED).\n\n### Deliverable\nProduct model migration running cleanly on PostgreSQL with composite indices.\n\nFiles: backend/apps/catalog/models.py"
  ```

#### Task #28: [VS-2-02] CatalogService + ProductReader ports; ProductRepository (ShopScoped) *(Orig #28)*
- **Layer:** `Backend / Domain` | **Priority:** **Must** | **Files:** `backend/apps/catalog/{services,repositories,ports}.py`
- **Architectural Scope:** Decoupled domain service and scoped repository. Enforces tenant isolation so shops cannot query or modify another store's products.
- **Deliverable & Acceptance Criteria:** Unit and integration tests asserting repository returns only shop-owned products.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-02] #28 - CatalogService + ProductReader ports; ProductRepository (Sho..." --label "backend,domain,must" --body "### Architectural Scope\nDecoupled domain service and scoped repository. Enforces tenant isolation so shops cannot query or modify another store's products.\n\n### Deliverable\nUnit and integration tests asserting repository returns only shop-owned products.\n\nFiles: backend/apps/catalog/{services,repositories,ports}.py"
  ```

#### Task #29: [VS-2-03] Operations: CreateProduct (atomic with OPENING StockLog), UpdateProduct, SetProductStatus *(Orig #29)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/catalog/handlers.py`
- **Architectural Scope:** Atomic product creation: if initial quantity > 0, atomically writes OPENING entry to StockChange ledger in the same database transaction.
- **Deliverable & Acceptance Criteria:** CreateProduct command handler verified emitting ledger entry and updating StockLevel.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-03] #29 - Operations: CreateProduct (atomic with OPENING StockLog), Up..." --label "backend,handlers,must" --body "### Architectural Scope\nAtomic product creation: if initial quantity > 0, atomically writes OPENING entry to StockChange ledger in the same database transaction.\n\n### Deliverable\nCreateProduct command handler verified emitting ledger entry and updating StockLevel.\n\nFiles: backend/apps/catalog/handlers.py"
  ```

#### Task #30: [VS-2-04] Unit catalogue (apps/stock-log/domain/units.py) → contract/fixtures/units.json *(Orig #30)*
- **Layer:** `Shared Contract` | **Priority:** **Must** | **Files:** `backend/apps/catalog/domain/units.py, contract/fixtures/units.json`
- **Architectural Scope:** Canonical unit definitions (PIECE, KG, LITER, METER) with display symbols and decimal precision constraints exported to JSON contract.
- **Deliverable & Acceptance Criteria:** Export script generates versioned units.json fixture.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-04] #30 - Unit catalogue (apps/stock-log/domain/units.py) → contract/f..." --label "shared contract,must" --body "### Architectural Scope\nCanonical unit definitions (PIECE, KG, LITER, METER) with display symbols and decimal precision constraints exported to JSON contract.\n\n### Deliverable\nExport script generates versioned units.json fixture.\n\nFiles: backend/apps/catalog/domain/units.py, contract/fixtures/units.json"
  ```

#### Task #31: [VS-2-05] core/domain/quantity.py + core/domain/quantity.ts — parseQuantity, formatQuantity, validate_qty *(Orig #31)*
- **Layer:** `Shared Domain` | **Priority:** **Must** | **Files:** `backend/core/domain/quantity.py, web/src/core/domain/quantity.ts`
- **Architectural Scope:** Cross-language quantity math library using integer milli-units (1 kg = 1000 milli). Half-up rounding, bounds checking (0 to 1,000,000,000 milli).
- **Deliverable & Acceptance Criteria:** Both Python and TypeScript implementations pass identical test vectors (quantity-vectors.json).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-05] #31 - core/domain/quantity.py + core/domain/quantity.ts — parseQua..." --label "shared domain,must" --body "### Architectural Scope\nCross-language quantity math library using integer milli-units (1 kg = 1000 milli). Half-up rounding, bounds checking (0 to 1,000,000,000 milli).\n\n### Deliverable\nBoth Python and TypeScript implementations pass identical test vectors (quantity-vectors.json).\n\nFiles: backend/core/domain/quantity.py, web/src/core/domain/quantity.ts"
  ```

#### Task #32: [VS-2-06] core/search/normalize.ts — Latin + Ethiopic homophone folding (ሀ/ሐ/ኀ, ሰ/ሠ) *(Orig #32)*
- **Layer:** `Frontend / Search` | **Priority:** **Must** | **Files:** `web/src/core/search/normalize.ts`
- **Architectural Scope:** High-speed string normalizer mapping Ethiopic homophone glyphs to canonical forms. Enables searching 'ስኳር' or 'ስክዋር' interchangeably.
- **Deliverable & Acceptance Criteria:** Benchmarked search normalizer folding 2,000 product titles in < 2ms.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-06] #32 - core/search/normalize.ts — Latin + Ethiopic homophone foldin..." --label "frontend,search,must" --body "### Architectural Scope\nHigh-speed string normalizer mapping Ethiopic homophone glyphs to canonical forms. Enables searching 'ስኳር' or 'ስክዋር' interchangeably.\n\n### Deliverable\nBenchmarked search normalizer folding 2,000 product titles in < 2ms.\n\nFiles: web/src/core/search/normalize.ts"
  ```

#### Task #33: [VS-2-07] Web: Product-creation wizard ('How do you sell it?' → unit chips, preview sentence, 'Add another form') *(Orig #33)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/ProductWizard.tsx`
- **Architectural Scope:** Intuitive onboarding wizard asking cashiers 'How do you sell this?' (By the piece, by weight in kg, or by volume in liters) with live preview.
- **Deliverable & Acceptance Criteria:** Product wizard modal verified with step transitions and packaging chips.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-07] #33 - Web: Product-creation wizard ('How do you sell it?' → unit c..." --label "frontend,ui,must" --body "### Architectural Scope\nIntuitive onboarding wizard asking cashiers 'How do you sell this?' (By the piece, by weight in kg, or by volume in liters) with live preview.\n\n### Deliverable\nProduct wizard modal verified with step transitions and packaging chips.\n\nFiles: web/src/features/catalog/ProductWizard.tsx"
  ```

#### Task #34: [VS-2-08] Web: QuantityInput component — keypad by unit kind, quick chips from quickQtyMilli, g/mL toggle for KG/L *(Orig #34)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/ui/QuantityInput.tsx`
- **Architectural Scope:** Unit-aware quantity input component rendering integer stepper for PIECE or decimal keypad with g/kg toggle for KG.
- **Deliverable & Acceptance Criteria:** QuantityInput verified across all 4 unit types with touch event tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-08] #34 - Web: QuantityInput component — keypad by unit kind, quick ch..." --label "frontend,component,must" --body "### Architectural Scope\nUnit-aware quantity input component rendering integer stepper for PIECE or decimal keypad with g/kg toggle for KG.\n\n### Deliverable\nQuantityInput verified across all 4 unit types with touch event tests.\n\nFiles: web/src/ui/QuantityInput.tsx"
  ```

#### Task #35: [VS-2-09] Web: Product list/search (in-memory normalized index, Amharic fold, virtualization) *(Orig #35)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/ProductSearchIndex.ts`
- **Architectural Scope:** In-memory trie search index querying 2,000 cached products in under 50ms on mobile hardware, supporting Latin and Amharic queries.
- **Deliverable & Acceptance Criteria:** Search latency benchmark < 50ms on simulated low-end mobile CPU.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-09] #35 - Web: Product list/search (in-memory normalized index, Amhari..." --label "frontend,ui,must" --body "### Architectural Scope\nIn-memory trie search index querying 2,000 cached products in under 50ms on mobile hardware, supporting Latin and Amharic queries.\n\n### Deliverable\nSearch latency benchmark < 50ms on simulated low-end mobile CPU.\n\nFiles: web/src/features/catalog/ProductSearchIndex.ts"
  ```

#### Task #36: [VS-2-10] Web: Product detail (read-only unit badge, packaging editor [Stage 2]) *(Orig #36)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/ProductDetailDrawer.tsx`
- **Architectural Scope:** Slide-out inspector showing barcodes, retail prices, wholesale costs, margins, and packaging configurations.
- **Deliverable & Acceptance Criteria:** Product detail drawer renders with role-gated cost visibility.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-10] #36 - Web: Product detail (read-only unit badge, packaging editor ..." --label "frontend,ui,must" --body "### Architectural Scope\nSlide-out inspector showing barcodes, retail prices, wholesale costs, margins, and packaging configurations.\n\n### Deliverable\nProduct detail drawer renders with role-gated cost visibility.\n\nFiles: web/src/features/catalog/ProductDetailDrawer.tsx"
  ```

#### Task #37: [VS-2-11] Web: Create/Edit Product modal (Zod validation mirroring backend) *(Orig #37)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/ProductFormModal.tsx`
- **Architectural Scope:** React form with Zod schema validation mirroring backend DRF serializers. Live gross margin % calculator (price vs cost).
- **Deliverable & Acceptance Criteria:** Form validation catches invalid santim prices and negative stock thresholds.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-11] #37 - Web: Create/Edit Product modal (Zod validation mirroring bac..." --label "frontend,ui,must" --body "### Architectural Scope\nReact form with Zod schema validation mirroring backend DRF serializers. Live gross margin % calculator (price vs cost).\n\n### Deliverable\nForm validation catches invalid santim prices and negative stock thresholds.\n\nFiles: web/src/features/catalog/ProductFormModal.tsx"
  ```

#### Task #38: [VS-2-12] Web: Product card list (mobile) + DataTable (desktop) with density toggle *(Orig #38)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/ProductCatalogView.tsx`
- **Architectural Scope:** Responsive presentation: high-density 8-column DataTable on desktop (>1024px) switching to tactile card stack on mobile (<1024px).
- **Deliverable & Acceptance Criteria:** Dual-view component renders cleanly at 390px and 1280px viewports.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-12] #38 - Web: Product card list (mobile) + DataTable (desktop) with d..." --label "frontend,ui,must" --body "### Architectural Scope\nResponsive presentation: high-density 8-column DataTable on desktop (>1024px) switching to tactile card stack on mobile (<1024px).\n\n### Deliverable\nDual-view component renders cleanly at 390px and 1280px viewports.\n\nFiles: web/src/features/catalog/ProductCatalogView.tsx"
  ```

#### Task #39: [VS-2-13] Packaging rules [Should]: Product.packagings[], ReceiveLineInput.packaging, StockChange.packaging snapshot *(Orig #39)*
- **Layer:** `Backend / Packaging` | **Priority:** **Should** | **Files:** `backend/apps/catalog/packaging.py`
- **Architectural Scope:** Packaging definition schema supporting bulk containers (e.g., Crate of 24, Carton of 12) with conversion multiplier to base units.
- **Deliverable & Acceptance Criteria:** Packaging models and serializers pass conversion calculation tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-13] #39 - Packaging rules [Should]: Product.packagings[], ReceiveLineI..." --label "backend,packaging,should" --body "### Architectural Scope\nPackaging definition schema supporting bulk containers (e.g., Crate of 24, Carton of 12) with conversion multiplier to base units.\n\n### Deliverable\nPackaging models and serializers pass conversion calculation tests.\n\nFiles: backend/apps/catalog/packaging.py"
  ```

#### Task #40: [VS-2-14] Opening stock supports openingPackaging (count × factor) *(Orig #40)*
- **Layer:** `Backend / Handlers` | **Priority:** **Should** | **Files:** `backend/apps/catalog/handlers.py`
- **Architectural Scope:** Enables entering opening inventory as '5 crates' which automatically records as '120 pieces' in the base ledger.
- **Deliverable & Acceptance Criteria:** Opening stock calculation verified with container multiplication tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-14] #40 - Opening stock supports openingPackaging (count × factor)..." --label "backend,handlers,should" --body "### Architectural Scope\nEnables entering opening inventory as '5 crates' which automatically records as '120 pieces' in the base ledger.\n\n### Deliverable\nOpening stock calculation verified with container multiplication tests.\n\nFiles: backend/apps/catalog/handlers.py"
  ```

#### Task #41: [VS-2-15] Product search toolbar: search input, category filter, status filter, 'Add Product' button *(Orig #41)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/catalog/CatalogToolbar.tsx`
- **Architectural Scope:** Sticky search header with 1-tap category chips (Grains, Oils, Beverages) and quick-status filters (Low Stock, Out of Stock).
- **Deliverable & Acceptance Criteria:** Toolbar component matches stitch prototype styling and filter state.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-15] #41 - Product search toolbar: search input, category filter, statu..." --label "frontend,ui,must" --body "### Architectural Scope\nSticky search header with 1-tap category chips (Grains, Oils, Beverages) and quick-status filters (Low Stock, Out of Stock).\n\n### Deliverable\nToolbar component matches stitch prototype styling and filter state.\n\nFiles: web/src/features/catalog/CatalogToolbar.tsx"
  ```

#### Task #42: [VS-2-16] Category management (CRUD) [Should] *(Orig #42)*
- **Layer:** `Shared Domain` | **Priority:** **Should** | **Files:** `backend/apps/catalog/categories.py, web/src/features/catalog/CategoryModal.tsx`
- **Architectural Scope:** Custom store categories allowing owners to organize their inventory taxonomy.
- **Deliverable & Acceptance Criteria:** Category creation and filtering verified end-to-end.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-16] #42 - Category management (CRUD) [Should]..." --label "shared domain,should" --body "### Architectural Scope\nCustom store categories allowing owners to organize their inventory taxonomy.\n\n### Deliverable\nCategory creation and filtering verified end-to-end.\n\nFiles: backend/apps/catalog/categories.py, web/src/features/catalog/CategoryModal.tsx"
  ```

#### Task #43: [VS-2-17] i18n: all strings in en.json from day one; Amharic am.json [Should] *(Orig #151)*
- **Layer:** `Shared i18n` | **Priority:** **Should** | **Files:** `web/src/i18n/{en,am}.json, web/src/i18n/index.ts`
- **Architectural Scope:** Bilingual string dictionary mapping all UI labels to English and Amharic with zero hardcoded English strings in components.
- **Deliverable & Acceptance Criteria:** Language switcher toggles UI strings without layout distortion.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-17] #43 - i18n: all strings in en.json from day one; Amharic am.json [..." --label "shared i18n,should" --body "### Architectural Scope\nBilingual string dictionary mapping all UI labels to English and Amharic with zero hardcoded English strings in components.\n\n### Deliverable\nLanguage switcher toggles UI strings without layout distortion.\n\nFiles: web/src/i18n/{en,am}.json, web/src/i18n/index.ts"
  ```

#### Task #44: [VS-2-18] Amharic text rendering: no baseline shift, proper font fallback (Noto Sans Ethiopic) *(Orig #186)*
- **Layer:** `Frontend / Typography` | **Priority:** **Must** | **Files:** `web/src/index.css`
- **Architectural Scope:** Font stack configuration ensuring Amharic glyphs render with consistent vertical metrics and zero character clipping.
- **Deliverable & Acceptance Criteria:** Amharic text renders cleanly across Chrome, Safari, and Firefox.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-2-18] #44 - Amharic text rendering: no baseline shift, proper font fallb..." --label "frontend,typography,must" --body "### Architectural Scope\nFont stack configuration ensuring Amharic glyphs render with consistent vertical metrics and zero character clipping.\n\n### Deliverable\nAmharic text renders cleanly across Chrome, Safari, and Firefox.\n\nFiles: web/src/index.css"
  ```

---

## Vertical Slice 3: POS Register, Cashier Cart & Durable Sales

- **Primary Assignee Track:** **Person 3 (POS & Checkout Lead)**
- **Subsystem Mission:** Full-stack ownership of the cashier checkout flow, durable local Dexie saves (INV-01), cart management, decimal weight keypads, and today's revenue dashboard.
- **Architectural Invariants:** INV-01 atomic Dexie transaction committing Sale + lines + outbox before UI confirmation. Price snapshotting in historical lines. Immutable sales records with cancellation audit trails.

### Task Register:

#### Task #45: [VS-3-01] Django Sale, SaleLine, SaleCancellation models (composite PKs, reversesId on cancellation) *(Orig #57)*
- **Layer:** `Backend / Models` | **Priority:** **Must** | **Files:** `backend/apps/sales/models.py`
- **Architectural Scope:** Sale and SaleLine tables using CompositePrimaryKey('shop', 'id'). ReversesId foreign key on SaleCancellation pointing to original sale.
- **Deliverable & Acceptance Criteria:** Sales models migration running cleanly on PostgreSQL with composite FKs.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-01] #45 - Django Sale, SaleLine, SaleCancellation models (composite PK..." --label "backend,models,must" --body "### Architectural Scope\nSale and SaleLine tables using CompositePrimaryKey('shop', 'id'). ReversesId foreign key on SaleCancellation pointing to original sale.\n\n### Deliverable\nSales models migration running cleanly on PostgreSQL with composite FKs.\n\nFiles: backend/apps/sales/models.py"
  ```

#### Task #46: [VS-3-02] RecordSaleHandler: validates lines, recomputes totals, price snapshots, builds SALE entries, calls StockLogService.append, applies outcome matrix by mode *(Orig #58)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/sales/handlers/record_sale.py`
- **Architectural Scope:** Validates item lines, recomputes total santim, snapshots unit prices, and appends negative movements to the stock ledger atomically.
- **Deliverable & Acceptance Criteria:** RecordSaleHandler unit tests pass with price snapshot assertions.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-02] #46 - RecordSaleHandler: validates lines, recomputes totals, price..." --label "backend,handlers,must" --body "### Architectural Scope\nValidates item lines, recomputes total santim, snapshots unit prices, and appends negative movements to the stock ledger atomically.\n\n### Deliverable\nRecordSaleHandler unit tests pass with price snapshot assertions.\n\nFiles: backend/apps/sales/handlers/record_sale.py"
  ```

#### Task #47: [VS-3-03] CancelSaleHandler: inserts SaleCancellation (PK (shopId, saleId)), builds SALE_CANCELLATION entries with reversesId; quarantines on CANCELLATION_CONFLICT conditions *(Orig #59)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/sales/handlers/cancel_sale.py`
- **Architectural Scope:** Appends compensating positive ledger movements. Idempotent on second cancellation attempt. Quarantines if sale was already cancelled.
- **Deliverable & Acceptance Criteria:** CancelSaleHandler verified asserting single compensating movement (AT-08).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-03] #47 - CancelSaleHandler: inserts SaleCancellation (PK (shopId, sal..." --label "backend,handlers,must" --body "### Architectural Scope\nAppends compensating positive ledger movements. Idempotent on second cancellation attempt. Quarantines if sale was already cancelled.\n\n### Deliverable\nCancelSaleHandler verified asserting single compensating movement (AT-08).\n\nFiles: backend/apps/sales/handlers/cancel_sale.py"
  ```

#### Task #48: [VS-3-04] Web recordSale.ts (offline: one Dexie tx → sale, lines, stock log, projection, outbox; online: outbox only, await confirmation) *(Orig #60)*
- **Layer:** `Frontend / UseCase` | **Priority:** **Must** | **Files:** `web/src/features/pos/usecases/recordSale.ts`
- **Architectural Scope:** INV-01 Durable Local Save: commits Sale, SaleLines, pending StockChange, and Outbox entry in a single atomic Dexie transaction before returning success.
- **Deliverable & Acceptance Criteria:** Integration test verifying tab kill or crash immediately after save preserves record (T-07).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-04] #48 - Web recordSale.ts (offline: one Dexie tx → sale, lines, stoc..." --label "frontend,usecase,must" --body "### Architectural Scope\nINV-01 Durable Local Save: commits Sale, SaleLines, pending StockChange, and Outbox entry in a single atomic Dexie transaction before returning success.\n\n### Deliverable\nIntegration test verifying tab kill or crash immediately after save preserves record (T-07).\n\nFiles: web/src/features/pos/usecases/recordSale.ts"
  ```

#### Task #49: [VS-3-05] Web cancelSale.ts (owner only, offline pending) *(Orig #61)*
- **Layer:** `Frontend / UseCase` | **Priority:** **Must** | **Files:** `web/src/features/pos/usecases/cancelSale.ts`
- **Architectural Scope:** Client cancellation use case: flags local sale as cancelled, updates local projected stock, and stages cancellation op in outbox.
- **Deliverable & Acceptance Criteria:** Cancel sale use case passes with outbox stage assertions.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-05] #49 - Web cancelSale.ts (owner only, offline pending)..." --label "frontend,usecase,must" --body "### Architectural Scope\nClient cancellation use case: flags local sale as cancelled, updates local projected stock, and stages cancellation op in outbox.\n\n### Deliverable\nCancel sale use case passes with outbox stage assertions.\n\nFiles: web/src/features/pos/usecases/cancelSale.ts"
  ```

#### Task #50: [VS-3-06] Web: Sell screen — search → tap product → quantity chips → payment label → Save (≤10s, ≤3 taps) *(Orig #62)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/pos/SellScreen.tsx`
- **Architectural Scope:** High-velocity cashier till layout achieving sub-10-second checkout flow. Mobile segmented tab toggle between Catalog and Cart.
- **Deliverable & Acceptance Criteria:** Sell screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-06] #50 - Web: Sell screen — search → tap product → quantity chips → p..." --label "frontend,ui,must" --body "### Architectural Scope\nHigh-velocity cashier till layout achieving sub-10-second checkout flow. Mobile segmented tab toggle between Catalog and Cart.\n\n### Deliverable\nSell screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/pos/SellScreen.tsx"
  ```

#### Task #51: [VS-3-07] Web: Cart — line qty unit × price = lineTotal, rounded sum, 'Sell anyway' sheet when exceeding projected stock *(Orig #63)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/pos/CartPanel.tsx`
- **Architectural Scope:** Cart manager calculating line totals, applying half-up santim rounding, and triggering stock warning if cart exceeds available quantity.
- **Deliverable & Acceptance Criteria:** Cart calculations pass rounding tests; shows Sell Anyway alert on oversell.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-07] #51 - Web: Cart — line qty unit × price = lineTotal, rounded sum, ..." --label "frontend,ui,must" --body "### Architectural Scope\nCart manager calculating line totals, applying half-up santim rounding, and triggering stock warning if cart exceeds available quantity.\n\n### Deliverable\nCart calculations pass rounding tests; shows Sell Anyway alert on oversell.\n\nFiles: web/src/features/pos/CartPanel.tsx"
  ```

#### Task #52: [VS-3-08] Web: Payment Selector — segmented control (Cash/Telebirr/Other) *(Orig #64)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/pos/PaymentSelector.tsx`
- **Architectural Scope:** High-contrast 3-button tender label selector (Cash, Telebirr, Other). Label only, zero payment settlement integration.
- **Deliverable & Acceptance Criteria:** Payment selector tested with keyboard navigation and touch feedback.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-08] #52 - Web: Payment Selector — segmented control (Cash/Telebirr/Oth..." --label "frontend,component,must" --body "### Architectural Scope\nHigh-contrast 3-button tender label selector (Cash, Telebirr, Other). Label only, zero payment settlement integration.\n\n### Deliverable\nPayment selector tested with keyboard navigation and touch feedback.\n\nFiles: web/src/features/pos/PaymentSelector.tsx"
  ```

#### Task #53: [VS-3-09] Web: Complete Sale button (54px sticky footer mobile, auto-width desktop) *(Orig #65)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/pos/CheckoutFooter.tsx`
- **Architectural Scope:** Full-width 54px thumb-zone CTA bar on mobile viewports displaying live total and 1-tap checkout trigger.
- **Deliverable & Acceptance Criteria:** Checkout button renders in thumb zone without colliding with OS home bar.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-09] #53 - Web: Complete Sale button (54px sticky footer mobile, auto-w..." --label "frontend,component,must" --body "### Architectural Scope\nFull-width 54px thumb-zone CTA bar on mobile viewports displaying live total and 1-tap checkout trigger.\n\n### Deliverable\nCheckout button renders in thumb zone without colliding with OS home bar.\n\nFiles: web/src/features/pos/CheckoutFooter.tsx"
  ```

#### Task #54: [VS-3-10] Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, quick chips, live total preview) *(Orig #66)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/pos/QuantityKeypadSheet.tsx`
- **Architectural Scope:** Slide-up touch keypad optimized for entering arbitrary decimal weights (e.g. 2.750 kg) with standard increment chips (+0.25, +0.5, +1.0 kg).
- **Deliverable & Acceptance Criteria:** Keypad sheet verified with decimal entry and live total calculation.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-10] #54 - Web: Quantity Keypad Sheet (40vh, numeric/decimal by unit, q..." --label "frontend,ui,must" --body "### Architectural Scope\nSlide-up touch keypad optimized for entering arbitrary decimal weights (e.g. 2.750 kg) with standard increment chips (+0.25, +0.5, +1.0 kg).\n\n### Deliverable\nKeypad sheet verified with decimal entry and live total calculation.\n\nFiles: web/src/features/pos/QuantityKeypadSheet.tsx"
  ```

#### Task #55: [VS-3-11] Web: Sell Anyway Alert Sheet (warns confirmed vs projected, flags for review, destructive button) *(Orig #67)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/pos/SellAnywaySheet.tsx`
- **Architectural Scope:** Explicit confirmation sheet warning cashier that sale exceeds stock, allowing them to proceed while tagging sale for owner review (AT-06).
- **Deliverable & Acceptance Criteria:** Sell Anyway sheet records sale with needs_review flag.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-11] #55 - Web: Sell Anyway Alert Sheet (warns confirmed vs projected, ..." --label "frontend,ui,must" --body "### Architectural Scope\nExplicit confirmation sheet warning cashier that sale exceeds stock, allowing them to proceed while tagging sale for owner review (AT-06).\n\n### Deliverable\nSell Anyway sheet records sale with needs_review flag.\n\nFiles: web/src/features/pos/SellAnywaySheet.tsx"
  ```

#### Task #56: [VS-3-12] Web: Pending confirmation list (online) + 'Awaiting confirmation' badge *(Orig #68)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/pos/PendingSalesList.tsx`
- **Architectural Scope:** Visual list of recent sales displaying 'Awaiting Confirmation' while sync outbox processes the batch.
- **Deliverable & Acceptance Criteria:** Pending badge transitions to Synced once server confirms.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-12] #56 - Web: Pending confirmation list (online) + 'Awaiting confirma..." --label "frontend,ui,must" --body "### Architectural Scope\nVisual list of recent sales displaying 'Awaiting Confirmation' while sync outbox processes the batch.\n\n### Deliverable\nPending badge transitions to Synced once server confirms.\n\nFiles: web/src/features/pos/PendingSalesList.tsx"
  ```

#### Task #57: [VS-3-13] Web: Sale history (localDay EAT grouping, sync state badges) *(Orig #69)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/sales/SaleHistoryScreen.tsx`
- **Architectural Scope:** Sales journal grouping transactions by calendar date in Africa/Addis_Ababa timezone with status badges (Synced, Pending, Review).
- **Deliverable & Acceptance Criteria:** Sale history renders with proper timezone grouping and receipt preview.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-13] #57 - Web: Sale history (localDay EAT grouping, sync state badges)..." --label "frontend,ui,must" --body "### Architectural Scope\nSales journal grouping transactions by calendar date in Africa/Addis_Ababa timezone with status badges (Synced, Pending, Review).\n\n### Deliverable\nSale history renders with proper timezone grouping and receipt preview.\n\nFiles: web/src/features/sales/SaleHistoryScreen.tsx"
  ```

#### Task #58: [VS-3-14] Sale immutability: architecture test — UPDATE/DELETE on sale/stock log/cancellation fails *(Orig #70)*
- **Layer:** `Backend / Test` | **Priority:** **Must** | **Files:** `backend/tests/architecture/test_immutability.py`
- **Architectural Scope:** Automated architectural test proving SQL UPDATE and DELETE statements on sales tables raise database integrity errors.
- **Deliverable & Acceptance Criteria:** Architecture test passes against PostgreSQL database.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-14] #58 - Sale immutability: architecture test — UPDATE/DELETE on sale..." --label "backend,test,must" --body "### Architectural Scope\nAutomated architectural test proving SQL UPDATE and DELETE statements on sales tables raise database integrity errors.\n\n### Deliverable\nArchitecture test passes against PostgreSQL database.\n\nFiles: backend/tests/architecture/test_immutability.py"
  ```

#### Task #59: [VS-3-15] Web: Product quick chips (horizontal scroll, max 6 frequent items) *(Orig #71)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/pos/QuickFavoritesBar.tsx`
- **Architectural Scope:** Top-row 1-tap quick buttons for frequent grocery staples (Sugar, Rice, Oil, Coffee) with 44px touch targets.
- **Deliverable & Acceptance Criteria:** Quick chips add product to cart with a single tap.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-15] #59 - Web: Product quick chips (horizontal scroll, max 6 frequent ..." --label "frontend,component,must" --body "### Architectural Scope\nTop-row 1-tap quick buttons for frequent grocery staples (Sugar, Rice, Oil, Coffee) with 44px touch targets.\n\n### Deliverable\nQuick chips add product to cart with a single tap.\n\nFiles: web/src/features/pos/QuickFavoritesBar.tsx"
  ```

#### Task #60: [VS-3-16] Web: Recent products persisted in meta.recentProducts *(Orig #72)*
- **Layer:** `Frontend / Storage` | **Priority:** **Must** | **Files:** `web/src/data/recent-products.ts`
- **Architectural Scope:** Local storage tracking top 6 cashier-selected items across browser restarts without server network calls.
- **Deliverable & Acceptance Criteria:** Recent items persist in IndexedDB meta table across page refreshes.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-16] #60 - Web: Recent products persisted in meta.recentProducts..." --label "frontend,storage,must" --body "### Architectural Scope\nLocal storage tracking top 6 cashier-selected items across browser restarts without server network calls.\n\n### Deliverable\nRecent items persist in IndexedDB meta table across page refreshes.\n\nFiles: web/src/data/recent-products.ts"
  ```

#### Task #61: [VS-3-17] Offline dashboard (Web): three buckets — Confirmed (SYNCED), Local Pending (WAITING_TO_SYNC/SYNCING), Needs Review (NEEDS_REVIEW + quarantined) — no double counting *(Orig #121)*
- **Layer:** `Frontend / Dashboard` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/useTodayRevenue.ts`
- **Architectural Scope:** Client-side aggregation engine reading Dexie sales tables and grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review).
- **Deliverable & Acceptance Criteria:** Revenue buckets calculate with zero double-counting (AT-13).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-17] #61 - Offline dashboard (Web): three buckets — Confirmed (SYNCED),..." --label "frontend,dashboard,must" --body "### Architectural Scope\nClient-side aggregation engine reading Dexie sales tables and grouping revenue into 3 mutually exclusive buckets (Confirmed, Pending, Review).\n\n### Deliverable\nRevenue buckets calculate with zero double-counting (AT-13).\n\nFiles: web/src/features/dashboard/useTodayRevenue.ts"
  ```

#### Task #62: [VS-3-18] Server dashboard endpoint: GET /reports/dashboard?date= → DashboardReport (confirmed sales, needs-review sales, by payment label, low stock, open cases, quarantined count) *(Orig #122)*
- **Layer:** `Backend / Reports` | **Priority:** **Must** | **Files:** `backend/apps/reporting/dashboard.py`
- **Architectural Scope:** Server SQL aggregation query returning daily financial summary, payment label breakdowns, and open conflict counts.
- **Deliverable & Acceptance Criteria:** Dashboard endpoint returns confirmed revenue and review counts.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-18] #62 - Server dashboard endpoint: GET /reports/dashboard?date= → Da..." --label "backend,reports,must" --body "### Architectural Scope\nServer SQL aggregation query returning daily financial summary, payment label breakdowns, and open conflict counts.\n\n### Deliverable\nDashboard endpoint returns confirmed revenue and review counts.\n\nFiles: backend/apps/reporting/dashboard.py"
  ```

#### Task #63: [VS-3-19] Web: RevenueBucket component — 3 cards (Confirmed=Emerald, Pending=Amber, Review=Crimson) with amount + count *(Orig #124)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/RevenueBucketCards.tsx`
- **Architectural Scope:** Tactile dashboard cards with high-contrast status colors (Emerald, Amber, Crimson) displaying ETB totals and transaction counts.
- **Deliverable & Acceptance Criteria:** Revenue cards match stitch prototype layout and responsive scaling.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-19] #63 - Web: RevenueBucket component — 3 cards (Confirmed=Emerald, P..." --label "frontend,component,must" --body "### Architectural Scope\nTactile dashboard cards with high-contrast status colors (Emerald, Amber, Crimson) displaying ETB totals and transaction counts.\n\n### Deliverable\nRevenue cards match stitch prototype layout and responsive scaling.\n\nFiles: web/src/features/dashboard/RevenueBucketCards.tsx"
  ```

#### Task #64: [VS-3-20] Web: Today screen — date selector (EAT), 3 buckets, valuation (owner), low stock list, quick actions *(Orig #127)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/TodayDashboardScreen.tsx`
- **Architectural Scope:** Central store management dashboard displaying today's financial metrics, inventory valuation, and stock alerts.
- **Deliverable & Acceptance Criteria:** Today screen renders cleanly across mobile (390px) and desktop (1280px).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-20] #64 - Web: Today screen — date selector (EAT), 3 buckets, valuatio..." --label "frontend,ui,must" --body "### Architectural Scope\nCentral store management dashboard displaying today's financial metrics, inventory valuation, and stock alerts.\n\n### Deliverable\nToday screen renders cleanly across mobile (390px) and desktop (1280px).\n\nFiles: web/src/features/dashboard/TodayDashboardScreen.tsx"
  ```

#### Task #65: [VS-3-21] Web: Dashboard density toggle (compact/comfortable table rows) *(Orig #128)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/DensityToggle.tsx`
- **Architectural Scope:** View density switcher allowing users to toggle between compact and comfortable data row spacing.
- **Deliverable & Acceptance Criteria:** Density toggle updates UI layout spacing instantaneously.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-21] #65 - Web: Dashboard density toggle (compact/comfortable table row..." --label "frontend,ui,must" --body "### Architectural Scope\nView density switcher allowing users to toggle between compact and comfortable data row spacing.\n\n### Deliverable\nDensity toggle updates UI layout spacing instantaneously.\n\nFiles: web/src/features/dashboard/DensityToggle.tsx"
  ```

#### Task #66: [VS-3-22] Date handling: Africa/Addis_Ababa timezone, localDay on sales for grouping *(Orig #132)*
- **Layer:** `Shared Domain` | **Priority:** **Must** | **Files:** `web/src/core/time/eat-date.ts, backend/common/time.py`
- **Architectural Scope:** Timezone normalizer mapping UTC timestamps to East Africa Time (UTC+3) calendar dates for sales grouping.
- **Deliverable & Acceptance Criteria:** Date grouping functions pass daylight and boundary tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-22] #66 - Date handling: Africa/Addis_Ababa timezone, localDay on sale..." --label "shared domain,must" --body "### Architectural Scope\nTimezone normalizer mapping UTC timestamps to East Africa Time (UTC+3) calendar dates for sales grouping.\n\n### Deliverable\nDate grouping functions pass daylight and boundary tests.\n\nFiles: web/src/core/time/eat-date.ts, backend/common/time.py"
  ```

#### Task #67: [VS-3-23] Mobile Sell screen: header, search, quick chips, cart, stepper, payment selector, complete sale button *(Orig #181)*
- **Layer:** `Frontend / Polish` | **Priority:** **Must** | **Files:** `web/src/features/pos/SellScreenMobile.tsx`
- **Architectural Scope:** Mobile-optimized cashier POS layout verified with 44px+ touch targets and zero horizontal overflow.
- **Deliverable & Acceptance Criteria:** Mobile POS verified on 375px and 390px viewport viewports.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-23] #67 - Mobile Sell screen: header, search, quick chips, cart, stepp..." --label "frontend,polish,must" --body "### Architectural Scope\nMobile-optimized cashier POS layout verified with 44px+ touch targets and zero horizontal overflow.\n\n### Deliverable\nMobile POS verified on 375px and 390px viewport viewports.\n\nFiles: web/src/features/pos/SellScreenMobile.tsx"
  ```

#### Task #68: [VS-3-24] Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick chips, live total) *(Orig #182)*
- **Layer:** `Frontend / Polish` | **Priority:** **Must** | **Files:** `web/src/features/pos/QuantityKeypadMobile.tsx`
- **Architectural Scope:** Slide-up touch keypad verified for one-handed operation on mobile devices.
- **Deliverable & Acceptance Criteria:** Keypad transitions smoothly with spring physics and zero tap lag.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-24] #68 - Mobile Quantity Keypad Sheet (numeric/decimal by unit, quick..." --label "frontend,polish,must" --body "### Architectural Scope\nSlide-up touch keypad verified for one-handed operation on mobile devices.\n\n### Deliverable\nKeypad transitions smoothly with spring physics and zero tap lag.\n\nFiles: web/src/features/pos/QuantityKeypadMobile.tsx"
  ```

#### Task #69: [VS-3-25] Mobile Sell Anyway Sheet (destructive variant, confirmed vs projected) *(Orig #183)*
- **Layer:** `Frontend / Polish` | **Priority:** **Must** | **Files:** `web/src/features/pos/SellAnywayMobile.tsx`
- **Architectural Scope:** High-contrast warning dialog approving offline overselling on mobile screens.
- **Deliverable & Acceptance Criteria:** Alert dialog conforms to WCAG 2.2 touch-target and contrast rules.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-3-25] #69 - Mobile Sell Anyway Sheet (destructive variant, confirmed vs ..." --label "frontend,polish,must" --body "### Architectural Scope\nHigh-contrast warning dialog approving offline overselling on mobile screens.\n\n### Deliverable\nAlert dialog conforms to WCAG 2.2 touch-target and contrast rules.\n\nFiles: web/src/features/pos/SellAnywayMobile.tsx"
  ```

---

## Vertical Slice 4: Stock Movement Ledger, Offline Sync Engine & AT-06 Arbitration

- **Primary Assignee Track:** **Person 4 (Ledger, Sync & Conflict Lead)**
- **Subsystem Mission:** Full-stack ownership of the append-only stock movement ledger, bidirectional sync push/pull pipeline, idempotency tracking, and the AT-06 conflict arbitration engine.
- **Architectural Invariants:** Append-only StockChange ledger protected by PostgreSQL triggers. Deterministic row locking (ascending product_id) under shop lock. Gap-free ChangeLog sequence allocation. Client Web Lock for single-flight sync. AT-06 conflict case state machine.

### Task Register:

#### Task #70: [VS-4-01] Django StockLevel + StockChange models (composite PK, immutability trigger, underReview flag) *(Orig #43)*
- **Layer:** `Backend / Models` | **Priority:** **Must** | **Files:** `backend/apps/ledger/models.py`
- **Architectural Scope:** Append-only StockChange table and StockLevel projection table with CompositePrimaryKey('shop', 'id'). under_review flag for conflict tracking.
- **Deliverable & Acceptance Criteria:** Ledger models migration running cleanly on PostgreSQL.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-01] #70 - Django StockLevel + StockChange models (composite PK, immuta..." --label "backend,models,must" --body "### Architectural Scope\nAppend-only StockChange table and StockLevel projection table with CompositePrimaryKey('shop', 'id'). under_review flag for conflict tracking.\n\n### Deliverable\nLedger models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/ledger/models.py"
  ```

#### Task #71: [VS-4-02] StockLogService.append(entries, ctx) — locks StockLevel rows, increments version, writes StockChange, allocates serverSeq, returns crossed_below_zero *(Orig #44)*
- **Layer:** `Backend / Service` | **Priority:** **Must** | **Files:** `backend/apps/ledger/services/append.py`
- **Architectural Scope:** Core inventory append engine acquiring row locks in ascending product ID order. Increments projection version and allocates monotonic serverSeq.
- **Deliverable & Acceptance Criteria:** LedgerService passes concurrency tests asserting zero lost updates under load.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-02] #71 - StockLogService.append(entries, ctx) — locks StockLevel rows..." --label "backend,service,must" --body "### Architectural Scope\nCore inventory append engine acquiring row locks in ascending product ID order. Increments projection version and allocates monotonic serverSeq.\n\n### Deliverable\nLedgerService passes concurrency tests asserting zero lost updates under load.\n\nFiles: backend/apps/ledger/services/append.py"
  ```

#### Task #72: [VS-4-03] StockLogQueries: quantity, history, balance_at_version(baseVersion) *(Orig #45)*
- **Layer:** `Backend / Queries` | **Priority:** **Must** | **Files:** `backend/apps/ledger/queries.py`
- **Architectural Scope:** Optimized read queries retrieving current balance, movement history, and historical balance at specific projection versions.
- **Deliverable & Acceptance Criteria:** Query functions pass performance benchmarks on 50,000 movements.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-03] #72 - StockLogQueries: quantity, history, balance_at_version(baseV..." --label "backend,queries,must" --body "### Architectural Scope\nOptimized read queries retrieving current balance, movement history, and historical balance at specific projection versions.\n\n### Deliverable\nQuery functions pass performance benchmarks on 50,000 movements.\n\nFiles: backend/apps/ledger/queries.py"
  ```

#### Task #73: [VS-4-04] Domain event: StockBecameNegative published in-transaction; ConflictService subscribes → opens/extends OFFLINE_OVERSELL case, sets underReview *(Orig #46)*
- **Layer:** `Backend / Events` | **Priority:** **Must** | **Files:** `backend/apps/ledger/events.py, backend/apps/conflicts/subscribers.py`
- **Architectural Scope:** In-transaction domain event trigger: when balance drops below zero, flags StockLevel.under_review = True and opens an AT-06 ConflictCase.
- **Deliverable & Acceptance Criteria:** Integration test asserting oversell opens conflict case in same transaction (AT-06).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-04] #73 - Domain event: StockBecameNegative published in-transaction; ..." --label "backend,events,must" --body "### Architectural Scope\nIn-transaction domain event trigger: when balance drops below zero, flags StockLevel.under_review = True and opens an AT-06 ConflictCase.\n\n### Deliverable\nIntegration test asserting oversell opens conflict case in same transaction (AT-06).\n\nFiles: backend/apps/ledger/events.py, backend/apps/conflicts/subscribers.py"
  ```

#### Task #74: [VS-4-05] Nightly reconcile_stock_log management command (verifies qty = SUM(delta), version = COUNT) *(Orig #47)*
- **Layer:** `Backend / Ops` | **Priority:** **Must** | **Files:** `backend/apps/ledger/management/commands/reconcile_stock_log.py`
- **Architectural Scope:** Automated verification job asserting StockLevel.quantity == SUM(StockChange.delta) across all products in the database.
- **Deliverable & Acceptance Criteria:** Command executes and reports zero discrepancies.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-05] #74 - Nightly reconcile_stock_log management command (verifies qty..." --label "backend,ops,must" --body "### Architectural Scope\nAutomated verification job asserting StockLevel.quantity == SUM(StockChange.delta) across all products in the database.\n\n### Deliverable\nCommand executes and reports zero discrepancies.\n\nFiles: backend/apps/ledger/management/commands/reconcile_stock_log.py"
  ```

#### Task #75: [VS-4-06] Web Dexie schema: stockChanges, stockLevels (projection with confirmedQty, pendingDelta, projectedQty) *(Orig #48)*
- **Layer:** `Frontend / Storage` | **Priority:** **Must** | **Files:** `web/src/data/schema/stock.ts`
- **Architectural Scope:** IndexedDB tables tracking confirmed server movements, confirmed stock levels, and computed local projected balances.
- **Deliverable & Acceptance Criteria:** Dexie schema version 1 initializes and passes table creation tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-06] #75 - Web Dexie schema: stockChanges, stockLevels (projection with..." --label "frontend,storage,must" --body "### Architectural Scope\nIndexedDB tables tracking confirmed server movements, confirmed stock levels, and computed local projected balances.\n\n### Deliverable\nDexie schema version 1 initializes and passes table creation tests.\n\nFiles: web/src/data/schema/stock.ts"
  ```

#### Task #76: [VS-4-07] Web StockLogRepository.appendPending(), recomputeFor(productIds) — projection algorithm (§5.10) *(Orig #49)*
- **Layer:** `Frontend / Data` | **Priority:** **Must** | **Files:** `web/src/data/repositories/StockLogRepository.ts`
- **Architectural Scope:** Client stock projection algorithm: projectedQty = confirmedQty + pendingDelta with zero double-counting of in-flight outbox operations.
- **Deliverable & Acceptance Criteria:** Projection algorithm passes fast-check property tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-07] #76 - Web StockLogRepository.appendPending(), recomputeFor(product..." --label "frontend,data,must" --body "### Architectural Scope\nClient stock projection algorithm: projectedQty = confirmedQty + pendingDelta with zero double-counting of in-flight outbox operations.\n\n### Deliverable\nProjection algorithm passes fast-check property tests.\n\nFiles: web/src/data/repositories/StockLogRepository.ts"
  ```

#### Task #77: [VS-4-08] Web UnitOfWork (Dexie transaction wrapping sale + lines + stock log + outbox) *(Orig #50)*
- **Layer:** `Frontend / Data` | **Priority:** **Must** | **Files:** `web/src/data/UnitOfWork.ts`
- **Architectural Scope:** Client atomic transaction wrapper ensuring multi-table consistency across sales, movements, and outbox tables in Dexie.
- **Deliverable & Acceptance Criteria:** UnitOfWork tests assert rollback on simulated IndexedDB write failure.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-08] #77 - Web UnitOfWork (Dexie transaction wrapping sale + lines + st..." --label "frontend,data,must" --body "### Architectural Scope\nClient atomic transaction wrapper ensuring multi-table consistency across sales, movements, and outbox tables in Dexie.\n\n### Deliverable\nUnitOfWork tests assert rollback on simulated IndexedDB write failure.\n\nFiles: web/src/data/UnitOfWork.ts"
  ```

#### Task #78: [VS-4-09] Web recovery: rebuildProjection(), integrity check (local confirmed = sum of confirmed entries) *(Orig #51)*
- **Layer:** `Frontend / Recovery` | **Priority:** **Must** | **Files:** `web/src/data/recovery.ts`
- **Architectural Scope:** Disaster recovery routine rebuilding local stock projection tables from raw movement records if IndexedDB is interrupted.
- **Deliverable & Acceptance Criteria:** Recovery routine passes state corruption test.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-09] #78 - Web recovery: rebuildProjection(), integrity check (local co..." --label "frontend,recovery,must" --body "### Architectural Scope\nDisaster recovery routine rebuilding local stock projection tables from raw movement records if IndexedDB is interrupted.\n\n### Deliverable\nRecovery routine passes state corruption test.\n\nFiles: web/src/data/recovery.ts"
  ```

#### Task #79: [VS-4-10] Stock history endpoint: GET /products/{id}/stock-changes (role-filtered, paged) *(Orig #52)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/ledger/views.py`
- **Architectural Scope:** Paginated stock movement history endpoint with role-based field filtering (stripping wholesale costs for attendants per NFR-12).
- **Deliverable & Acceptance Criteria:** Endpoint tests verify attendants receive movement counts with cost fields removed.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-10] #79 - Stock history endpoint: GET /products/{id}/stock-changes (ro..." --label "backend,api,must" --body "### Architectural Scope\nPaginated stock movement history endpoint with role-based field filtering (stripping wholesale costs for attendants per NFR-12).\n\n### Deliverable\nEndpoint tests verify attendants receive movement counts with cost fields removed.\n\nFiles: backend/apps/ledger/views.py"
  ```

#### Task #80: [VS-4-11] Web: Stock screen card list (mobile) + DataTable (desktop) with Receive/Adjust/History actions *(Orig #53)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/stock/StockScreen.tsx`
- **Architectural Scope:** Central inventory management view displaying stock balances, low-stock alerts, and action triggers.
- **Deliverable & Acceptance Criteria:** Stock screen verified matching stitch prototype layout and mobile responsiveness.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-11] #80 - Web: Stock screen card list (mobile) + DataTable (desktop) w..." --label "frontend,ui,must" --body "### Architectural Scope\nCentral inventory management view displaying stock balances, low-stock alerts, and action triggers.\n\n### Deliverable\nStock screen verified matching stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/stock/StockScreen.tsx"
  ```

#### Task #81: [VS-4-12] Web: StockLevelDisplay component — confirmed vs projected, low-stock threshold, unit badge *(Orig #54)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/ui/StockLevelDisplay.tsx`
- **Architectural Scope:** Visual badge component displaying confirmed balance alongside pending outbox deltas.
- **Deliverable & Acceptance Criteria:** Badge renders confirmed vs projected numbers with status colors.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-12] #81 - Web: StockLevelDisplay component — confirmed vs projected, l..." --label "frontend,component,must" --body "### Architectural Scope\nVisual badge component displaying confirmed balance alongside pending outbox deltas.\n\n### Deliverable\nBadge renders confirmed vs projected numbers with status colors.\n\nFiles: web/src/ui/StockLevelDisplay.tsx"
  ```

#### Task #82: [VS-4-13] Web: Stock History drawer/sheet (chronological movements with actor, device, resulting balance) *(Orig #55)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/stock/StockHistoryDrawer.tsx`
- **Architectural Scope:** Slide-out movement audit drawer showing chronological SKU event trail, timestamps, and cryptographic hashes.
- **Deliverable & Acceptance Criteria:** Audit drawer renders immutable event history.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-13] #82 - Web: Stock History drawer/sheet (chronological movements wit..." --label "frontend,ui,must" --body "### Architectural Scope\nSlide-out movement audit drawer showing chronological SKU event trail, timestamps, and cryptographic hashes.\n\n### Deliverable\nAudit drawer renders immutable event history.\n\nFiles: web/src/features/stock/StockHistoryDrawer.tsx"
  ```

#### Task #83: [VS-4-14] Web: Receive Stock modal (packaging selector with live '3 crates = 36 pcs' preview) *(Orig #56)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/stock/ReceiveStockModal.tsx`
- **Architectural Scope:** Shipment intake modal supporting bulk packaging selection and live unit piece conversion preview.
- **Deliverable & Acceptance Criteria:** Receive modal calculates unit quantities and updates stock.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-14] #83 - Web: Receive Stock modal (packaging selector with live '3 cr..." --label "frontend,ui,must" --body "### Architectural Scope\nShipment intake modal supporting bulk packaging selection and live unit piece conversion preview.\n\n### Deliverable\nReceive modal calculates unit quantities and updates stock.\n\nFiles: web/src/features/stock/ReceiveStockModal.tsx"
  ```

#### Task #84: [VS-4-15] ReceiveStockHandler (owner): multi-line, atomic, optional packaging per line, cost per unit or per container → updates product costSantim *(Orig #73)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/ledger/handlers/receive_stock.py`
- **Architectural Scope:** Owner shipment intake command: updates stock balances, appends positive ledger movements, and updates product costSantim.
- **Deliverable & Acceptance Criteria:** ReceiveStockHandler passes multi-line atomic shipment tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-15] #84 - ReceiveStockHandler (owner): multi-line, atomic, optional pa..." --label "backend,handlers,must" --body "### Architectural Scope\nOwner shipment intake command: updates stock balances, appends positive ledger movements, and updates product costSantim.\n\n### Deliverable\nReceiveStockHandler passes multi-line atomic shipment tests.\n\nFiles: backend/apps/ledger/handlers/receive_stock.py"
  ```

#### Task #85: [VS-4-16] AdjustStockHandler (owner): ADJUSTMENT entry with reason enum (DAMAGE, LOSS, CORRECTION, OTHER); online rejects negative, offline quarantines *(Orig #74)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/ledger/handlers/adjust_stock.py`
- **Architectural Scope:** Manual stock adjustment service enforcing structured reason codes and mandatory notes for audit compliance.
- **Deliverable & Acceptance Criteria:** AdjustStockHandler passes reason code validation tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-16] #85 - AdjustStockHandler (owner): ADJUSTMENT entry with reason enu..." --label "backend,handlers,must" --body "### Architectural Scope\nManual stock adjustment service enforcing structured reason codes and mandatory notes for audit compliance.\n\n### Deliverable\nAdjustStockHandler passes reason code validation tests.\n\nFiles: backend/apps/ledger/handlers/adjust_stock.py"
  ```

#### Task #86: [VS-4-17] Web: Receive Stock modal (segmented unit selector pc | Crate (12), live preview, optional cost per container) *(Orig #75)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/stock/ReceiveStockForm.tsx`
- **Architectural Scope:** Segmented unit selector allowing cashiers to record deliveries by piece or crate with live cost calculation.
- **Deliverable & Acceptance Criteria:** Form converts carton wholesale cost into base unit cost.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-17] #86 - Web: Receive Stock modal (segmented unit selector pc | Crate..." --label "frontend,ui,must" --body "### Architectural Scope\nSegmented unit selector allowing cashiers to record deliveries by piece or crate with live cost calculation.\n\n### Deliverable\nForm converts carton wholesale cost into base unit cost.\n\nFiles: web/src/features/stock/ReceiveStockForm.tsx"
  ```

#### Task #87: [VS-4-18] Web: Adjust Stock modal (reason picker, quantity input by unit, preview) *(Orig #76)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/stock/AdjustStockModal.tsx`
- **Architectural Scope:** Fast stock adjustment dialog requiring reason selection (Damage, Loss, Count Correction) before saving.
- **Deliverable & Acceptance Criteria:** Modal form enforces mandatory reason code selection.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-18] #87 - Web: Adjust Stock modal (reason picker, quantity input by un..." --label "frontend,ui,must" --body "### Architectural Scope\nFast stock adjustment dialog requiring reason selection (Damage, Loss, Count Correction) before saving.\n\n### Deliverable\nModal form enforces mandatory reason code selection.\n\nFiles: web/src/features/stock/AdjustStockModal.tsx"
  ```

#### Task #88: [VS-4-19] Stock log entries carry packaging snapshot (label, count, baseQtyMilli) for history render *(Orig #77)*
- **Layer:** `Shared Domain` | **Priority:** **Must** | **Files:** `backend/apps/ledger/models.py, web/src/data/schema/stock.ts`
- **Architectural Scope:** Movement schema preserving packaging metadata (e.g. 'Received 3 crates') for historical audit display.
- **Deliverable & Acceptance Criteria:** Movement entries preserve packaging snapshots in ledger history.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-19] #88 - Stock log entries carry packaging snapshot (label, count, ba..." --label "shared domain,must" --body "### Architectural Scope\nMovement schema preserving packaging metadata (e.g. 'Received 3 crates') for historical audit display.\n\n### Deliverable\nMovement entries preserve packaging snapshots in ledger history.\n\nFiles: backend/apps/ledger/models.py, web/src/data/schema/stock.ts"
  ```

#### Task #89: [VS-4-20] Web: Adjust reason enum with mandatory note for OTHER *(Orig #78)*
- **Layer:** `Frontend / Form` | **Priority:** **Must** | **Files:** `web/src/features/stock/adjust-schema.ts`
- **Architectural Scope:** Form validation rule requiring explanatory text when the OTHER adjustment reason is selected.
- **Deliverable & Acceptance Criteria:** Zod schema rejects OTHER reason without accompanying note.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-20] #89 - Web: Adjust reason enum with mandatory note for OTHER..." --label "frontend,form,must" --body "### Architectural Scope\nForm validation rule requiring explanatory text when the OTHER adjustment reason is selected.\n\n### Deliverable\nZod schema rejects OTHER reason without accompanying note.\n\nFiles: web/src/features/stock/adjust-schema.ts"
  ```

#### Task #90: [VS-4-21] Web: Receive cost per container → converts to cost per base unit with half-up rounding *(Orig #79)*
- **Layer:** `Frontend / Math` | **Priority:** **Must** | **Files:** `web/src/core/domain/container-cost.ts`
- **Architectural Scope:** Client math utility dividing wholesale container cost into base unit santim with half-up rounding.
- **Deliverable & Acceptance Criteria:** Container cost calculations pass vector tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-21] #90 - Web: Receive cost per container → converts to cost per base ..." --label "frontend,math,must" --body "### Architectural Scope\nClient math utility dividing wholesale container cost into base unit santim with half-up rounding.\n\n### Deliverable\nContainer cost calculations pass vector tests.\n\nFiles: web/src/core/domain/container-cost.ts"
  ```

#### Task #91: [VS-4-22] Web: Stock screen quick actions bar (Receive/Adjust/Export) *(Orig #80)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/stock/StockActionsBar.tsx`
- **Architectural Scope:** Action bar at the top of the inventory screen providing 1-tap shortcuts to receive stock, adjust stock, or export ledger.
- **Deliverable & Acceptance Criteria:** Actions bar matches stitch prototype layout.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-22] #91 - Web: Stock screen quick actions bar (Receive/Adjust/Export)..." --label "frontend,component,must" --body "### Architectural Scope\nAction bar at the top of the inventory screen providing 1-tap shortcuts to receive stock, adjust stock, or export ledger.\n\n### Deliverable\nActions bar matches stitch prototype layout.\n\nFiles: web/src/features/stock/StockActionsBar.tsx"
  ```

#### Task #92: [VS-4-23] Web: Low stock threshold display on product cards *(Orig #81)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/stock/LowStockBadge.tsx`
- **Architectural Scope:** Warning badge tag displayed on product cards when stock drops below configured low-stock threshold.
- **Deliverable & Acceptance Criteria:** Badge displays amber warning when current stock <= threshold.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-23] #92 - Web: Low stock threshold display on product cards..." --label "frontend,component,must" --body "### Architectural Scope\nWarning badge tag displayed on product cards when stock drops below configured low-stock threshold.\n\n### Deliverable\nBadge displays amber warning when current stock <= threshold.\n\nFiles: web/src/features/stock/LowStockBadge.tsx"
  ```

#### Task #93: [VS-4-24] Web: Stock summary cards (Total SKUs, Low Stock Count) *(Orig #82)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/stock/StockSummaryCards.tsx`
- **Architectural Scope:** Summary metric cards displaying active SKU count, total items, and low-stock alert count.
- **Deliverable & Acceptance Criteria:** Summary cards render accurately from local Dexie data.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-24] #93 - Web: Stock summary cards (Total SKUs, Low Stock Count)..." --label "frontend,component,must" --body "### Architectural Scope\nSummary metric cards displaying active SKU count, total items, and low-stock alert count.\n\n### Deliverable\nSummary cards render accurately from local Dexie data.\n\nFiles: web/src/features/stock/StockSummaryCards.tsx"
  ```

#### Task #94: [VS-4-25] PushService: per-op transaction, shop lock → product locks (ascending ID), re-check ProcessedOperation *(Orig #83)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/services/push.py`
- **Architectural Scope:** Server push engine acquiring shop lock followed by product locks in deterministic ascending ID order to prevent deadlocks.
- **Deliverable & Acceptance Criteria:** PushService passes deadlock stress tests under concurrent multi-device push.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-25] #94 - PushService: per-op transaction, shop lock → product locks (..." --label "backend,sync,must" --body "### Architectural Scope\nServer push engine acquiring shop lock followed by product locks in deterministic ascending ID order to prevent deadlocks.\n\n### Deliverable\nPushService passes deadlock stress tests under concurrent multi-device push.\n\nFiles: backend/apps/sync/services/push.py"
  ```

#### Task #95: [VS-4-26] Idempotency: ProcessedOperation table (opId, payloadHash, outcome, resultJson); same hash = stored result; different hash = IDEMPOTENCY_KEY_REUSE *(Orig #84)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/models/processed_op.py`
- **Architectural Scope:** PostgreSQL idempotency tracking table caching operation results. Replays stored result on duplicate opId; rejects key reuse on payload mismatch.
- **Deliverable & Acceptance Criteria:** Idempotency tests verify duplicate opId returns identical response (AT-04).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-26] #95 - Idempotency: ProcessedOperation table (opId, payloadHash, ou..." --label "backend,sync,must" --body "### Architectural Scope\nPostgreSQL idempotency tracking table caching operation results. Replays stored result on duplicate opId; rejects key reuse on payload mismatch.\n\n### Deliverable\nIdempotency tests verify duplicate opId returns identical response (AT-04).\n\nFiles: backend/apps/sync/models/processed_op.py"
  ```

#### Task #96: [VS-4-27] OperationDispatcher registry (built in config/container.py): maps OperationType → (payload parser, handler); architecture test asserts completeness *(Orig #85)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/dispatcher.py`
- **Architectural Scope:** Type-safe operation registry routing incoming sync operations (RECORD_SALE, RECEIVE_STOCK, ADJUST_STOCK) to appropriate domain handlers.
- **Deliverable & Acceptance Criteria:** Architecture test asserts 100% operation type coverage in dispatcher.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-27] #96 - OperationDispatcher registry (built in config/container.py):..." --label "backend,sync,must" --body "### Architectural Scope\nType-safe operation registry routing incoming sync operations (RECORD_SALE, RECEIVE_STOCK, ADJUST_STOCK) to appropriate domain handlers.\n\n### Deliverable\nArchitecture test asserts 100% operation type coverage in dispatcher.\n\nFiles: backend/apps/sync/dispatcher.py"
  ```

#### Task #97: [VS-4-28] Payload hash: RFC 8785 canonical JSON of {type, payload} → SHA-256 → base64url; shared vectors in contract/fixtures/payload-hash-vectors.json *(Orig #86)*
- **Layer:** `Shared Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/canonical_json.py, web/src/sync/canonical_json.ts`
- **Architectural Scope:** RFC 8785 canonical JSON serializer generating identical SHA-256 base64url hashes across Python and TypeScript.
- **Deliverable & Acceptance Criteria:** Both implementations pass shared payload-hash-vectors.json tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-28] #97 - Payload hash: RFC 8785 canonical JSON of {type, payload} → S..." --label "shared sync,must" --body "### Architectural Scope\nRFC 8785 canonical JSON serializer generating identical SHA-256 base64url hashes across Python and TypeScript.\n\n### Deliverable\nBoth implementations pass shared payload-hash-vectors.json tests.\n\nFiles: backend/apps/sync/canonical_json.py, web/src/sync/canonical_json.ts"
  ```

#### Task #98: [VS-4-29] dependsOn resolution: dependent op gets REJECTED_DEPENDENCY or quarantined into same case *(Orig #87)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/dependency_resolver.py`
- **Architectural Scope:** Batch dependency resolver ensuring operations referencing prior operations within the same batch execute in causal order.
- **Deliverable & Acceptance Criteria:** Dependency resolver handles dependent operation failures gracefully.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-29] #98 - dependsOn resolution: dependent op gets REJECTED_DEPENDENCY ..." --label "backend,sync,must" --body "### Architectural Scope\nBatch dependency resolver ensuring operations referencing prior operations within the same batch execute in causal order.\n\n### Deliverable\nDependency resolver handles dependent operation failures gracefully.\n\nFiles: backend/apps/sync/dependency_resolver.py"
  ```

#### Task #99: [VS-4-30] Lease validation at receipt time: membership ACTIVE, lease valid, device matches, op type allowed, clientCreatedAt in window ±5min *(Orig #88)*
- **Layer:** `Backend / Security` | **Priority:** **Must** | **Files:** `backend/apps/sync/lease_validator.py`
- **Architectural Scope:** Server sync gate verifying device lease validity, temporal sync window, and operation permissions before execution.
- **Deliverable & Acceptance Criteria:** Lease validation tests verify expired leases are rejected.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-30] #99 - Lease validation at receipt time: membership ACTIVE, lease v..." --label "backend,security,must" --body "### Architectural Scope\nServer sync gate verifying device lease validity, temporal sync window, and operation permissions before execution.\n\n### Deliverable\nLease validation tests verify expired leases are rejected.\n\nFiles: backend/apps/sync/lease_validator.py"
  ```

#### Task #100: [VS-4-31] Quarantine path: stores full payload, QUARANTINED outcome, AUTHORIZATION_REVIEW case, no stock log effect *(Orig #89)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/quarantine.py`
- **Architectural Scope:** Quarantine storage isolating unauthorized or suspicious operations without applying any mutations to the stock ledger.
- **Deliverable & Acceptance Criteria:** Quarantine tests assert quarantined operation produces zero ledger entries.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-31] #100 - Quarantine path: stores full payload, QUARANTINED outcome, A..." --label "backend,sync,must" --body "### Architectural Scope\nQuarantine storage isolating unauthorized or suspicious operations without applying any mutations to the stock ledger.\n\n### Deliverable\nQuarantine tests assert quarantined operation produces zero ledger entries.\n\nFiles: backend/apps/sync/quarantine.py"
  ```

#### Task #101: [VS-4-32] Outcome matrix implementation (§6.8 table) for all operation types × situations *(Orig #90)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/outcome_matrix.py`
- **Architectural Scope:** Implementation of SDD §6.8 outcome matrix covering all operation types across active, oversold, and deactivated device states.
- **Deliverable & Acceptance Criteria:** Comprehensive test suite covering all outcome matrix scenarios.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-32] #101 - Outcome matrix implementation (§6.8 table) for all operation..." --label "backend,sync,must" --body "### Architectural Scope\nImplementation of SDD §6.8 outcome matrix covering all operation types across active, oversold, and deactivated device states.\n\n### Deliverable\nComprehensive test suite covering all outcome matrix scenarios.\n\nFiles: backend/apps/sync/outcome_matrix.py"
  ```

#### Task #102: [VS-4-33] ChangeLog allocation under shop lock: shop.syncSeq += 1 per touched entity; written to ChangeLog + StockChange.serverSeq + Product.updatedSeq *(Orig #91)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/change_log.py`
- **Architectural Scope:** Monotonic sequence number generator allocating gap-free sequence IDs per shop under the shop row lock.
- **Deliverable & Acceptance Criteria:** ChangeLog sequence tests assert strictly increasing gap-free numbering.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-33] #102 - ChangeLog allocation under shop lock: shop.syncSeq += 1 per ..." --label "backend,sync,must" --body "### Architectural Scope\nMonotonic sequence number generator allocating gap-free sequence IDs per shop under the shop row lock.\n\n### Deliverable\nChangeLog sequence tests assert strictly increasing gap-free numbering.\n\nFiles: backend/apps/sync/change_log.py"
  ```

#### Task #103: [VS-4-34] Push response: per-op OperationResult with entries, stockAfter, conflictCaseId, reasonCode, replayed, noop *(Orig #92)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/sync/serializers.py`
- **Architectural Scope:** Structured push response contract detailing exact outcome, confirmed server sequence, and resulting stock balance for each operation.
- **Deliverable & Acceptance Criteria:** Push response schema validated against OpenAPI contract.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-34] #103 - Push response: per-op OperationResult with entries, stockAft..." --label "backend,api,must" --body "### Architectural Scope\nStructured push response contract detailing exact outcome, confirmed server sequence, and resulting stock balance for each operation.\n\n### Deliverable\nPush response schema validated against OpenAPI contract.\n\nFiles: backend/apps/sync/serializers.py"
  ```

#### Task #104: [VS-4-35] Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; retry same opId on transport failure; poison guard (8 failures → ATTENTION_REQUIRED) *(Orig #93)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/push-stage.ts`
- **Architectural Scope:** Client outbox dispatcher packaging batches of up to 50 operations in deviceSeq order. Poison pill guard flags unprocessable operations.
- **Deliverable & Acceptance Criteria:** Push stage tests verify batch transmission and poison pill quarantine.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-35] #104 - Web push stage: batch ≤50 ops, ≤200KB, ascending deviceSeq; ..." --label "frontend,sync,must" --body "### Architectural Scope\nClient outbox dispatcher packaging batches of up to 50 operations in deviceSeq order. Poison pill guard flags unprocessable operations.\n\n### Deliverable\nPush stage tests verify batch transmission and poison pill quarantine.\n\nFiles: web/src/sync/push-stage.ts"
  ```

#### Task #105: [VS-4-36] Web backoff: exponential (base 2s, factor 2, cap 5min, full jitter) *(Orig #94)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/backoff.ts`
- **Architectural Scope:** Network retry algorithm using exponential backoff with full jitter to avoid thundering herd server overload when connectivity returns.
- **Deliverable & Acceptance Criteria:** Backoff tests verify delay bounds and randomized jitter.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-36] #105 - Web backoff: exponential (base 2s, factor 2, cap 5min, full ..." --label "frontend,sync,must" --body "### Architectural Scope\nNetwork retry algorithm using exponential backoff with full jitter to avoid thundering herd server overload when connectivity returns.\n\n### Deliverable\nBackoff tests verify delay bounds and randomized jitter.\n\nFiles: web/src/sync/backoff.ts"
  ```

#### Task #106: [VS-4-37] Web: Sync Engine single-flight Web Lock (stokari-sync-{shopId}) for multi-tab safety *(Orig #95)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/web-lock.ts`
- **Architectural Scope:** Single-leader election using Web Locks API (navigator.locks.request) ensuring only one browser tab syncs at a time.
- **Deliverable & Acceptance Criteria:** Multi-tab simulation test verifies only one tab acquires sync lock.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-37] #106 - Web: Sync Engine single-flight Web Lock (stokari-sync-{shopI..." --label "frontend,sync,must" --body "### Architectural Scope\nSingle-leader election using Web Locks API (navigator.locks.request) ensuring only one browser tab syncs at a time.\n\n### Deliverable\nMulti-tab simulation test verifies only one tab acquires sync lock.\n\nFiles: web/src/sync/web-lock.ts"
  ```

#### Task #107: [VS-4-38] Web: Result Applier — updates Dexie rows in one atomic transaction (§5.10) *(Orig #96)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/result-applier.ts`
- **Architectural Scope:** Client sync consumer updating local Dexie records with confirmed server IDs, clearing outbox rows, and updating projection balances.
- **Deliverable & Acceptance Criteria:** Result applier passes atomic Dexie update tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-38] #107 - Web: Result Applier — updates Dexie rows in one atomic trans..." --label "frontend,sync,must" --body "### Architectural Scope\nClient sync consumer updating local Dexie records with confirmed server IDs, clearing outbox rows, and updating projection balances.\n\n### Deliverable\nResult applier passes atomic Dexie update tests.\n\nFiles: web/src/sync/result-applier.ts"
  ```

#### Task #108: [VS-4-39] PullService: GET /v1/sync/pull?cursor=N&limit=200 → next limit ChangeLog rows → load current entities (role-filtered) → return nextCursor, hasMore, headSeq, serverTime *(Orig #97)*
- **Layer:** `Backend / Sync` | **Priority:** **Must** | **Files:** `backend/apps/sync/services/pull.py`
- **Architectural Scope:** Cursor-based delta synchronization service loading modified entities since cursor N, filtered by caller role.
- **Deliverable & Acceptance Criteria:** PullService integration tests verify delta pagination and headSeq tracking.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-39] #108 - PullService: GET /v1/sync/pull?cursor=N&limit=200 → next lim..." --label "backend,sync,must" --body "### Architectural Scope\nCursor-based delta synchronization service loading modified entities since cursor N, filtered by caller role.\n\n### Deliverable\nPullService integration tests verify delta pagination and headSeq tracking.\n\nFiles: backend/apps/sync/services/pull.py"
  ```

#### Task #109: [VS-4-40] Pull response: products, stockChanges, stockLevels, sales, saleCancellations, actors, conflicts (owner only) *(Orig #98)*
- **Layer:** `Backend / API` | **Priority:** **Must** | **Files:** `backend/apps/sync/views.py`
- **Architectural Scope:** Complete pull DTO contract returning delta arrays for products, ledger movements, sales, and conflicts.
- **Deliverable & Acceptance Criteria:** Pull endpoint verified with role-based field stripping.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-40] #109 - Pull response: products, stockChanges, stockLevels, sales, s..." --label "backend,api,must" --body "### Architectural Scope\nComplete pull DTO contract returning delta arrays for products, ledger movements, sales, and conflicts.\n\n### Deliverable\nPull endpoint verified with role-based field stripping.\n\nFiles: backend/apps/sync/views.py"
  ```

#### Task #110: [VS-4-41] Web pull stage: ONE Dexie tx — upsert by id, apply stockLevels only if version > confirmedVersion, recompute pendingDelta, update pullCursor *(Orig #99)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/pull-stage.ts`
- **Architectural Scope:** Client pull consumer updating local IndexedDB cache in a single atomic transaction without overwriting pending local operations.
- **Deliverable & Acceptance Criteria:** Pull stage integration test passes asserting cursor advancement.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-41] #110 - Web pull stage: ONE Dexie tx — upsert by id, apply stockLeve..." --label "frontend,sync,must" --body "### Architectural Scope\nClient pull consumer updating local IndexedDB cache in a single atomic transaction without overwriting pending local operations.\n\n### Deliverable\nPull stage integration test passes asserting cursor advancement.\n\nFiles: web/src/sync/pull-stage.ts"
  ```

#### Task #111: [VS-4-42] New-device bootstrap: cursor=0 → pull pages until hasMore=false → integrity check → ready *(Orig #100)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/bootstrap.ts`
- **Architectural Scope:** Initial device hydration loading entire store catalog and confirmed stock levels onto a clean device.
- **Deliverable & Acceptance Criteria:** Bootstrap routine hydrates 2,000 products cleanly.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-42] #111 - New-device bootstrap: cursor=0 → pull pages until hasMore=fa..." --label "frontend,sync,must" --body "### Architectural Scope\nInitial device hydration loading entire store catalog and confirmed stock levels onto a clean device.\n\n### Deliverable\nBootstrap routine hydrates 2,000 products cleanly.\n\nFiles: web/src/sync/bootstrap.ts"
  ```

#### Task #112: [VS-4-43] CURSOR_RESET handling: restart from 0 without touching outbox *(Orig #101)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/cursor-reset.ts`
- **Architectural Scope:** Recovery protocol recovering from expired server cursors by restarting pull from 0 without touching pending outbox records.
- **Deliverable & Acceptance Criteria:** Cursor reset test asserts pending outbox operations preserved.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-43] #112 - CURSOR_RESET handling: restart from 0 without touching outbo..." --label "frontend,sync,must" --body "### Architectural Scope\nRecovery protocol recovering from expired server cursors by restarting pull from 0 without touching pending outbox records.\n\n### Deliverable\nCursor reset test asserts pending outbox operations preserved.\n\nFiles: web/src/sync/cursor-reset.ts"
  ```

#### Task #113: [VS-4-44] Health probe: GET /health (2s timeout, no DB heavy work); used for online/offline decision, warm-up *(Orig #102)*
- **Layer:** `Backend / Health` | **Priority:** **Must** | **Files:** `backend/backend/views.py`
- **Architectural Scope:** Lightweight health probe returning server timestamp for client clock-skew detection.
- **Deliverable & Acceptance Criteria:** Health probe returns 200 OK in < 10ms.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-44] #113 - Health probe: GET /health (2s timeout, no DB heavy work); us..." --label "backend,health,must" --body "### Architectural Scope\nLightweight health probe returning server timestamp for client clock-skew detection.\n\n### Deliverable\nHealth probe returns 200 OK in < 10ms.\n\nFiles: backend/backend/views.py"
  ```

#### Task #114: [VS-4-45] Web: Sync trigger schedule (app open, online event, tab visible, debounced 500ms, timer 30s) *(Orig #103)*
- **Layer:** `Frontend / Sync` | **Priority:** **Must** | **Files:** `web/src/sync/sync-coordinator.ts`
- **Architectural Scope:** Event-driven sync coordinator triggering on app launch, network online event, tab visibility, and periodic 30s timer.
- **Deliverable & Acceptance Criteria:** Coordinator triggers sync on network reconnect.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-45] #114 - Web: Sync trigger schedule (app open, online event, tab visi..." --label "frontend,sync,must" --body "### Architectural Scope\nEvent-driven sync coordinator triggering on app launch, network online event, tab visibility, and periodic 30s timer.\n\n### Deliverable\nCoordinator triggers sync on network reconnect.\n\nFiles: web/src/sync/sync-coordinator.ts"
  ```

#### Task #115: [VS-4-46] Web: SyncPill in header with popover (last sync, outbox count, storage, persistent status, 'Sync Now') *(Orig #104)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/ui/SyncPill.tsx`
- **Architectural Scope:** Interactive header badge displaying 4 sync states (Synced, Syncing, Offline, Conflict) with detail popover.
- **Deliverable & Acceptance Criteria:** SyncPill verified matching stitch prototype styling and interactive popover.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-46] #115 - Web: SyncPill in header with popover (last sync, outbox coun..." --label "frontend,ui,must" --body "### Architectural Scope\nInteractive header badge displaying 4 sync states (Synced, Syncing, Offline, Conflict) with detail popover.\n\n### Deliverable\nSyncPill verified matching stitch prototype styling and interactive popover.\n\nFiles: web/src/ui/SyncPill.tsx"
  ```

#### Task #116: [VS-4-47] ConflictCase model: type, productId, status, version, stateSnapshot, items[], quarantined[], resolution, resolvedBy *(Orig #105)*
- **Layer:** `Backend / Models` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/models.py`
- **Architectural Scope:** ConflictCase table with optimistic locking version, conflicting sale line references, and audit resolution snapshots.
- **Deliverable & Acceptance Criteria:** Conflict models migration running cleanly on PostgreSQL.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-47] #116 - ConflictCase model: type, productId, status, version, stateS..." --label "backend,models,must" --body "### Architectural Scope\nConflictCase table with optimistic locking version, conflicting sale line references, and audit resolution snapshots.\n\n### Deliverable\nConflict models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/conflicts/models.py"
  ```

#### Task #117: [VS-4-48] ConflictService: opens/extends cases on StockBecameNegative, PRODUCT_INACTIVE, CANCELLATION_CONFLICT, INVALID_STOCK_OPERATION *(Orig #106)*
- **Layer:** `Backend / Conflicts` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/services.py`
- **Architectural Scope:** Conflict engine grouping concurrent oversell events on the same product into a single open conflict case.
- **Deliverable & Acceptance Criteria:** ConflictService groups multiple oversell events into single case (AT-06).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-48] #117 - ConflictService: opens/extends cases on StockBecameNegative,..." --label "backend,conflicts,must" --body "### Architectural Scope\nConflict engine grouping concurrent oversell events on the same product into a single open conflict case.\n\n### Deliverable\nConflictService groups multiple oversell events into single case (AT-06).\n\nFiles: backend/apps/conflicts/services.py"
  ```

#### Task #118: [VS-4-49] ResolveConflictHandler (owner): validates caseVersion, applies RECONCILE_STOCK / CANCEL_SALE / ACKNOWLEDGE via StockLogService, closes case, clears underReview *(Orig #107)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/handlers/resolve.py`
- **Architectural Scope:** Owner resolution service executing corrective ledger movements, closing the conflict case, and clearing product under_review flag.
- **Deliverable & Acceptance Criteria:** ResolveConflictHandler closes case and clears underReview (AT-06).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-49] #118 - ResolveConflictHandler (owner): validates caseVersion, appli..." --label "backend,handlers,must" --body "### Architectural Scope\nOwner resolution service executing corrective ledger movements, closing the conflict case, and clearing product under_review flag.\n\n### Deliverable\nResolveConflictHandler closes case and clears underReview (AT-06).\n\nFiles: backend/apps/conflicts/handlers/resolve.py"
  ```

#### Task #119: [VS-4-50] Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STALE_RESOLUTION event, case stays OPEN *(Orig #108)*
- **Layer:** `Backend / Conflicts` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/handlers/stale_resolution.py`
- **Architectural Scope:** Optimistic concurrency guard preventing conflicting owner resolutions if new concurrent sales occurred while reviewing.
- **Deliverable & Acceptance Criteria:** Stale resolution test asserts case remains OPEN on version conflict.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-50] #119 - Stale resolution: caseVersion mismatch → NEEDS_REVIEW + STAL..." --label "backend,conflicts,must" --body "### Architectural Scope\nOptimistic concurrency guard preventing conflicting owner resolutions if new concurrent sales occurred while reviewing.\n\n### Deliverable\nStale resolution test asserts case remains OPEN on version conflict.\n\nFiles: backend/apps/conflicts/handlers/stale_resolution.py"
  ```

#### Task #120: [VS-4-51] ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs original handler as original actor, returns inner[] per-op results) / REJECT_QUARANTINED *(Orig #109)*
- **Layer:** `Backend / Handlers` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/handlers/quarantine.py`
- **Architectural Scope:** Quarantine review service executing late operations retrospectively or permanently rejecting them with an audit reason.
- **Deliverable & Acceptance Criteria:** Quarantine review handler executes accepted operations.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-51] #120 - ReviewQuarantineHandler (owner): ACCEPT_QUARANTINED (re-runs..." --label "backend,handlers,must" --body "### Architectural Scope\nQuarantine review service executing late operations retrospectively or permanently rejecting them with an audit reason.\n\n### Deliverable\nQuarantine review handler executes accepted operations.\n\nFiles: backend/apps/conflicts/handlers/quarantine.py"
  ```

#### Task #121: [VS-4-52] Web: Review queue (owner) — card list (mobile) + split-pane (desktop) with case list + detail drawer *(Orig #110)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/ConflictReviewScreen.tsx`
- **Architectural Scope:** Owner arbitration dashboard displaying active conflict queue with parallel cashier timelines.
- **Deliverable & Acceptance Criteria:** Conflict review screen matches stitch prototype layout and mobile responsiveness.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-52] #121 - Web: Review queue (owner) — card list (mobile) + split-pane ..." --label "frontend,ui,must" --body "### Architectural Scope\nOwner arbitration dashboard displaying active conflict queue with parallel cashier timelines.\n\n### Deliverable\nConflict review screen matches stitch prototype layout and mobile responsiveness.\n\nFiles: web/src/features/conflicts/ConflictReviewScreen.tsx"
  ```

#### Task #122: [VS-4-53] Web: Conflict case card — type badge, product, current balance, timeline preview (last 3 events) *(Orig #111)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/ConflictCaseCard.tsx`
- **Architectural Scope:** Card component displaying product, negative balance amount, and conflicting cashiers.
- **Deliverable & Acceptance Criteria:** Conflict card renders with appropriate severity badges.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-53] #122 - Web: Conflict case card — type badge, product, current balan..." --label "frontend,component,must" --body "### Architectural Scope\nCard component displaying product, negative balance amount, and conflicting cashiers.\n\n### Deliverable\nConflict card renders with appropriate severity badges.\n\nFiles: web/src/features/conflicts/ConflictCaseCard.tsx"
  ```

#### Task #123: [VS-4-54] Web: Conflict case detail drawer — discrepancy alert, concurrent timeline, 3 resolution actions *(Orig #112)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/ConflictDetailDrawer.tsx`
- **Architectural Scope:** Parallel timeline comparison view showing Register 1 Hana vs Register 2 Dawit concurrent sales with deficit summary.
- **Deliverable & Acceptance Criteria:** Detail drawer renders concurrent timeline and resolution buttons.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-54] #123 - Web: Conflict case detail drawer — discrepancy alert, concur..." --label "frontend,ui,must" --body "### Architectural Scope\nParallel timeline comparison view showing Register 1 Hana vs Register 2 Dawit concurrent sales with deficit summary.\n\n### Deliverable\nDetail drawer renders concurrent timeline and resolution buttons.\n\nFiles: web/src/features/conflicts/ConflictDetailDrawer.tsx"
  ```

#### Task #124: [VS-4-55] Web: Resolution actions — Record Restock (qty + note), Cancel Sale (select + reason), Acknowledge Deficit *(Orig #113)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/ResolutionActionModals.tsx`
- **Architectural Scope:** 3 functional owner resolution action dialogs executing atomic corrective actions.
- **Deliverable & Acceptance Criteria:** Action modals execute respective conflict resolution endpoints.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-55] #124 - Web: Resolution actions — Record Restock (qty + note), Cance..." --label "frontend,ui,must" --body "### Architectural Scope\n3 functional owner resolution action dialogs executing atomic corrective actions.\n\n### Deliverable\nAction modals execute respective conflict resolution endpoints.\n\nFiles: web/src/features/conflicts/ResolutionActionModals.tsx"
  ```

#### Task #125: [VS-4-56] Web: Quarantined operations tab — table with Accept/Reject per operation or bulk per device *(Orig #114)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/QuarantinedOperationsTab.tsx`
- **Architectural Scope:** Inspection table displaying operations sent by deactivated cashier devices with Accept/Reject actions.
- **Deliverable & Acceptance Criteria:** Quarantined tab renders with audit reason inputs.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-56] #125 - Web: Quarantined operations tab — table with Accept/Reject p..." --label "frontend,ui,must" --body "### Architectural Scope\nInspection table displaying operations sent by deactivated cashier devices with Accept/Reject actions.\n\n### Deliverable\nQuarantined tab renders with audit reason inputs.\n\nFiles: web/src/features/conflicts/QuarantinedOperationsTab.tsx"
  ```

#### Task #126: [VS-4-57] Web: Quarantine Accept → re-runs handler, shows per-op results in inner[] *(Orig #115)*
- **Layer:** `Frontend / UseCase` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/usecases/acceptQuarantine.ts`
- **Architectural Scope:** Client action triggering server re-execution of quarantined operation.
- **Deliverable & Acceptance Criteria:** Accept quarantine updates local state with confirmed sale.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-57] #126 - Web: Quarantine Accept → re-runs handler, shows per-op resul..." --label "frontend,usecase,must" --body "### Architectural Scope\nClient action triggering server re-execution of quarantined operation.\n\n### Deliverable\nAccept quarantine updates local state with confirmed sale.\n\nFiles: web/src/features/conflicts/usecases/acceptQuarantine.ts"
  ```

#### Task #127: [VS-4-58] Web: Quarantine Reject → archives with reason, never deletes *(Orig #116)*
- **Layer:** `Frontend / UseCase` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/usecases/rejectQuarantine.ts`
- **Architectural Scope:** Client action archiving quarantined operation with permanent audit note.
- **Deliverable & Acceptance Criteria:** Reject quarantine archives record without deleting.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-58] #127 - Web: Quarantine Reject → archives with reason, never deletes..." --label "frontend,usecase,must" --body "### Architectural Scope\nClient action archiving quarantined operation with permanent audit note.\n\n### Deliverable\nReject quarantine archives record without deleting.\n\nFiles: web/src/features/conflicts/usecases/rejectQuarantine.ts"
  ```

#### Task #128: [VS-4-59] Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDING → owner in-app + GET /notifications *(Orig #117)*
- **Layer:** `Shared Domain` | **Priority:** **Must** | **Files:** `backend/apps/conflicts/notifications.py, web/src/features/notifications/NotificationDrawer.tsx`
- **Architectural Scope:** In-app notification system alerting owner to overselling events and quarantine items.
- **Deliverable & Acceptance Criteria:** Notification drawer renders unread conflict alerts.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-59] #128 - Notifications: CASE_OPENED, CASE_EXTENDED, QUARANTINE_PENDIN..." --label "shared domain,must" --body "### Architectural Scope\nIn-app notification system alerting owner to overselling events and quarantine items.\n\n### Deliverable\nNotification drawer renders unread conflict alerts.\n\nFiles: backend/apps/conflicts/notifications.py, web/src/features/notifications/NotificationDrawer.tsx"
  ```

#### Task #129: [VS-4-60] Web: Notifications screen (list + mark read) *(Orig #118)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/notifications/NotificationScreen.tsx`
- **Architectural Scope:** Notification view listing store alerts with 1-tap mark read actions.
- **Deliverable & Acceptance Criteria:** Notification screen marks items read and updates badge.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-60] #129 - Web: Notifications screen (list + mark read)..." --label "frontend,ui,must" --body "### Architectural Scope\nNotification view listing store alerts with 1-tap mark read actions.\n\n### Deliverable\nNotification screen marks items read and updates badge.\n\nFiles: web/src/features/notifications/NotificationScreen.tsx"
  ```

#### Task #130: [VS-4-61] Web: Conflict state machine: OPEN → RESOLVED only via explicit ResolveConflict *(Orig #119)*
- **Layer:** `Frontend / State` | **Priority:** **Must** | **Files:** `web/src/features/conflicts/state-machine.ts`
- **Architectural Scope:** State machine preventing automatic or accidental dismissal of conflict cases.
- **Deliverable & Acceptance Criteria:** State machine asserts cases stay OPEN until explicit resolution.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-61] #130 - Web: Conflict state machine: OPEN → RESOLVED only via explic..." --label "frontend,state,must" --body "### Architectural Scope\nState machine preventing automatic or accidental dismissal of conflict cases.\n\n### Deliverable\nState machine asserts cases stay OPEN until explicit resolution.\n\nFiles: web/src/features/conflicts/state-machine.ts"
  ```

#### Task #131: [VS-4-62] Architecture test: every ConflictType has resolution paths; no auto-close *(Orig #120)*
- **Layer:** `Backend / Test` | **Priority:** **Must** | **Files:** `backend/tests/architecture/test_conflict_completeness.py`
- **Architectural Scope:** Automated architectural test verifying zero unhandled conflict states in backend.
- **Deliverable & Acceptance Criteria:** Architecture test asserts completeness of resolution paths.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-4-62] #131 - Architecture test: every ConflictType has resolution paths; ..." --label "backend,test,must" --body "### Architectural Scope\nAutomated architectural test verifying zero unhandled conflict states in backend.\n\n### Deliverable\nArchitecture test asserts completeness of resolution paths.\n\nFiles: backend/tests/architecture/test_conflict_completeness.py"
  ```

---

## Vertical Slice 5: Store Analytics, Physical Counts & Local-Only Mode

- **Primary Assignee Track:** **Shared Operations (Persons 2, 3 & 4)**
- **Subsystem Mission:** Store valuation, physical inventory counts [Should], standalone local-only kiosk mode [Should], and emergency data backup exports.
- **Architectural Invariants:** SQL inventory valuation queries excluding uncosted items. Stock variance calculation proposing adjustment deltas. Unencrypted JSON pending-export format for phone data rescue.

### Task Register:

#### Task #132: [VS-5-01] Inventory valuation (owner): GET /reports/inventory-value → Σ max(qty,0) × costSantim over products with cost; approximate flag if any negative/under-review/uncosted *(Orig #123)*
- **Layer:** `Backend / Reports` | **Priority:** **Must** | **Files:** `backend/apps/reporting/valuation.py`
- **Architectural Scope:** SQL query computing total inventory asset value, tagging approximate if any products have negative stock or missing wholesale costs.
- **Deliverable & Acceptance Criteria:** Valuation endpoint returns capital sum and uncosted SKU counts.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-01] #132 - Inventory valuation (owner): GET /reports/inventory-value → ..." --label "backend,reports,must" --body "### Architectural Scope\nSQL query computing total inventory asset value, tagging approximate if any products have negative stock or missing wholesale costs.\n\n### Deliverable\nValuation endpoint returns capital sum and uncosted SKU counts.\n\nFiles: backend/apps/reporting/valuation.py"
  ```

#### Task #133: [VS-5-02] Web: ValuationCard — large total, helper line 'N items have no cost recorded; M items approximate' *(Orig #125)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/ValuationCard.tsx`
- **Architectural Scope:** Capital valuation widget displaying total store asset value in ETB with uncosted item helper text.
- **Deliverable & Acceptance Criteria:** ValuationCard renders in today_dashboard view.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-02] #133 - Web: ValuationCard — large total, helper line 'N items have ..." --label "frontend,component,must" --body "### Architectural Scope\nCapital valuation widget displaying total store asset value in ETB with uncosted item helper text.\n\n### Deliverable\nValuationCard renders in today_dashboard view.\n\nFiles: web/src/features/dashboard/ValuationCard.tsx"
  ```

#### Task #134: [VS-5-03] Web: Low stock warning cards — product name, current/threshold with unit, Restock button *(Orig #126)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/features/dashboard/LowStockAlertCard.tsx`
- **Architectural Scope:** Alert cards highlighting products below reorder thresholds with 1-tap shortcut to receive shipment.
- **Deliverable & Acceptance Criteria:** Low stock alert links directly to receive stock modal.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-03] #134 - Web: Low stock warning cards — product name, current/thresho..." --label "frontend,component,must" --body "### Architectural Scope\nAlert cards highlighting products below reorder thresholds with 1-tap shortcut to receive shipment.\n\n### Deliverable\nLow stock alert links directly to receive stock modal.\n\nFiles: web/src/features/dashboard/LowStockAlertCard.tsx"
  ```

#### Task #135: [VS-5-04] CSV exports [Should]: GET /exports/sales.csv, /stock-changes.csv (owner only) *(Orig #129)*
- **Layer:** `Backend / Export` | **Priority:** **Should** | **Files:** `backend/apps/reporting/csv_exports.py`
- **Architectural Scope:** Streaming CSV export endpoints for tax accounting, bookkeeping, and external ledger reconciliation.
- **Deliverable & Acceptance Criteria:** CSV exports stream large datasets without memory exhaustion.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-04] #135 - CSV exports [Should]: GET /exports/sales.csv, /stock-changes..." --label "backend,export,should" --body "### Architectural Scope\nStreaming CSV export endpoints for tax accounting, bookkeeping, and external ledger reconciliation.\n\n### Deliverable\nCSV exports stream large datasets without memory exhaustion.\n\nFiles: backend/apps/reporting/csv_exports.py"
  ```

#### Task #136: [VS-5-05] Pending-records export (device): JSON stokari-pending-export/v1 from outbox/sales/stockChanges — never marked confirmed, sensitive data warning *(Orig #130)*
- **Layer:** `Frontend / Export` | **Priority:** **Must** | **Files:** `web/src/data/export-pending.ts`
- **Architectural Scope:** Emergency client backup utility generating an unencrypted JSON export of all unsynced local outbox records to prevent data loss if phone is damaged.
- **Deliverable & Acceptance Criteria:** Export function generates valid stokari-pending-export/v1 JSON.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-05] #136 - Pending-records export (device): JSON stokari-pending-export..." --label "frontend,export,must" --body "### Architectural Scope\nEmergency client backup utility generating an unencrypted JSON export of all unsynced local outbox records to prevent data loss if phone is damaged.\n\n### Deliverable\nExport function generates valid stokari-pending-export/v1 JSON.\n\nFiles: web/src/data/export-pending.ts"
  ```

#### Task #137: [VS-5-06] Web: Export Pending Records button in Settings + Staff screens *(Orig #131)*
- **Layer:** `Frontend / UI` | **Priority:** **Must** | **Files:** `web/src/features/settings/ExportBackupButton.tsx`
- **Architectural Scope:** Functional export button triggering actual client-side file download with sensitive data warning dialog.
- **Deliverable & Acceptance Criteria:** Button triggers browser download of backup JSON file.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-06] #137 - Web: Export Pending Records button in Settings + Staff scree..." --label "frontend,ui,must" --body "### Architectural Scope\nFunctional export button triggering actual client-side file download with sensitive data warning dialog.\n\n### Deliverable\nButton triggers browser download of backup JSON file.\n\nFiles: web/src/features/settings/ExportBackupButton.tsx"
  ```

#### Task #138: [VS-5-07] CountSession + CountLine models [Should] *(Orig #133)*
- **Layer:** `Backend / Models` | **Priority:** **Should** | **Files:** `backend/apps/counts/models.py`
- **Architectural Scope:** Physical inventory count schema tracking observed shelf counts against recorded ledger balances.
- **Deliverable & Acceptance Criteria:** Count models migration running cleanly on PostgreSQL.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-07] #138 - CountSession + CountLine models [Should]..." --label "backend,models,should" --body "### Architectural Scope\nPhysical inventory count schema tracking observed shelf counts against recorded ledger balances.\n\n### Deliverable\nCount models migration running cleanly on PostgreSQL.\n\nFiles: backend/apps/counts/models.py"
  ```

#### Task #139: [VS-5-08] SubmitCountHandler, DecideCountHandler [Should] *(Orig #134)*
- **Layer:** `Backend / Handlers` | **Priority:** **Should** | **Files:** `backend/apps/counts/handlers.py`
- **Architectural Scope:** Command handlers to record observed physical counts and apply owner variance decisions.
- **Deliverable & Acceptance Criteria:** Count handlers pass variance calculation tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-08] #139 - SubmitCountHandler, DecideCountHandler [Should]..." --label "backend,handlers,should" --body "### Architectural Scope\nCommand handlers to record observed physical counts and apply owner variance decisions.\n\n### Deliverable\nCount handlers pass variance calculation tests.\n\nFiles: backend/apps/counts/handlers.py"
  ```

#### Task #140: [VS-5-09] Server proposes delta = observedMilli − balanceAtVersion(baseVersion) (stock log query); shows movements after baseVersion [Should] *(Orig #135)*
- **Layer:** `Backend / Queries` | **Priority:** **Should** | **Files:** `backend/apps/counts/reconciliation.py`
- **Architectural Scope:** Reconciliation query calculating stock shrinkage delta while accounting for intermediate sales.
- **Deliverable & Acceptance Criteria:** Proposed delta correctly accounts for sales made during counting.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-09] #140 - Server proposes delta = observedMilli − balanceAtVersion(bas..." --label "backend,queries,should" --body "### Architectural Scope\nReconciliation query calculating stock shrinkage delta while accounting for intermediate sales.\n\n### Deliverable\nProposed delta correctly accounts for sales made during counting.\n\nFiles: backend/apps/counts/reconciliation.py"
  ```

#### Task #141: [VS-5-10] Owner edits delta, approves → COUNT_CORRECTION entry [Should] *(Orig #136)*
- **Layer:** `Backend / Handlers` | **Priority:** **Should** | **Files:** `backend/apps/counts/approval.py`
- **Architectural Scope:** Owner approval workflow appending COUNT_CORRECTION movements to the stock ledger.
- **Deliverable & Acceptance Criteria:** Approval emits audit adjustment ledger entry.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-10] #141 - Owner edits delta, approves → COUNT_CORRECTION entry [Should..." --label "backend,handlers,should" --body "### Architectural Scope\nOwner approval workflow appending COUNT_CORRECTION movements to the stock ledger.\n\n### Deliverable\nApproval emits audit adjustment ledger entry.\n\nFiles: backend/apps/counts/approval.py"
  ```

#### Task #142: [VS-5-11] Web: Count screen — start session, enter observed per product, review proposed delta, decide [Should] *(Orig #137)*
- **Layer:** `Frontend / UI` | **Priority:** **Should** | **Files:** `web/src/features/counts/PhysicalCountScreen.tsx`
- **Architectural Scope:** Interactive shelf count counting view with live variance feedback.
- **Deliverable & Acceptance Criteria:** Count screen renders product input rows and delta previews.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-11] #142 - Web: Count screen — start session, enter observed per produc..." --label "frontend,ui,should" --body "### Architectural Scope\nInteractive shelf count counting view with live variance feedback.\n\n### Deliverable\nCount screen renders product input rows and delta previews.\n\nFiles: web/src/features/counts/PhysicalCountScreen.tsx"
  ```

#### Task #143: [VS-5-12] Web: Count session history [Should] *(Orig #138)*
- **Layer:** `Frontend / UI` | **Priority:** **Should** | **Files:** `web/src/features/counts/CountHistoryScreen.tsx`
- **Architectural Scope:** Historical log of past physical counts and shrinkage adjustments.
- **Deliverable & Acceptance Criteria:** Count history renders past reconciliation sessions.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-12] #143 - Web: Count session history [Should]..." --label "frontend,ui,should" --body "### Architectural Scope\nHistorical log of past physical counts and shrinkage adjustments.\n\n### Deliverable\nCount history renders past reconciliation sessions.\n\nFiles: web/src/features/counts/CountHistoryScreen.tsx"
  ```

#### Task #144: [VS-5-13] meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission, no pull; persistent banner [Should] *(Orig #139)*
- **Layer:** `Frontend / Local` | **Priority:** **Should** | **Files:** `web/src/data/local-mode.ts`
- **Architectural Scope:** Standalone mode operating purely offline without server authentication or cloud sync.
- **Deliverable & Acceptance Criteria:** Local-only mode disables outbox transmission and shows banner.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-13] #144 - meta.mode = 'LOCAL_ONLY': no tokens, no outbox transmission,..." --label "frontend,local,should" --body "### Architectural Scope\nStandalone mode operating purely offline without server authentication or cloud sync.\n\n### Deliverable\nLocal-only mode disables outbox transmission and shows banner.\n\nFiles: web/src/data/local-mode.ts"
  ```

#### Task #145: [VS-5-14] Explicit migration procedure to shared mode (out of MVP scope) [Should] *(Orig #140)*
- **Layer:** `Documentation` | **Priority:** **Should** | **Files:** `docs/LOCAL_TO_CLOUD_MIGRATION.md`
- **Architectural Scope:** Documented procedure for migrating a standalone local-only shop into the cloud platform.
- **Deliverable & Acceptance Criteria:** Migration guide reviewed and committed.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-14] #145 - Explicit migration procedure to shared mode (out of MVP scop..." --label "documentation,should" --body "### Architectural Scope\nDocumented procedure for migrating a standalone local-only shop into the cloud platform.\n\n### Deliverable\nMigration guide reviewed and committed.\n\nFiles: docs/LOCAL_TO_CLOUD_MIGRATION.md"
  ```

#### Task #146: [VS-5-15] Data export/import for local-only → shared migration [Should] *(Orig #141)*
- **Layer:** `Frontend / Migration` | **Priority:** **Should** | **Files:** `web/src/data/migration-bundle.ts`
- **Architectural Scope:** JSON bundle exporter and importer for transitioning standalone local shops to cloud tenancy.
- **Deliverable & Acceptance Criteria:** Migration bundle passes import/export roundtrip tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-15] #146 - Data export/import for local-only → shared migration [Should..." --label "frontend,migration,should" --body "### Architectural Scope\nJSON bundle exporter and importer for transitioning standalone local shops to cloud tenancy.\n\n### Deliverable\nMigration bundle passes import/export roundtrip tests.\n\nFiles: web/src/data/migration-bundle.ts"
  ```

#### Task #147: [VS-5-16] Web: Local-only mode toggle in Settings with warning [Should] *(Orig #142)*
- **Layer:** `Frontend / UI` | **Priority:** **Should** | **Files:** `web/src/features/settings/LocalOnlyToggle.tsx`
- **Architectural Scope:** Settings toggle allowing a shop to switch into standalone unclouded operation.
- **Deliverable & Acceptance Criteria:** Toggle displays confirmation warning before enabling.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-5-16] #147 - Web: Local-only mode toggle in Settings with warning [Should..." --label "frontend,ui,should" --body "### Architectural Scope\nSettings toggle allowing a shop to switch into standalone unclouded operation.\n\n### Deliverable\nToggle displays confirmation warning before enabling.\n\nFiles: web/src/features/settings/LocalOnlyToggle.tsx"
  ```

---

## Vertical Slice 6: Design System, Test Gates & Contract Verification

- **Primary Assignee Track:** **Shared Quality Gates (All 4 Developers / QA)**
- **Subsystem Mission:** Central design tokens, primitive UI components, contract synchronization, two-device concurrency testing, property-based invariants, and accessibility gates.
- **Architectural Invariants:** Contract loop synchronizing openapi.json. Hypothesis and fast-check property testing for ledger invariants. Playwright 2-device concurrency simulation verifying AT-06.

### Task Register:

#### Task #148: [VS-6-01] Contract bundle workflow: export_contract.py, contract-release.yml, contract.lock, pnpm contract:sync *(Orig #5)*
- **Layer:** `Tooling / Contract` | **Priority:** **Must** | **Files:** `backend/scripts/export_contract.py, web/scripts/sync_contract.sh`
- **Architectural Scope:** Automated contract synchronization loop pulling OpenAPI schema and generating TypeScript types in web/src/contract.
- **Deliverable & Acceptance Criteria:** Contract sync script regenerates TypeScript types cleanly.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-01] #148 - Contract bundle workflow: export_contract.py, contract-relea..." --label "tooling,contract,must" --body "### Architectural Scope\nAutomated contract synchronization loop pulling OpenAPI schema and generating TypeScript types in web/src/contract.\n\n### Deliverable\nContract sync script regenerates TypeScript types cleanly.\n\nFiles: backend/scripts/export_contract.py, web/scripts/sync_contract.sh"
  ```

#### Task #149: [VS-6-02] Shared fixtures: money-vectors.json, quantity-vectors.json, payload-hash-vectors.json, permissions.json, error-codes.json, sample-operations/*.json *(Orig #159)*
- **Layer:** `Shared Fixtures` | **Priority:** **Must** | **Files:** `contract/fixtures/*.json`
- **Architectural Scope:** Committed canonical test vectors shared between backend Python and frontend TypeScript test suites.
- **Deliverable & Acceptance Criteria:** All shared fixtures committed and validated.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-02] #149 - Shared fixtures: money-vectors.json, quantity-vectors.json, ..." --label "shared fixtures,must" --body "### Architectural Scope\nCommitted canonical test vectors shared between backend Python and frontend TypeScript test suites.\n\n### Deliverable\nAll shared fixtures committed and validated.\n\nFiles: contract/fixtures/*.json"
  ```

#### Task #150: [VS-6-03] API unit tests: money, quantity, status machines, permission table, conflict policy, projection *(Orig #160)*
- **Layer:** `Backend / Test` | **Priority:** **Must** | **Files:** `backend/tests/unit/*.py`
- **Architectural Scope:** Backend domain unit test suite achieving >90% coverage on core business logic.
- **Deliverable & Acceptance Criteria:** Unit test suite passes in < 5 seconds.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-03] #150 - API unit tests: money, quantity, status machines, permission..." --label "backend,test,must" --body "### Architectural Scope\nBackend domain unit test suite achieving >90% coverage on core business logic.\n\n### Deliverable\nUnit test suite passes in < 5 seconds.\n\nFiles: backend/tests/unit/*.py"
  ```

#### Task #151: [VS-6-04] API integration tests (pytest-django + factory_boy + Postgres): every handler, repository, endpoint *(Orig #161)*
- **Layer:** `Backend / Test` | **Priority:** **Must** | **Files:** `backend/tests/integration/*.py`
- **Architectural Scope:** PostgreSQL integration tests exercising every command handler, repository, and DRF endpoint.
- **Deliverable & Acceptance Criteria:** Integration test suite passes on local PostgreSQL database.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-04] #151 - API integration tests (pytest-django + factory_boy + Postgre..." --label "backend,test,must" --body "### Architectural Scope\nPostgreSQL integration tests exercising every command handler, repository, and DRF endpoint.\n\n### Deliverable\nIntegration test suite passes on local PostgreSQL database.\n\nFiles: backend/tests/integration/*.py"
  ```

#### Task #152: [VS-6-05] API concurrency tests: parallel pushes, duplicate opId, pull during push (transaction=True + threads) *(Orig #162)*
- **Layer:** `Backend / Concurrency` | **Priority:** **Must** | **Files:** `backend/tests/concurrency/test_sync_concurrency.py`
- **Architectural Scope:** Multi-threaded race condition tests proving shop-level row lock prevents lost updates and deadlocks.
- **Deliverable & Acceptance Criteria:** Concurrency tests pass with 10 simulated parallel devices.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-05] #152 - API concurrency tests: parallel pushes, duplicate opId, pull..." --label "backend,concurrency,must" --body "### Architectural Scope\nMulti-threaded race condition tests proving shop-level row lock prevents lost updates and deadlocks.\n\n### Deliverable\nConcurrency tests pass with 10 simulated parallel devices.\n\nFiles: backend/tests/concurrency/test_sync_concurrency.py"
  ```

#### Task #153: [VS-6-06] API property tests (Hypothesis): random interleavings → qty = Σ deltas, no duplicate effect, cursor safety *(Orig #163)*
- **Layer:** `Backend / Property` | **Priority:** **Must** | **Files:** `backend/tests/property/test_ledger_properties.py`
- **Architectural Scope:** Hypothesis property tests asserting stock ledger mathematical invariants across 1,000 randomized operation sequences.
- **Deliverable & Acceptance Criteria:** Property tests run 1,000 randomized iterations without invariant failure.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-06] #153 - API property tests (Hypothesis): random interleavings → qty ..." --label "backend,property,must" --body "### Architectural Scope\nHypothesis property tests asserting stock ledger mathematical invariants across 1,000 randomized operation sequences.\n\n### Deliverable\nProperty tests run 1,000 randomized iterations without invariant failure.\n\nFiles: backend/tests/property/test_ledger_properties.py"
  ```

#### Task #154: [VS-6-07] API architecture tests: one handler per op, no direct Model.objects, composite keys present, no business logic in models *(Orig #164)*
- **Layer:** `Backend / Architecture` | **Priority:** **Must** | **Files:** `backend/tests/architecture/test_layer_boundaries.py`
- **Architectural Scope:** Import-linter rules asserting clean architectural boundaries and zero direct ORM calls from views.
- **Deliverable & Acceptance Criteria:** Architecture test suite passes.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-07] #154 - API architecture tests: one handler per op, no direct Model...." --label "backend,architecture,must" --body "### Architectural Scope\nImport-linter rules asserting clean architectural boundaries and zero direct ORM calls from views.\n\n### Deliverable\nArchitecture test suite passes.\n\nFiles: backend/tests/architecture/test_layer_boundaries.py"
  ```

#### Task #155: [VS-6-08] Web unit tests (Vitest + fake-indexeddb): use cases, outbox, result applier, recovery, projection *(Orig #165)*
- **Layer:** `Frontend / Test` | **Priority:** **Must** | **Files:** `web/src/**/__tests__/*.test.ts`
- **Architectural Scope:** Frontend unit test suite achieving >90% coverage using fake-indexeddb.
- **Deliverable & Acceptance Criteria:** Vitest suite passes with zero warnings.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-08] #155 - Web unit tests (Vitest + fake-indexeddb): use cases, outbox,..." --label "frontend,test,must" --body "### Architectural Scope\nFrontend unit test suite achieving >90% coverage using fake-indexeddb.\n\n### Deliverable\nVitest suite passes with zero warnings.\n\nFiles: web/src/**/__tests__/*.test.ts"
  ```

#### Task #156: [VS-6-09] Web property tests (fast-check): projection and outbox state *(Orig #166)*
- **Layer:** `Frontend / Property` | **Priority:** **Must** | **Files:** `web/src/data/__tests__/projection-property.test.ts`
- **Architectural Scope:** Fast-check property tests verifying client projection mathematical invariants across randomized outbox states.
- **Deliverable & Acceptance Criteria:** Fast-check property tests pass 500 iterations.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-09] #156 - Web property tests (fast-check): projection and outbox state..." --label "frontend,property,must" --body "### Architectural Scope\nFast-check property tests verifying client projection mathematical invariants across randomized outbox states.\n\n### Deliverable\nFast-check property tests pass 500 iterations.\n\nFiles: web/src/data/__tests__/projection-property.test.ts"
  ```

#### Task #157: [VS-6-10] Web contract tests: run every sample operation through Zod schemas; money/quantity vectors match Python *(Orig #167)*
- **Layer:** `Frontend / Contract` | **Priority:** **Must** | **Files:** `web/src/contract/__tests__/contract-validation.test.ts`
- **Architectural Scope:** Contract tests asserting frontend TypeScript schemas and vectors match Python backend outputs exactly.
- **Deliverable & Acceptance Criteria:** Contract test suite passes across all sample operations.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-10] #157 - Web contract tests: run every sample operation through Zod s..." --label "frontend,contract,must" --body "### Architectural Scope\nContract tests asserting frontend TypeScript schemas and vectors match Python backend outputs exactly.\n\n### Deliverable\nContract test suite passes across all sample operations.\n\nFiles: web/src/contract/__tests__/contract-validation.test.ts"
  ```

#### Task #158: [VS-6-11] E2E tests (Playwright): two browser contexts as two devices; offline sale → sync → reload → conflict flow *(Orig #168)*
- **Layer:** `E2E / Concurrency` | **Priority:** **Must** | **Files:** `web/e2e/two-device-conflict.spec.ts`
- **Architectural Scope:** Automated two-device conflict simulation verifying AT-06: Device 1 sells 7, Device 2 sells 6 from stock 10, asserting ledger -3 and case opened.
- **Deliverable & Acceptance Criteria:** Two-device Playwright test passes cleanly.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-11] #158 - E2E tests (Playwright): two browser contexts as two devices;..." --label "e2e,concurrency,must" --body "### Architectural Scope\nAutomated two-device conflict simulation verifying AT-06: Device 1 sells 7, Device 2 sells 6 from stock 10, asserting ledger -3 and case opened.\n\n### Deliverable\nTwo-device Playwright test passes cleanly.\n\nFiles: web/e2e/two-device-conflict.spec.ts"
  ```

#### Task #159: [VS-6-12] Device tests: real low-end Android (2GB RAM), 320px emulator — install, offline open, NFR-01/02/14 *(Orig #169)*
- **Layer:** `QA / Device` | **Priority:** **Must** | **Files:** `docs/DEVICE_VERIFICATION_REPORT.md`
- **Architectural Scope:** Low-spec hardware verification verifying PWA launch in < 3s and smooth scrolling on 320px viewport.
- **Deliverable & Acceptance Criteria:** Device verification report documented and approved.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-12] #159 - Device tests: real low-end Android (2GB RAM), 320px emulator..." --label "qa,device,must" --body "### Architectural Scope\nLow-spec hardware verification verifying PWA launch in < 3s and smooth scrolling on 320px viewport.\n\n### Deliverable\nDevice verification report documented and approved.\n\nFiles: docs/DEVICE_VERIFICATION_REPORT.md"
  ```

#### Task #160: [VS-6-13] Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test titles [FR-14][AT-04]; trace_check.py fails CI if Must req untagged *(Orig #170)*
- **Layer:** `CI / Quality` | **Priority:** **Must** | **Files:** `scripts/trace_check.py`
- **Architectural Scope:** Quality gate script verifying every Must requirement in SRS v0.5 is linked to at least one automated test.
- **Deliverable & Acceptance Criteria:** trace_check.py passes with 100% requirement coverage.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-13] #160 - Traceability: @pytest.mark.req('FR-14', 'AT-04') + web test ..." --label "ci,quality,must" --body "### Architectural Scope\nQuality gate script verifying every Must requirement in SRS v0.5 is linked to at least one automated test.\n\n### Deliverable\ntrace_check.py passes with 100% requirement coverage.\n\nFiles: scripts/trace_check.py"
  ```

#### Task #161: [VS-6-14] AT-01..AT-20 mapping to test scenarios (T-01..T-35) *(Orig #171)*
- **Layer:** `Documentation` | **Priority:** **Must** | **Files:** `docs/ACCEPTANCE_TEST_MATRIX.md`
- **Architectural Scope:** Comprehensive traceability matrix document linking all 20 acceptance tests to automated test cases.
- **Deliverable & Acceptance Criteria:** Acceptance test matrix document committed.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-14] #161 - AT-01..AT-20 mapping to test scenarios (T-01..T-35)..." --label "documentation,must" --body "### Architectural Scope\nComprehensive traceability matrix document linking all 20 acceptance tests to automated test cases.\n\n### Deliverable\nAcceptance test matrix document committed.\n\nFiles: docs/ACCEPTANCE_TEST_MATRIX.md"
  ```

#### Task #162: [VS-6-15] OpenAPI diff in CI: fails if openapi.json stale vs code *(Orig #172)*
- **Layer:** `CI / Quality` | **Priority:** **Must** | **Files:** `.github/workflows/contract-diff.yml`
- **Architectural Scope:** CI check verifying that openapi.json matches current code before merging pull requests.
- **Deliverable & Acceptance Criteria:** CI check fails on uncommitted API changes.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-15] #162 - OpenAPI diff in CI: fails if openapi.json stale vs code..." --label "ci,quality,must" --body "### Architectural Scope\nCI check verifying that openapi.json matches current code before merging pull requests.\n\n### Deliverable\nCI check fails on uncommitted API changes.\n\nFiles: .github/workflows/contract-diff.yml"
  ```

#### Task #163: [VS-6-16] Coverage gates: 70% overall, 90% on domain/, core/, sync/ *(Orig #173)*
- **Layer:** `CI / Quality` | **Priority:** **Must** | **Files:** `pyproject.toml, vite.config.ts`
- **Architectural Scope:** Hard coverage thresholds in CI enforcing 90% test coverage on critical business logic.
- **Deliverable & Acceptance Criteria:** Pull requests blocked if coverage drops below threshold.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-16] #163 - Coverage gates: 70% overall, 90% on domain/, core/, sync/..." --label "ci,quality,must" --body "### Architectural Scope\nHard coverage thresholds in CI enforcing 90% test coverage on critical business logic.\n\n### Deliverable\nPull requests blocked if coverage drops below threshold.\n\nFiles: pyproject.toml, vite.config.ts"
  ```

#### Task #164: [VS-6-17] Visual regression tests: all 4 states × 3 breakpoints × 2 roles per component *(Orig #174)*
- **Layer:** `QA / Visual` | **Priority:** **Must** | **Files:** `web/e2e/visual-regression.spec.ts`
- **Architectural Scope:** Automated snapshot tests asserting visual stability across desktop, tablet, and mobile viewports.
- **Deliverable & Acceptance Criteria:** Visual snapshots committed and passing.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-17] #164 - Visual regression tests: all 4 states × 3 breakpoints × 2 ro..." --label "qa,visual,must" --body "### Architectural Scope\nAutomated snapshot tests asserting visual stability across desktop, tablet, and mobile viewports.\n\n### Deliverable\nVisual snapshots committed and passing.\n\nFiles: web/e2e/visual-regression.spec.ts"
  ```

#### Task #165: [VS-6-18] Accessibility audit: axe-core in CI, manual screen reader test *(Orig #175)*
- **Layer:** `QA / A11y` | **Priority:** **Must** | **Files:** `web/e2e/accessibility.spec.ts`
- **Architectural Scope:** Axe-core automated accessibility audit enforcing WCAG 2.1 AA compliance.
- **Deliverable & Acceptance Criteria:** Zero critical accessibility violations across all screens.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-18] #165 - Accessibility audit: axe-core in CI, manual screen reader te..." --label "qa,a11y,must" --body "### Architectural Scope\nAxe-core automated accessibility audit enforcing WCAG 2.1 AA compliance.\n\n### Deliverable\nZero critical accessibility violations across all screens.\n\nFiles: web/e2e/accessibility.spec.ts"
  ```

#### Task #166: [VS-6-19] Performance regression: bundle size, TTI, sync latency tracked per PR *(Orig #176)*
- **Layer:** `CI / Perf` | **Priority:** **Must** | **Files:** `.github/workflows/perf-tracking.yml`
- **Architectural Scope:** Automated bundle size and latency tracking on every pull request.
- **Deliverable & Acceptance Criteria:** PR comments report bundle size and regression diffs.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-19] #166 - Performance regression: bundle size, TTI, sync latency track..." --label "ci,perf,must" --body "### Architectural Scope\nAutomated bundle size and latency tracking on every pull request.\n\n### Deliverable\nPR comments report bundle size and regression diffs.\n\nFiles: .github/workflows/perf-tracking.yml"
  ```

#### Task #167: [VS-6-20] Design token implementation: CSS variables for all colors, spacing, radii, shadows, typography *(Orig #177)*
- **Layer:** `Frontend / Tokens` | **Priority:** **Must** | **Files:** `web/src/index.css`
- **Architectural Scope:** CSS variables implementing deep cobalt (#1E40AF), neutral slate canvas, and hairline borders.
- **Deliverable & Acceptance Criteria:** Design tokens used consistently across components.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-20] #167 - Design token implementation: CSS variables for all colors, s..." --label "frontend,tokens,must" --body "### Architectural Scope\nCSS variables implementing deep cobalt (#1E40AF), neutral slate canvas, and hairline borders.\n\n### Deliverable\nDesign tokens used consistently across components.\n\nFiles: web/src/index.css"
  ```

#### Task #168: [VS-6-21] Component library: Button, Input, Badge, Card, Modal, Sheet, Drawer, DataTable with all variants *(Orig #178)*
- **Layer:** `Frontend / Components` | **Priority:** **Must** | **Files:** `web/src/ui/*.tsx`
- **Architectural Scope:** Accessible primitive component library with 44px minimum touch targets and clear focus rings.
- **Deliverable & Acceptance Criteria:** Component library passes unit and accessibility tests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-21] #168 - Component library: Button, Input, Badge, Card, Modal, Sheet,..." --label "frontend,components,must" --body "### Architectural Scope\nAccessible primitive component library with 44px minimum touch targets and clear focus rings.\n\n### Deliverable\nComponent library passes unit and accessibility tests.\n\nFiles: web/src/ui/*.tsx"
  ```

#### Task #169: [VS-6-22] Specialized components: SyncPill, QuantityInput, CurrencyInput, UnitSelect, StockLevelDisplay, PaymentSelector *(Orig #179)*
- **Layer:** `Frontend / Components` | **Priority:** **Must** | **Files:** `web/src/ui/specialized/*.tsx`
- **Architectural Scope:** Domain-specific composite components for retail transactions and stock display.
- **Deliverable & Acceptance Criteria:** Specialized components tested with mock data.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-22] #169 - Specialized components: SyncPill, QuantityInput, CurrencyInp..." --label "frontend,components,must" --body "### Architectural Scope\nDomain-specific composite components for retail transactions and stock display.\n\n### Deliverable\nSpecialized components tested with mock data.\n\nFiles: web/src/ui/specialized/*.tsx"
  ```

#### Task #170: [VS-6-23] Composite components: RevenueBucket, ConflictCaseCard, LeaseHealthRow, ProductCard, LowStockCard *(Orig #180)*
- **Layer:** `Frontend / Components` | **Priority:** **Must** | **Files:** `web/src/ui/composite/*.tsx`
- **Architectural Scope:** Dashboard and conflict domain card components rendering complex metrics cleanly.
- **Deliverable & Acceptance Criteria:** Composite components render across all responsive breakpoints.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-23] #170 - Composite components: RevenueBucket, ConflictCaseCard, Lease..." --label "frontend,components,must" --body "### Architectural Scope\nDashboard and conflict domain card components rendering complex metrics cleanly.\n\n### Deliverable\nComposite components render across all responsive breakpoints.\n\nFiles: web/src/ui/composite/*.tsx"
  ```

#### Task #171: [VS-6-24] Desktop sidebar (240px → 48px icon rail), sticky header, split-pane drawers *(Orig #184)*
- **Layer:** `Frontend / Layout` | **Priority:** **Must** | **Files:** `web/src/app/DesktopShell.tsx`
- **Architectural Scope:** Responsive layout shell expanding into desktop sidebar on >1024px displays with icon rail collapsing.
- **Deliverable & Acceptance Criteria:** Desktop layout scales cleanly without content distortion.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-24] #171 - Desktop sidebar (240px → 48px icon rail), sticky header, spl..." --label "frontend,layout,must" --body "### Architectural Scope\nResponsive layout shell expanding into desktop sidebar on >1024px displays with icon rail collapsing.\n\n### Deliverable\nDesktop layout scales cleanly without content distortion.\n\nFiles: web/src/app/DesktopShell.tsx"
  ```

#### Task #172: [VS-6-25] DataTable: sticky header, sortable columns, filter toolbar, bulk actions, density toggle *(Orig #185)*
- **Layer:** `Frontend / Component` | **Priority:** **Must** | **Files:** `web/src/ui/DataTable.tsx`
- **Architectural Scope:** Virtualizable data table component with sticky header and horizontal scroll wrapper for data density.
- **Deliverable & Acceptance Criteria:** DataTable handles 2,000 rows with 60fps scrolling.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-25] #172 - DataTable: sticky header, sortable columns, filter toolbar, ..." --label "frontend,component,must" --body "### Architectural Scope\nVirtualizable data table component with sticky header and horizontal scroll wrapper for data density.\n\n### Deliverable\nDataTable handles 2,000 rows with 60fps scrolling.\n\nFiles: web/src/ui/DataTable.tsx"
  ```

#### Task #173: [VS-6-26] Reduced motion: pulse animations disabled, slide transitions instant *(Orig #187)*
- **Layer:** `Frontend / A11y` | **Priority:** **Must** | **Files:** `web/src/index.css`
- **Architectural Scope:** prefers-reduced-motion CSS media queries disabling pulse animations and slide transitions.
- **Deliverable & Acceptance Criteria:** Animations disabled when reduced-motion is requested.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-26] #173 - Reduced motion: pulse animations disabled, slide transitions..." --label "frontend,a11y,must" --body "### Architectural Scope\nprefers-reduced-motion CSS media queries disabling pulse animations and slide transitions.\n\n### Deliverable\nAnimations disabled when reduced-motion is requested.\n\nFiles: web/src/index.css"
  ```

#### Task #174: [VS-6-27] Dark mode: NOT SUPPORTED — verify light-only implementation *(Orig #188)*
- **Layer:** `Frontend / Audit` | **Priority:** **Must** | **Files:** `docs/DESIGN.md`
- **Architectural Scope:** Verification audit confirming pure high-contrast light-only daytime shop theme per task 188 specification.
- **Deliverable & Acceptance Criteria:** Audit confirms light-mode only consistency across all screens.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-27] #174 - Dark mode: NOT SUPPORTED — verify light-only implementation..." --label "frontend,audit,must" --body "### Architectural Scope\nVerification audit confirming pure high-contrast light-only daytime shop theme per task 188 specification.\n\n### Deliverable\nAudit confirms light-mode only consistency across all screens.\n\nFiles: docs/DESIGN.md"
  ```

#### Task #175: [VS-6-28] Performance: Lighthouse + timers on target phone (2000 products, 50k movements); p95 ≤300ms local actions, search <1s, launch <3s, dashboard <2s *(Orig #148)*
- **Layer:** `QA / Perf` | **Priority:** **Must** | **Files:** `docs/PERFORMANCE_BENCHMARK_REPORT.md`
- **Architectural Scope:** Performance benchmark on simulated low-spec Android device meeting all NFR latency requirements.
- **Deliverable & Acceptance Criteria:** All NFR performance benchmarks verified and documented.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-28] #175 - Performance: Lighthouse + timers on target phone (2000 produ..." --label "qa,perf,must" --body "### Architectural Scope\nPerformance benchmark on simulated low-spec Android device meeting all NFR latency requirements.\n\n### Deliverable\nAll NFR performance benchmarks verified and documented.\n\nFiles: docs/PERFORMANCE_BENCHMARK_REPORT.md"
  ```

#### Task #176: [VS-6-29] Bundle size: ≤2MB compressed (code splitting, lazy routes) *(Orig #149)*
- **Layer:** `Frontend / Build` | **Priority:** **Must** | **Files:** `web/vite.config.ts`
- **Architectural Scope:** Production bundle optimization using route-level code splitting and tree shaking.
- **Deliverable & Acceptance Criteria:** Compressed production bundle verified <= 2MB.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-29] #176 - Bundle size: ≤2MB compressed (code splitting, lazy routes)..." --label "frontend,build,must" --body "### Architectural Scope\nProduction bundle optimization using route-level code splitting and tree shaking.\n\n### Deliverable\nCompressed production bundle verified <= 2MB.\n\nFiles: web/vite.config.ts"
  ```

#### Task #177: [VS-6-30] Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no horizontal scroll, status = text + icon *(Orig #150)*
- **Layer:** `QA / A11y` | **Priority:** **Must** | **Files:** `docs/ACCESSIBILITY_AUDIT_REPORT.md`
- **Architectural Scope:** Full accessibility review asserting 44px touch targets and non-color dependent status indicators.
- **Deliverable & Acceptance Criteria:** Audit report confirms WCAG 2.1 AA compliance.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-30] #177 - Accessibility: WCAG 2.1 AA, 44px touch targets, 320px no hor..." --label "qa,a11y,must" --body "### Architectural Scope\nFull accessibility review asserting 44px touch targets and non-color dependent status indicators.\n\n### Deliverable\nAudit report confirms WCAG 2.1 AA compliance.\n\nFiles: docs/ACCESSIBILITY_AUDIT_REPORT.md"
  ```

#### Task #178: [VS-6-31] Usability test: ≥5 outside users, ≥80% complete basic sale on first attempt *(Orig #152)*
- **Layer:** `QA / UX` | **Priority:** **Must** | **Files:** `docs/USABILITY_TEST_REPORT.md`
- **Architectural Scope:** Usability study with external users validating cashier checkout completion in under 10 seconds.
- **Deliverable & Acceptance Criteria:** Usability test report documenting >= 80% first-attempt success.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-6-31] #178 - Usability test: ≥5 outside users, ≥80% complete basic sale o..." --label "qa,ux,must" --body "### Architectural Scope\nUsability study with external users validating cashier checkout completion in under 10 seconds.\n\n### Deliverable\nUsability test report documenting >= 80% first-attempt success.\n\nFiles: docs/USABILITY_TEST_REPORT.md"
  ```

---

## Deferred Cloud Infrastructure & Production Hardening (Post-Development)

- **Primary Assignee Track:** **Deferred Sprint (Post-Local Development)**
- **Subsystem Mission:** Cloud hosting pipelines, Neon cloud database branching, Sentry monitoring, rate limit tuning, and automated disaster recovery tests.
- **Architectural Invariants:** Intentionally deferred until after local vertical slices are functioning and passing all automated test suites locally.

### Task Register:

#### Task #179: [VS-7-01] GitHub Actions API CI: ruff, mypy, import-linter, file-size, pytest (Postgres), check --deploy, OpenAPI diff *(Orig #3)*
- **Layer:** `Cloud CI/CD` | **Priority:** **Must** | **Files:** `.github/workflows/api-ci.yml`
- **Architectural Scope:** Automated backend CI workflow running linters, tests, and deployment verification on pull requests.
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-01] #179 - GitHub Actions API CI: ruff, mypy, import-linter, file-size,..." --label "cloud ci/cd,must" --body "### Architectural Scope\nAutomated backend CI workflow running linters, tests, and deployment verification on pull requests.\n\n### Deliverable\nGreen badge on main/dev branches.\n\nFiles: .github/workflows/api-ci.yml"
  ```

#### Task #180: [VS-7-02] GitHub Actions Web CI: lint, types, dependency-cruiser, tests, bundle-size, trace-check *(Orig #4)*
- **Layer:** `Cloud CI/CD` | **Priority:** **Must** | **Files:** `.github/workflows/web-ci.yml`
- **Architectural Scope:** Automated frontend CI workflow running linters, tests, and bundle size tracking.
- **Deliverable & Acceptance Criteria:** Green badge on main/dev branches.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-02] #180 - GitHub Actions Web CI: lint, types, dependency-cruiser, test..." --label "cloud ci/cd,must" --body "### Architectural Scope\nAutomated frontend CI workflow running linters, tests, and bundle size tracking.\n\n### Deliverable\nGreen badge on main/dev branches.\n\nFiles: .github/workflows/web-ci.yml"
  ```

#### Task #181: [VS-7-03] Vercel (web) + Render (API) deployment pipelines with staging/prod *(Orig #6)*
- **Layer:** `Cloud Hosting` | **Priority:** **Must** | **Files:** `render.yaml, vercel.json`
- **Architectural Scope:** Cloud hosting deployment pipelines with staging and production environment branches.
- **Deliverable & Acceptance Criteria:** Live staging deployment accessible over HTTPS.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-03] #181 - Vercel (web) + Render (API) deployment pipelines with stagin..." --label "cloud hosting,must" --body "### Architectural Scope\nCloud hosting deployment pipelines with staging and production environment branches.\n\n### Deliverable\nLive staging deployment accessible over HTTPS.\n\nFiles: render.yaml, vercel.json"
  ```

#### Task #182: [VS-7-04] Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABASE_URL *(Orig #7)*
- **Layer:** `Cloud Database` | **Priority:** **Must** | **Files:** `backend/backend/settings.py`
- **Architectural Scope:** Neon serverless PostgreSQL branching with isolated staging and production connection pooling.
- **Deliverable & Acceptance Criteria:** Automated database branch migrations functional.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-04] #182 - Neon PostgreSQL dev/staging/prod branches + MIGRATION_DATABA..." --label "cloud database,must" --body "### Architectural Scope\nNeon serverless PostgreSQL branching with isolated staging and production connection pooling.\n\n### Deliverable\nAutomated database branch migrations functional.\n\nFiles: backend/backend/settings.py"
  ```

#### Task #183: [VS-7-05] Sentry + UptimeRobot + nightly pg_dump cron + nightly reconciliation cron *(Orig #8)*
- **Layer:** `Cloud Monitoring` | **Priority:** **Must** | **Files:** `.github/workflows/nightly-backup.yml`
- **Architectural Scope:** Production error tracking with Sentry, external uptime pinging, and nightly automated logical dumps.
- **Deliverable & Acceptance Criteria:** Monitoring active and backup cron scheduled.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-05] #183 - Sentry + UptimeRobot + nightly pg_dump cron + nightly reconc..." --label "cloud monitoring,must" --body "### Architectural Scope\nProduction error tracking with Sentry, external uptime pinging, and nightly automated logical dumps.\n\n### Deliverable\nMonitoring active and backup cron scheduled.\n\nFiles: .github/workflows/nightly-backup.yml"
  ```

#### Task #184: [VS-7-06] Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/sessions/CSRF, browsable API disabled, SECURE_SSL_REDIRECT, HSTS, CSP *(Orig #143)*
- **Layer:** `Production Hardening` | **Priority:** **Must** | **Files:** `backend/backend/settings_prod.py`
- **Architectural Scope:** Production Django security settings disabling unused middleware and enforcing strict HSTS and CSP headers.
- **Deliverable & Acceptance Criteria:** Django deployment check passes with zero warnings (check --deploy).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-06] #184 - Django hardening: DEBUG=False, ALLOWED_HOSTS, no admin/auth/..." --label "production hardening,must" --body "### Architectural Scope\nProduction Django security settings disabling unused middleware and enforcing strict HSTS and CSP headers.\n\n### Deliverable\nDjango deployment check passes with zero warnings (check --deploy).\n\nFiles: backend/backend/settings_prod.py"
  ```

#### Task #185: [VS-7-07] Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (shared cache table across gunicorn workers) *(Orig #144)*
- **Layer:** `Production Security` | **Priority:** **Must** | **Files:** `backend/common/http/throttles.py`
- **Architectural Scope:** Distributed Redis or PostgreSQL cache-backed rate limiting protecting auth and sync endpoints.
- **Deliverable & Acceptance Criteria:** Rate limits enforced across concurrent requests.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-07] #185 - Rate limits: push/pull 60 req/min/user, auth 10 req/min/IP (..." --label "production security,must" --body "### Architectural Scope\nDistributed Redis or PostgreSQL cache-backed rate limiting protecting auth and sync endpoints.\n\n### Deliverable\nRate limits enforced across concurrent requests.\n\nFiles: backend/common/http/throttles.py"
  ```

#### Task #186: [VS-7-08] Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_SIZE hard cap *(Orig #145)*
- **Layer:** `Production Security` | **Priority:** **Must** | **Files:** `backend/backend/settings.py`
- **Architectural Scope:** Hard memory and upload payload caps preventing memory exhaustion attacks on sync endpoints.
- **Deliverable & Acceptance Criteria:** Uploads > 200KB rejected with 413 Payload Too Large.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-08] #186 - Body limits: 200KB push, 50 ops max; DATA_UPLOAD_MAX_MEMORY_..." --label "production security,must" --body "### Architectural Scope\nHard memory and upload payload caps preventing memory exhaustion attacks on sync endpoints.\n\n### Deliverable\nUploads > 200KB rejected with 413 Payload Too Large.\n\nFiles: backend/backend/settings.py"
  ```

#### Task #187: [VS-7-09] Logging: JSON with requestId, shopId, opId only; no tokens/emails/payloads *(Orig #146)*
- **Layer:** `Production Logging` | **Priority:** **Must** | **Files:** `backend/common/logging.py`
- **Architectural Scope:** Structured JSON logging for Datadog or CloudWatch scrubbed of sensitive PII, passwords, and tokens.
- **Deliverable & Acceptance Criteria:** Logs output clean structured JSON without credentials.
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-09] #187 - Logging: JSON with requestId, shopId, opId only; no tokens/e..." --label "production logging,must" --body "### Architectural Scope\nStructured JSON logging for Datadog or CloudWatch scrubbed of sensitive PII, passwords, and tokens.\n\n### Deliverable\nLogs output clean structured JSON without credentials.\n\nFiles: backend/common/logging.py"
  ```

#### Task #188: [VS-7-10] Backup/restore test: staging restore from nightly dump → run reconciliation → verify *(Orig #147)*
- **Layer:** `Disaster Recovery` | **Priority:** **Must** | **Files:** `scripts/test_disaster_recovery.sh`
- **Architectural Scope:** Disaster recovery exercise restoring staging database from backup and verifying ledger reconciliation passes.
- **Deliverable & Acceptance Criteria:** Disaster recovery test verified and documented (T-28 / AT-15).
- **GitHub CLI Snippet:**
  ```bash
  gh issue create --title "[VS-7-10] #188 - Backup/restore test: staging restore from nightly dump → run..." --label "disaster recovery,must" --body "### Architectural Scope\nDisaster recovery exercise restoring staging database from backup and verifying ledger reconciliation passes.\n\n### Deliverable\nDisaster recovery test verified and documented (T-28 / AT-15).\n\nFiles: scripts/test_disaster_recovery.sh"
  ```

---

