import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { useSession } from "../context/SessionContext";
import { apiRequest } from "../utils/apiClient";

const Header = () => {
  const { user } = useSession();
  console.log("user:", user);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const profileImageUrl = () => {
    if (!user) {
      return null;
    }
    console.log("user.profile_image_path:", user.profile_image_path);
    return `http://localhost:8000/api/v1/upload/${user.profile_image_path}`;
  };

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      const data = await apiRequest("/auth/logout", {
        method: "DELETE",
      });
      console.log("로그아웃 성공:", data);
      navigate("/"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error.message);
    }
  };

  const dropdownItems = [
    { label: "회원정보수정", path: "/edit_profile" },
    { label: "비밀번호수정", path: "/edit_password" },
    { label: "로그아웃", action: handleLogout },
  ];

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  // 뒤로가기 버튼 표시 여부
  useEffect(() => {
    const hidePaths = [
      "/",
      "/login",
      "/posts",
      "/edit_profile",
      "/edit_password",
    ];
    setIsBackButtonVisible(!hidePaths.includes(location.pathname));
  }, [location.pathname]);

  // 드롭다운 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest(".small-profile-container")
      ) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  return (
    <div id="header">
      <h1 className="title-box">
        {isBackButtonVisible && (
          <button
            className="back-button absolute-title-left"
            onClick={handleBackButtonClick}
          ></button>
        )}
        <span className="header-title">아무 말 대잔치</span>
        {user ? (
          <div
            className="profile-circle absolute-title-right header-profile"
            onClick={toggleDropdown}
          >
            <img
              src={profileImageUrl()}
              alt="프로필 이미지"
              className="profile-image"
            />
          </div>
        ) : null}
        {dropdownVisible && (
          <div className="dropdown-menu">
            <ul>
              {dropdownItems.map((item, index) => (
                <li
                  key={index}
                  onClick={item.path ? () => navigate(item.path) : item.action}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </h1>
    </div>
  );
};

export default Header;
