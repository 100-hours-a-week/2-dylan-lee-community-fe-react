import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; // 설치 필요: npm install classnames
import "../styles/Buttons.css"; // 버튼 스타일 정의

const Button = ({
  type = "submit", // 기본값 지정
  size = "", // 기본값 지정
  children,
  onClick,
  className = "", // 기본값 지정
  ...props
}) => {
  const buttonClass = classNames(
    "button", // 기본 버튼 클래스
    `button-${type}`, // 타입별 클래스
    `button-${size}`, // 크기별 클래스
    className // 추가 클래스
  );

  return (
    <button className={buttonClass} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf([
    "submit",
    "ghost",
    "round",
    "edit", // 수정 삭제 버튼
    "reaction",
    "image-delete", // 이미지 삭제 버튼
    "comment",
  ]),
  size: PropTypes.oneOf([
    "tiny",
    "comment",
    "large",
    "reaction",
    "post",
    "base",
  ]),
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
