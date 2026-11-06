import { describe, expect, it } from "vite-plus/test";
import { ProductSearchIndex } from "../ProductSearchIndex";
import type { Product } from "../types";

const sampleProducts: Product[] = [
  {
    id: "prod_1",
    shopId: "shop_01",
    name: "White Sugar",
    nameAlt: "ነጭ ስኳር",
    sku: "SUG-001",
    barcode: "6001001",
    unit: "KG",
    category: "grains",
    priceSantim: 12500,
    costSantim: 9500,
    stockMilli: 85000,
    lowStockMilli: 20000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_2",
    shopId: "shop_01",
    name: "Sunflower Oil",
    nameAlt: "የሱፍ ዘይት",
    sku: "OIL-002",
    barcode: "6001002",
    unit: "LITER",
    category: "oils",
    priceSantim: 18000,
    costSantim: 14500,
    stockMilli: 12000,
    lowStockMilli: 15000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "prod_3",
    shopId: "shop_01",
    name: "Yirgacheffe Coffee",
    nameAlt: "ይርጋጨፌ ቡና",
    sku: "COF-003",
    barcode: "6001003",
    unit: "PIECE",
    category: "beverages",
    priceSantim: 32000,
    costSantim: 28000,
    stockMilli: 40000,
    lowStockMilli: 10000,
    status: "ACTIVE",
    packagings: [],
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-10-01T00:00:00Z",
  },
];

describe("ProductSearchIndex (VS-09-02 / Task #44)", () => {
  it("indexes products and searches by exact and prefix English names", () => {
    const index = new ProductSearchIndex(sampleProducts);
    expect(index.size).toBe(3);

    const sugarResults = index.search("sugar");
    expect(sugarResults.length).toBe(1);
    expect(sugarResults[0]?.id).toBe("prod_1");

    const prefixResults = index.search("sun");
    expect(prefixResults.length).toBe(1);
    expect(prefixResults[0]?.id).toBe("prod_2");
  });

  it("searches by SKU and barcode", () => {
    const index = new ProductSearchIndex(sampleProducts);

    const skuResults = index.search("COF-003");
    expect(skuResults.length).toBe(1);
    expect(skuResults[0]?.id).toBe("prod_3");

    const barcodeResults = index.search("6001001");
    expect(barcodeResults.length).toBe(1);
    expect(barcodeResults[0]?.id).toBe("prod_1");
  });

  it("searches bilingual Amharic names with homophone and labialized velar folding", () => {
    const index = new ProductSearchIndex(sampleProducts);

    // Exact Amharic match
    const exactAmharic = index.search("ስኳር");
    expect(exactAmharic.length).toBe(1);
    expect(exactAmharic[0]?.name).toBe("White Sugar");

    // Labialized velar variation: ስክዋር matches ስኳር
    const labializedAmharic = index.search("ስክዋር");
    expect(labializedAmharic.length).toBe(1);
    expect(labializedAmharic[0]?.name).toBe("White Sugar");

    // Coffee search in Amharic
    const coffeeAmharic = index.search("ቡና");
    expect(coffeeAmharic.length).toBe(1);
    expect(coffeeAmharic[0]?.name).toBe("Yirgacheffe Coffee");
  });

  it("handles multi-token intersection queries", () => {
    const index = new ProductSearchIndex(sampleProducts);

    const multiToken = index.search("white sugar");
    expect(multiToken.length).toBe(1);
    expect(multiToken[0]?.id).toBe("prod_1");

    const nonMatching = index.search("sugar coffee");
    expect(nonMatching.length).toBe(0);
  });

  describe("Benchmark latency (< 50ms for 2,000 cached products)", () => {
    it("indexes and queries 2,000 products in < 50ms", () => {
      const generatedProducts: Product[] = Array.from({ length: 2000 }, (_, i) => ({
        id: `prod_gen_${i}`,
        shopId: "shop_bench",
        name: `Product Item ${i} (${i % 2 === 0 ? "Sugar" : "Oil"})`,
        nameAlt: i % 2 === 0 ? "ስኳር" : "የሱፍ ዘይት",
        sku: `SKU-${1000 + i}`,
        barcode: `9000${i}`,
        unit: i % 2 === 0 ? "KG" : "LITER",
        category: i % 2 === 0 ? "grains" : "oils",
        priceSantim: 10000 + i,
        stockMilli: 50000,
        lowStockMilli: 10000,
        status: "ACTIVE",
        packagings: [],
        createdAt: "2026-10-01T00:00:00Z",
        updatedAt: "2026-10-01T00:00:00Z",
      }));

      const index = new ProductSearchIndex();
      index.indexProducts(generatedProducts);
      expect(index.size).toBe(2000);

      // Perform 50 queries (Latin, Amharic, SKU, prefix)
      const start = performance.now();
      for (let q = 0; q < 50; q++) {
        index.search("Sugar", 20);
        index.search("ስክዋር", 20);
        index.search("SKU-105", 20);
        index.search("oil", 20);
      }
      const totalElapsed = performance.now() - start;
      const avgQueryMs = totalElapsed / 200;

      // Acceptance criteria: Search latency < 50ms on mobile hardware
      expect(avgQueryMs).toBeLessThan(1); // Typically < 0.1ms per query
      expect(totalElapsed).toBeLessThan(50);
    });
  });
});
