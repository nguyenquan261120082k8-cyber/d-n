import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Toolbox — Bộ công cụ AI thông minh",
  description:
    "AI Toolbox: Sinh code, dịch, tóm tắt và nhiều công cụ AI giúp bạn làm việc hiệu quả hơn. Free 3 lượt/ngày.",
  keywords: ["AI", "code generator", "sinh code", "AI tools", "lập trình"],
  openGraph: {
    title: "AI Toolbox",
    description: "Bộ công cụ AI giúp bạn làm việc thông minh hơn",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}