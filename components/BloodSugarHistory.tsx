import React from "react";

interface BloodSugarData {
  breakfast: number | null; // 아침 혈당 (breakfast로 변경)
  lunch: number | null; // 점심 혈당 (lunch로 변경)
  dinner: number | null; // 저녁 혈당 (dinner로 변경)
  target?: number;
  current?: number;
  targetFasting?: number; // 목표 공복혈당
  targetPostprandial?: number; // 목표 식후혈당
  highestFasting: number | null; // 최고 공복혈당
  highestPostprandial: number | null; // 최고 식후혈당
}

interface BloodSugarHistoryProps {
  data: BloodSugarData;
}

const BloodSugarHistory: React.FC<BloodSugarHistoryProps> = ({ data }) => {
  // 기본값 설정 (API에서 값이 오지 않을 경우 대비)
  const targetFasting = data.targetFasting || 100; // 일반적인 공복혈당 목표값
  const targetPostprandial = data.targetPostprandial || data.target || 140; // 일반적인 식후혈당 목표값
  const highestFasting = data.highestFasting !== null ? data.highestFasting : 0;
  const highestPostprandial =
    data.highestPostprandial !== null ? data.highestPostprandial : 0;

  // 혈당 상태에 따른 색상 결정 함수
  const getStatusColor = (current: number, target: number) => {
    if (current === 0) return "text-gray-400"; // 데이터 없음
    if (current > target * 1.3) return "text-red-500"; // 목표보다 30% 이상 높음 - 위험
    if (current > target) return "text-orange-500"; // 목표보다 높음 - 주의
    if (current < target * 0.7) return "text-blue-500"; // 목표보다 30% 이상 낮음 - 저혈당 주의
    return "text-green-500"; // 목표 범위 내 - 좋음
  };

  // 혈당 상태 메시지
  const getStatusMessage = (current: number, target: number) => {
    if (current === 0) return "데이터 없음";
    if (current > target * 1.3) return "목표보다 높음 (주의)";
    if (current > target) return "목표보다 약간 높음";
    if (current < target * 0.7) return "목표보다 낮음 (주의)";
    return "목표 범위 내";
  };

  // 차이 계산 및 표시
  const getDifference = (current: number, target: number) => {
    if (current === 0) return "";
    const diff = current - target;
    return diff >= 0 ? `+${diff}` : `${diff}`;
  };

  // 배경색 결정 함수
  const getBackgroundColor = (current: number, target: number) => {
    if (current === 0) return "bg-gray-50";
    if (current > target * 1.3) return "bg-red-50";
    if (current > target) return "bg-orange-50";
    if (current < target * 0.7) return "bg-blue-50";
    return "bg-green-50";
  };

  // 아이콘 결정 함수
  const getStatusIcon = (current: number, target: number) => {
    if (current === 0) {
      return (
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
    if (current > target * 1.3) {
      return (
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );
    }
    if (current > target) {
      return (
        <svg
          className="w-5 h-5 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    if (current < target * 0.7) {
      return (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-5 h-5 text-green-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    );
  };

  // 진행 상태 퍼센트 계산
  const getPercentage = (current: number, target: number) => {
    if (current === 0) return 0;
    // 목표 대비 비율 (목표가 100%가 되도록)
    const percentage = (current / target) * 100;
    // 5% ~ 95% 사이로 제한
    return Math.min(Math.max(percentage, 5), 95);
  };

  return (
    <div className="p-4 sm:p-5 md:p-6 pt-2 sm:pt-2 md:pt-2 -mt-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 공복 혈당 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="font-medium text-gray-700 mb-3 text-center">
            공복혈당
          </h4>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-12 text-gray-600">목표</span>
              <span className="text-gray-900">{targetFasting} mg/dL</span>
            </div>

            <div className="flex items-center">
              <span className="w-12 text-gray-600">최고</span>
              <span className="text-gray-900">
                {highestFasting > 0 ? `${highestFasting} mg/dL` : "--"}
              </span>
            </div>

            {highestFasting > 0 && (
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(
                      highestFasting,
                      targetFasting
                    ).replace("text-", "bg-")}`}
                    style={{
                      width: `${getPercentage(highestFasting, targetFasting)}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 식후 혈당 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h4 className="font-medium text-gray-700 mb-3 text-center">
            식후혈당
          </h4>

          <div className="space-y-3">
            <div className="flex items-center">
              <span className="w-12 text-gray-600">목표</span>
              <span className="text-gray-900">{targetPostprandial} mg/dL</span>
            </div>

            <div className="flex items-center">
              <span className="w-12 text-gray-600">최고</span>
              <span className="text-gray-900">
                {highestPostprandial > 0
                  ? `${highestPostprandial} mg/dL`
                  : "--"}
              </span>
            </div>

            {highestPostprandial > 0 && (
              <div className="pt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getStatusColor(
                      highestPostprandial,
                      targetPostprandial
                    ).replace("text-", "bg-")}`}
                    style={{
                      width: `${getPercentage(
                        highestPostprandial,
                        targetPostprandial
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodSugarHistory;
