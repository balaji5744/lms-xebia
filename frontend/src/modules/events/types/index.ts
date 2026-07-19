export interface Event {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  locationMode: "online" | "offline" | "hybrid";
  meetingLink?: string;
  venue?: string;
  capacity: number;
  registeredCount: number;
  organizerName: string;
  organizerEmail: string;
  status: "draft" | "published" | "completed" | "cancelled";
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentName: string;
  studentEmail: string;
  registeredDate: string;
  attendance: "Present" | "Absent" | "Pending";
  certificateIssued: boolean;
}

export interface EventStats {
  total: number;
  upcoming: number;
  completed: number;
  draft: number;
  registrations: number;
}
