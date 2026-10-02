"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getMyOrders } from "@/features/orders/actions";
import type { Order, OrderStatus } from "@/features/orders/types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; className: string }> = {
    pending:    { label: "Pending",    className: "bg-brand-gold/15 text-brand-gold hover:bg-brand-gold/15" },
    confirmed:  { label: "Confirmed",  className: "bg-brand-success/15 text-brand-success hover:bg-brand-success/15" },
    preparing:  { label: "Preparing",  className: "bg-accent/20 text-accent-foreground hover:bg-accent/20" },
    delivered:  { label: "Delivered",  className: "bg-brand-success/20 text-brand-success hover:bg-brand-success/20" },
    cancelled:  { label: "Cancelled",  className: "bg-destructive/10 text-destructive hover:bg-destructive/10" },
  };
  const { label, className } = map[status] ?? map.confirmed;
  return <Badge variant="secondary" className={className}>{label}</Badge>;
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const shortId = order.id.slice(0, 8).toUpperCase();
  const items = order.items ?? [];

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-left">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">Order #{shortId}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(order.created_at)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Item thumbnails */}
      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.slice(0, 4).map((item) => (
            <div key={item.id} className="relative size-10 overflow-hidden rounded-md">
              <Image
                src={item.product_image_url}
                alt={item.product_name}
                fill
                className="object-cover"
                sizes="40px"
              />
            </div>
          ))}
          {items.length > 4 && (
            <div className="flex size-10 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
              +{items.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Item names */}
      {items.length > 0 && (
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {items.map((i) => `${i.product_name} (${i.portion_label})`).join(", ")}
        </p>
      )}

      <Separator className="my-3" />

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Delivery: {new Date(order.delivery_date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
        <span className="font-bold text-foreground">{formatCurrency(order.total)}</span>
      </div>
    </div>
  );
}

/** Fetches and renders the signed-in user's order history. */
export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyOrders().then((data) => {
      if (!cancelled) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <Package className="size-10 text-muted-foreground/50" />
        <div>
          <p className="text-sm font-semibold text-foreground">No orders yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Your order history will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
