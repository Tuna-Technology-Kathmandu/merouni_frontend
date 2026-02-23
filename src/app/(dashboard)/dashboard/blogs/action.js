import { authFetch } from '@/app/utils/authFetch'

let url = `${process.env.baseUrl}/blogs`

export async function fetchBlogs(page = 1, limit = 10, status = '', options = {}) {
  try {
    let query = `${url}?limit=${limit}&page=${page}`
    if (status && status !== 'all') {
      query += `&status=${status}`
    }
    const response = await fetch(query, {
      cache: 'no-store',
      ...options
    })
    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    return await response.json()
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching blogs:', error);
    }
    throw error
  }
}

// action.js
export const fetchTags = async () => {
  try {
    // Log the full URL being called
    const url = `${process.env.baseUrl}/tag`

    const response = await authFetch(url)

    // Add better error handling
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in fetchTags:', error)
    throw error
  }
}

export async function createBlogs(data) {
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

export async function updateBlogs(eventId, data) {
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

