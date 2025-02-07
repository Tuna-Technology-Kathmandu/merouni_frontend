// services.js
export const fetchCourses = async () => {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/course`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
