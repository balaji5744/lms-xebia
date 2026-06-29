import apiClient from "../lib/apiClient";
import { Course } from "../types";

/**
 * Course Management Service
 * Communicates with Spring Boot's `/admin/courses` REST endpoints for LMS Admin Course Authoring.
 */
export const courseService = {
  /**
   * Fetch all admin courses
   * GET /admin/courses
   * @returns {Promise<Course[]>} List of all Courses
   */
  async getAll(): Promise<Course[]> {
    const response = await apiClient.get<Course[]>("/admin/courses");
    return response.data;
  },

  /**
   * Create a new course
   * POST /admin/courses
   * @param {Partial<Course>} data - Course definition fields
   * @returns {Promise<Course>} The newly created Course record from the backend
   */
  async create(data: Partial<Course>): Promise<Course> {
    const response = await apiClient.post<Course>("/admin/courses", data);
    return response.data;
  },

  /**
   * Update an existing course
   * PUT /admin/courses/{id}
   * @param {string|number} id - Course ID
   * @param {Partial<Course>} data - Course fields to update
   * @returns {Promise<Course>} The updated Course record
   */
  async update(id: string | number, data: Partial<Course>): Promise<Course> {
    const response = await apiClient.put<Course>(`/admin/courses/${id}`, data);
    return response.data;
  },

  /**
   * Delete a course by ID
   * DELETE /admin/courses/{id}
   * @param {string|number} id - Course ID
   * @returns {Promise<void>} Resolves when delete operation completes
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/admin/courses/${id}`);
  },
};

export default courseService;
