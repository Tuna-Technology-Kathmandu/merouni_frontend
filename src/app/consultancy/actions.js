
export async function getConsultancies(page = 1, searchQuery = '', courseId = '') {
  try {
    let url = `${process.env.baseUrl}/consultancy?page=${page}&sort=desc&q=${searchQuery}&limit=15`
    if (courseId) {
      url += `&courseId=${courseId}`
    }
    const response = await fetch(
      url,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch consultancies')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching consultancies:', error)
    throw error
  }
}

export async function getConsultancyBySlug(slugs) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/consultancy/${slugs}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch consultancy')
    }

    const data = await response.json()
    return data.consultancy || data
  } catch (error) {
    console.error('Error fetching consultancy:', error)
    throw error
  }
}

export async function getCourses() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/program?limit=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch courses')
    }

    const data = await response.json()
    return data.items
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

// check if already applied for consultancy
export async function checkIfConsultancyApplied(consultancyId, studentId) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/referral/check-if-already-applied-for-consultancy?consultancy_id=${consultancyId}&student_id=${studentId}`,
      {
        method: 'GET',
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return {
        error: errorData.error || errorData.message || 'Failed to check status'
      }
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error checking consultancy application status:', error)
    return { error: error.message }
  }
}
