
export async function getAdmission(search = '', page = 1, program = '') {
  try {
    const url = new URL(`${process.env.baseUrl}/college/admission`)
    url.searchParams.append('q', search)
    url.searchParams.append('page', page)
    url.searchParams.append('limit', 15)
    if (program) url.searchParams.append('program', program)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Admission Details')
    }

    const data = await response.json()

    return {
      items: data.items || data,
      pagination: data.pagination || {
        currentPage: page,
        totalPages: Math.ceil((data.totalCount || data.length || 0) / 15),
        totalCount: data.totalCount || data.length || 0
      }
    }
  } catch (error) {
    console.error('Error fetching Admission details:', error)
    return {
      items: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
      }
    }
  }
}

export async function getAdmissionDetail(id) {
  try {
    const response = await fetch(`${process.env.baseUrl}/college/admission/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Admission Detail')
    }

    const data = await response.json()
    return data.item
  } catch (error) {
    console.error('Error fetching Admission detail:', error)
    return null
  }
}

export async function fetchPrograms() {
  try {
    const response = await fetch(`${process.env.baseUrl}/program?limit=100`)
    if (!response.ok) throw new Error('Failed to fetch programs')
    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching programs:', error)
    return []
  }
}
