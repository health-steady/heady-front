"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import { authService, UserInfo, Target } from "@/services/auth";

export default function Profile() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [localUserInfo, setLocalUserInfo] = useState({
    name: "",
    gender: "",
    birthdate: "",
    height: 0,
    weight: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
      return;
    }

    fetchUserInfo();
  }, [router]);

  const fetchUserInfo = async () => {
    setIsLoading(true);
    try {
      const userData = await authService.getUserInfo();
      setUserInfo(userData);
      setLocalUserInfo({
        name: userData.name,
        gender: userData.nickname
          ? userData.nickname.includes("남성")
            ? "남성"
            : "여성"
          : "여성",
        birthdate: userData.birthdate || "",
        height: userData.height || 0,
        weight: userData.weight || 0,
      });
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  // BMI 계산
  const calculateBMI = () => {
    if (!localUserInfo.height || !localUserInfo.weight) return 0;
    const heightInMeters = localUserInfo.height / 100;
    return (localUserInfo.weight / (heightInMeters * heightInMeters)).toFixed(
      1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
        <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200 flex justify-center items-center">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200">
        <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto bg-white z-10">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-3 py-4 sm:p-4 sm:py-5 md:p-5 md:py-6 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                내 정보
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
        <div className="h-full overflow-y-auto pt-[85px] pb-28">
          <div className="bg-white min-h-full">
            <div className="h-3 sm:h-4 md:h-5 bg-gray-100"></div>

            {/* 프로필 정보 */}
            <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
              <p className="text-sm text-gray-500 mb-2">
                기입된 내 정보를 확인하세요
              </p>

              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 overflow-hidden border-2 border-blue-300">
                    <img
                      src={userInfo?.profileImageUrl || "/default-profile.png"}
                      alt="프로필 이미지"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/150?text=사용자";
                      }}
                    />
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
                      {localUserInfo.name}
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
                      {localUserInfo.gender}
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
                  <span className="text-base">생년월일</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium">
                      {localUserInfo.birthdate}
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
                  <span className="text-base">일일 칼로리 목표</span>
                  <div className="flex items-center">
                    <span className="text-base font-medium">2000 kcal</span>
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
            <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
              <h2 className="text-lg font-bold mb-4">신체 정보</h2>

              <div className="flex justify-center mb-6">
                <div className="relative w-40 h-40">
                  <div className="w-full h-full rounded-full border-8 border-blue-400 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{calculateBMI()}</div>
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
                      value={localUserInfo.height}
                      onChange={(e) =>
                        setLocalUserInfo({
                          ...localUserInfo,
                          height: parseFloat(e.target.value),
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
                      value={localUserInfo.weight}
                      onChange={(e) =>
                        setLocalUserInfo({
                          ...localUserInfo,
                          weight: parseFloat(e.target.value),
                        })
                      }
                      className="w-20 p-2 text-right outline-none"
                    />
                    <span className="px-2 bg-gray-100">kg</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 목표 설정 섹션 */}
            {userInfo?.target && (
              <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
                <h2 className="text-lg font-bold mb-3">목표 설정</h2>

                <h3 className="font-medium text-sm text-gray-600 mb-2">
                  혈당 목표
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">공복 혈당</p>
                    <p className="font-medium">
                      {userInfo.target.fastingBloodSugar} mg/dL
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">식후 혈당</p>
                    <p className="font-medium">
                      {userInfo.target.postprandialBloodSugar} mg/dL
                    </p>
                  </div>
                </div>

                <h3 className="font-medium text-sm text-gray-600 mb-2">
                  영양 목표
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">탄수화물</p>
                    <p className="font-medium">
                      {userInfo.target.carbohydrate.toFixed(1)}g
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">단백질</p>
                    <p className="font-medium">
                      {userInfo.target.protein.toFixed(1)}g
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">지방</p>
                    <p className="font-medium">
                      {userInfo.target.fat.toFixed(1)}g
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">칼로리</p>
                    <p className="font-medium">
                      {/* 칼로리 계산: 탄수화물 4kcal + 단백질 4kcal + 지방 9kcal */}
                      {Math.round(
                        userInfo.target.carbohydrate * 4 +
                          userInfo.target.protein * 4 +
                          userInfo.target.fat * 9
                      )}{" "}
                      kcal
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 계정 정보 섹션 */}
            {userInfo && (
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h2 className="text-lg font-bold mb-3">계정 정보</h2>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <p className="text-gray-500">이메일</p>
                    <p>{userInfo.email}</p>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <p className="text-gray-500">가입일</p>
                    <p>{new Date(userInfo.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <p className="text-gray-500">최근 정보 수정일</p>
                    <p>{new Date(userInfo.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white border-t border-gray-200">
          <BottomNavigation activePage="mypage" />
        </div>
      </div>
    </div>
  );
}
