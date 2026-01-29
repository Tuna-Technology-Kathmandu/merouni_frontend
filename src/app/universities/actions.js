import services from '@/app/apiService'

export const fetchUniversities = async (search = '', page = 1) => {
  const params = {
    q: search,
    page,
    limit: 15
  }
  return services.university.getAll(params)
}

export const getUniversityBySlug = async (slug) => {
  return services.university.getBySlug(slug)
}
