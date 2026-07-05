import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { initialCategories, initialCourses } from "../data/initialData";
import { Category, Course, Module, Submodule, ContentBlock } from "../types";

// Helper functions for LocalStorage persistence
const getCategories = (): Category[] => {
  const saved = localStorage.getItem("educorp_categories");
  if (saved) return JSON.parse(saved);
  localStorage.setItem("educorp_categories", JSON.stringify(initialCategories));
  return initialCategories;
};

const saveCategories = (cats: Category[]) => {
  localStorage.setItem("educorp_categories", JSON.stringify(cats));
};

const getCourses = (): Course[] => {
  const saved = localStorage.getItem("educorp_courses");
  if (saved) {
    try {
      const parsed: Course[] = JSON.parse(saved);
      let modified = false;
      const repaired = parsed.map((c) => {
        const defaultCourse = initialCourses.find((ic) => ic.id === c.id);
        if (
          defaultCourse &&
          (!c.modules || c.modules.length === 0) &&
          defaultCourse.modules &&
          defaultCourse.modules.length > 0
        ) {
          modified = true;
          return {
            ...c,
            modules: defaultCourse.modules,
          };
        }
        return c;
      });
      if (modified) {
        localStorage.setItem("educorp_courses", JSON.stringify(repaired));
        return repaired;
      }
      return parsed;
    } catch (e) {
      // fallback
    }
  }
  localStorage.setItem("educorp_courses", JSON.stringify(initialCourses));
  return initialCourses;
};

const saveCourses = (crs: Course[]) => {
  localStorage.setItem("educorp_courses", JSON.stringify(crs));
};

