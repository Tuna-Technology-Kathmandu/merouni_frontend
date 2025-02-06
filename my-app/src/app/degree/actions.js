// services.js
export const fetchDegrees = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/program');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  };