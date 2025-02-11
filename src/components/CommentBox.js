import React from "react";
import {
  formatDate,
  formatContentAsParagraphs,
  getImageUrl,
} from "../utils/utils";
import "../styles/Posts.css";
import Button from "./Buttons";
import { useSession } from "../context/SessionContext";

const CommentBox = ({ comment, onEditClick, onDeleteClick }) => {
  const { user } = useSession();

  return (
    <div className="comment-box">
      <div className="comment-info">
        <div className="author-container">
          <div className="profile-circle">
            <img src={getImageUrl(comment.profile_image)} alt="프로필 이미지" />
          </div>
          <span className="author-name">{comment.author}</span>
          <div className="post-date">{formatDate(comment.created_at)}</div>
        </div>
        {user && comment.user_id === user.user_id && (
          <div className="edit-buttons">
            <Button
              type="edit"
              size="tiny"
              onClick={(e) => {
                e.preventDefault();
                onEditClick(comment.comment_id, comment.content);
              }}
            >
              수정
            </Button>
            <Button
              type="edit"
              size="tiny"
              onClick={() => onDeleteClick(comment.comment_id)}
            >
              삭제
            </Button>
          </div>
        )}
      </div>
      {formatContentAsParagraphs(comment.content, "comment-content")}
    </div>
  );
};

export default CommentBox;
