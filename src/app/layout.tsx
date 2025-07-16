import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Accounts Management System",
  description: "A modern accounts management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-cairo">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

