"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  /** Opens the Customer Account dialog; `reason` explains why sign-in is required. */
  openAccountDialog: (reason?: string) => void;
  closeAccountDialog: () => void;
  accountDialogOpen: boolean;
  accountDialogReason: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogReason, setDialogReason] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: current } }) => {
      setUser(current);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Surface OAuth callback failures (redirected back with ?auth=error)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "error") {
      toast.error("Sign in failed. Please try again.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error("Could not start Google sign-in. Check Supabase Auth settings.");
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Sign out failed. Please try again.");
      return;
    }
    setDialogOpen(false);
    toast.success("Signed out");
  }, [supabase]);

  const openAccountDialog = useCallback((reason?: string) => {
    setDialogReason(reason ?? null);
    setDialogOpen(true);
  }, []);

  const closeAccountDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signInWithGoogle,
      signOut,
      openAccountDialog,
      closeAccountDialog,
      accountDialogOpen: dialogOpen,
      accountDialogReason: dialogReason,
    }),
    [user, loading, signInWithGoogle, signOut, openAccountDialog, closeAccountDialog, dialogOpen, dialogReason]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
