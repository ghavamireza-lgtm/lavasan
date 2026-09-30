// src/components/dashboard/change-password-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordData,
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

export function ChangePasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function formSubmit(data: ChangePasswordData) {
    setServerError(null);
    setSuccess(false);
    setLoading(true);

    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setServerError(err.error || "خطا در تغییر رمز");
      return;
    }

    setSuccess(true);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز فعلی</FormLabel>
              <FormControl>
                <Input type="password" dir="ltr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>رمز جدید</FormLabel>
              <FormControl>
                <Input type="password" dir="ltr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>تکرار رمز جدید</FormLabel>
              <FormControl>
                <Input type="password" dir="ltr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        {success && (
          <p className="text-sm text-green-600">✅ رمز با موفقیت تغییر کرد</p>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "در حال تغییر..." : "تغییر رمز"}
        </Button>
      </form>
    </Form>
  );
}