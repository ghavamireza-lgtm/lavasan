// src/components/dashboard/listing-card.tsx
'use client';

import { useRouter } from "next/navigation";
import { MapPin, Phone, Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListingStatusBadge } from "./listing-status-badge";
import type { Listing } from "@/hooks/use-listings";

type Props = {
  listing: Listing;
  onDelete?: (listing: Listing) => void;
};

export function ListingCard({ listing, onDelete }: Props) {
  const router = useRouter();
  const createdDate = new Date(listing.createdAt).toLocaleDateString("fa-IR");

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold truncate">{listing.title}</h3>
            <ListingStatusBadge status={listing.status} />
          </div>
          <p className="text-xs text-muted-foreground">
            {listing.category} • {createdDate}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="ghost" size="icon" className="h-8 w-8" />}
          >
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                router.push(`/dashboard/listings/${listing._id}/edit`)
              }
            >
              <Pencil className="h-4 w-4 me-2" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(listing)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 me-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>

        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>
              {listing.city}، {listing.province}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <span dir="ltr">{listing.phone}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{listing.views} بازدید</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}