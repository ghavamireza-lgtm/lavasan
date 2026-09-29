'use client';

import { useEffect, useState, useCallback } from "react";

export type FeaturedUsage = {
  canFeature: boolean;
  maxFeatured: number;
  usedFeatured: number;
  remaining: number;
};

export function useFeaturedUsage() {
  const [usage, setUsage] = useState<FeaturedUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/subscription/featured-usage");
      const data = await res.json();
      setUsage(data);
    } catch (error) {
      console.error("خطا در دریافت وضعیت آگهی ویژه:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, isLoading, refetch: fetchUsage };
}