import type { ProductStub, PortionSize } from "@/features/products/types";

export interface CartItem {
  id: string; // Unique ID for the cart item (usually product.id + portion.label)
  product: ProductStub;
  portion: PortionSize;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  /** Returns false when the add was blocked (signed-out user). */
  addItem: (product: ProductStub, portion: PortionSize, quantity: number) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  /** Wipes all items locally and in Supabase (called after a successful order). */
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  subtotal: number;
  totalItems: number;
}
