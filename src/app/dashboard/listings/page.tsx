// src/app/dashboard/listings/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ListingCard } from "@/components/dashboard/listing-card";
import { DeleteListingDialog } from "@/components/dashboard/delete-listing-dialog";
import { useListings, type Listing } from "@/hooks/use-listings";

export default function ListingsPage() {
  const { listings, isLoading, error, refetch } = useListings();  // 👈 refetch
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">آگهی‌های من</h1>
          <p className="text-muted-foreground text-sm">
            {listings.length > 0
              ? `${listings.length} آگهی`
              : "هنوز آگهی‌ای ندارید"}
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/listings/new" />}
        >
          <Plus className="h-4 w-4 me-2" />
          آگهی جدید
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>هنوز آگهی‌ای ندارید</CardTitle>
            <CardDescription>
              برای شروع، اولین آگهی خود را ایجاد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/listings/new" />}
            >
              <Plus className="h-4 w-4 me-2" />
              ایجاد اولین آگهی
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onDelete={(l) => setDeleteTarget(l)}
            />
          ))}
        </div>
      )}

      {deleteTarget && (
        <DeleteListingDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          listingId={deleteTarget._id}
          listingTitle={deleteTarget.title}
          onSuccess={refetch}  // 👈 اینجا refetch صدا زده می‌شه
        />
      )}
    </div>
  );
}