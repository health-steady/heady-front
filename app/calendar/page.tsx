"use client";

import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import { useRouter } from "next/navigation";
import { bloodSugarService } from "@/services/bloodSugar";
import { mealService } from "@/services/meal";
import BloodSugarInputModal from "@/components/BloodSugarInputModal";
import MealInputModal from "@/components/MealInputModal";
import { BloodSugarResponse } from "@/services/bloodSugar";
import { getBloodSugarTypeLabel } from "../../utils/bloodSugarUtils";

export default function Calendar() {
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(now);
  const [selectedDate, setSelectedDate] = useState<Date>(now);
  const [selectedRecord, setSelectedRecord] =
    useState<BloodSugarResponse | null>(null);

  // 혈당 기록 데이터
  const [bloodSugarRecords, setBloodSugarRecords] = useState<
    BloodSugarResponse[]
  >([]);

  const [isBloodSugarModalOpen, setIsBloodSugarModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  // 날짜 포맷팅 함수
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  const formatDateForApi = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  // 선택된 날짜의 혈당 기록 조회
  const fetchBloodSugarRecords = async (date: Date) => {
    try {
      const formattedDate = formatDateForApi(date);
      const records = await bloodSugarService.getAllByDate(formattedDate);
      setBloodSugarRecords(records);
      console.log("혈당 기록 조회 성공:", records, "날짜:", formattedDate);
    } catch (error) {
      console.error("혈당 기록 조회 실패:", error);
    }
  };

  useEffect(() => {
    // 선택된 날짜의 혈당 기록 조회
    fetchBloodSugarRecords(selectedDate);
  }, [selectedDate]);

  // 달력 이동 함수
  const moveMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // 날짜 선택 함수
  const handleDateSelect = (date: number) => {
    if (!date) return;
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    setSelectedDate(selectedDate);
    fetchBloodSugarRecords(selectedDate);
  };

  const handleOpenBloodSugarModal = () => {
    setIsBloodSugarModalOpen(true);
  };

  const handleCloseBloodSugarModal = () => {
    setIsBloodSugarModalOpen(false);
  };

  const handleOpenMealModal = () => {
    setIsMealModalOpen(true);
  };

  const handleCloseMealModal = () => {
    setIsMealModalOpen(false);
  };

  const handleBloodSugarSubmit = async (data: any) => {
    try {
      await fetchBloodSugarRecords(selectedDate);
      handleCloseBloodSugarModal();
    } catch (error) {
      console.error("혈당 기록 갱신 실패:", error);
    }
  };

  const handleMealSubmit = async (data: any) => {
    try {
      await fetchBloodSugarRecords(selectedDate);
      handleCloseMealModal();
    } catch (error) {
      console.error("식사 기록 갱신 실패:", error);
    }
  };

  // 혈당 기록 아이콘 매핑
  const getBloodSugarIcon = (mealType: string) => {
    switch (mealType) {
      case "BREAKFAST":
        return "🌞";
      case "LUNCH":
        return "🍱";
      case "DINNER":
        return "🌙";
      case "SNACK":
        return "🍽️";
      default:
        return "📊";
    }
  };

  // 달력 데이터 생성
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = [];

  // 첫 주 시작 전 빈 칸 추가
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // 해당 월의 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    const dateObj = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      i
    );
    const dateString = formatDateForApi(dateObj);
    const records = bloodSugarRecords.filter(
      (record) => record.measuredAt.split(" ")[0] === dateString
    );
    calendarDays.push({ date: i, records });
  }

  // 마지막 주 빈 칸 추가 (7의 배수가 되도록)
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      calendarDays.push(null);
    }
  }

  const handleRecordClick = (record: BloodSugarResponse) => {
    if (selectedRecord?.id === record.id) {
      setSelectedRecord(null);
    } else {
      setSelectedRecord(record);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedRecord(null);
    }
  };

  const handleDeleteBloodSugar = async (recordId: number) => {
    try {
      await bloodSugarService.delete(recordId);
      await fetchBloodSugarRecords(selectedDate);
      setSelectedRecord(null);
    } catch (error) {
      console.error("혈당 기록 삭제 실패:", error);
    }
  };

  const handleDeleteMeal = async (mealId: number) => {
    try {
      await mealService.delete(mealId);
      await fetchBloodSugarRecords(selectedDate);
      setSelectedRecord(null);
    } catch (error) {
      console.error("식사 기록 삭제 실패:", error);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center items-start pt-0"
      onClick={handleBackgroundClick}
    >
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200">
        <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto bg-white z-10">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-3 py-4 sm:p-4 sm:py-5 md:p-5 md:py-6 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                혈당 기록
              </h1>
              <p className="ml-2 text-sm text-gray-500">
                {formatDate(selectedDate)}
              </p>
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
        </div>
        <div className="h-full overflow-y-auto pt-[85px]">
          <div className="bg-white h-full">
            <div className="h-3 sm:h-4 md:h-5 bg-gray-100"></div>
            {/* 검색 바 */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="검색어를 입력하세요"
                  className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 캘린더 */}
            <div className="px-4 py-2">
              <div className="flex justify-between items-center mb-4">
                <button className="p-1" onClick={() => moveMonth("prev")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h2 className="text-lg font-bold">
                  {formatMonth(currentDate)}
                </h2>
                <button className="p-1" onClick={() => moveMonth("next")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* 요일 */}
              <div className="grid grid-cols-7 text-center mb-2">
                {days.map((day, index) => (
                  <div
                    key={`day-${index}`}
                    className={`text-sm ${
                      index === 0
                        ? "text-red-500"
                        : index === 6
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* 날짜 */}
              <div className="grid grid-cols-7 text-center">
                {calendarDays.map((day, index) => (
                  <div
                    key={`date-${index}`}
                    className={`py-2 cursor-pointer ${
                      day?.date === selectedDate.getDate() &&
                      currentDate.getMonth() === selectedDate.getMonth() &&
                      currentDate.getFullYear() === selectedDate.getFullYear()
                        ? "bg-blue-500 text-white rounded-full"
                        : day
                        ? "text-gray-700 hover:bg-gray-100 rounded-full"
                        : "text-gray-300"
                    }`}
                    onClick={() => day && handleDateSelect(day.date)}
                  >
                    <div>{day?.date || ""}</div>
                    {day?.records && day.records.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-0.5 mt-1">
                        {day.records.map((record, recordIndex) => (
                          <span
                            key={recordIndex}
                            className="text-[8px]"
                            title={`${record.measureType} - ${record.level}mg/dL`}
                          >
                            {getBloodSugarIcon(record.mealType)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 혈당 기록 목록 */}
            <div className="space-y-4 p-4">
              {bloodSugarRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col space-y-2 cursor-pointer"
                  onClick={() => handleRecordClick(record)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getBloodSugarIcon(record.mealType)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {getBloodSugarTypeLabel(
                          record.measureType,
                          record.mealType
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(record.measuredAt).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-xl font-bold">{record.level}</div>
                    <div className="text-sm text-gray-500">mg/dL</div>
                  </div>

                  {/* 식사 정보가 있는 경우 음식 태그 표시 */}
                  {record.meal &&
                    record.meal.foods &&
                    record.meal.foods.length > 0 && (
                      <div className="flex flex-col">
                        <div className="text-xs text-gray-500 mb-1 flex items-center">
                          <span className="mr-1">🍽️</span>
                          <span>섭취 음식</span>
                          {record.meal.memo && (
                            <span className="ml-2 italic">
                              "{record.meal.memo}"
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {record.meal.foods.map((food) => (
                            <span
                              key={food.id}
                              className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                              title={`${food.calories || 0}kcal`}
                            >
                              {food.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* 선택된 기록일 경우 삭제 버튼 표시 */}
                  {selectedRecord?.id === record.id && (
                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBloodSugar(record.id);
                        }}
                        className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100"
                      >
                        혈당 기록 삭제
                      </button>
                      {record.meal && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (record.meal) {
                              handleDeleteMeal(record.meal.id);
                            }
                          }}
                          className="px-3 py-1 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100"
                        >
                          식사 기록 삭제
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 버튼 그룹 */}
            <div className="p-4 space-y-4">
              {/* 혈당 기록하기 버튼 */}
              <button
                onClick={handleOpenBloodSugarModal}
                className="w-full py-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="#e74c3c"
                >
                  <path d="M12 2L8 10C5.8 12.7 5.8 16.3 8 19C9.1 20.3 10.5 21 12 21C13.5 21 14.9 20.3 16 19C18.2 16.3 18.2 12.7 16 10L12 2Z" />
                </svg>
                혈당 기록하기
              </button>

              {/* 식사 기록하기 버튼 */}
              <button
                onClick={handleOpenMealModal}
                className="w-full py-3 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
              >
                <span className="text-xl mr-2">🍱</span>
                식사 기록하기
              </button>
            </div>

            {/* 하단 네비게이션 바 높이만큼 빈 영역 */}
            <div className="h-16"></div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white border-t border-gray-200">
          <BottomNavigation activePage="calendar" />
        </div>

        {/* 혈당 입력 모달 */}
        <BloodSugarInputModal
          isOpen={isBloodSugarModalOpen}
          onClose={handleCloseBloodSugarModal}
          onSubmit={handleBloodSugarSubmit}
          selectedDate={new Date()}
        />

        {/* 식사 입력 모달 */}
        <MealInputModal
          isOpen={isMealModalOpen}
          onClose={handleCloseMealModal}
          onSubmit={handleMealSubmit}
          selectedDate={new Date()}
        />
      </div>
    </div>
  );
}
