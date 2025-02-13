"use server";

import services from "./apiService";
import { cookies } from "next/headers";

// const cookieStore = await

// University actions
export async function getUniversities(queryParams) {
  return services.university.getAll(queryParams);
}

export async function createUniversity(data) {
  return services.university.create(data);
}

export async function updateUniversity(id, data) {
  return services.university.update(id, data);
}

export async function deleteUniversity(id) {
  return services.university.delete(id);
}

// Scholarship actions
export async function getScholarships(queryParams) {
  return services.scholarship.getAll(queryParams);
}

export async function createScholarship(data) {
  return services.scholarship.create(data);
}

export async function updateScholarship(id, data) {
  return services.scholarship.update(id, data);
}

export async function deleteScholarship(id) {
  return services.scholarship.delete(id);
}

// Program actions
export async function getPrograms(page, limit = 9, sort = "asc") {
  // const q = `page=${queryParams}`
  const params = {
    page,
    limit,
    sort,
  };
  return services.program.getAll(params);
}

export async function createProgram(data) {
  return services.program.create(data);
}

export async function updateProgram(id, data) {
  return services.program.update(id, data);
}

export async function deleteProgram(id) {
  return services.program.delete(id);
}

// Course actions
export async function getCourses(queryParams) {
  return services.course.getAll(queryParams);
}

export async function createCourse(data) {
  return services.course.create(data);
}

export async function updateCourse(id, data) {
  return services.course.update(id, data);
}

export async function deleteCourse(id) {
  return services.course.delete(id);
}

// Faculty actions
export async function getFaculties(queryParams) {
  return services.faculty.getAll(queryParams);
}

export async function createFaculty(data) {
  return services.faculty.create(data);
}

export async function updateFaculty(id, data) {
  return services.faculty.update(id, data);
}

export async function deleteFaculty(id) {
  return services.faculty.delete(id);
}

// Events actions
export async function getEvents(page) {
  const params = {
    page,
  };
  return services.event.getAll(params);
}

//Blogs actions
export async function getBlogs(page) {
  // const q = `page=${queryParams}`;
  const params = {
    page,
  };
  return services.news.getAll(params);
}

// get ranking
export async function getRankings(limit, page, category_title) {
  const params = {
    limit,
    page,
    category_title,
  };
  return services.news.getAll(params);
}

export async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) {
    console.log("No token found in cookies");
    return null;
  }
  return token;
}

// Banner Actions

export async function getBanners() {
  return services.banner.getAll();
}

export async function getBannersById(id) {
  const params = {
    id,
  };
  return services.banner.getById(params);
}

export async function getColleges(isFeatured, pinned, limit, page) {
  const params = {
    limit,
    page,
    isFeatured,
    pinned,
  };
  console.log("Value of is_f and pine:", isFeatured, pinned);
  return services.college.getAll(params);
}

export async function getFeaturedColleges() {
  console.log("HEllo");
  try {
    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/college/featured-college`,
      {
        cache: "no-store",
      }
    );
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching featured colleges:", error);
    throw error;
  }
}

// exams section

export async function getExams(limit, page) {
  const params = {
    limit,
    page,
  };
  return services.exam.getAll(params);
}

export async function getBannerById(id) {
  try {
    // console.log("Fetching college details for slug:", slug);
    console.log("Banner detail fetching");
    console.log(
      "FULL URL:",
      `${process.env.baseUrl}${process.env.version}/banner/${id}`
    );

    const response = await fetch(
      `${process.env.baseUrl}${process.env.version}/banner/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Banner Details");
    }

    const data = await response.json();
    console.log("Raw api  banner response:", data);
    return data?.items || data;
  } catch (error) {
    console.error("Error fetching banner details:", error);
    throw error;
  }
}
