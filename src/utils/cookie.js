import api from "./api";

// 쿠키에서 특정 이름의 값을 가져오는 함수
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

// 쿠키에 값을 설정하는 함수
const setCookie = (name, value, days) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value || ""}${expires}; path=/`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const viewPost = async (postId) => {
  try {
    let viewedPosts = JSON.parse(getCookie("viewedPosts") || "{}");

    if (!viewedPosts[postId]) {
      // 서버에 조회수 증가 요청 보내기
      await api.post(`/api/v1/posts/${postId}/view`);

      // 쿠키에 조회 여부 저장
      viewedPosts[postId] = true;
      setCookie("viewedPosts", JSON.stringify(viewedPosts), 7); // 7일 동안 유지
    }
  } catch (error) {
    console.error("포스트 조회 에러:", error.message);
  }
};

export { getCookie, setCookie, deleteCookie, viewPost };
