import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface BloodSugarInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BloodSugarInputData) => void;
}

export interface BloodSugarInputData {
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
  mealTime: string;
  food: string;
  bloodSugar: string;
}

const BloodSugarInputModal: React.FC<BloodSugarInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BloodSugarInputData>({
    date: {
      year: "2025년",
      month: "1월",
      day: "30일",
    },
    time: {
      hour: "1시",
      minute: "00분",
      period: "오전",
    },
    mealTime: "",
    food: "",
    bloodSugar: "",
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    section: keyof BloodSugarInputData,
    field: string,
    value: string
  ) => {
    if (section === "date" || section === "time") {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: value,
      });
    }
  };

  if (!isOpen || !isMounted) return null;

  console.log("모달이 열렸습니다:", isOpen);

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold">혈당 입력하기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* 날짜 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 선택
            </label>
            <div className="flex space-x-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                value={formData.date.year}
                onChange={(e) => handleChange("date", "year", e.target.value)}
              >
                <option value="2025년">2025년</option>
                <option value="2024년">2024년</option>
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                value={formData.date.month}
                onChange={(e) => handleChange("date", "month", e.target.value)}
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
                onChange={(e) => handleChange("date", "day", e.target.value)}
              >
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={`${day}일`}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 시간 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간 선택
            </label>
            <div className="flex space-x-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                value={formData.time.period}
                onChange={(e) => handleChange("time", "period", e.target.value)}
              >
                <option value="오전">오전</option>
                <option value="오후">오후</option>
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 flex-1"
                value={formData.time.hour}
                onChange={(e) => handleChange("time", "hour", e.target.value)}
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
                onChange={(e) => handleChange("time", "minute", e.target.value)}
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

          {/* 시간대 선택 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간대 선택
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="아침 식전"
                  checked={formData.mealTime === "아침 식전"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                아침 식전
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="아침 식후"
                  checked={formData.mealTime === "아침 식후"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                아침 식후
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="점심 식전"
                  checked={formData.mealTime === "점심 식전"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                점심 식전
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="점심 식후"
                  checked={formData.mealTime === "점심 식후"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                점심 식후
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="저녁 식전"
                  checked={formData.mealTime === "저녁 식전"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                저녁 식전
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="저녁 식후"
                  checked={formData.mealTime === "저녁 식후"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                저녁 식후
              </label>
              <label className="flex items-center border border-gray-300 rounded-md p-3">
                <input
                  type="radio"
                  name="mealTime"
                  value="취침 전"
                  checked={formData.mealTime === "취침 전"}
                  onChange={(e) => handleChange("mealTime", "", e.target.value)}
                  className="mr-2"
                />
                취침 전
              </label>
            </div>
          </div>

          {/* 음식 검색 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              음식 검색
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="음식명을 입력하세요"
                value={formData.food}
                onChange={(e) => handleChange("food", "", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
          </div>

          {/* 혈당 수치 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              혈당 수치
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="혈당 수치 입력"
                value={formData.bloodSugar}
                onChange={(e) => handleChange("bloodSugar", "", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-16"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                mg/dL
              </span>
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // React Portal을 사용하여 모달을 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default BloodSugarInputModal;
