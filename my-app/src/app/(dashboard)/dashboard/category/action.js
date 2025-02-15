"use server";

import { authFetch } from "@/app/utils/authFetch";

let url = `${process.env.baseUrl}${process.env.version}/category`;

export async function fetchCategories(page = 1) {
  try {
    const response = await fetch(
      `${url}?page=${page}`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function createCategory(data) {
  try {
    console.log("Data of category:", data);
    const response = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log("Response of create category:", response);

    if (!response.ok) {
      throw new Error("Failed to create category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(categoryId, data) {
  try {
    const response = await fetch(`${url}?category_id=${categoryId}`, {
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

export async function deleteCategory(categoryId) {
  console.log("before deleteing");
  try {
    const response = await fetch(`${url}?category_id=${categoryId}`, {
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
