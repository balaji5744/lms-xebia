import React, { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Globe, 
  Mail, 
  User, 
  Clock, 
  CheckCircle, 
  ExternalLink, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useApp } from "../../../context/AppContext";
import { EventErrorState } from "../components/EventErrorState";

export const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, registrations, registerForEvent, cancelRegistration, loading } = useEvents();
  const { currentUser, showToast } = useApp();

  // Find the event
  const evt = events.find((e) => e.id === id);

  // Is Registered
  const isRegistered = useMemo(() => {
    if (!currentUser || !evt) return false;
    return registrations.some(
      (r) => r.eventId === evt.id && r.studentEmail === currentUser.email
    );
  }, [registrations, evt, currentUser]);

  // Related Events (up to 3 matching same location mode, upcoming, excluding current)
  const relatedEvents = useMemo(() => {
    if (!evt) return [];
    return events
      .filter((e) => e.id !== evt.id && e.status === "published")
      .filter((e) => e.locationMode === evt.locationMode)
      .slice(0, 3);
  }, [events, evt]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" id="details-loading">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F]" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading seminar details...</p>
      </div>
    );
  }

  if (!evt) {
    return (
      <EventErrorState
        title="Seminar Not Found"
        description="The specified event ID could not be loaded from state storage or may have been deleted."
        action={
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white font-bold rounded-xl text-sm transition-all cursor-pointer shadow-xs"
          >
            Return to Seminars Catalog
          </button>
        }
      />
    );
  }

  const seatsLeft = Math.max(0, evt.capacity - evt.registeredCount);
  const isSoldOut = seatsLeft <= 0;

  const handleRegisterClick = async () => {
    if (!currentUser) {
      showToast("Please sign in to register for events.", "error");
      return;
    }

    if (isRegistered) {
      await cancelRegistration(evt.id, currentUser.email);
      showToast(`Successfully cancelled registration for "${evt.title}".`, "info");
    } else {
      const success = await registerForEvent(evt.id, currentUser.fullName, currentUser.email);
      if (success) {
        showToast(`Successfully registered for "${evt.title}"! Check your email for details.`, "success");
      } else {
        showToast(`Could not complete registration. Seats might be full.`, "error");
      }
    }
  };

  const getFormatTime = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const getFormatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-8" id="event-details-page">
      {/* Return button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Hero Banner Area */}
      <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden border border-gray-200 shadow-md">
        <img
          src={evt.bannerUrl}
          alt={evt.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Title Overlaid */}
        <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl">
            {evt.title}
          </h1>
        </div>
      </div>

      {/* Grid Layout: Left Description & Right Sticky Register Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* General info row (Mobile-only display mostly, or metadata shelf) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#6C1D5F]" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                <p className="text-xs font-bold text-gray-800">{getFormatDate(evt.startDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
              <Clock className="w-5 h-5 text-[#6C1D5F]" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Time</p>
                <p className="text-xs font-bold text-gray-800">
                  {getFormatTime(evt.startDate)} - {getFormatTime(evt.endDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-4">
              <Globe className="w-5 h-5 text-[#6C1D5F]" />
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Location Mode</p>
                <p className="text-xs font-bold text-gray-800 uppercase">{evt.locationMode}</p>
              </div>
            </div>
          </div>

          {/* Description Block */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">About This Seminar</h3>
            <div className="text-sm text-gray-600 leading-relaxed font-sans font-medium whitespace-pre-line space-y-4">
              <p>{evt.description}</p>
              <p>By participating in this workshop, you will gain hands-on credentials, network with leading professional engineers or recruiters, and build production-ready artifacts for your portfolio. Highly recommended for candidates searching for technical placement support.</p>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">Coordinator Details</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 text-[#6C1D5F] border border-purple-100 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner">
                {evt.organizerName.substring(0, 2).toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-bold text-gray-800">{evt.organizerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <a href={`mailto:${evt.organizerEmail}`} className="text-xs font-semibold text-[#6C1D5F] hover:underline">
                    {evt.organizerEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related Events Shelf */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-gray-900 tracking-tight border-b border-gray-100 pb-2">Other Related Seminars</h3>
            {relatedEvents.length === 0 ? (
              <p className="text-sm text-gray-400 font-medium font-sans">No other similar seminars scheduled at this time.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedEvents.map((rEvt) => (
                  <Link
                    key={rEvt.id}
                    to={`/events/${rEvt.id}`}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:-translate-y-1 hover:shadow-md transition-all flex flex-col h-72"
                  >
                    <img
                      src={rEvt.bannerUrl}
                      alt={rEvt.title}
                      className="h-28 w-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-gray-900 line-clamp-2 leading-snug hover:text-[#6C1D5F]">
                          {rEvt.title}
                        </h4>
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">
                        {rEvt.locationMode}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Desktop Sticky Registration Card */}
        <div className="lg:sticky lg:top-8 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-6 space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-900">Seminar Registration</h3>
              <p className="text-xs text-gray-400 mt-1">Book your seat before deadline</p>
            </div>

            {/* Registration properties */}
            <div className="space-y-4">
              {/* Seats info */}
              <div className="flex justify-between items-center bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Seats Available</span>
                <span className="text-sm font-black text-gray-800">
                  {isSoldOut ? (
                    <span className="text-red-500 font-bold">Sold Out</span>
                  ) : (
                    `${seatsLeft} / ${evt.capacity}`
                  )}
                </span>
              </div>

              {/* Deadline */}
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-gray-400">Deadline</span>
                <span className="text-gray-600">
                  {new Date(evt.registrationDeadline).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Physical Venue details if offline/hybrid */}
              {evt.locationMode !== "online" && evt.venue && (
                <div className="bg-purple-50/30 p-3 rounded-xl border border-purple-100/40 text-xs">
                  <span className="block font-bold text-[#6C1D5F] mb-1">Physical Location Venue</span>
                  <span className="text-gray-600 font-medium">{evt.venue}</span>
                </div>
              )}

              {/* Secured Webinar Google Meet/Zoom links REVEALED once registered */}
              {isRegistered && (evt.meetingLink) && (
                <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl space-y-2 animate-fade-in text-xs">
                  <span className="block font-bold text-[#6C1D5F]">Your Registered Access Link:</span>
                  <a
                    href={evt.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#6C1D5F] hover:underline"
                  >
                    Join Seminar Now
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Registration status / registration button */}
            {evt.status === "published" && (
              <button
                type="button"
                disabled={isSoldOut && !isRegistered}
                onClick={handleRegisterClick}
                className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 ${
                  isRegistered
                    ? "bg-purple-50 hover:bg-purple-100 text-[#6C1D5F] border border-purple-200"
                    : isSoldOut
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : "bg-[#6C1D5F] hover:bg-[#4A1E47] text-white shadow-md active:scale-[0.98] hover:scale-[1.01]"
                }`}
              >
                {isRegistered ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-[#6C1D5F]" />
                    <span>Registered (Cancel Seat)</span>
                  </>
                ) : isSoldOut ? (
                  <span>Event Full (Sold Out)</span>
                ) : (
                  <span>Claim Your Seat Now</span>
                )}
              </button>
            )}

            {evt.status === "completed" && (
              <div className="p-4 bg-purple-50 text-[#6C1D5F] rounded-xl border border-purple-100 text-center text-xs font-bold uppercase tracking-wider">
                Event Finished
              </div>
            )}

            {evt.status === "cancelled" && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center text-xs font-bold uppercase tracking-wider">
                Event Cancelled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
