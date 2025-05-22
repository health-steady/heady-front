import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "@/app/client-layout";

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
      <head>
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSansMedium.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-gmarket">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
