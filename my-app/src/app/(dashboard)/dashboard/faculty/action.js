"use server";

let url = `${process.env.baseUrl}${process.env.version}/faculty`;

export async function getAllFaculty() {
  try {
    const response = await fetch(`${url}`, {
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to fetch faculty data");
  }
}

export async function createFaculty(data) {
  try {
    const response = await fetch(`${url}`, {
      method: "POST",
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
    const response = await fetch(`${url}?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to update faculty");
  }
}

export async function deleteFaculty(id) {
  try {
    const response = await fetch(`${url}?id=${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to delete faculty");
  }
}
