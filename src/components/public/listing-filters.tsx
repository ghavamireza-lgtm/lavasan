// src/components/public/listing-filters.tsx
'use client';

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  search: string;
  category: string;
  province: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onProvinceChange: (value: string) => void;
};

export function ListingFilters({
  search,
  category,
  province,
  onSearchChange,
  onCategoryChange,
  onProvinceChange,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* جستجو */}
      <div className="relative md:col-span-1">
        <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="ps-9"
        />
      </div>

      {/* دسته‌بندی */}
      <Select
        value={category || "all"}
        onValueChange={(v) => onCategoryChange( v === "all" ? "" : (v ?? "") )}
      >
        <SelectTrigger>
          <SelectValue placeholder="همه دسته‌ها" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه دسته‌ها</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* استان */}
      <Select
        value={province || "all"}
        onValueChange={(v) => onProvinceChange( v === "all" ? "" : (v ?? "") )}
      >
        <SelectTrigger>
          <SelectValue placeholder="همه استان‌ها" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">همه استان‌ها</SelectItem>
          {provinces.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}