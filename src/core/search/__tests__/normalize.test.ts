import { describe, it, expect } from "vite-plus/test";
import { normalizeSearchText, matchesSearch } from "../normalize";

describe("Bilingual Search Normalization (Amharic + Latin)", () => {
  describe("Ethiopic homophone folding", () => {
    it("folds ሐ and ኀ to ሀ", () => {
      expect(normalizeSearchText("ሐበሻ")).toBe("ሀበሻ");
      expect(normalizeSearchText("ኀይል")).toBe("ሀይል");
    });

    it("folds ሠ to ሰ", () => {
      expect(normalizeSearchText("ሠላም")).toBe("ሰላም");
      expect(normalizeSearchText("ንግሥት")).toBe("ንግስት");
    });

    it("folds ዐ to አ", () => {
      expect(normalizeSearchText("ዐይነት")).toBe("አይነት");
      expect(normalizeSearchText("ዓለም")).toBe("ኣለም");
    });

    it("folds ፀ to ጸ", () => {
      expect(normalizeSearchText("ፀሐይ")).toBe("ጸሀይ");
      expect(normalizeSearchText("ጽዳት")).toBe("ጽዳት");
    });

    it("matches query regardless of homophone variation", () => {
      expect(matchesSearch("ሠላም ጤና ይስጥልኝ", "ሰላም")).toBe(true);
      expect(matchesSearch("ፀሐይ ዘይት", "ጸሀይ")).toBe(true);
      expect(matchesSearch("ስኳር", "ስኳር")).toBe(true);
    });
  });

  describe("Latin normalization", () => {
    it("lowercases and removes accents", () => {
      expect(normalizeSearchText("Café au Lait")).toBe("cafe au lait");
      expect(normalizeSearchText("RICE 25KG")).toBe("rice 25kg");
    });

    it("collapses multi-space whitespace", () => {
      expect(normalizeSearchText("  Sunflower   Oil   1L  ")).toBe("sunflower oil 1l");
    });
  });
});
