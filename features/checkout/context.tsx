"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getUserFullName } from "@/features/auth/lib/display-name";
import { isPaymentValid } from "./lib/payment-validation";
import {
  DELIVERY_TIME_WINDOWS,
  EMPTY_PAYMENT,
  EMPTY_SHIPPING,
  type PaymentDetails,
  type ShippingDetails,
} from "./types";

interface CheckoutContextValue {
  isOpen: boolean;
  step: 1 | 2 | 3 | 4;
  /** Set once an order is placed; drives the "Order Confirmed" step. */
  confirmedOrderId: string | null;
  shipping: ShippingDetails;
  payment: PaymentDetails;
  openCheckout: () => void;
  closeCheckout: () => void;
  setShipping: (patch: Partial<ShippingDetails>) => void;
  setPayment: (patch: Partial<PaymentDetails>) => void;
  goToShipping: () => void;
  goToPayment: () => boolean;
  goBackToPayment: () => void;
  goToReview: () => boolean;
  /** Moves to the confirmation step after a successful order. */
  goToConfirmed: (orderId: string) => void;
  /** Validates step 1 fields; returns false when invalid. */
  validateShipping: () => boolean;
  /** Validates step 2 fields; returns false when invalid. */
  validatePayment: () => boolean;
}

const CheckoutContext = createContext<CheckoutContextValue | undefined>(undefined);

function defaultShippingForUser(user: User | null): ShippingDetails {
  if (!user) return { ...EMPTY_SHIPPING };
  return {
    ...EMPTY_SHIPPING,
    fullName: getUserFullName(user),
    email: user.email ?? "",
    timeWindow: DELIVERY_TIME_WINDOWS[0].value,
  };
}

function minDeliveryDateIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function CheckoutProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [shipping, setShippingState] = useState<ShippingDetails>(() =>
    defaultShippingForUser(user)
  );
  const [payment, setPaymentState] = useState<PaymentDetails>({ ...EMPTY_PAYMENT });

  const openCheckout = useCallback(() => {
    setStep(1);
    setConfirmedOrderId(null);
    setShippingState({
      ...defaultShippingForUser(user),
      deliveryDate: minDeliveryDateIso(),
    });
    setPaymentState({
      ...EMPTY_PAYMENT,
      nameOnCard: defaultShippingForUser(user).fullName,
    });
    setIsOpen(true);
  }, [user]);

  const closeCheckout = useCallback(() => {
    setIsOpen(false);
    setStep(1);
    setConfirmedOrderId(null);
    setPaymentState({ ...EMPTY_PAYMENT });
  }, []);

  const setShipping = useCallback((patch: Partial<ShippingDetails>) => {
    setShippingState((prev) => ({ ...prev, ...patch }));
  }, []);

  const validateShipping = useCallback((): boolean => {
    const trimmedName = shipping.fullName.trim();
    const trimmedEmail = shipping.email.trim();
    const trimmedAddress = shipping.streetAddress.trim();
    if (!trimmedName || !trimmedEmail || !trimmedAddress || !shipping.deliveryDate || !shipping.timeWindow) {
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return false;
    }
    return true;
  }, [shipping]);

  const setPayment = useCallback((patch: Partial<PaymentDetails>) => {
    setPaymentState((prev) => ({ ...prev, ...patch }));
  }, []);

  const validatePayment = useCallback((): boolean => isPaymentValid(payment), [payment]);

  const goToShipping = useCallback(() => {
    setStep(1);
  }, []);

  const goToPayment = useCallback((): boolean => {
    if (!validateShipping()) return false;
    setStep(2);
    return true;
  }, [validateShipping]);

  const goBackToPayment = useCallback(() => {
    setStep(2);
  }, []);

  const goToReview = useCallback((): boolean => {
    if (!validatePayment()) return false;
    setStep(3);
    return true;
  }, [validatePayment]);

  const goToConfirmed = useCallback((orderId: string) => {
    setConfirmedOrderId(orderId);
    setStep(4);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      step,
      confirmedOrderId,
      shipping,
      payment,
      openCheckout,
      closeCheckout,
      setShipping,
      setPayment,
      goToShipping,
      goToPayment,
      goBackToPayment,
      goToReview,
      goToConfirmed,
      validateShipping,
      validatePayment,
    }),
    [
      isOpen,
      step,
      confirmedOrderId,
      shipping,
      payment,
      openCheckout,
      closeCheckout,
      setShipping,
      setPayment,
      goToShipping,
      goToPayment,
      goBackToPayment,
      goToReview,
      goToConfirmed,
      validateShipping,
      validatePayment,
    ]
  );

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return ctx;
}

export { minDeliveryDateIso };
