'use server'



let url = `${process.env.baseUrl}/category`

export async function fetchCategories(page = 1, limit = 1000) {
  try {
    const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

export async function createCategory(data) {
  try {
    const response = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to create category')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating category:', error)
    throw error
  }
}

export async function updateCategory(categoryId, data) {
  try {
    const response = await fetch(`${url}?category_id=${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error('Failed to update category')
    }

    return await response.json()
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export async function deleteCategory(categoryId) {
  try {
    const response = await fetch(`${url}?category_id=${categoryId}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Failed to delete category')
    }
    const category = await response.json()

    return category
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}
