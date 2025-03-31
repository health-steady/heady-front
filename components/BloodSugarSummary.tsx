import React from "react";

interface BloodSugarData {
  morning: number;
  afternoon: number;
  evening: number | null;
  target: number;
  current: number;
}

interface BloodSugarSummaryProps {
  data: BloodSugarData;
}

const BloodSugarSummary: React.FC<BloodSugarSummaryProps> = ({ data }) => {
  return (
    <div className="p-4 sm:p-5 md:p-6 pb-3 sm:pb-3 md:pb-3">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-2">
        {/* 아침 혈당 */}
        <div className="bg-green-50 p-3 sm:p-4 md:p-5 rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="text-xs sm:text-sm text-green-600 mb-1 flex items-center">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            아침
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {data.morning}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">mg/dL</div>
        </div>

        {/* 점심 혈당 */}
        <div className="bg-yellow-50 p-3 sm:p-4 md:p-5 rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="text-xs sm:text-sm text-yellow-600 mb-1 flex items-center">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>
            점심
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {data.afternoon}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">mg/dL</div>
        </div>

        {/* 저녁 혈당 */}
        <div className="bg-blue-50 p-3 sm:p-4 md:p-5 rounded-lg transition-all duration-300 hover:shadow-md">
          <div className="text-xs sm:text-sm text-blue-600 mb-1 flex items-center">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              ></path>
            </svg>
            저녁
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            {data.evening ? data.evening : "--"}
          </div>
          <div className="text-xs sm:text-sm text-gray-500">mg/dL</div>
        </div>
      </div>
    </div>
  );
};

export default BloodSugarSummary;
