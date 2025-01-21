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

const PostContainer = (post) => {
  const [showModal, setShowModal] = useState(false);
  const [isLike, setIsLike] = useState(null);
  const [likes, setLikes] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [loading, setLoading] = useState(false);
  const { user } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLikeStatus();
    fetchCommentsCount();
  }, [post.post_id]);

  // 유저 정보를 가져와서 좋아요 여부를 확인
  const fetchLikeStatus = async () => {
    try {
      const response = await fetch(
        `/api/v1/posts/${post.post_id}/like-status`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!response.ok) {
        throw new Error("좋아요 상태 가져오기 실패");
      }

      const { isLike } = await response.json();
      setIsLike(isLike.isLike); // 유저의 좋아요 상태 설정
    } catch (error) {
      console.error("좋아요 상태 초기화 실패:", error.message);
    }
  };

  const fetchCommentsCount = async () => {
    try {
      const response = await fetch(
        `/api/v1/posts/${post.post_id}/comment-count`,
        {
          method: "GET",
        }
      );

      if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!response.ok) {
        throw new Error("댓글 수 가져오기 실패");
      }

      const { count } = await response.json();
      setCommentsCount(count); // 댓글 수 업데이트
    } catch (error) {
      console.error("댓글 수 업데이트 실패:", error.message);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    console.log("모달 열림 상태:", showModal); // 상태 확인
  };

  const handleCloseModal = () => {
    setShowModal(false);
    console.log("모달 닫힘 상태:", showModal); // 상태 확인
  };

  const handleConfirm = async () => {
    console.log("확인 버튼 클릭");
    try {
      const response = await fetch(`/api/v1/posts/${post.post_id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/");
      } else if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        showToast_("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      }
    } catch (error) {
      console.error("게시글 삭제 실패:", error.message);
      showToast_("게시글 삭제에 실패했습니다.");
    } finally {
      handleCloseModal();
    }
  };

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/posts/${post.post_id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        showToast_("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!response.ok) {
        console.error("좋아요 처리 실패");
        showToast_("좋아요 처리에 실패했습니다");
      }

      const { isLike: updatedIsLike, likes: updatedLikes } =
        await response.json();
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
            src={`http://localhost:8000/api/v1/upload/${post.image_path}`}
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
