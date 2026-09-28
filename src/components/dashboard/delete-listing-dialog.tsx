// src/components/dashboard/delete-listing-dialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingTitle: string;
  onSuccess?: () => void;  // 👈 جدید
};

export function DeleteListingDialog({
  open,
  onOpenChange,
  listingId,
  listingTitle,
  onSuccess,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setLoading(true);

    const res = await fetch(`/api/listings/${listingId}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "خطا در حذف آگهی");
      return;
    }

    onOpenChange(false);
    onSuccess?.();  // 👈 صدا زدن callback
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>حذف آگهی</DialogTitle>
          <DialogDescription>
            آیا از حذف آگهی «{listingTitle}» مطمئن هستید؟ این عمل قابل
            بازگشت نیست.
          </DialogDescription>
        </DialogHeader>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            انصراف
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "در حال حذف..." : "حذف"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}