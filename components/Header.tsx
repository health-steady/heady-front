import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface HeaderProps {
  userName: string;
  onProfileClick: () => void;
  profileImageUrl?: string | null;
}

export default function Header({
  userName,
  onProfileClick,
  profileImageUrl,
}: HeaderProps) {
  const router = useRouter();

  const handleNotificationClick = () => {
    Swal.fire({
      title: "알림",
      text: "준비중인 서비스입니다",
      icon: "info",
      confirmButtonText: "확인",
      confirmButtonColor: "#3085d6",
      customClass: {
        popup: "swal2-popup",
        title: "swal2-title",
        htmlContainer: "swal2-html-container",
        confirmButton: "swal2-confirm-button",
      },
    });
  };

  const handleProfileClick = () => {
    if (userName) {
      router.replace("/profile");
    } else {
      onProfileClick();
    }
  };

  return (
    <div className="flex justify-between items-center p-3 py-4 sm:p-4 sm:py-5 md:p-5 md:py-6 border-b border-gray-200">
      <div className="flex items-center">
        <div
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-100 overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-300 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-blue-400"
          onClick={handleProfileClick}
        >
          <img
            src={profileImageUrl || "/default-profile.png"}
            alt="프로필 이미지"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/150?text=사용자";
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-base sm:text-lg md:text-xl">
            오늘의 혈당
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            {userName ? `${userName}님 환영합니다` : "로그인하세요"}
          </p>
        </div>
      </div>
      <div className="relative">
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 cursor-pointer"
          onClick={handleNotificationClick}
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
}
