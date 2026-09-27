"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { signUpSchema, type SignUpFormData } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
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
      mobile: data.mobile, //  ← بعداً که فیلد رو به Better Auth اضافه کردیم
    } as any); // مو

    setLoading(false);

    if (signUpError) {
      setServerError(signUpError.message || "خطا در ثبت نام");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", padding: 20 }}>
      <h1>ثبت‌نام</h1>
      <form onSubmit={handleSubmit(formSubmit)}>
        <div style={{ marginBottom: 12 }}>
          <label>نام و نام خانوادگی</label>
          <input
            type="text"
            {...register("name")}
            style={{ width: "100%", padding: 8 }}
          />
          {errors.name && (
            <p style={{ color: "red", fontSize: 12 }}>{errors.name.message}</p>
          )}
        </div>

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
        <div style={{ marginBottom: 12 }}>
          <label>تکرار رمز عبور</label>
          <input
            type="password"
            dir="ltr"
            {...register("confirmPassword")}
            style={{ width: "100%", padding: 8 }}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>شماره موبایل</label>
          <input
            type="text"
            dir="ltr"
            {...register("mobile")}
            style={{ width: "100%", padding: 8 }}
          />
          {errors.mobile && (
            <p style={{ color: "red", fontSize: 12 }}>
              {errors.mobile.message}
            </p>
          )}
        </div>

        {serverError && <p style={{ color: "red" }}>{serverError}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10 }}
        >
          {loading ? "در حال ثبت..." : "ثبت‌نام"}
        </button>
      </form>
    </div>
  );
}