const handleMockRequest = (config: any): { data: any; status: number } => {
  let url = config.url || "";
  const method = (config.method || "get").toLowerCase();

  // Strip full URL prefix if present
  if (url.startsWith("http://") || url.startsWith("https://")) {
    try {
      const parsedUrl = new URL(url);
      url = parsedUrl.pathname + parsedUrl.search;
    } catch (e) {
      // fallback
    }
  }

  // Strip base API path if present
  let path = url;
  if (path.startsWith("/api/v1")) {
    path = path.substring(7);
  }
  // Strip trailing slashes
  path = path.replace(/\/$/, "");

  // Parse query params if any
  const queryIndex = path.indexOf("?");
  let queryString = "";
  if (queryIndex !== -1) {
    queryString = path.substring(queryIndex + 1);
    path = path.substring(0, queryIndex);
  }

  const queryParams = new URLSearchParams(queryString);

  const body = config.data
    ? typeof config.data === "string"
      ? JSON.parse(config.data)
      : config.data
    : null;

  // Route 1: POST /auth/login
  if (path === "/auth/login" && method === "post") {
    const email = body?.email || "admin@educorp.com";
    const role = email.includes("admin") ? "admin" : "student";
    return {
      status: 200,
      data: {
        id: role === "admin" ? 1 : 2,
        fullName: role === "admin" ? "Alex Rivera" : "Student Learner",
        email,
        role,
        token: `educorp-jwt-token-stub-${role === "admin" ? 1 : 2}`,
      },
    };
  }

  // Route 2: POST /auth/register
  if (path === "/auth/register" && method === "post") {
    const role = body?.role || "student";
    const id = Date.now();
    return {
      status: 200,
      data: {
        id,
        fullName: body?.fullName || "Registered User",
        email: body?.email || "user@example.com",
        role,
        token: `educorp-jwt-token-stub-${id}`,
      },
    };
  }

  // Route 3: GET /categories
  if (path === "/categories" && method === "get") {
    const cats = getCategories();
    return {
      status: 200,
      data: cats,
    };
  }

  // Route 4: POST /categories
  if (path === "/categories" && method === "post") {
    const cats = getCategories();
    const newId =
      cats.length > 0 ? Math.max(...cats.map((c) => c.id || 0)) + 1 : 1;
    const newCat: Category = {
      ...body,
      id: newId,
      courseCount: 0,
      status: body.isActive !== false ? "Active" : "Inactive",
    };
    cats.push(newCat);
    saveCategories(cats);
    return {
      status: 201,
      data: newCat,
    };
  }

  // Route 5: PUT /categories/:id
  const categoryIdMatch = path.match(/^\/categories\/(\d+)$/);
  if (categoryIdMatch && method === "put") {
    const id = parseInt(categoryIdMatch[1], 10);
    const cats = getCategories();
    const index = cats.findIndex((c) => c.id === id);
    if (index !== -1) {
      const updatedCat = {
        ...cats[index],
        ...body,
        id, // preserve ID
      };
      cats[index] = updatedCat;
      saveCategories(cats);
      return {
        status: 200,
        data: updatedCat,
      };
    }
    return { status: 404, data: { message: `Category ${id} not found` } };
  }

  // Route 6: DELETE /categories/:id
  if (categoryIdMatch && method === "delete") {
    const id = parseInt(categoryIdMatch[1], 10);
    const cats = getCategories();
    const updated = cats.filter((c) => c.id !== id);
    saveCategories(updated);
    return {
      status: 204,
      data: null,
    };
  }

  // Route 7: GET /courses/active
  if (path === "/courses/active" && method === "get") {
    const crs = getCourses().filter(
      (c) =>
        c.isActive !== false && c.status !== "Archived" && c.status !== "Draft",
    );
    return {
      status: 200,
      data: crs,
    };
  }

  // Route 8: GET /admin/courses
  if (path === "/admin/courses" && method === "get") {
    const crs = getCourses();
    return {
      status: 200,
      data: crs,
    };
  }

  // Route 9: POST /admin/courses
  if (path === "/admin/courses" && method === "post") {
    const crs = getCourses();
    const newId =
      crs.length > 0 ? Math.max(...crs.map((c) => c.id || 0)) + 1 : 1;

    // Look up category name if categoryId is provided
    let categoryName = body.categoryName || body.category;
    if (body.categoryId) {
      const cats = getCategories();
      const cat = cats.find((c) => c.id === body.categoryId);
      if (cat) {
        categoryName = cat.name;
      }
    }

    const newCourse: Course = {
      ...body,
      id: newId,
      category: categoryName,
      learnersCount: 0,
      modules: body.modules || [],
      status: body.isPublished ? "Active" : "Draft",
      isActive: body.isActive !== false,
      isPublished: body.isPublished || false,
    };
    crs.push(newCourse);
    saveCourses(crs);
    return {
      status: 201,
      data: newCourse,
    };
  }

  // Route 10: GET /admin/courses/:id
  const courseIdMatch = path.match(/^\/admin\/courses\/(\d+)$/);
  if (courseIdMatch && method === "get") {
    const id = parseInt(courseIdMatch[1], 10);
    const crs = getCourses();
    const course = crs.find((c) => c.id === id);
    if (course) {
      return {
        status: 200,
        data: course,
      };
    }
    return { status: 404, data: { message: `Course ${id} not found` } };
  }

  // Route 11: PUT /admin/courses/:id
  if (courseIdMatch && method === "put") {
    const id = parseInt(courseIdMatch[1], 10);
    const crs = getCourses();
    const index = crs.findIndex((c) => c.id === id);
    if (index !== -1) {
      let categoryName =
        body.categoryName || body.category || crs[index].category;
      if (body.categoryId) {
        const cats = getCategories();
        const cat = cats.find((c) => c.id === body.categoryId);
        if (cat) {
          categoryName = cat.name;
        }
      }

      const updatedCourse = {
        ...crs[index],
        ...body,
        id,
        category: categoryName,
        status: body.isPublished
          ? "Active"
          : body.status || crs[index].status || "Draft",
        isActive: body.isActive !== false,
        isPublished: body.isPublished || false,
      };
      crs[index] = updatedCourse;
      saveCourses(crs);
      return {
        status: 200,
        data: updatedCourse,
      };
    }
    return { status: 404, data: { message: `Course ${id} not found` } };
  }

  // Route 12: DELETE /admin/courses/:id
  if (courseIdMatch && method === "delete") {
    const id = parseInt(courseIdMatch[1], 10);
    const hard = queryParams.get("hard") === "true";
    const crs = getCourses();
    if (hard) {
      const updated = crs.filter((c) => c.id !== id);
      saveCourses(updated);
    } else {
      const index = crs.findIndex((c) => c.id === id);
      if (index !== -1) {
        crs[index].isActive = false;
        crs[index].status = "Archived";
        saveCourses(crs);
      }
    }
    return {
      status: 204,
      data: null,
    };
  }

  // Route 13: GET /admin/courses/:courseId/modules
  const modulesMatch = path.match(/^\/admin\/courses\/(\d+)\/modules$/);
  if (modulesMatch && method === "get") {
    const courseId = parseInt(modulesMatch[1], 10);
    const crs = getCourses();
    const course = crs.find((c) => c.id === courseId);
    return {
      status: 200,
      data: course?.modules || [],
    };
  }

  // Route 14: POST /admin/courses/:courseId/modules
  if (modulesMatch && method === "post") {
    const courseId = parseInt(modulesMatch[1], 10);
    const crs = getCourses();
    const index = crs.findIndex((c) => c.id === courseId);
    if (index !== -1) {
      const course = crs[index];
      const modules = course.modules || [];
      const newId =
        modules.length > 0
          ? Math.max(...modules.map((m) => m.id || 0)) + 1
          : 101;
      const newModule: Module = {
        ...body,
        id: newId,
        submodules: body.submodules || [],
        isActive: body.isActive !== false,
        isCollapsed: body.isCollapsed || false,
      };
      modules.push(newModule);
      course.modules = modules;
      crs[index] = course;
      saveCourses(crs);
      return {
        status: 201,
        data: newModule,
      };
    }
    return { status: 404, data: { message: `Course ${courseId} not found` } };
  }

  // Route 15: POST /admin/courses/:courseId/modules/:moduleId/submodules
  const submodulesMatch = path.match(
    /^\/admin\/courses\/(\d+)\/modules\/(\d+)\/submodules$/,
  );
  if (submodulesMatch && method === "post") {
    const courseId = parseInt(submodulesMatch[1], 10);
    const moduleId = parseInt(submodulesMatch[2], 10);
    const crs = getCourses();
    const courseIndex = crs.findIndex((c) => c.id === courseId);
    if (courseIndex !== -1) {
      const course = crs[courseIndex];
      const modules = course.modules || [];
      const moduleIndex = modules.findIndex((m) => m.id === moduleId);
      if (moduleIndex !== -1) {
        const moduleItem = modules[moduleIndex];
        const submodules = moduleItem.submodules || [];
        const newId =
          submodules.length > 0
            ? Math.max(...submodules.map((s) => s.id || 0)) + 1
            : 1001;
        const newSubmodule: Submodule = {
          ...body,
          id: newId,
          contentBlocks: body.contentBlocks || [],
          isActive: body.isActive !== false,
        };
        submodules.push(newSubmodule);
        moduleItem.submodules = submodules;
        modules[moduleIndex] = moduleItem;
        course.modules = modules;
        crs[courseIndex] = course;
        saveCourses(crs);
        return {
          status: 201,
          data: newSubmodule,
        };
      }
      return { status: 404, data: { message: `Module ${moduleId} not found` } };
    }
    return { status: 404, data: { message: `Course ${courseId} not found` } };
  }

  // Route 16: GET /admin/submodules/:submoduleId/contents
  const contentsMatch = path.match(/^\/admin\/submodules\/(\d+)\/contents$/);
  if (contentsMatch && method === "get") {
    const submoduleId = parseInt(contentsMatch[1], 10);
    const crs = getCourses();
    for (const course of crs) {
      for (const m of course.modules || []) {
        for (const s of m.submodules || []) {
          if (s.id === submoduleId) {
            return {
              status: 200,
              data: s.contentBlocks || [],
            };
          }
        }
      }
    }
    return {
      status: 200,
      data: [],
    };
  }

  // Route 17: POST /admin/submodules/:submoduleId/contents
  if (contentsMatch && method === "post") {
    const submoduleId = parseInt(contentsMatch[1], 10);
    const crs = getCourses();
    for (let cIdx = 0; cIdx < crs.length; cIdx++) {
      const course = crs[cIdx];
      const modules = course.modules || [];
      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const m = modules[mIdx];
        const submodules = m.submodules || [];
        for (let sIdx = 0; sIdx < submodules.length; sIdx++) {
          const s = submodules[sIdx];
          if (s.id === submoduleId) {
            const contentBlocks = s.contentBlocks || [];
            const newId =
              contentBlocks.length > 0
                ? Math.max(...contentBlocks.map((cb) => cb.id || 0)) + 1
                : 10001;

            // Build content block with backward compatibility fields if they are missing
            const val =
              body.value ||
              body.text ||
              body.code ||
              body.videoUrl ||
              body.imageUrl ||
              "";
            const newContent: ContentBlock = {
              ...body,
              id: newId,
              value: val,
              metadata: body.metadata || {
                language: body.language,
                videoUrl: body.videoUrl,
                caption: body.caption,
                imageUrl: body.imageUrl,
                fileUrl: body.fileUrl,
                fileName: body.fileName,
              },
            };
            contentBlocks.push(newContent);
            s.contentBlocks = contentBlocks;
            submodules[sIdx] = s;
            m.submodules = submodules;
            modules[mIdx] = m;
            course.modules = modules;
            crs[cIdx] = course;
            saveCourses(crs);
            return {
              status: 201,
              data: newContent,
            };
          }
        }
      }
    }
    return {
      status: 404,
      data: { message: `Submodule ${submoduleId} not found` },
    };
  }

  // Route 18: DELETE /admin/submodules/:submoduleId/contents/:contentId
  const contentIdMatch = path.match(
    /^\/admin\/submodules\/(\d+)\/contents\/(\d+)$/,
  );
  if (contentIdMatch && method === "delete") {
    const submoduleId = parseInt(contentIdMatch[1], 10);
    const contentId = parseInt(contentIdMatch[2], 10);
    const crs = getCourses();
    for (let cIdx = 0; cIdx < crs.length; cIdx++) {
      const course = crs[cIdx];
      const modules = course.modules || [];
      for (let mIdx = 0; mIdx < modules.length; mIdx++) {
        const m = modules[mIdx];
        const submodules = m.submodules || [];
        for (let sIdx = 0; sIdx < submodules.length; sIdx++) {
          const s = submodules[sIdx];
          if (s.id === submoduleId) {
            const contentBlocks = s.contentBlocks || [];
            s.contentBlocks = contentBlocks.filter((cb) => cb.id !== contentId);
            submodules[sIdx] = s;
            m.submodules = submodules;
            modules[mIdx] = m;
            course.modules = modules;
            crs[cIdx] = course;
            saveCourses(crs);
            return {
              status: 204,
              data: null,
            };
          }
        }
      }
    }
  }

  // Fallback 404
  return {
    status: 404,
    data: { message: `Endpoint ${method.toUpperCase()} ${path} not found` },
  };
};

