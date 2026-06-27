import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import {
  ArrowLeft,
  Clock,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Play,
  FileText,
  Sparkles,
  Users,
  Calendar,
  Globe2,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Course, Module, Submodule } from "../types";

// ============================================================================
// Fallback Mock Data for demoing rich Curriculum Accordions
// ============================================================================
const DEFAULT_MOCK_MODULES: Module[] = [
  {
    id: 1001,
    title: "Foundational Principles & Architecture",
    isCollapsed: false,
    submodules: [
      {
        id: 10011,
        title: "Introduction to Enterprise Taxonomy Systems",
        slug: "intro-enterprise-taxonomy",
        description:
          "Establish the core vocabulary, baseline requirements, and administrative configurations required to deploy content hierarchies at scale across multi-tenant environments.",
        contentBlocks: [],
      },
      {
        id: 10012,
        title: "Designing Scalable Metadata Schemas",
        slug: "scalable-metadata-schemas",
        description:
          "Analyze best-practice data schemas, entity-relationship models, and the database indexing strategies that support instant tag queries.",
        contentBlocks: [],
      },
    ],
  },
  {
    id: 1002,
    title: "Curriculum Automation & Algorithmic Tagging",
    isCollapsed: true,
    submodules: [
      {
        id: 10021,
        title: "Leveraging AI for Automatic Categorization",
        slug: "ai-automatic-categorization",
        description:
          "Learn how to integrate LLM providers safely on the server-side to auto-generate taxonomy tags, keywords, and level evaluations without leaking credentials.",
        contentBlocks: [],
      },
      {
        id: 10022,
        title: "Review Loops, Governance, and Validation Matrix",
        slug: "review-loops-governance",
        description:
          "Formulate enterprise approval guardrails, human-in-the-loop audit stages, and role-based validation systems before pushing curriculums to production catalog screens.",
        contentBlocks: [],
      },
    ],
  },
];

