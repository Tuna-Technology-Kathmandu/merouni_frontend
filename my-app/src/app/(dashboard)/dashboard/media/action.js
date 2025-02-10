
import { authFetch } from "@/app/utils/authFetch";

let url = `${process.env.mediaUrl}${process.env.version}/media`;

export async function fetchMedia(page = 1, limit = 10) {
  try {
    const response = await authFetch(
      `${url}?limit=${limit}&page=${page}`,
      { cache: "no-store" }
    );
    console.log(`Response: ${response}`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function uploadMedia(data) {
  try {
    const response = await authFetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function deleteMedia(eventId) {
  console.log("before deleteing");
  try {
    const response = await authFetch(`${url}?event_id=${eventId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }
    console.log("just before deleteing");
    const hehe = await response.json();

    console.log(hehe);
    return hehe;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
}
