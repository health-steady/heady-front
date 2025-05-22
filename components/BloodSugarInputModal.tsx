import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { bloodSugarService, BloodSugarRequest } from "../services/bloodSugar";
import Swal from "sweetalert2";

interface BloodSugarInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedDate: Date;
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
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEDTIME" | "RANDOM" | "FASTING";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "NONE";
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

  // measureType이 변경될 때 mealType을 적절히 설정하는 효과
  useEffect(() => {
    if (["BEDTIME", "RANDOM", "FASTING"].includes(formData.measureType)) {
      setFormData((prev) => ({
        ...prev,
        mealType: "NONE",
      }));
    }
  }, [formData.measureType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 날짜와 시간 형식을 직접 구성
      const formattedDate = `${formData.date.year}-${formData.date.month}-${formData.date.day}`;
      const formattedTime = `${formData.time.hour}:${formData.time.minute}`;
      const measuredAt = `${formattedDate} ${formattedTime}`;

      const bloodSugarData: BloodSugarRequest = {
        measuredAt: measuredAt,
        measureType: formData.measureType,
        mealType: formData.mealType,
        level: parseInt(formData.level),
        memo: formData.memo,
      };

      const response = await bloodSugarService.record(bloodSugarData);

      onClose(); // 모달을 먼저 닫은 후 알림 표시

      Swal.fire({
        icon: "success",
        title: "성공",
        text: "혈당 기록이 성공적으로 저장되었습니다.",
        customClass: {
          container: "swal-container-class",
        },
        backdrop: `rgba(0,0,0,0.4)`,
        allowOutsideClick: false,
      });

      onSubmit(bloodSugarData);
    } catch (error: any) {
      console.error("혈당 기록 저장 실패:", error);

      onClose(); // 실패 시에도 모달을 먼저 닫기

      let errorMessage = "혈당 기록 저장에 실패했습니다.";

      // 응답 객체에서 에러 메시지 추출
      if (error.response) {
        if (error.response.status === 400) {
          // 응답 데이터 구조 확인
          if (error.response.data) {
            if (typeof error.response.data === "string") {
              // 문자열 형태로 오는 경우
              errorMessage = error.response.data;
            } else if (error.response.data.message) {
              // {message: "에러 메시지"} 형태
              errorMessage = error.response.data.message;
            } else if (error.response.data.error) {
              // {error: "에러 메시지"} 형태
              errorMessage = error.response.data.error;
            } else if (
              error.response.data.errors &&
              error.response.data.errors.length > 0
            ) {
              // {errors: ["에러 메시지1", "에러 메시지2"]} 형태
              errorMessage = error.response.data.errors.join(", ");
            }
          }
        } else if (error.response.status === 401) {
          errorMessage = "인증이 필요합니다.";
        } else if (error.response.status === 403) {
          errorMessage = "접근 권한이 없습니다.";
        } else if (error.response.status === 404) {
          errorMessage = "요청한 리소스를 찾을 수 없습니다.";
        } else if (error.response.status === 500) {
          errorMessage = "서버 오류가 발생했습니다. 나중에 다시 시도해주세요.";
        }
      } else if (error.message) {
        // axios나 자바스크립트 에러의 message 속성
        errorMessage = error.message;
      }

      Swal.fire({
        icon: "error",
        title: "오류",
        text: errorMessage,
        customClass: {
          container: "swal-container-class",
        },
        backdrop: `rgba(0,0,0,0.4)`,
        allowOutsideClick: false,
      });
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
                <option value="BEDTIME">취침 전</option>
                <option value="FASTING">공복</option>
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
