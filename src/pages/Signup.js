import React from "react";
import SignupForm from "../components/SignupForm";
import useToast from "../components/useToast";

const Signup = () => {
  const { showToast } = useToast();
  const handleFailure = (e) => {
    showToast(e);
  };

  return (
    <div className="default-container">
      <div className="auth-container signup-container">
        <div className="title">회원가입</div>
        <SignupForm onFailure={handleFailure} />
      </div>
    </div>
  );
};

export default Signup;
