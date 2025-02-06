import React, { createContext, useContext, useState, useEffect } from "react";
// import api from "../utils/api";
import axios from "axios";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/users/me`,
        {
          withCredentials: true,
        }
      );
      // const response = await api.get("/api/v1/users/me");
      console.log("User info response:", response.data);
      setUser(response.data);
    } catch (error) {
      // console.error("Failed to fetch user:", error);
      setUser(null); // 에러 시 비로그인 상태로 설정
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []); // 앱 로드 시 한 번 호출

  return (
    <SessionContext.Provider value={{ user, setUser, loading, fetchUser }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
