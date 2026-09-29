'use client';

import { useEffect, useState, useCallback } from "react";

export type Listing = {
  _id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  whatsapp?: string;
  website?: string;
  address: string;
  city: string;
  province: string;
  logo?: string;
  images: string[];
  userId: string;
  status: "draft" | "pending" | "published" | "rejected";
  views: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch("/api/listings");

      if (!res.ok) {
        throw new Error("خطا در دریافت آگهی‌ها");
      }

      const data = await res.json();
      setListings(data.listings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // 👇 تابع publish
  const publishListing = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/listings/${id}/publish`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "خطا در انتشار آگهی");
      }
      await fetchListings();
    },
    [fetchListings]
  );

  return { listings, isLoading, error, refetch: fetchListings, publishListing };
}