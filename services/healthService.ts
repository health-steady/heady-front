import axios from "axios";

// API 엔드포인트 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// 헬스 데이터 분석 서비스
export const healthService = {
  // 건강 데이터 분석 요청
  analyzeHealthData: async (params: {
    userId: string;
    startDate: string;
    endDate: string;
    includeGlucose?: boolean;
    includeFood?: boolean;
    includeExercise?: boolean;
  }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/health/analyze`,
        params
      );
      return response.data;
    } catch (error) {
      console.error("건강 데이터 분석 API 요청 실패:", error);
      throw error;
    }
  },

  // 혈당 데이터 가져오기
  getGlucoseData: async (
    userId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/glucose`, {
        params: { userId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("혈당 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 음식 데이터 가져오기
  getFoodData: async (userId: string, startDate: string, endDate: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/food`, {
        params: { userId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("음식 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 영양소 섭취 데이터 가져오기
  getNutrientData: async (
    userId: string,
    startDate: string,
    endDate: string
  ) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/nutrients`, {
        params: { userId, startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("영양소 데이터 조회 실패:", error);
      throw error;
    }
  },

  // 사용자 정보 가져오기
  getUserInfo: async (userId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      throw error;
    }
  },

  // 분석 결과 저장하기
  saveAnalysisResult: async (userId: string, analysisData: any) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/analysis/save`, {
        userId,
        analysisData,
      });
      return response.data;
    } catch (error) {
      console.error("분석 결과 저장 실패:", error);
      throw error;
    }
  },

  // 이전 분석 결과 가져오기
  getPreviousAnalysis: async (userId: string, limit = 5) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analysis/history`, {
        params: { userId, limit },
      });
      return response.data;
    } catch (error) {
      console.error("분석 이력 조회 실패:", error);
      throw error;
    }
  },
};

export default healthService;
