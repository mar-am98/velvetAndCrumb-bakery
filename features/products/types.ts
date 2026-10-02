// Product domain types — shared across products feature components.
// These will match the Supabase `products` table schema once DB is wired up.

export type ProductCategory =
  | "Cheesecakes"
  | "Fruit Tarts"
  | "Chocolate Tarts"
  | "Mini Bites"
  | "Vegan / GF";

export interface PortionSize {
  label: string;  // e.g. "Single Slice", 'Whole 8" Cake'
  priceModifier: number; // multiplier on base_price (1 = no change, 1.5 = 50% more)
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  base_price: number;       // price for the default portion
  image_url: string;        // Supabase Storage URL
  rating: number;           // 0-5 float
  review_count: number;
  badge?: string;           // e.g. "Popular", "Limited Batch", "In Stock", "Gluten-Free"
  allergens?: string;       // e.g. "Tree Nuts (Pistachio), Dairy, Gluten"
  ingredients?: string;     // comma-separated ingredient list
  portion_sizes: PortionSize[];
  is_available: boolean;
  is_bestseller?: boolean;
}

/** Lightweight stub used for the UI shell (Part 1) before Supabase is wired. */
export type ProductStub = Pick<
  Product,
  "id" | "name" | "description" | "category" | "base_price" | "image_url" | "rating" | "review_count" | "badge" | "is_available"
>;
