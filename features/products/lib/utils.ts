import type { Product, ProductStub } from "../types";

/** Format a price as USD currency string e.g. $8.50 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
}

/** Narrow a full product row to the stub the product/cart UI works with. */
export function toProductStub(product: Product): ProductStub {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    base_price: product.base_price,
    image_url: product.image_url,
    rating: product.rating,
    review_count: product.review_count,
    badge: product.badge,
    is_available: product.is_available,
  };
}
