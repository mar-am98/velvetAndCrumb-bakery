"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DELIVERY_TIME_WINDOWS } from "../types";
import { minDeliveryDateIso, useCheckout } from "../context";

export function ShippingStep() {
  const { shipping, setShipping } = useCheckout();
  const minDate = minDeliveryDateIso();

  return (
    <div className="space-y-4 px-6 py-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="checkout-full-name" className="text-brand-espresso">
            Full Name
          </Label>
          <Input
            id="checkout-full-name"
            autoComplete="name"
            value={shipping.fullName}
            onChange={(e) => setShipping({ fullName: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-email" className="text-brand-espresso">
            Email Address
          </Label>
          <Input
            id="checkout-email"
            type="email"
            autoComplete="email"
            value={shipping.email}
            onChange={(e) => setShipping({ email: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="checkout-street" className="text-brand-espresso">
            Street Address
          </Label>
          <Input
            id="checkout-street"
            autoComplete="street-address"
            value={shipping.streetAddress}
            onChange={(e) => setShipping({ streetAddress: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-delivery-date" className="text-brand-espresso">
            Delivery Date
          </Label>
          <Input
            id="checkout-delivery-date"
            type="date"
            min={minDate}
            value={shipping.deliveryDate}
            onChange={(e) => setShipping({ deliveryDate: e.target.value })}
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="checkout-time-window" className="text-brand-espresso">
            Time Window
          </Label>
          <Select
            value={shipping.timeWindow || undefined}
            onValueChange={(value) =>
              setShipping({ timeWindow: value as typeof shipping.timeWindow })
            }
          >
            <SelectTrigger id="checkout-time-window" className="h-10 w-full">
              <SelectValue placeholder="Choose a delivery window" />
            </SelectTrigger>
            <SelectContent>
              {DELIVERY_TIME_WINDOWS.map((window) => (
                <SelectItem key={window.value} value={window.value}>
                  {window.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="checkout-note" className="text-brand-espresso">
            Bakery Note <span className="font-normal text-muted-foreground">(Optional)</span>
          </Label>
          <Textarea
            id="checkout-note"
            placeholder="Birthday candle, gift note…"
            value={shipping.bakeryNote}
            onChange={(e) => setShipping({ bakeryNote: e.target.value })}
            className="min-h-[88px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}