export const CourseDetailView: React.FC = () => {
  const { selectedCourseId, courses, setCurrentView } = useApp();

  // Find currently active course
  const course = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  // If no course whatsoever is found, return simple error/empty notice
  if (!course) {
    return (
      <div className="text-center p-12 bg-white rounded-3xl border border-gray-100 max-w-md mx-auto my-12 shadow-sm">
        <BookOpen className="w-12 h-12 text-[#510047] opacity-20 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-800">No course selected</h3>
        <p className="text-xs text-gray-400 mt-2">
          Please select a course from the catalog page.
        </p>
        <button
          onClick={() => setCurrentView("courses")}
          className="mt-4 px-4 py-2 bg-[#01AC9F] text-white text-xs font-bold rounded-xl"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  // Ensure course has modules. If not, supply the high-fidelity mock curriculum requested.
  const modulesToShow = useMemo(() => {
    if (course.modules && course.modules.length > 0) {
      return course.modules;
    }
    return DEFAULT_MOCK_MODULES;
  }, [course]);

  // Accordion state - dictionary tracking open/collapsed state of each module ID
  const [expandedModules, setExpandedModules] = useState<
    Record<number, boolean>
  >(() => {
    const initial: Record<number, boolean> = {};
    modulesToShow.forEach((mod, index) => {
      // Default expand the first module, collapse the rest
      if (mod.id !== undefined) {
        initial[mod.id] = index === 0;
      }
    });
    return initial;
  });

  // Toggle single module accordion row
  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // Student Enrollment Simulation states
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<
    Record<number, boolean>
  >({});
  const [showConfetti, setShowConfetti] = useState(false);

  const handleEnroll = () => {
    setIsEnrolled(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const toggleLessonComplete = (lessonId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompletedLessons((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));
  };

  // Calculate syllabus statistics
  const totalLessonsCount = useMemo(() => {
    return modulesToShow.reduce(
      (acc, mod) => acc + (mod.submodules?.length || 0),
      0,
    );
  }, [modulesToShow]);

  const completedCount = useMemo(() => {
    return Object.values(completedLessons).filter(Boolean).length;
  }, [completedLessons]);

  const progressPercentage = useMemo(() => {
    if (totalLessonsCount === 0) return 0;
    return Math.round((completedCount / totalLessonsCount) * 100);
  }, [completedCount, totalLessonsCount]);

  return (
    <div className="pb-24 animate-fade-in space-y-8 max-w-6xl mx-auto">
      {/* Confetti Celebration Banner */}
      {showConfetti && (
        <div className="bg-gradient-to-r from-[#01AC9F] to-[#510047] text-white px-6 py-4 rounded-3xl shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-extrabold text-sm tracking-tight">
                Congratulations! You are officially enrolled.
              </p>
              <p className="text-[10px] text-[#76f7e8] font-medium">
                Your course workbook is active. Expand the curriculum modules
                below to begin your lessons!
              </p>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-[#76f7e8] animate-pulse shrink-0" />
        </div>
      )}

      {/* Hero Header Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView("courses")}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-100 text-xs font-bold text-[#510047] hover:border-[#ffd7f0] hover:bg-[#ffd7f0]/10 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Course Catalog
        </button>

        <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
          Course ID: {course.id}
        </span>
      </div>

      {/* High-Impact Hero Cover Section */}
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 relative">
        {/* Left Side: Text Details */}
        <div className="p-8 lg:p-12 lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Tagline / Meta badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white ${
                  course.difficulty === "Beginner"
                    ? "bg-emerald-500"
                    : course.difficulty === "Intermediate"
                      ? "bg-blue-500"
                      : "bg-amber-500"
                }`}
              >
                {course.difficulty}
              </span>

              <span className="bg-[#510047]/10 text-[#510047] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                {course.category}
              </span>

              <span className="text-gray-400 text-xs flex items-center gap-1.5 ml-2">
                <Globe2 className="w-3.5 h-3.5 text-gray-400" />
                {course.language || "English"}
              </span>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl lg:text-3.5xl font-black text-[#510047] tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Short Description */}
            <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
              {course.description
                ? course.description.length > 220
                  ? `${course.description.substring(0, 220)}...`
                  : course.description
                : "No overview provided."}
            </p>
          </div>

          {/* Quick Metrics & Call to Action */}
          <div className="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Duration
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[#510047] font-bold text-sm">
                  <Clock className="w-4 h-4 text-[#01AC9F]" />
                  <span>{course.duration || "6h 30m"}</span>
                </div>
              </div>

              <div className="w-px h-8 bg-gray-100" />

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Curriculum
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[#510047] font-bold text-sm">
                  <BookOpen className="w-4 h-4 text-[#01AC9F]" />
                  <span>{modulesToShow.length} Modules</span>
                </div>
              </div>

              <div className="w-px h-8 bg-gray-100" />

              <div>
                <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                  Active Students
                </p>
                <div className="flex items-center gap-1 mt-0.5 text-[#510047] font-bold text-sm">
                  <Users className="w-4 h-4 text-[#01AC9F]" />
                  <span>
                    {course.learnersCount ? course.learnersCount + 120 : "340"}{" "}
                    enrolled
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Button CTA */}
            {isEnrolled ? (
              <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200 shadow-sm shrink-0">
                <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Learning Sandbox Active</span>
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                className="px-8 py-3.5 bg-[#01AC9F] hover:bg-[#008f84] text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-spin-slow text-[#76f7e8]" />
                Enroll & Start Learning
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Image Showcase */}
        <div className="h-64 lg:h-auto lg:col-span-5 relative bg-[#510047] overflow-hidden">
          <img
            src={
              course.thumbnailUrl ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=70"
            }
            alt={course.title}
            className="w-full h-full object-cover opacity-85 group-hover:scale-102 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white via-transparent to-transparent opacity-10" />

          {/* Overlay Status info banner */}
          <div className="absolute bottom-6 right-6 bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">
              Certificate Badge
            </p>
            <p className="text-xs font-extrabold text-[#76f7e8] flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4" />
              Verified Core Curriculum
            </p>
          </div>
        </div>
      </div>

      {/* Main Course Body Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: About this course & Syllabus Accordion */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Full Description Box */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#510047] flex items-center gap-2 pb-3 border-b border-gray-50">
              <FileText className="w-5 h-5 text-[#01AC9F]" />
              Course Overview & Objectives
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {course.description ||
                "Welcome to this syllabus! This course is designed to take you step-by-step through core industry philosophies, architectural designs, and automated structures. You will explore hands-on workflows, complete interactive modules, and acquire real-world capability matrices."}
            </p>

            {/* Interactive outcomes bullet tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <div className="flex items-start gap-2.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#01AC9F] shrink-0 mt-0.5" />
                <span>
                  Gain professional understanding of core taxonomy models
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#01AC9F] shrink-0 mt-0.5" />
                <span>
                  Build, edit, and organize dynamic modules and submodules
                </span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#01AC9F] shrink-0 mt-0.5" />
                <span>Implement verification loops and metadata filters</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-[#01AC9F] shrink-0 mt-0.5" />
                <span>Unlock verifiable badge credentials upon completion</span>
              </div>
            </div>
          </div>

          {/* Core Curriculum: Syllabus Accordion */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#510047] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#01AC9F]" />
                  Interactive Curriculum Syllabus
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Click on modules to expand details and track your learning
                  progress.
                </p>
              </div>

              {/* Progress counter pill */}
              {isEnrolled && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                  {completedCount} / {totalLessonsCount} Lessons Done
                </div>
              )}
            </div>

            {/* Accordion List Container */}
            <div className="space-y-4">
              {modulesToShow.map((mod, modIdx) => {
                const isOpen =
                  mod.id !== undefined ? !!expandedModules[mod.id] : false;
                const moduleNumber = modIdx + 1;

                return (
                  <div
                    key={mod.id ?? `mod-${modIdx}`}
                    className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-[#ffd7f0] shadow-md"
                        : "border-gray-100 hover:border-gray-200 shadow-sm"
                    }`}
                  >
                    {/* Module Accordion Header Trigger */}
                    <button
                      type="button"
                      onClick={() => {
                        if (mod.id !== undefined) {
                          toggleModule(mod.id);
                        }
                      }}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 select-none focus:outline-none"
                    >
                      <div className="flex items-start gap-4">
                        {/* Number Index Shield badge */}
                        <div
                          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center font-black shrink-0 ${
                            isOpen
                              ? "bg-[#510047] text-white"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                            Mod
                          </span>
                          <span className="text-base mt-0.5 leading-none">
                            {moduleNumber}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-[#510047] group-hover:text-[#01AC9F] transition-colors">
                            {mod.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {mod.submodules?.length || 0} nested core submodules
                          </p>
                        </div>
                      </div>

                      {/* Expand Toggle Chevron Icon */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isOpen
                            ? "bg-[#ffd7f0]/40 text-[#510047]"
                            : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {/* Submodules Accordion Expanded List */}
                    {isOpen && (
                      <div className="border-t border-gray-50 bg-[#faf8f6]/40 divide-y divide-gray-50">
                        {mod.submodules && mod.submodules.length > 0 ? (
                          mod.submodules.map((sub, subIdx) => {
                            const subNumberStr = `${moduleNumber}.${subIdx + 1}`;
                            const isLessonDone =
                              sub.id !== undefined
                                ? !!completedLessons[sub.id]
                                : false;

                            return (
                              <div
                                key={sub.id ?? `sub-${subIdx}`}
                                className="p-6 hover:bg-white transition-colors duration-150 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                              >
                                <div className="flex items-start gap-3 max-w-xl">
                                  {/* Submodule order index marker */}
                                  <span className="text-xs font-mono font-black text-[#01AC9F] bg-[#01AC9F]/10 px-2 py-0.5 rounded shrink-0 mt-0.5">
                                    {subNumberStr}
                                  </span>

                                  <div>
                                    <h5 className="font-semibold text-xs text-gray-800 flex items-center gap-2">
                                      {sub.title}
                                    </h5>
                                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                                      {sub.description ||
                                        "Explore rich syllabus details, code repositories, and hands-on laboratory exercises built specifically for this section."}
                                    </p>
                                  </div>
                                </div>

                                {/* Interactive student lesson checklist */}
                                <div className="shrink-0 flex items-center gap-2.5">
                                  {isEnrolled ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        if (sub.id !== undefined) {
                                          toggleLessonComplete(sub.id, e);
                                        }
                                      }}
                                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                        isLessonDone
                                          ? "bg-emerald-500 text-white shadow-sm"
                                          : "bg-white border border-gray-200 text-gray-600 hover:border-[#01AC9F] hover:text-[#01AC9F]"
                                      }`}
                                    >
                                      {isLessonDone ? (
                                        <>
                                          <CheckCircle className="w-3.5 h-3.5" />
                                          <span>Completed</span>
                                        </>
                                      ) : (
                                        <>
                                          <Play className="w-3 h-3 text-[#01AC9F]" />
                                          <span>Complete Lesson</span>
                                        </>
                                      )}
                                    </button>
                                  ) : (
                                    /* Lock state for unenrolled view to push engagement CTA */
                                    <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg select-none">
                                      <Lock className="w-3 h-3" />
                                      Locked
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="p-6 text-center text-xs text-gray-400">
                            No detailed submodules configured for this module.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Progress & Curriculum Highlights Widgets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dynamic Learning Progress Card */}
          {isEnrolled && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-[#510047] uppercase tracking-wider">
                Your Progress Matrix
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between items-end text-xs">
                  <span className="text-gray-400">Curriculum Completed</span>
                  <span className="font-extrabold text-[#01AC9F] text-sm">
                    {progressPercentage}%
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#01AC9F] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <p className="text-[10px] text-gray-400 leading-normal">
                Finish all modules to qualify for your course certification
                badge. You can mark submodules complete as you read them.
              </p>
            </div>
          )}

          {/* Quick Stats sidebar info */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-[#510047] uppercase tracking-wider">
              Information Matrix
            </h4>

            <div className="space-y-3.5 divide-y divide-gray-50 text-xs">
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Format</span>
                <span className="font-bold text-gray-700">
                  Self-paced Online
                </span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span className="text-gray-400">Total Lessons</span>
                <span className="font-bold text-gray-700">
                  {totalLessonsCount} Submodules
                </span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span className="text-gray-400">Skill Level</span>
                <span className="font-bold text-gray-700">
                  {course.difficulty}
                </span>
              </div>
              <div className="flex justify-between pt-2.5">
                <span className="text-gray-400">Support Access</span>
                <span className="font-bold text-gray-700">24/7 Peer Forum</span>
              </div>
            </div>
          </div>

          {/* Verification / Accreditation Notice */}
          <div className="bg-[#ffd7f0]/10 border border-[#ffd7f0]/30 p-6 rounded-3xl space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#510047]" />
              <span className="text-xs font-bold text-[#510047] uppercase tracking-wider">
                LMS Verified
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              This curriculum conforms directly with verified professional
              pathways. It is officially audited and approved by active
              curriculum committees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
