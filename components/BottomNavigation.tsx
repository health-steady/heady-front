import React from "react";
import Link from "next/link";

interface BottomNavigationProps {
  activePage?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activePage = "home",
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border border-gray-300 flex justify-around py-3 z-50 w-full max-w-[500px] mx-auto shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center text-sm transition-all duration-200 transform hover:scale-110 active:scale-95 hover:text-blue-500 ${
          activePage === "home" ? "text-blue-500 font-medium" : "text-gray-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="mt-1">홈</span>
      </Link>
      <Link
        href="/stats"
        className={`flex flex-col items-center justify-center text-sm transition-all duration-200 transform hover:scale-110 active:scale-95 hover:text-blue-500 ${
          activePage === "stats" ? "text-blue-500 font-medium" : "text-gray-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span className="mt-1">통계</span>
      </Link>
      <Link
        href="/calendar"
        className={`flex flex-col items-center justify-center text-sm transition-all duration-200 transform hover:scale-110 active:scale-95 hover:text-blue-500 ${
          activePage === "calendar"
            ? "text-blue-500 font-medium"
            : "text-gray-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="mt-1">기록</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center justify-center text-sm transition-all duration-200 transform hover:scale-110 active:scale-95 hover:text-blue-500 ${
          activePage === "profile"
            ? "text-blue-500 font-medium"
            : "text-gray-500"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 sm:h-7 sm:w-7 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="mt-1">내정보</span>
      </Link>
    </div>
  );
};

export default BottomNavigation;
