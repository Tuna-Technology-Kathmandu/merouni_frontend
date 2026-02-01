'use server'

import { DotenvConfig } from "@/config/env.config"


let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/video`

export async function fetchMedias(page = 1, limit = 1000, search = '') {
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
    console.log(response, "YOYO")

    if (!response.ok) {
      throw new Error('Failed to fetch media')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching media:', error)
    throw error
  }
}



export async function getMediaBySlug(slug) {
  try {
    const response = await fetch(`${url}?slug=${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch media details')
    }

    const data = await response.json()
    return data.items ? data.items[0] : data
  } catch (error) {
    console.error('Error fetching media details:', error)
    return null
  }
}

export async function createMedia(data) {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create media')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating media:', error)
    throw error
  }
}

export async function updateMedia(mediaId, data) {
  try {
    const response = await fetch(`${url}?media_id=${mediaId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update media')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating media:', error)
    throw error
  }
}

export async function deleteMedia(mediaId) {
  try {
    const response = await fetch(`${url}?media_id=${mediaId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete media')
    }
    const res = await response.json()
    return res
  } catch (error) {
    console.error('Error deleting media:', error)
    throw error
  }
}
