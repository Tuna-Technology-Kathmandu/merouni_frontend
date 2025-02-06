// actions.js
export const fetchScholarships = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/scholarship");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching scholarships:", error);
    throw error;
  }
};
