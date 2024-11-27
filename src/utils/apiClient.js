const BASE_URL = "http://localhost:8000/api/v1";

export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
  } = options;

  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => {
        throw new Error("API 요청 실패");
      });
      throw new Error(errorData.message || "API 요청 실패");
    }

    return response.json();
  } catch (error) {
    console.error("API 요청 중 에러 발생:", error);
    throw error;
  }
};
