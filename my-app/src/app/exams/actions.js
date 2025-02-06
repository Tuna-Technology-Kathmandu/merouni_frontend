


  export async function getExams() {
    try {
      const response = await fetch('http://localhost:8000/api/v1/exam/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch exams');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }
  