import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 알림 표시
      toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.", {
        duration: 3000,
        position: "top-center",
        style: {
          background: "#f44336",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#f44336",
        },
      });

      // 로컬 스토리지에서 토큰 제거
      localStorage.removeItem("accessToken");

      // 현재 페이지가 로그인 페이지가 아닐 경우에만 리다이렉트
      if (!window.location.pathname.includes("/login")) {
        // 3초 후에 로그인 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
