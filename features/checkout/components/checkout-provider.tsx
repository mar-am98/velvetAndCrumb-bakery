"use client";

import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/context";
import { CheckoutProvider as CheckoutStateProvider } from "../context";

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <CheckoutStateProvider user={user}>{children}</CheckoutStateProvider>;
}
