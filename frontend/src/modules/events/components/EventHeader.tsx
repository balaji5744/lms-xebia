import React from "react";

interface EventHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold text-[#111827] tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-[#6B7280]">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-3 shrink-0">{action}</div>}
    </div>
  );
};

export default EventHeader;
