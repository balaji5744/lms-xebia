import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface EventErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
}

export const EventErrorState: React.FC<EventErrorStateProps> = ({
  title = "Something went wrong",
  description = "An error occurred while loading the events. Please try again.",
  onRetry,
  action,
}) => {
  return (
    <div className="bg-red-50/50 border border-red-100 rounded-2xl p-8 text-center max-w-lg mx-auto shadow-xs">
      <div className="flex justify-center mb-3">
        <div className="p-2.5 bg-red-100 text-red-600 rounded-full">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-red-800 mb-1">{title}</h3>
      <p className="text-sm text-red-600/90 mb-5">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs mb-2 last:mb-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
      {action && (
        <div className="mt-2 flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EventErrorState;
