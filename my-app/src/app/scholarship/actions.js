// actions.js
export const fetchScholarships = async (search = "") => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/scholarship?q=${search}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};
