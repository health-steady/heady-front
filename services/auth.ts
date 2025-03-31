import axios from "axios";
import api from "./api";

const API_URL = "http://localhost:8080/api";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  gender: string;
  phone?: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface Target {
  id: number;
  fastingBloodSugar: number;
  postprandialBloodSugar: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: number;
  target: Target;
  email: string;
  name: string;
  nickname: string;
  birthdate: string;
  height: number;
  weight: number;
  profileImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/auth/v1/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await api.post("/members/v1", data);
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>("/members/v1");
    return response.data;
  },
};
