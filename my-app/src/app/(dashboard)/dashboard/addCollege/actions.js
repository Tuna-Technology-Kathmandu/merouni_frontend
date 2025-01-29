"use server";

export async function createCollege(data) {
  const response = await fetch("http://localhost:8000/api/v1/college", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create college");
  }

  return response.json();
}

export const fetchUniversities = async () => {
  try {
    const response = await fetch("http://localhost:8000/api/v1/university");
    if (!response.ok) {
      throw new Error("Failed to fetch universities");
    }
    const data = await response.json();
    return data.items; 
  } catch (error) {
    console.error(error);
    throw error;
  }
};
