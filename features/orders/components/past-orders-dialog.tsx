"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { BrandDialogHeader } from "@/components/brand-dialog-header";
import { OrderList } from "./order-list";

interface PastOrdersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Branded shell around the shared OrderList — lets customers re-open their confirmed orders. */
export function PastOrdersDialog({ open, onOpenChange }: PastOrdersDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="gap-0 overflow-hidden bg-card p-0 sm:max-w-lg sm:rounded-2xl"
      >
        <DialogTitle className="sr-only">Past Orders</DialogTitle>
        <DialogDescription className="sr-only">
          Your previous Velvet &amp; Crumb orders and their status.
        </DialogDescription>

        <BrandDialogHeader eyebrow="Order History" title="Your Past Orders" />

        <div className="px-5 py-5">
          <OrderList />
        </div>
      </DialogContent>
    </Dialog>
  );
}
