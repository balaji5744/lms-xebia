import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  BookOpen,
  Search,
  Plus,
  SlidersHorizontal,
  GraduationCap,
  BookOpenCheck,
  Briefcase,
  Layers,
} from "lucide-react";
import courseService from "../services/courseService";
import { CourseCard } from "./CourseCard";
import categoryService from "../services/categoryService";
import { Course, Category } from "../types";

export const CourseCatalogView: React.FC = () => {
  const navigate = useNavigate();
  const { deleteCourse, userRole } = useApp();

  // Local state for courses and categories fetched directly from services
  const [localCourses, setLocalCourses] = useState<Course[]>([]);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search and Category filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Active hover and menu actions states
  const [hoveredCardId, setHoveredCardId] = useState<number | string | null>(
    null,
  );
  const [activeMenuId, setActiveMenuId] = useState<number | string | null>(
    null,
  );

  // Custom Delete Modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    courseId: number | null;
    courseTitle: string;
  }>({
    isOpen: false,
    courseId: null,
    courseTitle: "",
  });

  // Fetch data directly from backend
  const fetchCatalogData = async () => {
    try {
      setIsLoading(true);
      const [crs, cats] = await Promise.all([
        courseService.getAll(),
        categoryService.getAll(),
      ]);
      setLocalCourses(crs || []);
      setLocalCategories(cats || []);
    } catch (error) {
      console.error("[CourseCatalog] Error loading catalog datasets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  // Map the courses so that each course has access to its parent category's color and icon
  const mappedCourses = useMemo(() => {
    return localCourses.map((course) => {
      const parentCategory = localCategories.find(
        (cat) =>
          cat.id === course.categoryId ||
          (course.category &&
            cat.name.toLowerCase() === course.category?.toLowerCase()),
      );
      return {
        ...course,
        categoryColor: parentCategory?.color || "#6C1D5F", // Fallback to Velvet Brand Primary
        categoryIcon: parentCategory?.icon || "📚",
        categoryName:
          parentCategory?.name ||
          course.categoryName ||
          course.category ||
          "Uncategorized",
      };
    });
  }, [localCourses, localCategories]);

  // Filter the grid dynamically based on searchQuery and selectedCategory
  const filteredCourses = useMemo(() => {
    return mappedCourses.filter((course) => {
      // Category filter
      const matchesCategory =
        selectedCategory === null || course.categoryId === selectedCategory;

      // Search query filter
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        (course.shortDescription &&
          course.shortDescription.toLowerCase().includes(query)) ||
        (course.description &&
          course.description.toLowerCase().includes(query)) ||
        (course.slug && course.slug.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [mappedCourses, selectedCategory, searchQuery]);

  // Handle course deletion cleanly by showing the option selection modal
  const handleDelete = (id: number, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      courseId: id,
      courseTitle: title,
    });
  };

  const performDeletion = async (hard: boolean) => {
    if (deleteModal.courseId === null) return;
    try {
      deleteCourse(deleteModal.courseId, hard);
      setDeleteModal({
        isOpen: false,
        courseId: null,
        courseTitle: "",
      });
      // Allow state to propagate then re-fetch
      setTimeout(() => {
        fetchCatalogData();
      }, 500);
    } catch (err) {
      console.error("[CourseCatalog] Delete operation failed:", err);
    }
  };

  // Quick statistics calculation
  const stats = useMemo(() => {
    return {
      total: localCourses.length,
      beginner: localCourses.filter(
        (c) => c.difficulty === "Beginner" || c.level === "Beginner",
      ).length,
      intermediate: localCourses.filter(
        (c) => c.difficulty === "Intermediate" || c.level === "Intermediate",
      ).length,
      advanced: localCourses.filter(
        (c) =>
          c.difficulty === "Advanced" ||
          c.level === "Advanced" ||
          c.level === "Expert",
      ).length,
    };
  }, [localCourses]);

  return (
    <div className="bg-[#F7F8FC] min-h-screen -m-4 sm:-m-8 p-4 sm:p-8 space-y-6 sm:space-y-8 animate-fade-in relative">
      {/* Absolute Transparent Cover for Click-Outside closing of Menu Dropdowns */}
      {activeMenuId !== null && (
        <div
          className="fixed inset-0 z-20 cursor-default"
          onClick={() => setActiveMenuId(null)}
        />
      )}

      {/* Top Banner Block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-[#DEDEDE] shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#6C1D5F]/10 rounded-full text-xs font-bold text-[#6C1D5F]">
            <Layers className="w-3.5 h-3.5 text-[#6C1D5F]" />
            Enterprise LMS Portal
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#000000] tracking-tight">
            Curriculum Catalog
          </h2>
          <p className="text-[#5A5A5A] text-xs sm:text-sm leading-relaxed max-w-2xl">
            Explore, manage, and enroll in premium learning modules. Leverage
            granular administration options and intuitive student workflows.
          </p>
        </div>

        {userRole === "admin" && (
          <button
            type="button"
            onClick={() => navigate("/wizard")}
            className="bg-[#6C1D5F] hover:bg-[#4A1E47] text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-[#6C1D5F]/10 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 text-xs sm:text-sm shrink-0 self-start lg:self-center cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            Create New Course
          </button>
        )}
      </div>

      {/* Statistics Hub */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stats card */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#DEDEDE] shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
            <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] truncate">
              Total Courses
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#000000] mt-0.5">
              {stats.total}
            </p>
          </div>
        </div>

        {/* Beginner Stats Card */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#DEDEDE] shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#01AC9F]/10 flex items-center justify-center text-[#01AC9F] shrink-0">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] truncate">
              Beginner
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#000000] mt-0.5">
              {stats.beginner}
            </p>
          </div>
        </div>

        {/* Intermediate Stats Card */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#DEDEDE] shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] shrink-0">
            <Briefcase className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] truncate">
              Intermediate
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#000000] mt-0.5">
              {stats.intermediate}
            </p>
          </div>
        </div>

        {/* Advanced Stats Card */}
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#DEDEDE] shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#FF6200]/10 flex items-center justify-center text-[#FF6200] shrink-0">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-[#5A5A5A] truncate">
              Advanced / Expert
            </p>
            <p className="text-xl sm:text-2xl font-black text-[#000000] mt-0.5">
              {stats.advanced}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="bg-white p-5 rounded-2xl border border-[#DEDEDE] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Inputs */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-[#5A5A5A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by course title, description, or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DEDEDE] rounded-xl text-sm text-[#000000] placeholder-[#5A5A5A]/60 focus:outline-none focus:border-[#01AC9F] focus:ring-1 focus:ring-[#01AC9F] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-[#5A5A5A] uppercase tracking-wider">
            <SlidersHorizontal className="w-4 h-4 text-[#6C1D5F]" />
            <span>Filter Systems</span>
          </div>
        </div>

        {/* Category horizontal scrolling buttons */}
        <div className="pt-2 border-t border-[#DEDEDE]/60">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 border cursor-pointer ${
                selectedCategory === null
                  ? "bg-[#6C1D5F] text-white border-[#6C1D5F] shadow-sm"
                  : "bg-white text-[#5A5A5A] border-[#DEDEDE] hover:border-[#6C1D5F]/40"
              }`}
            >
              📚 All Categories
            </button>
            {localCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  cat.id !== undefined && setSelectedCategory(cat.id)
                }
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-150 border flex items-center gap-1.5 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#6C1D5F] text-white border-[#6C1D5F] shadow-sm"
                    : "bg-white text-[#5A5A5A] border-[#DEDEDE] hover:border-[#6C1D5F]/40"
                }`}
              >
                <span>{cat.icon || "📚"}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-[#6C1D5F]/30 border-t-[#6C1D5F] rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#5A5A5A]">
            Syncing with backend...
          </p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* THE EXTRACTED COURSE CARD IS MAPPED HERE */}
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isHovered={hoveredCardId === course.id}
              isMenuOpen={activeMenuId === course.id}
              onMouseEnter={() =>
                course.id !== undefined && setHoveredCardId(course.id)
              }
              onMouseLeave={() => setHoveredCardId(null)}
              onClick={() => {
                if (course.id) navigate(`/course-detail/${course.id}`);
              }}
              onMenuToggle={(e) => {
                e.stopPropagation();
                if (course.id !== undefined) {
                  setActiveMenuId(
                    activeMenuId === course.id ? null : course.id,
                  );
                }
              }}
              onEdit={(e) => {
                e.stopPropagation();
                setActiveMenuId(null);
                if (course.id !== undefined) {
                  navigate(`/wizard/${course.id}`);
                }
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setActiveMenuId(null);
                if (course.id !== undefined) {
                  handleDelete(course.id, course.title, e);
                }
              }}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-dashed border-[#DEDEDE] p-12 text-center max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#000000]">No courses found</h3>
          <p className="text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto leading-relaxed">
            We couldn't find any courses matching your search query or selected
            category. Refine your criteria or add a new course.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            {(searchQuery || selectedCategory !== null) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#000000] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            {userRole === "admin" && (
              <button
                type="button"
                onClick={() => navigate("/wizard")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create a Course
              </button>
            )}
          </div>
        </div>
      )}

      {/* Custom Brand-Compliant Deletion Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DEDEDE] shadow-2xl p-6 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-[#6C1D5F]">
                Delete Course
              </h3>
              <p className="text-sm text-[#5A5A5A]">
                You are about to delete{" "}
                <span className="font-semibold text-black">
                  "{deleteModal.courseTitle}"
                </span>
                . Please select the deletion option:
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Option 1: Soft Delete */}
              <button
                type="button"
                onClick={() => performDeletion(false)}
                className="w-full text-left p-4 rounded-xl border border-[#DADCEA] hover:border-[#6C1D5F] hover:bg-[#F7F8FC] transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-[#6C1D5F] uppercase tracking-wider">
                      Archive / Soft Delete
                    </h4>
                    <p className="text-xs text-[#5A5A5A] mt-1">
                      Deactivates the course so it's hidden from students in the
                      catalog. All curriculum modules, lessons, and content
                      remain completely safe.
                    </p>
                  </div>
                </div>
              </button>

              {/* Option 2: Hard Delete */}
              <button
                type="button"
                onClick={() => performDeletion(true)}
                className="w-full text-left p-4 rounded-xl border border-red-200 hover:border-red-600 hover:bg-red-50/50 transition-all group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs font-black text-red-600 uppercase tracking-wider">
                      Permanent / Hard Delete
                    </h4>
                    <p className="text-xs text-[#5A5A5A] mt-1 font-normal">
                      Permanently wipes this course and all its modules,
                      lessons, and contents from the database.{" "}
                      <strong className="text-red-700">
                        This action is irreversible.
                      </strong>
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    courseId: null,
                    courseTitle: "",
                  })
                }
                className="px-4 py-2 bg-[#DEDEDE] hover:bg-gray-300 text-[#000000] text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
