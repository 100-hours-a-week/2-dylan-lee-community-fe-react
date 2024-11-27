import React, { useState, useEffect } from "react";
import Button from "./Buttons";
import CommentBox from "../components/CommentBox";

const CommentContainer = ({ postId }) => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]); // 댓글 리스트
  const [isEditing, setIsEditing] = useState(false); // 수정 상태
  const [editId, setEditId] = useState(null); // 수정 중인 댓글 ID
  const [loading, setLoading] = useState(true);

  // 댓글 데이터 가져오기
  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

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
        if (!response.ok) {
          throw new Error("댓글 수정 실패");
        }

        await fetchComments();
        setIsEditing(false);
        setEditId(null);
        setCommentText("");
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
        if (!response.ok) {
          throw new Error("댓글 등록 실패");
        }
        await fetchComments();
        setCommentText(""); // 입력창 초기화
      } catch (error) {
        console.error("댓글 등록 실패:", error.message);
      }
    }
    setCommentText("");
  };

  const handleEditClick = (commentId, content) => {
    setCommentText(content); // 기존 댓글 내용을 입력창에 설정
    setIsEditing(true); // 수정 상태 활성화
    setEditId(commentId); // 수정 중인 댓글 ID 설정
  };

  const handleDeleteClick = async (commentId) => {
    try {
      const response = await fetch(
        `/api/v1/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("댓글 삭제 실패");
      }
      await fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error.message);
    }
  };

  return (
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
              onDeleteClick={handleDeleteClick}
            />
          ))
        ) : (
          <div>댓글이 없습니다.</div>
        )}
        {}
      </div>
    </form>
  );
};

export default CommentContainer;
