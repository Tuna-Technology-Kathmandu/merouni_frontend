// src/services/auth-api.service.js
import { authFetch } from './auth-fetch'

class AuthApiService {
  constructor(endpoint) {
    this.endpoint = endpoint
    this.baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL || process.env.baseUrl}${process.env.NEXT_PUBLIC_API_VERSION || process.env.version}/${endpoint}`
  }

  buildUrl(url, params) {
    if (!params) return url
    if (typeof params === 'string') return `${url}?${params}`

    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value)
      }
    })

    const queryString = searchParams.toString()
    return queryString ? `${url}?${queryString}` : url
  }

  async getAll(params = {}) {
    const url = this.buildUrl(this.baseUrl, params)
    const response = await authFetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  }

  async getById(id, params = {}) {
    const url = this.buildUrl(`${this.baseUrl}/${id}`, params)
    const response = await authFetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return await response.json()
  }

  async create(data) {
    const response = await authFetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }

  async update(id, data, params = {}) {
    let url = id ? `${this.baseUrl}/${id}` : this.baseUrl
    url = this.buildUrl(url, params)
    const response = await authFetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    return await response.json()
  }

  async delete(id, data = null, params = {}) {
    let url = id ? `${this.baseUrl}/${id}` : this.baseUrl
    url = this.buildUrl(url, params)
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }
    if (data) {
      options.body = JSON.stringify(data)
    }
    const response = await authFetch(url, options)
    return await response.json()
  }
}

const authServices = {
  user: new AuthApiService('users'),
  wishlist: new AuthApiService('wishlist'),
  profile: new AuthApiService('users/edit-profile')
}

export default authServices
