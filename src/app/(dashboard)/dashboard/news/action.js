import { authFetch } from '@/app/utils/authFetch'

const url = `${process.env.baseUrl}/news`

export async function fetchNews(page = 1, search = '') {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            limit: '10',
            sortBy: 'createdAt',
            order: 'DESC',
            ...(search && { search })
        })

        const response = await authFetch(`${url}?${queryParams}`)

        if (!response.ok) {
            throw new Error('Failed to fetch news')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching news:', error)
        throw error
    }
}

export async function createNews(newsData) {
    try {
        const response = await authFetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        })

        if (!response.ok) {
            throw new Error('Failed to create news')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating news:', error)
        throw error
    }
}

export async function updateNews(id, newsData) {
    try {
        const response = await authFetch(`${url}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newsData)
        })

        if (!response.ok) {
            throw new Error('Failed to update news')
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error updating news:', error)
        throw error
    }
}

export async function deleteNews(id) {
    try {
        const response = await authFetch(`${url}/${id}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error('Failed to delete news')
        }

        return true
    } catch (error) {
        console.error('Error deleting news:', error)
        throw error
    }
}

export async function getNewsById(id) {
    try {
        const response = await authFetch(`${url}/id/${id}`)
        if (!response.ok) {
            throw new Error('Failed to fetch news details')
        }

        const data = await response.json()
        return data.news || data.item || data
    } catch (error) {
        console.error('Error fetching news by slug:', error)
        throw error
    }
}


export async function getNewsBySlug(slug) {
    try {
        const response = await authFetch(`${url}/${slug}`)
        if (!response.ok) {
            throw new Error('Failed to fetch news details')
        }

        const data = await response.json()
        return data.news || data.item || data
    } catch (error) {
        console.error('Error fetching news by slug:', error)
        throw error
    }
}
