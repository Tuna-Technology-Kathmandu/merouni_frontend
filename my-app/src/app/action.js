"use server";

import services from './apiService';
import { cookies } from 'next/headers';


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
export async function getPrograms(queryParams) {
  return services.program.getAll(queryParams);
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
export async function getEvents(queryParams){
  return services.event.getAll(queryParams)
}




//Blogs actions
export async function getBlogs(queryParams){
  const q = `page=${queryParams}`
  return services.news.getAll(q)
}


export async function getToken(){
  const cookieStore = await cookies()
  const token = cookieStore.get("token")
  return token
}