// src/app/page.tsx
'use client';

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { PublicHeader } from "@/components/public/public-header";
import { PublicListingCard } from "@/components/public/public-listing-card";
import { ListingFilters } from "@/components/public/listing-filters";
import { Button } from "@/components/ui/button";

type Listing = {
  _id: string;
  title: string;
  description: string;
  category: string;
  phone: string;
  city: string;
  province: string;
  featured: boolean;
  views: number;
  createdAt: string;
  images?: string[];
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [province, setProvince] = useState("");
  const [page, setPage] = useState(1);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (province) params.set("city", province);

      const res = await fetch(`/api/public/listings?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, category, province]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // با تغییر فیلترها، برگرد به صفحه ۱
  useEffect(() => {
    setPage(1);
  }, [search, category, province]);

  return (
    <div className="min-h-screen bg-muted/20">
      <PublicHeader />

      {/* Hero */}
      <section className="bg-background border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            دایرکتوری مشاغل ایران
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            کسب‌وکار خود را پیدا کنید یا کسب‌وکار خود را ثبت کنید
          </p>
        </div>
      </section>

      {/* محتوا */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        <ListingFilters
          search={search}
          category={category}
          province={province}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onProvinceChange={setProvince}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              آگهی‌ای یافت نشد
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <PublicListingCard key={listing._id} listing={listing} />
              ))}
            </div>

            {/* صفحه‌بندی */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <Button
                  variant="outline"
                  disabled={!pagination.hasPrev}
                  onClick={() => setPage((p) => p - 1)}
                >
                  قبلی
                </Button>
                <span className="text-sm text-muted-foreground px-4">
                  صفحه {pagination.page} از {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!pagination.hasNext}
                  onClick={() => setPage((p) => p + 1)}
                >
                  بعدی
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}