"use client";

import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import BloodSugarInputModal, {
  BloodSugarInputData,
} from "@/components/BloodSugarInputModal";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState("2025년 1월 11일");
  const [currentMonth, setCurrentMonth] = useState("2025년 1월");

  // 혈당 기록 데이터
  const [bloodSugarRecords, setBloodSugarRecords] = useState([
    {
      id: 1,
      time: "08:30",
      value: 123,
      type: "아침",
      meal: "현미밥, 된장국, 계란말이",
      icon: "🌞",
    },
    {
      id: 2,
      time: "12:45",
      value: 145,
      type: "점심",
      meal: "식후 2시간 - 비빔밥, 미역국",
      icon: "🍱",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitBloodSugar = (data: BloodSugarInputData) => {
    console.log("혈당 데이터 제출:", data);
    // 여기서 데이터를 처리하고 상태를 업데이트할 수 있습니다.
    // 예: API 호출 또는 상태 업데이트

    // 새 기록 추가 예시
    const newRecord = {
      id: bloodSugarRecords.length + 1,
      time: `${data.time.period} ${data.time.hour}`,
      value: parseInt(data.bloodSugar),
      type: data.mealTime.split(" ")[0], // "아침 식전" -> "아침"
      meal: data.food || "기록 없음",
      icon: data.mealTime.includes("아침")
        ? "🌞"
        : data.mealTime.includes("점심")
        ? "🍱"
        : "🌙",
    };

    setBloodSugarRecords([...bloodSugarRecords, newRecord]);
  };

  // 2025년 1월 달력 데이터 생성
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // 2025년 1월의 날짜 배열 생성
  // 2025년 1월 1일은 수요일(3)
  const firstDayOfMonth = 3; // 0: 일요일, 1: 월요일, ..., 6: 토요일
  const daysInMonth = 31; // 1월은 31일까지

  // 달력에 표시할 날짜 배열 생성
  const calendarDays = [];

  // 첫 주 시작 전 빈 칸 추가
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // 1월 날짜 추가
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // 마지막 주 빈 칸 추가 (7의 배수가 되도록)
  const remainingDays = 7 - (calendarDays.length % 7);
  if (remainingDays < 7) {
    for (let i = 0; i < remainingDays; i++) {
      calendarDays.push(null);
    }
  }

  const selectedDate = 11; // 현재 선택된 날짜

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-300">
        <div className="h-full overflow-y-auto pb-28 pt-0">
          <div className="bg-white h-full">
            {/* 헤더 */}
            <div className="flex justify-between items-center p-3 pt-0 sm:p-4 sm:pt-2 md:p-5 md:pt-2 border-b border-gray-100">
              <div className="flex items-center">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                  혈당 기록
                </h1>
                <p className="ml-2 text-sm text-gray-500">{currentDate}</p>
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

            {/* 검색 바 */}
            <div className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="음식 검색하기"
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                <button className="p-1">
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
                <h2 className="text-lg font-bold">{currentMonth}</h2>
                <button className="p-1">
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
                {calendarDays.map((date, index) => (
                  <div
                    key={`date-${index}`}
                    className={`py-2 ${
                      date === selectedDate
                        ? "bg-blue-500 text-white rounded-full"
                        : date
                        ? "text-gray-700"
                        : "text-gray-300"
                    }`}
                  >
                    {date || ""}
                  </div>
                ))}
              </div>
            </div>

            {/* 혈당 기록 목록 */}
            <div className="px-4 py-2">
              {bloodSugarRecords.map((record) => (
                <div key={record.id} className="border-b border-gray-100 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <span className="text-xl mr-2">{record.icon}</span>
                      <span className="text-base font-medium">
                        {record.type}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{record.time}</span>
                  </div>
                  <div className="flex items-baseline mb-1">
                    <span className="text-xl font-bold">{record.value}</span>
                    <span className="text-sm text-gray-500 ml-1">mg/dL</span>
                  </div>
                  <p className="text-sm text-gray-600">{record.meal}</p>
                </div>
              ))}
            </div>

            {/* 혈당 기록 추가 버튼 */}
            <div className="p-4">
              <button
                onClick={handleOpenModal}
                className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                혈당 기록 추가하기
              </button>
            </div>
          </div>
        </div>
        <BottomNavigation activePage="calendar" />

        {/* 혈당 입력 모달 */}
        <BloodSugarInputModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmitBloodSugar}
        />
      </div>
    </div>
  );
}
