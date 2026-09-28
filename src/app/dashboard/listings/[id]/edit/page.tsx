import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { ArrowRight } from "lucide-react";
import { getAuth } from "@/lib/auth";
import connectDB from "@/lib/db";
import Listing from "@/models/listing";
import { ListingForm } from "@/components/dashboard/listing-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Params = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Params) {
  const { id } = await params;

  const auth = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    notFound();
  }

  await connectDB();

  const listing = await Listing.findOne({
    _id: id,
    userId: session.user.id,
  }).lean();

  if (!listing) {
    notFound();
  }

  // تبدیل ObjectId به string برای کلاینت
  const serialized = {
    _id: String(listing._id),
    title: listing.title,
    description: listing.description,
    category: listing.category,
    phone: listing.phone,
    whatsapp: listing.whatsapp || "",
    website: listing.website || "",
    address: listing.address,
    city: listing.city,
    province: listing.province,
    logo: listing.logo || "",
    images: listing.images || [],
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={<Link href="/dashboard/listings" />}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">ویرایش آگهی</h1>
          <p className="text-muted-foreground text-sm">{listing.title}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات آگهی</CardTitle>
          <CardDescription>تغییرات را ذخیره کنید</CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm listingId={id} defaultValues={serialized} />
        </CardContent>
      </Card>
    </div>
  );
}