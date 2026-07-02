import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Course } from "../types";
import { initialCategories, initialCourses } from "../data/initialData";
import categoryService from "../services/categoryService";
import courseService from "../services/courseService";

// 1. Define what a Toast notification looks like
export interface ToastState {
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextProps {
  categories: Category[];
  courses: Course[];
  wizardCourseId: number | null;
  wizardStep: number;

  // TOAST NOTIFICATION ACTIONS
  toast: ToastState | null;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  hideToast: () => void;

  addCategory: (category: Omit<Category, "id" | "courseCount">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;
  addCourse: (
    course: Omit<Course, "id" | "learnersCount" | "modules">,
  ) => number;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: number, hard?: boolean) => void;
  setWizardStep: (step: number) => void;
  setWizardCourseId: (id: number | null) => void;
  showSmartTagsToast: boolean;
  setShowSmartTagsToast: (show: boolean) => void;

  // USER AUTH & ENROLLMENT ROLE-BASED ACCESS
  userRole: "admin" | "student" | null;
  currentUser: {
    id: number;
    fullName: string;
    email: string;
    role: "admin" | "student";
  } | null;
  enrolledCourseIds: number[];
  login: (
    userData:
      | "admin"
      | "student"
      | {
          id: number;
          fullName: string;
          email: string;
          role: "admin" | "student";
        },
  ) => void;
  logout: () => void;
  enrollInCourse: (courseId: number) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 2. Setup the state for our Toast
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem("educorp_categories");
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("educorp_courses");
    return saved ? JSON.parse(saved) : initialCourses;
  });

  const fetchCategoriesAndCourses = async () => {
    try {
      const [cats, crs] = await Promise.all([
        categoryService.getAll(),
        courseService.getAll(),
      ]);
      const mappedCats = cats.map((cat) => {
        const isAct =
          cat.isActive !== undefined
            ? cat.isActive
            : (cat as any).active !== undefined
              ? (cat as any).active
              : cat.status === "Active";
        return {
          ...cat,
          isActive: isAct,
          active: isAct,
          status: (isAct ? "Active" : "Inactive") as "Active" | "Inactive",
        } as Category;
      });
      setCategories(mappedCats);
      setCourses(crs);
    } catch (error) {
      console.error("[AppContext] Failed to load data from backend:", error);
    }
  };

  useEffect(() => {
    fetchCategoriesAndCourses();
  }, []);

  const [wizardCourseId, setWizardCourseId] = useState<number | null>(() => {
    const saved = localStorage.getItem("educorp_wizard_id");
    return saved ? parseInt(saved, 10) : null;
  });

  const [wizardStep, _setWizardStep] = useState<number>(() => {
    const saved = localStorage.getItem("educorp_wizard_step");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [showSmartTagsToast, setShowSmartTagsToast] = useState<boolean>(false);

  // Auth & Enrollment States
  const [currentUser, setCurrentUser] = useState<{
    id: number;
    fullName: string;
    email: string;
    role: "admin" | "student";
  } | null>(() => {
    const saved = localStorage.getItem("educorp_user_profile");
    return saved ? JSON.parse(saved) : null;
  });

  const [userRole, setUserRole] = useState<"admin" | "student" | null>(() => {
    const saved = localStorage.getItem("educorp_user_role");
    return saved === "admin" || saved === "student" ? saved : null;
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("educorp_enrolled_courses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("educorp_user_profile", JSON.stringify(currentUser));
      setUserRole(currentUser.role);
    } else {
      localStorage.removeItem("educorp_user_profile");
      setUserRole(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem("educorp_user_role", userRole);
    } else {
      localStorage.removeItem("educorp_user_role");
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem(
      "educorp_enrolled_courses",
      JSON.stringify(enrolledCourseIds),
    );
  }, [enrolledCourseIds]);

  const login = (
    userData:
      | "admin"
      | "student"
      | {
          id: number;
          fullName: string;
          email: string;
          role: "admin" | "student";
        },
  ) => {
    if (typeof userData === "string") {
      const mockProfile = {
        id: userData === "admin" ? 1 : 2,
        fullName: userData === "admin" ? "Alex Rivera" : "Student Learner",
        email:
          userData === "admin" ? "admin@educorp.com" : "student@educorp.com",
        role: userData,
      };
      setCurrentUser(mockProfile);
      setUserRole(userData);
      showToast(
        `Logged in as ${userData === "admin" ? "Administrator" : "Student"} successfully.`,
        "success",
      );
    } else {
      setCurrentUser(userData);
      setUserRole(userData.role);
      showToast(
        `Welcome back, ${userData.fullName}! Logged in as ${userData.role === "admin" ? "Administrator" : "Student"} successfully.`,
        "success",
      );
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setUserRole(null);
    showToast("Signed out successfully.", "info");
  };

  const enrollInCourse = (courseId: number) => {
    if (!enrolledCourseIds.includes(courseId)) {
      setEnrolledCourseIds((prev) => [...prev, courseId]);
      showToast(
        "Successfully enrolled in the course! Start learning now.",
        "success",
      );
    }
  };

  useEffect(() => {
    localStorage.setItem("educorp_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("educorp_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    if (wizardCourseId !== null) {
      localStorage.setItem("educorp_wizard_id", wizardCourseId.toString());
    } else {
      localStorage.removeItem("educorp_wizard_id");
    }
  }, [wizardCourseId]);

  const setWizardStep = (step: number) => {
    _setWizardStep(step);
    localStorage.setItem("educorp_wizard_step", step.toString());
  };

  const addCategory = async (newCat: Omit<Category, "id" | "courseCount">) => {
    try {
      const isAct =
        newCat.isActive !== undefined
          ? newCat.isActive
          : newCat.status === "Active" || (newCat as any).active === true;
      const payload = {
        ...newCat,
        isActive: isAct,
        active: isAct,
      };
      await categoryService.create(payload);
      await fetchCategoriesAndCourses();
    } catch (err) {
      console.error("[AppContext] Failed to create category:", err);
      const id = Date.now();
      const isAct =
        newCat.isActive !== undefined
          ? newCat.isActive
          : newCat.status === "Active" || (newCat as any).active === true;
      const category: Category = {
        ...newCat,
        id,
        courseCount: 0,
        isActive: isAct,
        active: isAct,
        status: (isAct ? "Active" : "Inactive") as "Active" | "Inactive",
      };
      setCategories((prev) => [...prev, category]);
    }
  };

  const updateCategory = async (updated: Category) => {
    try {
      if (updated.id) {
        const isAct =
          updated.isActive !== undefined
            ? updated.isActive
            : updated.status === "Active" || (updated as any).active === true;
        const payload = {
          ...updated,
          isActive: isAct,
          active: isAct,
        };
        await categoryService.update(updated.id, payload);
        await fetchCategoriesAndCourses();
      }
    } catch (err) {
      console.error("[AppContext] Failed to update category:", err);
      const isAct =
        updated.isActive !== undefined
          ? updated.isActive
          : updated.status === "Active" || (updated as any).active === true;
      const mappedUpdated = {
        ...updated,
        isActive: isAct,
        active: isAct,
        status: (isAct ? "Active" : "Inactive") as "Active" | "Inactive",
      };
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? mappedUpdated : c)),
      );
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await categoryService.delete(id);
      await fetchCategoriesAndCourses();
    } catch (err) {
      console.error("[AppContext] Failed to delete category:", err);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const addCourse = (
    newCourse: Omit<Course, "id" | "learnersCount" | "modules">,
  ) => {
    const id = Date.now();
    const course: Course = {
      ...newCourse,
      id,
      learnersCount: 0,
      modules: [],
    };

    courseService
      .create(newCourse)
      .then(() => fetchCategoriesAndCourses())
      .catch((err) => {
        console.error("[AppContext] Failed to save course to backend:", err);
        fetchCategoriesAndCourses();
      });

    setCourses((prev) => [...prev, course]);
    return id;
  };

  const updateCourse = (updated: Course) => {
    if (updated.id) {
      courseService
        .update(updated.id, updated)
        .then(() => fetchCategoriesAndCourses())
        .catch((err) => {
          console.error(
            "[AppContext] Failed to update course on backend:",
            err,
          );
          fetchCategoriesAndCourses();
        });
    }
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteCourse = (id: number, hard: boolean = false) => {
    courseService
      .delete(id, hard)
      .then(() => {
        fetchCategoriesAndCourses();
        showToast(
          hard
            ? "Course permanently deleted from the database."
            : "Course soft-deleted (deactivated).",
          "success",
        );
      })
      .catch((err) => {
        console.error("[AppContext] Failed to delete course on backend:", err);
        showToast("Failed to delete course.", "error");
        fetchCategoriesAndCourses();
      });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        courses,
        wizardCourseId,
        wizardStep,

        // 3. Expose Toast Functions
        toast,
        showToast,
        hideToast,

        addCategory,
        updateCategory,
        deleteCategory,
        addCourse,
        updateCourse,
        deleteCourse,
        setWizardStep,
        setWizardCourseId,
        showSmartTagsToast,
        setShowSmartTagsToast,
        userRole,
        currentUser,
        enrolledCourseIds,
        login,
        logout,
        enrollInCourse,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
