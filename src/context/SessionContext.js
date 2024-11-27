import React, { createContext, useContext, useState, useEffect } from "react";

const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/v1/users/me", {
          method: "GET",
          credentials: "include", // 세션 쿠키 포함
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // 전역 상태에 사용자 정보 저장
        } else {
          setUser(null); // 비로그인 상태로 설정
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null); // 에러 시 비로그인 상태로 설정
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // 앱 로드 시 한 번 호출

  return (
    <SessionContext.Provider value={{ user, setUser, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);
