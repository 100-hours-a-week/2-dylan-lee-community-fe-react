import React, { useState } from "react";
import Button from "./Buttons";
import "../styles/EditForm.css";
import Toast from "./Toast";

const PasswordEditForm = () => {
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordHelper, setPasswordHelper] = useState("");
  const [passwordCheckHelper, setPasswordCheckHelper] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

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

  const validatePasswordCheck = (value) => {
    if (!value) {
      setPasswordCheckHelper("비밀번호를 한번 더 입력해주세요.");
      return false;
    }
    if (password !== value) {
      setPasswordCheckHelper("비밀번호가 일치하지 않습니다.");
      return false;
    }
    setPasswordCheckHelper("");
    return true;
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    validatePasswordCheck(passwordCheck); // 실시간 유효성 검사
  };

  const handlePasswordCheckChange = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);
    validatePasswordCheck(value); // 실시간 유효성 검사
  };

  const handleValidation = () => {
    const passwordValid = validatePassword(password);
    const passwordCheckValid = validatePasswordCheck(passwordCheck);

    return passwordValid && passwordCheckValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        const response = await fetch(`/api/v1/users/password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password,
          }),
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("비밀번호 수정 실패");
        }

        setToastMessage("수정 완료");
        // 3초 후에 로그인 페이지로 이동
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } catch (error) {
        console.error("비밀번호 수정 실패:", error.message);
      }
    }
  };

  const handleCloseToast = () => {
    setToastMessage(""); // 토스트 메시지 제거
  };

  return (
    <>
      <form className="edit-form center" onSubmit={handleSubmit}>
        <div className="title margin-bottom">비밀번호 수정</div>
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
        <div className="form-group">
          <label htmlFor="password-check">비밀번호 확인</label>
          <input
            type="password"
            id="password-check"
            placeholder="비밀번호를 입력하세요"
            value={passwordCheck}
            onChange={handlePasswordCheckChange}
          />
          <div
            className={`helper-text ${passwordCheckHelper ? "show" : ""}`}
            id="password-check-message"
          >
            {passwordCheckHelper}
          </div>
        </div>
        <Button
          type="submit"
          size="large"
          onClick={() => console.log("비밀번호 수정")}
        >
          수정하기
        </Button>
      </form>
      {toastMessage && (
        <Toast
          message={toastMessage}
          duration={3000}
          onClose={handleCloseToast}
        />
      )}
    </>
  );
};

export default PasswordEditForm;
