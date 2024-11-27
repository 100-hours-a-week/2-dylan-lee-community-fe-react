import React from "react";
import { useParams } from "react-router-dom";
import PostEditForm from "../components/PostEditForm";

const EditPost = () => {
  const { postId } = useParams();

  return (
    <div className="default-container">
      <div className="title">게시글 수정</div>
      <PostEditForm postId={postId} />
    </div>
  );
};

export default EditPost;
