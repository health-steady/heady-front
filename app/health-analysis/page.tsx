"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import HealthReport, { HealthReportRef } from "@/components/HealthReport";
import { healthService } from "@/services/healthService";

// 예시 데이터
const mockGlucoseData = [
  { date: "2023-06-01", time: "08:30", value: 120, mealType: "아침" },
  { date: "2023-06-01", time: "13:00", value: 135, mealType: "점심" },
  { date: "2023-06-01", time: "19:00", value: 130, mealType: "저녁" },
  { date: "2023-06-02", time: "08:30", value: 115, mealType: "아침" },
  { date: "2023-06-02", time: "13:00", value: 140, mealType: "점심" },
  { date: "2023-06-02", time: "19:00", value: 125, mealType: "저녁" },
  { date: "2023-06-03", time: "08:30", value: 118, mealType: "아침" },
  { date: "2023-06-03", time: "13:00", value: 145, mealType: "점심" },
  { date: "2023-06-03", time: "19:00", value: 128, mealType: "저녁" },
  { date: "2023-06-04", time: "08:30", value: 122, mealType: "아침" },
  { date: "2023-06-04", time: "13:00", value: 138, mealType: "점심" },
  { date: "2023-06-04", time: "19:00", value: 132, mealType: "저녁" },
  { date: "2023-06-05", time: "08:30", value: 119, mealType: "아침" },
  { date: "2023-06-05", time: "13:00", value: 142, mealType: "점심" },
  { date: "2023-06-05", time: "19:00", value: 127, mealType: "저녁" },
  { date: "2023-06-06", time: "08:30", value: 121, mealType: "아침" },
  { date: "2023-06-06", time: "13:00", value: 136, mealType: "점심" },
  { date: "2023-06-06", time: "19:00", value: 129, mealType: "저녁" },
  { date: "2023-06-07", time: "08:30", value: 124, mealType: "아침" },
  { date: "2023-06-07", time: "13:00", value: 141, mealType: "점심" },
  { date: "2023-06-07", time: "19:00", value: 131, mealType: "저녁" },
];

const mockFoodData = [
  {
    name: "현미밥",
    carbs: 45,
    protein: 4,
    fat: 1,
    calories: 205,
    glycemicIndex: 55,
    date: "2023-06-01",
    time: "08:30",
    glucoseAfter: 25,
  },
  {
    name: "삼겹살",
    carbs: 2,
    protein: 30,
    fat: 35,
    calories: 440,
    glycemicIndex: 15,
    date: "2023-06-01",
    time: "13:00",
    glucoseAfter: 10,
  },
  {
    name: "고구마",
    carbs: 25,
    protein: 2,
    fat: 0.1,
    calories: 110,
    glycemicIndex: 70,
    date: "2023-06-02",
    time: "08:30",
    glucoseAfter: 35,
  },
  {
    name: "사과",
    carbs: 25,
    protein: 0.5,
    fat: 0.3,
    calories: 95,
    glycemicIndex: 40,
    date: "2023-06-02",
    time: "13:00",
    glucoseAfter: 15,
  },
  {
    name: "오트밀",
    carbs: 27,
    protein: 5,
    fat: 3,
    calories: 150,
    glycemicIndex: 55,
    date: "2023-06-03",
    time: "08:30",
    glucoseAfter: 20,
  },
  {
    name: "닭가슴살",
    carbs: 0,
    protein: 31,
    fat: 3.6,
    calories: 165,
    glycemicIndex: 0,
    date: "2023-06-03",
    time: "13:00",
    glucoseAfter: 5,
  },
  {
    name: "흰쌀밥",
    carbs: 44,
    protein: 4,
    fat: 0.4,
    calories: 200,
    glycemicIndex: 85,
    date: "2023-06-04",
    time: "08:30",
    glucoseAfter: 40,
  },
];

