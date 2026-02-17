import { authFetch } from "@/app/utils/authFetch"

export async function applyToCollege({ payload, token }) {
  const response = await authFetch(
    `${process.env.baseUrl}/referral/self-apply`,
    {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
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
