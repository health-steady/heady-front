import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "프로필 설정 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "개인 정보와 혈당 목표치를 설정하여 더욱 정확한 맞춤형 건강 관리를 받으세요.",
  openGraph: {
    title: "프로필 설정 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "개인 정보와 혈당 목표치를 설정하여 더욱 정확한 맞춤형 건강 관리를 받으세요.",
    url: "https://healthsteady.site/profile",
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
    title: "프로필 설정 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "개인 정보와 혈당 목표치를 설정하여 더욱 정확한 맞춤형 건강 관리를 받으세요.",
    images: [
      "https://github.com/health-steady/heady-front/blob/main/public/images/logo.png?raw=true",
    ],
  },
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
