import React, { useState } from "react";
import "../styles/AuthForm.css";
import Button from "./Buttons";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const LoginForm = ({ onFailure }) => {
  const navigate = useNavigate();
  const { setUser, fetchUser } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailHelper, setEmailHelper] = useState("");
  const [passwordHelper, setPasswordHelper] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const validateEmail = (value) => {
    if (!value || !emailRegex.test(value)) {
      setEmailHelper("올바른 이메일 주소 형식을 입력해주세요.");
      return false;
    }
    setEmailHelper("");
    return true;
  };

  const validatePassword = (value) => {
    if (!value) {
      setPasswordHelper("비밀번호를 입력해주세요.");
      return false;
    }
    if (!passwordRegex.test(value)) {
      setPasswordHelper("비밀번호의 형식이 올바르지 않습니다.");
      return false;
    }
    setPasswordHelper("");
    return true;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value); // 실시간 유효성 검사
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value); // 실시간 유효성 검사
  };

  const handleValidation = () => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        // 서버에 로그인 요청
        const data = await fetch("/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        if (!data.ok) {
          throw new Error("로그아웃 실패");
        }
        // 세션 정보 업데이트
        const userData = await data.json();
        console.log("로그인 성공:", userData);
        await fetchUser();
        navigate("/");
      } catch (error) {
        onFailure();
        console.error("로그인 실패:", error.message);
      }
    }
  };

  return (
    <form className="auth-form login-form" onSubmit={handleSubmit}>
      <div className="title">로그인</div>
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={handleEmailChange}
        />
        <div
          className={`helper-text ${emailHelper ? "show" : ""}`}
          id="email-message"
        >
          {emailHelper}
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={handlePasswordChange}
        />
        <div
          className={`helper-text ${passwordHelper ? "show" : ""}`}
          id="password-message"
        >
          {passwordHelper}
        </div>
      </div>
      <div className="button-group">
        <Button
          type="submit"
          size="large"
          className={
            email && password && !emailHelper && !passwordHelper
              ? "btn-valid"
              : "btn-invalid"
          }
        >
          로그인
        </Button>
        <Button
          type="ghost"
          onClick={(e) => {
            e.preventDefault();
            navigate("/signup"); // 회원가입 페이지로 이동
          }}
        >
          회원가입
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
