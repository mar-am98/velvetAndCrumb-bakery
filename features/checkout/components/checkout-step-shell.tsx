"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandDialogHeader } from "@/components/brand-dialog-header";

interface CheckoutStepShellProps {
  step: 1 | 2 | 3;
  title: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  onCancel: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  primaryLoading?: boolean;
  /** Design: shipping action is espresso, payment action is crimson. */
  primaryTone?: "dark" | "crimson";
}

export function CheckoutStepShell({
  step,
  title,
  children,
  primaryLabel,
  onPrimary,
  onCancel,
  secondaryLabel = "Cancel",
  onSecondary,
  primaryLoading = false,
  primaryTone = "dark",
}: CheckoutStepShellProps) {
  const primaryClassName =
    primaryTone === "crimson"
      ? "h-10 rounded-lg bg-brand-crimson px-5 font-semibold text-white hover:bg-brand-crimson/90 disabled:opacity-60"
      : "h-10 rounded-lg bg-brand-espresso px-5 font-semibold text-brand-cream hover:bg-brand-espresso-light disabled:opacity-60";

  return (
    <>
      <BrandDialogHeader eyebrow={`Step ${step} of 3`} title={title} />

      {children}

      <div className="flex flex-col-reverse gap-3 border-t border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onSecondary ?? onCancel}
          disabled={primaryLoading}
          className="text-muted-foreground hover:text-brand-espresso"
        >
          {secondaryLabel}
        </Button>
        <Button
          type="button"
          onClick={onPrimary}
          disabled={primaryLoading}
          className={primaryClassName}
        >
          {primaryLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Placing Order…
            </>
          ) : (
            primaryLabel
          )}
        </Button>
      </div>
    </>
  );
}
