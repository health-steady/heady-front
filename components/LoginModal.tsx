import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { authService } from "../services/auth";
import axios from "axios";
import Swal from "sweetalert2";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  onSignupClick: () => void;
}

// 데이터 인터페이스 정의
interface BloodSugarSummary {
  // 혈당 요약 데이터 타입
  date: string;
  // 여기에 실제 혈당 데이터 필드를 추가하세요
}

interface NutrientsSummary {
  // 영양소 요약 데이터 타입
  date: string;
  // 여기에 실제 영양소 데이터 필드를 추가하세요
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onSignupClick,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오는 함수
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 데이터를 가져오는 함수
  const fetchData = async () => {
    const currentDate = getCurrentDate();
    const token = localStorage.getItem("accessToken");

    if (!token) {
      console.error("토큰이 없습니다.");
      return;
    }

    try {
      // 혈당 데이터 가져오기
      const bloodSugarResponse = await axios.get<BloodSugarSummary>(
        `${API_BASE_URL}${API_ENDPOINTS.BLOOD_SUGAR_SUMMARY}?date=${currentDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 영양소 데이터 가져오기
      const nutrientsResponse = await axios.get<NutrientsSummary>(
        `${API_BASE_URL}${API_ENDPOINTS.NUTRIENTS_SUMMARY}?date=${currentDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("혈당 데이터:", bloodSugarResponse.data);
      console.log("영양소 데이터:", nutrientsResponse.data);

      // 여기서 가져온 데이터를 상태 관리 라이브러리나 컨텍스트에 저장할 수 있습니다
      // 예: dispatch(setBloodSugarData(bloodSugarResponse.data));
      // 예: dispatch(setNutrientsData(nutrientsResponse.data));
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const accessToken = await authService.login(email, password);
      // localStorage.setItem은 login 함수 내부에서 이미 처리됨

      // 로그인 성공 시 모달 닫기
      onClose();

      // 로그인 성공 이벤트를 상위 컴포넌트에 전달
      onLogin(email, password);

      // API 데이터 가져오기
      await fetchData();

      // SweetAlert을 사용하여 상단에 토스트 형태로 로그인 성공 알림 표시
      Swal.fire({
        title: "로그인 성공!",
        text: "환영합니다!",
        icon: "success",
        position: "top",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        toast: true,
      });

      // 토스트 알림이 표시된 후 일정 시간 후에 리다이렉션 (사용자가 알림을 볼 수 있도록)
      setTimeout(() => {
        // 메인 페이지로 리다이렉션
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      console.error("로그인 실패:", error);
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  // 카카오 로그인 핸들러
  const handleKakaoLogin = async () => {
    try {
      setError("");
      await authService.kakaoLogin();
    } catch (error) {
      console.error("카카오 로그인 오류:", error);
      setError("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // Google 로그인 핸들러
  const handleGoogleLogin = async () => {
    try {
      setError("");
      await authService.googleLogin();
    } catch (error) {
      console.error("Google 로그인 오류:", error);
      setError("Google 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (!isOpen || !isMounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 로그인 헤더 - 간소화 */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl">로그인</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-black text-white rounded-lg font-medium mb-4"
            >
              로그인
            </button>

            <div className="flex justify-center text-sm text-gray-600 mb-6">
              <a href="#" className="hover:underline">
                비밀번호 찾기
              </a>
              <span className="mx-2">|</span>
              <a
                href="#"
                className="hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  onSignupClick();
                }}
              >
                회원가입
              </a>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">또는</span>
              </div>
            </div>

            {/* 소셜 로그인 버튼 */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 transition-colors"
                onClick={handleKakaoLogin}
              >
                <div className="w-6 h-6 mr-2 bg-[#FEE500] flex items-center justify-center text-black font-bold rounded-sm">
                  K
                </div>
                카카오 로그인
              </button>

              <button
                type="button"
                className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 transition-colors"
                onClick={handleGoogleLogin}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  width="24px"
                  height="24px"
                  className="mr-2"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                Continue with Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  // React Portal을 사용하여 모달을 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default LoginModal;
