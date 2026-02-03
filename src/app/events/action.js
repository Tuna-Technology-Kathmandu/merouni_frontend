'use server'


export async function getEvents(page = 1) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/event?page=${page}&limit=9`,
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

export async function getThisWeekEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/event/this-week`,
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
      `${process.env.baseUrl}/event/next-month`,
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
      `${process.env.baseUrl}/event/${slug}`,
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
      `${process.env.baseUrl}/event`,
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
    const apiUrl = `${process.env.baseUrl}/event/unexpired?limit=100`

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

export const fetchEvents = async (page = 1, collegeId = '') => {
  try {
    const url = new URL(`${process.env.baseUrl}/event`)
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 12)
    if (collegeId) {
      url.searchParams.append('college_id', collegeId)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching events:', error)
    throw error
  }
}

export const searchEvent = async (query, collegeId = '') => {
  try {
    const url = new URL(`${process.env.baseUrl}/event`)
    url.searchParams.append('q', query)
    if (collegeId) {
      url.searchParams.append('college_id', collegeId)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error(`Failed to search events: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching events:', error)
    throw error
  }
}

export const fetchThisWeekEvents = async (collegeId = '') => {
  try {
    const url = new URL(`${process.env.baseUrl}/event/this-week`)
    if (collegeId) url.searchParams.append('college_id', collegeId)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch this week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching this week's events:", error)
    throw error
  }
}

export const fetchNextWeekEvents = async (collegeId = '') => {
  try {
    const url = new URL(
      `${process.env.baseUrl}/event/next-month`
    )
    if (collegeId) url.searchParams.append('college_id', collegeId)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch next week's events")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching next week's events:", error)
    throw error
  }
}
