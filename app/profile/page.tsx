"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNavigation from "@/components/BottomNavigation";

export default function Profile() {
  const [userInfo, setUserInfo] = useState({
    name: "김민수",
    gender: "남성",
    age: "25세",
    height: 175,
    weight: 75,
    bmi: 24.5,
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border-2 border-gray-300">
        <div className="h-full overflow-y-auto pb-28 pt-0">
          <div className="bg-white h-full">
            {/* 헤더 */}
            <div className="flex justify-between items-center p-3 pt-0 sm:p-4 sm:pt-2 md:p-5 md:pt-2 border-b border-gray-100">
              <div className="flex items-center">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                  프로필
                </h1>
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

            {/* 프로필 정보 */}
            <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
              <p className="text-sm text-gray-500 mb-2">
                기입된 내 정보를 확인하세요
              </p>

              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl">
                      {userInfo.name.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-black rounded-full p-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-base">이름</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium">
                      {userInfo.name}
                    </span>
                    <button className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-base">성별</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium">
                      {userInfo.gender}
                    </span>
                    <button className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-base">나이</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium">
                      {userInfo.age}
                    </span>
                    <button className="ml-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 신체 정보 */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-lg font-bold mb-4">신체 정보</h2>

              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <div className="w-full h-full rounded-full border-8 border-blue-400 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{userInfo.bmi}</div>
                      <div className="text-sm text-gray-500">BMI</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-base">키</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <input
                      type="number"
                      value={userInfo.height}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          height: parseInt(e.target.value),
                        })
                      }
                      className="w-20 p-2 text-right outline-none"
                    />
                    <span className="px-2 bg-gray-100">cm</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base">몸무게</span>
                  <div className="flex items-center border rounded-md overflow-hidden">
                    <input
                      type="number"
                      value={userInfo.weight}
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          weight: parseInt(e.target.value),
                        })
                      }
                      className="w-20 p-2 text-right outline-none"
                    />
                    <span className="px-2 bg-gray-100">kg</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomNavigation activePage="profile" />
      </div>
    </div>
  );
}
