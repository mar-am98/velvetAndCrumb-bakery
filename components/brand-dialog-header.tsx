"use client";

import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface BrandDialogHeaderProps {
  /** Gold eyebrow line above the title (e.g. "Step 1 of 3", "Order History"). */
  eyebrow: string;
  title: string;
}

/** Espresso header block shared by the checkout steps and the past-orders dialog. */
export function BrandDialogHeader({ eyebrow, title }: BrandDialogHeaderProps) {
  return (
    <div className="relative rounded-t-xl bg-brand-espresso px-6 pt-5 pb-4 text-left sm:rounded-t-2xl">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gold">
        {eyebrow}
      </p>
      <h2 className="mt-1.5 font-heading text-xl font-bold text-brand-cream">{title}</h2>
      <DialogClose
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="absolute right-3 top-3 text-brand-cream hover:bg-white/10 hover:text-brand-cream"
          />
        }
      >
        <XIcon />
        <span className="sr-only">Close</span>
      </DialogClose>
    </div>
  );
}
