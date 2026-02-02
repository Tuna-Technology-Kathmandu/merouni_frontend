export const authFetch = async (url) => {
  try {
    // Get the stored refresh token
    const refreshToken = localStorage.getItem('refreshToken')

    // First attempt with current token
    let response = await fetch(url, {
      credentials: 'include', // Important for cookies
      headers: {
        'x-refresh-token': refreshToken
      }
    })

    // If unauthorized, try one more time to let middleware refresh the token
    if (response.status === 401 || response.status === 403) {

      const newResponse = await fetch(url, {
        credentials: 'include',
        headers: {
          'x-refresh-token': refreshToken
        }
      })


      if (!newResponse.ok) {
        // if (newResponse.status === 401) {
        //   // Clear tokens on authentication failure
        //   localStorage.removeItem('refreshToken')
        //   throw new Error('Session expired. Please login again.')
        // }
        if (newResponse.status === 401 || newResponse.status === 403) {
          // Clear all storage and redirect to logout
          localStorage.clear()
          window.location.href = '/sign-in' // Change this to your actual logout route
          return // Stop further execution
        }
        throw new Error(`Request failed with status ${newResponse.status}`)
      }

      return newResponse
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return response
  } catch (error) {
    console.error('Auth Fetch Error:', error)
    throw error
  }
}
