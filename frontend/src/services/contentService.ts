import apiClient from "../lib/apiClient";
import { ContentBlock } from "../types";

/**
 * Content Administration Service
 * Communicates with Spring Boot's `/admin/...` REST endpoints for ContentBlock management.
 */
export const contentService = {
  /**
   * Fetch all content blocks for a specific submodule
   * GET /admin/submodules/{submoduleId}/contents
   */
  async getContentBySubmodule(submoduleId: number): Promise<ContentBlock[]> {
    const response = await apiClient.get<ContentBlock[]>(
      `/admin/submodules/${submoduleId}/contents`,
    );
    return response.data;
  },

  /**
   * Create a new ContentBlock under a specific submodule
   * POST /admin/submodules/{submoduleId}/contents
   */
  async createContent(
    submoduleId: number,
    data: Partial<ContentBlock>,
  ): Promise<ContentBlock> {
    const response = await apiClient.post<ContentBlock>(
      `/admin/submodules/${submoduleId}/contents`,
      data,
    );
    return response.data;
  },

  /**
   * Delete an existing ContentBlock
   * DELETE /admin/submodules/{submoduleId}/contents/{contentId}
   */
  async deleteContent(submoduleId: number, contentId: number): Promise<void> {
    await apiClient.delete(
      `/admin/submodules/${submoduleId}/contents/${contentId}`,
    );
  },
};

export default contentService;
