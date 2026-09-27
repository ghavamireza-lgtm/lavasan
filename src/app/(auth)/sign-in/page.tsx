"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";
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

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function formSubmit(data: SignInFormData) {
    setServerError(null);
    setLoading(true);

    const { error: signInError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    setLoading(false);

    if (signInError) {
      setServerError(signInError.message || "ایمیل یا رمز عبور اشتباه است");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">ورود</h1>
        <p className="text-sm text-muted-foreground">
          به حساب کاربری خود وارد شوید
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-4">
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

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "در حال ورود..." : "ورود"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground">
        حساب کاربری ندارید؟{" "}
        <Link href="/sign-up" className="text-primary hover:underline">
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}