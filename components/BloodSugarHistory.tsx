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
    </div>
  );
};

export default BloodSugarHistory;
