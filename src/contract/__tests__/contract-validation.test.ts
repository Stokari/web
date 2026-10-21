import { describe, it, expect, beforeAll } from "vite-plus/test";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_FIXTURES = path.resolve(__dirname, "../../../contract/fixtures");
const MONOREPO_FIXTURES = path.resolve(__dirname, "../../../../contract/fixtures");
const FIXTURES_DIR = fs.existsSync(LOCAL_FIXTURES) ? LOCAL_FIXTURES : MONOREPO_FIXTURES;

interface MoneyVector {
  name: string;
  input: number | string;
  expected_santim?: number;
  expected_formatted?: string;
  should_fail?: boolean;
  error_code?: string;
}

interface QuantityVector {
  name: string;
  input: number | string;
  unit: string;
  expected_milli?: number;
  expected_formatted?: string;
  should_fail?: boolean;
  error_code?: string;
}

interface PayloadHashVector {
  name: string;
  type: string;
  payload: unknown;
  expected_hash: string;
}

interface ErrorCode {
  code: string;
  http_status: number;
  title: string;
  description: string;
}

interface SampleOperation {
  type: string;
  payload: unknown;
}

function loadFixture<T>(name: string): T {
  const filePath = path.join(FIXTURES_DIR, name);
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as T;
}

describe("Contract Validation", () => {
  let moneyVectors: MoneyVector[];
  let quantityVectors: QuantityVector[];
  let payloadHashVectors: PayloadHashVector[];
  let errorCodes: Record<string, ErrorCode>;
  let permissions: Record<string, string[]>;
  let sampleOperations: Record<string, SampleOperation>;

  beforeAll(() => {
    moneyVectors = loadFixture("money-vectors.json");
    quantityVectors = loadFixture("quantity-vectors.json");
    payloadHashVectors = loadFixture("payload-hash-vectors.json");
    errorCodes = loadFixture("error-codes.json");
    permissions = loadFixture("permissions.json");

    sampleOperations = {};
    const sampleOpsDir = path.join(FIXTURES_DIR, "sample-operations");
    if (fs.existsSync(sampleOpsDir)) {
      const files = fs.readdirSync(sampleOpsDir).filter((f: string) => f.endsWith(".json"));
      for (const file of files) {
        const op = loadFixture<SampleOperation>(`sample-operations/${file}`);
        sampleOperations[file.replace(".json", "")] = op;
      }
    }
  });

  describe("Money Vectors Fixture Structure", () => {
    it("has valid structure for all vectors", () => {
      for (const vector of moneyVectors) {
        expect(vector.name).toBeTypeOf("string");
        expect(vector.name.length).toBeGreaterThan(0);
        expect(["number", "string"]).toContain(typeof vector.input);

        if (!vector.should_fail) {
          expect(vector.expected_santim).toBeTypeOf("number");
          expect(vector.expected_santim!).toBeGreaterThanOrEqual(0);
          expect(vector.expected_santim!).toBeLessThanOrEqual(99_999_999_999);
          expect(vector.expected_formatted).toBeTypeOf("string");
        } else {
          expect(vector.error_code).toBeTypeOf("string");
        }
      }
    });

    it("has at least one valid and one invalid vector", () => {
      const valid = moneyVectors.filter((v) => !v.should_fail);
      const invalid = moneyVectors.filter((v) => v.should_fail);
      expect(valid.length).toBeGreaterThan(0);
      expect(invalid.length).toBeGreaterThan(0);
    });

    it("valid vectors have consistent expected values", () => {
      for (const vector of moneyVectors) {
        if (
          !vector.should_fail &&
          vector.expected_santim !== undefined &&
          vector.expected_formatted !== undefined
        ) {
          const expectedFormatted = (vector.expected_santim! / 100).toFixed(2);
          expect(vector.expected_formatted).toBe(expectedFormatted);
        }
      }
    });
  });

  describe("Quantity Vectors Fixture Structure", () => {
    it("has valid structure for all vectors", () => {
      for (const vector of quantityVectors) {
        expect(vector.name).toBeTypeOf("string");
        expect(vector.name.length).toBeGreaterThan(0);
        expect(["number", "string"]).toContain(typeof vector.input);
        expect(vector.unit).toBeTypeOf("string");
        expect(["PIECE", "KG", "LITER", "METER"]).toContain(vector.unit);

        if (!vector.should_fail) {
          expect(vector.expected_milli).toBeTypeOf("number");
          expect(vector.expected_milli!).toBeGreaterThanOrEqual(0);
          expect(vector.expected_milli!).toBeLessThanOrEqual(1_000_000_000);
          expect(vector.expected_formatted).toBeTypeOf("string");
        } else {
          expect(vector.error_code).toBeTypeOf("string");
        }
      }
    });

    it("has at least one valid and one invalid vector", () => {
      const valid = quantityVectors.filter((v) => !v.should_fail);
      const invalid = quantityVectors.filter((v) => v.should_fail);
      expect(valid.length).toBeGreaterThan(0);
      expect(invalid.length).toBeGreaterThan(0);
    });
  });

  describe("Payload Hash Vectors", () => {
    it("has expected hash structure", () => {
      for (const vector of payloadHashVectors) {
        expect(vector.expected_hash).toBeDefined();
        expect(vector.expected_hash).toHaveLength(64);
        expect(vector.payload).toBeDefined();
        expect(vector.type).toBeDefined();
      }
    });
  });

  describe("Error Codes", () => {
    it("has all required error codes with correct structure", () => {
      const requiredCodes = [
        "NOT_FOUND",
        "CONFLICT",
        "VALIDATION_ERROR",
        "UNAUTHORIZED",
        "FORBIDDEN",
        "PRECONDITION_FAILED",
        "IDEMPOTENCY_ERROR",
        "INTERNAL_ERROR",
        "SHOP_CLOSED",
        "LEASE_EXPIRED",
        "STAFF_LIMIT_EXCEEDED",
        "INSUFFICIENT_STOCK",
        "NEGATIVE_STOCK_CONFLICT",
      ];

      for (const code of requiredCodes) {
        const errorCode = errorCodes[code];
        expect(errorCode).toBeDefined();
        expect(errorCode!.code).toBe(code);
        expect(typeof errorCode!.http_status).toBe("number");
        expect(errorCode!.http_status).toBeGreaterThanOrEqual(100);
        expect(errorCode!.http_status).toBeLessThan(600);
        expect(typeof errorCode!.title).toBe("string");
        expect(typeof errorCode!.description).toBe("string");
      }
    });
  });

  describe("Permissions", () => {
    it("has OWNER and ATTENDANT roles", () => {
      expect(permissions.OWNER).toBeDefined();
      expect(permissions.ATTENDANT).toBeDefined();
      expect(Array.isArray(permissions.OWNER)).toBe(true);
      expect(Array.isArray(permissions.ATTENDANT)).toBe(true);
    });

    it("OWNER has all permissions", () => {
      const allPermissions = [
        "create_shop",
        "close_shop",
        "invite_staff",
        "deactivate_staff",
        "manage_products",
        "receive_stock",
        "adjust_stock",
        "view_reports",
        "manage_settings",
        "sync_push",
        "sync_pull",
        "resolve_conflicts",
      ];

      for (const perm of allPermissions) {
        expect(permissions.OWNER).toContain(perm);
      }
    });

    it("ATTENDANT has limited permissions", () => {
      const attendantPerms = [
        "manage_products",
        "receive_stock",
        "adjust_stock",
        "sync_push",
        "sync_pull",
      ];

      for (const perm of attendantPerms) {
        expect(permissions.ATTENDANT).toContain(perm);
      }

      const ownerOnly = [
        "create_shop",
        "close_shop",
        "invite_staff",
        "deactivate_staff",
        "view_reports",
        "manage_settings",
        "resolve_conflicts",
      ];

      for (const perm of ownerOnly) {
        expect(permissions.ATTENDANT).not.toContain(perm);
      }
    });
  });

  describe("Sample Operations", () => {
    it("has all required sample operations", () => {
      const requiredOps = [
        "CreateProduct",
        "ReceiveStock",
        "Sale",
        "AdjustStock",
        "SyncPush",
        "SyncPull",
      ];

      for (const op of requiredOps) {
        const sampleOp = sampleOperations[op];
        expect(sampleOp).toBeDefined();
        expect(sampleOp!.type).toBe(op);
        expect(sampleOp!.payload).toBeDefined();
      }
    });

    it("sample operations have valid structure", () => {
      for (const [name, op] of Object.entries(sampleOperations)) {
        expect(op.type).toBe(name);
        expect(op.payload).toBeTypeOf("object");
      }
    });
  });
});

describe("Cross-Language Vector Parity (Conceptual)", () => {
  it("money vectors can be loaded by both Python and TypeScript", () => {
    const vectors = loadFixture<MoneyVector[]>("money-vectors.json");
    expect(vectors.length).toBeGreaterThan(0);
  });

  it("quantity vectors can be loaded by both Python and TypeScript", () => {
    const vectors = loadFixture<QuantityVector[]>("quantity-vectors.json");
    expect(vectors.length).toBeGreaterThan(0);
  });

  it("payload hash vectors can be loaded by both Python and TypeScript", () => {
    const vectors = loadFixture<PayloadHashVector[]>("payload-hash-vectors.json");
    expect(vectors.length).toBeGreaterThan(0);
  });
});
