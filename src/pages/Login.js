import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import useToast from "../components/useToast";
import "../styles/Login.css";
import Typewriter from "typewriter-effect";

const Login = () => {
  const { showToast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false); // 회원가입 모드 여부

  const handleFailure = (e) => {
    showToast(e);
  };

  const handleLoginFailure = () => {
    showToast("이메일 또는 비밀번호를 확인하세요.");
  };

  const handleSignupComplete = () => {
    setIsSigningUp(false);
    showToast("회원가입이 완료되었습니다!");
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
            <LoginForm
              onFailure={handleLoginFailure}
              onSignup={() => setIsSigningUp(true)}
            />
          ) : (
            <SignupForm
              onFailure={handleFailure}
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
