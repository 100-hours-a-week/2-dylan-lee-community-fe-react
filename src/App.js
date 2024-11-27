import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import "./styles/Common.css";

// 페이지 컴포넌트를 동적으로 import
const routes = [
  {
    path: "/",
    component: lazy(() => import("./pages/Login")),
  },
  {
    path: "/login",
    component: lazy(() => import("./pages/Login")),
  },
  {
    path: "/signup",
    component: lazy(() => import("./pages/Signup")),
  },
  {
    path: "/posts",
    component: lazy(() => import("./pages/Posts")),
  },
  {
    path: "/post/:postId",
    component: lazy(() => import("./pages/Post")),
  },
  {
    path: "/edit_post/:postId",
    component: lazy(() => import("./pages/EditPost")),
  },
  {
    path: "/edit_profile",
    component: lazy(() => import("./pages/EditProfile")),
  },
  {
    path: "/edit_password",
    component: lazy(() => import("./pages/EditPassword")),
  },
  {
    path: "/make_post",
    component: lazy(() => import("./pages/MakePost")),
  },
  {
    path: "*",
    component: () => (
      <div>
        <h1>404 - 페이지를 찾을 수 없습니다</h1>
        <button onClick={() => (window.location.href = "/")}>
          홈으로 이동
        </button>
      </div>
    ),
  },
];

const App = () => {
  return (
    <Router>
      <Header />
      <Suspense fallback={<div className="loading-spinner">로딩 중...</div>}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
