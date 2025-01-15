import React, { useState, useEffect } from "react";
import Button from "./Buttons";
import CommentBox from "../components/CommentBox";
import Modal from "./Modal";
import { convertTime } from "../utils/utils";

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
    console.log("댓글 가져오기 시작");

    try {
      const params = firstCreatedAt
        ? `firstCreatedAt=${convertTime(firstCreatedAt)}`
        : "";

      const url = `/api/v1/posts/${postId}/comments?${params}&limit=${limit}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`코멘트 로드 에러: ${response.statusText}`);
      }

      const newComments = await response.json();
      console.log(newComments);

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
        console.log("가장 오래된 댓글:", latestComment);
        setFirstCreatedAt(latestComment.created_at);
      }
    } catch (error) {
      console.error("댓글 가져오기 에러:", error.message);
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
    console.log("모달 열림 상태:", showModal); // 상태 확인
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCommentId(null);
    console.log("모달 닫힘 상태:", showModal); // 상태 확인
  };

  const handleConfirm = async () => {
    if (!selectedCommentId) return;
    try {
      const response = await fetch(
        `/api/v1/posts/${postId}/comments/${selectedCommentId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        const updatedComment = await response.json();
        const sortedComments = updatedComment.comments.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
        setComments(sortedComments);
        console.log("댓글 삭제 성공");
      } else {
        console.error("댓글 삭제 실패");
      }
    } catch (error) {
      console.error("댓글 삭제 실패:", error.message);
    } finally {
      handleCloseModal();
    }
  };

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleValidation = () => {
    if (!commentText.trim()) {
      console.log("댓글을 입력해주세요.");
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
        const response = await fetch(
          `/api/v1/posts/${postId}/comments/${editId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: commentText,
            }),
          }
        );
        if (response.ok) {
          setCommentText("");
          setIsEditing(false);
          setEditId(null);
          const updatedComment = await response.json();
          const sortedComments = updatedComment.comments.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setComments(sortedComments);
          fetchComments();
          console.log("댓글 수정 성공");
        } else {
          console.error("댓글 수정 실패");
        }
      } catch (error) {
        console.error("댓글 수정 실패:", error.message);
      }
    } else {
      // 댓글 등록 로직 추가
      try {
        const response = await fetch(`/api/v1/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: commentText,
          }),
        });
        if (response.ok) {
          const updatedComment = await response.json();
          const sortedComments = updatedComment.comments.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          setComments(sortedComments);
          setCommentText("");
          console.log("댓글 등록 성공");
        } else {
          console.error("댓글 등록 실패");
        }
      } catch (error) {
        console.error("댓글 등록 실패:", error.message);
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
