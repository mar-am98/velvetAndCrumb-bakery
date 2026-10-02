"use client";

import Image from "next/image";
import { Package, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/cart/context";
import { useCheckout } from "../context";
import {
  shippingCostForSubtotal,
  orderTotal,
  FREE_SHIPPING_THRESHOLD,
} from "@/features/cart/lib/shipping";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatDeliveryDate(iso: string) {
  // Parse as local date to avoid UTC off-by-one
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

function formatTimeWindow(window: string) {
  // "10:00-12:00" → "10:00 AM – 12:00 PM"
  return window
    .split("-")
    .map((part) => {
      const [h, min] = part.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
    })
    .join(" – ");
}

export function ReviewStep() {
  const { items, subtotal } = useCart();
  const { shipping } = useCheckout();
  const shippingCost = shippingCostForSubtotal(subtotal);
  const total = orderTotal(subtotal);

  return (
    <div className="space-y-0">
      {/* Items list */}
      <div className="max-h-[220px] overflow-y-auto px-6 py-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-gold">
          Items ({items.length})
        </p>
        <ul className="space-y-3">
          {items.map((item) => {
            const lineTotal = item.product.base_price * item.portion.priceModifier * item.quantity;
            return (
              <li key={item.id} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.portion.label} × {item.quantity}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatCurrency(lineTotal)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <Separator />

      {/* Delivery details */}
      <div className="px-6 py-4">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-brand-gold">
          Delivery
        </p>
        <div className="space-y-2 text-sm text-foreground">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">{shipping.streetAddress}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">
              {shipping.deliveryDate ? formatDeliveryDate(shipping.deliveryDate) : "—"}
              {" · "}
              {shipping.timeWindow ? formatTimeWindow(shipping.timeWindow) : "—"}
            </span>
          </div>
          {shipping.bakeryNote && (
            <div className="flex items-start gap-2">
              <Package className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground italic">{shipping.bakeryNote}</span>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Totals */}
      <div className="space-y-2 px-6 py-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          {shippingCost === 0 ? (
            <Badge
              variant="secondary"
              className="bg-brand-success/15 text-brand-success hover:bg-brand-success/15"
            >
              FREE
            </Badge>
          ) : (
            <span>{formatCurrency(shippingCost)}</span>
          )}
        </div>
        {shippingCost > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
        <Separator />
        <div className="flex items-center justify-between font-bold">
          <span className="text-foreground">Total</span>
          <span className="text-lg text-brand-espresso">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
