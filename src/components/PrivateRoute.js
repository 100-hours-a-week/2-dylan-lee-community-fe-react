import React from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { showToast_ } from "./Toast";

const PrivateRoute = ({ element: Component }) => {
  const { user, loading } = useSession();

  if (loading) {
    showToast_("로딩 중입니다. 잠시만 기다려주세요.");
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  return user ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
