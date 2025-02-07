// authFetch.js
export const authFetch = async (url, options = {}) => {
  try {
    // Get the stored refresh token
    const refreshToken = localStorage.getItem("refreshToken");

    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...options.headers,
        "x-refresh-token": refreshToken,
      },
    });


    // If response is 401 (Unauthorized) or 403 (Forbidden), token might be expired
    if (response.status === 401 || response.status === 403) {
      const newResponse = await fetch(url, {
        ...options,
        credentials: "include",
        headers: {
          ...options.headers,
          "x-refresh-token": refreshToken,
        },
      });

      // Update refresh token if provided in response headers
      const newRefreshToken = newResponse.headers.get("x-refresh-token");
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      return newResponse;
    }

    return response;
  } catch (error) {
    console.error("Auth Fetch Error:", error);
    throw error;
  }
};
