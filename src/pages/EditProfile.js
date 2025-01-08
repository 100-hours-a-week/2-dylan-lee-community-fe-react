import React from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import useToast from "../components/useToast";

const EditProfile = () => {
  const { showToast } = useToast();
  const handleProfileEditFailure = () => {
    showToast("닉네임과 프로필 사진을 다시 확인해주세요.");
  };
  const handleProfileEditSuccess = () => {
    // 3초 뒤에 페이지 새로고침
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  return (
    <div className="default-container">
      <ProfileEditForm
        onFailure={handleProfileEditFailure}
        onSuccess={handleProfileEditSuccess}
      />
    </div>
  );
};

export default EditProfile;
