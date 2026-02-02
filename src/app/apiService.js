// apiService.js
import { DotenvConfig } from '../config/env.config'
class ApiService {
  constructor(endpoint) {
    this.baseUrl = `${DotenvConfig.NEXT_APP_API_BASE_URL}/${endpoint}`
  }

  buildUrl(baseUrl, params) {
    if (!params) return baseUrl

    if (typeof params === 'string') {
      return `${baseUrl}?${params}`
    }

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value)
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${baseUrl}?${queryString}` : baseUrl
  }

  async getAll(params = {}) {
    try {
      console.log(this.baseUrl, "this.baseUrlthis.baseUrlthis.baseUrl")
      // const url = queryParams ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
      const url = this.buildUrl(this.baseUrl, params)
      const response = await fetch(url, {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API error:', error)
      throw new Error(`Failed to fetch ${this.baseUrl}`)
    }
  }

  async getById(id, params = {}) {
    try {
      // const url = `${this.baseUrl}/${id}${
      //   queryParams ? `?${queryParams}` : ""
      // }`;
      const url = this.buildUrl(`${this.baseUrl}/${id}`, params)
      const response = await fetch(url, {
        cache: 'no-store'
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Failed to fetch item with id ${id}`)
    }
  }

  async getBySlug(slug, params = {}) {
    try {
      const url = this.buildUrl(`${this.baseUrl}/${slug}`, params)
      const response = await fetch(url, {
        cache: 'no-store'
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API error:', error)
      throw new Error(`Failed to fetch item with slug ${slug}`)
    }
  }

  async create(data) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Failed to create item`)
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${this.baseUrl}?${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Failed to update item with id ${id}`)
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}?${id}`, {
        method: 'DELETE'
      })
      return await response.json()
    } catch (error) {
      throw new Error(`Failed to delete item with id ${id}`)
    }
  }
}

// Create instances
const services = {
  university: new ApiService('university'),
  scholarship: new ApiService('scholarship'),
  program: new ApiService('program'),
  course: new ApiService('course'),
  faculty: new ApiService('faculty'),
  event: new ApiService('event'),
  blogs: new ApiService('blogs'),
  vacancy: new ApiService('vacancy'),
  news: new ApiService('news'),
  banner: new ApiService('banner'),
  exam: new ApiService('exam'),
  newsletter: new ApiService('newsletter'),
  college: new ApiService('college'),
  category: new ApiService('category'),
  discipline: new ApiService('discipline')
}

export default services
