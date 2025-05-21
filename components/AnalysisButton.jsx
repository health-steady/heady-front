import React, { useState } from "react";

const AnalysisButton = ({ onAnalysisComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setLoadingPhase(0);

    try {
      // 로딩 단계별 메시지를 보여주기 위한 타이머
      const phaseTimer = setInterval(() => {
        setLoadingPhase((prevPhase) => (prevPhase + 1) % 4);
      }, 700);

      // 더미 분석 결과 (API 호출 대신)
      const dummyResults = {
        glucoseAnalysis:
          "환자 '서주투'님의 혈당 기록을 분석한 결과, 공복 혈당은 비교적 안정적인 범위 내에 있지만, 식후 혈당이 140mg/dL 이상으로 자주 상승하는 패턴을 보입니다. 특히, 아침, 점심, 저녁 식사 후 혈당이 유사하게 높은 수치를 나타내는 것으로 보아, 1일 3식 모두 식단의 영향을 크게 받는 것으로 판단됩니다. 취침 전 간식 섭취는 혈당 조절에 추가적인 부담을 줄 수 있습니다.",
        dietAnalysis:
          "제공된 식단 정보를 분석한 결과, 환자분은 주로 불닭볶음면과 같은 고탄수화물, 고지방, 고나트륨 식품을 섭취하고 있습니다. 아침, 점심, 저녁 식사뿐만 아니라 취침 전 간식으로도 라면류를 섭취하는 식습관은 혈당을 급격하게 상승시키는 주요 원인으로 작용합니다. 특히, 섬유질 섭취가 부족하고, 혈당 조절에 도움이 되는 단백질 및 건강한 지방 섭취가 미흡한 점이 관찰됩니다. 또한, 식사량이 과도한 것으로 보입니다.",
        recommendedActions: [
          "매 식사 시 섭취하는 라면의 양을 절반으로 줄이고, 단백질(닭가슴살, 계란)과 섬유질(채소) 섭취를 늘려 균형 잡힌 식단을 구성하세요.",
          "불닭볶음면 섭취를 주 2회 이하로 제한하고, 그 외에는 잡곡밥, 채소, 단백질 위주의 식사를 하세요.",
          "취침 전 간식 섭취를 중단하고, 배고픔이 심할 경우, 설탕이 첨가되지 않은 플레인 요거트나 견과류를 소량 섭취하세요.",
          "매일 30분 이상의 유산소 운동(걷기, 조깅, 수영 등)을 규칙적으로 실시하여 인슐린 저항성을 개선하고 혈당 조절 능력을 향상시키세요.",
          "정기적으로 혈당을 측정하고, 식단 및 운동 습관 변화에 따른 혈당 변화를 기록하여 의료진과 상담 시 활용하세요.",
        ],
      };

      // 약간의 지연 시간 추가 (UI 경험을 위해)
      setTimeout(() => {
        clearInterval(phaseTimer);
        onAnalysisComplete(dummyResults);
        setIsLoading(false);
        setLoadingPhase(0);
      }, 3000);
    } catch (err) {
      console.error("오류 발생:", err);
      setIsLoading(false);
      setLoadingPhase(0);
    }
  };

  // 로딩 단계별 메시지
  const loadingMessages = [
    "혈당 데이터 분석 중...",
    "식단 패턴 분석 중...",
    "영양소 섭취 분석 중...",
    "개인 맞춤 권장 사항 생성 중...",
  ];

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      <button
        onClick={handleAnalysis}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all ${
          isLoading
            ? "bg-blue-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
        } text-white`}
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            AI 분석 중
          </span>
        ) : (
          <>
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
            AI 건강 분석 시작하기
          </>
        )}
      </button>

      {/* 로딩 중일 때 보여지는 단계 메시지 */}
      {isLoading && (
        <div className="text-sm text-blue-600 font-medium animate-pulse mt-2">
          {loadingMessages[loadingPhase]}
        </div>
      )}
    </div>
  );
};

export default AnalysisButton;
