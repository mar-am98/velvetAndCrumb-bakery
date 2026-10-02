import type { Product } from "@/features/products/types";
import { toProductStub } from "@/features/products/lib/utils";
import type { CartItem } from "../types";

/** Row shape of the `cart_items` table — RLS restricts every op to auth.uid() = user_id. */
export interface CartRow {
  id: string;
  user_id: string;
  product_id: string;
  portion_label: string;
  price_modifier: number;
  quantity: number;
  updated_at: string;
}

/** Turn a saved cart row + its product into a renderable cart item (null if the product is gone). */
export function cartRowToItem(row: CartRow, products: Product[]): CartItem | null {
  const product = products.find((p) => p.id === row.product_id);
  if (!product) return null;
  return {
    id: `${row.product_id}-${row.portion_label}`,
    product: toProductStub(product),
    portion: { label: row.portion_label, priceModifier: row.price_modifier },
    quantity: row.quantity,
  };
}
