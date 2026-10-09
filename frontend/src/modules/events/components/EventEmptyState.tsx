import React from "react";
import { LucideIcon } from "lucide-react";

interface EventEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EventEmptyState: React.FC<EventEmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
      <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-4 border border-gray-100">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
};

export default EventEmptyState;
