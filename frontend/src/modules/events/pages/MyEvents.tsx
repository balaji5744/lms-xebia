import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Award, Eye, Clock, FileText, CheckCircle2, ShieldAlert, Globe, MapPin, XCircle, Loader2 } from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useApp } from "../../../context/AppContext";
import { EventHeader } from "../components/EventHeader";
import { EventEmptyState } from "../components/EventEmptyState";
import { EventStatusBadge } from "../components/EventStatusBadge";

export const MyEvents: React.FC = () => {
  const navigate = useNavigate();
  const { events, registrations, loading } = useEvents();
  const { currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");

  // Get current user registrations
  const myRegistrations = useMemo(() => {
    if (!currentUser) return [];
    return registrations.filter(
      (reg) => reg.studentEmail === currentUser.email
    );
  }, [registrations, currentUser]);

  // Combine registration with corresponding Event details
  const registeredEventsWithDetails = useMemo(() => {
    return myRegistrations.map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return {
        registration: reg,
        event,
      };
    }).filter((item) => item.event !== undefined); // Remove orphan registrations if event deleted
  }, [myRegistrations, events]);

  // Filter combined data by Tab
  const tabEvents = useMemo(() => {
    const now = new Date();
    return registeredEventsWithDetails.filter((item) => {
      const event = item.event!;
      const endDate = new Date(event.endDate);

      if (activeTab === "cancelled") {
        return event.status === "cancelled";
      }

      if (activeTab === "completed") {
        // Event completed if status is completed OR end date is passed
        return event.status === "completed" || (event.status !== "cancelled" && endDate < now);
      }

      // Upcoming
      return event.status === "published" && endDate >= now;
    });
  }, [registeredEventsWithDetails, activeTab]);

  const formatRegDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return isoStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" id="my-events-loading">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F]" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading your seminar registrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="my-events-page">
      {/* Title Header */}
      <EventHeader
        title="My Seminar Registrations"
        description="Keep track of your registered workshops, attendance records, and earned certifications."
      />

      {/* Tabs list */}
      <div className="flex border-b border-gray-200">
        {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer focus:outline-none ${
              activeTab === tab
                ? "border-[#6C1D5F] text-[#6C1D5F] font-extrabold"
                : "border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200"
            }`}
          >
            {tab === "upcoming" ? "Upcoming Workshops" : tab === "completed" ? "Completed Seminars" : "Cancelled Events"}
          </button>
        ))}
      </div>

      {/* List Grid */}
      {tabEvents.length === 0 ? (
        <EventEmptyState
          icon={Calendar}
          title="No Registrations Found"
          description={`You do not have any registered ${activeTab} co-curricular seminars at the moment.`}
          action={
            <button
              onClick={() => navigate("/events")}
              className="px-5 py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Browse Seminars Catalog
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="my-events-grid">
          {tabEvents.map(({ registration, event }) => {
            if (!event) return null;
            return (
              <div
                key={registration.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 shadow-xs hover:shadow-md transition-all duration-200"
              >
                {/* Event Thumbnail Column */}
                <div className="w-full sm:w-36 h-28 rounded-xl border border-gray-100 overflow-hidden shrink-0 relative">
                  <img
                    src={event.bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Attendance stamp if completed */}
                  {activeTab === "completed" && (
                    <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-md font-bold text-[8px] uppercase tracking-wide shadow-sm ${
                      registration.attendance === "Present"
                        ? "bg-emerald-600 text-white"
                        : registration.attendance === "Absent"
                          ? "bg-red-600 text-white"
                          : "bg-gray-500 text-white"
                    }`}>
                      {registration.attendance}
                    </div>
                  )}
                </div>

                {/* Event Details and Badges */}
                <div className="flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-end">
                      <EventStatusBadge status={event.status === "published" ? "registered" : event.status} />
                    </div>

                    <h3 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-1 hover:text-[#6C1D5F]">
                      {event.title}
                    </h3>

                    <div className="flex flex-col gap-1 text-[11px] font-medium text-gray-400">
                      <div className="flex items-center gap-1.5 font-sans">
                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>Registered on: {formatRegDate(registration.registeredDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })} at {new Date(event.startDate).toLocaleTimeString(undefined, {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions / Certificate Badge Block */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                    {/* Certificate gold ribbon badge */}
                    {registration.certificateIssued && registration.attendance === "Present" ? (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-bold">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Certificate Issued</span>
                      </div>
                    ) : (
                      <div className="w-1" />
                    )}

                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 hover:text-[#6C1D5F] hover:border-[#6C1D5F]/30 hover:bg-purple-50/20 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
