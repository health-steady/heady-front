import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

// 음식 정보를 위한 인터페이스 추가
export interface FoodInfo {
  code: string | null;
  name: string;
}

export interface MealRequest {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  mealDateTime: string;
  // foods 배열만 사용
  foods: FoodInfo[];
  memo: string;
}

export interface MealResponse {
  id: number;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  mealDateTime: string;
  foodNames: string[];
  memo: string;
}

export const mealService = {
  createMeal: async (data: MealRequest) => {
    const response = await api.post<MealResponse>(
      API_ENDPOINTS.MEAL_RECORD,
      data
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(`${API_ENDPOINTS.MEAL_RECORD}/${id}`);
    return response.data;
  },
};
