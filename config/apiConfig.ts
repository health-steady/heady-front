// API 기본 설정

// 개발 환경에서는 로컬 API를, 프로덕션 환경에서는 환경 변수의 API URL을 사용
const getApiBaseUrl = () => {
  // 배포 환경에서는 Netlify 환경 변수에서 가져옴
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // 개발 환경에서는 기본값 사용
  return "http://localhost:8080/api";
};

export const API_BASE_URL = getApiBaseUrl();

// API 엔드포인트
export const API_ENDPOINTS = {
  // 인증 관련
  LOGIN: "/auth/v1/login",
  REGISTER: "/auth/v1/register",

  // 사용자 정보
  USER_INFO: "/members/v1",

  // 혈당 관련
  BLOOD_SUGAR_SUMMARY: "/bloodSugars/v1/summary",
  BLOOD_SUGAR_RECORD: "/bloodSugars/v1/record",

  // 식사 관련
  NUTRIENTS_SUMMARY: "/meals/v1/nutrients/summary",
  FOOD_SEARCH: "/meals/v1/foods/search",
  MEAL_RECORD: "/meals/v1/record",
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
};
