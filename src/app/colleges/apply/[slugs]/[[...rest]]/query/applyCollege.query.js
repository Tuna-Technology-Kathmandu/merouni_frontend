import { DotenvConfig } from "@/config/env.config"

export async function applyToCollege({ payload, isStudent }) {
  const response = await fetch(
    `${DotenvConfig.NEXT_APP_API_BASE_URL}/referral/self-apply`,
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
    throw new Error(data?.message || 'Something went wrong. Please try again.')
  }

  return {
    success: true,
    data,
    message: data.message || 'College Applied Successfully'
  }
}
