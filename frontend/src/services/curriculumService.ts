import apiClient from "../lib/apiClient";
import { Module, Submodule } from "../types";

/**
 * Curriculum Administration Service
 * Communicates with Spring Boot's `/admin/courses/...` REST endpoints for Module and Submodule management.
 */
export const curriculumService = {
  /**
   * Fetch full curriculum (modules & nested submodules) for a course
   * GET /admin/courses/{courseId}/modules
   */
  async getCourseCurriculum(courseId: number): Promise<Module[]> {
    const response = await apiClient.get<Module[]>(
      `/admin/courses/${courseId}/modules`,
    );
    return response.data;
  },

  /**
   * Create a new Module under a course
   * POST /admin/courses/{courseId}/modules
   */
  async createModule(courseId: number, data: Partial<Module>): Promise<Module> {
    const response = await apiClient.post<Module>(
      `/admin/courses/${courseId}/modules`,
      data,
    );
    return response.data;
  },

  /**
   * Create a new Submodule under a specific Module of a course
   * POST /admin/courses/{courseId}/modules/{moduleId}/submodules
   */
  async createSubmodule(
    courseId: number,
    moduleId: number,
    data: Partial<Submodule>,
  ): Promise<Submodule> {
    const response = await apiClient.post<Submodule>(
      `/admin/courses/${courseId}/modules/${moduleId}/submodules`,
      data,
    );
    return response.data;
  },
};

export default curriculumService;
