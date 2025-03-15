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

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-300">
        <div className="h-full overflow-y-auto pb-28 pt-0">
          <div className="bg-white h-full">
            <Header userName={userName} onProfileClick={handleOpenLoginModal} />
            <BloodSugarSummary data={bloodSugarData} />
            <BloodSugarHistory
              data={bloodSugarData}
              onOpenModal={handleOpenModal}
            />
            <div className="h-2 bg-gray-100"></div>
            <NutritionSummary data={nutritionData} />
          </div>
        </div>
        <BottomNavigation activePage="home" />
      </div>

      {/* 혈당 입력 모달 */}
      <BloodSugarInputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitBloodSugar}
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
