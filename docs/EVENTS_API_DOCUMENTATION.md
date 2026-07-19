# Geeknito LMS Events Module API Documentation

Welcome to the professional API documentation for the **Geeknito LMS Events Module** backend. This document provides a complete, developer-friendly guide to all implemented event endpoints, database entities, request/response models (DTOs), authentication/authorization (RBAC) rules, input validation constraints, and sample request/response payloads.

---

## Table of Contents

1. [Architecture & DB Entity Relationships](#architecture--db-entity-relationships)
2. [Role-Based Access Control (RBAC) Matrix](#role-based-access-control-rbac-matrix)
3. [Summary Table of Event Endpoints](#summary-table-of-event-endpoints)
4. [Endpoint Specifications](#endpoint-specifications)
    - [Public Catalog APIs](#public-catalog-apis)
    - [Student Registration APIs](#student-registration-apis)
    - [Event Administration APIs](#event-administration-apis)
    - [Attendance & Certificate APIs](#attendance--certificate-apis)
    - [Excel Export APIs](#excel-export-apis)
5. [Input Validation Rules](#input-validation-rules)
6. [Typical Workflow / Lifecycle](#typical-workflow--lifecycle)
7. [Error Handling & Code Map](#error-handling--code-map)

---

## Architecture & DB Entity Relationships

The Events module follows a clean 3-tier architecture (Controller -> Service -> Repository) built using Spring Boot. Data persistence is managed with Spring Data JPA and Hibernate.

### ER Diagram Description

```
  +-------------------+              +-------------------------+              +-------------------+
  |    UserEntity     | 1          * |       EventEntity       | 1          * | EventRegistration |
  |   (Users Table)   |-------------->|     (Events Table)      |-------------->|  (Registrations)  |
  |                   |              |                         |              |                   |
  |  - id: Long       |              |  - id: Long             |              |  - id: Long       |
  |  - fullName: String|             |  - slug: String (UK)    |              |  - event: Event   |
  |  - role: String   |              |  - title: String        |              |  - student: User  |
  |                   |              |  - status: EventStatus  |              |  - status: Attend |
  |                   |              |  - createdBy: User      |              |  - issuedCert: Bl |
  +-------------------+              +-------------------------+              +-------------------+
```

- **`EventEntity` (represented in database as `events`)**:
  - One-to-Many relationship with `EventRegistration` (Cascade Delete upon event deletion).
  - Many-to-One relationship with `UserEntity` (`createdBy`) representing the Teacher or Admin who authored the event.
  - Primary slug-based index for fast public lookup.

- **`EventRegistrationEntity` (represented in database as `event_registrations`)**:
  - Many-to-One relationship with `EventEntity` (`event_id`).
  - Many-to-One relationship with `UserEntity` (`student_id`).
  - Unique constraint on `(event_id, student_id)` to prevent duplicate registrations.

---

## Role-Based Access Control (RBAC) Matrix

Secured endpoints require a valid JWT bearer header:
```http
Authorization: Bearer <JWT_TOKEN>
```

| Endpoint Path | HTTP Method | Guest/Anon | Student | Teacher (Owner) | Teacher (Non-Owner) | Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| `/catalog/events` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/catalog/events/{slug}` | `GET` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/events/{slug}/register` | `POST` | ❌ | ✅ (Student) | ❌ | ❌ | ❌ |
| `/events/{slug}/register` | `DELETE` | ❌ | ✅ (Student) | ❌ | ❌ | ❌ |
| `/events/my-registrations`| `GET` | ❌ | ✅ (Student) | ❌ | ❌ | ❌ |
| `/admin/events` | `GET` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events` | `POST` | ❌ | ❌ | ✅ | ❌ | ✅ |
| `/admin/events/{id}` | `PUT` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events/{id}` | `DELETE` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events/dashboard` | `GET` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events/{id}/attendance` | `PUT` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events/{id}/certificate`| `POST` | ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |
| `/admin/events/{id}/registrations/export`| `GET`| ❌ | ❌ | ✅ (Own) | ❌ | ✅ (All) |

---

## Summary Table of Event Endpoints

The module exposes **13 high-quality REST APIs**:

| Category | Endpoint | Method | Role | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Catalog** | `/catalog/events` | `GET` | Public | Paginated event listing with keyword, status, mode & date filters |
| **Catalog** | `/catalog/events/{slug}` | `GET` | Public | Retrieve complete event details by its unique URL slug |
| **Registration** | `/events/{slug}/register` | `POST` | Student | Register currently authenticated student for the event |
| **Registration** | `/events/{slug}/register` | `DELETE` | Student | Cancel currently authenticated student's registration |
| **Registration** | `/events/my-registrations` | `GET` | Student | Retrieve all event registration history for active student |
| **Admin** | `/admin/events` | `GET` | Admin/Teacher| Paginated administrative roster (Teachers view own events only) |
| **Admin** | `/admin/events` | `POST` | Admin/Teacher| Create a new event with full field validations |
| **Admin** | `/admin/events/{id}` | `PUT` | Admin/Teacher| Update an existing event (validation guards capacity decrease) |
| **Admin** | `/admin/events/{id}` | `DELETE` | Admin/Teacher| soft cancel (default) or hard database delete of an event |
| **Dashboard** | `/admin/events/dashboard` | `GET` | Admin/Teacher| Overview metrics (counts, attendance ratios, issuance rates) |
| **Attendance** | `/admin/events/{id}/attendance`| `PUT` | Admin/Teacher| Mark student attendance (`REGISTERED`, `ATTENDED`, `ABSENT`) |
| **Attendance** | `/admin/events/{id}/certificate`| `POST` | Admin/Teacher| Generate/issue certificate (restricted to attended students) |
| **Export** | `/admin/events/{id}/registrations/export`| `GET`| Admin/Teacher| Download professional Excel spreadsheet of attendees |

---

## Endpoint Specifications

### Public Catalog APIs

#### 1. Get List of Events (Public Catalog)
- **Path:** `GET /catalog/events`
- **Headers:** None
- **Query Parameters:**
  - `search` (String, optional) - Keyword search matching title/description/organizer
  - `status` (String, optional) - Filter by event status (`DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`)
  - `mode` (String, optional) - Filter by location mode (`ONLINE`, `OFFLINE`, `HYBRID`)
  - `startDate` (ISO Date, optional) - Only show events starting after this date
  - `endDate` (ISO Date, optional) - Only show events ending before this date
  - `page` (Integer, default `0`) - Page index
  - `size` (Integer, default `10`) - Page size limit
  - `sortBy` (String, default `startDate`) - Sorting property
  - `direction` (String, default `ASC`) - Sort order (`ASC` or `DESC`)
- **Success Response (200 OK):**
  ```json
  {
    "content": [
      {
        "id": 1,
        "title": "Introduction to Cybersecurity Fundamentals",
        "slug": "introduction-to-cybersecurity-fundamentals",
        "description": "An interactive seminar on building secure modern applications.",
        "bannerUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
        "bannerFileName": null,
        "locationMode": "ONLINE",
        "venue": null,
        "meetingLink": "https://zoom.us/j/9876543210",
        "meetingProvider": "ZOOM",
        "startDate": "2026-08-01T10:00:00",
        "endDate": "2026-08-01T13:00:00",
        "registrationDeadline": "2026-07-31T23:59:59",
        "capacity": 100,
        "registeredCount": 42,
        "organizerName": "John Doe",
        "organizerEmail": "johndoe@educorp.com",
        "status": "PUBLISHED",
        "createdById": 2,
        "createdByFullName": "Jane Teacher"
      }
    ],
    "totalPages": 1,
    "totalElements": 1,
    "size": 10,
    "number": 0
  }
  ```

#### 2. Get Event by Slug
- **Path:** `GET /catalog/events/{slug}`
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "title": "Introduction to Cybersecurity Fundamentals",
    "slug": "introduction-to-cybersecurity-fundamentals",
    "description": "An interactive seminar on building secure modern applications.",
    "bannerUrl": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485",
    "locationMode": "ONLINE",
    "meetingLink": "https://zoom.us/j/9876543210",
    "meetingProvider": "ZOOM",
    "startDate": "2026-08-01T10:00:00",
    "endDate": "2026-08-01T13:00:00",
    "registrationDeadline": "2026-07-31T23:59:59",
    "capacity": 100,
    "registeredCount": 42,
    "organizerName": "John Doe",
    "organizerEmail": "johndoe@educorp.com",
    "status": "PUBLISHED",
    "createdById": 2,
    "createdByFullName": "Jane Teacher"
  }
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "status": 404,
    "error": "Not Found",
    "message": "Event not found with slug: introduction-to-cybersecurity-fundamentals-invalid"
  }
  ```

---

### Student Registration APIs

#### 3. Register for an Event
- **Path:** `POST /events/{slug}/register`
- **Headers:** `Authorization: Bearer <Student_JWT_Token>`
- **Success Response (201 Created):**
  ```json
  {
    "id": 5,
    "eventId": 1,
    "eventTitle": "Introduction to Cybersecurity Fundamentals",
    "studentId": 12,
    "studentName": "Bob Student",
    "studentEmail": "bob@student.com",
    "registeredAt": "2026-07-15T18:14:23",
    "attendanceStatus": "REGISTERED",
    "certificateIssued": false,
    "certificateCode": null
  }
  ```
- **Error Responses:**
  - **400 Bad Request:** Registration deadline has passed, or event is full.
  - **409 Conflict:** Currently authenticated student is already registered for this event.

#### 4. Cancel Registration
- **Path:** `DELETE /events/{slug}/register`
- **Headers:** `Authorization: Bearer <Student_JWT_Token>`
- **Success Response:** `204 No Content`

#### 5. Get My Registrations
- **Path:** `GET /events/my-registrations`
- **Headers:** `Authorization: Bearer <Student_JWT_Token>`
- **Success Response (200 OK):**
  ```json
  [
    {
      "id": 5,
      "eventId": 1,
      "eventTitle": "Introduction to Cybersecurity Fundamentals",
      "studentId": 12,
      "studentName": "Bob Student",
      "studentEmail": "bob@student.com",
      "registeredAt": "2026-07-15T18:14:23",
      "attendanceStatus": "REGISTERED",
      "certificateIssued": false,
      "certificateCode": null
    }
  ]
  ```

---

### Event Administration APIs

#### 6. Create Event
- **Path:** `POST /admin/events`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Request Body (EventRequestDTO):**
  ```json
  {
    "title": "React Advanced Workshop",
    "description": "Deep dive into React 19 performance features and custom compilers.",
    "bannerUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    "locationMode": "ONLINE",
    "venue": null,
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "meetingProvider": "GOOGLE_MEET",
    "startDate": "2026-09-10T14:00:00",
    "endDate": "2026-09-10T17:00:00",
    "registrationDeadline": "2026-09-09T23:59:59",
    "capacity": 50,
    "organizerName": "React Dev Team",
    "organizerEmail": "react@educorp.com",
    "status": "PUBLISHED"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "id": 2,
    "title": "React Advanced Workshop",
    "slug": "react-advanced-workshop",
    "description": "Deep dive into React 19 performance features and custom compilers.",
    "bannerUrl": "https://images.unsplash.com/photo-1633356122544-f134324a6cee",
    "locationMode": "ONLINE",
    "meetingLink": "https://meet.google.com/abc-defg-hij",
    "meetingProvider": "GOOGLE_MEET",
    "startDate": "2026-09-10T14:00:00",
    "endDate": "2026-09-10T17:00:00",
    "registrationDeadline": "2026-09-09T23:59:59",
    "capacity": 50,
    "registeredCount": 0,
    "organizerName": "React Dev Team",
    "organizerEmail": "react@educorp.com",
    "status": "PUBLISHED",
    "createdById": 2,
    "createdByFullName": "Jane Teacher"
  }
  ```

#### 7. Update Event
- **Path:** `PUT /admin/events/{id}`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Request Body (EventUpdateDTO):** (Same schema as EventRequestDTO)
- **Success Response (200 OK):** Updated `EventResponseDTO`
- **Validation Guard:** If capacity is modified below the currently registered count, a `400 Bad Request` is thrown.

#### 8. Delete Event
- **Path:** `DELETE /admin/events/{id}`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Query Parameters:** `hard` (Boolean, default `false`)
- **Success Response:** `204 No Content`
- **Behavior:**
  - `hard=false` (Default): Sets event status to `CANCELLED` (soft delete).
  - `hard=true`: Permantently purges the event record and cascade deletes associated registrations from the database.

#### 9. Get Dashboard Stats
- **Path:** `GET /admin/events/dashboard`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Success Response (200 OK):**
  ```json
  {
    "totalEvents": 12,
    "publishedEvents": 8,
    "draftEvents": 3,
    "cancelledEvents": 1,
    "totalRegistrations": 340,
    "totalCapacity": 600,
    "overallFillRatio": 56.67,
    "overallAttendanceRatio": 82.5,
    "overallCertificateIssuanceRate": 74.3
  }
  ```

---

### Attendance & Certificate APIs

#### 10. Update Attendance Status
- **Path:** `PUT /admin/events/{registrationId}/attendance`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Request Body (AttendanceUpdateDTO):**
  ```json
  {
    "attendanceStatus": "ATTENDED"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "id": 5,
    "eventId": 1,
    "eventTitle": "Introduction to Cybersecurity Fundamentals",
    "studentId": 12,
    "studentName": "Bob Student",
    "studentEmail": "bob@student.com",
    "registeredAt": "2026-07-15T18:14:23",
    "attendanceStatus": "ATTENDED",
    "certificateIssued": false,
    "certificateCode": null
  }
  ```

#### 11. Issue Certificate
- **Path:** `POST /admin/events/{registrationId}/certificate`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Success Response (200 OK):**
  ```json
  {
    "id": 1,
    "registrationId": 5,
    "studentName": "Bob Student",
    "eventTitle": "Introduction to Cybersecurity Fundamentals",
    "certificateCode": "CERT-EVENT-CYBERSEC-100293",
    "issuedAt": "2026-07-15T18:16:11"
  }
  ```
- **Constraint Guard (400 Bad Request):** If the student's attendance is NOT `ATTENDED` (or `CHECKED_IN`), the certificate generator throws an exception blocking issuance to absent students.

---

### Excel Export APIs

#### 12. Export Registrations to Excel
- **Path:** `GET /admin/events/{id}/registrations/export`
- **Headers:** `Authorization: Bearer <Admin_or_Teacher_JWT_Token>`
- **Success Response (200 OK):** Returns a styled `.xlsx` file containing a table with student columns (S.No, Name, Email, Registration Date, Attendance, Certificate Status).

---

## Input Validation Rules

The backend actively validates input parameters at both the controller layer (`@Valid` using JSR-380 validation annotations) and the service layer.

| Field | DTO | Rule | HTTP Code | Error Message / Cause |
| :--- | :--- | :--- | :---: | :--- |
| `title` | Request / Update | `@NotBlank` | 400 | "Title is required" |
| `description`| Request / Update | `@NotBlank` | 400 | "Description is required" |
| `capacity` | Request / Update | `@Positive` | 400 | "Capacity must be greater than 0" |
| `organizerEmail`| Request / Update| `@Email`, regex validation| 400 | "Organizer email must be valid" |
| `locationMode`| Request / Update| Not null | 400 | "Location mode is required" |
| `meetingLink`| Request / Update | Not blank if `ONLINE` or `HYBRID`| 400 | "Meeting link is required for ONLINE/HYBRID events" |
| `venue` | Request / Update | Not blank if `OFFLINE` or `HYBRID`| 400 | "Venue is required for OFFLINE/HYBRID events" |
| `endDate` | Request / Update | Must be after `startDate` | 400 | "End date cannot be before start date" |
| `registrationDeadline` | Request/Update| Must be before `startDate`| 400 | "Registration deadline cannot be after event start date" |
| Registration | Student flow | Deadline check against `now` | 400 | "Registration deadline has passed" |
| Registration | Student flow | Registration vs Capacity | 400 | "Event is full" |
| Registration | Student flow | Unique user constraint | 409 | Already registered for the event |
| Attendance | Admin/Teacher | Valid enum values | 400 | Invalid attendance status |
| Certificate | Admin/Teacher | Student must be present | 400 | Student did not attend the event |

---

## Typical Workflow / Lifecycle

```
[1. AUTHORING]
Teacher/Admin creates an event in DRAFT or PUBLISHED state.
            │
            ▼
[2. REGISTRATION]
Student views PUBLISHED catalog, verifies capacity and deadline, and registers.
            │
            ▼
[3. ENTRANCE & ATTENDANCE]
Event date occurs. Teacher accesses admin dashboard, and marks checked-in students as ATTENDED.
            │
            ▼
[4. CERTIFICATION & EXPORT]
Teacher issues custom completion certificates for present students. Roster is exported to Excel.
```

---

## Error Handling & Code Map

Geeknito LMS returns standardized JSON error responses:

| HTTP Code | Error Reason | Common Triggering Scenarios |
| :---: | :--- | :--- |
| **`400`** | Bad Request | Blank fields, capacity `<= 0`, end date before start date, registration after deadline, registration when full, certificate to absent student. |
| **`401`** | Unauthorized | Bearer token omitted, expired, or corrupted. |
| **`403`** | Forbidden | Teacher trying to edit, update, delete, export, or mark attendance for an event authored by a different teacher. Student accessing admin panels. |
| **`404`** | Not Found | Target event slug, event ID, or registration ID does not exist. |
| **`409`** | Conflict | Student attempts to register twice for the same event slug. |
| **`500`** | Internal Server Error | Excel workbook construction failure, transactional deadlock, database connection pool issues. |
