import type { Product } from "./types";
import { normalizeSearchText } from "../../core/search/normalize";

interface TrieNode {
  children: Map<string, TrieNode>;
  productIds: Set<string>;
}

/**
 * High-speed in-memory prefix trie search index for product catalog.
 * Supports bilingual search (Latin and Amharic with homophone & labialized velar folding).
 * Designed for sub-50ms query latency on mobile hardware for 2,000+ cached products.
 */
export class ProductSearchIndex {
  private productsById = new Map<string, Product>();
  private root: TrieNode = { children: new Map(), productIds: new Set() };

  constructor(products: Product[] = []) {
    if (products.length > 0) {
      this.indexProducts(products);
    }
  }

  public indexProducts(products: Product[]): void {
    this.clear();
    for (const product of products) {
      this.addProduct(product);
    }
  }

  public addProduct(product: Product): void {
    this.productsById.set(product.id, product);

    // Extract all searchable text fields: name, nameAlt, sku, barcode, category
    const searchableTexts = [
      product.name,
      product.nameAlt ?? "",
      product.sku ?? "",
      product.barcode ?? "",
      product.category,
    ];

    for (const text of searchableTexts) {
      if (!text) continue;
      const normalized = normalizeSearchText(text);
      if (!normalized) continue;
      const tokens = normalized.split(/\s+/).filter(Boolean);

      // Index whole normalized text string
      this.insertToken(normalized, product.id);
      // Index each individual token
      for (const token of tokens) {
        this.insertToken(token, product.id);
      }
    }
  }

  private insertToken(token: string, productId: string): void {
    let current = this.root;
    current.productIds.add(productId);

    for (const char of token) {
      let next = current.children.get(char);
      if (!next) {
        next = { children: new Map(), productIds: new Set() };
        current.children.set(char, next);
      }
      next.productIds.add(productId);
      current = next;
    }
  }

  public search(query: string, limit = 50): Product[] {
    const trimmed = query.trim();
    if (!trimmed) {
      return Array.from(this.productsById.values()).slice(0, limit);
    }

    const normalizedQuery = normalizeSearchText(trimmed);
    const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);
    if (queryTokens.length === 0) {
      return [];
    }

    // For each token, find matching product IDs in the trie
    let candidateIds: Set<string> | null = null;

    for (const token of queryTokens) {
      const tokenMatches = this.findMatchingProductIds(token);
      if (candidateIds === null) {
        candidateIds = new Set(tokenMatches);
      } else {
        // Intersect matches
        const nextSet = new Set<string>();
        for (const id of candidateIds) {
          if (tokenMatches.has(id)) {
            nextSet.add(id);
          }
        }
        candidateIds = nextSet;
      }
      if (candidateIds.size === 0) {
        break;
      }
    }

    if (!candidateIds || candidateIds.size === 0) {
      return [];
    }

    const results: Product[] = [];
    for (const id of candidateIds) {
      const prod = this.productsById.get(id);
      if (prod) {
        results.push(prod);
        if (results.length >= limit) break;
      }
    }
    return results;
  }

  private findMatchingProductIds(token: string): Set<string> {
    let current = this.root;
    for (const char of token) {
      const next = current.children.get(char);
      if (!next) {
        return new Set();
      }
      current = next;
    }
    return current.productIds;
  }

  public clear(): void {
    this.productsById.clear();
    this.root = { children: new Map(), productIds: new Set() };
  }

  public get size(): number {
    return this.productsById.size;
  }
}
