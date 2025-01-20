import React from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import useToast from "../components/useToast";

const EditProfile = () => {
  const { showToast } = useToast();
  const handleProfileEdit = (e) => {
    showToast(e);
    if (e === "프로필이 수정되었습니다.") {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="default-container">
      <ProfileEditForm onChange={handleProfileEdit} />
    </div>
  );
};

export default EditProfile;
