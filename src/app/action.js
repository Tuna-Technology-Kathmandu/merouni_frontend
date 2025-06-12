'use server'

import services from './apiService'
import { cookies } from 'next/headers'

// const cookieStore = await

// University actions
export async function getUniversities(queryParams) {
  return services.university.getAll(queryParams)
}

export async function createUniversity(data) {
  return services.university.create(data)
}

export async function updateUniversity(id, data) {
  return services.university.update(id, data)
}

export async function deleteUniversity(id) {
  return services.university.delete(id)
}

// Scholarship actions
export async function getScholarships(queryParams) {
  return services.scholarship.getAll(queryParams)
}

export async function createScholarship(data) {
  return services.scholarship.create(data)
}

export async function updateScholarship(id, data) {
  return services.scholarship.update(id, data)
}

export async function deleteScholarship(id) {
  return services.scholarship.delete(id)
}

// Program actions
export async function getPrograms(page, limit = 9, sort = 'asc') {
  // const q = `page=${queryParams}`
  const params = {
    page,
    limit,
    sort
  }
  return services.program.getAll(params)
}

export async function createProgram(data) {
  return services.program.create(data)
}

export async function updateProgram(id, data) {
  return services.program.update(id, data)
}

export async function deleteProgram(id) {
  return services.program.delete(id)
}

// Course actions
export async function getCourses(queryParams) {
  return services.course.getAll(queryParams)
}

export async function createCourse(data) {
  return services.course.create(data)
}

export async function updateCourse(id, data) {
  return services.course.update(id, data)
}

export async function deleteCourse(id) {
  return services.course.delete(id)
}

// Faculty actions
export async function getFaculties(queryParams) {
  return services.faculty.getAll(queryParams)
}

export async function createFaculty(data) {
  return services.faculty.create(data)
}

export async function updateFaculty(id, data) {
  return services.faculty.update(id, data)
}

export async function deleteFaculty(id) {
  return services.faculty.delete(id)
}

// Events actions
export async function getEvents(page) {
  const params = {
    page
  }
  return services.event.getAll(params)
}

//Blogs actions
export async function getBlogs(page, category_title) {
  // const q = `page=${queryParams}`;
  const params = {
    page,
    category_title
  }
  return services.news.getAll(params)
}

// get ranking
export async function getRankings(limit, page, category_title) {
  const params = {
    limit,
    page,
    category_title
  }
  return services.news.getAll(params)
}

export async function getToken() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if (!token) {
    return null
  }
  return token
}

// Banner Actions

export async function getBanners() {
  return services.banner.getAll()
}

export async function getBannersById(id) {
  const params = {
    id
  }
  return services.banner.getById(params)
}

export async function getColleges(
  isFeatured = null,
  pinned = null,
  limit = 10,
  page = 1
) {
  const params = {
    limit,
    page,
    isFeatured,
    pinned
  }
  return services.college.getAll(params)
}

// export async function getFeaturedColleges() {
//   try {
//     const response = await fetch(
//       `${process.env.baseUrl}${process.env.version}/college/featured-college`,
//       {
//         cache: 'no-store'
//       }
//     )

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`)
//     }

//     const data = await response.json()
//     return data
//   } catch (error) {
//     console.error('Error fetching featured colleges:', error)
//     throw error
//   }
// }

export async function getFilteredPinFeatColleges(
  is_featured = null,
  pinned = null,
  limit = 999999,
  page = 1
) {
  const params = {
    limit,
    page
  }

  if (is_featured !== null) {
    params.is_featured = !!is_featured
  }

  if (pinned !== null) {
    params.pinned = !!pinned
  }

  return services.college.getAll(params)
}

// exams section

export async function getExams(limit, page) {
  const params = {
    limit,
    page
  }
  return services.exam.getAll(params)
}

export async function getBannerById(id) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/banner/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Banner Details')
    }

    const data = await response.json()
    return data?.items || data
  } catch (error) {
    console.error('Error fetching banner details:', error)
    throw error
  }
}

// category section

export async function getCategories(queryParams) {
  return services.category.getAll(queryParams)
}

export async function createCategory(data) {
  return services.category.create(data)
}

export async function updateCategory(id, data) {
  return services.category.update(id, data)
}

export async function deleteCategory(id) {
  return services.category.delete(id)
}

// events create
export async function createEvent(data) {
  return services.event.create(data)
}
