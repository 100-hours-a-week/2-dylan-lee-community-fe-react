import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import "../styles/Login.css";
import Typewriter from "typewriter-effect";
import { showToast_ } from "../components/Toast";

const Login = () => {
  const [isSigningUp, setIsSigningUp] = useState(false); // 회원가입 모드 여부

  const handleSignupComplete = () => {
    setIsSigningUp(false);
    showToast_("회원가입이 완료되었습니다!");
  };

  return (
    <div className="auth-container">
      <div className="left-side">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .changeDelay(80)
              .typeString("나착리느ㄴ ")
              .deleteAll()
              .changeDelay(160)
              .typeString("낯 가리는")
              .pauseFor(2000)
              .deleteChars(3)
              .pauseFor(500)
              .deleteChars(1)
              .typeString("가리는 사람")
              .pauseFor(300)
              .typeString("..")
              .pauseFor(400)
              .deleteChars(2)
              .pauseFor(800)
              .typeString("들")
              .pauseFor(1000)
              .typeString("...")
              .pauseFor(4000)
              .start();
          }}
          options={{
            autoStart: true,
            loop: true,
            wrapperClassName: "typewriter-title",
            cursorClassName: "typewriter-cursor",
          }}
        />
      </div>
      <div className="right-side">
        <div className="login-container">
          {!isSigningUp ? (
            <LoginForm onSignup={() => setIsSigningUp(true)} />
          ) : (
            <SignupForm
              onComplete={handleSignupComplete}
              onBack={() => setIsSigningUp(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
