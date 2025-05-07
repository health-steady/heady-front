import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

export interface FoodDto {
  code: string;
  name: string;
  manufacturerName: string;
}

export interface FoodSearchParams {
  keyword: string;
  pageNo?: number;
  pageSize?: number;
}

export const foodService = {
  searchFoods: async (params: FoodSearchParams) => {
    const { keyword, pageNo = 1, pageSize = 10 } = params;
    const response = await api.get(API_ENDPOINTS.FOOD_SEARCH, {
      params: {
        keyword,
        pageNo,
        pageSize,
      },
    });
    return response.data;
  },
};
