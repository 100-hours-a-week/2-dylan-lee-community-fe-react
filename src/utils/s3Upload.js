export const uploadToS3 = async (file, category) => {
  const fileName = encodeURIComponent(file.name);
  const fileType = file.type;

  try {
    // Presigned URL 요청
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/v1/upload/generate-presigned-url?fileName=${fileName}&fileType=${fileType}&category=${category}`
    );
    const { uploadURL, newFileName } = await res.json();

    // S3로 파일 업로드
    await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": fileType },
    });

    return newFileName;
  } catch (error) {
    console.error("업로드 실패:", error);
  }
};
