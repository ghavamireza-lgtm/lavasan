"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";
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

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobile: "",
    },
  });

  async function formSubmit(data: SignUpFormData) {
    setServerError(null);
    setLoading(true);

    const { error: signUpError } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      mobile: data.mobile,
    } as any);

    setLoading(false);

    if (signUpError) {
      setServerError(signUpError.message || "خطا در ثبت نام");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">ثبت‌نام</h1>
        <p className="text-sm text-muted-foreground">
          برای انتشار آگهی، ابتدا ثبت‌نام کنید
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام و نام خانوادگی</FormLabel>
                <FormControl>
                  <Input placeholder="مثلاً علی رضایی" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ایمیل</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    dir="ltr"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رمز عبور</FormLabel>
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
                <FormLabel>تکرار رمز عبور</FormLabel>
                <FormControl>
                  <Input type="password" dir="ltr" {...field} />
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
                  <Input
                    type="text"
                    dir="ltr"
                    placeholder="09123456789"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال ثبت..." : "ثبت‌نام"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        قبلاً ثبت‌نام کرده‌اید؟{" "}
        <Link href="/sign-in" className="text-primary hover:underline">
          ورود
        </Link>
      </p>
    </div>
  );
}