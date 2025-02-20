function formatCount(count) {
  if (count >= 100000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  if (count >= 10000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}k`;
  }
  return count;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function titleOverflow(title) {
  if (!title) {
    return "";
  }
  if (title.length > 26) {
    return `${title.slice(0, 26)}...`;
  }
  return title;
}

function formatContentAsParagraphs(content, classNames = "") {
  if (!content) {
    return []; // content가 undefined인 경우 빈 배열 반환
  }
  const paragraphs = content.split("\n").map((paragraph, index) => (
    <p key={index} className={classNames}>
      {paragraph}
    </p>
  ));
  return paragraphs;
}

function convertTime(date) {
  const utcDate = new Date(date);
  return utcDate.toISOString(); // ISO 8601 포맷으로 반환
}

function getImageUrl(image_path) {
  if (!image_path) {
    return `/assets/images/default_profile.jpeg`; // 기본 이미지 경로
  }
  const address = `${process.env.REACT_APP_CLOUDFRONT_URL}/images/${image_path}`;
  return address;
}

export {
  formatCount,
  formatDate,
  titleOverflow,
  formatContentAsParagraphs,
  convertTime,
  getImageUrl,
};
