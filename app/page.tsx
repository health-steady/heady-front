"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BloodSugarSummary from "@/components/BloodSugarSummary";
import BloodSugarHistory from "@/components/BloodSugarHistory";
import NutritionSummary from "@/components/NutritionSummary";
import BottomNavigation from "@/components/BottomNavigation";

export default function Home() {
  const [userName, setUserName] = useState("김민수");
  const [bloodSugarData, setBloodSugarData] = useState({
    morning: 123,
    afternoon: 145,
    evening: null,
    target: 140,
    current: 123,
  });

  const [nutritionData, setNutritionData] = useState({
    carbs: { current: 42, target: 77 },
    protein: { current: 85, target: 136 },
    fat: { current: 20, target: 40 },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-300">
        <div className="h-full overflow-y-auto pb-28 pt-0">
          <div className="bg-white h-full">
            <Header userName={userName} />
            <BloodSugarSummary data={bloodSugarData} />
            <BloodSugarHistory data={bloodSugarData} />
            <div className="h-2 bg-gray-100"></div>
            <NutritionSummary data={nutritionData} />
          </div>
        </div>
        <BottomNavigation activePage="home" />
      </div>
    </div>
  );
}
