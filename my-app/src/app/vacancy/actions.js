export async function getCareers(page = 1) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/blogs/?category_title=Vacancy`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch careers");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching careers:", error);
    throw error;
  }
}
