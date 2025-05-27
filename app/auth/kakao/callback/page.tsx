"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "../../../../services/auth";

export default function KakaoCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus("loading");

        // 카카오 콜백 처리 및 백엔드 OAuth 로그인
        const accessToken = await authService.handleKakaoCallback();

        console.log("카카오 로그인 성공:", accessToken);
        setStatus("success");

        // 로그인 성공 후 메인 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (error) {
        console.error("카카오 로그인 처리 실패:", error);
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다."
        );

        // 에러 발생 시 로그인 페이지로 리다이렉트
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              카카오 로그인 처리 중...
            </h2>
            <p className="text-gray-600">잠시만 기다려주세요.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              로그인 성공!
            </h2>
            <p className="text-gray-600">메인 페이지로 이동합니다...</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              로그인 실패
            </h2>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <p className="text-sm text-gray-500">
              로그인 페이지로 이동합니다...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
