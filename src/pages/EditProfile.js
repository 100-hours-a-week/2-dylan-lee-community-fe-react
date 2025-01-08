import React from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import useToast from "../components/useToast";

const EditProfile = () => {
  const { showToast } = useToast();
  const handleProfileEditFailure = () => {
    showToast("닉네임과 프로필 사진을 다시 확인해주세요.");
  };

  return (
    <div className="default-container">
      <ProfileEditForm onFailure={handleProfileEditFailure} />
    </div>
  );
};

export default EditProfile;
