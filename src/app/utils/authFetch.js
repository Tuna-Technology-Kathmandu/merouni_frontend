export const authFetch = async (url, options = {}) => {
  try {
    // Get the stored refresh token
    const refreshToken = localStorage.getItem('refreshToken')

    // If no refresh token, likely logged out - don't make the request
    if (!refreshToken) {
      // Silently fail - don't throw error or redirect if already on sign-in page
      // let window.location.href = '/sign-in' if you want it to be automatic
      // but it causes loops in some cases where session is partial.
      // Return a response-like object that won't break calling code
      return {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ error: 'Not authenticated' }),
        text: async () => 'Not authenticated'
      }
    }

    // First attempt with current token
    let response = await fetch(url, {
      ...options,
      credentials: 'include', // Important for cookies
      headers: {
        ...options.headers,
        'x-refresh-token': refreshToken
      }
    })

    // Handle authentication errors (400, 401, 403) - might indicate invalid session
    if ([400, 401, 403].includes(response.status)) {
      // Check if refresh token still exists (might have been cleared during logout)
      const currentRefreshToken = localStorage.getItem('refreshToken')
      if (!currentRefreshToken) {
        // Session was cleared, likely during logout - handle gracefully
        // Don't throw error, just return the response
        return response
      }

      // If we still have a token, try one more time to let middleware refresh
      if (response.status === 401 || response.status === 403) {

        const newResponse = await fetch(url, {
          ...options,
          credentials: 'include',
          headers: {
            ...options.headers,
            'x-refresh-token': currentRefreshToken
          }
        })

        if (!newResponse.ok) {
          if (newResponse.status === 401 || newResponse.status === 403) {
            // Clear all storage and redirect to logout
            localStorage.clear()
            if (
              typeof window !== 'undefined' &&
              !window.location.pathname.includes('/sign-in')
            ) {
              // window.location.href = '/sign-in'
              console.warn('Session expired - redirection handled by guard or manual login');
            }
            return newResponse // Return without throwing
          }

          throw new Error(`Request failed with status ${newResponse.status}`)
        }
        return newResponse
      }

      // For 400 status during logout, return response without throwing
      // Check if we're in a logout scenario (no refresh token)
      if (response.status === 400 && !localStorage.getItem('refreshToken')) {
        return response
      }
    }

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        error?.message || `Request failed with status ${response.status}`
      )
    }
    return response
  } catch (error) {
    // Only log errors that aren't related to session invalidation or logout
    const isLogoutScenario = !localStorage.getItem('refreshToken')
    if (
      !isLogoutScenario &&
      !error.message?.includes('401') &&
      !error.message?.includes('403')
    ) {
      console.error('Auth Fetch Error:', error)
    }
    throw error
  }
}
