import { authFetch } from "@/app/utils/authFetch"

export async function applyToConsultancy({ payload }) {
  const response = await authFetch(
    `${process.env.baseUrl}/consultancy-application/apply`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Something went wrong. Please try again.')
  }

  return {
    success: true,
    data,
    message: data.message || 'Application Submitted Successfully'
  }
}
