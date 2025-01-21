import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostForm.css";
import Button from "./Buttons";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../utils/constants";
import { showToast_ } from "./Toast";

const PostEditForm = ({ postId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
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
          setTitle(postData.title);
          setContent(postData.content);
          if (postData.image_path) {
            const imageUrl = `http://localhost:8000/api/v1/upload/${postData.image_path}`;
            setSelectedImage(imageUrl);
            setOriginalImage(imageUrl);
          }
        } catch (error) {
          console.error("포스트 Fetch 에러:", error.message);
          showToast_("포스트를 가져오는데 실패했습니다");
        }
      };
      fetchPostData();
    } else {
      setTitle("");
      setContent("");
      setSelectedImage(null);
      setOriginalImage(null);
    }
  }, [postId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        // 검증 로직
        if (file.size > MAX_FILE_SIZE) {
          console.error("파일 크기는 5MB 이하여야 합니다");
          showToast_("파일 크기는 5MB 이하여야 합니다");
        }

        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          console.error("지원하지 않는 이미지 형식입니다");
          showToast_("지원하지 않는 이미지 형식입니다");
        }
        setSelectedImage(URL.createObjectURL(file)); // 선택된 이미지 URL
        setImage(file); // 이미지 파일 선택
      } catch (error) {
        console.error(error.message);
      }
    }
  };

  const validateTitle = (value) => {
    return value && value.length <= 26;
  };

  const validateContent = (value) => {
    return value && value.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isTitleValid = validateTitle(title);
    const isContentValid = validateContent(content);

    if (!isTitleValid || !isContentValid) {
      setHelperText("제목과 내용을 모두 입력해주세요.");
    }

    let postImageUrl = originalImage ? originalImage.split("/").pop() : null;

    // 이미지 업로드
    if (image && image !== originalImage) {
      try {
        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch(`/api/v1/upload/post-images`, {
          method: "POST",
          body: formData,
        });

        if (response.status === 401) {
          console.error("로그인이 필요합니다.");
          showToast_("로그인이 필요합니다.");
          // 페이지 새로고침
          setTimeout(() => {
            window.location.reload();
          }, 3000); // 3초 후 새로고침
        } else if (!response.ok) {
          console.error("이미지 업로드 실패");
        }

        const data = await response.json();
        postImageUrl = data.url;
        console.log("이미지 업로드 성공:", data);
      } catch (error) {
        console.error("이미지 업로드 실패:", error.message);
        showToast_("이미지 업로드에 실패했습니다.");
      }
    }

    // 게시물 등록 또는 수정 요청
    try {
      console.log(
        "title, content, postImageUrl:",
        title,
        content,
        postImageUrl
      );
      const method = postId ? "PUT" : "POST";
      const url = postId ? `/api/v1/posts/${postId}` : `/api/v1/posts`;
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          image_path: postImageUrl || null,
        }),
      });

      if (response.status === 401) {
        console.error("로그인이 필요합니다.");
        showToast_("로그인이 필요합니다.");
        // 페이지 새로고침
        setTimeout(() => {
          window.location.reload();
        }, 3000); // 3초 후 새로고침
      } else if (!response.ok) {
        console.error(postId ? "게시물 수정 실패" : "게시물 등록 실패");
        showToast_(postId ? "게시물 수정 실패" : "게시물 등록 실패");
      }

      const responseData = await response.json();
      const newPostId = responseData.post_id.post_id || postId;
      navigate(`/post/${newPostId}`);
    } catch (error) {
      console.error(error.message);
      // setHelperText("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <form className="post-edit-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목*</label>
          <div className="grey-line"></div>
          <input
            type="text"
            id="title"
            name="title"
            className="padding-topbottom"
            placeholder="제목을 입력해주세요 (최대 26글자)"
            maxLength="26"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="grey-line"></div>
        </div>
        <div className="form-group">
          <label htmlFor="content">내용*</label>
          <div className="grey-line"></div>
          <textarea
            id="content"
            name="content"
            className="padding-topbottom"
            rows="12"
            placeholder="내용을 입력해주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div className="grey-line"></div>
        </div>
        <div
          className={`helper-text ${helperText ? "show" : ""}`}
          id="edit-message"
        >
          {helperText}
        </div>
        <div className="form-group">
          <label htmlFor="image">이미지</label>
          <div className="image-select">
            <input
              type="file"
              id="post-image"
              accept="image/*"
              className="post-image-input"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            {selectedImage ? (
              <div className="image-preview">
                <img
                  src={selectedImage}
                  alt="미리보기 이미지"
                  className="selected-image-preview"
                  onClick={() => document.getElementById("post-image").click()} // 미리보기 이미지 클릭 시 파일 선택 인풋 클릭
                  style={{ cursor: "pointer" }} // 커서 스타일 변경
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => document.getElementById("post-image").click()}
              >
                파일 선택
              </button>
            )}
          </div>
        </div>
        <Button
          type="submit"
          size="post"
          className={title && content ? "btn-valid" : "btn-invalid"}
        >
          {postId ? "수정하기" : "완료"}
        </Button>
      </form>
    </>
  );
};

export default PostEditForm;
