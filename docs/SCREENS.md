# Stokari Screen Specifications & Component Compositions (`docs/SCREENS.md`)

**Companion Document to:** [docs/DESIGN.md](file:///home/abelmekonen/Desktop/INSA/web/docs/DESIGN.md)
**Target:** Frontend Engineers, UI Implementers, QA

---

## 1. Screen Inventory by Role

| Screen                 | Attendant (Mobile)                     | Owner (Mobile)                      | Owner (Desktop/Tablet)             | Primary Component                                                          |
| ---------------------- | -------------------------------------- | ----------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| **Sell / POS**         | ✅ Full                                | ✅ Full                             | ✅ Split-pane                      | `SellScreen`, `Cart`, `QuantityKeypadSheet`, `PaymentSelector`             |
| **Products**           | ✅ Search/Browse                       | ✅ Search/Browse + Edit             | ✅ Full CRUD Table                 | `ProductList` (cards), `ProductTable`, `ProductFormModal`                  |
| **Stock**              | ✅ View Levels                         | ✅ View + Receive/Adjust            | ✅ View + Receive/Adjust + History | `StockList`, `ReceiveStockModal`, `AdjustStockModal`, `StockHistoryDrawer` |
| **Today / Dashboard**  | ✅ 3-Bucket Summary                    | ✅ 3-Bucket + Valuation + Low Stock | ✅ Full Dashboard                  | `RevenueBuckets`, `ValuationCard`, `LowStockTable`                         |
| **Review / Conflicts** | ❌ Hidden                              | ✅ List + Resolve                   | ✅ List + Split-pane Detail        | `ConflictCaseList`, `ConflictCaseDetailDrawer`, `ResolutionActions`        |
| **Staff & Settings**   | ✅ Sync, Export, Profile               | ✅ Full Management                  | ✅ Full Management                 | `StaffList`, `LeaseHealthRow`, `SyncSettings`, `ExportActions`             |
| **Auth / Onboarding**  | ✅ Sign in, Create Shop, Accept Invite | ✅ Same                             | ✅ Same                            | `SignInFlow`, `CreateShopFlow`, `AcceptInviteFlow`                         |

---

## 2. Screen Specifications

### 2.1 Sell Screen (POS Till) — **Most Critical Screen**

**Route:** `/sell` | **Roles:** All | **Layout:** Mobile-first, thumb-zone optimized

#### Component Composition

```tsx
// Mobile (< 640px)
<SellScreen>
  <Header>
    <ShopName />
    <SyncPill />
  </Header>
  <main className="flex-1 overflow-y-auto p-md">
    <ProductSearch />
    <QuickProductChips />
    <Cart />
    <PaymentSelector />
  </main>
  <StickyFooter>
    <CompleteSaleButton />  // 54px tall, full width
  </StickyFooter>
</SellScreen>

// Tablet (640–1023px): Two-column split
<SellScreen>
  <Header>...</Header>
  <div className="grid grid-cols-2 h-[calc(100vh-56px)]">
    <aside className="border-r border-border overflow-y-auto p-md">
      <ProductSearch />
      <QuickProductChips />
      <ProductListCompact />  // Recent/frequent as dense list
    </aside>
    <main className="overflow-y-auto p-md">
      <Cart />
      <PaymentSelector />
    </main>
  </div>
  <StickyFooter><CompleteSaleButton /></StickyFooter>
</SellScreen>

// Desktop (≥ 1024px): Sidebar + three-pane
<SellScreen>
  <Sidebar />  // Navigation
  <div className="flex-1 flex flex-col">
    <Header>...</Header>
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-80 border-r border-border overflow-y-auto p-md">
        <ProductSearch />
        <CategoryFilters />
        <ProductListCompact />
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden p-md">
        <Cart className="flex-1 overflow-y-auto" />
        <PaymentSelector />
      </main>
      <aside className="w-72 border-l border-border p-md">
        <QuickActions />  // Receive, Adjust, Today, Review
      </aside>
    </div>
  </div>
</SellScreen>
```

#### ProductSearch Component

```tsx
interface ProductSearchProps {
  onSelect: (product: Product) => void;
  recentProducts: Product[];
  placeholder: "Search name, SKU, or scan barcode...";
}

// Render:
// <label htmlFor="product-search" className="sr-only">Search products</label>
// <div className="relative">
//   <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
//   <input
//     id="product-search"
//     type="search"
//     autoComplete="off"
//     inputMode="search"
//     placeholder={placeholder}
//     className="input pl-10 w-full"
//     onChange={handleSearch}
//     onFocus={showRecent}
//   />
//   {isFocused && <RecentProductsList products={recentProducts} onSelect={onSelect} />}
// </div>
```

#### QuickProductChips Component

- Horizontal scroll (`overflow-x-auto`, `flex`, `gap-sm`, `pb-sm` hide scrollbar)
- Max 6 chips. Each: `px-sm py-xs rounded-md bg-surface border border-border text-sm font-medium`
- Tap → `onSelect(product)` with default qty 1

#### Cart Component

```tsx
interface CartProps {
  lines: CartLine[];
  onQtyChange: (lineId: string, delta: number) => void;  // -1, +1, or keypad result
  onRemove: (lineId: string) => void;
  onQtyKeypad: (line: CartLine) => void;  // opens QuantityKeypadSheet
}

// Render per line:
<div className="flex items-center gap-sm p-sm border-b border-border last:border-0">
  <div className="flex-1 min-w-0">
    <div className="flex items-baseline gap-sm">
      <span className="font-medium truncate">{line.productName}</span>
      {line.productNameAm && <span className="text-text-muted text-sm">{line.productNameAm}</span>}
      <UnitBadge unit={line.unit} variant="neutral" />  // "kg" / "pcs"
    </div>
    <div className="flex items-center gap-xs text-sm text-text-secondary">
      <span className="tabular-nums">{formatCurrency(line.unitPriceSantim)}</span>
      <span>×</span>
    </div>
  </div>
  <QuantityStepper
    value={line.qtyMilli}
    unit={line.unit}
    onChange={(delta) => onQtyChange(line.id, delta)}
    onKeypad={() => onQtyKeypad(line)}
    className="flex items-center gap-xs"
  />
  <div className="text-right w-36 shrink-0">
    <div className="tabular-nums font-medium text-text">{formatCurrency(line.lineTotalSantim)}</div>
    <button className="text-text-muted hover:text-danger text-sm" onClick={() => onRemove(line.id)}>Remove</button>
  </div>
</div>

// Empty Cart:
<div className="py-xl text-center text-text-secondary">
  <ShoppingBasketIcon className="mx-auto mb-sm text-4xl opacity-30" />
  <p>Cart is empty. Tap a product or scan a barcode to begin.</p>
</div>
```

#### QuantityStepper Component

```tsx
// Desktop/Tablet: Inline [-] value [+]
// Mobile: Tap value → opens QuantityKeypadSheet
<div className="flex items-center gap-xs">
  <IconButton icon="minus" onClick={() => onChange(-step)} disabled={value <= min} />
  <span className="tabular-nums font-mono w-16 text-center" onClick={onKeypad}>
    {formatQuantity(value, unit)}
  </span>
  <IconButton icon="plus" onClick={() => onChange(step)} disabled={value >= max} />
</div>
```

#### PaymentSelector Component

```tsx
// Segmented control (NOT radio buttons)
<div className="flex gap-xs" role="radiogroup" aria-label="Payment method">
  {["CASH", "TELEBIRR", "OTHER"].map((label) => (
    <button
      key={label}
      role="radio"
      aria-checked={selected === label}
      className={cn(
        "flex-1 py-sm px-md rounded-md text-sm font-medium transition-colors",
        selected
          ? "bg-primary text-primary-contrast shadow-sm"
          : "bg-surface border border-border hover:bg-surface-subtle",
      )}
      onClick={() => setSelected(label)}
    >
      {label === "CASH" && "💵 "}
      {label === "TELEBIRR" && "📱 "}
      {label === "OTHER" && "🏷️ "}
      {t(`sell.payment.${label.toLowerCase()}`)}
    </button>
  ))}
</div>
```

#### CompleteSaleButton Component

```tsx
// Mobile: 54px, full width, sticky bottom, safe-area-inset-bottom
// Desktop: Auto-width, in PaymentSelector row or separate
<button
  className={cn(
    "btn-primary font-mono tabular-nums",
    isMobile && "w-full h-[54px] fixed bottom-0 left-0 right-0",
  )}
  disabled={cart.lines.length === 0}
  onClick={handleCompleteSale}
>
  {t("sell.completeSale", { amount: formatCurrency(total) })}
</button>
```

#### QuantityKeypadSheet (Mobile Only)

```tsx
// Bottom sheet, 40vh, drag handle
<Sheet>
  <SheetHandle />
  <SheetHeader>
    <h2 className="heading2">
      {productName} — {unitLabel}
    </h2>
    <LiveTotalDisplay qty={qtyMilli} unitPrice={unitPriceSantim} unit={unit} />
  </SheetHeader>
  <Keypad
    mode={unitKind === "COUNT" ? "numeric" : "decimal"}
    value={qtyMilli}
    onChange={setQtyMilli}
    quickChips={unitConfig.quickQtyMilli.map((q) => formatQuantity(q, unit))}
    max={999_999_999}
  />
  <SheetFooter>
    <Button variant="ghost" onClick={onCancel}>
      Cancel
    </Button>
    <Button variant="primary" onClick={onConfirm}>
      Done
    </Button>
  </SheetFooter>
</Sheet>
```

#### SellAnywaySheet (Mobile Only)

```tsx
// Triggered when qty > projectedStock
<AlertSheet>
  <AlertIcon variant="warning" />
  <h3 className="heading2">Sell beyond stock?</h3>
  <p className="body text-text-secondary">
    Confirmed stock is{" "}
    <strong className="tabular-nums">{formatQuantity(confirmedStock, unit)}</strong>. Selling{" "}
    <strong className="tabular-nums">{formatQuantity(requestedQty, unit)}</strong>
    will flag this sale for manager review.
  </p>
  <div className="flex gap-sm mt-lg">
    <Button variant="ghost" flex={1} onClick={onCancel}>
      {t("common.cancel")}
    </Button>
    <Button variant="destructive" flex={1} onClick={onConfirm}>
      {t("sell.sellAnywayConfirm")}
    </Button>
  </div>
</AlertSheet>
```

---

### 2.2 Products Screen

**Route:** `/products` | **Roles:** All (Owner: full CRUD, Attendant: read-only)

#### Mobile (< 640px) — Card List

```tsx
<ProductScreen>
  <Header>
    <Title>Products</Title>
    <SyncPill />
  </Header>
  <main className="p-md">
    <ProductSearchToolbar />
    <ProductCardList products={products} onSelect={navigateToDetail} />
    {isOwner && (
      <StickyFooter>
        <Button variant="primary" icon="plus" onClick={openCreateModal}>
          Add Product
        </Button>
      </StickyFooter>
    )}
  </main>
</ProductScreen>
```

**ProductCard (Mobile):**

```tsx
<article className="card">
  <header className="card-header">
    <div>
      <h3 className="card-title">{product.name}</h3>
      {product.nameAlt && <p className="card-subtitle">{product.nameAm}</p>}
    </div>
    <StatusBadge status={product.status} />
  </header>
  <div className="card-meta flex items-baseline gap-md">
    <span className="tabular-nums font-mono text-lg font-semibold text-text">
      {formatCurrency(product.priceSantim)}
    </span>
    <span className="text-text-muted">{formatQuantity(product.stockMilli, product.unit)}</span>
    {isOwner && product.costSantim && (
      <span className="text-text-muted">Cost: {formatCurrency(product.costSantim)}</span>
    )}
  </div>
  <footer className="card-actions">
    <Button variant="ghost" size="sm" onClick={() => navigateToDetail(product.id)}>
      View
    </Button>
    {isOwner && (
      <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}>
        Edit
      </Button>
    )}
  </footer>
</article>
```

#### Desktop (≥ 1024px) — Data Table

```tsx
<ProductScreen>
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header>
      <Toolbar>
        <ProductSearchInput />
        <CategoryFilterSelect />
        <StatusFilterSelect />
        <Button variant="primary" icon="plus" onClick={openCreateModal}>
          Add Product
        </Button>
      </Toolbar>
    </Header>
    <main className="flex-1 overflow-auto p-md">
      <DataTable
        columns={[
          { key: "name", header: "Product Name", render: (p) => <ProductNameCell product={p} /> },
          { key: "sku", header: "SKU", className: "hidden md:table-cell" },
          { key: "category", header: "Category", className: "hidden lg:table-cell" },
          {
            key: "price",
            header: "Price (ETB)",
            className: "numeric",
            render: (p) => formatCurrency(p.priceSantim),
          },
          {
            key: "cost",
            header: "Cost (ETB)",
            className: "numeric hidden md:table-cell",
            render: (p) => (p.costSantim ? formatCurrency(p.costSantim) : "—"),
          },
          {
            key: "stock",
            header: "Stock Level",
            className: "numeric",
            render: (p) => <StockLevelCell product={p} />,
          },
          { key: "status", header: "Status", render: (p) => <StatusBadge status={p.status} /> },
          { key: "actions", header: "", render: (p) => <ActionMenu product={p} /> },
        ]}
        data={products}
        onRowClick={navigateToDetail}
        selectable
        onSelectionChange={setSelectedProducts}
      />
      {selectedProducts.length > 0 && (
        <BulkActionBar
          count={selectedProducts.length}
          onDelete={bulkDelete}
          onStatusChange={bulkStatusChange}
        />
      )}
    </main>
  </div>
</ProductScreen>
```

#### ProductFormModal (Create/Edit)

```tsx
// Mobile: Full-screen sheet. Desktop: Modal max-w-2xl
<Modal>
  <ModalHeader>
    <h2 className="heading2">{isEditing ? "Edit Product" : "Add Product"}</h2>
  </ModalHeader>
  <form className="space-y-md p-md" onSubmit={handleSubmit}>
    <div className="grid gap-md sm:grid-cols-2">
      <Field>
        <Label htmlFor="name">Name (English) *</Label>
        <Input id="name" required error={errors.name} />
      </Field>
      <Field>
        <Label htmlFor="nameAlt">Alternative Name (Amharic)</Label>
        <Input id="nameAlt" placeholder="ስም" />
      </Field>
      <Field>
        <Label htmlFor="unit">Unit of Measure *</Label>
        <UnitSelect id="unit" value={unit} onChange={setUnit} disabled={isEditing && hasStock} />
      </Field>
      <Field>
        <Label htmlFor="category">Category</Label>
        <Select id="category" options={categories} />
      </Field>
      <Field>
        <Label htmlFor="price">Price (ETB) *</Label>
        <CurrencyInput id="price" required error={errors.price} />
      </Field>
      {isOwner && (
        <Field>
          <Label htmlFor="cost">Cost (ETB) — Owner Only</Label>
          <CurrencyInput id="cost" error={errors.cost} />
        </Field>
      )}
      <Field className="sm:col-span-2">
        <Label htmlFor="lowStock">Low Stock Threshold</Label>
        <QuantityInput id="lowStock" unit={unit} value={lowStockMilli} />
      </Field>
    </div>
    <ModalFooter>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit" disabled={isSubmitting}>
        {isEditing ? "Save Changes" : "Create Product"}
      </Button>
    </ModalFooter>
  </form>
</Modal>
```

**UnitSelect:** Dropdown showing unit symbol + name (e.g., "📦 Piece (pcs)", "⚖️ Kilogram (kg)"). Immutable after creation if stock exists.

---

### 2.3 Stock Screen

**Route:** `/stock` | **Roles:** All (Owner: actions, Attendant: view only)

#### Mobile — Card List with Actions

```tsx
<StockScreen>
  <Header>
    <Title>Stock</Title>
    <SyncPill />
  </Header>
  <main className="p-md">
    <StockSummaryCards /> // Total SKUs, Low Stock Count
    <ProductStockCardList
      products={products}
      onReceive={openReceiveModal}
      onAdjust={openAdjustModal}
      onHistory={openHistoryDrawer}
    />
    {isOwner && (
      <StickyFooter>
        <div className="flex gap-sm">
          <Button variant="secondary" flex={1} icon="plus" onClick={openReceiveModal}>
            Receive Stock
          </Button>
          <Button variant="ghost" flex={1} icon="edit" onClick={openAdjustModal}>
            Adjust Stock
          </Button>
        </div>
      </StickyFooter>
    )}
  </main>
</StockScreen>
```

**ProductStockCard (Mobile):**

```tsx
<article className="card">
  <div className="flex items-start justify-between gap-sm">
    <div className="flex-1 min-w-0">
      <h3 className="card-title">{product.name}</h3>
      {product.nameAm && <p className="card-subtitle">{product.nameAm}</p>}
    </div>
    <StockLevelDisplay
      confirmed={product.confirmedStockMilli}
      projected={product.projectedStockMilli}
      unit={product.unit}
      lowStockThreshold={product.lowStockMilli}
    />
  </div>
  <div className="card-meta">
    <span>Unit: {unitLabel(product.unit)}</span>
    {isOwner && product.costSantim && (
      <span>Cost: {formatCurrency(product.costSantim)}/{unitSymbol}</span>
    )}
  </div>
  <footer className="card-actions">
    {isOwner && (
      <>
        <Button variant="secondary" size="sm" icon="download" onClick={() => openReceiveModal(product)}>
          Receive
        </Button>
        <Button variant="ghost" size="sm" icon="edit" onClick={() => openAdjustModal(product)}>
          Adjust
        </Button>
      </>
    }}
    <Button variant="ghost" size="sm" icon="clock" onClick={() => openHistoryDrawer(product)}>
      History
    </Button>
  </footer>
</article>
```

#### Desktop — Data Table + Right Drawer History

```tsx
<StockScreen>
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header>
      <Toolbar>
        <SearchInput placeholder="Search products..." />
        <StatusFilterSelect />
        <LowStockFilterCheckbox />
        <div className="flex gap-sm ml-auto">
          <Button variant="secondary" icon="download" onClick={openReceiveModal}>
            Receive Stock
          </Button>
          <Button variant="ghost" icon="edit" onClick={openAdjustModal}>
            Adjust Stock
          </Button>
        </div>
      </Toolbar>
    </Header>
    <main className="flex-1 flex overflow-hidden">
      <DataTable
        columns={[
          { key: "name", header: "Product", render: ProductNameCell },
          { key: "unit", header: "Unit", render: UnitBadge },
          { key: "confirmed", header: "Confirmed Stock", className: "numeric", render: StockCell },
          {
            key: "projected",
            header: "Projected",
            className: "numeric text-text-muted",
            render: ProjectedCell,
          },
          { key: "threshold", header: "Low Stock", className: "numeric", render: ThresholdCell },
          { key: "status", header: "Status", render: StatusBadge },
        ]}
        data={products}
        onRowClick={openHistoryDrawer}
      />
      <HistoryDrawer
        isOpen={!!selectedProduct}
        onClose={clearSelection}
        product={selectedProduct}
      />
    </main>
  </div>
</StockScreen>
```

#### ReceiveStockModal (Owner Only)

```tsx
<Modal>
  <ModalHeader>
    <h2>Receive Stock</h2>
  </ModalHeader>
  <form className="space-y-md p-md" onSubmit={handleSubmit}>
    <Field>
      <Label>Product *</Label>
      <ProductSelect required />
    </Field>
    <Field>
      <Label>Quantity *</Label>
      <QuantityInput unit={selectedProduct?.unit} />
    </Field>
    {selectedProduct?.packagings.length > 0 && (
      <Field>
        <Label>Packaging (Optional)</Label>
        <PackagingSelector packagings={selectedProduct.packagings} />
        {/* Shows: "3 crates = 36 pcs" live preview */}
      </Field>
    )}
    <Field>
      <Label>Unit Cost (ETB) — Optional</Label>
      <CurrencyInput placeholder="Updates latest known cost" />
    </Field>
    <Field>
      <Label>Notes</Label>
      <Textarea rows={3} placeholder="Supplier invoice #, delivery note..." />
    </Field>
    <ModalFooter>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit">
        Save Stock Receipt
      </Button>
    </ModalFooter>
  </form>
</Modal>
```

#### AdjustStockModal (Owner Only)

```tsx
<Modal>
  <ModalHeader>
    <h2>Adjust Stock</h2>
  </ModalHeader>
  <form className="space-y-md p-md" onSubmit={handleSubmit}>
    <Field>
      <Label>Product *</Label>
      <ProductSelect required />
    </Field>
    <Field>
      <Label>Quantity Change *</Label>
      <div className="flex gap-sm">
        <Select value={direction} onChange={setDirection} className="w-32">
          <option value="increase">+ Increase</option>
          <option value="decrease">− Decrease</option>
        </Select>
        <QuantityInput unit={selectedProduct?.unit} />
      </div>
    </Field>
    <Field>
      <Label>Reason *</Label>
      <Select
        required
        options={[
          { value: "DAMAGE", label: "Damage (Broken / spoiled)" },
          { value: "LOSS", label: "Loss (Theft / unexplained)" },
          { value: "CORRECTION", label: "Correction (Counting error)" },
          { value: "OTHER", label: "Other (Requires note)" },
        ]}
        onChange={handleReasonChange}
      />
    </Field>
    {reason === "OTHER" && (
      <Field>
        <Label>Note *</Label>
        <Textarea required rows={3} placeholder="Explain the adjustment..." />
      </Field>
    )}
    <ModalFooter>
      <Button variant="ghost" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" type="submit">
        Save Adjustment
      </Button>
    </ModalFooter>
  </form>
</Modal>
```

#### StockHistoryDrawer (Slide-out)

```tsx
<Drawer width="400px" side="right">
  <DrawerHeader>
    <h2 className="heading2">{product.name} — History</h2>
    <Button variant="ghost" icon="x" onClick={onClose} />
  </DrawerHeader>
  <div className="flex-1 overflow-y-auto p-md space-y-sm">
    {movements.map((m) => (
      <MovementRow key={m.id} movement={m} />
    ))}
    {movements.length === 0 && <EmptyState title="No movements yet" />}
  </div>
</Drawer>
```

**MovementRow:**

```tsx
<div className="flex items-start gap-sm p-sm border-b border-border last:border-0">
  <div className="shrink-0 w-20 tabular-nums text-text-muted text-sm">
    {formatTime(m.timestamp)}
  </div>
  <div className="flex-1 min-w-0">
    <div className="flex items-baseline gap-xs">
      <span
        className={cn("font-mono font-medium", m.deltaMilli > 0 ? "text-success" : "text-danger")}
      >
        {m.deltaMilli > 0 ? "+" : ""}
        {formatQuantity(m.deltaMilli, product.unit)}
      </span>
      <span className="text-text-secondary">{m.type}</span>
      {m.note && <span className="text-text-muted">({m.note})</span>}
    </div>
    <div className="flex items-center gap-xs text-xs text-text-muted">
      <span>{m.actorName}</span>
      <span>·</span>
      <span>{m.deviceName}</span>
    </div>
  </div>
  <div className="shrink-0 tabular-nums font-mono font-medium text-text">
    {formatQuantity(m.resultingBalance, product.unit)}
  </div>
</div>
```

---

### 2.4 Today / Dashboard Screen

**Route:** `/today` | **Roles:** All (Owner: full, Attendant: no valuation)

#### Mobile — Stacked Cards

```tsx
<TodayScreen>
  <Header>
    <Title>Today</Title>
    <SyncPill />
  </Header>
  <main className="p-md space-y-md">
    <DateSelector defaultDate={todayEAT} onChange={setDate} />
    <RevenueBuckets buckets={buckets} />
    {isOwner && <ValuationCard valuation={valuation} />}
    <LowStockList items={lowStock} onRestock={navigateToStock} />
    {isOwner && (
      <QuickActions>
        <Button variant="secondary" icon="download" onClick={openReceiveModal}>
          Receive Stock
        </Button>
        <Button variant="ghost" icon="edit" onClick={openAdjustModal}>
          Adjust Stock
        </Button>
        <Button variant="ghost" icon="download" onClick={exportCSV}>
          Export CSV
        </Button>
      </QuickActions>
    )}
  </main>
</TodayScreen>
```

#### RevenueBuckets Component (Always 3, Mutually Exclusive)

```tsx
<div className="grid gap-sm sm:grid-cols-3">
  <RevenueBucket
    variant="confirmed"
    label={t("dashboard.confirmedRevenue")}
    amount={confirmedSantim}
    count={confirmedCount}
    icon="check-circle"
  />
  <RevenueBucket
    variant="pending"
    label={t("dashboard.pendingRevenue")}
    amount={pendingSantim}
    count={pendingCount}
    icon="clock"
    subtitle={`${pendingCount} sales waiting to sync`}
  />
  <RevenueBucket
    variant="review"
    label={t("dashboard.needsReview")}
    amount={reviewSantim}
    count={reviewCount}
    icon="alert-circle"
    subtitle={`${reviewCount} transactions with stock conflict`}
    onClick={navigateToReview}
  />
</div>
```

**RevenueBucket Visual:**

```tsx
<article className={cn("card p-md", variantClasses[variant])}>
  <div className="flex items-center gap-sm mb-xs">
    <Icon name={icon} className={iconColor[variant]} />
    <h3 className="caption text-text-secondary">{label}</h3>
  </div>
  <div className="tabular-nums font-mono text-2xl font-bold text-text">
    {formatCurrency(amount)}
  </div>
  <div className="text-sm text-text-secondary">{count} sales</div>
  {subtitle && <div className="text-xs text-text-muted mt-xs">{subtitle}</div>}
</article>
```

#### ValuationCard (Owner Only)

```tsx
<article className="card p-md border-border">
  <div className="flex items-center justify-between mb-sm">
    <h3 className="heading2">Inventory Valuation</h3>
    <Tooltip trigger={<HelpIcon />}>
      Sum of (max qty, 0) × cost. Excludes items without cost.
    </Tooltip>
  </div>
  <div className="tabular-nums font-mono text-3xl font-bold text-text">{formatCurrency(total)}</div>
  <div className="flex flex-wrap gap-md mt-sm text-sm text-text-secondary">
    {uncostedCount > 0 && <span>⚠️ {uncostedCount} items have no cost recorded</span>}
    {approximateCount > 0 && <span>ℹ️ {approximateCount} items approximate</span>}
  </div>
  <Button variant="ghost" size="sm" className="mt-sm" onClick={openValuationDetail}>
    View Details
  </Button>
</article>
```

#### LowStockList

```tsx
<section>
  <div className="flex items-center justify-between mb-sm">
    <h3 className="heading2">Low Stock Warnings ({count})</h3>
    {count > 0 && (
      <Button variant="ghost" size="sm" onClick={navigateToStock}>
        View All
      </Button>
    )}
  </div>
  {items.map((item) => (
    <LowStockCard key={item.productId} item={item} onRestock={navigateToStock} />
  ))}
  {items.length === 0 && <EmptyState title="All stocked" icon="check-circle" />}
</section>
```

**LowStockCard:**

```tsx
<article className="card p-sm border-warning/20">
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-text">{item.name}</p>
      <p className="text-sm text-text-secondary">{item.nameAm}</p>
    </div>
    <StockLevelDisplay
      confirmed={item.qtyMilli}
      projected={item.projectedMilli}
      unit={item.unit}
      lowStockThreshold={item.threshold}
      showProjected={item.projectedMilli !== item.qtyMilli}
    />
  </div>
  <Button variant="secondary" size="sm" className="w-full mt-sm" onClick={onRestock}>
    Restock
  </Button>
</article>
```

---

### 2.5 Review / Conflict Screen (Owner Only)

**Route:** `/review` | **Roles:** Owner only

#### Mobile — Card List

```tsx
<ReviewScreen>
  <Header>
    <Title>Review Queue</Title>
    <SyncPill />
  </Header>
  <main className="p-md space-y-md">
    <SegmentedTabs value={tab} onChange={setTab} options={["Conflicts", "Quarantined"]} />
    {tab === "conflicts" ? (
      <ConflictCaseList cases={conflicts} onSelect={openCaseSheet} />
    ) : (
      <QuarantinedOpsList ops={quarantined} onAccept={handleAccept} onReject={handleReject} />
    )}
  </main>
</ReviewScreen>
```

#### ConflictCaseCard (Mobile)

```tsx
<article className="card border-danger/20">
  <header className="card-header">
    <div className="flex items-center gap-sm">
      <ConflictTypeBadge type={case.type} />
      <span className="text-sm text-text-muted">#{case.shortId}</span>
    </div>
    <ProductNameCell product={case.product} />
  </header>
  <div className="p-sm border-t border-border">
    <div className="flex items-baseline gap-sm mb-xs">
      <span className={cn("tabular-nums font-mono font-bold", case.balance < 0 ? 'text-danger' : 'text-success')}>
        {formatQuantity(case.balance, case.unit)}
      </span>
      <span className="text-text-muted">current balance</span>
    </div>
    <TimelinePreview events={case.timeline.slice(-3)} />
  </div>
  <footer className="card-actions">
    <Button variant="primary" size="sm" flex={1} onClick={() => openCaseSheet(case.id)}>
      Resolve
    </Button>
  </footer>
</article>
```

#### Desktop — Split-Pane (List Left, Detail Right)

```tsx
<ReviewScreen>
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header>
      <Title>Review Queue</Title>
      <SyncPill />
    </Header>
    <div className="flex-1 flex overflow-hidden">
      <aside className="w-96 border-r border-border overflow-y-auto">
        <Toolbar>
          <SegmentedTabs value={tab} options={["Conflicts", "Quarantined"]} />
        </Toolbar>
        <ConflictCaseList
          cases={filteredCases}
          onSelect={setSelectedCase}
          selected={selectedCaseId}
        />
      </aside>
      <main className="flex-1 overflow-y-auto p-md">
        {selectedCase ? (
          <ConflictCaseDetail
            case={selectedCase}
            onResolve={handleResolve}
            onClose={clearSelection}
          />
        ) : (
          <EmptyState
            title="Select a case"
            subtitle="Choose a case from the list to review and resolve"
          />
        )}
      </main>
    </div>
  </div>
</ReviewScreen>
```

#### ConflictCaseDetail (Desktop Drawer / Mobile Sheet)

```tsx
<Drawer width="480px" side="right">
  <DrawerHeader>
    <div>
      <ConflictTypeBadge type={case.type} />
      <span className="ml-sm text-sm text-text-muted">#{case.shortId}</span>
    </div>
    <h3 className="heading2 mt-xs">{case.productName}</h3>
    <Button variant="ghost" icon="x" onClick={onClose} />
  </DrawerHeader>
  <div className="flex-1 overflow-y-auto p-md space-y-lg">
    {/* Discrepancy Alert */}
    <Alert variant={case.balance < 0 ? 'danger' : 'warning'}>
      <AlertIcon />
      <div>
        <p className="font-medium">Discrepancy: Confirmed balance is <strong className="tabular-nums">{formatQuantity(case.balance, case.unit)}</strong></p>
        <p className="text-sm text-text-secondary mt-xs">Both sales occurred offline. Customers paid cash and received physical merchandise.</p>
      </div>
    </Alert>

    {/* Concurrent Timeline */}
    <section>
      <h4 className="caption text-text-secondary mb-sm">CONCURRENT TIMELINE</h4>
      <Timeline events={case.timeline} />
    </section>

    {/* Resolution Actions */}
    <section>
      <h4 className="caption text-text-secondary mb-sm">OWNER RESOLUTION ACTIONS</h4>
      <div className="space-y-sm">
        {case.type === 'OFFLINE_OVERSELL' && (
          <>
            <ResolutionActionCard
              icon="package"
              title="Record Restock / Found Stock"
              description="Add stock to reconcile shelf inventory"
              action={<RestockForm onSubmit={resolve('RECONCILE_STOCK')} />}
            />
            <ResolutionActionCard
              icon="undo"
              title="Cancel One Sale"
              description="Requires mandatory reason; reverses stock movement"
              action={<CancelSaleSelector sales={case.sales} onSubmit={resolve('CANCEL_SALE')} />}
            />
            <ResolutionActionCard
              icon="eye"
              title="Acknowledge & Keep Deficit"
              description="Closes case, accepts deficit for end-of-month audit"
              action={<AcknowledgeForm onSubmit={resolve('ACKNOWLEDGE')} />}
            />
          </>
        )}
        {case.type === 'AUTHORIZATION_REVIEW' && (
          <>
            <ResolutionActionCard
              icon="check"
              title="Accept Operation"
              description="Applies movements as the original actor"
              action={<Button variant="primary" onClick={() => resolve('ACCEPT_QUARANTINED')}>Accept</Button>}
            />
            <ResolutionActionCard
              icon="x"
              title="Reject Operation"
              description="Archives with reason; never deletes"
              action={<RejectForm onSubmit={resolve('REJECT_QUARANTINED')} />}
            />
          </>
        )}
      </div>
    </section>
  </div>
</Drawer>
```

---

### 2.6 Staff & Settings Screen

**Route:** `/settings` | **Roles:** Owner (full), Attendant (sync, export, profile only)

#### Owner View — Desktop

```tsx
<SettingsScreen>
  <Sidebar />
  <div className="flex-1 flex flex-col">
    <Header>
      <Title>Staff & Settings</Title>
      <SyncPill />
    </Header>
    <main className="flex-1 overflow-y-auto p-md space-y-xl max-w-4xl mx-auto w-full">
      {/* Active Attendants */}
      <section>
        <div className="flex items-center justify-between mb-md">
          <h2 className="heading2">Active Attendants ({activeCount}/5)</h2>
          <Button variant="primary" icon="plus" onClick={openInviteModal}>
            Invite New
          </Button>
        </div>
        <div className="space-y-sm">
          {attendants.map((a) => (
            <LeaseHealthRow key={a.id} attendant={a} onDeactivate={handleDeactivate} />
          ))}
        </div>
      </section>

      {/* Offline Storage & Lease Health */}
      <section className="card p-md">
        <h3 className="heading2 mb-md">Offline Storage & Lease Health</h3>
        <dl className="grid grid-cols-2 gap-sm text-sm">
          <dt className="text-text-secondary">Storage Used</dt>
          <dd className="tabular-nums font-mono text-text">
            {storageUsed} MB / {storageTotal} GB
          </dd>
          <dt className="text-text-secondary">Persistent Storage</dt>
          <dd className={persistentEnabled ? "text-success" : "text-warning"}>
            {persistentEnabled ? "Enabled (Safe from eviction)" : "Not Granted (Risk of data loss)"}
          </dd>
          <dt className="text-text-secondary">Current Lease</dt>
          <dd className="tabular-nums font-mono text-text">{leaseDaysRemaining} days remaining</dd>
        </dl>
      </section>

      {/* Emergency Backup & Export */}
      <section className="card p-md border-warning/20">
        <h3 className="heading2 mb-md flex items-center gap-sm">
          <WarningIcon className="text-warning" /> Emergency Backup & Export
        </h3>
        <p className="text-text-secondary mb-md">
          Export pending records before clearing or repairing this device. These records have not
          yet synchronized to the cloud.
        </p>
        <div className="flex gap-sm">
          <Button variant="secondary" icon="download" onClick={exportPendingJSON}>
            Export Pending Records as JSON
          </Button>
          <Button variant="ghost" icon="database" onClick={exportFullBackup}>
            Full Local Backup
          </Button>
        </div>
      </section>

      {/* App Settings */}
      <section>
        <h3 className="heading2 mb-md">App Preferences</h3>
        <SettingsForm>
          <Toggle label="Compact Table Density" />
          <Toggle label="Show Projected Stock in Lists" />
          <Select label="Date Format" options={["EAT (Ethiopia)", "UTC"]} />
          <Select label="Language" options={["English", "Amharic"]} />
        </SettingsForm>
      </section>
    </main>
  </div>
</SettingsScreen>
```

#### Attendant View — Mobile Only

```tsx
<SettingsScreen>
  <Header>
    <Title>Settings</Title>
    <SyncPill />
  </Header>
  <main className="p-md space-y-lg">
    <section className="card p-md">
      <h3 className="heading2 mb-md">Sync Status</h3>
      <SyncPillDetail /> // Full popover content inline
      <Button variant="primary" className="w-full mt-md" onClick={syncNow}>
        Sync Now
      </Button>
    </section>
    <section className="card p-md">
      <h3 className="heading2 mb-md">Storage</h3>
      <StorageInfo />
      {persistentEnabled ? (
        <Badge variant="success" className="mt-sm">
          Persistent storage enabled
        </Badge>
      ) : (
        <Button variant="secondary" className="w-full mt-sm" onClick={requestPersistence}>
          Enable Persistent Storage
        </Button>
      )}
    </section>
    <section className="card p-md">
      <h3 className="heading2 mb-md">Data</h3>
      <Button variant="secondary" icon="download" className="w-full" onClick={exportPendingJSON}>
        Export Pending Records
      </Button>
    </section>
    <section className="card p-md border-danger/20">
      <Button variant="destructive" className="w-full" onClick={signOut}>
        Sign Out
      </Button>
      <p className="text-xs text-text-muted text-center mt-xs">
        Local data is preserved. Sign in again to sync.
      </p>
    </section>
  </main>
  <BottomTabBar /> // Standard attendant tabs
</SettingsScreen>
```

---

### 2.7 Auth & Onboarding Flows

#### Sign In Flow (All Users)

```tsx
// Step 1: Email/Google Sign In
<AuthScreen>
  <div className="max-w-md mx-auto p-xl space-y-lg">
    <div className="text-center">
      <Logo className="mx-auto mb-md" />
      <h1 className="heading1">Welcome to Stokari</h1>
      <p className="text-text-secondary">Sign in to access your shop</p>
    </div>
    <GoogleSignInButton
      onSuccess={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full"
    />
    <p className="text-xs text-text-muted text-center">
      By continuing, you agree to our Terms of Service and Privacy Policy.
    </p>
  </div>
</AuthScreen>

// Step 2: Multi-Shop Selection (if applicable)
<AuthScreen>
  <div className="max-w-md mx-auto p-xl space-y-lg">
    <h2 className="heading2">Select Your Shop</h2>
    <ul className="space-y-sm">
      {memberships.map(m => (
        <li key={m.id}>
          <button className="w-full text-left p-md card hover:bg-surface-subtle rounded-md" onClick={() => selectMembership(m.id)}>
            <div className="font-medium">{m.shopName}</div>
            <div className="text-sm text-text-secondary">{m.role} · {m.deviceCount} device(s)</div>
          </button>
        </li>
      ))}
    </ul>
  </div>
</AuthScreen>
```

#### Create Shop Flow (First-Time Owner)

```tsx
<OnboardingScreen>
  <div className="max-w-md mx-auto p-xl space-y-lg">
    <div className="text-center">
      <Logo className="mx-auto mb-md" />
      <h1 className="heading1">Create Your Shop</h1>
      <p className="text-text-secondary">You'll become the owner</p>
    </div>
    <form className="space-y-md" onSubmit={handleCreate}>
      <Field>
        <Label htmlFor="shopName">Shop Name *</Label>
        <Input id="shopName" required placeholder="Central Kiosk" autoComplete="off" />
      </Field>
      <Button variant="primary" type="submit" className="w-full" disabled={isSubmitting}>
        Create Shop
      </Button>
    </form>
  </div>
</OnboardingScreen>
```

#### Accept Invite Flow (Attendant)

```tsx
<OnboardingScreen>
  <div className="max-w-md mx-auto p-xl space-y-lg">
    <div className="text-center">
      <Logo className="mx-auto mb-md" />
      <h1 className="heading1">Join {shopName}</h1>
      <p className="text-text-secondary">Invited as Attendant by {ownerName}</p>
    </div>
    <Button variant="primary" className="w-full" onClick={acceptInvite} disabled={isLoading}>
      Accept & Join Shop
    </Button>
    <Button variant="ghost" className="w-full" onClick={declineInvite}>
      Decline
    </Button>
  </div>
</OnboardingScreen>
```

---

## 3. State Handling Requirements (Per Screen)

Every screen MUST implement these states:

| Screen   | Loading                | Error                 | Empty                            | Populated               |
| -------- | ---------------------- | --------------------- | -------------------------------- | ----------------------- |
| Sell     | Skeleton cart + search | Inline banner + retry | "Cart empty" + quick chips       | Full cart with totals   |
| Products | Skeleton cards/table   | Inline banner + retry | "No products. Add first." + CTA  | List/Table with density |
| Stock    | Skeleton cards/table   | Inline banner + retry | "No stock tracked"               | Levels + actions        |
| Today    | Skeleton buckets       | Inline banner + retry | "No sales today"                 | 3 buckets + valuation   |
| Review   | Skeleton case cards    | Inline banner + retry | "No conflicts" (celebration)     | Case list + detail      |
| Staff    | Skeleton rows          | Inline banner + retry | "No attendants yet" + Invite CTA | Attendant rows + health |

---

## 4. Navigation Flows

### Attendant Primary Flow

```
Sign In → Select Shop → Sell (default tab)
  ↓
Products (browse) ←→ Stock (view) ←→ Today (view) ←→ More (sync, export, profile)
```

### Owner Primary Flow

```
Sign In → Select Shop → Today (default)
  ↓
Sidebar: Sell | Products | Stock | Today | Review(badge) | Staff | Settings
  ↓
Review → Case Detail (drawer) → Resolve
Staff → Invite / Deactivate / Lease Health
Settings → Sync / Backup / Preferences
```

### Deep Links (for notifications)

- `stokari://review/{caseId}` → Opens Review screen with case detail
- `stokari://product/{productId}` → Opens Product detail
- `stokari://sync` → Opens Settings > Sync

---

## 5. Component Reusability Matrix

| Component             | Sell | Products  | Stock     | Today    | Review | Staff |
| --------------------- | ---- | --------- | --------- | -------- | ------ | ----- |
| `SyncPill`            | ✅   | ✅        | ✅        | ✅       | ✅     | ✅    |
| `ProductSearch`       | ✅   | ✅        | ✅        | ❌       | ❌     | ❌    |
| `QuantityInput`       | ✅   | ✅        | ✅        | ❌       | ✅     | ❌    |
| `CurrencyInput`       | ❌   | ✅        | ✅        | ❌       | ❌     | ❌    |
| `DataTable`           | ❌   | ✅ Owner  | ✅ Owner  | ✅ Owner | ✅     | ✅    |
| `ProductCard`         | ❌   | ✅ Mobile | ✅ Mobile | ❌       | ❌     | ❌    |
| `RevenueBucket`       | ❌   | ❌        | ❌        | ✅       | ❌     | ❌    |
| `ValuationCard`       | ❌   | ❌        | ❌        | ✅ Owner | ❌     | ❌    |
| `ConflictCaseCard`    | ❌   | ❌        | ❌        | ❌       | ✅     | ❌    |
| `LeaseHealthRow`      | ❌   | ❌        | ❌        | ❌       | ❌     | ✅    |
| `StockLevelDisplay`   | ❌   | ✅        | ✅        | ✅       | ✅     | ❌    |
| `StatusBadge`         | ✅   | ✅        | ✅        | ✅       | ✅     | ✅    |
| `UnitBadge`           | ✅   | ✅        | ✅        | ❌       | ✅     | ❌    |
| `PaymentSelector`     | ✅   | ❌        | ❌        | ❌       | ❌     | ❌    |
| `QuantityKeypadSheet` | ✅   | ✅        | ✅        | ❌       | ✅     | ❌    |
| `SellAnywaySheet`     | ✅   | ❌        | ❌        | ❌       | ❌     | ❌    |
| `HistoryDrawer`       | ❌   | ❌        | ✅        | ❌       | ✅     | ❌    |

---

## 6. Visual Regression Test Cases

Each component must have visual regression tests for:

1. **All 4 data states** (loading, error, empty, populated)
2. **All responsive breakpoints** (320px, 640px, 1024px, 1440px)
3. **All role variations** (Attendant vs Owner)
4. **All theme variations** (Light only — dark mode NOT supported)
5. **All i18n variations** (English + Amharic — test text overflow)
6. **Focus states** (Tab navigation visible)
7. **Reduced motion** (Animations disabled)

---

## 7. Performance Budgets (Per Screen)

| Screen                | Target                      | Measurement                 |
| --------------------- | --------------------------- | --------------------------- |
| Sell                  | < 100ms interaction latency | Keystroke → cart update     |
| Products (2000 items) | < 1s search + render        | Keystroke → filtered list   |
| Stock (2000 items)    | < 1s table render           | Mount → interactive         |
| Today                 | < 200ms                     | Mount → buckets visible     |
| Review (50 cases)     | < 300ms                     | Mount → list + first detail |
| Settings              | < 100ms                     | Mount → interactive         |

---

## 8. Implementation Priority Order

1. **Sell Screen** (core revenue flow, hardest mobile ergonomics)
2. **Products Screen** (data foundation for Sell/Stock)
3. **Stock Screen** (receive/adjust + history)
4. **Today Dashboard** (3-bucket logic, valuation)
5. **Review Screen** (conflict resolution — most complex logic)
6. **Staff/Settings** (admin, lower frequency)
7. **Auth/Onboarding** (one-time flows)
