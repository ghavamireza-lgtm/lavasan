'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, User, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "آگهی‌های من",
    href: "/dashboard/listings",
    icon: ListChecks,
  },
  {
    title: "پکیج‌ها",
    href: "/dashboard/plans",
    icon: CreditCard,
  },
  {
    title: "پروفایل",
    href: "/dashboard/profile",
    icon: User,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-background border-l">
      <div className="p-6 border-b">
        <Link href="/" className="text-xl font-bold">
          دایرکتوری مشاغل
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
