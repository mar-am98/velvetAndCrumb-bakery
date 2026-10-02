"use server";

import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/mailgun";
import { shippingCostForSubtotal } from "@/features/cart/lib/shipping";
import type { CartItem } from "@/features/cart/types";
import type { ShippingDetails } from "@/features/checkout/types";
import type { Order } from "./types";

export interface CreateOrderInput {
  cartItems: CartItem[];
  shipping: ShippingDetails;
  subtotal: number;
}

export interface CreateOrderResult {
  ok: boolean;
  order?: Order;
  error?: string;
}

/**
 * Server action: persists an order + its items in Supabase,
 * clears the user's cart_items rows, and sends a Mailgun confirmation email.
 */
export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const supabase = await createClient();

  // 1. Verify the user is signed in
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { ok: false, error: "You must be signed in to place an order." };
  }

  const { cartItems, shipping, subtotal } = input;

  if (!cartItems.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  const shippingCost = shippingCostForSubtotal(subtotal);
  const total = subtotal + shippingCost;

  // 2. Insert the order row
  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "confirmed",
      full_name: shipping.fullName.trim(),
      email: shipping.email.trim(),
      street_address: shipping.streetAddress.trim(),
      delivery_date: shipping.deliveryDate,
      delivery_time_window: shipping.timeWindow,
      bakery_note: shipping.bakeryNote.trim() || null,
      subtotal,
      shipping_cost: shippingCost,
      total,
    })
    .select()
    .single();

  if (orderError || !orderRow) {
    console.error("[createOrder] order insert failed:", orderError);
    return { ok: false, error: "Failed to save your order. Please try again." };
  }

  // 3. Build order_items rows — snapshot product data at purchase time
  const orderItems = cartItems.map((item) => {
    const unitPrice = item.product.base_price * item.portion.priceModifier;
    return {
      order_id: orderRow.id as string,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image_url: item.product.image_url,
      portion_label: item.portion.label,
      unit_price: unitPrice,
      quantity: item.quantity,
      line_total: unitPrice * item.quantity,
    };
  });

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    console.error("[createOrder] order_items insert failed:", itemsError);
    // Order row exists — still return it so the UI can proceed, but warn
    // (the order is technically placed; items will need manual support fix)
    return {
      ok: false,
      error: "Order placed but item details couldn't be saved. Contact support with your order ID.",
      order: orderRow as unknown as Order,
    };
  }

  // 4. Clear the user's cart in Supabase (best-effort; client also clears locally)
  await supabase.from("cart_items").delete().eq("user_id", user.id);

  // 5. Send Mailgun confirmation email (non-blocking on failure)
  await sendOrderConfirmation({
    to: shipping.email.trim(),
    toName: shipping.fullName.trim(),
    orderId: orderRow.id as string,
    items: orderItems.map((i) => ({
      name: i.product_name,
      portionLabel: i.portion_label,
      quantity: i.quantity,
      lineTotal: i.line_total,
    })),
    subtotal,
    shippingCost,
    total,
    deliveryDate: shipping.deliveryDate,
    deliveryTimeWindow: shipping.timeWindow,
    streetAddress: shipping.streetAddress.trim(),
  });

  return { ok: true, order: orderRow as unknown as Order };
}

/**
 * Server action: fetches the signed-in user's orders (newest first), with items.
 */
export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getMyOrders] fetch failed:", error);
    return [];
  }

  return (orders ?? []) as unknown as Order[];
}
