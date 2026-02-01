'use server'

import { DotenvConfig } from "@/config/env.config"

const API_URL = `${DotenvConfig.NEXT_APP_API_BASE_URL}/skills-based-courses`

export async function fetchPublicSkillCourses({ q = '', page = 1, limit = 20, discipline = '' } = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(q && { q }),
            ...(discipline && { discipline })
        })

        const response = await fetch(`${API_URL}?${queryParams}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            // Fallback for empty list or error, verify if 404 is just no data
            if (response.status === 404) return { items: [], pagination: {} };
            throw new Error('Failed to fetch skill courses')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching public skill courses:', error)
        return { items: [], pagination: {} }
    }
}

export async function fetchSkillCourseBySlug(slug) {
    try {

        const response = await fetch(`${API_URL}/${slug}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            if (response.status === 404) return null
            throw new Error('Failed to fetch skill course details')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching skill course details:', error)
        return null
    }
}
