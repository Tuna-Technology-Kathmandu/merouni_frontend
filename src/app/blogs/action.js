'use server'
import { DotenvConfig } from '../config/env.config'

export async function getNews() {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs?random=true`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch blogs')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching blogs:', error)
    throw error
  }
}

export async function getNewsBySlug(slug) {
  try {
    console.log(`${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs/${slug}`)
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    // console.log("response-------------------:", response.title);

    if (!response.ok) {
      throw new Error('Failed to fetch blogs details')
    }

    const data = await response.json()
    return data // Note the change from 'item' to 'event'
  } catch (error) {
    console.error('Error fetching blogs details:', error)
    throw error
  }
}

export async function getRelatedNews() {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/blogs`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch related blogs')
    }

    const data = await response.json()
    return data.items // Fetch all events to use as related events
  } catch (error) {
    console.error('Error fetching related blogs:', error)
    throw error
  }
}

export async function getBanner(page = 1, limit = 3) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/banner?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch banners')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching banners:', error)
    throw error
  }
}
