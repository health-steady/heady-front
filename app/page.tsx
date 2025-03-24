"use client";

import { useState } from "react";
import Header from "@/components/Header";
import BloodSugarSummary from "@/components/BloodSugarSummary";
import BloodSugarHistory from "@/components/BloodSugarHistory";
import NutritionSummary from "@/components/NutritionSummary";
import BottomNavigation from "@/components/BottomNavigation";
import BloodSugarInputModal, {
  BloodSugarInputData,
} from "@/components/BloodSugarInputModal";
import LoginModal from "@/components/LoginModal";
import SignupModal, { SignupData } from "@/components/SignupModal";
import MealInputModal from "@/components/MealInputModal";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isBloodSugarModalOpen, setIsBloodSugarModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log("모달 열기 버튼 클릭됨");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenLoginModal = () => {
    console.log("프로필 이미지 클릭됨");
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSignupModal = () => {
    console.log("회원가입 버튼 클릭됨");
    setIsLoginModalOpen(false); // 로그인 모달 닫기
    setIsSignupModalOpen(true); // 회원가입 모달 열기
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    console.log("로그인 시도:", email, password);
    // 여기서 로그인 로직을 구현할 수 있습니다.
    // 예: API 호출 또는 상태 업데이트
    handleCloseLoginModal();
  };

  const handleSignupSubmit = (data: SignupData) => {
    console.log("회원가입 데이터:", data);
    // 여기서 회원가입 로직을 구현할 수 있습니다.
    // 예: API 호출 또는 상태 업데이트
    console.log("사용자 정보:", data.step1);
    console.log("연락처 정보:", data.step2);
    console.log("계정 정보:", data.step3);
    handleCloseSignupModal();
  };

  const handleSubmitBloodSugar = (data: BloodSugarInputData) => {
    console.log("혈당 데이터 제출:", data);
    // 여기서 데이터를 처리하고 상태를 업데이트할 수 있습니다.
    // 예: API 호출 또는 상태 업데이트
  };

  const handleOpenBloodSugarModal = () => {
    console.log("혈당 기록하기 버튼 클릭됨");
    setIsBloodSugarModalOpen(true);
  };

  const handleCloseBloodSugarModal = () => {
    setIsBloodSugarModalOpen(false);
  };

  const handleOpenMealModal = () => {
    console.log("식사 기록하기 버튼 클릭됨");
    setIsMealModalOpen(true);
  };

  const handleCloseMealModal = () => {
    setIsMealModalOpen(false);
  };

  const handleSubmitMeal = (data: any) => {
    console.log("식사 데이터 제출:", data);
    // 여기서 데이터를 처리하고 상태를 업데이트할 수 있습니다.
    // 예: API 호출 또는 상태 업데이트
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200">
        <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto bg-white z-10">
          <Header userName={userName} onProfileClick={handleOpenLoginModal} />
        </div>
        <div className="h-full overflow-y-auto pt-[85px]">
          <div className="bg-white h-full">
            <div className="h-3 sm:h-4 md:h-5 bg-gray-100"></div>
            <BloodSugarSummary data={bloodSugarData} />
            <BloodSugarHistory data={bloodSugarData} />
            <div className="h-2 bg-gray-100"></div>

            {/* 버튼 그룹 */}
            <div className="p-4 space-y-4">
              {/* 혈당 기록하기 버튼 */}
              <button
                onClick={handleOpenBloodSugarModal}
                className="w-full py-2.5 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="#e74c3c"
                >
                  <path d="M12 2L8 10C5.8 12.7 5.8 16.3 8 19C9.1 20.3 10.5 21 12 21C13.5 21 14.9 20.3 16 19C18.2 16.3 18.2 12.7 16 10L12 2Z" />
                </svg>
                혈당 기록하기
              </button>

              {/* 식사 기록하기 버튼 */}
              <button
                onClick={handleOpenMealModal}
                className="w-full py-2.5 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors text-sm"
              >
                <span className="text-base mr-2">🍱</span>
                식사 기록하기
              </button>
            </div>

            <div className="h-2 bg-gray-100"></div>
            <NutritionSummary data={nutritionData} />

            {/* 하단 네비게이션 바 높이만큼 빈 영역 */}
            <div className="h-16"></div>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto bg-white border-t border-gray-200">
          <BottomNavigation activePage="home" />
        </div>
      </div>

      {/* 혈당 입력 모달 */}
      <BloodSugarInputModal
        isOpen={isBloodSugarModalOpen}
        onClose={handleCloseBloodSugarModal}
        onSubmit={handleSubmitBloodSugar}
      />

      {/* 식사 입력 모달 */}
      <MealInputModal
        isOpen={isMealModalOpen}
        onClose={handleCloseMealModal}
        onSubmit={handleSubmitMeal}
      />

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleCloseLoginModal}
        onLogin={handleLogin}
        onSignupClick={handleOpenSignupModal}
      />

      {/* 회원가입 모달 */}
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={handleCloseSignupModal}
        onNext={handleSignupSubmit}
      />
    </div>
  );
}
