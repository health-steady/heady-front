import React from "react";

interface NutritionItem {
  current: number;
  target: number;
}

interface NutritionData {
  carbs: NutritionItem;
  protein: NutritionItem;
  fat: NutritionItem;
}

interface NutritionSummaryProps {
  data: NutritionData;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ data }) => {
  return (
    <div className="p-4 sm:p-5 md:p-6">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5">
        영양소 섭취 현황
      </h2>

      {/* 탄수화물 */}
      <div className="mb-3 sm:mb-4 transition-all duration-300 hover:translate-x-1">
        <div className="flex justify-between mb-1 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg">탄수화물</span>
          <span className="text-sm sm:text-base md:text-lg">
            {data.carbs.current}/{data.carbs.target}g
          </span>
        </div>
        <div className="progress-bar bg-gray-100">
          <div
            className="progress-bar-fill bg-red-400 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (data.carbs.current / data.carbs.target) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>

      {/* 단백질 */}
      <div className="mb-3 sm:mb-4 transition-all duration-300 hover:translate-x-1">
        <div className="flex justify-between mb-1 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg">단백질</span>
          <span className="text-sm sm:text-base md:text-lg">
            {data.protein.current}/{data.protein.target}g
          </span>
        </div>
        <div className="progress-bar bg-gray-100">
          <div
            className="progress-bar-fill bg-blue-400 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (data.protein.current / data.protein.target) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>

      {/* 지방 */}
      <div className="mb-3 sm:mb-4 transition-all duration-300 hover:translate-x-1">
        <div className="flex justify-between mb-1 sm:mb-2">
          <span className="text-sm sm:text-base md:text-lg">지방</span>
          <span className="text-sm sm:text-base md:text-lg">
            {data.fat.current}/{data.fat.target}g
          </span>
        </div>
        <div className="progress-bar bg-gray-100">
          <div
            className="progress-bar-fill bg-green-400 transition-all duration-500"
            style={{
              width: `${Math.min(
                100,
                (data.fat.current / data.fat.target) * 100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default NutritionSummary;
