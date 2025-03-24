import React from "react";
import Image from "next/image";

interface HeaderProps {
  userName: string;
  onProfileClick: () => void;
}

export default function Header({ userName, onProfileClick }: HeaderProps) {
  return (
    <div className="flex justify-between items-center p-3 pt-0 sm:p-4 sm:pt-2 md:p-5 md:pt-2 border-b border-gray-200">
      <div className="flex items-center">
        <h1 className="font-bold text-lg sm:text-xl md:text-2xl">혈당 관리</h1>
        <p className="ml-2 text-sm text-gray-500">{userName}님 환영합니다</p>
      </div>
      <div className="relative">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          onClick={onProfileClick}
        >
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
