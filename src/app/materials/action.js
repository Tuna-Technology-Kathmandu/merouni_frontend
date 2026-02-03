'use server'


export async function getMaterialsByCategory(
  page = 1,
  search = '',
  categoryId = null
) {
  try {
    let url = `${process.env.baseUrl}/material/category?page=${page}&limit=12`
    if (search) {
      url += `&q=${encodeURIComponent(search)}`
    }
    // Always include category_id filter when categoryId is provided
    if (categoryId !== null && categoryId !== undefined) {
      // Handle unlisted category (materials without category)
      if (categoryId === 'unlisted') {
        url += `&category_id=null`
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

export async function getMaterialCategories() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}/material-category?page=1&limit=100`,
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
