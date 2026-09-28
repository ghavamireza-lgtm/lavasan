// src/app/dashboard/layout.tsx
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* سایدبار - دسکتاپ */}
        <DashboardSidebar />

        {/* محتوای اصلی */}
        <div className="flex-1 flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}