"use client";

import { Loader2, User as UserIcon } from "lucide-react";
import { useAuth } from "../context";
import { getUserAvatarUrl, getUserDisplayName } from "../lib/display-name";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Header pill — "Sign In" or the user's avatar + first name; opens the Customer Account dialog. */
export function AccountButton() {
  const { user, loading, openAccountDialog } = useAuth();

  if (loading) {
    return (
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border sm:w-24"
        aria-hidden
      >
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const label = user ? getUserDisplayName(user) : "Sign In";
  const avatarUrl = user ? getUserAvatarUrl(user) : undefined;
  const initials = user ? getUserDisplayName(user).slice(0, 2).toUpperCase() : "";

  return (
    <button
      type="button"
      onClick={() => openAccountDialog()}
      aria-label={user ? `Account — ${label}` : "Sign in"}
      className="flex h-10 items-center gap-2 rounded-full border border-border px-2.5 text-sm font-medium text-brand-espresso outline-none transition-colors hover:bg-brand-espresso/5 focus-visible:border-brand-espresso sm:px-3.5"
    >
      {user ? (
        <Avatar size="sm" className="size-6">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={label} /> : null}
          <AvatarFallback className="bg-brand-espresso text-[9px] font-bold text-brand-cream">
            {initials}
          </AvatarFallback>
        </Avatar>
      ) : (
        <UserIcon className="h-4 w-4 shrink-0" />
      )}
      {/* Name hidden on mobile so logo + cart still fit at 375px */}
      <span className="hidden max-w-[90px] truncate sm:inline">{label}</span>
    </button>
  );
}
