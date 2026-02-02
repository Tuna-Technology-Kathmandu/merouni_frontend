import { authFetch } from '../utils/authFetch'
import { DotenvConfig } from '../../config/env.config'

export async function getSiteConfig(params = {}) {
    try {
        const query = new URLSearchParams(params).toString()
        const url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/config${query ? `?${query}` : ''}`

        const response = await authFetch(url, {
            cache: 'no-store'
        })

        if (!response.ok) {
            throw new Error('Failed to fetch site configuration')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching site config:', error)
        throw error
    }
}

export async function updateSiteConfig(data) {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No authentication token provided')

        const response = await authFetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/config`, {
            method: 'POST', // Assuming POST for creating/updating config as getting started
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error('Failed to update site configuration')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating site config:', error)
        throw error
    }
}

export async function getConfigByType(type) {
    try {
        const response = await fetch(`${DotenvConfig.NEXT_APP_API_BASE_URL}/config/${type}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            // If 404, just return null or empty default
            if (response.status === 404) return null
            throw new Error(`Failed to fetch config for type: ${type}`)
        }

        return await response.json() // Expected to return { type, value } or similar object
    } catch (error) {
        console.error(`Error fetching config ${type}:`, error)
        return null // Fail gracefully for public pages
    }
}
