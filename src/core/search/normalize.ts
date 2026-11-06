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

const HOMOPHONE_REGEX = /[ሐ-ሗኀ-ኆሠ-ሧዐ-ዖፀ-ፆ]/g;

const LABIALIZED_DIGRAPH_REGEX = /(?:ክ|ቅ|ግ|ህ|ም|ር|ስ|ሽ|ብ|ት|ች|ን|ኝ|ዝ|ዥ|ድ|ጅ|ጥ|ጭ|ጵ|ጽ|ፍ)ዋ/g;

const LABIALIZED_DIGRAPH_MAP: Record<string, string> = {
  ክዋ: "ኳ",
  ቅዋ: "ቋ",
  ግዋ: "ጓ",
  ህዋ: "ኋ",
  ምዋ: "ሟ",
  ርዋ: "ሯ",
  ስዋ: "ሷ",
  ሽዋ: "ሿ",
  ብዋ: "ቧ",
  ትዋ: "ቷ",
  ችዋ: "ቿ",
  ንዋ: "ኗ",
  ኝዋ: "ኟ",
  ዝዋ: "ዟ",
  ዥዋ: "ዧ",
  ድዋ: "ዷ",
  ጅዋ: "ጇ",
  ጥዋ: "ጧ",
  ጭዋ: "ጯ",
  ጵዋ: "ጷ",
  ጽዋ: "ጿ",
  ፍዋ: "ፏ",
};

/**
 * Normalizes search text for bilingual Ethiopic (Amharic) and Latin search.
 * - Converts Latin to lowercase and removes combining diacritics.
 * - Folds Ethiopic homophones to their canonical forms (ሀ, ሰ, አ, ጸ).
 * - Folds labialized digraphs (e.g., ክዋ -> ኳ) for interchangeable queries.
 * - Collapses consecutive whitespace.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return "";

  // Fast path for ASCII strings
  const hasExtended = /[\u0080-\uFFFF]/.test(text);
  if (!hasExtended) {
    return text.toLowerCase().replace(/\s+/g, " ").trim();
  }

  // 1. Lowercase and strip Latin diacritics only when accented characters exist
  const hasAccents = /[\u00C0-\u024F]/.test(text);
  const latinNormalized = hasAccents
    ? text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
    : text.toLowerCase();

  // Fast check: if no Ethiopic characters, skip Ethiopic folding
  const hasEthiopic = /[\u1200-\u137F]/.test(latinNormalized);
  if (!hasEthiopic) {
    return latinNormalized.replace(/\s+/g, " ").trim();
  }

  // 2. Fold Ethiopic homophones via high-performance targeted regex
  const homophoneFolded = latinNormalized.replace(
    HOMOPHONE_REGEX,
    (char) => ETHIOPIC_HOMOPHONE_MAP[char] ?? char,
  );

  // 3. Fold labialized digraphs in a single regex pass
  const result = homophoneFolded.replace(
    LABIALIZED_DIGRAPH_REGEX,
    (match) => LABIALIZED_DIGRAPH_MAP[match] ?? match,
  );

  // 4. Trim and collapse whitespace
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
