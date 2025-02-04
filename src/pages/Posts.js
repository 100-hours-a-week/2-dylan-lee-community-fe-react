/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostBox from "../components/PostBox";
import Button from "../components/Buttons";
import "../styles/Posts.css";
import { convertTime } from "../utils/utils";
import { showToast_ } from "../components/Toast";
import api from "../utils/api";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [lastCreatedAt, setLastCreatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const limit = 10;

  let isFetching = false;

  const fetchPosts = async () => {
    if (isFetching || !hasMore) return;
    isFetching = true;
    setLoading(true);

    try {
      const params = lastCreatedAt
        ? `lastCreatedAt=${convertTime(lastCreatedAt)}`
        : "";
      const url = `/api/v1/posts?${params}&limit=${limit}`;
      const response = await api.get(url);
      const newPosts = response;
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);

      if (newPosts.length < limit) {
        setHasMore(false);
      }

      if (newPosts.length > 0) {
        const latestPost = newPosts[newPosts.length - 1];
        setLastCreatedAt(latestPost.created_at);
      }
    } catch (error) {
      console.error("포스트 Fetch 에러:", error.message);
      showToast_("포스트를 가져오는데 실패했습니다");
    } finally {
      setLoading(false);
      isFetching = false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
          if (!loading) fetchPosts();
        }
      }, 300); // 300ms 디바운싱
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, lastCreatedAt, hasMore]);

  return (
    <div className="default-container">
      <div className="posts-container">
        <div className="title">
          <span className="normal-weight"></span>
        </div>
        <Button
          type="round"
          size="base"
          className="make-post"
          onClick={() => navigate("/make_post")}
        >
          게시글 작성
        </Button>
        {posts.map((post) => (
          <PostBox key={post.post_id} post={post} />
        ))}
        {loading && <p>Loading...</p>}
        {!hasMore && <p>끝!</p>}
      </div>
    </div>
  );
};

export default Posts;
