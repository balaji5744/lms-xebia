import React from "react";

interface EventStatusBadgeProps {
  status: string;
}

export const EventStatusBadge: React.FC<EventStatusBadgeProps> = ({ status }) => {
  const normalized = status.trim().toLowerCase();

  let classes = "bg-gray-100 text-gray-700 border-gray-200";
  let label = status;

  switch (normalized) {
    case "draft":
      classes = "bg-gray-50 text-gray-600 border-gray-200";
      label = "Draft";
      break;
    case "published":
      classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
      label = "Published";
      break;
    case "completed":
      classes = "bg-[#6C1D5F]/10 text-[#6C1D5F] border-[#6C1D5F]/20";
      label = "Completed";
      break;
    case "cancelled":
      classes = "bg-red-50 text-red-700 border-red-200";
      label = "Cancelled";
      break;
    case "registered":
      classes = "bg-purple-50 text-[#6C1D5F] border-[#6C1D5F]/20";
      label = "Registered";
      break;
    case "present":
      classes = "bg-emerald-50 text-emerald-700 border-emerald-200";
      label = "Present";
      break;
    case "absent":
      classes = "bg-red-50 text-red-700 border-red-200";
      label = "Absent";
      break;
    case "pending":
      classes = "bg-amber-50 text-amber-700 border-amber-200";
      label = "Pending";
      break;
    case "certificate issued":
    case "certificateissued":
    case "issued":
      classes = "bg-indigo-50 text-indigo-700 border-indigo-200";
      label = "Certificate Issued";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${classes}`}>
      {label}
    </span>
  );
};

export default EventStatusBadge;
