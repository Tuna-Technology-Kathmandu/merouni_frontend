'use server'

import { DotenvConfig } from "@/config/env.config"

const API_URL = `${DotenvConfig.NEXT_APP_API_BASE_URL}/skills-based-courses`

export async function fetchSkillsCourses(page = 1, limit = 10) {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit
        })

        const response = await fetch(`${API_URL}?${queryParams}`, {
            cache: 'no-store'
        })

        if (!response.ok) {
            if (response.status === 404) return { items: [], pagination: {} }
            throw new Error('Failed to fetch skills courses')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching skills courses:', error)
        return { items: [], pagination: {} }
    }
}
