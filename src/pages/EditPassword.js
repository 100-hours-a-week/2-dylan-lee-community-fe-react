import React from "react";
import PasswordEditForm from "../components/PasswordEditForm";
import useToast from "../components/useToast";

const EditPassword = () => {
  const { showToast } = useToast();
  const handleChange = (e) => {
    showToast(e);
  };

  const handleSuccess = () => {
    showToast("비밀번호가 변경되었습니다.");
  };

  return (
    <div className="default-container">
      <PasswordEditForm onChange={handleChange} onComplete={handleSuccess} />
    </div>
  );
};

export default EditPassword;
