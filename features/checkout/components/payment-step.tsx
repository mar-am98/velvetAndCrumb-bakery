"use client";

import { CreditCard, Lock, ShieldCheck, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useCheckout } from "../context";
import { useCart } from "@/features/cart/context";
import { orderTotal } from "@/features/cart/lib/shipping";
import { formatPrice } from "@/features/products/lib/utils";
import {
  formatCardNumber,
  formatCvc,
  formatExpiry,
} from "../lib/payment-validation";

export function PaymentStep() {
  const { payment, setPayment } = useCheckout();
  const { subtotal } = useCart();

  return (
    <div className="space-y-4 px-6 py-5">
      {/* Total Due */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-secondary px-4 py-3">
        <span className="text-sm font-medium text-brand-espresso">Total Due:</span>
        <span className="text-sm font-bold text-brand-crimson">{formatPrice(orderTotal(subtotal))}</span>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-brand-gold/30 bg-brand-gold/5 px-4 py-3 text-left">
        <Lock className="mt-0.5 size-4 shrink-0 text-brand-gold" aria-hidden />
        <p className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-brand-espresso">Test mode.</span> No real charge is
          made. Use any future expiry and any 3-digit CVC — e.g.{" "}
          <span className="font-mono text-brand-espresso">4242 4242 4242 4242</span>.
          <span className="font-mono text-brand-espresso"> -12/30</span>
          <span className="font-mono text-brand-espresso"> -123</span>
        </p>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-brand-espresso">Payment Method</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex h-11 items-center gap-2 rounded-lg border border-brand-crimson px-4 text-sm font-medium text-brand-crimson">
            <CreditCard className="size-4" aria-hidden />
            Credit Card
          </div>
          <div
            aria-disabled="true"
            className="flex h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium text-muted-foreground"
          >
            <User className="size-4" aria-hidden />
            Google Pay
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkout-card-number" className="text-brand-espresso">
          Card Number
        </Label>
        <Input
          id="checkout-card-number"
          inputMode="numeric"
          autoComplete="cc-number"
          placeholder="•••• •••• •••• 4242"
          value={payment.cardNumber}
          onChange={(e) => setPayment({ cardNumber: formatCardNumber(e.target.value) })}
          className="h-10 font-mono text-sm tracking-wide"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="checkout-expiry" className="text-brand-espresso">
            Expiry Date
          </Label>
          <Input
            id="checkout-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            value={payment.expiry}
            onChange={(e) => setPayment({ expiry: formatExpiry(e.target.value) })}
            className="h-10 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="checkout-cvc" className="text-brand-espresso">
            CVV
          </Label>
          <Input
            id="checkout-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={payment.cvc}
            onChange={(e) => setPayment({ cvc: formatCvc(e.target.value) })}
            className="h-10 font-mono"
          />
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-2 rounded-lg border border-brand-success/30 bg-brand-success/10 px-4 py-3">
        <ShieldCheck className="size-4 shrink-0 text-brand-success" aria-hidden />
        <p className="text-xs text-brand-success">
          256-Bit SSL Encrypted &amp; Supabase Postgres Authenticated
        </p>
      </div>
    </div>
  );
}
