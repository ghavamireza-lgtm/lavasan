// src/app/listing/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  Star,
  Eye,
} from "lucide-react";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";
import { PublicHeader } from "@/components/public/public-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = { params: Promise<{ id: string }> };

export default async function ListingDetailPage({ params }: Params) {
  const { id } = await params;

  await connectDB();

  let listing;
  try {
    listing = await Listing.findById(id).lean();
  } catch {
    notFound();
  }

  if (!listing || listing.status !== "published") {
    notFound();
  }

  // افزایش بازدید
  await Listing.findByIdAndUpdate(id, { $inc: { views: 1 } });

  const createdDate = new Date(listing.createdAt).toLocaleDateString("fa-IR");

  return (
    <div className="min-h-screen bg-muted/20">
      <PublicHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* دکمه برگشت */}
        <Button
          variant="ghost"
          nativeButton={false}
          render={<Link href="/" />}
        >
          <ArrowRight className="h-4 w-4 me-2" />
          بازگشت به لیست
        </Button>

        {/* کارت اصلی */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {listing.featured && (
                    <Badge className="bg-amber-500 text-white">
                      <Star className="h-3 w-3 me-1 fill-white" />
                      ویژه
                    </Badge>
                  )}
                  <Badge variant="secondary">{listing.category}</Badge>
                </div>
                <CardTitle className="text-2xl mb-2">
                  {listing.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {listing.city}، {listing.province}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{listing.views} بازدید</span>
                  </div>
                  <span>{createdDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* توضیحات */}
            <div>
              <h2 className="font-semibold mb-2">توضیحات</h2>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* آدرس */}
            <div>
              <h2 className="font-semibold mb-2">آدرس</h2>
              <p className="text-sm text-muted-foreground">
                {listing.address}
              </p>
            </div>

            {/* تماس */}
            <div>
              <h2 className="font-semibold mb-3">راه‌های تماس</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  nativeButton={false}
                  render={
                    <a href={`tel:${listing.phone}`} />
                  }
                >
                  <Phone className="h-4 w-4 me-2" />
                  {listing.phone}
                </Button>

                {listing.whatsapp && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={`https://wa.me/${listing.whatsapp.replace(/^0/, "98")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <MessageCircle className="h-4 w-4 me-2" />
                    واتساپ
                  </Button>
                )}

                {listing.website && (
                  <Button
                    variant="outline"
                    nativeButton={false}
                    render={
                      <a
                        href={listing.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      />
                    }
                  >
                    <Globe className="h-4 w-4 me-2" />
                    وب‌سایت
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}