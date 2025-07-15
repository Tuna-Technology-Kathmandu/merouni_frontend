'use server'

export async function getItems(title) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/home-post?title=${title}`,
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
      `${process.env.baseUrl}${process.env.version}/college?pinned=true&page=1&limit=6`,
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

export async function getBanner(page = 1, limit = 99999999) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/banner?page=${page}&limit=${limit}`,
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
      `${process.env.baseUrl}${process.env.version}/event?is_featured=true&limit=99999`,
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
