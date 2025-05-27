"use client";

import { authService } from "../services/auth";
import { useState } from "react";

interface KakaoLoginButtonProps {
  onSuccess?: (accessToken: string) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export default function KakaoLoginButton({
  onSuccess,
  onError,
  className = "w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 transition-colors",
}: KakaoLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleKakaoLogin = async () => {
    try {
      setIsLoading(true);
      await authService.kakaoLogin();
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleKakaoLogin}
      disabled={isLoading}
    >
      <div className="w-6 h-6 mr-2 bg-[#FEE500] flex items-center justify-center text-black font-bold rounded-sm">
        K
      </div>
      {isLoading ? "로그인 중..." : "카카오 로그인"}
    </button>
  );
}
