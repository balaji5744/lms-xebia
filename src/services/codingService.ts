import apiClient from "../lib/apiClient";
import { CodingProblem, RunResponse, SubmissionResponse } from "../types";

export const codingService = {
  /**
   * Fetch problem statement, templates, and public test cases
   * GET /coding-problems/{problemId}
   */
  async getProblemDetails(problemId: number): Promise<CodingProblem> {
    const response = await apiClient.get<CodingProblem>(`/coding-problems/${problemId}`);
    return response.data;
  },

  /**
   * Run solution code against public/sample test cases
   * POST /coding-problems/{problemId}/run
   */
  async runCode(
    problemId: number,
    language: string,
    sourceCode: string
  ): Promise<RunResponse> {
    const response = await apiClient.post<RunResponse>(
      `/coding-problems/${problemId}/run`,
      { language, sourceCode }
    );
    return response.data;
  },

  /**
   * Submit solution code for final evaluation against hidden test cases
   * POST /coding-problems/{problemId}/submit
   */
  async submitSolution(
    problemId: number,
    studentId: string,
    language: string,
    sourceCode: string
  ): Promise<SubmissionResponse> {
    const response = await apiClient.post<SubmissionResponse>(
      `/coding-problems/${problemId}/submit`,
      { studentId, language, sourceCode }
    );
    return response.data;
  },

  /**
   * Fetch submission history for a specific student and problem
   * GET /coding-problems/{problemId}/submissions?studentId={studentId}
   */
  async getSubmissions(
    problemId: number,
    studentId: string
  ): Promise<SubmissionResponse[]> {
    const response = await apiClient.get<SubmissionResponse[]>(
      `/coding-problems/${problemId}/submissions`,
      { params: { studentId } }
    );
    return response.data;
  },
};

export default codingService;
