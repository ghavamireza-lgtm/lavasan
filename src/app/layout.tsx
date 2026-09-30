import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
    <html lang="fa" dir="rtl" className={iranSans.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
