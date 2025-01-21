import React from "react";
import "../styles/Modal.css";

const Modal = ({ isOpen, title, message, onConfirm, onClose }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 null을 반환

  return (
    <>
      {/* 오버레이 */}
      <div className="overlay" onClick={onClose}></div>
      {/* 모달 */}
      <div className="modal">
        <div className="modal-content">
          <h2 id="title">{title}</h2>
          <p>{message}</p>
          <div className="modal-actions">
            <button id="cancel-action" onClick={onClose}>
              취소
            </button>
            <button id="confirm-action" onClick={onConfirm}>
              확인
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
