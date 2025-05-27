"use client";

import KakaoLoginButton from "./KakaoLoginButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function KakaoLoginExample() {
  const router = useRouter();

  const handleLoginSuccess = (accessToken: string) => {
    console.log("로그인 성공:", accessToken);
    toast.success("카카오 로그인 성공!");
    // 필요에 따라 페이지 리다이렉트 또는 상태 업데이트
    router.push("/");
  };

  const handleLoginError = (error: Error) => {
    console.error("로그인 실패:", error);
    toast.error(`로그인 실패: ${error.message}`);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">로그인</h2>

      {/* 기본 카카오 로그인 버튼 */}
      <KakaoLoginButton
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />

      {/* 커스텀 스타일 카카오 로그인 버튼 */}
      <div className="mt-4">
        <KakaoLoginButton
          className="w-full py-4 bg-[#FEE500] hover:bg-[#FDD835] text-black font-semibold rounded-lg flex items-center justify-center transition-colors"
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />
      </div>
    </div>
  );
}
