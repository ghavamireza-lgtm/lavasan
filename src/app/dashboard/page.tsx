"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { useSubscription } from "@/hooks/use-subscription";
import { useListings } from "@/hooks/use-listings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const { user, isLoading } = useCurrentUser();
  const { subscription } = useSubscription();
  const { listings } = useListings();

  if (isLoading) {
    return <p className="text-muted-foreground">در حال بارگذاری...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">سلام {user?.name} 👋</h1>
        <p className="text-muted-foreground">به داشبورد خود خوش آمدید</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات کاربری</CardTitle>
          <CardDescription>اطلاعات حساب شما در دایرکتوری مشاغل</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">نام</p>
              <p className="font-medium">{user?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">ایمیل</p>
              <p className="font-medium" dir="ltr">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">موبایل</p>
              <p className="font-medium" dir="ltr">
                {(user as any)?.mobile || "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">پکیج</p>
              <p className="font-medium">{subscription?.plan?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">پکیج</p>
              <p className="font-medium">{subscription?.plan?.features[0]}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
