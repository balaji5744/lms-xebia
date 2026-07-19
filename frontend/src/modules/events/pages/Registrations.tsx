import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Search, 
  Download, 
  Check, 
  X, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  UserCheck, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Loader2
} from "lucide-react";
import * as XLSX from "xlsx";
import { useEvents } from "../context/EventContext";
import { useApp } from "../../../context/AppContext";
import { EventHeader } from "../components/EventHeader";
import { EventEmptyState } from "../components/EventEmptyState";
import { EventStatusBadge } from "../components/EventStatusBadge";

export const Registrations: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { events, registrations, updateAttendance, issueCertificate, exportRegistrations, loading } = useEvents();
  const { showToast } = useApp();

  // Find the event
  const evt = events.find((e) => e.id === id);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState<"All" | "Present" | "Absent" | "Pending">("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter registrations for this specific event
  const eventRegistrations = useMemo(() => {
    return registrations.filter((reg) => reg.eventId === id);
  }, [registrations, id]);

  const filteredRegistrations = useMemo(() => {
    return eventRegistrations.filter((reg) => {
      const matchesSearch =
        reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.studentEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        attendanceFilter === "All" || reg.attendance === attendanceFilter;

      return matchesSearch && matchesFilter;
    });
  }, [eventRegistrations, searchQuery, attendanceFilter]);

  // Paginated chunk
  const paginatedRegistrations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRegistrations.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRegistrations, currentPage]);

  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage) || 1;

  const handleMarkAttendance = async (regId: string, name: string, status: "Present" | "Absent") => {
    await updateAttendance(regId, status);
    // Auto issue certificate if marked present on completed event
    if (status === "Present" && (evt?.status === "completed" || new Date(evt?.endDate || "") < new Date())) {
      await issueCertificate(regId);
    }
    showToast(`Successfully marked ${name} as ${status}.`, "success");
  };

  const handleIssueCert = async (regId: string, name: string) => {
    await issueCertificate(regId);
    showToast(`Successfully generated and issued seminar certificate for ${name}!`, "success");
  };

  const exportToExcel = async () => {
    if (eventRegistrations.length === 0) {
      showToast("No registrations available to export.", "error");
      return;
    }

    try {
      if (evt) {
        await exportRegistrations(evt.id, evt.title);
        showToast("Attendees spreadsheet downloaded successfully!", "success");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to download Excel file from backend.", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24" id="registrations-loading">
        <Loader2 className="w-10 h-10 animate-spin text-[#6C1D5F]" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading attendee registrations...</p>
      </div>
    );
  }

  if (!evt) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-xl mx-auto space-y-4" id="regs-event-not-found">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-lg font-bold text-red-800">Seminar Not Found</h2>
        <p className="text-sm text-red-600 font-medium">The specified event registrations could not be loaded.</p>
        <button
          onClick={() => navigate("/admin/events")}
          className="px-4 py-2 bg-white border border-red-200 text-red-700 font-semibold rounded-xl text-sm hover:bg-red-100/50 transition-all cursor-pointer"
        >
          Return to Events Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="registrations-admin-page">
      {/* Back button link */}
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
        title="Seminar Registrations"
        description={`Manage attendance, verify participations, and download the roster sheets for "${evt.title}".`}
        action={
          <button
            onClick={exportToExcel}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1D5F] hover:bg-[#4A1E47] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer focus:outline-none"
          >
            <Download className="w-4 h-4" />
            Download Excel
          </button>
        }
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase">Registered</span>
          <span className="text-lg font-black text-gray-800">{eventRegistrations.length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-[#6C1D5F] uppercase">Present</span>
          <span className="text-lg font-black text-[#6C1D5F]">{eventRegistrations.filter(r => r.attendance === "Present").length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-red-500 uppercase">Absent</span>
          <span className="text-lg font-black text-red-700">{eventRegistrations.filter(r => r.attendance === "Absent").length}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-amber-500 uppercase">Pending</span>
          <span className="text-lg font-black text-amber-700">{eventRegistrations.filter(r => r.attendance === "Pending").length}</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Attendance Filters */}
        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full sm:w-auto">
          {(["All", "Present", "Absent", "Pending"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setAttendanceFilter(tab);
                setCurrentPage(1);
              }}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer focus:outline-none ${
                attendanceFilter === tab
                  ? "bg-[#6C1D5F] text-white"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/10 transition-all font-medium text-gray-700"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F6F8FC] border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Registered Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">Certificate</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12">
                    <EventEmptyState
                      icon={Search}
                      title="No registrations found"
                      description="There are no participants matching the selected filters for this seminar."
                    />
                  </td>
                </tr>
              ) : (
                paginatedRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {reg.studentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                      {reg.studentEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-semibold font-mono">
                      {new Date(reg.registeredDate).toLocaleDateString()} at {new Date(reg.registeredDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <EventStatusBadge status={reg.attendance} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reg.certificateIssued ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Issued</span>
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium font-sans">Not Issued</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        onClick={() => handleMarkAttendance(reg.id, reg.studentName, "Present")}
                        className="inline-flex items-center justify-center p-1.5 bg-white border border-gray-200 text-green-600 hover:bg-green-50 rounded-lg transition-all text-xs font-bold cursor-pointer focus:outline-none"
                        title="Mark Present"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMarkAttendance(reg.id, reg.studentName, "Absent")}
                        className="inline-flex items-center justify-center p-1.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 rounded-lg transition-all text-xs font-bold cursor-pointer focus:outline-none"
                        title="Mark Absent"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {reg.attendance === "Present" && !reg.certificateIssued && (
                        <button
                          onClick={() => handleIssueCert(reg.id, reg.studentName)}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 rounded-lg transition-all text-xs font-bold cursor-pointer focus:outline-none"
                          title="Generate Certificate"
                        >
                          <Award className="w-3.5 h-3.5 mr-1" />
                          Issue Cert
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        {totalPages > 1 && (
          <div className="bg-[#F6F8FC] border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium font-sans">
              Showing Page {currentPage} of {totalPages} ({filteredRegistrations.length} candidates)
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registrations;
