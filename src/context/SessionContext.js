import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";
import { setCookie, deleteCookie, getCookie } from "../utils/cookie";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/users/me");
      setUser(response);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null); // 에러 시 비로그인 상태로 설정
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      const { token, user } = response;
      setCookie("jwt", token, 1); // JWT를 쿠키에 저장 (7일 동안 유효)
      setUser(user);
      await fetchUser(); // 사용자 정보 갱신
    } catch (error) {
      console.error("Failed to login:", error);
      throw error;
    }
  };

  const logout = () => {
    deleteCookie("jwt");
    setUser(null);
  };

  useEffect(() => {
    const token = getCookie("jwt");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []); // 앱 로드 시 한 번 호출

  return (
    <SessionContext.Provider
      value={{ user, setUser, loading, fetchUser, login, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
