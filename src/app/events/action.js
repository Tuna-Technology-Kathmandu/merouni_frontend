'use server'

export async function getEvents(page = 1) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event?page=${page}&limit=9`,
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

export async function searchEvent(query) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event?q=${query}`,
      {
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to search events')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching events:', error)
    throw error
  }
}

export async function getThisWeekEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event/this-week`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch this week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching this week's events:", error)
    throw error
  }
}

export async function getNextWeekEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event/next-month`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error("Failed to fetch next week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching next week's events:", error)
    throw error
  }
}

export async function getEventBySlug(slug) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event/${slug}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch event details')
    }

    const data = await response.json()
    return data.item // Note the change from 'item' to 'event'
  } catch (error) {
    console.error('Error fetching event details:', error)
    throw error
  }
}

export async function getRelatedEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/event`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch related events')
    }

    const data = await response.json()
    return data.items // Fetch all events to use as related events
  } catch (error) {
    console.error('Error fetching related events:', error)
    throw error
  }
}

export async function getUnexpiredEvents() {
  try {
    const apiUrl = `${process.env.baseUrl}${process.env.version}/event/unexpired?limit=999`
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch events')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch events:', error)
    throw error
  }
}
