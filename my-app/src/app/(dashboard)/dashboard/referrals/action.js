import { authFetch } from "@/app/utils/authFetch";

export async function fetchReferrals(page = 1) {
  try {
    const response = await authFetch(
      `${process.env.baseUrl}${process.env.version}/referral?page=${page}`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch referrals");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
}
