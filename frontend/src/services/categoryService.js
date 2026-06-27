import apiClient from '../lib/apiClient';

/**
 * Category Administration Service
 * Integrates with the Spring Boot `/categories` REST endpoints for Admin LMS tasks.
 */
export const categoryService = {
  /**
   * Fetch all categories
   * GET /categories
   * @returns {Promise<Array>} List of Category objects
   */
  async getAllCategories() {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  /**
   * Retrieve a single category details by ID
   * GET /categories/{id}
   * @param {string|number} id - Category unique identifier
   * @returns {Promise<Object>} Category details object
   */
  async getCategoryById(id) {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  /**
   * Create a new category
   * POST /categories
   * @param {Object} data - Category specifications (name, icon, description, color)
   * @returns {Promise<Object>} The created Category record with its database ID
   */
  async createCategory(data) {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  /**
   * Update an existing category by ID
   * PUT /categories/{id}
   * @param {string|number} id - Category unique identifier
   * @param {Object} data - Category fields to update
   * @returns {Promise<Object>} The updated Category record
   */
  async updateCategory(id, data) {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete / Delete a category by ID
   * DELETE /categories/{id}
   * @param {string|number} id - Category unique identifier
   * @returns {Promise<void>}
   */
  async deleteCategory(id) {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};

export default categoryService;
