import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Users, Search, BookOpen, Globe, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useApp } from "../../../context/AppContext";
import { Event } from "../types";
import { EventHeader } from "../components/EventHeader";
import { EventEmptyState } from "../components/EventEmptyState";
import { EventErrorState } from "../components/EventErrorState";
import { EventStatusBadge } from "../components/EventStatusBadge";

export const EventsListing: React.FC = () => {
  const navigate = useNavigate();
  const { events, registrations, registerForEvent, cancelRegistration, loading, refreshData } = useEvents();
  const { userRole, currentUser, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Filter only published upcoming/completed/cancelled events for general listings
  const listableEvents = useMemo(() => {
    return events.filter((evt) => {
      // Teachers and Students only see non-draft events
      const isVisibleStatus = evt.status !== "draft";
      
      const matchesSearch =
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description.toLowerCase().includes(searchQuery.toLowerCase());

      return isVisibleStatus && matchesSearch;
    });
  }, [events, searchQuery]);

  const handleRegister = async (e: React.MouseEvent, evt: Event) => {
    e.stopPropagation(); // Prevent navigating to details

    if (!currentUser) {
      showToast("Please sign in to register for events.", "error");
      return;
    }

    const isRegistered = registrations.some(
      (r) => r.eventId === evt.id && r.studentEmail === currentUser.email
    );

    if (isRegistered) {
      // Cancel registration
      await cancelRegistration(evt.id, currentUser.email);
      showToast(`Successfully cancelled registration for "${evt.title}".`, "info");
    } else {
      // Register
      const success = await registerForEvent(evt.id, currentUser.fullName, currentUser.email);
      if (success) {
        showToast(`Successfully registered for "${evt.title}"! We have sent a confirmation details email to ${currentUser.email}.`, "success");
      } else {
        showToast(`Failed to register. The event might be fully booked.`, "error");
      }
    }
  };

  const checkIsRegistered = (eventId: string) => {
    if (!currentUser) return false;
    return registrations.some(
      (r) => r.eventId === eventId && r.studentEmail === currentUser.email
    );
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" id="events-loading">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F]" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading events catalogue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="events-listing">
      {/* Page Header */}
      <EventHeader
        title="Geeknito Co-Curricular Seminars"
        description="Expand your skills beyond courses! Join expert-led interactive seminars, tech bootcamps, intensive coding hackathons, and webinars."
      />

      {/* Controls: Search and Filters */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-end">
        {/* Search Input bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search seminars, hacks, bootcamps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all font-medium text-gray-800 placeholder-gray-400 bg-white"
          />
        </div>
      </div>

      {/* Grid List */}
      {listableEvents.length === 0 ? (
        searchQuery ? (
          <EventEmptyState
            icon={Search}
            title="No Search Results Found"
            description={`We couldn't find any events matching "${searchQuery}". Please try refining your keywords.`}
            action={
              <button
                onClick={() => {
                  setSearchQuery("");
                }}
                className="px-4 py-2 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
              >
                Clear Search
              </button>
            }
          />
        ) : (
          <EventEmptyState
            icon={Calendar}
            title="No Seminars Available"
            description="There are currently no co-curricular seminars or bootcamps active. Check back later!"
          />
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="events-grid">
          {listableEvents.map((evt) => {
            const isReg = checkIsRegistered(evt.id);
            const isHovered = hoveredCardId === evt.id;
            const seatsLeft = Math.max(0, evt.capacity - evt.registeredCount);
            const isSoldOut = seatsLeft <= 0;

            return (
              <div
                key={evt.id}
                onMouseEnter={() => setHoveredCardId(evt.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onClick={() => navigate(`/events/${evt.id}`)}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col h-[460px] cursor-pointer relative"
                style={{
                  boxShadow: isHovered
                    ? "0 20px 25px -5px rgba(108, 29, 95, 0.08), 0 10px 10px -5px rgba(108, 29, 95, 0.04)"
                    : "0 1px 3px rgba(0,0,0,0.02)"
                }}
              >
                {/* Event Image Banner */}
                <div className="h-44 relative overflow-hidden bg-gray-50 shrink-0 border-b border-gray-100">
                  <img
                    src={evt.bannerUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Mode Badge overlay */}
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white font-mono text-[9px] font-bold tracking-wider uppercase rounded-md shadow-sm">
                      {evt.locationMode === "online" && <Globe className="w-3 h-3 text-[#76f7e8]" />}
                      {evt.locationMode === "offline" && <MapPin className="w-3 h-3 text-pink-300" />}
                      {evt.locationMode === "hybrid" && <BookOpen className="w-3 h-3 text-yellow-300" />}
                      {evt.locationMode}
                    </span>
                  </div>

                  {/* Status Banner Overlay for ended/cancelled */}
                  {evt.status === "cancelled" && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                      <span className="px-4 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-lg">
                        Cancelled
                      </span>
                    </div>
                  )}
                  {evt.status === "completed" && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-4 py-2 bg-[#6C1D5F] text-white font-bold text-xs uppercase tracking-widest rounded-lg">
                        Completed
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info body */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Title */}
                    <h3 className="text-base font-extrabold text-gray-900 tracking-tight leading-snug line-clamp-2 hover:text-[#6C1D5F]">
                      {evt.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed font-sans font-medium">
                      {evt.description}
                    </p>
                  </div>

                  {/* bottom details rail */}
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-400 font-sans font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{formatEventDate(evt.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold text-gray-600">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>
                          {isSoldOut ? (
                            <span className="text-red-500 font-bold">Sold Out</span>
                          ) : (
                            `${seatsLeft} Seats Left`
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Registration Button */}
                    {evt.status === "published" && (
                      <button
                        type="button"
                        disabled={isSoldOut && !isReg}
                        onClick={(e) => handleRegister(e, evt)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 ${
                          isReg
                            ? "bg-purple-50 hover:bg-purple-100 text-[#6C1D5F] border border-purple-200"
                            : isSoldOut
                              ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                              : "bg-[#6C1D5F] hover:bg-[#4A1E47] text-white shadow-xs hover:scale-[1.01] active:scale-[0.98]"
                        }`}
                      >
                        {isReg ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-[#6C1D5F]" />
                            <span>Registered (Cancel)</span>
                          </>
                        ) : isSoldOut ? (
                          <span>Full House (Sold Out)</span>
                        ) : (
                          <span>Register Now</span>
                        )}
                      </button>
                    )}

                    {evt.status === "completed" && (
                      <button
                        disabled
                        className="w-full py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase text-gray-400 flex items-center justify-center cursor-not-allowed"
                      >
                        Event Finished
                      </button>
                    )}

                    {evt.status === "cancelled" && (
                      <button
                        disabled
                        className="w-full py-2.5 bg-red-50/50 border border-red-100 rounded-xl text-xs font-bold uppercase text-red-400 flex items-center justify-center cursor-not-allowed"
                      >
                        Cancelled
                      </button>
                    )}
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

export default EventsListing;
