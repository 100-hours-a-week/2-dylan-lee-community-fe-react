import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostContainer from "../components/PostContainer";
import CommentContainer from "../components/CommentContainer";
import "../styles/Post.css";

const Post = () => {
  const { postId } = useParams(); // URL 파라미터에서 postId 추출
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/v1/posts/${postId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `포스트를 가져오는데 실패했습니다: ${response.statusText}`
          );
        }

        const postData = await response.json();
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
    return <div className="default-container">Loading...</div>;
  }

  if (!post) {
    return <div className="default-container">포스트를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="default-container">
      <PostContainer {...post} />
      <CommentContainer postId={postId} />
    </div>
  );
};

export default Post;
