'use server'

const BASE_URL = process.env.baseUrl

export async function getRankingsByDegreeSlug(slug) {
  try {
    // We can use the existing ranking endpoint which returns grouped rankings 
    // and filter by the degree slug.
    const response = await fetch(`${BASE_URL}/college-ranking?limit=100`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Failed to fetch rankings')
    
    const data = await response.json()
    const rankings = data.items || []
    
    // Find the degree group that matches the slug
    const degreeGroup = rankings.find(g => g.degree?.slug === slug)
    return degreeGroup || null
  } catch (error) {
    console.error('getRankingsByDegreeSlug error:', error)
    return null
  }
}
