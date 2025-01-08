import React, { useEffect, useState } from "react";
import Button from "./Buttons";
import "../styles/EditForm.css";
import Toast from "./Toast";
import Modal from "./Modal";
import { useSession } from "../context/SessionContext";

const ProfileEditForm = ({ onSuccess, onFailure }) => {
  const { user } = useSession();
  const [profileImage, setProfileImage] = useState(""); // 업로드 이미지 URL
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지 파일
  const [email, setEmail] = useState(""); // 이메일
  const [nickname, setNickname] = useState("");
  const [nicknameHelper, setNicknameHelper] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.profile_image_path) {
      setProfileImage(
        `http://localhost:8000/api/v1/upload/${user.profile_image_path}`
      );
      setEmail(user.email);
      setNickname(user.nickname);
    }
  }, [user]);

  if (!user) {
    return <div>로딩 중...</div>;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateNickname = (value) => {
    if (!value) {
      setNicknameHelper("닉네임을 입력해주세요.");
      return false;
    }
    setNicknameHelper("");
    return true;
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isNicknameValid = validateNickname(nickname); // 닉네임 검증 실행
    if (!isNicknameValid) {
      return;
    }

    setLoading(true); // 로딩 시작

    try {
      let profileImageUrl = user.profile_image_path;

      // 이미지 업로드
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);

        const uploadResponse = await fetch(
          "http://localhost:8000/api/v1/upload/profile-image",
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
        if (!uploadResponse.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const uploadData = await uploadResponse.json();
        profileImageUrl = uploadData.url;
      }

      const updateResponse = await fetch("/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname,
          profileImagePath: profileImageUrl,
        }),
        credentials: "include",
      });

      if (!updateResponse.ok) {
        throw new Error("프로필 수정 실패");
      }

      // 명시적으로 세션 새로고침 요청
      const sessionUpdateResponse = await fetch("/api/v1/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (!sessionUpdateResponse.ok) {
        throw new Error("세션 갱신 실패");
      }

      const updatedUser = await sessionUpdateResponse.json();
      onSuccess();
      console.log("세션 갱신 성공:", updatedUser);

      setToastMessage("수정 완료");
    } catch (error) {
      onFailure();
      console.error("프로필 수정 실패:", error.message);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleCloseToast = () => {
    setToastMessage(""); // 토스트 메시지 제거
  };

  const handleOpenModal = () => {
    setShowModal(true);
    console.log("모달 열림 상태:", showModal); // 상태 확인
  };

  const handleCloseModal = () => {
    setShowModal(false);
    console.log("모달 닫힘 상태:", showModal); // 상태 확인
  };

  const handleConfirm = async () => {
    console.log("확인 버튼 클릭");
    try {
      const response = await fetch("/api/v1/users/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("회원 탈퇴 실패");
      }
      console.log("회원 탈퇴 성공");
      setShowModal(false); // 모달 닫기
    } catch (error) {
      console.error("회원 탈퇴 실패:", error.message);
    }
  };

  return (
    <>
      <form className="edit-form center" onSubmit={handleSubmit}>
        <div className="title">회원정보수정</div>
        <div className="form-group">
          <label>프로필 사진*</label>
          <div className="helper-text" id="image-message"></div>
          <label
            htmlFor="profile-image-input"
            className="profile-image-wrapper"
          >
            {profileImage ? (
              <img
                src={profileImage}
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
        <label htmlFor="email">이메일</label>
        <p>{email}</p>
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
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
        <Button type="submit" size="large">
          수정하기
        </Button>
        <Button
          type="ghost"
          onClick={(e) => {
            e.preventDefault();
            handleOpenModal();
          }}
        >
          회원 탈퇴
        </Button>
      </form>
      {toastMessage && (
        <Toast
          message={toastMessage}
          duration={3000}
          onClose={handleCloseToast}
        />
      )}
      {showModal && (
        <Modal
          isOpen={showModal}
          title="회원탈퇴 하시겠습니까?"
          message="작성된 게시글과 댓글은 삭제됩니다."
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default ProfileEditForm;
