import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, Calendar, GraduationCap, ChevronRight, Clock } from "lucide-react";
import { useAuthenticatedQuery } from "../../assignments/api/useAuthenticatedQuery";
import enrollmentService, { EnrollmentResponse } from "../../../services/enrollmentService";

export const MyCourses: React.FC = () => {
  const navigate = useNavigate();

  // Fetch student's enrollments
  const { data: enrollments, isLoading, error } = useAuthenticatedQuery<EnrollmentResponse[]>(
    () => enrollmentService.getMyEnrollments(),
    []
  );

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Safe category color helper
  const getCategoryStyles = (categoryName?: string | null) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("cybersecurity") || name.includes("security")) {
      return { bg: "bg-red-50 text-red-700 border-red-200", color: "#DC2626" };
    }
    if (name.includes("cloud") || name.includes("architecture")) {
      return { bg: "bg-sky-50 text-sky-700 border-sky-200", color: "#0284C7" };
    }
    if (name.includes("software") || name.includes("engineering") || name.includes("development")) {
      return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", color: "#059669" };
    }
    if (name.includes("ai") || name.includes("artificial") || name.includes("machine")) {
      return { bg: "bg-violet-50 text-violet-700 border-violet-200", color: "#8B5CF6" };
    }
    return { bg: "bg-purple-50 text-purple-700 border-purple-200", color: "#6C1D5F" };
  };

  return (
    <div className="space-y-8 animate-fade-in" id="my-courses-page-container">
      {/* Header section with Stats Card integration */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#DEDEDE] shadow-sm">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#6C1D5F]/10 border border-[#6C1D5F]/20 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#6C1D5F]">
            <GraduationCap className="w-3.5 h-3.5" />
            Learning Portal
          </span>
          <h1 className="text-3xl font-black text-[#000000] tracking-tight sm:text-4xl">
            My Courses
          </h1>
          <p className="text-sm text-[#5A5A5A] max-w-xl">
            Track your ongoing program certificates, view complete syllabus records, and continue your training.
          </p>
        </div>

        {/* Dynamic Mini Stats card */}
        {!isLoading && enrollments && enrollments.length > 0 && (
          <div className="flex items-center gap-4 bg-gray-50 border border-[#DEDEDE] p-4 rounded-2xl shrink-0">
            <div className="w-12 h-12 bg-[#01AC9F]/10 text-[#01AC9F] rounded-xl flex items-center justify-center font-bold">
              {enrollments.length}
            </div>
            <div>
              <p className="text-[10px] font-mono text-gray-400 uppercase font-semibold">Registered</p>
              <p className="text-sm font-bold text-gray-800">Enrolled Programs</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-28 space-y-4">
          <div className="w-12 h-12 border-4 border-[#6C1D5F] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-gray-400">LOADING YOUR ENROLLMENTS...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-3xl text-center max-w-xl mx-auto my-8">
          <h3 className="text-lg font-bold text-red-800">Failed to load courses</h3>
          <p className="text-sm text-red-600 mt-2">
            There was an error communicating with the server. Please try refreshing.
          </p>
        </div>
      ) : enrollments && enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" id="my-courses-grid">
          {enrollments.map((enrollment) => {
            const catStyle = getCategoryStyles(enrollment.courseCategoryName);

            return (
              <div
                key={enrollment.id}
                onClick={() => navigate(`/course-detail/${enrollment.courseId}`)}
                className="bg-white border border-[#DEDEDE] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-[480px] cursor-pointer"
                id={`my-course-card-${enrollment.id}`}
              >
                {/* Image Header with Progress bar overlay */}
                <div className="h-44 relative bg-gray-100 shrink-0">
                  <img
                    src={
                      enrollment.courseThumbnail ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"
                    }
                    alt={enrollment.courseTitle}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60";
                    }}
                  />
                  {/* Progress percentage pill */}
                  <div className="absolute bottom-4 left-4 bg-black/75 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider">
                    {enrollment.progressPercentage}% COMPLETE
                  </div>
                </div>

                {/* Card Info details */}
                <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="space-y-4">
                    {/* Category pill */}
                    <div className="flex">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${catStyle.bg}`}
                      >
                        {enrollment.courseCategoryName || "General Learning"}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg font-bold text-[#000000] line-clamp-2 hover:text-[#6C1D5F] transition-colors leading-snug">
                      {enrollment.courseTitle}
                    </h3>

                    {/* Meta information */}
                    <div className="space-y-2 text-xs text-[#5A5A5A] font-semibold">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#01AC9F]" />
                        <span>Instructor: <span className="text-[#000000] font-bold">{enrollment.instructorName || "EduCorp Instructor"}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#01AC9F]" />
                        <span>Enrolled on: {formatDate(enrollment.enrolledAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Continuing Progress Section & CTA Button */}
                  <div className="space-y-4 pt-4 border-t border-[#DEDEDE]">
                    {/* Visual Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-gray-500">
                        <span>Course Completion</span>
                        <span>{enrollment.progressPercentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#01AC9F] rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/course-detail/${enrollment.courseId}`);
                      }}
                      className="w-full py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 active:scale-[0.98] cursor-pointer"
                    >
                      <span>Continue Learning</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Refined Empty state */
        <div className="bg-white rounded-3xl border border-dashed border-[#DEDEDE] p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#6C1D5F]/10 flex items-center justify-center text-[#6C1D5F] mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#000000]">No enrolled courses</h3>
          <p className="text-sm text-[#5A5A5A] mt-2 max-w-sm mx-auto leading-relaxed">
            You aren't enrolled in any program cohorts yet. Explore our course catalog to register for professional specializations and starts learning.
          </p>
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="px-5 py-2.5 bg-[#01AC9F] hover:bg-[#008f84] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              Explore Course Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
