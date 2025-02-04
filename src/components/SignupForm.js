/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Button from "./Buttons";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../utils/constants";
import { showToast_ } from "./Toast";
import api from "../utils/api";

const SignupForm = ({ onComplete, onBack }) => {
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

  const [step, setStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const goToNextStep = async () => {
    if (step === 1) {
      const isEmailValid = await validateEmail(email);
      if (!isEmailValid) {
        setIsNextDisabled(true);
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => setStep((prev) => Math.max(1, prev - 1));

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

  useEffect(() => {
    const validateStep = () => {
      switch (step) {
        case 1:
          setIsNextDisabled(!validateEmail(email));
          break;
        case 2:
          setIsNextDisabled(
            !validatePassword(password) || !validatePasswordCheck(passwordCheck)
          );
          break;
        case 3:
          setIsNextDisabled(!validateNickname(nickname));
          break;
        default:
          setIsNextDisabled(true);
      }
    };

    validateStep();
  }, [email, password, passwordCheck, nickname, step]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 검증 로직
      if (file.size > MAX_FILE_SIZE) {
        showToast_("이미지 크기는 5MB를 넘을 수 없습니다");
        return;
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        showToast_("지원하지 않는 이미지 형식입니다");
        return;
      }

      setSelectedImage(URL.createObjectURL(file));
      setProfileImage(file);
    }
  };

  const validateEmail = async (value) => {
    if (!value || !emailRegex.test(value)) {
      setEmailHelper("올바른 이메일 주소 형식을 입력해주세요.");
      return false;
    }
    const isEmailValid = await checkEmail(value);
    if (!isEmailValid) {
      setEmailHelper("이미 사용 중인 이메일 주소입니다.");
      return false;
    }
    setEmailHelper("");
    return true;
  };

  const checkEmail = async (value) => {
    // 서버에 이메일 중복 확인 요청
    try {
      await api.post("/api/v1/auth/check-email", {
        email: value,
      });
      return true;
    } catch (error) {
      if (error.response.status === 409) {
        setEmailHelper("이미 사용 중인 이메일 주소입니다.");
      }
    }
    return false;
  };

  const validatePassword = (value) => {
    if (value.length < 8) {
      setPasswordHelper("8자 이상 입력해주세요.");
      return false;
    }
    if (!passwordRegex.test(value)) {
      setPasswordHelper("특수문자, 숫자, 대소문자를 포함해주세요.");
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

          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/upload/profile-image`,
            {
              method: "POST",
              body: formData,
              credentials: "include",
            }
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "이미지 업로드 실패");
          }
          const uploadData = await response.json();
          profileImageUrl = uploadData.url;
        }

        // 서버에 회원가입 요청
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/auth/signup`,
          {
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
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "회원가입 실패");
        }

        onBack();
        onComplete();
      } catch (error) {
        console.error("회원가입 실패:", error.message);
        if (error.message === "이미 사용 중인 닉네임입니다.") {
          setNicknameHelper("이미 사용 중인 닉네임입니다.");
        }
        showToast_("회원가입에 실패했습니다.");
      }
    }
  };

  return (
    <div className="signup-form-wrapper">
      <button
        type="button"
        className="prev-button"
        onClick={() => {
          if (step > 1) goToPreviousStep();
          else onBack();
        }}
      />
      <form className="signup-form" onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label>프로필 사진</label>
              <div className="helper-text" id="image-message"></div>
              <label
                htmlFor="profile-image-input"
                className="profile-image-wrapper"
              >
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
              <div className="g-input">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  value={email}
                  onChange={handleEmailChange}
                />
                <label htmlFor="email">이메일*</label>

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
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <div className="g-input">
                <input
                  type="password"
                  id="password"
                  placeholder=" "
                  value={password}
                  onChange={handlePasswordChange}
                />
                <label htmlFor="password">비밀번호*</label>
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
            <div className="form-group">
              <div className="g-input">
                <input
                  type="password"
                  id="password-check"
                  placeholder=" "
                  value={passwordCheck}
                  onChange={handlePasswordCheckChange}
                />
                <label htmlFor="password-check">비밀번호 확인*</label>

                {passwordCheck ? (
                  <div
                    className={`helper-text ${passwordCheckHelper ? "show" : ""}`}
                    id="password-check-message"
                  >
                    {passwordCheckHelper}
                  </div>
                ) : (
                  <div
                    className="helper-text"
                    id="password-check-message"
                  ></div>
                )}
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-group">
              <div className="g-input">
                <input
                  type="text"
                  id="nickname"
                  name="닉네임"
                  placeholder=" "
                  value={nickname}
                  onChange={handleNicknameChange}
                />
                <label htmlFor="nickname">닉네임*</label>
                {nickname ? (
                  <div
                    className={`helper-text ${nicknameHelper ? "show" : ""}`}
                    id="nickname-message"
                  >
                    {nicknameHelper}
                  </div>
                ) : (
                  <div className="helper-text" id="nickname-message"></div>
                )}
              </div>
            </div>
            <Button type="submit" size="large">
              회원가입
            </Button>
          </>
        )}
      </form>
      {step !== 3 && (
        <button
          type="button"
          className="next-button"
          onClick={goToNextStep}
          disabled={isNextDisabled}
        />
      )}
    </div>
  );
};

export default SignupForm;
