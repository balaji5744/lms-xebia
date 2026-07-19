import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Upload, ArrowLeft, Globe, MapPin, Layers, Calendar, Mail, User, AlertTriangle, Loader2 } from "lucide-react";
import { useEvents } from "../context/EventContext";
import { useApp } from "../../../context/AppContext";
import { EventHeader } from "../components/EventHeader";

export const EditEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, updateEvent } = useEvents();
  const { showToast } = useApp();

  // Find the event
  const existingEvent = events.find((e) => e.id === id);

  // Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  
  const [locationMode, setLocationMode] = useState<"online" | "offline" | "hybrid">("online");
  const [meetingLink, setMeetingLink] = useState("");
  const [venue, setVenue] = useState("");
  const [capacity, setCapacity] = useState(100);
  
  const [organizerName, setOrganizerName] = useState("");
  const [organizerEmail, setOrganizerEmail] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "completed" | "cancelled">("draft");

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync state with loaded event
  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title);
      setDescription(existingEvent.description);
      setBannerUrl(existingEvent.bannerUrl);
      
      // Ensure date strings are formatted properly for datetime-local input (YYYY-MM-DDTHH:MM)
      const formatDateForInput = (isoString: string) => {
        if (!isoString) return "";
        return isoString.substring(0, 16);
      };
      
      setStartDate(formatDateForInput(existingEvent.startDate));
      setEndDate(formatDateForInput(existingEvent.endDate));
      setRegistrationDeadline(formatDateForInput(existingEvent.registrationDeadline));
      
      setLocationMode(existingEvent.locationMode);
      setMeetingLink(existingEvent.meetingLink || "");
      setVenue(existingEvent.venue || "");
      setCapacity(existingEvent.capacity);
      setOrganizerName(existingEvent.organizerName);
      setOrganizerEmail(existingEvent.organizerEmail);
      setStatus(existingEvent.status);
    }
  }, [existingEvent]);

  // If event not found
  if (!existingEvent) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4" id="event-not-found">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-800">Event Not Found</h2>
        <p className="text-sm text-red-600 font-medium">The event with ID "{id}" could not be retrieved.</p>
        <button
          onClick={() => navigate("/admin/events")}
          className="px-4 py-2 bg-white border border-red-200 text-red-700 font-semibold rounded-xl text-sm hover:bg-red-100/50 transition-all cursor-pointer focus:outline-none"
        >
          Return to Events Management
        </button>
      </div>
    );
  }

  // File processing
  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBannerUrl(event.target.result as string);
          showToast("Event banner updated successfully (Preview loaded).", "success");
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Please upload a valid image file (PNG, JPG).", "error");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Event title is required";
    if (!description.trim()) newErrors.description = "Event description is required";
    if (!startDate) newErrors.startDate = "Start date & time is required";
    if (!endDate) newErrors.endDate = "End date & time is required";
    if (!registrationDeadline) newErrors.registrationDeadline = "Registration deadline is required";
    if (!organizerName.trim()) newErrors.organizerName = "Coordinator name is required";
    if (!organizerEmail.trim()) {
      newErrors.organizerEmail = "Coordinator email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(organizerEmail)) {
      newErrors.organizerEmail = "Please enter a valid email address";
    }

    if (capacity <= 0) {
      newErrors.capacity = "Capacity must be a positive number of seats (at least 1)";
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end <= start) {
        newErrors.endDate = "End date & time must be after the start date & time";
      }
    }

    if (startDate && registrationDeadline) {
      const start = new Date(startDate);
      const deadline = new Date(registrationDeadline);
      if (deadline > start) {
        newErrors.registrationDeadline = "Registration deadline must be before or equal to the start date & time";
      }
    }

    if (locationMode !== "offline" && !meetingLink.trim()) {
      newErrors.meetingLink = "Meeting or Webinar link is required for online/hybrid events";
    } else if (locationMode !== "offline" && meetingLink.trim()) {
      if (!/^https?:\/\/.+/i.test(meetingLink)) {
        newErrors.meetingLink = "Please enter a valid URL (starting with http:// or https://)";
      }
    }

    if (locationMode !== "online" && !venue.trim()) {
      newErrors.venue = "Physical venue location is required for offline/hybrid events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (targetStatus: typeof status) => {
    if (!validateForm()) {
      showToast("Please fix the highlighted errors in the form.", "error");
      return;
    }

    await updateEvent(existingEvent.id, {
      title,
      description,
      bannerUrl,
      startDate,
      endDate,
      registrationDeadline,
      locationMode,
      meetingLink: locationMode !== "offline" ? meetingLink : undefined,
      venue: locationMode !== "online" ? venue : undefined,
      capacity: Number(capacity),
      organizerName,
      organizerEmail,
      status: targetStatus,
    });

    showToast(`Event "${title}" has been successfully updated!`, "success");
    navigate("/admin/events");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto" id="edit-event-page">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate("/admin/events")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#6C1D5F] transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events Management
        </button>
      </div>

      {/* Header */}
      <EventHeader
        title="Edit Event"
        description={`Modify schedules, registration properties, and settings for "${existingEvent.title}"`}
      />

      <div className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6C1D5F]" />
            <h2 className="text-base font-bold text-gray-800">Basic Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Event Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Spring Boot Masterclass & Cloud Orchestration"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.title ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Max Capacity (Seats) *
              </label>
              <input
                type="number"
                min={1}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.capacity ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.capacity && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.capacity}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Event Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Write a clear, detailed overview explaining what students will learn, any prerequisites, and the expected outcomes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.description ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.description && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.description}</p>}
            </div>

            {/* Banner Drag and Drop */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Event Banner Upload
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`md:col-span-2 border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                    isDragging
                      ? "border-[#6C1D5F] bg-[#6C1D5F]/5"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
                  }`}
                  onClick={() => document.getElementById("banner-upload-input")?.click()}
                >
                  <input
                    type="file"
                    id="banner-upload-input"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                  />
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">
                    {isUploading ? "Reading file..." : "Drag and drop event banner here, or click to browse"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG (Max 5MB)</p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="w-full h-28 rounded-xl border border-gray-100 overflow-hidden shadow-xs relative bg-gray-50">
                    <img
                      src={bannerUrl}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/60 text-white font-mono text-[9px] px-2 py-0.5 rounded-md font-semibold tracking-wide uppercase">
                      Live Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Schedule */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#6C1D5F]" />
            <h2 className="text-base font-bold text-gray-800">Event Schedule</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.startDate ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.startDate && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.endDate ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.endDate && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.endDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Registration Deadline *
              </label>
              <input
                type="datetime-local"
                required
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.registrationDeadline ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.registrationDeadline && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.registrationDeadline}</p>}
            </div>
          </div>
        </div>

        {/* SECTION 3: Location settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#6C1D5F]" />
            <h2 className="text-base font-bold text-gray-800">Location Details</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Location Mode
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(["online", "offline", "hybrid"] as const).map((mode) => (
                  <label
                    key={mode}
                    className={`flex items-center justify-center gap-2 p-3 border rounded-xl cursor-pointer text-xs font-bold uppercase tracking-wider transition-all focus:outline-none ${
                      locationMode === mode
                        ? "border-[#6C1D5F] bg-[#6C1D5F]/5 text-[#6C1D5F] font-extrabold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="locationMode"
                      value={mode}
                      checked={locationMode === mode}
                      onChange={() => setLocationMode(mode)}
                      className="hidden"
                    />
                    {mode === "online" && <Globe className="w-4 h-4 shrink-0" />}
                    {mode === "offline" && <MapPin className="w-4 h-4 shrink-0" />}
                    {mode === "hybrid" && (
                      <>
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-gray-300">/</span>
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                      </>
                    )}
                    {mode}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locationMode !== "offline" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Meeting / Webinar Link *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://zoom.us/j/1234567890 or Meet link"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                      errors.meetingLink ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                    }`}
                  />
                  {errors.meetingLink && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.meetingLink}</p>}
                </div>
              )}

              {locationMode !== "online" && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Physical Venue *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Block B, Seminar Auditorium II"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                      errors.venue ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                    }`}
                  />
                  {errors.venue && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.venue}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 4: Organizer */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="border-b border-gray-100 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-[#6C1D5F]" />
            <h2 className="text-base font-bold text-gray-800">Organizer / Coordinator</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Coordinator Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Alex Rivera"
                value={organizerName}
                onChange={(e) => setOrganizerName(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.organizerName ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.organizerName && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.organizerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                required
                placeholder="e.g., coordinator@educorp.com"
                value={organizerEmail}
                onChange={(e) => setOrganizerEmail(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-800 font-medium ${
                  errors.organizerEmail ? "border-red-300 ring-2 ring-red-100" : "border-gray-200"
                }`}
              />
              {errors.organizerEmail && <p className="text-xs text-red-600 mt-1.5 font-medium">{errors.organizerEmail}</p>}
            </div>
          </div>
        </div>

        {/* Status Mode */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#6C1D5F]" />
            <h2 className="text-base font-bold text-gray-800">Publishing Status</h2>
          </div>
          <div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all text-gray-700 bg-white cursor-pointer pr-10"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate("/admin/events")}
            className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-all text-center cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit("draft")}
            className="w-full sm:w-auto px-6 py-3 border border-[#6C1D5F]/30 bg-[#6C1D5F]/5 rounded-xl text-sm font-bold text-[#6C1D5F] hover:bg-[#6C1D5F]/10 transition-all text-center cursor-pointer focus:outline-none"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit(status === "draft" ? "published" : status)}
            className="w-full sm:w-auto px-6 py-3 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white rounded-xl text-sm font-bold transition-all shadow-md text-center cursor-pointer focus:outline-none"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