// Spring Boot Backend Base URL determined dynamically to support local Wi-Fi mobile testing and production deploys
const getApiBaseUrl = (): string => {
  const envUrl = (import.meta as any).env?.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim() !== "") {
    return envUrl;
  }

  if (typeof window !== "undefined" && window.location) {
    const { hostname, origin } = window.location;

    // Check if the application is being accessed from a local IP (e.g. 192.168.x.x, 10.x.x.x, etc.)
    const isLocalIP =
      /^(127\.)|^(10\.)|^(172\.(1[6-9]|2[0-9]|3[0-1])\.)|^(192\.168\.)/.test(
        hostname,
      );
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalhost) {
      return "http://localhost:8080/api/v1";
    } else if (isLocalIP) {
      // Accessed on local network (e.g., from a mobile device on the same Wi-Fi pointing to the laptop's backend)
      return `http://${hostname}:8080/api/v1`;
    } else {
      // Deployed/production fallback: Use current origin with context-path if served together
      return `${origin}/api/v1`;
    }
  }

  return "http://localhost:8080/api/v1";
};

const BASE_URL = getApiBaseUrl();

export interface ApiError {
  status: number | null;
  message: string;
  details: any;
  isNetworkError: boolean;
  originalError: AxiosError;
}

/**
 * Centrally configured Axios Client with request and response interceptors.
 * Tailored for modern Vite + React single page applications.
 */
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds timeout
});

