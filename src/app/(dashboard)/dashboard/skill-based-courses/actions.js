'use server'

import { DotenvConfig } from "@/config/env.config"

const API_URL = `${DotenvConfig.NEXT_APP_API_BASE_URL}/skills-based-courses`

export async function fetchPublicSkillCourses({ q = '', page = 1, limit = 20 } = {}) {
    try {
        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(q && { q })
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
        // Assuming backend supports fetching by slug or ID via same endpoint or specialized one.
        // Usually it's /skill-course/slug or /skill-course?slug=slug
        // Based on Dashboard action: `${DotenvConfig.NEXT_APP_API_BASE_URL}/skill-course/${slug}` logic usually works if backend supports it.
        // Dashboard actions doesn't show fetch by slug explicitly but update/delete uses ?id=.
        // However, typically detailed view is supported. I'll try /skill-course/:slug or /skill-course?slug=:slug
        // Let's assume /skill-course/:slug pattern as typically used in this project rest (e.g. program)

        // Check program action: `${DotenvConfig.NEXT_APP_API_BASE_URL}/program/${slug}`.
        // So likely `/skill-course/${slug}`

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
