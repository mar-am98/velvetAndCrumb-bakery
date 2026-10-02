export const DELIVERY_TIME_WINDOWS = [
  { value: "10:00-12:00", label: "10:00 AM – 12:00 PM" },
  { value: "12:00-14:00", label: "12:00 PM – 2:00 PM" },
  { value: "14:00-16:00", label: "2:00 PM – 4:00 PM" },
  { value: "16:00-18:00", label: "4:00 PM – 6:00 PM" },
] as const;

export type DeliveryTimeWindow = (typeof DELIVERY_TIME_WINDOWS)[number]["value"];

export interface ShippingDetails {
  fullName: string;
  email: string;
  streetAddress: string;
  deliveryDate: string;
  timeWindow: DeliveryTimeWindow | "";
  bakeryNote: string;
}

export const EMPTY_SHIPPING: ShippingDetails = {
  fullName: "",
  email: "",
  streetAddress: "",
  deliveryDate: "",
  timeWindow: "",
  bakeryNote: "",
};

/** Simulated card entry — no real processor (HNG payments are optional). */
export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

export const EMPTY_PAYMENT: PaymentDetails = {
  nameOnCard: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};
