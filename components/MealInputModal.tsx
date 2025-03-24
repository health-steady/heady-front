import React, { useState } from "react";

export interface MealInputData {
  mealTime: string;
  food: string;
  amount: string;
  unit: string;
  carbohydrate: number;
  protein: number;
  fat: number;
  calories: number;
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
  const [formData, setFormData] = useState<MealInputData>({
    mealTime: "",
    food: "",
    amount: "",
    unit: "g",
    carbohydrate: 0,
    protein: 0,
    fat: 0,
    calories: 0,
  });

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
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                음식 이름
              </label>
              <input
                type="text"
                name="food"
                value={formData.food}
                onChange={handleChange}
                placeholder="음식 이름을 입력해주세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                양
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="양을 입력해주세요"
                  className="w-2/3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-1/3 ml-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="g">g</option>
                  <option value="ml">ml</option>
                  <option value="개">개</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                영양 정보
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="carbohydrate"
                  value={formData.carbohydrate}
                  onChange={handleChange}
                  placeholder="탄수화물 (g)"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="protein"
                  value={formData.protein}
                  onChange={handleChange}
                  placeholder="단백질 (g)"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="fat"
                  value={formData.fat}
                  onChange={handleChange}
                  placeholder="지방 (g)"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="number"
                  name="calories"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="칼로리 (kcal)"
                  className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
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
