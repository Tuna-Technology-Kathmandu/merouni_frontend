// services.js
export const fetchDegrees = async () => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/program`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const getDegreeBySlug = async (slug) => {
  try {
    console.log("Fetching degree details for slug:", slug);
    console.log(`${process.env.baseUrl}${process.env.version}/program/${slug}`);
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/program/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch degree description");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching college details:", error);
    throw error;
  }
};
