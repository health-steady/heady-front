import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { bloodSugarService } from "../services/bloodSugar";
import toast from "react-hot-toast";

interface BloodSugarInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDate: Date;
}

interface BloodSugarData {
  measuredAt: string;
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEFORE_SLEEP" | "RANDOM";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  level: number;
  memo: string;
}

interface BloodSugarInputData {
  date: {
    year: string;
    month: string;
    day: string;
  };
  time: {
    hour: string;
    minute: string;
    period: "오전" | "오후";
  };
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEFORE_SLEEP" | "RANDOM";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  level: string;
  memo: string;
}

const BloodSugarInputModal: React.FC<BloodSugarInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState<BloodSugarInputData>({
    date: {
      year: new Date().getFullYear().toString(),
      month: (new Date().getMonth() + 1).toString().padStart(2, "0"),
      day: new Date().getDate().toString().padStart(2, "0"),
    },
    time: {
      hour: new Date().getHours().toString().padStart(2, "0"),
      minute: new Date().getMinutes().toString().padStart(2, "0"),
      period: new Date().getHours() >= 12 ? "오후" : "오전",
    },
    measureType: "BEFORE_MEAL",
    mealType: "BREAKFAST",
    level: "",
    memo: "",
  });

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: {
          year: selectedDate.getFullYear().toString(),
          month: (selectedDate.getMonth() + 1).toString().padStart(2, "0"),
          day: selectedDate.getDate().toString().padStart(2, "0"),
        },
      }));
    }
  }, [selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 날짜와 시간 형식을 직접 구성
      const formattedDate = `${formData.date.year}-${formData.date.month}-${formData.date.day}`;
      const formattedTime = `${formData.time.hour}:${formData.time.minute}`;
      const measuredAt = `${formattedDate} ${formattedTime}`;

      const bloodSugarData: BloodSugarData = {
        measuredAt: measuredAt,
        measureType: formData.measureType as
          | "BEFORE_MEAL"
          | "AFTER_MEAL"
          | "BEFORE_SLEEP"
          | "RANDOM",
        mealType: formData.mealType as
          | "BREAKFAST"
          | "LUNCH"
          | "DINNER"
          | "SNACK",
        level: parseInt(formData.level),
        memo: formData.memo,
      };

      await bloodSugarService.record(bloodSugarData);

      onSubmit(bloodSugarData);
      onClose();
    } catch (error: any) {
      console.error("혈당 기록 저장 실패:", error);

      // 401 에러가 아닌 경우에만 실패 알림 표시
      if (error.response?.status !== 401) {
        toast.error("혈당 기록에 실패했습니다. 다시 시도해주세요.", {
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
          <h2 className="font-bold text-2xl mb-6">혈당 기록하기</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                측정 시점
              </label>
              <select
                name="measureType"
                value={formData.measureType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="BEFORE_MEAL">식사 전</option>
                <option value="AFTER_MEAL">식사 후</option>
                <option value="BEFORE_SLEEP">취침 전</option>
                <option value="RANDOM">임의</option>
              </select>
            </div>

            {(formData.measureType === "BEFORE_MEAL" ||
              formData.measureType === "AFTER_MEAL") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  식사 시간
                </label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                >
                  <option value="BREAKFAST">아침</option>
                  <option value="LUNCH">점심</option>
                  <option value="DINNER">저녁</option>
                  <option value="SNACK">간식</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                날짜
              </label>
              <input
                type="date"
                value={
                  formData.date.year +
                  "-" +
                  formData.date.month +
                  "-" +
                  formData.date.day
                }
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    date: {
                      year: e.target.value.split("-")[0],
                      month: e.target.value.split("-")[1],
                      day: e.target.value.split("-")[2],
                    },
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <input
                type="time"
                value={formData.time.hour + ":" + formData.time.minute}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    time: {
                      hour: e.target.value.split(":")[0],
                      minute: e.target.value.split(":")[1],
                      period: prev.time.period,
                    },
                  }))
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                혈당 수치
              </label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                placeholder="혈당 수치를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                min="0"
                max="1000"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <input
                type="text"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                placeholder="메모를 입력해주세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
};

export default BloodSugarInputModal;
