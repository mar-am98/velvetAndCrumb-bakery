export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_COST = 5;

export function shippingCostForSubtotal(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function orderTotal(subtotal: number): number {
  return subtotal + shippingCostForSubtotal(subtotal);
}

export function amountAwayFromFreeShipping(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function freeShippingProgress(subtotal: number): number {
  return Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
}
