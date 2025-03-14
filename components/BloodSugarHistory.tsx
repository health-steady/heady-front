import React from "react";

interface BloodSugarData {
  morning: number;
  afternoon: number;
  evening: number | null;
  target: number;
  current: number;
}

interface BloodSugarHistoryProps {
  data: BloodSugarData;
}

const BloodSugarHistory: React.FC<BloodSugarHistoryProps> = ({ data }) => {
  return (
    <div className="p-4 sm:p-5 md:p-6 pt-0 sm:pt-1">
      <div className="flex justify-between mb-4">
        <div className="transition-all duration-300 hover:scale-105">
          <div className="text-sm sm:text-base md:text-lg text-gray-500">
            목표 혈당
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {data.target} mg/dL
          </div>
        </div>
        <div className="transition-all duration-300 hover:scale-105">
          <div className="text-sm sm:text-base md:text-lg text-gray-500">
            현재 혈당
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {data.current} mg/dL
          </div>
        </div>
      </div>

      <button className="w-full bg-black text-white py-3 sm:py-4 md:py-5 rounded-lg flex items-center justify-center font-medium text-base sm:text-lg md:text-xl transition-all duration-300 hover:bg-gray-800 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        혈당 입력하기
      </button>
    </div>
  );
};

export default BloodSugarHistory;
