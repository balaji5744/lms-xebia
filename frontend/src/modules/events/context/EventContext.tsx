import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Event, EventRegistration, EventStats } from "../types";
import { eventService } from "../api/eventService";
import { useApp } from "../../../context/AppContext";

interface EventContextProps {
  events: Event[];
  registrations: EventRegistration[];
  loading: boolean;
  addEvent: (event: Omit<Event, "id" | "registeredCount">) => Promise<void>;
  updateEvent: (id: string, updatedFields: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  registerForEvent: (eventId: string, studentName: string, studentEmail: string) => Promise<boolean>;
  cancelRegistration: (eventId: string, studentEmail: string) => Promise<void>;
  updateAttendance: (registrationId: string, attendance: "Present" | "Absent" | "Pending") => Promise<void>;
  issueCertificate: (registrationId: string) => Promise<void>;
  exportRegistrations: (eventId: string, title: string) => Promise<void>;
  stats: EventStats;
  refreshData: () => Promise<void>;
}

const EventContext = createContext<EventContextProps | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userRole } = useApp();

  // Sync / load helper
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [evts, regs] = await Promise.all([
        eventService.getEvents(userRole),
        eventService.getRegistrations(userRole),
      ]);
      setEvents(evts);
      setRegistrations(regs);
    } catch (err) {
      console.error("Failed to load events data in context:", err);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Fetch on mount and whenever userRole changes
  useEffect(() => {
    refreshData();
  }, [refreshData, userRole]);

  // Actions delegated to eventService
  const addEvent = useCallback(async (event: Omit<Event, "id" | "registeredCount">) => {
    try {
      const newEvent = await eventService.createEvent(event);
      setEvents((prev) => [newEvent, ...prev]);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, updatedFields: Partial<Event>) => {
    try {
      // Fetch the existing event from local state to ensure we send a complete, valid payload to the backend
      const existing = events.find((evt) => evt.id === id);
      if (!existing) {
        throw new Error(`Event with ID ${id} not found in state`);
      }
      const mergedFields = { ...existing, ...updatedFields };
      const updated = await eventService.updateEvent(id, mergedFields);
      setEvents((prev) => prev.map((evt) => (evt.id === id ? updated : evt)));
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  }, [events]);

  const deleteEvent = useCallback(async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((evt) => evt.id !== id));
      setRegistrations((prev) => prev.filter((reg) => reg.eventId !== id));
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  }, []);

  const registerForEvent = useCallback(async (
    eventId: string,
    studentName: string,
    studentEmail: string
  ): Promise<boolean> => {
    try {
      const existing = events.find((evt) => evt.id === eventId);
      if (!existing) {
        console.error(`Cannot register: Event with ID ${eventId} not found`);
        return false;
      }
      // Extract the slug (or fallback to id if slug is absent)
      const slug = (existing as any).slug || eventId;
      const success = await eventService.registerForEvent(slug, studentName, studentEmail);
      if (success) {
        // Refresh events and registrations lists
        const [evts, regs] = await Promise.all([
          eventService.getEvents(userRole),
          eventService.getRegistrations(userRole),
        ]);
        setEvents(evts);
        setRegistrations(regs);
      }
      return success;
    } catch (err) {
      console.error("Failed to register for event:", err);
      return false;
    }
  }, [events, userRole]);

  const cancelRegistration = useCallback(async (eventId: string, studentEmail: string) => {
    try {
      const existing = events.find((evt) => evt.id === eventId);
      if (!existing) {
        console.error(`Cannot cancel registration: Event with ID ${eventId} not found`);
        return;
      }
      const slug = (existing as any).slug || eventId;
      await eventService.cancelRegistration(slug, studentEmail);
      
      const [evts, regs] = await Promise.all([
        eventService.getEvents(userRole),
        eventService.getRegistrations(userRole),
      ]);
      setEvents(evts);
      setRegistrations(regs);
    } catch (err) {
      console.error("Failed to cancel registration:", err);
    }
  }, [events, userRole]);

  const updateAttendance = useCallback(async (
    registrationId: string,
    attendance: "Present" | "Absent" | "Pending"
  ) => {
    try {
      await eventService.updateAttendance(registrationId, attendance);
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === registrationId ? { ...reg, attendance } : reg))
      );
    } catch (err) {
      console.error("Failed to update attendance:", err);
    }
  }, []);

  const issueCertificate = useCallback(async (registrationId: string) => {
    try {
      await eventService.issueCertificate(registrationId);
      setRegistrations((prev) =>
        prev.map((reg) => (reg.id === registrationId ? { ...reg, certificateIssued: true } : reg))
      );
    } catch (err) {
      console.error("Failed to issue certificate:", err);
    }
  }, []);

  const exportRegistrations = useCallback(async (eventId: string, title: string) => {
    try {
      const blob = await eventService.exportRegistrations(eventId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Registrations_${title.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err) {
      console.error("Failed to export registrations:", err);
      throw err;
    }
  }, []);

  // Compute lightweight statistics derived from local state
  const stats = useMemo<EventStats>(() => {
    const total = events.length;
    const now = new Date();
    
    const upcoming = events.filter((e) => {
      const endDate = new Date(e.endDate);
      return e.status === "published" && endDate >= now;
    }).length;

    const completed = events.filter((e) => {
      const endDate = new Date(e.endDate);
      return e.status === "completed" || (e.status !== "cancelled" && endDate < now);
    }).length;

    const draft = events.filter((e) => e.status === "draft").length;
    const regCount = registrations.length;

    return {
      total,
      upcoming,
      completed,
      draft,
      registrations: regCount,
    };
  }, [events, registrations]);

  const contextValue = useMemo(() => ({
    events,
    registrations,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    updateAttendance,
    issueCertificate,
    exportRegistrations,
    stats,
    refreshData,
  }), [
    events,
    registrations,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    updateAttendance,
    issueCertificate,
    exportRegistrations,
    stats,
    refreshData,
  ]);

  return <EventContext.Provider value={contextValue}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventProvider");
  }
  return context;
};
