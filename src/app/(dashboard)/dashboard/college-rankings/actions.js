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

export async function addRanking(programId, collegeId) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ program_id: programId, college_id: collegeId })
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

export async function deleteProgramRankings(programId) {
    try {
        const response = await authFetch(
            `${BASE_URL}/college-ranking/program?program_id=${programId}`,
            { method: 'DELETE' }
        )
        if (!response.ok) throw new Error('Failed to delete rankings')
        return await response.json()
    } catch (error) {
        console.error('deleteProgramRankings error:', error)
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

export async function updateRankingOrder(programId, rankings) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking/order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ program_id: programId, rankings })
        })
        if (!response.ok) throw new Error('Failed to update ranking order')
        return await response.json()
    } catch (error) {
        console.error('updateRankingOrder error:', error)
        throw error
    }
}

export async function updateProgramOrder(programOrders) {
    try {
        const response = await authFetch(`${BASE_URL}/college-ranking/program-order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ programOrders })
        })
        if (!response.ok) throw new Error('Failed to update program order')
        return await response.json()
    } catch (error) {
        console.error('updateProgramOrder error:', error)
        throw error
    }
}

export async function fetchPrograms(query = '') {
    try {
        const response = await authFetch(`${BASE_URL}/program?limit=1000${query ? `&q=${query}` : ''}`)
        if (!response.ok) throw new Error('Failed to fetch programs')
        const data = await response.json()
        return data.items || []
    } catch (error) {
        console.error('fetchPrograms error:', error)
        throw error
    }
}

export async function fetchColleges(programId, query = '') {
    try {
        if (!programId) return []
        const params = new URLSearchParams({
            program_id: programId.toString(),
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
