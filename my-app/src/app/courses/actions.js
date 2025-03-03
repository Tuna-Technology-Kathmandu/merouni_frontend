import axios from "axios";

export const fetchCourses = async (
  credits = "",
  duration = "",
  faculty = ""
) => {
  try {
    const params = {};
    if (credits) params.credits = credits;
    if (duration) params.duration = duration;
    if (faculty) params.faculty = faculty;

    const response = await axios.get(
      `${process.env.baseUrl}${process.env.version}/course`,
      { params }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
