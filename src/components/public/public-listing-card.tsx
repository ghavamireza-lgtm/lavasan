import Link from "next/link";
import { MapPin, Phone, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
};

export function PublicListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing._id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {listing.title}
            </h3>
            {listing.featured && (
              <Badge className="bg-amber-500 text-white shrink-0">
                <Star className="h-3 w-3 me-1 fill-white" />
                ویژه
              </Badge>
            )}
          </div>
          <Badge variant="secondary" className="w-fit text-xs">
            {listing.category}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {listing.description}
          </p>

          <div className="flex flex-col gap-2 text-xs text-muted-foreground pt-2 border-t">
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
