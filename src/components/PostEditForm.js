import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostForm.css";
import Button from "./Buttons";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../utils/constants";

const PostEditForm = ({ postId }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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
          if (postData.image) {
            setImage(postData.image);
          }
        } catch (error) {
          console.error("포스트 Fetch 에러:", error.message);
        }
      };
      fetchPostData();
    }
  }, [postId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 검증 로직
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("파일 크기는 5MB를 넘을 수 없습니다.");
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        throw new Error("이미지 파일만 업로드할 수 있습니다.");
      }
    }

    setSelectedImage(URL.createObjectURL(file)); // 선택된 이미지 URL
    setImage(file); // 이미지 파일 선택
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

    if (isTitleValid && isContentValid) {
      console.log("게시물 수정 요청:", { title, content });
    } else {
      setHelperText("제목과 내용을 모두 입력해주세요.");
    }

    try {
      let postImageUrl = image;
      // 이미지가 선택된 경우 추가
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", image);

        const response = await fetch(`/api/v1/upload/post-images`, {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("이미지 업로드 실패");
        }
        const data = await response.json();
        postImageUrl = data.url;
        console.log("이미지 업로드 성공:", postImageUrl);
      }

      // 게시물 등록 또는 수정 요청
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

      if (!response.ok) {
        throw new Error(postId ? "게시물 수정 실패" : "게시물 등록 실패");
      }

      navigate(`/posts`);
    } catch (error) {
      console.error(error.message);
      setHelperText("오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <form className="edit-form" onSubmit={handleSubmit}>
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
          <input
            type="file"
            src={selectedImage}
            id="post-image"
            accept="image/*"
            className="post-image-input"
            onChange={handleFileChange}
          />
        </div>
        <Button
          type="submit"
          size="post"
          className={title && content ? "btn-valid" : "btn-invalid"}
          onClick={() => console.log("포스트 제출")}
        >
          {postId ? "수정하기" : "완료"}
        </Button>
      </form>
    </>
  );
};

export default PostEditForm;
