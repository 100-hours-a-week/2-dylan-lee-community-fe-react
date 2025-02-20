import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PostForm.css";
import Button from "./Buttons";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "../utils/constants";
import { getImageUrl } from "../utils/utils";
import { uploadToS3 } from "../utils/s3Upload";
import { showToast_ } from "./Toast";
import api from "../utils/api";

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
          const response = await api.get(`/api/v1/posts/${postId}`);
          const postData = response;
          setTitle(postData.title);
          setContent(postData.content);
          if (postData.image_path) {
            const imageUrl = getImageUrl(postData.image_path);
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
        postImageUrl = await uploadToS3(image, "post");
      } catch (error) {
        console.error("이미지 업로드 실패:", error.message);
        showToast_("이미지 업로드에 실패했습니다.");
        return;
      }
    }

    // 게시물 등록 또는 수정 요청
    try {
      const method = postId ? "PUT" : "POST";
      const url = postId ? `/api/v1/posts/${postId}` : `/api/v1/posts`;

      const response = await api({
        method,
        url,
        data: {
          title,
          content,
          image_path: postImageUrl || null,
        },
      });

      if (response) {
        const newPostId = response.post_id.post_id || postId;
        navigate(`/post/${newPostId}`);
      } else {
        console.error("포스트 저장 실패");
        showToast_("포스트 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("포스트 저장 실패:", error.message);
      showToast_("포스트 저장에 실패했습니다.");
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
