import { describe, it, expect } from "vite-plus/test";
import { canonicalJson, sha256Hex, sha256Base64Url, hashOperation } from "../canonical_json";

describe("RFC 8785 Canonical JSON & SHA-256 Hashing", () => {
  it("sorts object keys lexicographically regardless of insertion order", () => {
    const a = { b: 2, a: 1, c: { y: 20, x: 10 } };
    const b = { c: { x: 10, y: 20 }, a: 1, b: 2 };

    expect(canonicalJson(a)).toBe(canonicalJson(b));
    expect(canonicalJson(a)).toBe('{"a":1,"b":2,"c":{"x":10,"y":20}}');
  });

  it("omits undefined properties and preserves nulls", () => {
    const obj = { defined: "yes", absent: undefined, empty: null };
    expect(canonicalJson(obj)).toBe('{"defined":"yes","empty":null}');
  });

  it("handles arrays deterministically", () => {
    const arr = [3, 2, 1, { b: 2, a: 1 }];
    expect(canonicalJson(arr)).toBe('[3,2,1,{"a":1,"b":2}]');
  });

  it("hashes canonical json deterministically", async () => {
    const op1 = await hashOperation("CreateProduct", { name: "Teff", price_santim: 8000 });
    const op2 = await hashOperation("CreateProduct", { price_santim: 8000, name: "Teff" });

    expect(op1.hash).toBe(op2.hash);
    expect(op1.canonical).toBe(
      '{"payload":{"name":"Teff","price_santim":8000},"type":"CreateProduct"}',
    );
  });

  it("generates valid sha256 hex and base64url strings", async () => {
    const hex = await sha256Hex("hello world");
    expect(hex).toMatch(/^[0-9a-f]{64}$/);

    const b64 = await sha256Base64Url("hello world");
    expect(b64.includes("+")).toBe(false);
    expect(b64.includes("/")).toBe(false);
    expect(b64.includes("=")).toBe(false);
  });
});
