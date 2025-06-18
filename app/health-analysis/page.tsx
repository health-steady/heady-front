"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import HealthReport, { HealthReportRef } from "@/components/HealthReport";

// 기본 더미 데이터
const defaultUserInfo = {
  age: 25,
  gender: "남성",
  height: 177,
  weight: 72,
  bmi: 23.0,
  targetGlucose: 140,
};

const defaultGlucoseData = [
  // 5월 14일
  {
    date: "2025-05-14",
    time: "07:00",
    value: 93,
    mealType: "FASTING",
  },
  {
    date: "2025-05-14",
    time: "08:30",
    value: 142,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-14",
    time: "12:00",
    value: 99,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-14",
    time: "13:30",
    value: 148,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-14",
    time: "18:00",
    value: 102,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-14",
    time: "19:30",
    value: 155,
    mealType: "DINNER",
  },

  // 5월 15일
  {
    date: "2025-05-15",
    time: "07:00",
    value: 91,
    mealType: "FASTING",
  },
  {
    date: "2025-05-15",
    time: "09:00",
    value: 137,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-15",
    time: "12:00",
    value: 96,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-15",
    time: "13:30",
    value: 145,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-15",
    time: "18:00",
    value: 99,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-15",
    time: "19:30",
    value: 152,
    mealType: "DINNER",
  },

  // 5월 16일
  {
    date: "2025-05-16",
    time: "07:00",
    value: 95,
    mealType: "FASTING",
  },
  {
    date: "2025-05-16",
    time: "08:30",
    value: 146,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-16",
    time: "12:00",
    value: 98,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-16",
    time: "13:30",
    value: 155,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-16",
    time: "18:00",
    value: 101,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-16",
    time: "19:30",
    value: 162,
    mealType: "DINNER",
  },

  // 5월 17일
  {
    date: "2025-05-17",
    time: "07:30",
    value: 97,
    mealType: "FASTING",
  },
  {
    date: "2025-05-17",
    time: "09:00",
    value: 140,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-17",
    time: "12:30",
    value: 102,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-17",
    time: "14:00",
    value: 138,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-17",
    time: "18:30",
    value: 98,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-17",
    time: "20:00",
    value: 147,
    mealType: "DINNER",
  },

  // 5월 18일
  {
    date: "2025-05-18",
    time: "08:00",
    value: 94,
    mealType: "FASTING",
  },
  {
    date: "2025-05-18",
    time: "09:30",
    value: 135,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-18",
    time: "13:00",
    value: 97,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-18",
    time: "14:30",
    value: 142,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-18",
    time: "19:00",
    value: 100,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-18",
    time: "20:30",
    value: 151,
    mealType: "DINNER",
  },

  // 5월 19일
  {
    date: "2025-05-19",
    time: "07:00",
    value: 92,
    mealType: "FASTING",
  },
  {
    date: "2025-05-19",
    time: "08:30",
    value: 139,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-19",
    time: "12:00",
    value: 95,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-19",
    time: "13:30",
    value: 147,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-19",
    time: "18:00",
    value: 96,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-19",
    time: "19:30",
    value: 149,
    mealType: "DINNER",
  },

  // 5월 20일
  {
    date: "2025-05-20",
    time: "07:00",
    value: 90,
    mealType: "FASTING",
  },
  {
    date: "2025-05-20",
    time: "08:30",
    value: 136,
    mealType: "BREAKFAST",
  },
  {
    date: "2025-05-20",
    time: "12:00",
    value: 94,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-20",
    time: "13:30",
    value: 141,
    mealType: "LUNCH",
  },
  {
    date: "2025-05-20",
    time: "18:00",
    value: 97,
    mealType: "BEFORE_MEAL",
  },
  {
    date: "2025-05-20",
    time: "19:30",
    value: 144,
    mealType: "DINNER",
  },
];

const defaultFoodData = [
  {
    name: "불닭볶음면",
    carbs: 65,
    protein: 12,
    fat: 15,
    calories: 530,
    glycemicIndex: 75,
    date: "2025-05-15",
    time: "07:00",
    glucoseAfter: 137,
  },
];

const defaultNutrientData = [
  {
    date: "2025-05-15",
    carbs: 250,
    protein: 70,
    fat: 60,
    calories: 1840,
  },
];

