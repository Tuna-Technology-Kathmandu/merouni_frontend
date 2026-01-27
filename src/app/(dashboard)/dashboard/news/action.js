import { authFetch } from '@/app/utils/authFetch'
let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs`

export async function fetchNews(page = 1, limit = 10) {
  try {
    const response = await fetch(`${url}?limit=${limit}&page=${page}`, {
      cache: 'no-store'
    })
    console.log(`Response: ${response}`)
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

// action.js
export const fetchTags = async () => {
  try {
    // Log the full URL being called
    const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/tag`
    console.log('Fetching tags from URL:', url)

    const response = await authFetch(url)

    // Add better error handling
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('Tags data received:', data)
    return data
  } catch (error) {
    console.error('Error in fetchTags:', error)
    throw error
  }
}

export async function createNews(data) {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create category')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function updateNews(eventId, data) {
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update category')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteNews(eventId) {
  console.log('before deleteing')
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }
    console.log('just before deleteing')
    const hehe = await response.json()

    console.log(hehe)
    return hehe
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
