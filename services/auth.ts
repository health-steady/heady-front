import api from "./api";
import { API_ENDPOINTS } from "../config/apiConfig";

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  nickname: string | null;
  gender: string | null;
  birthdate: string | null;
  height: number | null;
  weight: number | null;
  profileImageUrl: string | null;
  target: {
    fastingBloodSugar: number;
    postprandialBloodSugar: number;
    carbohydrate: number;
    protein: number;
    fat: number;
    calories: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Target {
  fastingBloodSugar: number;
  postprandialBloodSugar: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  calories: number;
}

export const authService = {
  login: async (email: string, password: string): Promise<string> => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { accessToken } = response.data;

      // 로컬 스토리지에 토큰 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      return accessToken;
    } catch (error) {
      console.error("로그인 실패:", error);
      throw error;
    }
  },

  register: async (userData: {
    email: string;
    password: string;
    name: string;
    birthdate?: string;
    height?: number;
    weight?: number;
  }): Promise<string> => {
    try {
      console.log("회원가입 요청 데이터:", userData);
      console.log("요청 URL:", API_ENDPOINTS.REGISTER);

      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      const { accessToken } = response.data;

      // 로컬 스토리지에 토큰 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      return accessToken;
    } catch (error: any) {
      console.error("회원가입 실패:", error);
      console.error("상태 코드:", error.response?.status);
      console.error("에러 메시지:", error.response?.data);
      console.error("에러 상세:", error.message);
      throw error;
    }
  },

  getUserInfo: async (): Promise<UserInfo> => {
    try {
      const response = await api.get(API_ENDPOINTS.USER_INFO);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 가져오기 실패:", error);
      throw error;
    }
  },

  updateUserInfo: async (userData: Record<string, any>): Promise<UserInfo> => {
    try {
      const response = await api.patch(
        "http://localhost:8080/api/members/v1",
        userData
      );
      return response.data;
    } catch (error) {
      console.error("사용자 정보 업데이트 실패:", error);
      throw error;
    }
  },

  logout: (): void => {
    // 로컬 스토리지에서 토큰 제거
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
  },

  isLoggedIn: (): boolean => {
    // 브라우저 환경에서만 실행
    if (typeof window !== "undefined") {
      return !!localStorage.getItem("accessToken");
    }
    return false;
  },
};

export default authService;
