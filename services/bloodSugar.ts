import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

export interface BloodSugarRequest {
  measuredAt: string;
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEDTIME" | "RANDOM" | "FASTING";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "NONE";
  level: number;
  memo: string;
}

export interface BloodSugarResponse {
  id: number;
  measuredAt: string;
  measureType: "BEFORE_MEAL" | "AFTER_MEAL" | "BEDTIME" | "RANDOM" | "FASTING";
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "NONE";
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
      API_ENDPOINTS.BLOOD_SUGAR_RECORD,
      data
    );
    return response.data;
  },

  getAllByDate: async (date: string) => {
    const response = await api.get<BloodSugarResponse[]>(
      API_ENDPOINTS.BLOOD_SUGAR_RECORD,
      {
        params: { date },
      }
    );
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete(
      `${API_ENDPOINTS.BLOOD_SUGAR_RECORD}/${id}`
    );
    return response.data;
  },
};
