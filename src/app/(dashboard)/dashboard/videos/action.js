'use server'

import { DotenvConfig } from "@/config/env.config"


let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/video`

export async function fetchVideos(page = 1, limit = 1000, search = '') {
  try {
    const urlWithParams = new URL(url)
    urlWithParams.searchParams.append('page', page)
    urlWithParams.searchParams.append('limit', limit)
    if (search) {
      urlWithParams.searchParams.append('q', search)
    }

    const response = await fetch(urlWithParams.toString(), {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch videos')
    }
    // console.log(await response.json(),"JSON")

    return await response.json()
  } catch (error) {
    console.error('Error fetching videos:', error)
    throw error
  }
}



export async function getVideoBySlug(slug) {
  try {
    const response = await fetch(`${url}?slug=${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch video details')
    }

    const data = await response.json()
    return data.items ? data.items[0] : data
  } catch (error) {
    console.error('Error fetching video details:', error)
    return null
  }
}

export async function createVideo(data) {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create video')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating video:', error)
    throw error
  }
}

export async function updateVideo(videoId, data) {
  try {
    const response = await fetch(`${url}?video_id=${videoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update video')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating video:', error)
    throw error
  }
}

export async function deleteVideo(videoId) {
  try {
    const response = await fetch(`${url}?video_id=${videoId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete video')
    }
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error deleting video:', error)
    throw error
  }
}
