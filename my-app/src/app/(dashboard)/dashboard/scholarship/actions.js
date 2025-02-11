// app/actions/scholarship.js

import { authFetch } from "@/app/utils/authFetch";

let url = `${process.env.baseUrl}${process.env.version}/scholarship`;

export async function getAllScholarships() {
  try {
    const response = await authFetch(`${url}`, {
      cache: "no-store",
    });
    const data = await response.json();
    console.log("data", data);
    return data.scholarships;
  } catch (error) {
    throw new Error("Failed to fetch scholarships");
  }
}

export async function createScholarship(data) {
  try {
    console.log(`Scholarship Data : ${data}`);

    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to create scholarship");
  }
}

export async function updateScholarship(id, data) {
  try {
    const response = await fetch(`${url}?scholarship_id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to update scholarship");
  }
}

export async function deleteScholarship(id) {
  try {
    const response = await fetch(`${url}?scholarship_id=${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    throw new Error("Failed to delete scholarship");
  }
}
