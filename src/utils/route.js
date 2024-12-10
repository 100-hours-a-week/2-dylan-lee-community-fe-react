// 인증 여부에 따라 페이지 이동 제어
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const HomeRedirect = () => {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/posts");
      } else {
        navigate("/login");
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  return null;
};

const GuestRoute = ({ children }) => {
  const { user, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  return children;
};

export { HomeRedirect, GuestRoute };
