import { authFetch } from '../utils/authFetch'
import { DotenvConfig } from '../../config/env.config'

export async function getContacts(page = 1, status = 'all', query = '') {
    try {
        let url = `${DotenvConfig.NEXT_APP_API_BASE_URL}/contact-us?page=${page}`
        if (status !== 'all') {
            url += `&status=${status}`
        }
        if (query) {
            url += `&q=${query}`
        }

        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No authentication token provided')

        const response = await authFetch(url, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        })

        if (!response.ok) {
            // Handle 404 gracefully if no contacts found yet
            if (response.status === 404) return { items: [], pagination: { currentPage: 1, totalPages: 1, total: 0 } }
            throw new Error('Failed to fetch contacts')
        }

        const data = await response.json()

        // Normalize response structure
        const pagination = data.pagination || {}
        return {
            items: data.items || data.data || [],
            pagination: {
                currentPage: pagination.currentPage || page,
                totalPages: pagination.totalPages || Math.ceil((data.total || (data.items || []).length) / 10) || 1,
                total: pagination.total || pagination.totalCount || data.total || (data.items || []).length
            }
        }
    } catch (error) {
        console.error('Error fetching contacts:', error)
        throw error
    }
}

export async function updateContact(id, data) {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No authentication token provided')

        const response = await authFetch(
            `${DotenvConfig.NEXT_APP_API_BASE_URL}/contact-us/update-status?id=${id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(data)
            }
        )

        if (!response.ok) {
            throw new Error('Failed to update contact status')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating contact:', error)
        throw error
    }
}

export async function deleteContact(id) {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) throw new Error('No authentication token provided')

        const response = await authFetch(
            `${DotenvConfig.NEXT_APP_API_BASE_URL}/contact-us/${id}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )

        if (!response.ok) {
            throw new Error('Failed to delete contact')
        }

        return true
    } catch (error) {
        console.error('Error deleting contact:', error)
        throw error
    }
}
