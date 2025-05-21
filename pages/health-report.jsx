import React, { useState, useRef } from "react";
import { useRouter } from "next/router";
import HealthReport from "../components/HealthReport";
import AnalysisButton from "../components/AnalysisButton";
import { transformApiDataForReport } from "../components/DataTransformer";

// 페이지 컴포넌트
const HealthReportPage = () => {
  const router = useRouter();
  const [reportData, setReportData] = useState(null);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const healthReportRef = useRef(null);

  // AI 분석 완료 핸들러
  const handleAnalysisComplete = async (analysisResults) => {
    setIsLoading(true);

    try {
      // 더미 API 데이터
      const mockApiData = {
        memberResponse: {
          id: 1,
          target: {
            id: 1,
            fastingBloodSugar: 99,
            postprandialBloodSugar: 140,
            carbohydrate: 317.15,
            protein: 86.5,
            fat: 76.89,
            calories: 2307,
            createdAt: "2025-05-21T11:47:48",
            updatedAt: "2025-05-21T11:47:48",
          },
          email: "tjwndnjs0000@gmail.com",
          name: "서주투",
          nickname: "unknown",
          birthdate: "1998-09-09",
          height: 177.0,
          weight: 72.0,
          profileImageUrl: null,
          createdAt: "2025-05-21T11:47:48",
          updatedAt: "2025-05-21T11:47:48",
        },
        bloodSugarWithMealResponse: [
          {
            id: 1,
            level: 91,
            measuredAt: "2025-05-15T07:00:00",
            measureType: "FASTING",
            memo: "공복",
            mealType: "BREAKFAST",
            meal: {
              id: 1,
              mealType: "BREAKFAST",
              mealDateTime: "2025-05-15T07:00:00",
              memo: "자동 생성",
              foods: [
                { id: 1, name: "불닭볶음면" },
                { id: 2, name: "치즈불닭볶음면" },
              ],
            },
          },
          {
            id: 2,
            level: 137,
            measuredAt: "2025-05-15T09:00:00",
            measureType: "AFTER_MEAL",
            memo: "아침 식후",
            mealType: "BREAKFAST",
            meal: {
              id: 1,
              mealType: "BREAKFAST",
              mealDateTime: "2025-05-15T07:00:00",
              memo: "자동 생성",
              foods: [
                { id: 1, name: "불닭볶음면" },
                { id: 2, name: "치즈불닭볶음면" },
              ],
            },
          },
          {
            id: 3,
            level: 109,
            measuredAt: "2025-05-15T11:30:00",
            measureType: "BEFORE_MEAL",
            memo: "점심 식전",
            mealType: "LUNCH",
            meal: {
              id: 2,
              mealType: "LUNCH",
              mealDateTime: "2025-05-15T11:30:00",
              memo: "자동 생성",
              foods: [
                { id: 3, name: "큰컵짜장불닭볶음면" },
                { id: 4, name: "큰컵치즈불닭볶음면" },
              ],
            },
          },
          {
            id: 4,
            level: 143,
            measuredAt: "2025-05-15T14:00:00",
            measureType: "AFTER_MEAL",
            memo: "점심 식후",
            mealType: "LUNCH",
            meal: {
              id: 2,
              mealType: "LUNCH",
              mealDateTime: "2025-05-15T11:30:00",
              memo: "자동 생성",
              foods: [
                { id: 3, name: "큰컵짜장불닭볶음면" },
                { id: 4, name: "큰컵치즈불닭볶음면" },
              ],
            },
          },
        ],
        bloodSugarAnalysis: analysisResults.glucoseAnalysis,
        dietAnalysis: analysisResults.dietAnalysis,
        recommendedActionPlan: analysisResults.recommendedActions,
      };

      // API 데이터를 HealthReport 컴포넌트에 맞게 변환
      const transformedData = transformApiDataForReport(mockApiData);

      // 변환된 데이터로 상태 업데이트
      setReportData(transformedData);
      setIsAnalysisComplete(true);
    } catch (error) {
      console.error("데이터 변환 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // PDF 생성 함수
  const handleGeneratePDF = async () => {
    if (healthReportRef.current) {
      try {
        await healthReportRef.current.generatePDF();
      } catch (error) {
        console.error("PDF 생성 중 오류 발생:", error);
        alert("PDF 생성 중 오류가 발생했습니다.");
      }
    }
  };

  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">건강 분석 보고서</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleGoBack}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            뒤로 가기
          </button>

          {isAnalysisComplete && (
            <button
              onClick={handleGeneratePDF}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
            >
              PDF 다운로드
            </button>
          )}
        </div>
      </div>

      {!isAnalysisComplete ? (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-center text-lg text-gray-700 mb-6">
            AI 분석 버튼을 클릭하여 건강 보고서를 생성하세요.
          </p>
          <div className="flex justify-center">
            <div className="max-w-sm w-full">
              <AnalysisButton onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </div>
        </div>
      ) : isLoading ? (
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-700">보고서를 생성하는 중입니다...</p>
        </div>
      ) : (
        <HealthReport
          ref={healthReportRef}
          glucoseData={reportData.glucoseData}
          foodData={reportData.foodData}
          nutrientData={reportData.nutrientData}
          userInfo={reportData.userInfo}
          analysisResults={reportData.analysisResults}
        />
      )}
    </div>
  );
};

export default HealthReportPage;
