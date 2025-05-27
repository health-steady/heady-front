import api from "./api";
import { API_ENDPOINTS, API_BASE_URL } from "../config/apiConfig";

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

// 카카오 OAuth 관련 타입 정의
export enum SocialProvider {
  KAKAO = "KAKAO",
  GOOGLE = "GOOGLE",
  NAVER = "NAVER",
}

export enum Authority {
  MEMBER = "MEMBER",
  ADMIN = "ADMIN",
}

export interface OauthLoginRequest {
  code: string;
  socialProvider: SocialProvider;
  authority: Authority;
}

export interface OauthLoginResponse {
  accessToken: string;
  authority: Authority;
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

  // 카카오 OAuth 로그인
  kakaoLogin: async (): Promise<void> => {
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error("카카오 로그인 설정이 올바르지 않습니다.");
    }

    // 카카오 인증 URL로 리다이렉트
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code`;

    if (typeof window !== "undefined") {
      window.location.href = kakaoAuthUrl;
    }
  },

  // Google OAuth 로그인
  googleLogin: async (): Promise<void> => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      throw new Error("Google 로그인 설정이 올바르지 않습니다.");
    }

    // Google OAuth 인증 URL 생성 (올바른 엔드포인트 사용)
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=email profile`;

    if (typeof window !== "undefined") {
      window.location.href = googleAuthUrl;
    }
  },

  // 카카오 인가 코드로 백엔드 OAuth 로그인
  oauthLogin: async (
    code: string,
    socialProvider: SocialProvider = SocialProvider.KAKAO,
    authority: Authority = Authority.MEMBER
  ): Promise<string> => {
    try {
      const requestData: OauthLoginRequest = {
        code,
        socialProvider,
        authority,
      };

      const response = await api.post(API_ENDPOINTS.OAUTH_LOGIN, requestData);
      const { accessToken } = response.data as OauthLoginResponse;

      // 로컬 스토리지에 토큰 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
      }

      return accessToken;
    } catch (error) {
      console.error("OAuth 로그인 실패:", error);
      throw error;
    }
  },

  // URL에서 카카오 인가 코드 추출 및 로그인 처리
  handleKakaoCallback: async (): Promise<string> => {
    if (typeof window === "undefined") {
      throw new Error("브라우저 환경에서만 실행 가능합니다.");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      throw new Error(`카카오 로그인 오류: ${error}`);
    }

    if (!code) {
      throw new Error("인가 코드를 찾을 수 없습니다.");
    }

    // 인가 코드로 백엔드 OAuth 로그인 수행
    return await authService.oauthLogin(
      code,
      SocialProvider.KAKAO,
      Authority.MEMBER
    );
  },

  // URL에서 Google 인가 코드 추출 및 로그인 처리
  handleGoogleCallback: async (): Promise<string> => {
    if (typeof window === "undefined") {
      throw new Error("브라우저 환경에서만 실행 가능합니다.");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      throw new Error(`Google 로그인 오류: ${error}`);
    }

    if (!code) {
      throw new Error("인가 코드를 찾을 수 없습니다.");
    }

    // 인가 코드로 백엔드 OAuth 로그인 수행
    return await authService.oauthLogin(
      code,
      SocialProvider.GOOGLE,
      Authority.MEMBER
    );
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
      const response = await api.patch(API_ENDPOINTS.USER_INFO, userData);
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
