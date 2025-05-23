import React, { useState, useEffect } from "react";
import Link from "next/link";
import LoginModal from "./LoginModal";

interface BottomNavigationProps {
  activePage: "home" | "calendar" | "stats" | "mypage";
}

export default function BottomNavigation({
  activePage,
}: BottomNavigationProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // 로그인 상태 확인
    const accessToken = localStorage.getItem("accessToken");
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleProtectedLink = (e: React.MouseEvent, path: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
  };

  const handleLogin = (email: string, password: string) => {
    // 로그인 성공 후 상태 업데이트
    setIsLoggedIn(true);
  };

  const handleSignupClick = () => {
    // 회원가입 페이지로 이동하거나 회원가입 모달 표시
    // 여기서는 모달만 닫습니다
    setShowLoginModal(false);
  };

  return (
    <>
      <div className="flex justify-around items-center h-16 px-2">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center w-1/4 py-2 ${
            activePage === "home"
              ? "text-blue-500"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={activePage === "home" ? 2.5 : 1.5}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs mt-1 font-medium">홈</span>
        </Link>

        {isLoggedIn ? (
          <Link
            href="/calendar"
            className={`flex flex-col items-center justify-center w-1/4 py-2 ${
              activePage === "calendar"
                ? "text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activePage === "calendar" ? 2.5 : 1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">기록</span>
          </Link>
        ) : (
          <a
            href="#"
            className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => handleProtectedLink(e, "/calendar")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">기록</span>
          </a>
        )}

        {isLoggedIn ? (
          <Link
            href="/stats"
            className={`flex flex-col items-center justify-center w-1/4 py-2 ${
              activePage === "stats"
                ? "text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activePage === "stats" ? 2.5 : 1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">통계</span>
          </Link>
        ) : (
          <a
            href="#"
            className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => handleProtectedLink(e, "/stats")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">통계</span>
          </a>
        )}

        {isLoggedIn ? (
          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-1/4 py-2 ${
              activePage === "mypage"
                ? "text-blue-500"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={activePage === "mypage" ? 2.5 : 1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">내정보</span>
          </Link>
        ) : (
          <a
            href="#"
            className="flex flex-col items-center justify-center w-1/4 py-2 text-gray-400 hover:text-gray-600"
            onClick={(e) => handleProtectedLink(e, "/profile")}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs mt-1 font-medium">내정보</span>
          </a>
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModal}
          onLogin={handleLogin}
          onSignupClick={handleSignupClick}
        />
      )}
    </>
  );
}
