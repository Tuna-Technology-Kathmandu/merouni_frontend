"use server";

export async function getNews() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/news?random=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch news");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
}

export async function getNewsBySlug(slug) {
  try {
    console.log(`${process.env.baseUrl}${process.env.version}/news/${slug}`);
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/news/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );
    // console.log("response-------------------:", response.title);

    if (!response.ok) {
      throw new Error("Failed to fetch news details");
    }

    const data = await response.json();
    console.log("Data:", data.post);
    return data.post; // Note the change from 'item' to 'event'
  } catch (error) {
    console.error("Error fetching news details:", error);
    throw error;
  }
}

export async function getRelatedNews() {
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/news`,
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
