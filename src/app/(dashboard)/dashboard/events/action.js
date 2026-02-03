'use server'
import { authFetch } from '@/app/utils/authFetch'

let url = `${process.env.baseUrl}/event`

export async function fetchEvents(page = 1, limit = 10) {
  try {
    const response = await fetch(`${url}?limit=${limit}&page=${page}`, {
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



export async function createEvent(data) {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const responseData = await response.json()

    if (!response.ok) {
      // Throw error with server message if available
      throw new Error(responseData.message || 'Failed to create event')
    }

    return responseData
  } catch (error) {
    console.error('Error creating event:', error)
    // Include the original error message in the thrown error
    throw new Error(error.message || 'Network error occurred')
  }
}

export async function updateEvent(eventId, data) {
  try {
    const response = await authFetch(`${url}?event_id=${eventId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update event')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating event:', error)
    throw error
  }
}

export async function deleteEvent(eventId) {
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }
    const event = await response.json()

    return event
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
