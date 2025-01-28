"use server";

let url = `${process.env.baseUrl}${process.env.version}/faculty`;

export async function getAllFaculty() {
  try {
<<<<<<< HEAD
    const response = await fetch('http://localhost:8000/api/v1/faculty', {
      cache: 'no-store'
=======
    const response = await fetch(`${url}`, {
      cache: "no-store",
>>>>>>> abishek
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch faculty data");
  }
}

export async function createFaculty(data) {
  try {
<<<<<<< HEAD
    const response = await fetch('http://localhost:8000/api/v1/faculty', {
      method: 'POST',
=======
    const response = await fetch(`${url}`, {
      method: "POST",
>>>>>>> abishek
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to create faculty");
  }
}

export async function updateFaculty(id, data) {
  try {
<<<<<<< HEAD
    const response = await fetch(`http://localhost:8000/api/v1/faculty?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
=======
    const response = await fetch(
      `${url}?id=${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
>>>>>>> abishek
    return await response.json();
  } catch (error) {
    throw new Error("Failed to update faculty");
  }
}

export async function deleteFaculty(id) {
  try {
<<<<<<< HEAD
    const response = await fetch(`http://localhost:8000/api/v1/faculty?id=${id}`, {
      method: 'DELETE',
    });
=======
    const response = await fetch(
      `${url}?id=${id}`,
      {
        method: "DELETE",
      }
    );
>>>>>>> abishek
    return await response.json();
  } catch (error) {
    throw new Error("Failed to delete faculty");
  }
}
