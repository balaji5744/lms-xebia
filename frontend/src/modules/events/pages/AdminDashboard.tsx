import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText, 
  Users, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  Send, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useEvents } from "../context/EventContext";
import { Event } from "../types";
import { useApp } from "../../../context/AppContext";
import { EventHeader } from "../components/EventHeader";
import { EventEmptyState } from "../components/EventEmptyState";
import { EventStatusBadge } from "../components/EventStatusBadge";

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { events, deleteEvent, updateEvent, stats, loading } = useEvents();
  const { showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "completed" | "draft" | "cancelled">("all");

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch = 
        evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.organizerName.toLowerCase().includes(searchQuery.toLowerCase());

      const now = new Date();
      const endDate = new Date(evt.endDate);

      let matchesStatus = true;
      if (statusFilter !== "all") {
        if (statusFilter === "completed") {
          // Completed status if explicitly completed OR end date has passed
          matchesStatus = evt.status === "completed" || endDate < now;
        } else if (statusFilter === "published") {
          // Published status if published AND not completed
          matchesStatus = evt.status === "published" && endDate >= now;
        } else {
          matchesStatus = evt.status === statusFilter;
        }
      }

      return matchesSearch && matchesStatus;
    });
  }, [events, searchQuery, statusFilter]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteEvent(id);
      showToast(`Event "${title}" has been deleted successfully.`, "success");
    }
  };

  const handlePublish = async (id: string, title: string) => {
    await updateEvent(id, { status: "published" });
    showToast(`Event "${title}" has been published successfully!`, "success");
  };

  const getStatusBadge = (evt: Event) => {
    const now = new Date();
    const endDate = new Date(evt.endDate);

    if (evt.status === "cancelled") {
      return <EventStatusBadge status="cancelled" />;
    }

    if (evt.status === "draft") {
      return <EventStatusBadge status="draft" />;
    }

    if (endDate < now || evt.status === "completed") {
      return <EventStatusBadge status="completed" />;
    }

    return <EventStatusBadge status="published" />;
  };

  const formatEventDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" id="admin-dashboard-loading">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F]" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading events registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" id="admin-events-dashboard">
      {/* Page Header */}
      <EventHeader
        title="Events Management"
        description="Create, edit, schedule and monitor all educational events & seminars."
        action={
          <button
            onClick={() => navigate("/admin/events/create")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white rounded-xl text-sm font-semibold tracking-wide transition-all shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#6C1D5F]/20"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-[#6C1D5F] border border-purple-100/50 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Events</p>
            <h3 className="text-2xl font-black text-gray-800">{stats.total}</h3>
          </div>
        </div>

        {/* Upcoming Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Upcoming</p>
            <h3 className="text-2xl font-black text-gray-800">{stats.upcoming}</h3>
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Completed</p>
            <h3 className="text-2xl font-black text-gray-800">{stats.completed}</h3>
          </div>
        </div>

        {/* Draft Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Drafts</p>
            <h3 className="text-2xl font-black text-gray-800">{stats.draft}</h3>
          </div>
        </div>

        {/* Registrations Card */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Registrations</p>
            <h3 className="text-2xl font-black text-gray-800">{stats.registrations}</h3>
          </div>
        </div>
      </div>

      {/* Search & Tabs Filter Panel */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
          {(["all", "published", "completed", "draft", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
                statusFilter === tab
                  ? "bg-[#6C1D5F] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all font-medium text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Responsive Event Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden" id="events-table-wrapper">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FC] border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Banner</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Mode</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Start Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Seats</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12">
                    <EventEmptyState
                      icon={Search}
                      title="No matching events found"
                      description="Try adjusting your status filter or refining your search term."
                    />
                  </td>
                </tr>
              ) : (
                filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="w-16 h-10 object-cover rounded-lg border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs truncate font-semibold text-gray-900 text-sm hover:text-[#6C1D5F] cursor-pointer" onClick={() => navigate(`/events/${evt.id}`)}>{evt.title}</div>
                      <div className="text-[11px] font-medium text-gray-400 truncate">by {evt.organizerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{evt.locationMode}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">
                      {formatEventDate(evt.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs font-semibold text-gray-700">
                      {evt.registeredCount} / <span className="text-gray-400">{evt.capacity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(evt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => navigate(`/events/${evt.id}`)}
                        className="p-1.5 text-gray-500 hover:text-[#6C1D5F] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title="View Event Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/events/edit/${evt.id}`)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/events/${evt.id}/registrations`)}
                        className="p-1.5 text-gray-500 hover:text-[#6C1D5F] hover:bg-purple-50 rounded-lg transition-colors cursor-pointer"
                        title="Manage Registrations"
                      >
                        <Users className="w-4 h-4" />
                      </button>
                      {evt.status === "draft" && (
                        <button
                          onClick={() => handlePublish(evt.id, evt.title)}
                          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                          title="Publish Event"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(evt.id, evt.title)}
                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
