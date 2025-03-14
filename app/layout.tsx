import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heady - 혈당 관리 서비스",
  description: "당신의 혈당을 효과적으로 관리하세요",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="bg-background">{children}</body>
    </html>
  );
}
