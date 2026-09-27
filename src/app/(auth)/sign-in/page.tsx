'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signInSchema, type SignInFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
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
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h1>ورود</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label>ایمیل</label>
          <input
            type="email"
            dir="ltr"
            {...register("email")}
            style={{ width: "100%", padding: 8 }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: 12 }}>{errors.email.message}</p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>رمز عبور</label>
          <input
            type="password"
            dir="ltr"
            {...register("password")}
            style={{ width: "100%", padding: 8 }}
          />
          {errors.password && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && <p style={{ color: "red" }}>{serverError}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10 }}
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>

      <p style={{ marginTop: 16, textAlign: "center", fontSize: 14 }}>
        حساب کاربری ندارید؟{" "}
        <Link href="/sign-up" style={{ color: "blue" }}>
          ثبت‌نام کنید
        </Link>
      </p>
    </div>
  );
}