const mockNutrientData = [
  { date: "2023-06-01", carbs: 150, protein: 80, fat: 50, calories: 1500 },
  { date: "2023-06-02", carbs: 120, protein: 90, fat: 45, calories: 1400 },
  { date: "2023-06-03", carbs: 135, protein: 85, fat: 40, calories: 1350 },
  { date: "2023-06-04", carbs: 145, protein: 75, fat: 55, calories: 1450 },
  { date: "2023-06-05", carbs: 130, protein: 95, fat: 42, calories: 1380 },
  { date: "2023-06-06", carbs: 140, protein: 82, fat: 48, calories: 1420 },
  { date: "2023-06-07", carbs: 125, protein: 88, fat: 44, calories: 1390 },
];

const mockUserInfo = {
  age: 35,
  gender: "남성",
  height: 175,
  weight: 70,
  bmi: 22.9,
  targetGlucose: 120,
};

const mockAnalysisResults = {
  glucoseAnalysis: `최근 일주일 간의 혈당 데이터를 분석한 결과, 평균 혈당은 130mg/dL로 목표 혈당(120mg/dL)보다 약간 높은 수준입니다. 식후 혈당 상승폭은 평균 25mg/dL로 양호한 편입니다.

특히 점심 식사 후 혈당이 다른 시간대보다 약 10mg/dL 높게 나타나고 있습니다. 점심 식사 내용을 검토해 볼 필요가 있습니다.

주중 화요일과 목요일에 혈당 변동성이 다른 날보다 크게 나타나고 있으니 이 날들의 식사 패턴을 확인해보세요.`,

  dietAnalysis: `식단 분석 결과, 탄수화물 비중이 총 열량의 약 45%로 적정 수준이지만, 고혈당을 유발하는 고지수(GI) 탄수화물 섭취가 다소 많은 편입니다.

단백질 섭취는 하루 평균 85g으로 체중 kg당 약 1.2g 수준이며, 이는 권장량을 충족합니다.

지방 섭취는 총 열량의 약 30%로 적정 범위 내에 있습니다만, 포화지방의 비율이 다소 높습니다.

식이섬유 섭취가 하루 평균 20g으로 권장량(25-30g)보다 약간 부족합니다.`,

  recommendedActions: [
    "점심 식사 시 흰쌀밥 대신 현미밥이나 잡곡밥으로 대체해보세요.",
    "식이섬유가 풍부한 채소와 과일을 매 끼니에 한 접시 이상 섭취하세요.",
    "고지수(GI) 탄수화물(흰쌀, 흰빵, 감자 등)은 주 3회 이하로 제한하세요.",
    "간식으로 단순당이 많은 음식 대신 견과류나 채소 스틱을 선택하세요.",
    "매일 30분 이상의 유산소 운동을 통해 인슐린 감수성을 높이세요.",
    "물을 하루 2리터 이상 충분히 마셔 신진대사를 촉진하세요.",
    "식사와 혈당 기록을 계속 관리하며 패턴을 파악하세요.",
  ],
};

export default function HealthAnalysisPage() {
  // 초기값을 true로 설정하여 페이지 로드 시 바로 결과가 표시되도록 함
  const [showReport, setShowReport] = useState(true);
  // HealthReport 컴포넌트에 대한 ref 생성
  const healthReportRef = useRef<HealthReportRef>(null);

  // 처음 페이지가 로드될 때 toast 메시지 표시
  useEffect(() => {
    toast.success("AI 분석이 완료되었습니다!");
  }, []);

  // PDF 생성 함수
  const handleGeneratePDF = () => {
    if (healthReportRef.current) {
      healthReportRef.current.generatePDF();
    } else {
      toast.error("PDF 생성 기능을 불러올 수 없습니다.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">건강 통계 분석</h1>
        <button
          onClick={handleGeneratePDF}
          className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z"
              clipRule="evenodd"
            />
          </svg>
          PDF 저장
        </button>
      </div>

      {/* 결과 표시 */}
      <HealthReport
        ref={healthReportRef}
        glucoseData={mockGlucoseData}
        foodData={mockFoodData}
        nutrientData={mockNutrientData}
        userInfo={mockUserInfo}
        analysisResults={mockAnalysisResults}
      />
    </div>
  );
}
