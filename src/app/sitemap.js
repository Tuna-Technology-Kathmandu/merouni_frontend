const BASE_URL = 'https://merouni.com'
const API_BASE = process.env.baseUrl

/**
 * Fetch items from a given API endpoint and map them to sitemap entries.
 * Returns an empty array on any error so the sitemap never crashes.
 */
async function getDynamicRoutes(apiEndpoint, pathPrefix, slugField = 'slug') {
    try {
        const response = await fetch(`${API_BASE}/${apiEndpoint}?limit=1000`, {
            cache: 'no-store',
        })
        if (!response.ok) return []
        const data = await response.json()
        const items = data?.items || []
        return items
            .filter((item) => item[slugField] || item.slugs || item.id)
            .map((item) => ({
                url: `${BASE_URL}/${pathPrefix}/${item[slugField] || item.slugs || item.id}`,
                lastModified: new Date(item.updatedAt || item.createdAt || new Date()),
                changeFrequency: 'weekly',
                priority: 0.6,
            }))
    } catch (error) {
        console.error(`Sitemap: Error fetching routes for /${pathPrefix}:`, error)
        return []
    }
}

export default async function sitemap() {
    // ─── Static Routes ───────────────────────────────────────────────────────
    const staticRoutes = [
        { path: '', priority: 1.0, changeFrequency: 'daily' },
        { path: '/universities', priority: 0.9, changeFrequency: 'daily' },
        { path: '/colleges', priority: 0.9, changeFrequency: 'daily' },
        { path: '/schools', priority: 0.9, changeFrequency: 'daily' },
        { path: '/consultancy', priority: 0.8, changeFrequency: 'daily' },
        { path: '/blogs', priority: 0.8, changeFrequency: 'daily' },
        { path: '/scholarship', priority: 0.8, changeFrequency: 'daily' },
        { path: '/events', priority: 0.8, changeFrequency: 'daily' },
        { path: '/news', priority: 0.8, changeFrequency: 'daily' },
        { path: '/vacancies', priority: 0.8, changeFrequency: 'daily' },
        { path: '/exams', priority: 0.8, changeFrequency: 'daily' },
        { path: '/courses', priority: 0.8, changeFrequency: 'daily' },
        { path: '/materials', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/degree', priority: 0.7, changeFrequency: 'daily' },
        { path: '/career', priority: 0.7, changeFrequency: 'daily' },
        { path: '/short-term-courses', priority: 0.7, changeFrequency: 'daily' },
        { path: '/watch', priority: 0.7, changeFrequency: 'weekly' },
        { path: '/admission', priority: 0.7, changeFrequency: 'monthly' },
        { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
        { path: '/disclaimer', priority: 0.4, changeFrequency: 'monthly' },
        { path: '/privacy-policy', priority: 0.4, changeFrequency: 'monthly' },
    ].map(({ path, priority, changeFrequency }) => ({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
    }))

    // ─── Dynamic Routes (fetched in parallel) ────────────────────────────────
    const [
        blogs,
        universities,
        colleges,
        schools,
        consultancies,
        scholarships,
        events,
        vacancies,
        programs,
        disciplines,
        degrees,
        careers,
        shortTermCourses,
    ] = await Promise.all([
        getDynamicRoutes('blogs', 'blogs', 'slug'),
        getDynamicRoutes('university', 'universities', 'slug'),
        getDynamicRoutes('college', 'colleges', 'slug'),
        getDynamicRoutes('school', 'schools', 'slug'),
        getDynamicRoutes('consultancy', 'consultancy', 'slug'),
        getDynamicRoutes('scholarship', 'scholarship', 'slug'),
        getDynamicRoutes('event', 'events', 'slug'),
        getDynamicRoutes('vacancy', 'vacancies', 'slug'),
        getDynamicRoutes('program', 'program', 'slug'),
        getDynamicRoutes('discipline', 'disciplines', 'slug'),
        getDynamicRoutes('degree', 'degree', 'slug'),
        getDynamicRoutes('career', 'career', 'slug'),
        getDynamicRoutes('skills-based-courses', 'short-term-courses', 'slug'),
    ])

    return [
        ...staticRoutes,
        ...blogs,
        ...universities,
        ...colleges,
        ...schools,
        ...consultancies,
        ...scholarships,
        ...events,
        ...vacancies,
        ...programs,
        ...disciplines,
        ...degrees,
        ...careers,
        ...shortTermCourses,
    ]
}
