// src/components/public/public-header.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          دایرکتوری مشاغل
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href="/sign-in" />}
          >
            ورود
          </Button>
          <Button nativeButton={false} render={<Link href="/sign-up" />}>
            ثبت‌نام
          </Button>
        </nav>
      </div>
    </header>
  );
}