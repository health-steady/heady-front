import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "혈당 통계 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "일별 혈당 수치 변화를 차트로 확인하고 AI 분석 리포트를 통해 건강 상태를 파악하세요.",
  openGraph: {
    title: "혈당 통계 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "일별 혈당 수치 변화를 차트로 확인하고 AI 분석 리포트를 통해 건강 상태를 파악하세요.",
    url: "https://healthsteady.site/stats",
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
    title: "혈당 통계 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "일별 혈당 수치 변화를 차트로 확인하고 AI 분석 리포트를 통해 건강 상태를 파악하세요.",
    images: [
      "https://github.com/health-steady/heady-front/blob/main/public/images/logo.png?raw=true",
    ],
  },
};

export default function StatsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
