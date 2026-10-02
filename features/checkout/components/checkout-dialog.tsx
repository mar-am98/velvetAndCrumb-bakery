"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckout } from "../context";
import { useCart } from "@/features/cart/context";
import { CheckoutStepShell } from "./checkout-step-shell";
import { OrderConfirmedStep } from "./order-confirmed-step";
import { PaymentStep } from "./payment-step";
import { ReviewStep } from "./review-step";
import { ShippingStep } from "./shipping-step";
import { createOrder } from "@/features/orders/actions";

/** Multi-step checkout — shipping → payment → review → order confirmed. */
export function CheckoutDialog() {
  const {
    isOpen,
    step,
    shipping,
    closeCheckout,
    goToPayment,
    goToReview,
    goToShipping,
    goBackToPayment,
    goToConfirmed,
  } = useCheckout();
  const { items, subtotal, clearCart, setIsOpen: setCartOpen } = useCart();

  const [placing, setPlacing] = useState(false);

  const handleShippingContinue = () => {
    if (!goToPayment()) {
      toast.error("Please fill in all required delivery fields.");
    }
  };

  const handlePaymentContinue = () => {
    if (!goToReview()) {
      toast.error("Please enter valid test card details.");
    }
  };

  const handlePlaceOrder = async () => {
    if (placing) return;
    setPlacing(true);
    try {
      const result = await createOrder({ cartItems: items, shipping, subtotal });
      if (!result.ok || !result.order) {
        toast.error(result.error ?? "Failed to place order. Please try again.");
        return;
      }
      // Clear the cart locally (server already cleared the DB rows)
      clearCart();
      setCartOpen(false);
      goToConfirmed(result.order.id);
    } catch (err) {
      console.error("[CheckoutDialog] unexpected error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !placing && closeCheckout()}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 max-h-[85dvh] overflow-y-auto bg-card p-0 sm:max-w-lg sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        <DialogDescription className="sr-only">
          Complete shipping and payment for your order
        </DialogDescription>

        {step === 1 && (
          <CheckoutStepShell
            step={1}
            title="Shipping & Delivery Details"
            primaryLabel="Continue to Payment"
            onPrimary={handleShippingContinue}
            onCancel={closeCheckout}
          >
            <ShippingStep />
          </CheckoutStepShell>
        )}

        {step === 2 && (
          <CheckoutStepShell
            step={2}
            title="Secure Payment Details"
            primaryLabel="Continue to Review"
            primaryTone="crimson"
            onPrimary={handlePaymentContinue}
            onCancel={closeCheckout}
            secondaryLabel="Back"
            onSecondary={goToShipping}
          >
            <PaymentStep />
          </CheckoutStepShell>
        )}

        {step === 3 && (
          <CheckoutStepShell
            step={3}
            title="Review & Place Order"
            primaryLabel="Place Order"
            onPrimary={handlePlaceOrder}
            onCancel={closeCheckout}
            secondaryLabel="Back"
            onSecondary={goBackToPayment}
            primaryLoading={placing}
          >
            <ReviewStep />
          </CheckoutStepShell>
        )}

        {step === 4 && <OrderConfirmedStep />}
      </DialogContent>
    </Dialog>
  );
}
