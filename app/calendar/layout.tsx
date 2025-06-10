import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "혈당 캘린더 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "월별 혈당 기록을 캘린더 형태로 확인하고 일별 혈당 변화 추이를 한눈에 파악하세요.",
  openGraph: {
    title: "혈당 캘린더 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "월별 혈당 기록을 캘린더 형태로 확인하고 일별 혈당 변화 추이를 한눈에 파악하세요.",
    url: "https://healthsteady.site/calendar",
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
    title: "혈당 캘린더 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "월별 혈당 기록을 캘린더 형태로 확인하고 일별 혈당 변화 추이를 한눈에 파악하세요.",
    images: [
      "https://github.com/health-steady/heady-front/blob/main/public/images/logo.png?raw=true",
    ],
  },
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
