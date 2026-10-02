// Order domain types — mirrors the Supabase `orders` + `order_items` schema.

export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image_url: string;
  portion_label: string;
  unit_price: number;   // base_price × price_modifier at time of order
  quantity: number;
  line_total: number;   // unit_price × quantity
}

export interface Order {
  id: string;           // UUID
  user_id: string;
  status: OrderStatus;
  full_name: string;
  email: string;
  street_address: string;
  delivery_date: string;       // ISO date string YYYY-MM-DD
  delivery_time_window: string; // e.g. "10:00-12:00"
  bakery_note: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  created_at: string;
  items?: OrderItem[];
}
