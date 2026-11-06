import { z } from "zod";
import type { Product } from "../catalog/types";

export type TenderType = "CASH" | "TELEBIRR" | "CBE_BIRR";

export interface CartLine {
  productId: string;
  product: Product;
  quantityMilli: number;
  packagingId?: string;
  unitPriceSantim: number;
  lineTotalSantim: number;
}

export interface CompletedSale {
  id: string;
  shopId: string;
  lines: CartLine[];
  totalSantim: number;
  tender: TenderType;
  createdAt: string;
}

export const CompletedSaleSchema = z.object({
  id: z.string().min(1),
  shopId: z.string().min(1),
  totalSantim: z.number().int().nonnegative(),
  tender: z.enum(["CASH", "TELEBIRR", "CBE_BIRR"]),
  lines: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantityMilli: z.number().int().positive(),
        packagingId: z.string().optional(),
        unitPriceSantim: z.number().int().nonnegative(),
        lineTotalSantim: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  createdAt: z.string().min(1),
});

/**
 * Calculates line total santim using half-up integer rounding:
 * lineTotal = round((unitPriceSantim * quantityMilli) / 1000)
 */
export function calculateLineTotalSantim(unitPriceSantim: number, quantityMilli: number): number {
  if (quantityMilli <= 0 || unitPriceSantim <= 0) return 0;
  return Math.round((unitPriceSantim * quantityMilli) / 1000);
}
