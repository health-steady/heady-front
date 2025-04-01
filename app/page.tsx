"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BloodSugarSummary from "@/components/BloodSugarSummary";
import BloodSugarHistory from "@/components/BloodSugarHistory";
import NutritionSummary from "@/components/NutritionSummary";
import BottomNavigation from "@/components/BottomNavigation";
import BloodSugarInputModal from "@/components/BloodSugarInputModal";
import LoginModal from "@/components/LoginModal";
import SignupModal, { SignupData } from "@/components/SignupModal";
import MealInputModal from "@/components/MealInputModal";
import { toast } from "react-hot-toast";
import { authService, UserInfo } from "@/services/auth";
import axios from "axios";

// 혈당 데이터 인터페이스
interface BloodSugarData {
  breakfast: number | null;
  lunch: number | null;
  dinner: number | null;
  highestFasting: number | null;
  highestPostprandial: number | null;
  target?: number;
  current?: number;
}

// 회원 정보 인터페이스
interface MemberData {
  targetFasting: number;
  targetPostprandial: number;
}

// 영양소 데이터 인터페이스
interface NutrientData {
  carbohydrate: number;
  protein: number;
  fat: number;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userName, setUserName] = useState("");
  const [bloodSugarData, setBloodSugarData] = useState<BloodSugarData>({
    breakfast: null,
    lunch: null,
    dinner: null,
    highestFasting: null,
    highestPostprandial: null,
  });

  const [nutritionData, setNutritionData] = useState({
    carbs: { current: 0, target: 77 },
    protein: { current: 0, target: 136 },
    fat: { current: 0, target: 40 },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isBloodSugarModalOpen, setIsBloodSugarModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);

  const [memberData, setMemberData] = useState<MemberData>({
    targetFasting: 100,
    targetPostprandial: 140,
  });

  const [isLoading, setIsLoading] = useState(true);

  // 로그인 상태 및 사용자 정보 확인
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo();
    }
  }, []);

  useEffect(() => {
    // 데이터 가져오기
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // 현재 날짜 형식 생성 (YYYY-MM-DD)
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        // JWT 토큰 가져오기
        const token = localStorage.getItem("accessToken");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 혈당 데이터 가져오기
        const bloodSugarResponse = await axios.get(
          `http://localhost:8080/api/bloodSugars/v1/summary?date=${dateString}`,
          { headers }
        );

        if (bloodSugarResponse.data) {
          setBloodSugarData(bloodSugarResponse.data);
        }

        // 회원 정보 가져오기
        const memberResponse = await axios.get(
          "http://localhost:8080/api/members/v1",
          { headers }
        );

        if (memberResponse.data) {
          setMemberData({
            targetFasting: memberResponse.data.fastingBloodSugar || 100,
            targetPostprandial:
              memberResponse.data.postprandialBloodSugar || 140,
          });

          // 영양 목표치 설정
          if (memberResponse.data.target) {
            setNutritionData((prev) => ({
              carbs: {
                ...prev.carbs,
                target: memberResponse.data.target.carbohydrate || 77,
              },
              protein: {
                ...prev.protein,
                target: memberResponse.data.target.protein || 136,
              },
              fat: {
                ...prev.fat,
                target: memberResponse.data.target.fat || 40,
              },
            }));
          }
        }

        // 영양소 섭취 데이터 가져오기
        const nutrientResponse = await axios.get(
          `http://localhost:8080/api/meals/v1/nutrients/summary?date=${dateString}`,
          { headers }
        );

        if (nutrientResponse.data) {
          setNutritionData((prev) => ({
            carbs: {
              current: nutrientResponse.data.carbohydrate || 0,
              target: prev.carbs.target,
            },
            protein: {
              current: nutrientResponse.data.protein || 0,
              target: prev.protein.target,
            },
            fat: {
              current: nutrientResponse.data.fat || 0,
              target: prev.fat.target,
            },
          }));
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        // 에러 세부 정보 표시
        if (axios.isAxiosError(error)) {
          console.error("상태 코드:", error.response?.status);
          console.error("에러 메시지:", error.response?.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 최종 혈당 데이터 (회원 정보의 목표치 포함)
  const combinedBloodSugarData = {
    ...bloodSugarData,
    targetFasting: memberData.targetFasting,
    targetPostprandial: memberData.targetPostprandial,
  };

  const fetchUserInfo = async () => {
    try {
      const userData = await authService.getUserInfo();
      setUserInfo(userData);
      setUserName(userData.name);

      // 영양 목표치만 설정하고 현재 섭취량은 API에서 가져옴
      if (userData.target) {
        setNutritionData((prev) => ({
          carbs: {
            current: prev.carbs.current,
            target: userData.target.carbohydrate || 77,
          },
          protein: {
            current: prev.protein.current,
            target: userData.target.protein || 136,
          },
          fat: {
            current: prev.fat.current,
            target: userData.target.fat || 40,
          },
        }));
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
    }
  };

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

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("accessToken", response.accessToken);
      setIsLoggedIn(true);
      await fetchUserInfo();
      handleCloseLoginModal();
      toast.success("로그인에 성공했습니다.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
      });
    } catch (error) {
      console.error("로그인 실패:", error);
      toast.error("로그인에 실패했습니다.", {
        duration: 3000,
        position: "top-center",
      });
    }
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

  const handleSubmitBloodSugar = (data: any) => {
    console.log("혈당 데이터 제출:", data);
    handleBloodSugarSubmit(data);
  };

  const handleSubmitMeal = (data: any) => {
    console.log("식사 데이터 제출:", data);
    handleMealSubmit(data);
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

  const handleBloodSugarSubmit = async (data: any) => {
    try {
      toast.success("혈당 기록이 완료되었습니다.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#4CAF50",
        },
      });
      handleCloseBloodSugarModal();
    } catch (error) {
      console.error("혈당 기록 실패:", error);
    }
  };

  const handleMealSubmit = async (data: any) => {
    try {
      toast.success("식사 기록이 완료되었습니다.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#4CAF50",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#4CAF50",
        },
      });
      handleCloseMealModal();
    } catch (error) {
      console.error("식사 기록 실패:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-0">
      <div className="w-full max-w-[500px] h-screen sm:h-[915px] relative bg-white overflow-hidden shadow-xl border border-gray-200">
        <div className="fixed top-0 left-0 right-0 max-w-[500px] mx-auto bg-white z-10">
          <Header
            userName={userName}
            onProfileClick={handleOpenLoginModal}
            profileImageUrl={userInfo?.profileImageUrl}
          />
        </div>
        <div className="h-full overflow-y-auto pt-[85px]">
          <div className="bg-white h-full">
            <div className="h-3 sm:h-4 md:h-5 bg-gray-100"></div>
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <BloodSugarSummary data={combinedBloodSugarData} />
                <BloodSugarHistory data={combinedBloodSugarData} />
              </>
            )}
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
        selectedDate={new Date()}
      />

      {/* 식사 입력 모달 */}
      <MealInputModal
        isOpen={isMealModalOpen}
        onClose={handleCloseMealModal}
        onSubmit={handleSubmitMeal}
        selectedDate={new Date()}
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
      />
    </div>
  );
}
