import "./globals.css";
import type { Metadata } from "next";
import ClientLayout from "@/app/client-layout";

export const metadata: Metadata = {
  title: "Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "혈당 기록, 식사/영양소 추적, AI 분석 리포트로 건강한 습관을 돕는 웹 앱. 정확한 혈당 데이터 분석과 맞춤형 피드백을 통해 효과적인 당뇨 관리를 경험하세요.",
  keywords: ["혈당관리", "당뇨", "AI", "건강", "혈당기록", "영양소", "맞춤형"],
  authors: [{ name: "Heady Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    url: "https://healthsteady.site",
    title: "Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "혈당 기록, 식사/영양소 추적, AI 분석 리포트로 건강한 습관을 돕는 웹 앱. 정확한 혈당 데이터 분석과 맞춤형 피드백을 통해 효과적인 당뇨 관리를 경험하세요.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Heady - AI 기반 개인 맞춤 혈당 관리 서비스",
      },
    ],
    siteName: "Heady",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "혈당 기록, 식사/영양소 추적, AI 분석 리포트로 건강한 습관을 돕는 웹 앱. 정확한 혈당 데이터 분석과 맞춤형 피드백을 통해 효과적인 당뇨 관리를 경험하세요.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
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
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className="font-gmarket">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
