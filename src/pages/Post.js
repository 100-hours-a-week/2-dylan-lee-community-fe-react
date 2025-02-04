/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../components/PostContainer";
import CommentContainer from "../components/CommentContainer";
import api from "../utils/api";
import "../styles/Post.css";

const Post = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId 추출
  const [post, setPost] = useState(null);
  const [commentsCount, setCommentsCount] = useState(0); // 댓글 수 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/v1/posts/${postId}`);
        const postData = response;
        setPost(postData);
      } catch (error) {
        console.error("포스트 Fetch 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <div>로딩중...</div>;
  }

  // 댓글 수 갱신 함수
  const fetchCommentsCount = async () => {
    try {
      const response = await api.get(`/api/v1/posts/${postId}/comment-count`);
      const { count } = response;
      setCommentsCount(count);
    } catch (error) {
      console.error("댓글 수 갱신 실패:", error.message);
    }
  };

  if (loading) {
    return <div className="default-container">Loading...</div>;
  }

  if (!post) {
    return <div className="default-container">포스트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="default-container">
      <PostContainer {...post} />
      <CommentContainer postId={postId} onCommentUpdated={fetchCommentsCount} />
    </div>
  );
};

export default Post;
