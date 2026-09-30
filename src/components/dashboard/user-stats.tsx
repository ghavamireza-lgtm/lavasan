// src/components/dashboard/user-stats.tsx
"use client";

import { useEffect, useState } from "react";
import { ListChecks, Eye, Star, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Stats = {
  total: number;
  published: number;
  draft: number;
  featured: number;
  totalViews: number;
};

export function UserStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/user/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("خطا:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return null;
  }

  const items = [
    {
      label: "کل آگهی‌ها",
      value: stats.total,
      icon: FileText,
      color: "text-blue-500",
    },
    {
      label: "منتشرشده",
      value: stats.published,
      icon: ListChecks,
      color: "text-green-500",
    },
    {
      label: "آگهی ویژه",
      value: stats.featured,
      icon: Star,
      color: "text-amber-500",
    },
    {
      label: "کل بازدید",
      value: stats.totalViews,
      icon: Eye,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </p>
                  <p className="text-2xl font-bold">
                    {item.value.toLocaleString("fa-IR")}
                  </p>
                </div>
                <Icon className={`h-8 w-8 ${item.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}