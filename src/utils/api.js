import axios from "axios";
import { getCookie } from "./cookie";

// 기본 API URL 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log("API_BASE_URL:", API_BASE_URL); // 환경 변수가 올바르게 설정되었는지 확인

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (선택)
api.interceptors.request.use(
  (config) => {
    // 요청 전 처리 (예: 토큰 추가)
    const token = getCookie("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 401 에러 처리 함수
const handle401Error = () => {
  console.error("로그인이 필요합니다.");
  // 로그인 페이지로 리디렉션 또는 특정 메시지 표시
  // window.location.href = "/login"; // 예: 로그인 페이지로 리디렉션
};

// 응답 인터셉터 (선택)
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        if (error.config.url !== "/api/v1/users/me") {
          handle401Error();
        }
      } else if (error.response.status === 409) {
        // 409 에러는 콘솔에 출력하지 않음
        return Promise.reject(error);
      } else {
        // 다른 에러는 콘솔에 출력
        console.error("API 에러:", error.response);
      }
    } else {
      console.error("API 에러:", error);
    }
    // 공통 에러 처리
    return Promise.reject(error);
  }
);

export default api;
