import React, { useEffect, useState } from "react";
import Button from "./Buttons";
import "../styles/EditForm.css";
import Modal from "./Modal";
import { useSession } from "../context/SessionContext";
import { profileImageUrl } from "../utils/utils";
import { showToast_ } from "./Toast";

const ProfileEditForm = () => {
  const { user } = useSession();
  const [profileImage, setProfileImage] = useState(""); // 업로드 이미지 URL
  const [selectedImage, setSelectedImage] = useState(null); // 선택한 이미지 파일
  const [originalImage, setOriginalImage] = useState(null); // 기존 이미지 URL
  const [email, setEmail] = useState(""); // 이메일
  const [nickname, setNickname] = useState("");
  const [nicknameHelper, setNicknameHelper] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let profileImagePath = "";
    if (user && user.profile_image_path) {
      profileImagePath = profileImageUrl(user.profile_image_path);
    }
    setProfileImage(profileImagePath);
    setEmail(user.email);
    setNickname(user.nickname);
    setOriginalImage(profileImagePath);
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

  const handleImageDelete = () => {
    setSelectedImage(null);
    setProfileImage("");
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
      let profileImageUrl = null;
      if (selectedImage) {
        profileImageUrl = user.profile_image_path;
      } else if (profileImage) {
        profileImageUrl = user.profile_image_path;
      }
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

        if (uploadResponse.status === 401) {
          console.error("로그인이 필요합니다.");
          showToast_("로그인이 필요합니다.");
          // 페이지 새로고침
          setTimeout(() => {
            window.location.reload();
          }, 3000); // 3초 후 새로고침
        } else if (!uploadResponse.ok) {
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

      if (sessionUpdateResponse.status === 401) {
        console.error("로그인이 필요합니다.");
        showToast_("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!sessionUpdateResponse.ok) {
        throw new Error("세션 갱신 실패");
      }

      showToast_("프로필이 수정되었습니다");
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3초 후 새로고침
    } catch (error) {
      console.error("프로필 수정 실패:", error.message);
      showToast_("프로필 이미지와 닉네임을 확인해주세요");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await fetch("/api/v1/users/me", {
        method: "DELETE",
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!response.ok) {
        throw new Error("회원 탈퇴 실패");
      }

      setShowModal(false); // 모달 닫기
      showToast_("회원 탈퇴되었습니다");
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3초 후 새로고침
    } catch (error) {
      console.error("회원 탈퇴 실패:", error.message);
      showToast_("회원 탈퇴에 실패했습니다");
    }
  };

  return (
    <>
      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="title">회원정보수정</div>
        <div className="form-group">
          <div className="profile-image-label-container">
            <label>프로필 사진</label>
            {profileImage ? (
              <Button type="image-delete" onClick={handleImageDelete}>
                삭제
              </Button>
            ) : null}
          </div>
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
        <div className="form-group">
          <div className="g-input">
            <input
              type="text"
              id="email"
              placeholder=" "
              value={email}
              disabled
            />
            <label htmlFor="email">이메일</label>
          </div>
        </div>
        <div className="form-group">
          <div className="g-input">
            <input
              type="text"
              id="nickname"
              placeholder=" "
              value={nickname}
              onChange={handleNicknameChange}
            />
            <label htmlFor="nickname">닉네임</label>
            <div
              className={`helper-text ${nicknameHelper ? "show" : ""}`}
              id="nickname-message"
            >
              {nicknameHelper}
            </div>
          </div>
        </div>
        <Button type="comment" size="round">
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
