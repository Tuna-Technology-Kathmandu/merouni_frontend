// apiService.js
class ApiService {
  constructor(endpoint) {
    this.baseUrl = `${process.env.baseUrl}${process.env.version}/${endpoint}`;
  }

  async getAll(queryParams = "") {
    try {
      const url = queryParams ? `${this.baseUrl}?${queryParams}` : this.baseUrl;
      const response = await fetch(url, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw new Error(`Failed to fetch ${this.baseUrl}`);
    }
  }

  async getById(id, queryParams = "") {
    try {
      const url = `${this.baseUrl}/${id}${
        queryParams ? `?${queryParams}` : ""
      }`;
      const response = await fetch(url, {
        cache: "no-store",
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch item with id ${id}`);
    }
  }

  async create(data) {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create item`);
    }
  }

  async update(id, data) {
    try {
      const response = await fetch(`${this.baseUrl}?${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to update item with id ${id}`);
    }
  }

  async delete(id) {
    try {
      const response = await fetch(`${this.baseUrl}?${id}`, {
        method: "DELETE",
      });
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to delete item with id ${id}`);
    }
  }
}

// Create instances
const services = {
  university: new ApiService("university"),
  scholarship: new ApiService("scholarship"),
  program: new ApiService("program"),
  course: new ApiService("course"),
  faculty: new ApiService("faculty"),
  event: new ApiService("events"),
};

export default services;
