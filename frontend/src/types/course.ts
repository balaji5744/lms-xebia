export type CourseStatus = "Active" | "Draft" | "Archived";
export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";
export type BlockType =
  | "heading"
  | "text"
  | "video"
  | "code"
  | "image"
  | "callout";

export interface Category {
  id?: number;
  name: string;
  icon?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
  code?: string;
  status?: "Active" | "Inactive";
  courseCount: number;
}

export interface ContentBlock {
  id?: number;
  title?: string;
  type:
    | "text"
    | "code"
    | "video"
    | "image"
    | "heading"
    | "callout"
    | "table"
    | string;
  text?: string;
  code?: string;
  language?: string;
  videoUrl?: string;
  imageUrl?: string;
  alt?: string;
  caption?: string;
  headingLevel?: number;
  contentOrder?: number;
  isActive?: boolean;
  codingProblem?: CodingProblem;

  // File attachment fields (PDF, DOCX, ZIP, or any other downloadable file)
  fileUrl?: string;
  fileName?: string;

  // Backward compatibility fields:
  value?: string;
  metadata?: {
    language?: string;
    videoUrl?: string;
    altText?: string;
    caption?: string;
    calloutType?: string;
    imageUrl?: string;
    fileUrl?: string;
    fileName?: string;
  };
}

export interface Submodule {
  id?: number;
  title: string;
  description?: string;
  slug?: string;
  submoduleOrder?: number;
  isActive?: boolean;
  contentBlocks?: ContentBlock[];
}

export interface Module {
  id?: number;
  title: string;
  description?: string;
  moduleOrder?: number;
  isActive?: boolean;
  isCollapsed?: boolean;
  submodules?: Submodule[];
}

export interface SeoSettings {
  indexInSearch: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  keywords: string;
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  xCardType: "Large Summary Card" | "Standard Summary";
  xImage?: string;
  xTitle?: string;
  xDescription?: string;
}

export interface Course {
  id?: number;
  title: string;
  slug: string;
  category?: string;
  categoryId?: number;
  categoryName?: string;
  shortDescription?: string;
  description?: string;
  status?: CourseStatus;
  duration?: string;
  learnersCount?: number;
  difficulty?: DifficultyLevel;
  level?: string;
  language?: string;
  thumbnailUrl?: string;
  modules?: Module[];
  seo?: SeoSettings;
  isFeatured?: boolean;
  showInSearch?: boolean;
  allowIndexing?: boolean;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface TestCase {
  id?: number;
  input?: string;
  expectedOutput?: string;
  isHidden: boolean;
  points: number;
  testOrder: number;
}

export interface StarterCode {
  id?: number;
  language: string;
  code: string;
}

export interface CodingProblem {
  id?: number;
  slug: string;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  explanation?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  timeLimit: number;
  memoryLimit: number;
  testCases?: TestCase[];
  starterCodes?: StarterCode[];
  createdAt?: string;
  updatedAt?: string;
}

export interface TestCaseRunResult {
  testCaseId: number;
  status: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionTime: number;
  memoryUsed: number;
}

export interface RunResponse {
  status: "SUCCESS" | "COMPILATION_ERROR" | "SYSTEM_ERROR";
  compileError?: string;
  testCaseResults?: TestCaseRunResult[];
}

export interface TestCaseSubmissionResult {
  testCaseId: number;
  isHidden: boolean;
  status: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  executionTime: number;
  memoryUsed: number;
}

export interface SubmissionResponse {
  id: number;
  problemId: number;
  studentId: string;
  language: string;
  sourceCode: string;
  status: string;
  score: number;
  passedTests: number;
  totalTests: number;
  executionTime: number;
  memoryUsed: number;
  errorMessage?: string;
  testCaseResults?: TestCaseSubmissionResult[];
  submittedAt: string;
}