const customAdapter = async (config: any): Promise<any> => {
  try {
    // Simulate slight network latency for a realistic feel
    await new Promise((resolve) => setTimeout(resolve, 100));
    const result = handleMockRequest(config);
    if (result.status >= 200 && result.status < 300) {
      return {
        data: result.data,
        status: result.status,
        statusText: result.status === 201 ? "Created" : "OK",
        headers: {},
        config,
      };
    } else {
      const error: any = new Error(result.data?.message || "HTTP Error");
      error.response = {
        data: result.data,
        status: result.status,
        statusText: result.status === 404 ? "Not Found" : "Error",
        headers: {},
        config,
      };
      error.config = config;
      throw error;
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

apiClient.defaults.adapter = customAdapter;

// Request Interceptor: Inject standard JWT bearer tokens retrieved from localStorage
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn(
        '[apiClient] Unable to read localStorage "token" for auth header injection:',
        error,
      );
    }

    // Automatically remove default JSON Content-Type header if the request body is a FormData instance
    // to let the browser auto-generate the multipart boundary header.
    if (config.data instanceof FormData) {
      if (config.headers && typeof config.headers.delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete (config.headers as any)["Content-Type"];
      }
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Centralized error classification and transformation
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<any>) => {
    const responseStatus = error.response ? error.response.status : null;
    const responseData = error.response ? error.response.data : null;

    // Standard client error classification for global logging/debugging
    if (responseStatus === 401) {
      console.error(
        "[apiClient] Unauthorized - JWT token is invalid or expired.",
      );
    } else if (responseStatus === 403) {
      console.error("[apiClient] Forbidden - Insufficient permissions.");
    } else if (responseStatus === 404) {
      console.error(
        "[apiClient] Resource Not Found:",
        responseData?.message || error.message,
      );
    } else if (responseStatus && responseStatus >= 500) {
      console.error(
        "[apiClient] Server Error:",
        responseData?.message || "Internal Server Error",
      );
    }

    // Build unified error payload structure to simplify use in React components / React Query hooks
    const normalizedError: ApiError = {
      status: responseStatus,
      message:
        responseData?.message ||
        error.message ||
        "An unexpected error occurred",
      details: responseData || null,
      isNetworkError: !error.response,
      originalError: error,
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
