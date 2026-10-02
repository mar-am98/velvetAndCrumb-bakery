import type { User } from "@supabase/supabase-js";

/** First name for header display (matches signed-in mock in store design). */
export function getUserDisplayName(user: User): string {
  const fullName = user.user_metadata?.full_name as string | undefined;
  if (fullName?.trim()) {
    return fullName.trim().split(/\s+/)[0] ?? fullName;
  }
  const email = user.email;
  if (email) {
    return email.split("@")[0] ?? "Account";
  }
  return "Account";
}

/** Full name for the account dialog (matches signed-in mock in store design). */
export function getUserFullName(user: User): string {
  const fullName = user.user_metadata?.full_name as string | undefined;
  if (fullName?.trim()) {
    return fullName.trim();
  }
  return getUserDisplayName(user);
}

export function getUserAvatarUrl(user: User): string | undefined {
  const avatar = user.user_metadata?.avatar_url;
  return typeof avatar === "string" && avatar.length > 0 ? avatar : undefined;
}