const defaultAnalysisResults = {
  glucoseAnalysis:
    "건강한 수준의 혈당 관리가 필요합니다. 식후 혈당이 목표치보다 약간 높게 유지되고 있습니다.",
  dietAnalysis:
    "탄수화물 위주의 식단이 혈당 관리에 부정적인 영향을 미치고 있습니다.",
  recommendedActions: [
    "탄수화물 섭취를 줄이고 단백질 섭취를 늘리세요.",
    "식사 후 가벼운 운동을 하세요.",
    "식사 시간을 규칙적으로 유지하세요.",
  ],
};

const defaultFoodImpactData = [
  {
    name: "불닭볶음면",
    glucoseImpact: 46,
    carbs: 65,
    occurrences: 8,
    glycemicIndex: 75,
  },
  {
    name: "치즈불닭볶음면",
    glucoseImpact: 35,
    carbs: 60,
    occurrences: 6,
    glycemicIndex: 70,
  },
  {
    name: "큰컵불닭볶음면",
    glucoseImpact: 32,
    carbs: 72,
    occurrences: 4,
    glycemicIndex: 68,
  },
  {
    name: "까르보나라불닭볶음면",
    glucoseImpact: 30,
    carbs: 58,
    occurrences: 4,
    glycemicIndex: 65,
  },
  {
    name: "핵불닭볶음면",
    glucoseImpact: 27,
    carbs: 62,
    occurrences: 4,
    glycemicIndex: 67,
  },
];

