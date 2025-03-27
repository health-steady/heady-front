import React, { useState, useEffect } from "react";
import { mealService } from "../services/meal";
import toast from "react-hot-toast";

export interface MealInputData {
  mealTime: string;
  food: string;
  date: {
    year: string;
    month: string;
    day: string;
  };
  time: {
    hour: string;
    minute: string;
    period: string;
  };
  memo: string;
}

interface MealInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDate: Date;
}

export default function MealInputModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}: MealInputModalProps) {
  // 현재 시간을 기본값으로 설정
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based이므로 +1
  const currentDay = now.getDate();
  const currentHour = now.getHours() % 12 || 12; // 12시간제로 변환
  const currentMinute = Math.floor(now.getMinutes() / 5) * 5; // 5분 단위로 내림
  const currentPeriod = now.getHours() >= 12 ? "오후" : "오전";

  const [mealData, setMealData] = useState<MealInputData>({
    mealTime: "",
    food: "",
    date: {
      year: `${currentYear}년`,
      month: `${currentMonth}월`,
      day: `${currentDay}일`,
    },
    time: {
      hour: `${currentHour}시`,
      minute: `${currentMinute.toString().padStart(2, "0")}분`,
      period: currentPeriod,
    },
    memo: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [foodList, setFoodList] = useState<string[]>([]);
  const [memo, setMemo] = useState("");

  useEffect(() => {
    // 모달이 열릴 때마다 초기화
    if (isOpen) {
      setFoodList([]);
      setMemo("");
      // 모달이 열릴 때마다 현재 시간으로 초기화
      const refreshNow = new Date();
      const refreshHour = refreshNow.getHours() % 12 || 12;
      const refreshMinute = Math.floor(refreshNow.getMinutes() / 5) * 5;
      const refreshPeriod = refreshNow.getHours() >= 12 ? "오후" : "오전";

      setMealData({
        ...mealData,
        date: {
          year: `${refreshNow.getFullYear()}년`,
          month: `${refreshNow.getMonth() + 1}월`,
          day: `${refreshNow.getDate()}일`,
        },
        time: {
          hour: `${refreshHour}시`,
          minute: `${refreshMinute.toString().padStart(2, "0")}분`,
          period: refreshPeriod,
        },
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (foodList.length === 0) {
      toast.error("최소 하나의 음식을 입력해주세요.");
      return;
    }

    try {
      // 시간 데이터 포맷팅
      const timeString = `${
        mealData.time.period === "오후"
          ? (parseInt(mealData.time.hour) + 12).toString()
          : mealData.time.hour.replace("시", "")
      }:${mealData.time.minute.replace("분", "")}`;

      // 날짜 데이터 포맷팅
      const year = parseInt(mealData.date.year);
      const month = parseInt(mealData.date.month);
      const day = parseInt(mealData.date.day);
      const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      // 식사 시간 매핑
      const mealTypeMap: { [key: string]: string } = {
        아침: "BREAKFAST",
        점심: "LUNCH",
        저녁: "DINNER",
        간식: "SNACK",
      };

      const response = await mealService.createMeal({
        mealType: mealTypeMap[mealData.mealTime] as
          | "BREAKFAST"
          | "LUNCH"
          | "DINNER"
          | "SNACK",
        mealDateTime: `${formattedDate} ${timeString}`,
        foodNames: foodList,
        memo: memo,
      });

      // 성공 알림 표시
      toast.success("식사 기록이 완료되었습니다!", {
        duration: 2000,
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

      onClose();
      onSubmit(response);
    } catch (error: any) {
      console.error("식사 기록 저장 실패:", error);

      // 401 에러가 아닌 경우에만 실패 알림 표시
      if (error.response?.status !== 401) {
        toast.error("식사 기록에 실패했습니다. 다시 시도해주세요.", {
          duration: 3000,
          position: "top-center",
          style: {
            background: "#f44336",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#f44336",
          },
        });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setMealData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (
    section: "date" | "time",
    field: string,
    value: string
  ) => {
    setMealData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleFoodSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 검색 로직은 여기에 구현
    console.log("검색어:", searchTerm);
    // 검색 결과를 food에 설정하는 예시
    setMealData((prev) => ({
      ...prev,
      food: searchTerm,
    }));
  };

  const handleAddFood = () => {
    if (mealData.food.trim()) {
      setFoodList([...foodList, mealData.food.trim()]);
      setMealData((prev) => ({ ...prev, food: "" }));
    }
  };

  const handleRemoveFood = (index: number) => {
    setFoodList(foodList.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 className="font-bold text-2xl mb-6">식사 기록하기</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                식사 시간
              </label>
              <select
                name="mealTime"
                value={mealData.mealTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">선택해주세요</option>
                <option value="아침">아침</option>
                <option value="점심">점심</option>
                <option value="저녁">저녁</option>
                <option value="간식">간식</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.year}
                  onChange={(e) =>
                    handleDateTimeChange("date", "year", e.target.value)
                  }
                >
                  <option value={`${currentYear}년`}>{currentYear}년</option>
                  <option value={`${currentYear - 1}년`}>
                    {currentYear - 1}년
                  </option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.month}
                  onChange={(e) =>
                    handleDateTimeChange("date", "month", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={`${month}월`}>
                      {month}월
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.date.day}
                  onChange={(e) =>
                    handleDateTimeChange("date", "day", e.target.value)
                  }
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={`${day}일`}>
                      {day}일
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <div className="flex space-x-2">
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.period}
                  onChange={(e) =>
                    handleDateTimeChange("time", "period", e.target.value)
                  }
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.hour}
                  onChange={(e) =>
                    handleDateTimeChange("time", "hour", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                    <option key={hour} value={`${hour}시`}>
                      {hour}시
                    </option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={mealData.time.minute}
                  onChange={(e) =>
                    handleDateTimeChange("time", "minute", e.target.value)
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <option
                      key={minute}
                      value={`${minute.toString().padStart(2, "0")}분`}
                    >
                      {minute.toString().padStart(2, "0")}분
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  음식 {isSearchMode ? "검색" : "직접 입력"}
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-500"
                  onClick={() => setIsSearchMode(!isSearchMode)}
                >
                  {isSearchMode ? "직접 입력" : "검색으로 돌아가기"}
                </button>
              </div>

              {isSearchMode ? (
                <div className="space-y-2">
                  <div className="flex">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="음식명을 입력하세요"
                      className="flex-grow border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                      type="button"
                      onClick={handleFoodSearch}
                      className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-4 hover:bg-gray-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    * 검색 결과는 바로 아래에 표시됩니다
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="food"
                      value={mealData.food}
                      onChange={handleChange}
                      placeholder="드신 음식을 직접 입력해주세요"
                      className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required={foodList.length === 0}
                    />
                    <button
                      type="button"
                      onClick={handleAddFood}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      추가
                    </button>
                  </div>

                  {foodList.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-700">
                        추가된 음식
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {foodList.map((food, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg"
                          >
                            <span>{food}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFood(index)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="메모를 입력해주세요 (선택사항)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                기록하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
