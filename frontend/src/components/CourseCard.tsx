import React from "react";
import { Course } from "../types";
import { Clock, Edit, Trash2, MoreVertical } from "lucide-react";

// 1. Extend the base Course type to include our dynamically injected UI fields
export interface CourseWithUI extends Course {
  categoryColor?: string;
  categoryIcon?: string;
  categoryName?: string;
}

interface CourseCardProps {
  course: CourseWithUI; // 2. Update the prop to use the extended type
  isHovered: boolean;
  isMenuOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
  onMenuToggle: (e: React.MouseEvent) => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}
export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isHovered,
  isMenuOpen,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onMenuToggle,
  onEdit,
  onDelete,
}) => {
  // Extract the exact level string
  const levelStr =
    (course.difficulty as string) || (course.level as string) || "Beginner";

  // Map each specific level to a distinct color from the Brand Palette
  let levelBadgeColor = "bg-[#01AC9F]"; // Default Emerald
  if (levelStr === "Beginner") {
    levelBadgeColor = "bg-[#01AC9F]"; // Emerald
  } else if (levelStr === "Intermediate") {
    levelBadgeColor = "bg-[#6C1D5F]"; // Tranquil Velvet
  } else if (levelStr === "Advanced") {
    levelBadgeColor = "bg-[#FF6200]"; // CTA Orange
  } else if (levelStr === "Expert") {
    levelBadgeColor = "bg-[#4A1E47]"; // Tranquil Velvet Dark
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        boxShadow: isHovered
          ? `0 20px 40px -12px ${course.categoryColor}80, 0 0 15px -3px ${course.categoryColor}50`
          : "0 1px 3px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.04)",
      }}
      className="bg-white border border-[#DEDEDE] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-[460px] cursor-pointer relative"
    >
      {/* Card Image Header */}
      <div className="h-44 relative overflow-hidden bg-gray-100 shrink-0">
        <img
          src={
            course.thumbnailUrl ||
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60"
          }
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=60";
          }}
        />

        {/* Top-Right More Button (Admin Actions Trigger) */}
        <div className="absolute top-4 right-4 z-30">
          <button
            type="button"
            onClick={onMenuToggle}
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-[#000000] border border-[#DEDEDE]/60 flex items-center justify-center transition-all shadow-sm focus:outline-none"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Dropdown Menu Overlay */}
        {isMenuOpen && (
          <div
            className="absolute top-14 right-4 bg-white border border-[#DEDEDE] rounded-xl shadow-xl py-1.5 w-36 z-30 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onEdit}
              className="w-full px-4 py-2 text-left text-xs font-bold text-[#5A5A5A] hover:bg-[#F7F8FC] hover:text-[#6C1D5F] flex items-center gap-2 transition-all cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-[#01AC9F]" />
              Edit Course
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="w-full px-4 py-2 text-left text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete Course
            </button>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between overflow-hidden">
        <div className="space-y-3">
          {/* Category Pill */}
          <div className="flex">
            <span
              style={{
                backgroundColor: `${course.categoryColor}26`,
                color: course.categoryColor,
                border: `1px solid ${course.categoryColor}40`,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
            >
              <span className="text-xs leading-none">
                {course.categoryIcon}
              </span>
              <span>{course.categoryName}</span>
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#000000] line-clamp-2 hover:text-[#6C1D5F] transition-colors leading-snug">
            {course.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-[#5A5A5A] line-clamp-3 leading-relaxed">
            {course.shortDescription ||
              course.description ||
              "No course curriculum syllabus described."}
          </p>

          {/* Level Badge */}
          <div className="flex pt-1">
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1.5 rounded-md text-white shadow-sm ${levelBadgeColor}`}
            >
              {course.difficulty || course.level || "Beginner"}
            </span>
          </div>
        </div>

        {/* Card Footer */}
        <div className="pt-4 mt-4 border-t border-[#DEDEDE] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#5A5A5A] font-semibold">
            <Clock className="w-4 h-4 text-[#01AC9F]" />
            <span>{course.duration || "Self-Paced"}</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5A5A5A] font-bold bg-[#F7F8FC] border border-[#DEDEDE]/60 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#01AC9F]"></span>
            <span>0% Enrolled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
