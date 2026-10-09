import apiClient from "../../../lib/apiClient";
import { Event, EventRegistration } from "../types";

/**
 * Maps a backend EventResponseDTO to frontend Event structure
 */
function mapBackendEventToFrontend(backendEvent: any): Event {
  return {
    id: String(backendEvent.id),
    title: backendEvent.title,
    description: backendEvent.description,
    bannerUrl: backendEvent.bannerUrl || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
    startDate: backendEvent.startDate,
    endDate: backendEvent.endDate,
    registrationDeadline: backendEvent.registrationDeadline,
    locationMode: (backendEvent.locationMode || "ONLINE").toLowerCase() as any,
    meetingLink: backendEvent.meetingLink,
    venue: backendEvent.venue,
    capacity: backendEvent.capacity,
    registeredCount: backendEvent.registeredCount,
    organizerName: backendEvent.organizerName,
    organizerEmail: backendEvent.organizerEmail,
    status: (backendEvent.status || "DRAFT").toLowerCase() as any,
    slug: backendEvent.slug, // Keep slug reference
  } as Event & { slug?: string };
}

/**
 * Maps a backend EventRegistrationDTO to frontend EventRegistration structure
 */
function mapBackendRegistrationToFrontend(backendReg: any): EventRegistration {
  let attendance: "Present" | "Absent" | "Pending" = "Pending";
  if (backendReg.attendanceStatus === "ATTENDED" || backendReg.attendanceStatus === "CHECKED_IN") {
    attendance = "Present";
  } else if (backendReg.attendanceStatus === "ABSENT") {
    attendance = "Absent";
  }

  return {
    id: String(backendReg.id),
    eventId: String(backendReg.eventId),
    studentName: backendReg.studentName,
    studentEmail: backendReg.studentEmail,
    registeredDate: backendReg.registeredAt,
    attendance,
    certificateIssued: backendReg.certificateIssued,
  };
}

export const eventService = {
  /**
   * Fetch all educational events/seminars
   */
  async getEvents(role?: "admin" | "teacher" | "student" | null): Promise<Event[]> {
    if (role === "admin" || role === "teacher") {
      const response = await apiClient.get("/admin/events", { params: { size: 1000 } });
      const content = response.data.content || [];
      return content.map(mapBackendEventToFrontend);
    } else {
      const response = await apiClient.get("/catalog/events", { params: { size: 1000 } });
      const content = response.data.content || [];
      return content.map(mapBackendEventToFrontend);
    }
  },

  /**
   * Fetch a single event by ID or slug
   */
  async getEvent(id: string, role?: string): Promise<Event | undefined> {
    try {
      let response;
      if ((role === "admin" || role === "teacher") && /^\d+$/.test(id)) {
        response = await apiClient.get(`/admin/events/${id}`);
      } else {
        response = await apiClient.get(`/catalog/events/${id}`);
      }
      return mapBackendEventToFrontend(response.data);
    } catch (err) {
      console.error("Failed to fetch event details:", err);
      return undefined;
    }
  },

  /**
   * Create a new event
   */
  async createEvent(eventData: Omit<Event, "id" | "registeredCount">): Promise<Event> {
    const requestBody = {
      title: eventData.title,
      description: eventData.description,
      bannerUrl: eventData.bannerUrl,
      locationMode: (eventData.locationMode || "online").toUpperCase(),
      venue: eventData.venue,
      meetingLink: eventData.meetingLink,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      registrationDeadline: eventData.registrationDeadline,
      capacity: Number(eventData.capacity),
      organizerName: eventData.organizerName,
      organizerEmail: eventData.organizerEmail,
      status: (eventData.status || "draft").toUpperCase(),
    };

    const response = await apiClient.post("/admin/events", requestBody);
    return mapBackendEventToFrontend(response.data);
  },

  /**
   * Update an existing event details
   */
  async updateEvent(id: string, updatedFields: Partial<Event>): Promise<Event> {
    const requestBody = {
      title: updatedFields.title,
      description: updatedFields.description,
      bannerUrl: updatedFields.bannerUrl,
      locationMode: updatedFields.locationMode ? updatedFields.locationMode.toUpperCase() : undefined,
      venue: updatedFields.venue,
      meetingLink: updatedFields.meetingLink,
      startDate: updatedFields.startDate,
      endDate: updatedFields.endDate,
      registrationDeadline: updatedFields.registrationDeadline,
      capacity: updatedFields.capacity ? Number(updatedFields.capacity) : undefined,
      organizerName: updatedFields.organizerName,
      organizerEmail: updatedFields.organizerEmail,
      status: updatedFields.status ? updatedFields.status.toUpperCase() : undefined,
    };

    const response = await apiClient.put(`/admin/events/${id}`, requestBody);
    return mapBackendEventToFrontend(response.data);
  },

  /**
   * Delete an event by ID
   */
  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/admin/events/${id}`);
  },

  /**
   * Fetch all event registrations
   */
  async getRegistrations(role?: "admin" | "teacher" | "student" | null): Promise<EventRegistration[]> {
    if (role === "admin" || role === "teacher") {
      const response = await apiClient.get("/admin/events", { params: { size: 1000 } });
      const eventsContent = response.data.content || [];
      const allRegs: EventRegistration[] = [];
      for (const evt of eventsContent) {
        if (evt.registrations) {
          allRegs.push(...evt.registrations.map(mapBackendRegistrationToFrontend));
        }
      }
      return allRegs;
    } else {
      try {
        const response = await apiClient.get("/events/my-registrations");
        return (response.data || []).map(mapBackendRegistrationToFrontend);
      } catch (err) {
        console.error("Failed to fetch my-registrations", err);
        return [];
      }
    }
  },

  /**
   * Register a student for a specific event
   */
  async registerForEvent(
    slug: string,
    studentName: string,
    studentEmail: string
  ): Promise<boolean> {
    const response = await apiClient.post(`/events/${slug}/register`);
    return !!response.data;
  },

  /**
   * Cancel a student registration for a specific event
   */
  async cancelRegistration(slug: string, studentEmail: string): Promise<void> {
    await apiClient.delete(`/events/${slug}/register`);
  },

  /**
   * Mark candidate attendance
   */
  async updateAttendance(
    registrationId: string,
    attendance: "Present" | "Absent" | "Pending"
  ): Promise<EventRegistration> {
    let attendanceStatus: string = "REGISTERED";
    if (attendance === "Present") {
      attendanceStatus = "ATTENDED";
    } else if (attendance === "Absent") {
      attendanceStatus = "ABSENT";
    }

    const response = await apiClient.put(`/admin/events/${registrationId}/attendance`, {
      attendanceStatus,
    });
    return mapBackendRegistrationToFrontend(response.data);
  },

  /**
   * Generate/issue certificate to a student for a present attendance
   */
  async issueCertificate(registrationId: string): Promise<EventRegistration> {
    const response = await apiClient.post(`/admin/events/${registrationId}/certificate`);
    // The response is a CertificateDTO, which is mapped differently.
    // Return dummy structure since the context's callback will merge.
    return {
      id: registrationId,
      certificateIssued: true,
    } as any;
  },

  /**
   * Export registrations roster as structured Excel file from the backend
   */
  async exportRegistrations(eventId: string): Promise<Blob> {
    const response = await apiClient.get(`/admin/events/${eventId}/registrations/export`, {
      responseType: "blob",
    });
    return response.data;
  }
};

export default eventService;

