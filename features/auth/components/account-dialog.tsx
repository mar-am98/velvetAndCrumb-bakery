"use client";

import { useState } from "react";
import { History, Loader2, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PastOrdersDialog } from "@/features/orders/components/past-orders-dialog";
import { useAuth } from "../context";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserFullName,
} from "../lib/display-name";

/** Google "G" logo — lucide/shadcn ship no brand icons, so this is an inline SVG. */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/** Customer Account dialog — store design 8 (signed out) / 9 (signed in). */
export function AccountDialog() {
  const {
    user,
    loading,
    signInWithGoogle,
    signOut,
    accountDialogOpen,
    accountDialogReason,
    closeAccountDialog,
  } = useAuth();

  const handleOpenChange = (open: boolean) => {
    if (!open) closeAccountDialog();
  };

  const [pastOrdersOpen, setPastOrdersOpen] = useState(false);

  return (
    <Dialog open={accountDialogOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-6 bg-background p-8 text-center sm:max-w-sm sm:rounded-3xl">
        <DialogTitle className="sr-only">Customer Account</DialogTitle>
        <DialogDescription className="sr-only">
          {accountDialogReason ??
            "Sign in to track your artisan orders and earn bakery rewards."}
        </DialogDescription>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full bg-brand-espresso text-brand-cream">
                <UserIcon className="size-5" />
              </div>
              <div className="space-y-2">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  Customer Account
                </h2>
                <p className="mx-auto max-w-[40ch] text-sm text-muted-foreground">
                  {accountDialogReason ??
                    "Sign in to track your artisan orders and earn bakery rewards."}
                </p>
              </div>
            </div>

            {!user ? (
              <Button
                type="button"
                variant="outline"
                onClick={signInWithGoogle}
                className="h-11 w-full gap-2.5 rounded-xl text-sm font-medium"
              >
                <GoogleIcon className="size-4" />
                Sign in with Google
              </Button>
            ) : (
              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3 rounded-xl bg-brand-cream px-4 py-3">
                  <Avatar size="sm" className="size-9">
                    {getUserAvatarUrl(user) ? (
                      <AvatarImage
                        src={getUserAvatarUrl(user)}
                        alt={getUserFullName(user)}
                      />
                    ) : null}
                    <AvatarFallback className="bg-brand-espresso text-xs font-bold text-brand-cream">
                      {getUserDisplayName(user).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-brand-espresso">
                      {getUserFullName(user)}
                    </p>
                    {user.email ? (
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                </div>

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
                  variant="outline"
                  onClick={signOut}
                  className="h-11 w-full border-brand-crimson/20 bg-brand-crimson/5 text-sm font-semibold text-brand-crimson hover:bg-brand-crimson/10 hover:text-brand-crimson"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </>
        )}
        <PastOrdersDialog open={pastOrdersOpen} onOpenChange={setPastOrdersOpen} />
      </DialogContent>
    </Dialog>
  );
}
