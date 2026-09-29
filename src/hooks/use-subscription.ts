'use client';

import { useEffect, useState } from "react";

export type Plan = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  durationDays: number;
  maxListings: number;
  featuredListings: number;
  features: string[];
};

export type Subscription = {
  _id: string;
  userId: string;
  planId: string;
  planSlug: string;
  status: "active" | "expired" | "cancelled";
  startsAt: string;
  expiresAt: string;
  plan?: Plan;
};

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/subscription");

        if (!res.ok) {
          throw new Error("خطا در دریافت اشتراک");
        }

        const data = await res.json();
        setSubscription(data.subscription);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطای ناشناخته");
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubscription();
  }, []);

  return { subscription, isLoading, error };
}