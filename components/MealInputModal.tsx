import React, { useState, useEffect } from "react";

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
}

interface MealInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MealInputData) => void;
}

export default function MealInputModal({
  isOpen,
  onClose,
  onSubmit,
}: MealInputModalProps) {
  // 현재 시간을 기본값으로 설정
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 0-based이므로 +1
  const currentDay = now.getDate();
  const currentHour = now.getHours() % 12 || 12; // 12시간제로 변환
  const currentMinute = Math.floor(now.getMinutes() / 5) * 5; // 5분 단위로 내림
  const currentPeriod = now.getHours() >= 12 ? "오후" : "오전";

  const [formData, setFormData] = useState<MealInputData>({
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
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(true);

  useEffect(() => {
    // 모달이 열릴 때마다 현재 시간으로 초기화
    if (isOpen) {
      const refreshNow = new Date();
      const refreshHour = refreshNow.getHours() % 12 || 12;
      const refreshMinute = Math.floor(refreshNow.getMinutes() / 5) * 5;
      const refreshPeriod = refreshNow.getHours() >= 12 ? "오후" : "오전";

      setFormData({
        ...formData,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateTimeChange = (
    section: "date" | "time",
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
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
    setFormData((prev) => ({
      ...prev,
      food: searchTerm,
    }));
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
                value={formData.mealTime}
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
                  value={formData.date.year}
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
                  value={formData.date.month}
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
                  value={formData.date.day}
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
                  value={formData.time.period}
                  onChange={(e) =>
                    handleDateTimeChange("time", "period", e.target.value)
                  }
                >
                  <option value="오전">오전</option>
                  <option value="오후">오후</option>
                </select>
                <select
                  className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                  value={formData.time.hour}
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
                  value={formData.time.minute}
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
                <input
                  type="text"
                  name="food"
                  value={formData.food}
                  onChange={handleChange}
                  placeholder="드신 음식을 직접 입력해주세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              )}
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
