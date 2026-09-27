import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block text-center mb-6 text-xl font-bold"
        >
          دایرکتوری مشاغل
        </Link>
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}