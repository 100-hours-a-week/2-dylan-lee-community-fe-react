// // 인증 여부에 따라 페이지 이동 제어
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useSession } from "../context/SessionContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSession();

//   if (loading) return <div>로딩 중...</div>; // 로딩 상태 처리
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, loading } = useSession();

//   if (loading) return <div>로딩 중...</div>; // 로딩 상태 처리
//   return !isAuthenticated ? children : <Navigate to="/posts" replace />;
// };

// export { ProtectedRoute, PublicRoute };
