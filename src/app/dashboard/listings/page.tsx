"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Loader2, AlertCircle } from "lucide-react";
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
import { useSubscriptionUsage } from "@/hooks/use-subscription-usage";

export default function ListingsPage() {
  const { listings, isLoading, error, refetch, publishListing } = useListings();
  const {
    usage,
    isLoading: usageLoading,
    refetch: refetchUsage,
  } = useSubscriptionUsage();
  const [deleteTarget, setDeleteTarget] = useState<Listing | null>(null);

  async function handlePublish(listing: Listing) {
    try {
      await publishListing(listing._id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "خطا در انتشار");
    }
  }

  async function handleDeleteSuccess() {
    await Promise.all([refetch(), refetchUsage()]);
  }

  if (isLoading || usageLoading) {
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

  const canCreate = usage?.canCreate ?? false;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">آگهی‌های من</h1>
          <p className="text-muted-foreground text-sm">
            {listings.length > 0
              ? `${listings.length} آگهی`
              : "هنوز آگهی‌ای ندارید"}
            {usage?.maxListings && (
              <span className="ms-2">
                (سقف پکیج {usage.plan?.name}: {usage.maxListings} آگهی)
              </span>
            )}
          </p>
        </div>

        {canCreate ? (
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/listings/new" />}
          >
            <Plus className="h-4 w-4 me-2" />
            آگهی جدید
          </Button>
        ) : (
          <Button disabled>
            <Plus className="h-4 w-4 me-2" />
            آگهی جدید
          </Button>
        )}
      </div>

      {/* پیام محدودیت */}
      {usage && !usage.canCreate && usage.reason === "limit_reached" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium mb-1">
              به سقف آگهی پکیج «{usage.plan?.name}» رسیده‌اید
            </p>
            <p className="text-xs">
              شما {usage.activeListingsCount} از {usage.maxListings} آگهی مجاز
              خود را استفاده کرده‌اید. برای افزودن آگهی بیشتر، پکیج خود را ارتقا
              دهید.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              nativeButton={false}
              render={<Link href="/dashboard/plans" />}
            >
              مشاهده پکیج‌ها
            </Button>
          </div>
        </div>
      )}

      {usage && !usage.hasSubscription && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium mb-1">پکیج فعالی ندارید</p>
            <p className="text-xs">
              برای ایجاد آگهی، ابتدا یک پکیج انتخاب کنید.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              nativeButton={false}
              render={<Link href="/dashboard/plans" />}
            >
              انتخاب پکیج
            </Button>
          </div>
        </div>
      )}

      {listings.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>هنوز آگهی‌ای ندارید</CardTitle>
            <CardDescription>
              برای شروع، اولین آگهی خود را ایجاد کنید
            </CardDescription>
          </CardHeader>
          {canCreate && (
            <CardContent>
              <Button
                nativeButton={false}
                render={<Link href="/dashboard/listings/new" />}
              >
                <Plus className="h-4 w-4 me-2" />
                ایجاد اولین آگهی
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onDelete={(l) => setDeleteTarget(l)}
              onPublish={handlePublish}
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
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
}
