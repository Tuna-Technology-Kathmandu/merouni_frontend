


  export async function getExams() {
    try {
      const response = await fetch(`${process.env.baseUrl}${process.env.version}/exam/`, {
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
  