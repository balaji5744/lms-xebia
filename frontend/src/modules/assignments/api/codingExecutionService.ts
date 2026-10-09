import apiClient from "../../../lib/apiClient";

export interface CodingTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingTestResult {
  testCase: number;
  passed: boolean;
  status: string;
  output: string;
  expectedOutput: string;
  error: string;
}

export interface CodingExecutionResponse {
  passed: number;
  total: number;
  allPassed: boolean;
  results: CodingTestResult[];
}

export const codingExecutionService = {
  async run(code: string, language: string, testCases: CodingTestCase[]): Promise<CodingExecutionResponse> {
    const response = await apiClient.post<CodingExecutionResponse>("/coding/run", {
      code,
      language,
      testCases: testCases.map(({ input, expectedOutput }) => ({ input, expectedOutput })),
    }, { timeout: 120000 });
    return response.data;
  },
};
