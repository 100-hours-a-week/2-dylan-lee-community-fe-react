import React from "react";
import { formatDate, formatCount, titleOverflow } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/utils";

const PostBox = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div className="post-box" onClick={() => navigate(`/post/${post.post_id}`)}>
      <div className="post-box-header">
        <div className="post-title">{titleOverflow(post.title)}</div>
        <div className="post-info">
          <div className="post-meta">
            <div>좋아요 {formatCount(post.likes)}</div>
            <div>댓글 {formatCount(post.comments_count)}</div>
            <div>조회수 {formatCount(post.views)}</div>
          </div>
          <div className="post-date">{formatDate(post.created_at)}</div>
        </div>
      </div>
      <div className="author-container post-box-padding">
        <div className="profile-circle">
          <img src={getImageUrl(post.profile_image)} alt="프로필 이미지" />
        </div>
        <span className="author-name">{post.author}</span>
      </div>
    </div>
  );
};

export default PostBox;
