"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/features/auth/context";
import { cartRowToItem, type CartRow } from "./lib/db";
import type { CartItem, CartState } from "./types";
import type { Product, ProductStub, PortionSize } from "@/features/products/types";

const CartContext = createContext<CartState | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, openAccountDialog } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = user?.id ?? null;

  // Guest carts lived in localStorage before per-user carts — drop the legacy key
  useEffect(() => {
    localStorage.removeItem("velvet_cart");
  }, []);

  // Clear the box the moment the session ends (auth event callback, not derived state)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setItems([]);
      }
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Hydrate this user's saved cart from Supabase. Runs once on login and again
  // on every realtime change so other tabs/devices reflect without a refresh.
  const loadSeqRef = useRef(0);

  const loadCart = useCallback(async () => {
    if (!userId) return;
    // Bumped whenever a newer load starts (or the user changes) so a slow
    // response for a previous user can't overwrite the current cart.
    const seq = ++loadSeqRef.current;

    const { data: rows, error } = await supabase
      .from("cart_items")
      .select("*")
      .order("updated_at", { ascending: true });
    if (error) {
      console.error("Failed to load cart:", error);
      return;
    }
    if (!rows || rows.length === 0) {
      if (seq === loadSeqRef.current) setItems([]);
      return;
    }

    const productIds = [...new Set(rows.map((row) => row.product_id))];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);
    if (productsError) {
      console.error("Failed to load cart products:", productsError);
      return;
    }
    if (seq !== loadSeqRef.current) return;

    const hydrated = rows
      .map((row) => cartRowToItem(row as CartRow, (products ?? []) as Product[]))
      .filter((item): item is CartItem => item !== null);
    setItems(hydrated);
  }, [userId, supabase]);

  useEffect(() => {
    if (!userId) {
      loadSeqRef.current++; // invalidate any in-flight load for a signed-out user
      return;
    }
    loadCart();
  }, [userId, loadCart]);

  // Re-hydrate whenever this user's cart rows change anywhere (other tab, phone)
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("cart-sync")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          loadCart();
        }
      )
      // DELETEs can't be filtered by user_id: realtime skips RLS for deletes and the
      // old row only carries the primary key, so the filtered listener never fires.
      // Listen unfiltered and just re-read our own RLS-scoped rows instead.
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "cart_items" },
        () => {
          loadCart();
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[cart-sync] realtime subscribed");
        } else {
          console.error(`[cart-sync] realtime status: ${status}`);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, loadCart]);

  const addItem = (product: ProductStub, portion: PortionSize, quantity: number): boolean => {
    // Signed-out users can't build a box — prompt them to sign in instead
    if (!userId) {
      openAccountDialog("Sign in to add items to your cart.");
      return false;
    }

    const id = `${product.id}-${portion.label}`;
    const existing = items.find((item) => item.id === id);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;

    setItems((current) => {
      if (current.some((item) => item.id === id)) {
        return current.map((item) =>
          item.id === id ? { ...item, quantity: nextQuantity } : item
        );
      }
      return [...current, { id, product, portion, quantity: nextQuantity }];
    });

    supabase
      .from("cart_items")
      .upsert(
        {
          user_id: userId,
          product_id: product.id,
          portion_label: portion.label,
          price_modifier: portion.priceModifier,
          quantity: nextQuantity,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,product_id,portion_label" }
      )
      .then(({ error }) => {
        if (error) toast.error("Couldn't save that to your cart. Try again.");
      });

    return true;
  };

  const removeItem = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    setItems((current) => current.filter((entry) => entry.id !== id));

    if (!userId || !item) return;
    supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", item.product.id)
      .eq("portion_label", item.portion.label)
      .then(({ error }) => {
        if (error) toast.error("Couldn't update your cart. Try again.");
      });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
      return;
    }
    const item = items.find((entry) => entry.id === id);
    setItems((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, quantity } : entry))
    );

    if (!userId || !item) return;
    supabase
      .from("cart_items")
      .update({ quantity, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("product_id", item.product.id)
      .eq("portion_label", item.portion.label)
      .then(({ error }) => {
        if (error) toast.error("Couldn't update your cart. Try again.");
      });
  };

  const clearCart = () => {
    setItems([]);
    if (!userId) return;
    supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userId)
      .then(({ error }) => {
        if (error) console.error("[clearCart] Failed to clear cart in DB:", error);
      });
  };

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const itemPrice = item.product.base_price * item.portion.priceModifier;
      return total + itemPrice * item.quantity;
    }, 0);
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setIsOpen,
    subtotal,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
