import React from "react";
import { formatDate, formatContentAsParagraphs } from "../utils/utils";
import "../styles/Posts.css";
import Button from "./Buttons";

const CommentBox = ({ comment, onEditClick, onDeleteClick }) => {
  return (
    <div className="comment-box">
      <div className="post-info">
        <div className="author-container">
          <div className="profile-circle"></div>
          <span className="author-name">{comment.author}</span>
          <div className="post-date">{formatDate(comment.created_at)}</div>
        </div>
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
      </div>
      {formatContentAsParagraphs(comment.content, "comment-content")}
    </div>
  );
};

export default CommentBox;
