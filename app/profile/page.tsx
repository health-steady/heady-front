"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNavigation from "@/components/BottomNavigation";
import { authService, UserInfo, Target } from "@/services/auth";
import Swal from "sweetalert2";

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

  // 생년월일 선택을 위한 상태
  const [birthYear, setBirthYear] = useState<number | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);

  // 수정된 값을 임시 저장할 상태
  const [modifiedData, setModifiedData] = useState<Record<string, any>>({});

  // 수정 중인 필드 상태 관리
  const [editingField, setEditingField] = useState<string | null>(null);

  // 변경 사항 있는지 확인
  const hasChanges = Object.keys(modifiedData).length > 0;

  // 수정 시작
  const startEditing = (field: string, value: string | number) => {
    setEditingField(field);
  };

  // 수정 모드 해제
  const stopEditing = () => {
    setEditingField(null);
  };

  // 필드 값 변경 처리
  const handleFieldChange = (field: string, value: string | number) => {
    setModifiedData({
      ...modifiedData,
      [field]: value,
    });
  };

  // 생년월일 업데이트 함수
  const updateBirthdate = (
    year: number | null,
    month: number | null,
    day: number | null
  ) => {
    if (year && month && day) {
      // YYYY-MM-DD 형식으로 변환
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
      handleFieldChange("birthdate", formattedDate);
    } else {
      handleFieldChange("birthdate", "");
    }
  };

  // 모든 변경사항 저장
  const saveAllChanges = async () => {
    if (!hasChanges) return;

    try {
      // 서버로 전송할 업데이트 데이터 생성 (플랫한 구조)
      const updateData: Record<string, any> = {
        // 사용자 기본 정보
        name:
          modifiedData.name !== undefined
            ? modifiedData.name
            : localUserInfo.name,
        gender:
          modifiedData.gender !== undefined
            ? modifiedData.gender === "남자"
              ? "MALE"
              : modifiedData.gender === "여자"
              ? "FEMALE"
              : null
            : localUserInfo.gender === "남자"
            ? "MALE"
            : localUserInfo.gender === "여자"
            ? "FEMALE"
            : null,
        birthDate:
          modifiedData.birthdate !== undefined
            ? modifiedData.birthdate
            : localUserInfo.birthdate || null,
        height:
          modifiedData.height !== undefined
            ? modifiedData.height
            : localUserInfo.height,
        weight:
          modifiedData.weight !== undefined
            ? modifiedData.weight
            : localUserInfo.weight,

        // 혈당 및 영양 목표 정보
        fastingBloodSugar:
          modifiedData.fastingBloodSugar !== undefined
            ? modifiedData.fastingBloodSugar
            : userInfo?.target?.fastingBloodSugar,
        postprandialBloodSugar:
          modifiedData.postprandialBloodSugar !== undefined
            ? modifiedData.postprandialBloodSugar
            : userInfo?.target?.postprandialBloodSugar,
        carbohydrate:
          modifiedData.carbohydrate !== undefined
            ? modifiedData.carbohydrate
            : userInfo?.target?.carbohydrate,
        protein:
          modifiedData.protein !== undefined
            ? modifiedData.protein
            : userInfo?.target?.protein,
        fat:
          modifiedData.fat !== undefined
            ? modifiedData.fat
            : userInfo?.target?.fat,
        calories:
          modifiedData.calories !== undefined
            ? modifiedData.calories
            : userInfo?.target?.calories,
      };

      // API 호출하여 서버에 업데이트
      await authService.updateUserInfo(updateData);

      // 사용자 정보 다시 불러오기
      await fetchUserInfo();

      // 수정 모드 종료 및 임시 데이터 초기화
      setEditingField(null);
      setModifiedData({});

      // 성공 메시지
      Swal.fire({
        title: "저장 완료",
        text: "정보가 성공적으로 저장되었습니다.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    } catch (error) {
      console.error("정보 업데이트 실패:", error);

      // 에러 메시지
      Swal.fire({
        title: "저장 실패",
        text: "정보 업데이트에 실패했습니다. 다시 시도해주세요.",
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "확인",
      });
    }
  };

  // 수정 취소
  const cancelChanges = () => {
    setEditingField(null);
    setModifiedData({});
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditingField(null);
    }
  };

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

      // 성별 변환 (MALE -> 남자, FEMALE -> 여자)
      const displayGender =
        userData.gender === "MALE"
          ? "남자"
          : userData.gender === "FEMALE"
          ? "여자"
          : userData.gender || "비공개";

      setLocalUserInfo({
        name: userData.name,
        gender: displayGender,
        birthdate: userData.birthdate || "",
        height: userData.height || 0,
        weight: userData.weight || 0,
      });

      // 생년월일 파싱
      if (userData.birthdate) {
        const date = new Date(userData.birthdate);
        setBirthYear(date.getFullYear());
        setBirthMonth(date.getMonth() + 1);
        setBirthDay(date.getDate());
      } else {
        setBirthYear(null);
        setBirthMonth(null);
        setBirthDay(null);
      }
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
                    {editingField === "name" ? (
                      <input
                        type="text"
                        value={
                          modifiedData.name !== undefined
                            ? modifiedData.name
                            : localUserInfo.name
                        }
                        onChange={(e) =>
                          handleFieldChange("name", e.target.value)
                        }
                        onKeyDown={handleKeyPress}
                        onBlur={stopEditing}
                        autoFocus
                        className="text-base font-medium border rounded px-2 py-1"
                      />
                    ) : (
                      <>
                        <span className="text-base font-medium">
                          {modifiedData.name !== undefined
                            ? modifiedData.name
                            : localUserInfo.name}
                        </span>
                        <button
                          className="ml-2"
                          onClick={() =>
                            startEditing("name", localUserInfo.name)
                          }
                        >
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
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-base">성별</span>
                  <div className="flex items-center">
                    {editingField === "gender" ? (
                      <select
                        value={
                          modifiedData.gender !== undefined
                            ? modifiedData.gender
                            : localUserInfo.gender
                        }
                        onChange={(e) =>
                          handleFieldChange("gender", e.target.value)
                        }
                        onBlur={stopEditing}
                        autoFocus
                        className="text-base font-medium border rounded px-2 py-1"
                      >
                        <option value="비공개">비공개</option>
                        <option value="남자">남자</option>
                        <option value="여자">여자</option>
                      </select>
                    ) : (
                      <>
                        <span className="text-base font-medium">
                          {modifiedData.gender !== undefined
                            ? modifiedData.gender
                            : localUserInfo.gender || "비공개"}
                        </span>
                        <button
                          className="ml-2"
                          onClick={() =>
                            startEditing("gender", localUserInfo.gender)
                          }
                        >
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
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-base">생년월일</span>
                  <div className="flex items-center">
                    {editingField === "birthdate" ? (
                      <div className="flex space-x-1">
                        <select
                          value={birthYear || ""}
                          onChange={(e) => {
                            const year = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setBirthYear(year);
                            updateBirthdate(year, birthMonth, birthDay);
                          }}
                          className="text-sm border rounded px-1 py-1"
                        >
                          <option value="">년</option>
                          {Array.from(
                            { length: 100 },
                            (_, i) => new Date().getFullYear() - i
                          ).map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <select
                          value={birthMonth || ""}
                          onChange={(e) => {
                            const month = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setBirthMonth(month);
                            updateBirthdate(birthYear, month, birthDay);
                          }}
                          className="text-sm border rounded px-1 py-1"
                        >
                          <option value="">월</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (month) => (
                              <option key={month} value={month}>
                                {month}
                              </option>
                            )
                          )}
                        </select>
                        <select
                          value={birthDay || ""}
                          onChange={(e) => {
                            const day = e.target.value
                              ? parseInt(e.target.value)
                              : null;
                            setBirthDay(day);
                            updateBirthdate(birthYear, birthMonth, day);
                          }}
                          className="text-sm border rounded px-1 py-1"
                        >
                          <option value="">일</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map(
                            (day) => (
                              <option key={day} value={day}>
                                {day}
                              </option>
                            )
                          )}
                        </select>
                        <button
                          onClick={stopEditing}
                          className="ml-2 text-sm text-blue-500"
                        >
                          완료
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-base font-medium">
                          {(() => {
                            const birthdate =
                              modifiedData.birthdate !== undefined
                                ? modifiedData.birthdate
                                : localUserInfo.birthdate;

                            if (!birthdate) return "비공개";

                            // YYYY-MM-DD 형식을 YYYY년 MM월 DD일로 변환
                            const date = new Date(birthdate);
                            if (isNaN(date.getTime())) return "비공개";

                            return `${date.getFullYear()}년 ${(
                              date.getMonth() + 1
                            )
                              .toString()
                              .padStart(2, "0")}월 ${date
                              .getDate()
                              .toString()
                              .padStart(2, "0")}일`;
                          })()}
                        </span>
                        <button
                          className="ml-2"
                          onClick={() =>
                            startEditing("birthdate", localUserInfo.birthdate)
                          }
                        >
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
                      </>
                    )}
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
                  <div className="flex items-center">
                    {editingField === "height" ? (
                      <input
                        type="number"
                        value={
                          modifiedData.height !== undefined
                            ? modifiedData.height
                            : localUserInfo.height
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            "height",
                            parseFloat(e.target.value)
                          )
                        }
                        onKeyDown={handleKeyPress}
                        onBlur={stopEditing}
                        autoFocus
                        className="text-base font-medium border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <>
                        <span className="text-base font-medium mr-2">
                          {modifiedData.height !== undefined
                            ? modifiedData.height
                            : localUserInfo.height}{" "}
                          cm
                        </span>
                        <button
                          className="ml-2"
                          onClick={() =>
                            startEditing("height", localUserInfo.height)
                          }
                        >
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
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base">몸무게</span>
                  <div className="flex items-center">
                    {editingField === "weight" ? (
                      <input
                        type="number"
                        value={
                          modifiedData.weight !== undefined
                            ? modifiedData.weight
                            : localUserInfo.weight
                        }
                        onChange={(e) =>
                          handleFieldChange(
                            "weight",
                            parseFloat(e.target.value)
                          )
                        }
                        onKeyDown={handleKeyPress}
                        onBlur={stopEditing}
                        autoFocus
                        className="text-base font-medium border rounded px-2 py-1 w-20"
                      />
                    ) : (
                      <>
                        <span className="text-base font-medium mr-2">
                          {modifiedData.weight !== undefined
                            ? modifiedData.weight
                            : localUserInfo.weight}{" "}
                          kg
                        </span>
                        <button
                          className="ml-2"
                          onClick={() =>
                            startEditing("weight", localUserInfo.weight)
                          }
                        >
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
                      </>
                    )}
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
                  <div className="bg-blue-50 p-3 rounded-lg relative">
                    <p className="text-xs text-gray-500">공복 혈당</p>
                    <div className="flex items-center">
                      {editingField === "fastingBloodSugar" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.fastingBloodSugar !== undefined
                              ? modifiedData.fastingBloodSugar
                              : userInfo.target.fastingBloodSugar
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "fastingBloodSugar",
                              parseFloat(e.target.value)
                            )
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.fastingBloodSugar !== undefined
                              ? modifiedData.fastingBloodSugar
                              : userInfo.target.fastingBloodSugar}{" "}
                            mg/dL
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing(
                                "fastingBloodSugar",
                                userInfo.target.fastingBloodSugar
                              )
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg relative">
                    <p className="text-xs text-gray-500">식후 혈당</p>
                    <div className="flex items-center">
                      {editingField === "postprandialBloodSugar" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.postprandialBloodSugar !== undefined
                              ? modifiedData.postprandialBloodSugar
                              : userInfo.target.postprandialBloodSugar
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "postprandialBloodSugar",
                              parseFloat(e.target.value)
                            )
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.postprandialBloodSugar !== undefined
                              ? modifiedData.postprandialBloodSugar
                              : userInfo.target.postprandialBloodSugar}{" "}
                            mg/dL
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing(
                                "postprandialBloodSugar",
                                userInfo.target.postprandialBloodSugar
                              )
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <h3 className="font-medium text-sm text-gray-600 mb-2">
                  영양 목표
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 p-3 rounded-lg relative">
                    <p className="text-xs text-gray-500">탄수화물</p>
                    <div className="flex items-center">
                      {editingField === "carbohydrate" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.carbohydrate !== undefined
                              ? modifiedData.carbohydrate
                              : userInfo.target.carbohydrate
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "carbohydrate",
                              parseFloat(e.target.value)
                            )
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.carbohydrate !== undefined
                              ? modifiedData.carbohydrate.toFixed(1)
                              : userInfo.target.carbohydrate.toFixed(1)}
                            g
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing(
                                "carbohydrate",
                                userInfo.target.carbohydrate
                              )
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg relative">
                    <p className="text-xs text-gray-500">단백질</p>
                    <div className="flex items-center">
                      {editingField === "protein" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.protein !== undefined
                              ? modifiedData.protein
                              : userInfo.target.protein
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "protein",
                              parseFloat(e.target.value)
                            )
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.protein !== undefined
                              ? modifiedData.protein.toFixed(1)
                              : userInfo.target.protein.toFixed(1)}
                            g
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing("protein", userInfo.target.protein)
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg relative">
                    <p className="text-xs text-gray-500">지방</p>
                    <div className="flex items-center">
                      {editingField === "fat" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.fat !== undefined
                              ? modifiedData.fat
                              : userInfo.target.fat
                          }
                          onChange={(e) =>
                            handleFieldChange("fat", parseFloat(e.target.value))
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.fat !== undefined
                              ? modifiedData.fat.toFixed(1)
                              : userInfo.target.fat.toFixed(1)}
                            g
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing("fat", userInfo.target.fat)
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">칼로리</p>
                    <div className="flex items-center">
                      {editingField === "calories" ? (
                        <input
                          type="number"
                          value={
                            modifiedData.calories !== undefined
                              ? modifiedData.calories
                              : userInfo.target.calories
                          }
                          onChange={(e) =>
                            handleFieldChange(
                              "calories",
                              parseFloat(e.target.value)
                            )
                          }
                          onKeyDown={handleKeyPress}
                          onBlur={stopEditing}
                          autoFocus
                          className="font-medium border rounded px-2 py-1 w-20"
                        />
                      ) : (
                        <>
                          <p className="font-medium">
                            {modifiedData.calories !== undefined
                              ? `${modifiedData.calories} kcal`
                              : `${userInfo.target.calories} kcal`}
                          </p>
                          <button
                            className="ml-2"
                            onClick={() =>
                              startEditing("calories", userInfo.target.calories)
                            }
                          >
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
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 저장 버튼 */}
            {hasChanges && (
              <div className="fixed bottom-20 left-0 right-0 max-w-[500px] mx-auto p-4 z-10">
                <div className="bg-white rounded-md shadow-lg border border-gray-200 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      변경 사항이 있습니다
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={cancelChanges}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        취소
                      </button>
                      <button
                        onClick={saveAllChanges}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        모두 저장
                      </button>
                    </div>
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
