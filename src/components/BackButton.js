import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);

  const handleBackButtonClick = () => {
    if (location.pathname.startsWith("/post")) {
      navigate("/posts");
      return;
    }
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

  return (
    <>
      {isBackButtonVisible && (
        <button
          className="back-button"
          onClick={handleBackButtonClick}
        ></button>
      )}
    </>
  );
};

export default BackButton;
