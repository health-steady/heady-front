// API 기본 설정

// 개발 환경에서는 로컬 API를, 프로덕션 환경에서는 환경 변수의 API URL을 사용
const getApiBaseUrl = () => {
  // 배포 환경에서는 환경 변수에서 가져옴
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // 개발 환경에서는 기본값 사용
  return "http://localhost:8080";
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: "/api/auth/v1/login",
  REGISTER: "/api/members/v1",

  // 사용자 정보
  USER_INFO: "/api/members/v1",

  // 혈당 관련
  BLOOD_SUGAR_SUMMARY: "/api/blood-sugars/v1/summary",
  BLOOD_SUGAR_RECORD: "/api/blood-sugars/v1",

  // 식사 관련
  NUTRIENTS_SUMMARY: "/api/meals/v1/nutrients/summary",
  FOOD_SEARCH: "/api/foods/v1/search",
  MEAL_RECORD: "/api/meals/v1",
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
