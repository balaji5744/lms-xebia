import React, { createContext, useContext, useState, useEffect } from "react";
import { Category, Course, Module, Submodule, SeoSettings } from "../types";
import { initialCategories, initialCourses } from "../data/initialData";
import categoryService from "../services/categoryService";
import courseService from "../services/courseService";

interface AppContextProps {
  categories: Category[];
  courses: Course[];
  currentView: "courses" | "categories" | "wizard" | "course-detail";
  wizardCourseId: number | null;
  wizardStep: number;
  selectedCourseId: number | null;
  setSelectedCourseId: (id: number | null) => void;
  addCategory: (category: Omit<Category, "id" | "courseCount">) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: number) => void;
  addCourse: (
    course: Omit<Course, "id" | "learnersCount" | "modules">,
  ) => number;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: number) => void;
  startNewCourseWizard: () => void;
  startEditCourseWizard: (courseId: number) => void;
  setWizardStep: (step: number) => void;
  setWizardCourseId: (id: number | null) => void;
  setCurrentView: (
    view: "courses" | "categories" | "wizard" | "course-detail",
  ) => void;
  viewCourseDetail: (courseId: number) => void;
  showSmartTagsToast: boolean;
  setShowSmartTagsToast: (show: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const [currentView, setCurrentView] = useState<
    "courses" | "categories" | "wizard" | "course-detail"
  >(() => {
    const saved = localStorage.getItem("educorp_view");
    if (
      saved === "courses" ||
      saved === "categories" ||
      saved === "wizard" ||
      saved === "course-detail"
    ) {
      return saved;
    }
    return "courses";
  });

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [wizardCourseId, setWizardCourseId] = useState<number | null>(() => {
    const saved = localStorage.getItem("educorp_wizard_id");
    return saved ? parseInt(saved, 10) : null;
  });

  const [wizardStep, _setWizardStep] = useState<number>(() => {
    const saved = localStorage.getItem("educorp_wizard_step");
    return saved ? parseInt(saved, 10) : 1;
  });

  const [showSmartTagsToast, setShowSmartTagsToast] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("educorp_categories", JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem("educorp_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("educorp_view", currentView);
  }, [currentView]);

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

    // Save to server, then fetch refreshed categories/counts
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

  const deleteCourse = (id: number) => {
    courseService
      .delete(id)
      .then(() => fetchCategoriesAndCourses())
      .catch((err) => {
        console.error("[AppContext] Failed to delete course on backend:", err);
        fetchCategoriesAndCourses();
      });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const startNewCourseWizard = () => {
    setWizardCourseId(null);
    setWizardStep(1);
    setCurrentView("wizard");
  };

  const startEditCourseWizard = (courseId: number) => {
    setWizardCourseId(courseId);
    setWizardStep(1);
    setCurrentView("wizard");
  };

  const viewCourseDetail = (courseId: number) => {
    setSelectedCourseId(courseId);
    setCurrentView("course-detail");
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        courses,
        currentView,
        wizardCourseId,
        wizardStep,
        selectedCourseId,
        setSelectedCourseId,
        addCategory,
        updateCategory,
        deleteCategory,
        addCourse,
        updateCourse,
        deleteCourse,
        startNewCourseWizard,
        startEditCourseWizard,
        setWizardStep,
        setWizardCourseId,
        setCurrentView,
        viewCourseDetail,
        showSmartTagsToast,
        setShowSmartTagsToast,
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
