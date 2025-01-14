import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostBox from "../components/PostBox";
import Button from "../components/Buttons";
import "../styles/Posts.css";
import { convertTime } from "../utils/utils";

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

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const newPosts = await response.json();

      setPosts((prevPosts) => {
        const uniquePosts = [
          ...prevPosts,
          ...newPosts.filter(
            (newPost) =>
              !prevPosts.some(
                (prevPost) => prevPost.created_at === newPost.created_at
              )
          ),
        ];
        return uniquePosts;
      });

      if (newPosts.length < limit) {
        setHasMore(false);
      }

      if (newPosts.length > 0) {
        const oldestPost = newPosts.reduce((oldest, post) =>
          new Date(post.created_at) < new Date(oldest.created_at)
            ? post
            : oldest
        );
        setLastCreatedAt(oldestPost.created_at);
      }
    } catch (error) {
      console.error("포스트 Fetch 에러:", error.message);
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
          <span className="normal-weight">
            안녕하세요,
            <br />
            아무 말 대잔치
            <strong> 게시판</strong> 입니다.
          </span>
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
        {!hasMore && <p>모든 포스트를 불러왔습니다.</p>}
      </div>
    </div>
  );
};

export default Posts;
