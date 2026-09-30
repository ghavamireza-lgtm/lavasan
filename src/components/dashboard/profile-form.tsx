// src/components/dashboard/profile-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  updateProfileSchema,
  type UpdateProfileData,
} from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function ProfileForm() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      mobile: (user as any)?.mobile || "",
    },
  });

  async function formSubmit(data: UpdateProfileData) {
    setServerError(null);
    setSuccess(false);
    setLoading(true);

    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setServerError(err.error || "خطا در ذخیره پروفایل");
      return;
    }

    setSuccess(true);
    router.refresh();

    // رفرش session
    await authClient.getSession();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نام و نام خانوادگی</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>شماره موبایل</FormLabel>
              <FormControl>
                <Input dir="ltr" placeholder="09123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">✅ پروفایل با موفقیت ذخیره شد</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
        </Button>
      </form>
    </Form>
  );
}