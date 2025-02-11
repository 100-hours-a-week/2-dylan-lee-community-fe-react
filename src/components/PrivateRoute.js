import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { showToast_ } from "./Toast";

const PrivateRoute = ({ element: Component }) => {
  const { user, loading } = useSession();
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      showToast_("로그인이 필요합니다.");
      setRedirect(true);
    }
  }, [loading, user]);

  if (loading) {
    return <div>로딩 중...</div>; // 로딩 중일 때 표시할 컴포넌트
  }

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};

export default PrivateRoute;
