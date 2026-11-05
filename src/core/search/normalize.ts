/**
 * Ethiopic homophone canonical mapping map.
 * Folds:
 * 1. ሐ / ኀ families into ሀ family
 * 2. ሠ family into ሰ family
 * 3. ዐ family into አ family
 * 4. ፀ family into ጸ family
 */
const ETHIOPIC_HOMOPHONE_MAP: Record<string, string> = {
  // ሐ -> ሀ
  ሐ: "ሀ",
  ሑ: "ሁ",
  ሒ: "ሂ",
  ሓ: "ሃ",
  ሔ: "ሄ",
  ሕ: "ህ",
  ሖ: "ሆ",
  ሗ: "ኋ",
  // ኀ -> ሀ
  ኀ: "ሀ",
  ኁ: "ሁ",
  ኂ: "ሂ",
  ኃ: "ሃ",
  ኄ: "ሄ",
  ኅ: "ህ",
  ኆ: "ሆ",
  // ሠ -> ሰ
  ሠ: "ሰ",
  ሡ: "ሱ",
  ሢ: "ሲ",
  ሣ: "ሳ",
  ሤ: "ሴ",
  ሥ: "ስ",
  ሦ: "ሶ",
  ሧ: "ሷ",
  // ዐ -> አ
  ዐ: "አ",
  ዑ: "ኡ",
  ዒ: "ኢ",
  ዓ: "ኣ",
  ዔ: "ኤ",
  ዕ: "እ",
  ዖ: "ኦ",
  // ፀ -> ጸ
  ፀ: "ጸ",
  ፁ: "ጹ",
  ፂ: "ጺ",
  ፃ: "ጻ",
  ፄ: "ጼ",
  ፅ: "ጽ",
  ፆ: "ጾ",
};

/**
 * Normalizes search text for bilingual Ethiopic (Amharic) and Latin search.
 * - Converts Latin to lowercase and removes combining diacritics.
 * - Folds Ethiopic homophones to their canonical forms (ሀ, ሰ, አ, ጸ).
 * - Collapses consecutive whitespace.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";

  // 1. Lowercase and strip Latin diacritics
  const latinNormalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // 2. Fold Ethiopic homophones
  let result = "";
  for (const char of latinNormalized) {
    result += ETHIOPIC_HOMOPHONE_MAP[char] ?? char;
  }

  // 3. Trim and collapse whitespace
  return result.replace(/\s+/g, " ").trim();
}

/**
 * Returns true if the normalized target contains the normalized query.
 */
export function matchesSearch(target: string, query: string): boolean {
  if (!query) return true;
  if (!target) return false;
  return normalizeSearchText(target).includes(normalizeSearchText(query));
}
