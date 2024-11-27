import React, { useEffect } from "react";

const Toast = ({ message, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // 타이머 제거
  }, [duration, onClose]);

  return <div className="toast">{message}</div>;
};

export default Toast;
