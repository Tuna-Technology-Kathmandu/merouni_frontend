'use server'


export async function getMaterials(
  page = 1,
  search = '',
  categoryId = null
) {
  try {
    let url = `${process.env.baseUrl}/material?page=${page}&limit=12`
    if (search) {
      url += `&q=${encodeURIComponent(search)}`
    }
    // Include category_id filter if provided and not 'all'
    if (categoryId && categoryId !== 'all') {
      // Handle unlisted category (materials without category)
      if (categoryId === 'unlisted') {
        url += `&category_id=unlisted`
      } else {
        // Ensure categoryId is a valid number
        url += `&category_id=${categoryId}`
      }
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Materials')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching materials:', error)
    throw error
  }
}

// Kept for backward compatibility if needed, but getMaterials covers it
export async function getMaterialsByCategory(page, search, categoryId) {
  return getMaterials(page, search, categoryId)
}

export async function getMaterialCategories() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/category?type=MATERIAL&limit=100`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Material Categories')
    }
    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error('Error fetching material categories:', error)
    throw error
  }
}
