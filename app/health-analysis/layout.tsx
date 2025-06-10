import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 건강 분석 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "AI가 분석한 혈당 패턴과 건강 상태 리포트를 확인하고 맞춤형 개선 방안을 제안받으세요.",
  openGraph: {
    title: "AI 건강 분석 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "AI가 분석한 혈당 패턴과 건강 상태 리포트를 확인하고 맞춤형 개선 방안을 제안받으세요.",
    url: "https://healthsteady.site/health-analysis",
    type: "website",
    images: [
      {
        url: "https://github.com/health-steady/heady-front/blob/main/public/images/logo.png?raw=true",
        width: 1200,
        height: 630,
        alt: "Heady - AI 기반 개인 맞춤 혈당 관리 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI 건강 분석 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "AI가 분석한 혈당 패턴과 건강 상태 리포트를 확인하고 맞춤형 개선 방안을 제안받으세요.",
    images: [
      "https://github.com/health-steady/heady-front/blob/main/public/images/logo.png?raw=true",
    ],
  },
};

export default function HealthAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
