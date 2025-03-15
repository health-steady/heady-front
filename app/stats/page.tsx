"use client";

import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";

export default function Stats() {
  const [currentDate, setCurrentDate] = useState("2025년 1월 11일");
  const [bloodSugarStats, setBloodSugarStats] = useState({
    average: 134,
    highest: 145,
    latest: 123,
    measureCount: 2,
  });

  // 그래프 데이터 포인트
  const graphPoints = [
    { time: "06:00", value: 115 },
    { time: "12:00", value: 125 },
    { time: "18:00", value: 115 },
    { time: "24:00", value: 120 },
  ];

  // 그래프 설정
  const graphHeight = 200;
  const graphWidth = 300;
  const maxValue = 200;
  const minValue = 100;
  const valueRange = maxValue - minValue;

  // 그래프 포인트를 SVG 경로로 변환
  const createPath = () => {
    const points = graphPoints
      .map((point, index) => {
        const x = (index / (graphPoints.length - 1)) * graphWidth;
        const y =
          graphHeight - ((point.value - minValue) / valueRange) * graphHeight;
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
    return points;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-300">
        <div className="h-full overflow-y-auto pb-28 pt-0">
          <div className="bg-white h-full">
            {/* 헤더 */}
            <div className="flex justify-between items-center p-3 pt-0 sm:p-4 sm:pt-2 md:p-5 md:pt-2 border-b border-gray-100">
              <div className="flex items-center">
                <h1 className="font-bold text-lg sm:text-xl md:text-2xl">
                  통계
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

            {/* 혈당 그래프 */}
            <div className="p-4 bg-white rounded-lg shadow-sm mb-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">혈당 그래프</h2>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  일간 ▼
                </button>
              </div>

              <div className="relative h-64 w-full">
                {/* 그래프 배경 (격자) */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={`h-line-${i}`}
                      className="absolute w-full border-t border-gray-200"
                      style={{ top: `${i * 25}%` }}
                    >
                      <span className="absolute -left-1 -top-3 text-xs text-gray-500">
                        {maxValue - i * (valueRange / 4)}
                      </span>
                    </div>
                  ))}
                  {graphPoints.map((point, i) => (
                    <div
                      key={`v-line-${i}`}
                      className="absolute h-full border-l border-gray-200"
                      style={{
                        left: `${(i / (graphPoints.length - 1)) * 100}%`,
                      }}
                    >
                      <span className="absolute -bottom-5 -left-3 text-xs text-gray-500">
                        {point.time}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 그래프 라인 */}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                  preserveAspectRatio="none"
                >
                  <path
                    d={createPath()}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                  />
                  {graphPoints.map((point, i) => {
                    const x = (i / (graphPoints.length - 1)) * graphWidth;
                    const y =
                      graphHeight -
                      ((point.value - minValue) / valueRange) * graphHeight;
                    return (
                      <circle
                        key={`point-${i}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3B82F6"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* 통계 정보 */}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">통계</h2>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">
                  월간 ▼
                </button>
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
            </div>
          </div>
        </div>
        <BottomNavigation activePage="stats" />
      </div>
    </div>
  );
}
