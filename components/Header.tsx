import React from "react";
import Image from "next/image";

interface HeaderProps {
  userName: string;
  onProfileClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userName, onProfileClick }) => {
  return (
    <div className="flex justify-between items-center p-3 pt-0 sm:p-4 sm:pt-2 md:p-5 md:pt-2 border-b border-gray-100">
      <div className="flex items-center">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gray-200 mr-3 sm:mr-4 md:mr-5 overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer"
          onClick={onProfileClick}
        >
          {/* 프로필 이미지 */}
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-base sm:text-lg md:text-xl">
            {userName.charAt(0)}
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
            안녕하세요, {userName}님!
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-500">
            오늘의 혈당을 기록해주세요
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-300 hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-xs sm:text-sm">
            2
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
