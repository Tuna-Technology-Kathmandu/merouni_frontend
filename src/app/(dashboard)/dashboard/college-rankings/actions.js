'use client'

import { authFetch } from '@/app/utils/authFetch'

const BASE_URL = process.env.baseUrl

export async function fetchRankings() {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking?limit=100`)
        if (!response.ok) throw new Error('Failed to fetch rankings')
        const data = await response.json()
        return Array.isArray(data) ? data : (data.items || [])
    } catch (error) {
        console.error('fetchRankings error:', error)
        throw error
    }
}

export async function addRanking(degreeId, collegeId, description) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ degree_id: degreeId, college_id: collegeId, description })
        })
        if (!response.ok) {
            const errData = await response.json()
            throw new Error(errData.message || 'Failed to add ranking')
        }
        return await response.json()
    } catch (error) {
        console.error('addRanking error:', error)
        throw error
    }
}

export async function deleteDegreeRankings(degreeId) {
    try {
        const response = await authFetch(
            `${BASE_URL}/college-ranking/degree?degree_id=${degreeId}`,
            { method: 'DELETE' }
        )
        if (!response.ok) throw new Error('Failed to delete rankings')
        return await response.json()
    } catch (error) {
        console.error('deleteDegreeRankings error:', error)
        throw error
    }
}

export async function deleteRanking(rankingId) {
    try {
        const response = await authFetch(
            `${BASE_URL}/college-ranking?ranking_id=${rankingId}`,
            { method: 'DELETE' }
        )
        if (!response.ok) throw new Error('Failed to delete ranking')
        return await response.json()
    } catch (error) {
        console.error('deleteRanking error:', error)
        throw error
    }
}

export async function updateRankingOrder(degreeId, rankings) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking/order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ degree_id: degreeId, rankings })
        })
        if (!response.ok) throw new Error('Failed to update ranking order')
        return await response.json()
    } catch (error) {
        console.error('updateRankingOrder error:', error)
        throw error
    }
}

export async function updateDegreeOrder(degreeOrders) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking/degree-order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ degreeOrders })
        })
        if (!response.ok) throw new Error('Failed to update degree order')
        return await response.json()
    } catch (error) {
        console.error('updateDegreeOrder error:', error)
        throw error
    }
}

export async function fetchDegrees(query = '') {
    try {
        const response = await authFetch(`${BASE_URL}/degree?limit=1000${query ? `&q=${query}` : ''}`)
        if (!response.ok) throw new Error('Failed to fetch degrees')
        const data = await response.json()
        return data.items || []
    } catch (error) {
        console.error('fetchDegrees error:', error)
        throw error
    }
}

export async function fetchColleges(degreeId, query = '') {
    try {
        if (!degreeId) return []
        const params = new URLSearchParams({
            limit: '100'
        })
        if (query) params.append('q', query)

        const response = await authFetch(`${BASE_URL}/college?${params.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch colleges')
        const data = await response.json()
        return data.items || []
    } catch (error) {
        console.error('fetchColleges error:', error)
        throw error
    }
}
