import { authFetch } from '@/app/utils/authFetch'
import { DotenvConfig } from '@/config/env.config'

let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs`

export async function fetchBlogs(page = 1, limit = 10, status = '') {
  try {
    let query = `${url}?limit=${limit}&page=${page}`
    if (status && status !== 'all') {
      query += `&status=${status}`
    }
    const response = await fetch(query, {
      cache: 'no-store'
    })
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

export async function deleteBlogs(eventId) {
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }
    const blogs = await response.json()

    return blogs
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
