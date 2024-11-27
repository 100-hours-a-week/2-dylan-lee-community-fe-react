import React from "react";
import SignupForm from "../components/SignupForm";

const Signup = () => {
  return (
    <div className="default-container">
      <div className="auth-container signup-container">
        <div className="title">회원가입</div>
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
