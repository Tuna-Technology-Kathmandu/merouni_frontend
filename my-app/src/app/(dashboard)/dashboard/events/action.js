"use server";

let url = `${process.env.baseUrl}${process.env.version}/events`;

export async function fetchEvents(page = 1, limit = 10) {
  try {
    const response = await fetch(
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

export async function createEvent(data) {
  try {
    const response = await fetch(`${url}`, {
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

export async function updateEvent(eventId, data) {
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

export async function deleteEvent(eventId) {
  console.log("before deleteing");
  try {
    const response = await fetch(`${url}?event_id=${eventId}`, {
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
