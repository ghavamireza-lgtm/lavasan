// src/components/dashboard/listing-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema, type ListingFormData } from "@/lib/validations/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "رستوران و کافه",
  "فروشگاه",
  "خدمات",
  "پزشکی",
  "آموزش",
  "زیبایی و آرایش",
  "خودرو",
  "املاک",
  "فناوری",
  "سایر",
];

const provinces = [
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "گیلان",
  "مازندران",
  "البرز",
  "خوزستان",
  "کرمان",
];

type Props = {
  listingId?: string;
  defaultValues?: Partial<ListingFormData>;
};

export function ListingForm({ listingId, defaultValues }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(listingId);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      category: defaultValues?.category || "",
      phone: defaultValues?.phone || "",
      whatsapp: defaultValues?.whatsapp || "",
      website: defaultValues?.website || "",
      address: defaultValues?.address || "",
      city: defaultValues?.city || "",
      province: defaultValues?.province || "",
      images: defaultValues?.images || [],
    },
  });

  async function formSubmit(data: ListingFormData) {
    setServerError(null);
    setLoading(true);

    const url = isEdit ? `/api/listings/${listingId}` : "/api/listings";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (!res.ok) {
      const err = await res.json();
      setServerError(err.error || "خطا در ذخیره آگهی");
      return;
    }

    router.push("/dashboard/listings");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(formSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان آگهی</FormLabel>
              <FormControl>
                <Input placeholder="مثلاً رستوران سنتی گلستان" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>توضیحات</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="توضیحات کامل..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>دسته‌بندی</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="یک دسته انتخاب کنید" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>استان</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="استان را انتخاب کنید" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شهر</FormLabel>
                <FormControl>
                  <Input placeholder="مثلاً تهران" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>آدرس</FormLabel>
              <FormControl>
                <Input placeholder="آدرس کامل" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>شماره تماس</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="02112345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>واتساپ (اختیاری)</FormLabel>
                <FormControl>
                  <Input dir="ltr" placeholder="09123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>وب‌سایت (اختیاری)</FormLabel>
                <FormControl>
                  <Input
                    dir="ltr"
                    placeholder="https://example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading
              ? "در حال ذخیره..."
              : isEdit
                ? "ذخیره تغییرات"
                : "ذخیره پیش‌نویس"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            انصراف
          </Button>
        </div>
      </form>
    </Form>
  );
}