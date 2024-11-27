import React, { useState } from "react";
import {
  formatDate,
  formatContentAsParagraphs,
  titleOverflow,
} from "../utils/utils";
import { useNavigate } from "react-router-dom";
import Button from "./Buttons";
import Modal from "./Modal";

const PostContainer = (post) => {
  const [showModal, setShowModal] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const navigate = useNavigate();

  const handleOpenModal = () => {
    setShowModal(true);
    console.log("모달 열림 상태:", showModal); // 상태 확인
  };

  const handleCloseModal = () => {
    setShowModal(false);
    console.log("모달 닫힘 상태:", showModal); // 상태 확인
  };

  const handleConfirm = () => {
    console.log("확인 버튼 클릭");
    setShowModal(false); // 모달 닫기
    // API 호출
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/v1/posts/${post.post_id}/likes`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("좋아요 처리 실패");
      }

      const { isLike, likes } = await response.json();
      setIsLike(isLike);
      setLikes(likes);
      console.log("좋아요 처리 성공");
    } catch (error) {
      console.error("좋아요 처리 실패:", error.message);
    }
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="title">{titleOverflow(post.title)}</div>
        <div className="post-info">
          <div className="author-container">
            <div className="profile-circle"></div>
            <span className="author-name">{post.author}</span>
            <div className="post-date">{formatDate(post.created_at)}</div>
          </div>
          <div className="edit-buttons">
            <Button
              type="edit"
              size="tiny"
              id="edit-post"
              onClick={(e) => {
                navigate("/edit_post/" + post.post_id);
              }}
            >
              수정
            </Button>
            <Button
              type="edit"
              size="tiny"
              id="delete-post"
              onClick={handleOpenModal}
            >
              삭제
            </Button>
          </div>
        </div>
      </div>
      <div className="grey-line"></div>
      <div className="post-content">
        {post.image_path && (
          <img
            src={`http://localhost:8000/api/v1/upload/${post.image_path}`}
            alt="Example description"
            className="post-content-image"
          />
        )}
        {formatContentAsParagraphs(post.content)}
      </div>
      <div className="reaction-buttons">
        <Button type="reaction" size="base" id="likes" onClick={handleLike}>
          {likes}
          <br />
          좋아요수
        </Button>
        <Button type="reaction" size="base" id="views">
          {post.views}
          <br />
          조회수
        </Button>
        <Button type="reaction" size="base" id="comments-count">
          {post.comments_count}
          <br />
          댓글
        </Button>
      </div>
      <div className="grey-line"></div>
      {showModal && (
        <Modal
          isOpen={showModal}
          title="게시글을 삭제하시겠습니까?"
          message="삭제한 내용은 복구할 수 없습니다."
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PostContainer;
