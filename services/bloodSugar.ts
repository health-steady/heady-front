import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

export interface BloodSugarRequest {
  measuredAt: string;
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEFORE_SLEEP" | "RANDOM";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  level: number;
  memo: string;
}

export interface BloodSugarResponse {
  id: number;
  measuredAt: string;
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEFORE_SLEEP" | "RANDOM";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
  level: number;
  memo: string;
  meal?: {
    id: number;
    mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK";
    mealDateTime: string;
    memo: string;
    foods: {
      id: number;
      name: string;
      calories: number;
    }[];
  } | null;
}

export const bloodSugarService = {
  record: async (data: BloodSugarRequest) => {
    const response = await api.post<BloodSugarResponse>(
      "/api/bloodSugars/v1",
      data
    );
    return response.data;
  },

  getAllByDate: async (date: string) => {
    const response = await api.get<BloodSugarResponse[]>(
      "/api/bloodSugars/v1",
      {
        params: { date },
      }
    );
    return response.data;
  },
};
