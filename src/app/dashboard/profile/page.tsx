// src/app/dashboard/profile/page.tsx
"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ChangePasswordForm } from "@/components/dashboard/change-password-form";
import { UserStats } from "@/components/dashboard/user-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { user } = useCurrentUser();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">پروفایل</h1>
        <p className="text-muted-foreground text-sm">
          اطلاعات شخصی و امنیتی خود را مدیریت کنید
        </p>
      </div>

      {/* آمار */}
      <UserStats />

      {/* اطلاعات کاربری */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات کاربری</CardTitle>
          <CardDescription>
            نام و شماره تماس خود را ویرایش کنید
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">
              ایمیل
            </label>
            <p className="text-sm font-medium" dir="ltr">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ایمیل قابل تغییر نیست
            </p>
          </div>

          <ProfileForm />
        </CardContent>
      </Card>

      {/* تغییر رمز */}
      <Card>
        <CardHeader>
          <CardTitle>تغییر رمز عبور</CardTitle>
          <CardDescription>
            برای امنیت بیشتر، رمز خود را به‌طور دوره‌ای تغییر دهید
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}