// API 응답 데이터 타입 정의
interface ApiData {
  memberResponse: {
    id: number;
    target?: {
      id: number;
      fastingBloodSugar: number;
      postprandialBloodSugar: number;
      carbohydrate: number;
      protein: number;
      fat: number;
      calories: number;
      createdAt: string;
      updatedAt: string;
    };
    email: string;
    name: string;
    nickname: string;
    birthdate: string;
    height: number;
    weight: number;
    profileImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
  bloodSugarWithMealResponse: Array<{
    id: number;
    level: number;
    measuredAt: string;
    measureType: string;
    memo: string;
    mealType: string;
    meal?: {
      id: number;
      mealType: string;
      mealDateTime: string;
      memo: string;
      foods: Array<{
        id: number;
        name: string;
      }>;
    };
  }>;
  dailyNutrients: Array<{
    date: string;
    nutrient: {
      carbohydrate: number;
      protein: number;
      fat: number;
    };
  }>;
  bloodSugarAnalysis: string;
  dietAnalysis: string;
  recommendedActionPlan: string[];
}

// HealthReport 컴포넌트 데이터 타입 정의
interface GlucoseData {
  date: string;
  time: string;
  value: number;
  mealType: string;
}

interface FoodData {
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  glycemicIndex: number;
  date: string;
  time: string;
  glucoseAfter?: number;
}

interface NutrientData {
  date: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
}

interface UserInfo {
  age: number;
  gender: string;
  height: number;
  weight: number;
  bmi: number;
  targetGlucose: number;
}

interface AnalysisResults {
  glucoseAnalysis: string;
  dietAnalysis: string;
  recommendedActions: string[];
}

interface ReportData {
  userInfo: UserInfo;
  glucoseData: GlucoseData[];
  foodData: FoodData[];
  nutrientData: NutrientData[];
  analysisResults: AnalysisResults;
  foodImpactData: Array<{
    name: string;
    glucoseImpact: number;
    carbs: number;
    occurrences: number;
    glycemicIndex: number;
  }>;
}

// API 응답 데이터를 HealthReport 컴포넌트에서 사용할 형식으로 변환하는 함수
const transformApiData = (apiData: any): ReportData | null => {
  try {
    if (!apiData) {
      console.error("API 데이터가 없습니다.");
      return null;
    }

    console.log("API 응답 구조 확인:", Object.keys(apiData));

    // 응답 구조가 새로운 API 응답 형식인지 확인
    const memberResponse = apiData.memberResponse;
    const bloodSugarWithMealResponse = apiData.bloodSugarWithMealResponse || [];
    const bloodSugarAnalysis = apiData.bloodSugarAnalysis || "";
    const dietAnalysis = apiData.dietAnalysis || "";
    const recommendedActionPlan = apiData.recommendedActionPlan || [];
    const dailyNutrients = apiData.dailyNutrients || [];

    // 필수 데이터 확인
    if (!memberResponse) {
      console.error("사용자 정보가 없습니다.");
      return null;
    }

    console.log("혈당 데이터 개수:", bloodSugarWithMealResponse.length);
    console.log("영양소 데이터 개수:", dailyNutrients.length);
    console.log("분석 결과 길이:", {
      bloodSugarAnalysis: bloodSugarAnalysis?.length || 0,
      dietAnalysis: dietAnalysis?.length || 0,
      recommendedActionPlan: recommendedActionPlan?.length || 0,
    });

    // 사용자 정보 변환
    const userInfo: UserInfo = {
      age: calculateAge(memberResponse.birthdate),
      gender: "남성", // API에서 제공하지 않는 정보, 기본값 설정
      height: memberResponse.height,
      weight: memberResponse.weight,
      bmi: calculateBMI(memberResponse.height, memberResponse.weight),
      targetGlucose: memberResponse.target?.postprandialBloodSugar || 140,
    };

    // 혈당 데이터 변환 - 모든 데이터를 반영
    const glucoseData: GlucoseData[] = bloodSugarWithMealResponse.map(
      (item: any) => {
        const measuredDate = new Date(item.measuredAt);
        return {
          date: measuredDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
          time: measuredDate.toTimeString().substring(0, 5), // HH:MM 형식
          value: item.level,
          mealType: item.mealType || "UNKNOWN",
        };
      }
    );

    console.log(`변환된 혈당 데이터: ${glucoseData.length}개`);

    // 식사 데이터와 혈당 데이터를 연결
    const mealGlucoseMap = new Map();

    // 식사 전후 혈당 데이터 매핑
    bloodSugarWithMealResponse.forEach((item: any) => {
      if (item.meal) {
        const mealId = item.meal.id;
        if (!mealGlucoseMap.has(mealId)) {
          mealGlucoseMap.set(mealId, {
            mealInfo: item.meal,
            before: null,
            after: null,
            date: new Date(item.measuredAt).toISOString().split("T")[0],
            time: new Date(item.measuredAt).toTimeString().substring(0, 5),
          });
        }

        const mealData = mealGlucoseMap.get(mealId);
        if (
          item.measureType === "BEFORE_MEAL" ||
          item.measureType === "FASTING"
        ) {
          mealData.before = item.level;
        } else if (item.measureType === "AFTER_MEAL") {
          mealData.after = item.level;
        }
      }
    });

    console.log(`매핑된 식사 데이터: ${mealGlucoseMap.size}개`);

    // 중복 없는 음식 목록 생성 및 각 음식별 혈당 영향 계산
    const uniqueFoodImpactMap = new Map();

    mealGlucoseMap.forEach((mealData) => {
      const { mealInfo, before, after, date, time } = mealData;
      if (
        mealInfo.foods &&
        mealInfo.foods.length > 0 &&
        before !== null &&
        after !== null
      ) {
        const glucoseChange = after - before;
        const foodCount = mealInfo.foods.length;

        // 각 음식에 혈당 변화를 균등하게 분배
        const changePerFood = glucoseChange / foodCount;

        mealInfo.foods.forEach((food: any) => {
          const foodName = food.name;

          if (!uniqueFoodImpactMap.has(foodName)) {
            uniqueFoodImpactMap.set(foodName, {
              name: foodName,
              occurrences: 0,
              totalGlucoseImpact: 0,
              totalCarbsEstimate: 0,
              samples: [],
            });
          }

          const foodData = uniqueFoodImpactMap.get(foodName);
          foodData.occurrences += 1;
          foodData.totalGlucoseImpact += changePerFood;

          // 임의의 탄수화물 데이터 추정 (실제 데이터가 없으므로)
          const estimatedCarbs = Math.floor(Math.random() * 50) + 30;
          foodData.totalCarbsEstimate += estimatedCarbs;

          // 개별 사례 저장
          foodData.samples.push({
            date,
            time,
            before,
            after,
            change: changePerFood,
            carbs: estimatedCarbs,
          });
        });
      }
    });

    // 음식 데이터 변환 - 고전적인 방식도 유지 (foodData)
    const foodData: FoodData[] = [];
    bloodSugarWithMealResponse.forEach((item: any) => {
      if (item.meal && item.meal.foods && item.meal.foods.length > 0) {
        // 각 음식마다 데이터 생성
        item.meal.foods.forEach((food: any) => {
          // 임의의 영양소 데이터 생성 (식품별 실제 데이터가 없으므로)
          const carbsPerFood = Math.floor(Math.random() * 50) + 30; // 30-80g
          const proteinPerFood = Math.floor(Math.random() * 15) + 5; // 5-20g
          const fatPerFood = Math.floor(Math.random() * 10) + 5; // 5-15g
          const caloriesPerFood =
            carbsPerFood * 4 + proteinPerFood * 4 + fatPerFood * 9;
          const glycemicIndex = Math.floor(Math.random() * 40) + 60; // 60-100

          // 식후 혈당 가져오기
          const glucoseAfter =
            item.measureType === "AFTER_MEAL" ? item.level : undefined;
          const measuredDate = new Date(item.measuredAt);

          foodData.push({
            name: food.name,
            carbs: carbsPerFood,
            protein: proteinPerFood,
            fat: fatPerFood,
            calories: caloriesPerFood,
            glycemicIndex: glycemicIndex,
            date: measuredDate.toISOString().split("T")[0],
            time: measuredDate.toTimeString().substring(0, 5),
            glucoseAfter: glucoseAfter,
          });
        });
      }
    });

    console.log(`변환된 음식 데이터: ${foodData.length}개`);
    console.log(`중복 제거된 음식 데이터: ${uniqueFoodImpactMap.size}개`);

    // 중복 제거된 음식 영향 데이터로 변환
    const foodImpactData = Array.from(uniqueFoodImpactMap.values())
      .map((food) => ({
        name: food.name,
        glucoseImpact: Math.round(food.totalGlucoseImpact / food.occurrences), // 평균 혈당 상승
        carbs: Math.round(food.totalCarbsEstimate / food.occurrences), // 평균 탄수화물
        occurrences: food.occurrences, // 출현 횟수
        glycemicIndex:
          65 + Math.round(food.totalGlucoseImpact / food.occurrences / 3), // 혈당 상승에 비례한 GI 추정
      }))
      .sort((a, b) => b.glucoseImpact - a.glucoseImpact) // 혈당 상승 효과가 큰 순서대로 정렬
      .slice(0, 10); // 상위 10개만 표시

    // 일별 영양소 데이터 변환 - 모든 데이터를 반영
    const nutrientData: NutrientData[] = dailyNutrients.map((item: any) => ({
      date: item.date,
      carbs: item.nutrient.carbohydrate,
      protein: item.nutrient.protein,
      fat: item.nutrient.fat,
      calories:
        item.nutrient.carbohydrate * 4 +
        item.nutrient.protein * 4 +
        item.nutrient.fat * 9,
    }));

    console.log(`변환된 영양소 데이터: ${nutrientData.length}개`);

    // 분석 결과 - 정확히 API 응답 데이터를 사용
    const analysisResults: AnalysisResults = {
      glucoseAnalysis:
        bloodSugarAnalysis || "혈당 분석 결과를 불러올 수 없습니다.",
      dietAnalysis: dietAnalysis || "식단 분석 결과를 불러올 수 없습니다.",
      recommendedActions:
        recommendedActionPlan && recommendedActionPlan.length > 0
          ? recommendedActionPlan
          : ["권장 행동 계획을 불러올 수 없습니다."],
    };

    console.log("분석 결과:", analysisResults);

    // 최종 데이터 구성
    const result = {
      userInfo,
      glucoseData,
      foodData,
      nutrientData,
      analysisResults,
      foodImpactData, // 새로 추가된 중복 제거된 음식 영향 데이터
    };

    console.log("데이터 변환 완료");
    return result;
  } catch (error) {
    console.error("API 데이터 변환 중 오류 발생:", error);
    return null;
  }
};

// 나이 계산 함수
const calculateAge = (birthdate: string): number => {
  const today = new Date();
  const birthDate = new Date(birthdate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

// BMI 계산 함수
const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export default function HealthAnalysisPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoadedFromMessage, setDataLoadedFromMessage] = useState(false);
  const healthReportRef = useRef<HealthReportRef>(null);

  // 페이지 로드 시 로컬 스토리지에서 분석 데이터 가져오기
  useEffect(() => {
    // URL에서 pending 파라미터 확인 (분석 대기 중인지)
    const url = new URL(window.location.href);
    const isPending = url.searchParams.get("pending") === "true";

    // 분석 중 상태 설정
    setIsLoading(isPending);

    // 브로드캐스트 채널 설정
    const messageChannel = new BroadcastChannel("health_analysis_channel");

    // 메시지 리스너 추가
    messageChannel.onmessage = (event) => {
      if (event.data.type === "ANALYSIS_DATA_READY") {
        console.log(
          "AI 분석 데이터가 준비되었습니다. 데이터를 다시 로드합니다."
        );

        // 메시지를 통한 데이터 로드 표시
        setDataLoadedFromMessage(true);
        loadAnalysisData(true); // 메시지를 통한 로드임을 표시

        // 주소창에서 pending 파라미터 제거 (URL 히스토리 업데이트)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete("pending");
        window.history.replaceState({}, "", newUrl);
      }
    };

    // pending 상태가 아닐 경우에만 초기 데이터 로드
    // pending 상태일 경우 메시지를 기다림
    if (!isPending) {
      const initialTimer = setTimeout(() => {
        loadAnalysisData(false); // 초기 로드임을 표시
      }, 500); // 0.5초 지연

      return () => {
        clearTimeout(initialTimer);
        messageChannel.close();
      };
    } else {
      return () => {
        messageChannel.close();
      };
    }
  }, []);

  const loadAnalysisData = (isFromMessage: boolean) => {
    try {
      // 클라이언트 사이드에서만 실행되도록 함
      if (typeof window !== "undefined") {
        console.log(
          "health-analysis 페이지: 데이터 로드 시작",
          isFromMessage ? "(메시지에서 호출)" : "(초기 로드)"
        );

        // 로컬 스토리지에서 데이터 확인
        const storedData = localStorage.getItem("aiAnalysisData");
        console.log(
          "로컬 스토리지 데이터 확인:",
          storedData ? "데이터 있음" : "데이터 없음"
        );

        if (storedData) {
          try {
            // JSON 파싱 및 데이터 변환
            const parsedData = JSON.parse(storedData);
            const transformedData = transformApiData(parsedData);

            if (transformedData) {
              // 데이터 설정
              setReportData(transformedData);

              // isFromMessage가 true인 경우에만 toast 메시지 표시
              if (isFromMessage) {
                toast.success("AI 분석 결과가 로드되었습니다!");
              }

              console.log("AI 분석 결과 로드 완료");
            } else {
              throw new Error("데이터 변환 실패");
            }
          } catch (parseError) {
            console.error("데이터 처리 오류:", parseError);
            useDefaultData(
              "데이터 처리 중 오류가 발생했습니다. 기본 데이터를 사용합니다.",
              !isFromMessage // 초기 로드에서만 알림 표시
            );
          }
        } else {
          console.log("저장된 분석 데이터 없음, 기본 데이터 사용");
          useDefaultData(
            "저장된 분석 데이터가 없습니다. 기본 데이터를 사용합니다.",
            !isFromMessage // 초기 로드에서만 알림 표시
          );
        }
      }
    } catch (error) {
      console.error("분석 데이터 로드 오류:", error);
      useDefaultData(
        "데이터 로드 중 오류가 발생했습니다.",
        !isFromMessage // 초기 로드에서만 알림 표시
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 기본 데이터 설정 헬퍼 함수
  const useDefaultData = (message: string, showToast: boolean = true) => {
    setReportData({
      userInfo: defaultUserInfo,
      glucoseData: defaultGlucoseData,
      foodData: defaultFoodData,
      nutrientData: defaultNutrientData,
      analysisResults: defaultAnalysisResults,
      foodImpactData: defaultFoodImpactData,
    });

    // showToast가 true인 경우에만 알림 표시
    if (showToast) {
      toast(message);
    }
  };

  // PDF 생성 함수
  const handleGeneratePDF = () => {
    if (healthReportRef.current) {
      healthReportRef.current.generatePDF();
    } else {
      toast("PDF 생성 기능을 불러올 수 없습니다.");
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 text-center sm:text-left">
          건강 통계 분석
        </h1>
        {!isLoading && (
          <button
            onClick={handleGeneratePDF}
            className="w-full sm:w-auto px-3 sm:px-4 py-2 bg-blue-600 text-white rounded flex items-center justify-center text-base sm:text-base"
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
        )}
      </div>

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl text-center w-11/12 max-w-xs sm:max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl font-semibold">
              AI 분석 중입니다...
            </p>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      )}

      {/* 결과 표시 */}
      {reportData && !isLoading && (
        <HealthReport
          ref={healthReportRef}
          glucoseData={reportData.glucoseData}
          foodData={reportData.foodData}
          nutrientData={reportData.nutrientData}
          userInfo={reportData.userInfo}
          analysisResults={reportData.analysisResults}
          foodImpactData={reportData.foodImpactData}
        />
      )}
    </div>
  );
}
