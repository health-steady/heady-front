import api from "./api";

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
}

export const bloodSugarService = {
  record: async (data: BloodSugarRequest) => {
    const response = await api.post<BloodSugarResponse>(
      "/bloodSugars/v1",
      data
    );
    return response.data;
  },

  getAllByDate: async (date: string) => {
    const response = await api.get<BloodSugarResponse[]>("/bloodSugars/v1", {
      params: { date },
    });
    return response.data;
  },
};
