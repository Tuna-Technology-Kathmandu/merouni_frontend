import { authFetch } from "@/app/utils/authFetch"
import { DotenvConfig } from "@/config/env.config"

export async function applyToConsultancy({ payload }) {
  const response = await authFetch(
    `${DotenvConfig.NEXT_APP_API_BASE_URL}/consultancy-application/apply`,
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
