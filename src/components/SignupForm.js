import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthForm.css";
import Button from "./Buttons";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../utils/constants";

const SignupForm = ({ onFailure }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(""); // 서버에서 반환된 이미지 URL
  const [selectedImage, setSelectedImage] = useState(null); // 로컬에서 선택한 이미지 파일
  const [emailHelper, setEmailHelper] = useState("");
  const [passwordHelper, setPasswordHelper] = useState("");
  const [passwordCheckHelper, setPasswordCheckHelper] = useState("");
  const [nicknameHelper, setNicknameHelper] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 검증 로직

      if (file.size > MAX_FILE_SIZE) {
        onFailure("이미지 크기는 5MB를 넘을 수 없습니다.");
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        onFailure("지원하지 않는 이미지 형식입니다.");
        return;
      }

      setSelectedImage(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

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

  const validateNickname = (value) => {
    if (!value) {
      setNicknameHelper("닉네임을 입력해주세요.");
      return false;
    }
    setNicknameHelper("");
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
    validatePassword(value);
    validatePasswordCheck(passwordCheck); // 실시간 유효성 검사
  };

  const handlePasswordCheckChange = (e) => {
    const value = e.target.value;
    setPasswordCheck(value);
    validatePasswordCheck(value); // 실시간 유효성 검사
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    validateNickname(value); // 실시간 유효성 검사
  };

  const handleValidation = () => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const passwordCheckValid = validatePasswordCheck(passwordCheck);
    const nicknameValid = validateNickname(nickname);

    return emailValid && passwordValid && passwordCheckValid && nicknameValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        let profileImageUrl = profileImage;
        // 이미지 업로드
        if (selectedImage) {
          const formData = new FormData();
          formData.append("image", profileImage);

          const response = await fetch("/api/v1/upload/profile-image", {
            method: "POST",
            body: formData,
            credentials: "include",
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "이미지 업로드 실패");
          }
          const uploadData = await response.json();
          profileImageUrl = uploadData.url;
          console.log("이미지 업로드 성공:", profileImageUrl);
        }

        // 서버에 회원가입 요청
        const response = await fetch("/api/v1/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            nickname,
            profileImagePath: profileImageUrl,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "회원가입 실패");
        }

        const userData = await response.json();
        console.log("회원가입 성공:", userData);
        navigate("/posts"); // posts 페이지로 이동
        window.location.reload();
      } catch (error) {
        console.error("회원가입 실패:", error.message);
        onFailure(error.message);
      }
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>프로필 사진</label>
        <div className="helper-text" id="image-message"></div>
        <label htmlFor="profile-image-input" className="profile-image-wrapper">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="프로필 이미지 미리보기"
              className="profile-image"
            />
          ) : (
            <div className="profile-placeholder">+</div>
          )}
        </label>

        <input
          type="file"
          id="profile-image-input"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">이메일*</label>
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
        <label htmlFor="password">비밀번호*</label>
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
        <label htmlFor="password-check">비밀번호 확인*</label>
        <input
          type="password"
          id="password-check"
          placeholder="비밀번호를 한번 더 입력하세요"
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

      <div className="form-group">
        <label htmlFor="nickname">닉네임*</label>
        <input
          type="text"
          id="nickname"
          name="닉네임"
          placeholder="닉네임을 입력하세요"
          value={nickname}
          onChange={handleNicknameChange}
        />
        <div
          className={`helper-text ${nicknameHelper ? "show" : ""}`}
          id="nickname-message"
        >
          {nicknameHelper}
        </div>
      </div>
      <Button
        type="submit"
        size="large"
        onClick={() => console.log("Submit Clicked")}
      >
        회원가입
      </Button>
      <Button
        type="ghost"
        onClick={(e) => {
          e.preventDefault(); // 폼 제출 동작 방지
          navigate("/login"); // 로그인 페이지로 이동
        }}
      >
        로그인하러 가기
      </Button>
    </form>
  );
};

export default SignupForm;
