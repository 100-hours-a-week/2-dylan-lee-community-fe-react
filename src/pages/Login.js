import React from "react";
import LoginForm from "../components/LoginForm";
import useToast from "../components/useToast";

const Login = () => {
  const { showToast } = useToast();

  const handleLoginFailure = () => {
    showToast("이메일 또는 비밀번호를 확인하세요.");
  };

  return (
    <div className="default-container">
      <div className="auth-container">
        <LoginForm onFailure={handleLoginFailure} />
      </div>
    </div>
  );
};

export default Login;
