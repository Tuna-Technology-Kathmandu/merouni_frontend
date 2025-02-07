// utils/apiAuth.js
export const apiAuth = async (url, options = {}) => {
    try {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
  
      // First attempt with current access token from cookies
      let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...options.headers,
          'x-refresh-token': refreshToken, // Send refresh token in headers
        },
      });
  
      // If response is 401 or 403, token might be expired
      if (response.status === 401 || response.status === 403) {
        // Attempt token refresh with a PUT request
        const refreshResponse = await fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            ...options.headers,
            'x-refresh-token': refreshToken, // Use stored refresh token
          },
        });
  
        if (!refreshResponse.ok) {
          throw new Error('Token refresh failed');
        }
  
        // Update refresh token if a new one is provided in response headers
        const newRefreshToken = refreshResponse.headers.get('x-refresh-token');
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }
  
        return refreshResponse;
      }
  
      return response;
    } catch (error) {
      console.error('API Auth Error:', error);
      throw error;
    }
  };
  