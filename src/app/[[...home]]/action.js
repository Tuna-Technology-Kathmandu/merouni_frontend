'use server'
import { DotenvConfig } from '../../config/env.config'

export async function getItems(title) {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/home-post?title=${title}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export async function getFeaturedCollege() {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/college?pinned=true&page=1&limit=6`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch featured colleges')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching colleges:', error)
    throw error
  }
}

export async function getBanner(page = 1, limit = 999) {
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

export async function getEvents() {
  try {
    const response = await fetch(
      `${DotenvConfig.NEXT_APP_API_BASE_URL}/event/unexpired?limit=999`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}
