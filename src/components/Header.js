import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { useSession } from "../context/SessionContext";

const Header = () => {
  const { setUser, user, loading } = useSession();
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
      const data = await fetch("/api/v1/auth/logout", {
        method: "DELETE",
      });
      if (!data.ok) {
        throw new Error("로그아웃 실패");
      }
      console.log("로그아웃 성공:", data);
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

  const handleBackButtonClick = () => {
    if (location.pathname.startsWith("/post")) {
      navigate("/posts");
      return;
    }
    console.log("location:", location.pathname);
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

  // 접근 제어
  useEffect(() => {
    const excludePaths = ["/login", "/signup"];
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
      <h1 className="title-box">
        {isBackButtonVisible && (
          <button
            className="back-button absolute-title-left"
            onClick={handleBackButtonClick}
          ></button>
        )}
        <div className="header-title" onClick={() => navigate("/")}>
          아무 말 대잔치
        </div>

        {user ? (
          <div
            className="profile-circle absolute-title-right header-profile"
            onClick={toggleDropdown}
          >
            <img src={profileImageUrl()} alt="프로필 이미지" />
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
