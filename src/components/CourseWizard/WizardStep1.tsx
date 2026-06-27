import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Globe,
  Upload,
  X,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Course, Category } from "../../types";
import categoryService from "../../services/categoryService";
import courseService from "../../services/courseService";

interface WizardStep1Props {
  courseData: Course;
  setCourseData:
    | React.Dispatch<React.SetStateAction<any>>
    | ((val: any) => void);
  onNext?: (courseId: number) => void;
}

export const WizardStep1: React.FC<WizardStep1Props> = ({
  courseData,
  setCourseData,
  onNext,
}) => {
  const queryClient = useQueryClient();
  const [isManualSlug, setIsManualSlug] = useState(false);
  const [langInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>(() => {
    return courseData.language ? courseData.language.split(", ") : ["English"];
  });

  // 1. Fetch Categories using React Query
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    isError: isCategoriesError,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  // 2. Course Creation Mutation
  const createCourseMutation = useMutation({
    mutationFn: (newCourse: Partial<Course>) => courseService.create(newCourse),
    onSuccess: (data) => {
      // Invalidate categories to refresh counts from backend
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      if (data.id === undefined) return;
      const newCourseId = data.id;

      // Update parent course draft state
      setCourseData((prev: any) => ({
        ...prev,
        ...data,
        id: newCourseId,
      }));

      // Fire callback to navigate the wizard to step 2
      if (onNext) {
        onNext(newCourseId);
      }
    },
    onError: (err: any) => {
      console.error("[WizardStep1] Failed to create course:", err);
    },
  });

  // Auto-sync slug if manual override is OFF
  useEffect(() => {
    if (!isManualSlug && courseData.title) {
      const generatedSlug = courseData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData("slug", generatedSlug);
    }
  }, [courseData.title, isManualSlug]);

  const handleLevelClick = (level: string) => {
    setFormData("level", level);
    // Backward compatibility for standard DifficultyLevel
    if (["Beginner", "Intermediate", "Advanced"].includes(level)) {
      setFormData("difficulty", level);
    }
  };

  const handleAddLanguage = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && langInput.trim()) {
      e.preventDefault();
      if (!languages.includes(langInput.trim())) {
        const updated = [...languages, langInput.trim()];
        setLanguages(updated);
        setFormData("language", updated.join(", "));
      }
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    const updated = languages.filter((l) => l !== lang);
    setLanguages(updated);
    setFormData("language", updated.join(", "));
  };

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData("thumbnailUrl", event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG, JPG, WebP, SVG, etc.)");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFormData("thumbnailUrl", "");
  };

  const setFormData = (field: keyof Course | string, val: any) => {
    setCourseData((prev: any) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseData.title?.trim()) {
      alert("Please fill in the Course Title to proceed.");
      return;
    }
    if (!courseData.categoryId) {
      alert("Please select a Course Category to proceed.");
      return;
    }

    // Prepare complete Course creation payload matching requirements
    const payload: Partial<Course> = {
      title: courseData.title.trim(),
      slug: courseData.slug || "",
      shortDescription: courseData.shortDescription?.trim() || "",
      description: courseData.description?.trim() || "",
      level: courseData.level || "Beginner",
      duration: courseData.duration || "10 Hours",
      thumbnailUrl: courseData.thumbnailUrl || "",
      categoryId: Number(courseData.categoryId),
      categoryName:
        categories.find((c) => Number(c.id) === Number(courseData.categoryId))
          ?.name || "",
      isActive: courseData.isActive !== false,
      isPublished: false,
    };

    createCourseMutation.mutate(payload);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column Forms */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Course Title *
              </label>
              <input
                type="text"
                required
                maxLength={200}
                placeholder="e.g., Strategic Leadership & Change Management"
                value={courseData.title || ""}
                onChange={(e) => setFormData("title", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all text-gray-800 font-medium"
              />
              <p className="text-right text-[10px] text-gray-400 mt-1.5 font-mono">
                {(courseData.title || "").length} / 200
              </p>
            </div>

            {/* Slug */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  URL Slug
                </label>
                <div
                  onClick={() => setIsManualSlug(!isManualSlug)}
                  className="flex items-center gap-1.5 cursor-pointer select-none"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#510047]">
                    Manual Override
                  </span>
                  {isManualSlug ? (
                    <ToggleRight className="w-6 h-6 text-[#01AC9F]" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-gray-300" />
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-xl text-xs font-mono text-gray-400">
                  academy.edu/c/
                </span>
                <input
                  type="text"
                  disabled={!isManualSlug}
                  value={courseData.slug || ""}
                  onChange={(e) => setFormData("slug", e.target.value)}
                  className={`w-full border border-gray-200 rounded-r-xl px-4 py-3 text-sm focus:outline-none focus:border-[#510047] transition-all font-mono text-xs ${
                    isManualSlug
                      ? "bg-white text-gray-800"
                      : "bg-gray-50 text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {/* Category Selection using React Query */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Course Category *
              </label>
              <div className="relative">
                <select
                  required
                  value={courseData.categoryId || ""}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    setFormData("categoryId", selectedId);
                    const selectedCatName = categories.find(
                      (c) => Number(c.id) === selectedId,
                    )?.name;
                    setFormData("category", selectedCatName || "");
                  }}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all text-gray-700 bg-white cursor-pointer pr-10"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {isLoadingCategories ? (
                    <option disabled>Loading categories...</option>
                  ) : isCategoriesError ? (
                    <option disabled>Error loading categories</option>
                  ) : (
                    categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Short Description
              </label>
              <textarea
                placeholder="Briefly describe what learners will achieve by the end of this course..."
                rows={2}
                value={courseData.shortDescription || ""}
                onChange={(e) =>
                  setFormData("shortDescription", e.target.value)
                }
                className="w-full bg-white border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all resize-none text-gray-700 leading-relaxed"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Full Program Description
              </label>
              <textarea
                placeholder="Enter detailed description, syllabus details, or curriculum outline..."
                rows={4}
                value={courseData.description || ""}
                onChange={(e) => setFormData("description", e.target.value)}
                className="w-full bg-white border border-[#DEDEDE] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0] transition-all resize-none text-gray-700 leading-relaxed"
              />
            </div>
          </div>

          {/* Right Column Forms */}
          <div className="space-y-6">
            {/* Level & Duration Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Level */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Target Level
                </label>
                <div className="flex flex-col gap-2">
                  {["Beginner", "Intermediate", "Advanced", "Expert"].map(
                    (lvl) => {
                      const isActive = (courseData.level || "Beginner") === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleLevelClick(lvl)}
                          className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold text-left transition-all active:scale-[0.98] ${
                            isActive
                              ? "border-[#510047] bg-[#510047] text-white shadow-md"
                              : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>

              {/* Duration & Primary Language */}
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Course Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10 Hours"
                    value={courseData.duration || "10 Hours"}
                    onChange={(e) => setFormData("duration", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Primary Language
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Type & press Enter..."
                      value={langInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={handleAddLanguage}
                      className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-[#510047] focus:ring-1 focus:ring-[#ffd7f0]"
                    />
                  </div>

                  {/* Selected languages */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {languages.map((lang) => (
                      <span
                        key={lang}
                        className="bg-gray-100 px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-500 flex items-center gap-1 border border-gray-200 shadow-sm"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => handleRemoveLanguage(lang)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Cover Image */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Course Thumbnail Cover
              </label>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="course-thumbnail-file-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center group min-h-[160px] ${
                  isDragging
                    ? "border-[#01AC9F] bg-[#01AC9F]/5 scale-[1.01]"
                    : "border-gray-200 hover:bg-gray-50 hover:border-[#01AC9F]"
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#ffd7f0]/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 text-[#510047]" />
                </div>
                <p className="text-xs font-bold text-gray-800">
                  {isDragging
                    ? "Drop your image here!"
                    : "Click to upload or drag and drop cover"}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Recommended: 1200 x 675px (16:9) Aspect Ratio
                </p>

                {/* Cover Preview */}
                {!!courseData.thumbnailUrl && (
                  <div className="mt-5 w-full max-w-sm h-32 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 relative group/preview shadow-inner">
                    <img
                      src={courseData.thumbnailUrl}
                      alt="Thumbnail Preview"
                      className="w-full h-full object-cover transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-md pointer-events-auto"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Feedback & Submission Controls */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1">
            {createCourseMutation.isError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl border border-red-100 max-w-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Failed to create course. Please verify Spring Boot REST
                  backend is running at local port 8080.
                </span>
              </div>
            )}
            {createCourseMutation.isSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl border border-emerald-100 max-w-lg animate-fade-in">
                <span>
                  Success! Course saved. Moving to curriculum structuring...
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={createCourseMutation.isPending}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#510047] hover:bg-[#3c0034] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            {createCourseMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Course...</span>
              </>
            ) : (
              <>
                <span>Initialize & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
