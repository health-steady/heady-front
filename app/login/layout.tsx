import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "로그인 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
  description:
    "Heady 계정으로 로그인하여 개인 맞춤형 혈당 관리 서비스를 이용하세요.",
  openGraph: {
    title: "로그인 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "Heady 계정으로 로그인하여 개인 맞춤형 혈당 관리 서비스를 이용하세요.",
    url: "https://healthsteady.site/login",
    type: "website",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Heady - AI 기반 개인 맞춤 혈당 관리 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "로그인 | Heady: AI 기반 개인 맞춤 혈당 관리 서비스",
    description:
      "Heady 계정으로 로그인하여 개인 맞춤형 혈당 관리 서비스를 이용하세요.",
    images: ["/images/logo.png"],
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
