import axios from "axios";

// API 기본 설정
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 설정
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // 401 에러 발생 시 로그인 페이지로 리다이렉트 또는 토큰 재발급 로직 필요
    if (error.response && error.response.status === 401) {
      console.error("인증이 필요합니다. 로그인 페이지로 이동합니다.");
      // 로그인 페이지로 리다이렉트 로직
    }
    return Promise.reject(error);
  }
);

// API 함수들
export const apiService = {
  // 건강 분석 API 호출
  getHealthAnalysis: async () => {
    try {
      const response = await apiClient.get("/api/ai-analysis/v1");
      return response.data;
    } catch (error) {
      console.error("건강 분석 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  // 사용자 정보 가져오기
  getUserInfo: async () => {
    try {
      const response = await apiClient.get("/api/user/info");
      return response.data;
    } catch (error) {
      console.error("사용자 정보 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  // 혈당 데이터 가져오기
  getBloodSugarData: async (startDate, endDate) => {
    try {
      const response = await apiClient.get("/api/blood-sugar", {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("혈당 데이터 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  // 식사 데이터 가져오기
  getMealData: async (startDate, endDate) => {
    try {
      const response = await apiClient.get("/api/meals", {
        params: {
          startDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("식사 데이터 API 호출 중 오류 발생:", error);
      throw error;
    }
  },

  // 액세스 토큰 설정
  setAccessToken: (token) => {
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  },

  // 액세스 토큰 가져오기
  getAccessToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  },
};

export default apiService;
