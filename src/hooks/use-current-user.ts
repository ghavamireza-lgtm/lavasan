// src/hooks/use-current-user.ts
"use client";

import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending, error } = authClient.useSession();

  return {
    user: session?.user ?? null,
    userId: session?.user?.id ?? null,
    isLoading: isPending,
    error,
  };
}