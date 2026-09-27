import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const iranSans = localFont({
  src: [
    {
      path: "../../fonts/IRANSans/IRANSans.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/IRANSans/IRANSans.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/IRANSans/IRANSans-bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../fonts/IRANSans/IRANSans-black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-iran-sans",
});

export const metadata: Metadata = {
  title: "لواسانلاین",
  description: "سایت آگهی مشاغل",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={cn("font-sans", geist.variable)}>
      <body
        className={`${iranSans.variable} antialiased bg-gray-50 min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
