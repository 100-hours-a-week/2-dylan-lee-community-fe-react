import React from "react";
import LoginForm from "../components/LoginForm";
import useToast from "../components/useToast";
import "../styles/Login.css";
import Typewriter from "typewriter-effect";

const Login = () => {
  const { showToast } = useToast();

  const handleLoginFailure = () => {
    showToast("이메일 또는 비밀번호를 확인하세요.");
  };

  new Typewriter("#typewriter", {
    strings: ["Hello", "World"],
    autoStart: true,
  });

  return (
    <div className="container">
      <div className="left-side">
        <Typewriter
          onInit={(typewriter) => {
            typewriter
              .typeString('<span style="font-size: 1.5rem;">나ㅊ가리</span>')
              .pauseFor(400)
              .deleteAll()
              .typeString('<span style="font-size: 1.5rem;">낯가리는</span>')
              .pauseFor(2000)
              .deleteChars(2)
              .pauseFor(500)
              .deleteChars(1)
              .typeString(
                '<span style="font-size: 1.5rem;"> 가리는 사람들</span>'
              )
              .pauseFor(1000)
              .typeString('<span style="font-size: 1.5rem;">...</span>')
              .pauseFor(2500)
              .start();
          }}
          options={{
            loop: true,
            cursor: '<span style="font-size: 1.5rem;">|</span>',
            delay: 150,
          }}
        />
      </div>
      <div className="right-side">
        <div className="login-container">
          <LoginForm onFailure={handleLoginFailure} />
        </div>
      </div>
    </div>
  );
};

export default Login;
