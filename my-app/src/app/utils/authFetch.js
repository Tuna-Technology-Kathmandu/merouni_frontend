export const authFetch = async (url, options = {}) => {
  try {
    // Get the stored refresh token
    const refreshToken = localStorage.getItem("refreshToken");

    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      credentials: "include", // Important for cookies
      headers: {
        ...options.headers,
        "x-refresh-token": refreshToken,
      },
    });

    // If unauthorized, try one more time to let middleware refresh the token
    if (response.status === 401 || response.status === 403) {
      console.log("Token expired, attempting refresh...");

      const newResponse = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          "x-refresh-token": refreshToken,
        },
      });

      if (!newResponse.ok) {
        if (newResponse.status === 401) {
          // Clear tokens on authentication failure
          // localStorage.removeItem("refreshToken");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(`Request failed with status ${newResponse.status}`);
      }

      return newResponse;
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error("Auth Fetch Error:", error);
    throw error;
  }
};
