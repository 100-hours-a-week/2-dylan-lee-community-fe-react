import React, { useState } from "react";
import Button from "./Buttons";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { showToast_ } from "./Toast";

const LoginForm = ({ onFailure, onSignup }) => {
  const navigate = useNavigate();

  const { login } = useSession();
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
    if (!passwordRegex.test(value)) {
      setPasswordHelper("특수문자, 숫자, 대소문자를 포함해주세요.");
      return false;
    }
    if (value.length < 8) {
      setPasswordHelper("8자 이상 입력해주세요.");
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
        await login(email, password);
        navigate("/");
      } catch (error) {
        console.error("로그인 실패:", error.message);
        showToast_("로그인에 실패했습니다.", "error");
      }
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="title">
        로그인
        <span className="cursor-effect">|</span>
      </div>
      <div className="form-group">
        <div className="g-input">
          <input
            type="email"
            id="email"
            placeholder=" "
            value={email}
            onChange={handleEmailChange}
          />
          <label htmlFor="email">이메일</label>
          {email ? (
            <div
              className={`helper-text ${emailHelper ? "show" : ""}`}
              id="email-message"
            >
              {emailHelper}
            </div>
          ) : (
            <div className="helper-text" id="email-message"></div>
          )}
        </div>
      </div>
      <div className="form-group">
        <div className="g-input">
          <input
            type="password"
            id="password"
            placeholder=" "
            value={password}
            onChange={handlePasswordChange}
          />
          <label htmlFor="password">비밀번호</label>
          {password ? (
            <div
              className={`helper-text ${passwordHelper ? "show" : ""}`}
              id="password-message"
            >
              {passwordHelper}
            </div>
          ) : (
            <div className="helper-text" id="password-message"></div>
          )}
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
            onSignup();
          }}
        >
          회원가입
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
