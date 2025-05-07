import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

export interface MealRequest {
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  mealDateTime: string;
  foodNames: string[];
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
    const response = await api.post<MealResponse>("/api/meals/v1", data);
    return response.data;
  },
};
