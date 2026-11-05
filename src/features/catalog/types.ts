import { z } from "zod";
import type { Unit } from "../../core/domain/units";

export type ProductStatus = "ACTIVE" | "ARCHIVED";

export interface Packaging {
  id: string;
  name: string; // e.g. "Crate (24 pcs)", "Jerrycan (20 L)", "Sack (25 kg)"
  multiplierMilli: number; // base milli-units per package (e.g. 24 pieces = 24,000 milli)
  barcode?: string;
  priceSantim?: number; // optional retail price for package
  costSantim?: number; // optional wholesale cost for package
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  nameAlt?: string; // Amharic name, e.g. "እህልና ዱቄት"
  color?: string;
}

export interface Product {
  id: string;
  shopId: string;
  name: string;
  nameAlt?: string;
  sku?: string;
  barcode?: string;
  unit: Unit;
  category: string; // category slug
  priceSantim: number; // Integer santim
  costSantim?: number; // Integer santim (owner-only visibility)
  stockMilli: number; // Current stock in milli-units
  lowStockMilli: number; // Alert threshold in milli-units (0 = disabled)
  status: ProductStatus;
  packagings: Packaging[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Converts user-inputted Birr (e.g. "125.50" or 35.5) to integer santim.
 */
export function birrToSantim(birr: number | string): number {
  if (typeof birr === "string") {
    const trimmed = birr.trim();
    if (!trimmed) throw new Error("Price is required");
    const val = Number(trimmed);
    if (!Number.isFinite(val) || val < 0) {
      throw new Error(`Invalid Birr amount: ${birr}`);
    }
    return Math.round(val * 100);
  }
  if (!Number.isFinite(birr) || birr < 0) {
    throw new Error(`Invalid Birr amount: ${birr}`);
  }
  return Math.round(birr * 100);
}

export const PackagingSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Container label is required").max(60),
  multiplierMilli: z.number().int().positive("Multiplier must be greater than zero"),
  barcode: z.string().max(64).optional(),
  priceSantim: z.number().int().nonnegative().optional(),
  costSantim: z.number().int().nonnegative().optional(),
});

export const ProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name cannot exceed 120 characters"),
  nameAlt: z.string().trim().max(120).optional(),
  sku: z.string().trim().max(32).optional(),
  barcode: z.string().trim().max(64).optional(),
  unit: z.enum(["PIECE", "KG", "LITER", "METER"] as const, {
    message: "Unit of measure is required",
  }),
  category: z.string().trim().min(1, "Category is required"),
  priceSantim: z
    .number()
    .int("Price must be an integer in santim")
    .positive("Selling price must be greater than 0"),
  costSantim: z
    .number()
    .int("Cost must be an integer in santim")
    .nonnegative("Cost cannot be negative")
    .optional(),
  lowStockMilli: z
    .number()
    .int("Low stock threshold must be in integer milli-units")
    .nonnegative("Low stock threshold cannot be negative")
    .default(0),
  packagings: z.array(PackagingSchema).max(5, "Maximum 5 packaging forms allowed"),
  initialStockCount: z.number().nonnegative().optional(),
  initialPackagingId: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;

export const DEFAULT_CATEGORIES: ProductCategory[] = [
  {
    id: "cat_grains",
    name: "Grains & Flour",
    slug: "grains",
    nameAlt: "እህልና ዱቄት",
    color: "#f59e0b",
  },
  { id: "cat_oils", name: "Oils & Fats", slug: "oils", nameAlt: "ዘይት", color: "#eab308" },
  { id: "cat_beverages", name: "Beverages", slug: "beverages", nameAlt: "መጠጦች", color: "#3b82f6" },
  { id: "cat_spices", name: "Spices & Salt", slug: "spices", nameAlt: "ቅመማ ቅመም", color: "#ef4444" },
  { id: "cat_general", name: "General Goods", slug: "general", nameAlt: "ልዩ ልዩ", color: "#6b7280" },
];
