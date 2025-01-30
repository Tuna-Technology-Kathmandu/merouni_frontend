"use server";

export async function getMaterials() {
  try {
    const response = await fetch(
      `${process.env.localUrl}${process.env.version}/material`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Materials");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}
