'use client';

import { useEffect, useState, useCallback } from "react";

export type SubscriptionUsage = {
  hasSubscription: boolean;
  canCreate: boolean;
  activeListingsCount?: number;
  maxListings?: number;
  remaining?: number;
  plan?: {
    name: string;
    slug: string;
  };
  expiresAt?: string;
  reason?: string | null;
};

export function useSubscriptionUsage() {
  const [usage, setUsage] = useState<SubscriptionUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscription/usage");
      const data = await res.json();
      setUsage(data);
    } catch (error) {
      console.error("خطا در دریافت وضعیت اشتراک:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, isLoading, refetch: fetchUsage };
}