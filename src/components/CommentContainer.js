/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Button from "./Buttons";
import CommentBox from "../components/CommentBox";
import Modal from "./Modal";
import { convertTime } from "../utils/utils";
import { showToast_ } from "./Toast";
import api from "../utils/api";

const CommentContainer = ({ postId, onCommentUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState(null); // 선택된 댓글 ID
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [isEditing, setIsEditing] = useState(false); // 수정 상태
  const [editId, setEditId] = useState(null); // 수정 중인 댓글 ID
  const [firstCreatedAt, setFirstCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const limit = 100;

  let isFetching = false;

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    if (isFetching || !hasMore) return;
    isFetching = true;
    setLoading(true);

    try {
      const params = firstCreatedAt
        ? `firstCreatedAt=${convertTime(firstCreatedAt)}`
        : "";

      const url = `/api/v1/posts/${postId}/comments?${params}&limit=${limit}`;
      const response = await api.get(url);

      const newComments = response;
      setComments((prevComments) => {
        const uniqueComments = [
          ...prevComments,
          ...newComments.filter(
            (newComment) =>
              !prevComments.some(
                (prevComment) =>
                  prevComment.created_at === newComment.created_at
              )
          ),
        ];
        uniqueComments.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        return uniqueComments;
      });

      if (newComments.length < limit) {
        setHasMore(false);
      }

      if (newComments.length > 0) {
        const latestComment = newComments.reduce((latest, comment) =>
          new Date(comment.created_at) > new Date(latest.created_at)
            ? comment
            : latest
        );
        setFirstCreatedAt(latestComment.created_at);
      }
    } catch (error) {
      console.error("댓글 가져오기 에러:", error.message);
      showToast_("댓글을 불러오는 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    let timer;
    const handleScroll = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (
          hasMore &&
          window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100
        ) {
          if (!loading) {
            fetchComments();
          }
        }
      }, 300); // 300ms 디바운싱
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, firstCreatedAt, hasMore]);

  const handleOpenModal = (commentId) => {
    setSelectedCommentId(commentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCommentId(null);
  };

  const handleConfirm = async () => {
    if (!selectedCommentId) return;
    try {
      const response = await api.delete(
        `/api/v1/posts/${postId}/comments/${selectedCommentId}`
      );

      const updatedComment = response;
      const sortedComments = updatedComment.comments.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("댓글 삭제 실패:", error.message);
      showToast_("댓글 삭제에 실패했습니다.");
    } finally {
      handleCloseModal();
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleValidation = () => {
    if (!commentText.trim()) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) return;

    if (isEditing && editId !== null) {
      // 댓글 수정 로직 추가
      try {
        const response = await api.put(
          `/api/v1/posts/${postId}/comments/${editId}`,
          {
            content: commentText,
          }
        );
        if (response) {
          setCommentText("");
          setIsEditing(false);
          setEditId(null);
          const updatedComment = response;
          const sortedComments = updatedComment.comments.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setComments(sortedComments);
          fetchComments();
        } else {
          console.error("댓글 수정 실패");
          showToast_("댓글 수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("댓글 수정 실패:", error.message);
        showToast_("댓글 수정에 실패했습니다.");
      }
    } else {
      // 댓글 등록 로직 추가
      try {
        const response = await api.post(`/api/v1/posts/${postId}/comments`, {
          content: commentText,
        });

        if (response) {
          const updatedComment = response;
          const sortedComments = updatedComment.comments.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setComments(sortedComments);
          setCommentText("");
        } else {
          console.error("댓글 등록 실패");
          showToast_("댓글 등록에 실패했습니다.");
        }
      } catch (error) {
        console.error("댓글 등록 실패:", error.message);
        showToast_("댓글 등록에 실패했습니다.");
      }
    }
    onCommentUpdated();
  };

  const handleEditClick = (commentId, content) => {
    setCommentText(content); // 기존 댓글 내용을 입력창에 설정
    setIsEditing(true); // 수정 상태 활성화
    setEditId(commentId); // 수정 중인 댓글 ID 설정
  };

  return (
    <>
      <form className="comments-container" onSubmit={handleSubmit}>
        <div className="write-comment">
          <textarea
            placeholder="댓글을 남겨주세요!"
            className="comment-input"
            value={commentText}
            onChange={handleCommentChange}
          ></textarea>
          <div className="line"></div>
          <Button
            type="round"
            size="comment"
            className={
              commentText.trim() ? "flex-end btn-valid" : "flex-end btn-invalid"
            }
          >
            {isEditing ? "댓글 수정" : "댓글 등록"}
          </Button>
        </div>
        <div className="view-comment">
          {loading ? (
            <div>댓글을 불러오는 중입니다...</div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentBox
                key={comment.comment_id}
                comment={comment}
                onEditClick={handleEditClick}
                onDeleteClick={() => handleOpenModal(comment.comment_id)}
              />
            ))
          ) : (
            <div>댓글이 없습니다.</div>
          )}
          {}
        </div>
      </form>
      {showModal && (
        <Modal
          isOpen={showModal}
          title="댓글을 삭제하시겠습니까?"
          message="삭제한 댓글은 복구할 수 없습니다."
          onConfirm={handleConfirm}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default CommentContainer;
