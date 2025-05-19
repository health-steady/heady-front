"use client";

import React, { useState, useEffect } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  DotProps,
} from "recharts";

// 혈당 데이터 타입 정의
interface BloodSugarData {
  id: number;
  level: number;
  measuredAt: string;
  measureType: string;
  memo: string;
}

// 혈당 정상 범위 정의
const NORMAL_RANGE = {
  min: 70,
  max: 140,
};

// 혈당 위험 범위 정의
const DANGER_RANGE = {
  high: 180,
};

// 차트 Y축 범위 정의
const CHART_RANGE = {
  min: 40, // 최소값을 40으로 설정
  max: 250, // 최대값을 250으로 설정
};

// 혈당 상태에 따른 색상 정의
const getBloodSugarColor = (level: number) => {
  if (level < NORMAL_RANGE.min) return "#EF4444"; // 저혈당 (빨간색)
  if (level > DANGER_RANGE.high) return "#EF4444"; // 심한 고혈당 (빨간색)
  if (level > NORMAL_RANGE.max) return "#F59E0B"; // 고혈당 (주황색)
  return "#10B981"; // 정상 (녹색)
};

export default function Stats() {
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}년 ${
      today.getMonth() + 1
    }월 ${today.getDate()}일`;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 혈당 통계 계산
  const bloodSugarStats = {
    average:
      bloodSugarData.length > 0
        ? Math.round(
            bloodSugarData.reduce((sum, data) => sum + data.level, 0) /
              bloodSugarData.length
          )
        : 0,
    highest:
      bloodSugarData.length > 0
        ? Math.max(...bloodSugarData.map((data) => data.level))
        : 0,
    latest:
      bloodSugarData.length > 0
        ? bloodSugarData[bloodSugarData.length - 1].level
        : 0,
    measureCount: bloodSugarData.length,
  };

  // API에서 혈당 데이터 가져오기
  const fetchBloodSugarData = async (date: Date) => {
    setIsLoading(true);
    setError(null);

    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const response = await fetch(
        `http://localhost:8080/api/bloodSugars/v1/${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("혈당 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setBloodSugarData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      console.error("혈당 데이터 로드 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 오늘 날짜 데이터 로드
  useEffect(() => {
    const today = new Date();
    fetchBloodSugarData(today);
  }, []);

  // 날짜 선택 핸들러
  const handleDateChange = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
    setShowDatePicker(false);

    // 선택한 날짜의 데이터 로드
    fetchBloodSugarData(date);
  };

  // 차트 데이터 포맷팅
  const chartData = bloodSugarData.map((data) => {
    const date = new Date(data.measuredAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;

    return {
      time,
      value: data.level,
      memo: data.memo,
      measureType: data.measureType,
      color: getBloodSugarColor(data.level),
    };
  });

  // 커스텀 툴팁 컴포넌트
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold">{data.time}</p>
          <p className="text-sm">
            <span className="font-medium">혈당: </span>
            <span style={{ color: data.color }}>{data.value} mg/dL</span>
          </p>
          <p className="text-sm text-gray-600">{data.memo}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200">
        <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto bg-white z-10">
          {/* 헤더 */}
          <div className="flex justify-between items-center p-3 py-4 sm:p-4 sm:py-5 md:p-5 md:py-6 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="font-bold text-lg sm:text-xl md:text-2xl">통계</h1>
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
        </div>
        <div className="h-full overflow-y-auto pt-[85px]">
          <div className="bg-white h-full">
            <div className="h-3 sm:h-4 md:h-5 bg-gray-100"></div>

            {/* 혈당 그래프 */}
            <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">혈당 그래프</h2>
                <button
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm flex items-center"
                  onClick={() => setShowDatePicker(true)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  날짜 선택
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="flex justify-center items-center h-64 text-red-500">
                  {error}
                </div>
              ) : bloodSugarData.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                  해당 날짜의 혈당 데이터가 없습니다.
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 30, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="time"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[CHART_RANGE.min, CHART_RANGE.max]}
                        tickLine={false}
                        axisLine={false}
                        width={40}
                        tick={false}
                      />
                      <Tooltip content={<CustomTooltip />} />

                      {/* 저혈당 범위 영역 */}
                      <ReferenceArea
                        y1={CHART_RANGE.min}
                        y2={NORMAL_RANGE.min}
                        fill="#EF4444"
                        fillOpacity={0.1}
                      />

                      {/* 정상 범위 영역 */}
                      <ReferenceArea
                        y1={NORMAL_RANGE.min}
                        y2={NORMAL_RANGE.max}
                        fill="#10B981"
                        fillOpacity={0.1}
                      />

                      {/* 고혈당 범위 영역 */}
                      <ReferenceArea
                        y1={NORMAL_RANGE.max}
                        y2={DANGER_RANGE.high}
                        fill="#F59E0B"
                        fillOpacity={0.1}
                      />

                      {/* 심한 고혈당 범위 영역 */}
                      <ReferenceArea
                        y1={DANGER_RANGE.high}
                        y2={CHART_RANGE.max}
                        fill="#EF4444"
                        fillOpacity={0.1}
                      />

                      {/* 정상 범위 기준선 */}
                      <ReferenceLine
                        y={NORMAL_RANGE.min}
                        stroke="#10B981"
                        strokeDasharray="3 3"
                        label={{
                          value: `${NORMAL_RANGE.min} mg/dL`,
                          position: "left",
                          fill: "#10B981",
                          fontSize: 12,
                          offset: 5,
                        }}
                      />
                      <ReferenceLine
                        y={NORMAL_RANGE.max}
                        stroke="#10B981"
                        strokeDasharray="3 3"
                        label={{
                          value: `${NORMAL_RANGE.max} mg/dL`,
                          position: "left",
                          fill: "#10B981",
                          fontSize: 12,
                          offset: 5,
                        }}
                      />

                      {/* 심한 고혈당 기준선 */}
                      <ReferenceLine
                        y={DANGER_RANGE.high}
                        stroke="#EF4444"
                        strokeDasharray="3 3"
                        label={{
                          value: `${DANGER_RANGE.high} mg/dL`,
                          position: "left",
                          fill: "#EF4444",
                          fontSize: 12,
                          offset: 5,
                        }}
                      />

                      {/* 혈당 라인 */}
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={(props: any) => {
                          const { cx, cy, payload } = props;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={4}
                              fill={getBloodSugarColor(payload.value)}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }}
                        activeDot={(props: any) => {
                          const { cx, cy, payload } = props;
                          return (
                            <circle
                              cx={cx}
                              cy={cy}
                              r={6}
                              fill={getBloodSugarColor(payload.value)}
                              stroke="#fff"
                              strokeWidth={2}
                            />
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* 통계 정보 */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-bold">통계</h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 평균 혈당 */}
                <div className="p-3 border-b">
                  <p className="text-sm text-gray-500">평균 혈당</p>
                  <p className="text-xl font-bold">
                    {bloodSugarStats.average}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      mg/dL
                    </span>
                  </p>
                </div>

                {/* 최고 혈당 */}
                <div className="p-3 border-b">
                  <p className="text-sm text-gray-500">최고 혈당</p>
                  <p className="text-xl font-bold">
                    {bloodSugarStats.highest}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      mg/dL
                    </span>
                  </p>
                </div>

                {/* 최저 혈당 */}
                <div className="p-3">
                  <p className="text-sm text-gray-500">최저 혈당</p>
                  <p className="text-xl font-bold">
                    {bloodSugarStats.latest}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      mg/dL
                    </span>
                  </p>
                </div>

                {/* 측정 횟수 */}
                <div className="p-3">
                  <p className="text-sm text-gray-500">측정 횟수</p>
                  <p className="text-xl font-bold">
                    {bloodSugarStats.measureCount}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      회
                    </span>
                  </p>
                </div>
              </div>

              {/* AI 분석 버튼 */}
              <div className="mt-6">
                <button className="w-full py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  AI 분석
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white border-t border-gray-200">
          <BottomNavigation activePage="stats" />
        </div>

        {/* 날짜 선택 모달 */}
        {showDatePicker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-[90%] max-w-[400px]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">날짜 선택</h3>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <DateSelector onDateSelect={handleDateChange} />

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md mr-2"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // 달력에서 현재 선택된 날짜 적용 로직
                    setShowDatePicker(false);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 날짜 선택 컴포넌트
interface DateSelectorProps {
  onDateSelect: (date: Date) => void;
}

function DateSelector({ onDateSelect }: DateSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 월 이름 배열
  const monthNames = [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ];

  // 이전 달로 이동
  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // 다음 달로 이동
  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // 현재 월의 날짜 그리드 생성
  const generateDateGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // 해당 월의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 첫 날의 요일 (0: 일요일, 6: 토요일)
    const firstDayOfWeek = firstDay.getDay();

    // 총 날짜 수
    const daysInMonth = lastDay.getDate();

    // 달력 그리드 생성 (6주 x 7일)
    const dateGrid = [];
    let dayCount = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if ((i === 0 && j < firstDayOfWeek) || dayCount > daysInMonth) {
          // 이전 달이나 다음 달의 날짜는 null로 표시
          week.push(null);
        } else {
          week.push(new Date(year, month, dayCount++));
        }
      }
      dateGrid.push(week);

      // 모든 날짜를 표시했으면 종료
      if (dayCount > daysInMonth) break;
    }

    return dateGrid;
  };

  // 날짜 선택 핸들러
  const handleDateClick = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

  // 요일 레이블
  const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  // 날짜 비교 함수 (년, 월, 일이 같은지)
  const isSameDate = (date1: Date | null, date2: Date | null) => {
    return (
      date1 &&
      date2 &&
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // 오늘 날짜
  const today = new Date();

  return (
    <div className="w-full">
      {/* 달력 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <div className="font-bold">
          {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
        </div>
        <button onClick={nextMonth} className="p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayLabels.map((day, index) => (
          <div key={index} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid gap-1">
        {generateDateGrid().map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dateIndex) => (
              <div
                key={dateIndex}
                className={`aspect-square flex items-center justify-center rounded-full text-sm cursor-pointer ${
                  date ? "hover:bg-gray-100" : ""
                } ${
                  isSameDate(date, selectedDate)
                    ? "bg-blue-500 text-white"
                    : isSameDate(date, today)
                    ? "border border-blue-500"
                    : ""
                }`}
                onClick={() => date && handleDateClick(date)}
              >
                {date ? date.getDate() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
