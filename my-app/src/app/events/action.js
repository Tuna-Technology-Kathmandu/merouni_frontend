"use server";

export async function getEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/events?random=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
}

export async function getThisWeekEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/events/this-week`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch this week's events");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching this week's events:", error);
    throw error;
  }
}

export async function getNextWeekEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/events/next-month`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch next week's events");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching next week's events:", error);
    throw error;
  }
}

export async function getEventBySlug(slug) {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/events/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    console.log("RESPONSE:",response)

    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }

    const data = await response.json();
    return data.event; // Note the change from 'item' to 'event'
  } catch (error) {
    console.error("Error fetching event details:", error);
    throw error;
  }
}

export async function getRelatedEvents() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/events`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch related events");
    }

    const data = await response.json();
    return data.items; // Fetch all events to use as related events
  } catch (error) {
    console.error("Error fetching related events:", error);
    throw error;
  }
}
