import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vite-plus/test";
import { clearRecentProducts, getRecentProductIds, recordRecentProduct } from "../recent-products";

describe("Recent Products Persistence (VS-10-03 / Task #49)", () => {
  const shopId = "test_shop_recents";

  beforeEach(async () => {
    await clearRecentProducts(shopId);
  });

  it("returns empty array when no recent products exist", async () => {
    const list = await getRecentProductIds(shopId);
    expect(list).toEqual([]);
  });

  it("records recent products in MRU order (most recently used first)", async () => {
    await recordRecentProduct(shopId, "prod_1");
    await recordRecentProduct(shopId, "prod_2");
    await recordRecentProduct(shopId, "prod_3");

    const list = await getRecentProductIds(shopId);
    expect(list).toEqual(["prod_3", "prod_2", "prod_1"]);
  });

  it("deduplicates already visited products and bumps to the front", async () => {
    await recordRecentProduct(shopId, "prod_1");
    await recordRecentProduct(shopId, "prod_2");
    await recordRecentProduct(shopId, "prod_1"); // re-record prod_1

    const list = await getRecentProductIds(shopId);
    expect(list).toEqual(["prod_1", "prod_2"]);
  });

  it("caps the recent products list at exactly 6 items", async () => {
    for (let i = 1; i <= 10; i++) {
      await recordRecentProduct(shopId, `prod_${i}`);
    }

    const list = await getRecentProductIds(shopId);
    expect(list.length).toBe(6);
    expect(list).toEqual(["prod_10", "prod_9", "prod_8", "prod_7", "prod_6", "prod_5"]);
  });
});
