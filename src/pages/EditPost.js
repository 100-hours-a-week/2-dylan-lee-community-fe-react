import React from "react";
import { useParams } from "react-router-dom";
import PostEditForm from "../components/PostEditForm";
import useToast from "../components/useToast";

const EditPost = () => {
  const { postId } = useParams();
  const { showToast } = useToast();

  const handleFailure = (e) => {
    showToast(e);
  };

  return (
    <div className="default-container">
      <div className="title">게시글 수정</div>
      <PostEditForm postId={postId} onFailure={handleFailure} />
    </div>
  );
};

export default EditPost;
