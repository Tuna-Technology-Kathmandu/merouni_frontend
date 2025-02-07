export async function getConsultancies(page = 1) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/consultancy?sort=desc`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch consultancies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching consultancies:", error);
    throw error;
  }
}
