"use client";

import { useState } from "react";
import { Check, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandDialogHeader } from "@/components/brand-dialog-header";
import { PastOrdersDialog } from "@/features/orders/components/past-orders-dialog";
import { useCheckout } from "../context";

/** Post-purchase confirmation — store design 12. */
export function OrderConfirmedStep() {
  const { confirmedOrderId, closeCheckout } = useCheckout();
  const [pastOrdersOpen, setPastOrdersOpen] = useState(false);

  const shortId = confirmedOrderId ? `VC-${confirmedOrderId.slice(0, 8).toUpperCase()}` : "—";

  return (
    <>
      <BrandDialogHeader eyebrow="Step 3 of 3" title="Order Confirmed" />

      <div className="px-6 pt-8 pb-6 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-success/15">
          <Check className="size-7 text-brand-success" strokeWidth={3} />
        </div>

        <h3 className="mt-5 font-heading text-2xl font-bold text-foreground">
          Order Confirmed!
        </h3>
        <p className="mx-auto mt-2 max-w-[40ch] text-sm text-muted-foreground">
          Thank you for ordering with Velvet &amp; Crumb. Our pastry chefs are preparing
          your artisan desserts.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Order ID
            </p>
            <p className="mt-1.5 font-mono text-sm font-semibold text-brand-crimson">
              {shortId}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Order Status
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-brand-success">
              <Check className="size-4" strokeWidth={3} />
              Confirmed
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPastOrdersOpen(true)}
            className="h-11 w-full gap-2 rounded-xl text-sm font-semibold text-brand-espresso hover:bg-brand-cream"
          >
            <History className="size-4" />
            View Past Orders
          </Button>
          <Button
            type="button"
            onClick={closeCheckout}
            className="h-11 w-full rounded-xl bg-brand-espresso text-sm font-semibold text-brand-cream hover:bg-brand-espresso-light"
          >
            Return to Storefront
          </Button>
        </div>
      </div>

      <PastOrdersDialog open={pastOrdersOpen} onOpenChange={setPastOrdersOpen} />
    </>
  );
}
