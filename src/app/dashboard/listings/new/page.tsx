// src/app/dashboard/listings/new/page.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ListingForm } from "@/components/dashboard/listing-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewListingPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Button
          nativeButton={false}
          variant="ghost"
          size="icon"
          render={<Link href="/dashboard/listings" />}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">آگهی جدید</h1>
          <p className="text-muted-foreground text-sm">
            اطلاعات کسب‌وکار خود را وارد کنید
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات آگهی</CardTitle>
          <CardDescription>
            پس از ذخیره، آگهی به‌صورت پیش‌نویس ذخیره می‌شود
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ListingForm />
        </CardContent>
      </Card>
    </div>
  );
}
