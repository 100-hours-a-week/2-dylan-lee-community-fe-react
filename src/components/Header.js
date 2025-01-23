import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { useSession } from "../context/SessionContext";
import { profileImageUrl } from "../utils/utils";
import api from "../utils/api";

const Header = () => {
  const { setUser, user, loading } = useSession();
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청
      const data = await api.delete("/api/v1/auth/logout");
      setUser(null);
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

  // 접근 제어
  useEffect(() => {
    const excludePaths = ["/login"];
    if (!loading) {
      if (excludePaths.includes(location.pathname) && user) {
        navigate("/posts");
      } else if (!excludePaths.includes(location.pathname) && !user) {
        navigate("/login");
      }
    }
  }, [location.pathname, navigate, user, loading]);

  if (loading) {
    return <div id="header">로딩중...</div>;
  }

  return (
    <div id="header">
      <div className="logo" onClick={() => navigate("/")}></div>

      {user ? (
        <div className="header-profile" onClick={toggleDropdown}>
          <img
            src={profileImageUrl(user.profile_image_path)}
            alt="프로필 이미지"
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
    </div>
  );
};

export default Header;
