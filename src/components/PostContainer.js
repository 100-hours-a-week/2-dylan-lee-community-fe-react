import React, { useEffect, useState } from "react";
import {
  formatDate,
  formatContentAsParagraphs,
  titleOverflow,
  profileImageUrl,
} from "../utils/utils";
import { useSession } from "../context/SessionContext";
import { useNavigate } from "react-router-dom";
import Button from "./Buttons";
import Modal from "./Modal";
import { showToast_ } from "./Toast";
import api from "../utils/api";

const PostContainer = (post) => {
  const [showModal, setShowModal] = useState(false);
  const [isLike, setIsLike] = useState(null);
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [loading, setLoading] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    // 유저 정보를 가져와서 좋아요 여부를 확인
    const fetchLikeStatus = async () => {
      try {
        const response = await api.get(
          `/api/v1/posts/${post.post_id}/like-status`
        );

        const { isLike } = response;
        setIsLike(isLike.isLike); // 유저의 좋아요 상태 설정
      } catch (error) {
        console.error("좋아요 상태 초기화 실패:", error.message);
      }
    };

    const fetchCommentsCount = async () => {
      try {
        const response = await api.get(
          `/api/v1/posts/${post.post_id}/comment-count`
        );

        const { count } = response;
        setCommentsCount(count); // 댓글 수 업데이트
      } catch (error) {
        console.error("댓글 수 업데이트 실패:", error.message);
      }
    };

    fetchLikeStatus();
    fetchCommentsCount();
  }, [post.post_id]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      await api.delete(`/api/v1/posts/${post.post_id}`);
    } catch (error) {
      console.error("게시글 삭제 실패:", error.message);
      showToast_("게시글 삭제에 실패했습니다.");
    } finally {
      handleCloseModal();
      navigate("/");
    }
  };

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.post(`/api/v1/posts/${post.post_id}/like`);
      const { isLike: updatedIsLike, likes: updatedLikes } = response;
      setIsLike(updatedIsLike);
      setLikes(updatedLikes);
    } catch (error) {
      console.error("좋아요 처리 실패:", error.message);
      showToast_("좋아요 처리에 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-container">
      <div className="post-header">
        <div className="title">{titleOverflow(post.title)}</div>
        <div className="post-info">
          <div className="author-container">
            <div className="profile-circle">
              <img
                src={profileImageUrl(post.profile_image)}
                alt="프로필 이미지"
              />
            </div>
            <span className="author-name">{post.author}</span>
            <div className="post-date">{formatDate(post.created_at)}</div>
          </div>
          {user && post.user_id === user.user_id && (
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
          )}
        </div>
      </div>
      <div className="grey-line"></div>
      <div className="post-content">
        {post.image_path && (
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}/api/v1/upload/${post.image_path}`}
            alt="Example description"
            className="post-content-image"
          />
        )}
        {formatContentAsParagraphs(post.content)}
      </div>
      <div className="reaction-buttons">
        <Button
          type="reaction"
          size="base"
          id="likes"
          className={isLike ? "active" : ""}
          onClick={handleLike}
          disabled={loading || isLike === null} // 로딩 중 또는 초기화 중에는 버튼 비활성화
        >
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
          {commentsCount}
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
