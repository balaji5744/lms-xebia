# EduCorp LMS Developer Portal (v1.2.0-STABLE) > **Full-Stack Feature &
Engineering Specifications**

<!-- ========================================== -->
<!-- FEATURE 1 -->
<!-- ========================================== -->

## 1. User Authentication & Authorization Provides complete registration, secure
login, and role-based validation routines using stateless token keys. It defines
and protects user paths, segregating administrator utilities from basic student
viewports. ### 1. Data Flow & File Architecture (Flowchart) ```mermaid graph TD
subgraph Frontend F1[frontend/src/pages/Login.tsx] -->|calls|
F2[frontend/src/services/authService.ts] F3[frontend/src/context/AppContext.tsx]
-->|consumes| F1 F4[frontend/src/components/ProtectedRoute.tsx] -->|wraps
routes| F3 end subgraph Backend F2 -->|POST /auth/login|
B1[backend/src/main/java/com/geeknito/geeknito_backend/user/controller/AuthController.java]
B1 -->|uses|
B2[backend/src/main/java/com/geeknito/geeknito_backend/user/repository/UserRepository.java]
B2 -->|queries| DB[(PostgreSQL Table: users)] end DB -.->|returns UserEntity| B2
B2 -.->|AuthResponse DTO| B1 B1 -.->|JSON response with JWT Token| F2 F2
-.->|local storage persist| F3 ``` ### 2. Feature Entry Point & Lifecycle
```text User Inputs Email/Password in UI (frontend/src/pages/Login.tsx) ↓ React
submits form -> triggers handleSubmit() (frontend/src/pages/Login.tsx) ↓ Calls
authService.login(email, password) (frontend/src/services/authService.ts) ↓
Axios client posts credentials to "/auth/login" ↓ Spring Boot interceptor passes
to AuthController.login(LoginRequest)
(backend/src/main/java/com/geeknito/geeknito_backend/user/controller/AuthController.java)
↓ AuthController queries UserRepository.findByEmail(email)
(backend/src/main/java/com/geeknito/geeknito_backend/user/repository/UserRepository.java)
↓ If user exists and password matches, checks if user.isActive() ↓ Generates
mock JWT Token ("educorp-jwt-token-stub-{userId}") ↓ Returns 200 OK with
AuthResponse DTO (id, fullName, email, role, token) ↓ authService captures,
stores profile in AppContext (frontend/src/context/AppContext.tsx) &
LocalStorage ("educorp_user_profile") ↓ AppContext sets state currentUser and
userRole ("admin" | "student") (frontend/src/context/AppContext.tsx) ↓ Fires
React success toast: "Welcome back, {fullName}!" ↓ Navigates programmatically to
"/courses" via react-router-dom useNavigate() ``` ### 3. Error Handling & UI
Feedback - **Backend Exceptions:** Throws `RuntimeException` if user is not
found or credentials are invalid. Throws custom authorization exceptions if
account is deactivated. **HTTP Status Codes:** - `200 OK`: Successful
authentication. - `201 Created`: Registration completed. - `400 Bad Request`:
Input validation failure (empty fields, short passwords). - `401 Unauthorized`:
Invalid credentials (password mismatch). - `403 Forbidden`: Deactivated user
attempts to sign in. - `409 Conflict`: User registration attempts with email
already registered in the DB. Toast Messages: - Success: *"Welcome back,
[Name]!"* / *"Account successfully created for [Name]!"* - Error: *"Invalid
credentials. User does not exist."* / *"This user account has been
deactivated."* Retry Logic: Not applicable to credentials submission. Client
must manually correct input. ### 4. Security & Authorization - **JWT
Authentication:** Utilizes stateless auth keys embedded inside HTTP Request
`Authorization` Header as Bearer token values. - **Spring Security:** Backend
processes incoming filters. Permitted paths include `/api/v1/auth/**`, while
other API operations require validated token authentication. - **Protected
Routes (Frontend):** React paths wrapped inside `` within
`frontend/src/App.tsx`. - **Role Checks:** Routes specifying
`allowedRoles={["admin"]}` block students from accessing Category management or
Course authoring views, redirecting them back to the Catalog page. ### 5.
Important Classes & Methods | File Path (Root) | Method Name | Brief Explanation
| | --- | --- | --- | |
`backend/src/main/java/com/geeknito/geeknito_backend/user/controller/AuthController.java`
| `login(@RequestBody LoginRequest)` | Receives user inputs, sanitizes strings,
compares credentials, and generates JWT payload. | |
`backend/src/main/java/com/geeknito/geeknito_backend/user/controller/AuthController.java`
| `register(@RequestBody RegisterRequest)` | Handles signup logic, normalizes
email inputs, hashes inputs, and saves User records. | |
`frontend/src/components/ProtectedRoute.tsx` | `ProtectedRoute({ children,
allowedRoles })` | A wrapper guarding React components against unauthorized
layout rendering. | | `frontend/src/services/authService.ts` | `login(email,
password)` | Performs client-side POST to trigger authentication endpoints and
retrieve session keys. | ### 6. API Details | Method | Endpoint | Request Body |
Response | Auth | Notes | | --- | --- | --- | --- | --- | --- | | `POST` |
`/api/v1/auth/login` | `LoginRequest` (email, password) | `AuthResponse`
(profile DTO + token) | None | Logs user session and returns authenticated
payload. | | `POST` | `/api/v1/auth/register` | `RegisterRequest` (fullName,
email, password) | `AuthResponse` (profile DTO + token) | None | If email string
contains word "admin", promotes role to Admin. Otherwise, defaults to Student. |
### 7. Feature Dependencies - **PostgreSQL DB Store:** Real-time user records
are stored and mapped against `users` table. - **AppContext React Brain:**
Shared React context holds current user profile references and coordinates
login/logout state changes globally. ### 8. Possible Improvements - **BCrypt
Password Encoding:** Implement Spring Security’s `BCryptPasswordEncoder` on
passwords, as current demo hashes values using simple equality operations. -
**JWT Real Verification:** Convert the current token stub system into fully
signed cryptographic JWT signatures (using HMACS / RS256 algorithms). ### 9.
Summary - Fully validates student and admin account credentials on PostgreSQL. -
Secures front-end paths using responsive `` components. - Provides custom
automated role promotion if email contains the substring "admin". - Persists
active states inside browser LocalStorage for consistent browser restarts. -
Integrates cleanly with central state to fire customized welcome greeting
toasts. ↑ Back to Table of Contents

<!-- ========================================== -->
<!-- FEATURE 2 -->
<!-- ========================================== -->

## 2. Category Management Allows system administrators to manage the taxonomy of
the LMS. Categories categorize courses and specify color formats and icon
classes used by course discovery pages. ### 1. Data Flow & File Architecture
(Flowchart) ```mermaid graph TD subgraph Frontend
C1[frontend/src/pages/CategoryManagement.tsx] -->|dispatches|
C2[frontend/src/services/categoryService.ts] end subgraph Backend C2 -->|POST
/categories|
B1[backend/src/main/java/com/geeknito/geeknito_backend/category/controller/CategoryAdminController.java]
B1 -->|invokes|
B2[backend/src/main/java/com/geeknito/geeknito_backend/category/service/CategoryAdminServiceImpl.java]
B2 -->|commits|
B3[backend/src/main/java/com/geeknito/geeknito_backend/category/repository/CategoryRepository.java]
B3 -->|SQL| DB[(PostgreSQL Table: categories)] end DB -.->|reads| B3 B3
-.->|maps with CategoryMapper| B2 B2 -.->|CategoryResponseDTO| B1 B1 -.->|201
Created JSON| C2 C2 -.->|triggers react-query invalidate| C1 ``` ### 2. Feature
Entry Point & Lifecycle ```text Admin submits Category form in
(frontend/src/pages/CategoryManagement.tsx) ↓ React Query mutation triggers
categoryService.create(payload) (frontend/src/services/categoryService.ts) ↓
Axios sends POST to "/categories" with { name, description, icon, colorHex } ↓
Spring Boot CategoryAdminController.createCategory() receives payload
(backend/src/main/java/com/geeknito/geeknito_backend/category/controller/CategoryAdminController.java)
↓ Delegates to CategoryAdminServiceImpl to convert DTO to CategoryEntity via
MapStruct mapper
(backend/src/main/java/com/geeknito/geeknito_backend/category/service/CategoryAdminServiceImpl.java)
↓ Checks database to prevent category name duplication ↓ Saves CategoryEntity
through CategoryRepository.save()
(backend/src/main/java/com/geeknito/geeknito_backend/category/repository/CategoryRepository.java)
↓ Returns 211 Created response back to Axios client containing
CategoryResponseDTO ↓ React Query onSuccess hook intercepts response, triggers
queryClient.invalidateQueries(["categories"]) ↓ Frontend view is re-rendered to
displays newly-created Category row (frontend/src/pages/CategoryManagement.tsx)
``` ### 3. Error Handling & UI Feedback - **Backend Exceptions:** Throws
`EntityExistsException` on category name duplications. Throws
`EntityNotFoundException` on updates against non-existent Category IDs. **HTTP
Status Codes:** - `200 OK`: Successful search or updates. - `201 Created`:
Category created. - `400 Bad Request`: Input format invalid. - `409 Conflict`:
Duplicated category names. - `204 No Content`: Soft delete executed
successfully. Toast Messages: - Success: *"Category created successfully!"* /
*"Category updated!"* - Error: *"Failed to create category: Name already exists
in our database."* Retry Logic: Managed by React Query's default GET query retry
mechanics (3 attempts with exponential backoff on network issues). ### 4.
Security & Authorization - **Role Restriction:** Admin operations
(POST/PUT/DELETE) are locked behind Admin credentials on both client and server
layers. - **Public Fetching:** Students can access categories via the public
`/api/v1/categories` endpoint to support filtering, but cannot execute
modification requests. ### 5. Important Classes & Methods | File Path (Root) |
Method Name | Brief Explanation | | --- | --- | --- | |
`backend/.../category/controller/CategoryAdminController.java` |
`createCategory(@RequestBody CategoryRequestDTO)` | Receives admin requests,
validates attributes, and triggers Service. | |
`backend/.../category/service/CategoryAdminServiceImpl.java` | `softDelete(Long
id)` | Marks the target category's `is_active` flag to false in the database. |
| `backend/.../category/repository/CategoryRepository.java` |
`findByIdWithCourseCount(Long id)` | Custom JPA query calculating aggregate
course counts per category. | ### 6. API Details | Method | Endpoint | Request
Body | Response | Auth | Notes | | --- | --- | --- | --- | --- | --- | | `GET` |
`/api/v1/categories` | None | `List` | Bearer Token | Returns all active
categories with their calculated course counts. | | `POST` |
`/api/v1/categories` | `CategoryRequestDTO` | `CategoryResponseDTO` | Bearer
(Admin) | Adds category. Throws 409 if name already exists. | | `DELETE` |
`/api/v1/categories/{id}` | None | Void (204) | Bearer (Admin) | Executes
soft-delete by setting is_active=false. | ### 7. Feature Dependencies - **Spring
Security Role Gates:** Admin categories controller endpoints rely on role-based
access tokens. - **Lucide React Icons:** Frontend queries Lucide names stored
inside categories database records to dynamically instantiate SVG elements on
screen. ### 8. Possible Improvements - **Icon Selection Palette:** Add an
interactive SVG icon-selector modal in the category wizard so Admins don't have
to manually type the Lucide string. - **Relational Warning checks:** Prevent
soft deletions if a category has active courses linked to it. ### 9. Summary -
Supports full category CRUD operations secured by role checks. - Calculates
relational course totals per category. - Utilizes custom CSS-friendly styling
parameters (icon strings and colorHexes). - Features a soft deletion system that
keeps historical database entries intact. - Optimized with automatic frontend
caching invalidation on updates. ↑ Back to Table of Contents

<!-- ========================================== -->
<!-- FEATURE 3 -->
<!-- ========================================== -->

## 3. Course Catalog & Discovery Provides the primary landing page of the
application, rendering a beautiful searchable grid of courses with responsive
category filter chips, dynamic statistics (total courses, difficulty levels),
and a detailed route segments mapping view. ### 1. Data Flow & File Architecture
(Flowchart) ```mermaid graph TD subgraph Frontend
D1[frontend/src/components/CourseCatalogView.tsx] -->|imports|
D2[frontend/src/components/CourseCard.tsx] D1 -->|calls|
D3[frontend/src/services/courseService.ts] end subgraph Backend D3 -->|GET
/admin/courses|
B1[backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CourseCatalogController.java]
B1 -->|invokes|
B2[backend/src/main/java/com/geeknito/geeknito_backend/course/service/CourseCatalogServiceImpl.java]
B2 -->|queries|
B3[backend/src/main/java/com/geeknito/geeknito_backend/course/repository/CourseRepository.java]
B3 -->|SQL| DB[(PostgreSQL Table: courses)] end DB -.-> B3 B3 -.-> B2 B2 -.-> B1
B1 -.->|returns CourseList DTO| D3 D3 -.->|sets local React state| D1 D1
-->|renders list map| D2 ``` ### 2. Feature Entry Point & Lifecycle ```text User
accesses "/" or "/courses" -> Catalog view mounts
(frontend/src/components/CourseCatalogView.tsx) ↓ useEffect launches
asynchronous API dispatch using Promise.all()
(frontend/src/components/CourseCatalogView.tsx) ↓ Fetches all active courses AND
available categories in parallel (frontend/src/services/courseService.ts and
frontend/src/services/categoryService.ts) ↓ Axios dispatches HTTP GET requests
to "/admin/courses" and "/categories" ↓ CourseCatalogController captures
requests
(backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CourseCatalogController.java),
queries CourseRepository.findByIsActiveTrue()
(backend/src/main/java/com/geeknito/geeknito_backend/course/repository/CourseRepository.java)
↓ Returns List of CourseCatalogCardDTO arrays containing Course metadata ↓ React
state sets active catalog payload lists on response success
(frontend/src/components/CourseCatalogView.tsx) ↓ App calculates difficulty
level stats (Beginner, Intermediate, Advanced) and displays metrics ↓ Search and
chips filters filter the matching course records client-side ↓ Maps remaining
Course items to generate responsive list elements
(frontend/src/components/CourseCard.tsx) ``` ### 3. Error Handling & UI Feedback
- **Backend Exceptions:** Throws `ResourceNotFoundException` if slug queries
yield no matching course records. **HTTP Status Codes:** - `200 OK`: Course data
successfully retrieved. - `404 Not Found`: No course matches the requested slug
ID. Toast Messages: - Error: *"Failed to load course details. Course not
found."* Retry Logic: Public searches do not auto-retry. Network catalog loading
errors will prompt users to click an interactive re-fetch button on the layout.
### 4. Security & Authorization - **Access Rules:** Public catalog pages are
accessible to any signed-in user, whether they are Students or Admins. - **Admin
Dropdowns:** Dynamic options context buttons (Edit, Delete, Manage) on
CourseCard widgets are visible only if `userRole === "admin"`. ### 5. Important
Classes & Methods | File Path (Root) | Method Name | Brief Explanation | | --- |
--- | --- | | `backend/.../course/controller/CourseCatalogController.java` |
`getCatalog()` | Returns all published courses active in the Postgres system. |
| `backend/.../course/service/CourseCatalogServiceImpl.java` |
`getCourseDetailBySlug(String slug)` | Loads detailed course records, including
nested modules, mapped by URL slugs. | |
`frontend/src/components/CourseCatalogView.tsx` | `fetchCatalogData()` |
Consolidates backend requests in parallel to fetch metadata records. | ### 6.
API Details | Method | Endpoint | Request Body | Response | Auth | Notes | | ---
| --- | --- | --- | --- | --- | | `GET` | `/api/v1/admin/courses` | None |
`List` | Bearer Token | Returns all courses currently registered in the
database. | | `GET` | `/api/v1/courses/slug/{slug}` | None |
`CourseCatalogDetailDTO` | Bearer Token | Queries and loads deep module
curriculum tree records mapped by slug properties. | ### 7. Feature Dependencies
- **Category Taxonomy API:** Course cards rely on category models to fetch tags,
icons, and color styles. - **React Router Engine:** Dynamic slug transitions
depend on URL parameters configured in `App.tsx`. ### 8. Possible Improvements -
**Database Paginated Scrolling:** Replace client-side catalog filtering with
Spring Boot Pageable queries for scalable query performance on large catalogs. -
**Fuzzy Search:** Integrate Postgres full-text indexing or dynamic ILIKE queries
to handle typo-tolerant title lookups. ### 9. Summary - Implements a responsive
search index and category filters. - Displays calculated statistics for
difficulty levels and course counts. - Resolves detailed views dynamically using
URL slugs. - Features conditional rendering of admin controls based on user
roles. - Uses lazy load modules to optimize catalog image loading. ↑ Back to
Table of Contents

<!-- ========================================== -->
<!-- FEATURE 4 -->
<!-- ========================================== -->

## 4. Course Creation Wizard A multi-step React-driven wizard that allows Admins
to create new courses incrementally. Step 1 focuses on drafting course details,
immediately saving a draft to the database to generate an ID for subsequent
curriculum steps. ### 1. Data Flow & File Architecture (Flowchart) ```mermaid
graph TD subgraph Frontend
W1[frontend/src/components/CourseWizard/CourseWizardParent.tsx]
-->|orchestrates| W2[frontend/src/components/CourseWizard/WizardStep1.tsx] W1
-->|saves state| W3[frontend/src/services/courseService.ts] end subgraph Backend
W3 -->|POST /admin/courses|
B1[backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CourseAdminController.java]
B1 -->|uses|
B2[backend/src/main/java/com/geeknito/geeknito_backend/course/service/CourseAdminServiceImpl.java]
B2 -->|saves|
B3[backend/src/main/java/com/geeknito/geeknito_backend/course/repository/CourseRepository.java]
B3 -->|SQL| DB[(PostgreSQL Table: courses)] end DB -.-> B3 B3 -.-> B2 B2 -.-> B1
B1 -.->|201 Created with Course ID| W3 W3 -.->|sets AppContext wizardCourseId|
W1 ``` ### 2. Feature Entry Point & Lifecycle ```text Admin clicks "+ New
Course" -> App redirects to "/wizard"
(frontend/src/components/CourseWizard/WizardStep1.tsx mounts) ↓ Admin inputs
course title -> Form listener triggers regex slugification (e.g. "Cloud Ops" ->
"cloud-ops") (frontend/src/components/CourseWizard/WizardStep1.tsx) ↓ Admin
completes Step 1 fields (category, description, level, thumbnail) ↓ Clicks
"Continue" -> Triggers handlesNextStep() in CourseWizardParent
(frontend/src/components/CourseWizard/CourseWizardParent.tsx) ↓ Performs
client-side validations. On success, executes handleSaveDraftSilent() ↓ If
wizardCourseId is empty, dispatches POST request to "/admin/courses" via
courseService.create() (frontend/src/services/courseService.ts) ↓
CourseAdminController maps payload into a new CourseEntity draft
(backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CourseAdminController.java)
↓ Saves draft to Postgres through CourseRepository
(backend/src/main/java/com/geeknito/geeknito_backend/course/repository/CourseRepository.java)
and returns CourseResponseDTO with a generated database ID ↓ Wizard parent
captures the new ID, saving it to AppContext state
(frontend/src/context/AppContext.tsx) and LocalStorage ("educorp_wizard_id") ↓
Saves current step (Step 2) in LocalStorage and switches view to Curriculum Step
(frontend/src/components/CourseWizard/CourseWizardParent.tsx) ``` ### 3. Error
Handling & UI Feedback - **Backend Exceptions:** Throws
`DataIntegrityViolationException` if slug is not unique. Throws
`MethodArgumentNotValidException` if required fields are missing. **HTTP Status
Codes:** - `201 Created`: New course draft generated. - `400 Bad Request`:
Missing required fields. - `409 Conflict`: URL slug already registered in the
database. Toast Messages: - Success: *"Course draft saved successfully!"* -
Error: *"Please fill in all required fields."* / *"This slug is already taken.
Please customize it."* Retry Logic: Auto-saves are silent. If the API returns an
error, the wizard blocks step transition, keeping current form progress intact.
### 4. Security & Authorization - **Route Guarding:** The `/wizard` and
`/wizard/:id` routes are wrapped in role gates, allowing access only to users
with an `"admin"` role. - **Backend Controller Security:** Endpoints matching
`/api/v1/admin/courses/**` are protected by Spring Security filters. ### 5.
Important Classes & Methods | File Path (Root) | Method Name | Brief Explanation
| | --- | --- | --- | | `frontend/.../CourseWizard/CourseWizardParent.tsx` |
`handleSaveDraftSilent()` | Saves wizard progress to the database, updating or
creating drafts. | | `frontend/.../CourseWizard/WizardStep1.tsx` |
`autoSlugify()` | Generates URL-safe strings from titles using regex in
real-time. | | `backend/.../course/controller/CourseAdminController.java` |
`createCourse(@RequestBody CourseRequestDTO)` | Receives new course metadata,
mapping and saving drafts. | ### 6. API Details | Method | Endpoint | Request
Body | Response | Auth | Notes | | --- | --- | --- | --- | --- | --- | | `POST`
| `/api/v1/admin/courses` | `CourseRequestDTO` | `CourseResponseDTO` | Bearer
(Admin) | Saves a new course draft. Generates a database ID. | | `PUT` |
`/api/v1/admin/courses/{id}` | `CourseRequestDTO` | `CourseResponseDTO` | Bearer
(Admin) | Updates course metadata and settings. | ### 7. Feature Dependencies -
**Category Service API:** Populates the parent category dropdown with active
categories from the database. - **LocalStorage Persistence:** Restores draft
progress if the Admin reloads the browser during creation. ### 8. Possible
Improvements - **Auto-Save Debounce:** Auto-save draft changes in the background
when the admin pauses typing. - **Slug Collision Resolution:** Append
auto-incrementing random suffixes to slugs if collisions are detected. ### 9.
Summary - Ensures smooth multi-step state management on the client. -
Auto-generates URL slugs from titles. - Saves drafts to the database during Step
1 to secure course IDs. - Restores wizard progress on browser reloads using
LocalStorage. - Secures authoring workflows behind strict Admin role gates. ↑
Back to Table of Contents

<!-- ========================================== -->
<!-- FEATURE 5 -->
<!-- ========================================== -->

## 5. Curriculum Management Step 2 of the course wizard. Allows Admins to build
out the course structure by managing Modules (chapters) and Submodules
(individual lessons). ### 1. Data Flow & File Architecture (Flowchart)
```mermaid graph TD subgraph Frontend
M1[frontend/src/components/CourseWizard/WizardStep2.tsx] -->|dispatches|
M2[frontend/src/services/curriculumService.ts] end subgraph Backend M2 -->|POST
/admin/courses/id/modules|
B1[backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CurriculumAdminController.java]
B1 -->|invokes|
B2[backend/src/main/java/com/geeknito/geeknito_backend/course/service/CurriculumAdminServiceImpl.java]
B2 -->|maps and saves|
B3[backend/src/main/java/com/geeknito/geeknito_backend/course/repository/ModuleRepository.java]
B4[backend/src/main/java/com/geeknito/geeknito_backend/course/repository/SubmoduleRepository.java]
-->|persists| B2 B3 -->|SQL| DB[(PostgreSQL Tables: modules, submodules)] end DB
-.-> B3 B3 -.-> B2 B2 -.-> B1 B1 -.->|201 Created JSON| M2 M2 -.->|invalidates
query| M1 ``` ### 2. Feature Entry Point & Lifecycle ```text Admin views
Curriculum Step 2 (frontend/src/components/CourseWizard/WizardStep2.tsx),
loading the current outline ↓ React Query executes getCourseCurriculum(courseId)
via curriculumService.getCourseCurriculum()
(frontend/src/services/curriculumService.ts) to load modules from database ↓
Admin clicks "+ Add Module", inputs title and description
(frontend/src/components/CourseWizard/WizardStep2.tsx) ↓ Form submissions
trigger curriculumService.createModule()
(frontend/src/services/curriculumService.ts) ↓ Axios posts metadata to
"/admin/courses/{courseId}/modules" ↓ CurriculumAdminController receives payload
(backend/src/main/java/com/geeknito/geeknito_backend/course/controller/CurriculumAdminController.java)
and passes to CurriculumAdminServiceImpl
(backend/src/main/java/com/geeknito/geeknito_backend/course/service/CurriculumAdminServiceImpl.java)
↓ Service maps DTO fields and saves ModuleEntity via ModuleRepository.save()
(backend/src/main/java/com/geeknito/geeknito_backend/course/repository/ModuleRepository.java)
↓ Returns 211 Created response with ModuleResponseDTO ↓ React Query onSuccess
hook invalidates ["curriculum", courseId] key ↓ Component re-renders list,
displaying the new Module outline row
(frontend/src/components/CourseWizard/WizardStep2.tsx) ↓ Adding Submodules
triggers a similar flow under the path "/modules/{moduleId}/submodules"
targeting SubmoduleRepository
(backend/src/main/java/com/geeknito/geeknito_backend/course/repository/SubmoduleRepository.java)
``` ### 3. Error Handling & UI Feedback - **Backend Exceptions:** Throws
`EntityNotFoundException` if parent Course or Module IDs do not exist in the
database. **HTTP Status Codes:** - `201 Created`: Successfully saved the module
or submodule. - `400 Bad Request`: Missing required fields. - `404 Not Found`:
Parent IDs could not be resolved. Toast Messages: - Success: *"Module created!"*
/ *"Submodule successfully added!"* - Error: *"Failed to create module: Invalid
input parameters."* Retry Logic: Handled by React Query's default GET query
retry mechanics (3 attempts on network issues). ### 4. Security & Authorization
- **Endpoint Rules:** Endpoints prefixed with `/api/v1/admin/**` are protected
on the backend, ensuring access only to users with Admin roles. - **Session
Validation:** API requests include the logged-in user's Bearer token. Anonymous
requests are blocked with a `401 Unauthorized` response. ### 5. Important
Classes & Methods | File Path (Root) | Method Name | Brief Explanation | | --- |
--- | --- | | `backend/.../course/controller/CurriculumAdminController.java` |
`createModule()` | Registers a new Module under a course, returning its database
ID. | | `backend/.../course/controller/CurriculumAdminController.java` |
`createSubmodule()` | Registers a new Submodule under a parent Module ID. | |
`backend/.../course/service/CurriculumAdminServiceImpl.java` |
`getCourseCurriculum(Long courseId)` | Queries and returns the nested Module and
Submodule trees. | ### 6. API Details | Method | Endpoint | Request Body |
Response | Auth | Notes | | --- | --- | --- | --- | --- | --- | | `GET` |
`/api/v1/admin/courses/{id}/modules` | None | `List` | Bearer (Admin) | Fetches
the structured curriculum outline for a course. | | `POST` |
`/api/v1/admin/courses/{id}/modules` | `ModuleRequestDTO` | `ModuleResponseDTO`
| Bearer (Admin) | Creates a new module under the specified course ID. | |
`POST` | `/api/v1/admin/courses/{id}/modules/{mid}/submodules` |
`SubmoduleRequestDTO` | `SubmoduleResponseDTO` | Bearer (Admin) | Creates a
submodule (lesson) under the specified module ID. | ### 7. Feature Dependencies
- **Course Draft persistence:** Step 2 requires a valid `courseId` generated
from Step 1. - **React Query cache:** Invalidates query caches to automatically
refresh structural trees. ### 8. Possible Improvements - **Drag-and-Drop
Reordering:** Implement drag-and-drop sequencing (using `@hello-pangea/dnd`) to
let admins reorder curriculum items dynamically. - **Curriculum Copying:** Allow
admins to copy existing curriculum structures from other courses to speed up
creation. ### 9. Summary - Supports creating nested course structures (Modules
and Submodules). - Restricts modifications to users with Admin roles. -
Optimized with automatic frontend caching invalidation on updates. - Uses
cascade deletion to clean up child submodules when a module is deleted. -
Maintains sequencing in the database with order indexes. ↑ Back to Table of
Contents

<!-- ========================================== -->
<!-- FEATURE 6 -->
<!-- ========================================== -->

## 6. Content/Lesson Management Step 3 of the course wizard. This interactive
view allows Admins to attach various educational content blocks (such as text,
Markdown, code, videos, and images) to submodules (lessons). ### 1. Data Flow &
File Architecture (Flowchart) ```mermaid graph TD subgraph Frontend
L1[frontend/src/components/CourseWizard/WizardStep3.tsx] -->|calls|
L2[frontend/src/services/contentService.ts] end subgraph Backend L2 -->|POST
/admin/submodules/id/contents|
B1[backend/src/main/java/com/geeknito/geeknito_backend/course/controller/ContentAdminController.java]
B1 -->|invokes|
B2[backend/src/main/java/com/geeknito/geeknito_backend/course/service/ContentAdminServiceImpl.java]
B2 -->|commits|
B3[backend/src/main/java/com/geeknito/geeknito_backend/course/repository/ContentRepository.java]
B3 -->|SQL| DB[(PostgreSQL Table: contents)] end DB -.-> B3 B3 -.-> B2 B2 -.->
B1 B1 -.->|201 Created JSON| L2 L2 -.->|invalidates query| L1 ``` ### 2. Feature
Entry Point & Lifecycle ```text Admin accesses Step 3
(frontend/src/components/CourseWizard/WizardStep3.tsx), selecting a lesson
submodule from the outline ↓ React Query loads existing content blocks using
contentService.getContentsBySubmodule(submoduleId)
(frontend/src/services/contentService.ts) ↓ Admin selects a content type (e.g.
Text, Markdown, Code, Video, Image)
(frontend/src/components/CourseWizard/WizardStep3.tsx) ↓ Inputs content details
(text fields, code snippets, video URLs) ↓ Clicks "Save Content Block" ->
Triggers handleAddBlockSubmit()
(frontend/src/components/CourseWizard/WizardStep3.tsx) ↓ Calls
createBlockMutation.mutate() to dispatch payload via
contentService.createContent() (frontend/src/services/contentService.ts) ↓ Axios
posts data to "/admin/submodules/{submoduleId}/contents" ↓
ContentAdminController parses payload
(backend/src/main/java/com/geeknito/geeknito_backend/course/controller/ContentAdminController.java)
and passes to ContentAdminServiceImpl
(backend/src/main/java/com/geeknito/geeknito_backend/course/service/ContentAdminServiceImpl.java)
↓ Maps properties and saves ContentEntity through ContentRepository.save()
(backend/src/main/java/com/geeknito/geeknito_backend/course/repository/ContentRepository.java)
↓ Returns 211 Created response with ContentResponseDTO ↓ React Query invalidates
["submoduleContents", submoduleId] query caches ↓ View is re-rendered to display
the newly added content block in lesson previews
(frontend/src/components/CourseWizard/WizardStep3.tsx) ``` ### 3. Error Handling
& UI Feedback - **Backend Exceptions:** Throws `EntityNotFoundException` if
submodule IDs are invalid. Throws `IllegalArgumentException` for unsupported
block types. **HTTP Status Codes:** - `211 Created`: Block successfully
registered in the database. - `400 Bad Request`: Missing required fields or
invalid configurations. - `404 Not Found`: Target submodule not found. Toast
Messages: - Success: *"Content block saved!"* / *"Block deleted successfully."*
- Error: *"Failed to save block: Content text is required."* Retry Logic: React
Query retries GET operations on network failures. Saves do not retry
automatically. ### 4. Security & Authorization - **Access Rules:** Content
creation and modifications are restricted to Admins. - **Endpoint Gates:**
Spring Security blocks modifications on the backend unless request headers
contain a valid Admin JWT. ### 5. Important Classes & Methods | File Path (Root)
| Method Name | Brief Explanation | | --- | --- | --- | |
`backend/.../course/controller/ContentAdminController.java` | `createContent()`
| Saves and links a new content block to a submodule. | |
`backend/.../course/service/ContentAdminServiceImpl.java` | `deleteContent(Long
id)` | Soft-deletes content records in Postgres. | |
`frontend/.../CourseWizard/WizardStep3.tsx` | `handleAddBlockSubmit()` |
Validates form fields and triggers React Query save mutations. | ### 6. API
Details | Method | Endpoint | Request Body | Response | Auth | Notes | | --- |
--- | --- | --- | --- | --- | | `GET` |
`/api/v1/admin/submodules/{submoduleId}/contents` | None | `List` | Bearer
(Admin) | Loads all content blocks linked to a lesson submodule. | | `POST` |
`/api/v1/admin/submodules/{submoduleId}/contents` | `ContentRequestDTO` |
`ContentResponseDTO` | Bearer (Admin) | Adds and links a new content block to a
submodule. | | `DELETE` | `/api/v1/admin/contents/{id}` | None | Void (204) |
Bearer (Admin) | Soft-deletes content blocks. | ### 7. Feature Dependencies -
**Curriculum Module ID:** Requires a valid submodule ID generated from Step 2. -
**Media Service Uploads:** Image and document blocks depend on file upload
endpoints to secure active URLs. ### 8. Possible Improvements - **Markdown
wysiwyg editor:** Integrate a rich Markdown editor (such as Milkdown or MDX
Editor) to make drafting content easier. - **Real-time previews:** Show
side-by-side renders of HTML/Markdown content blocks as the admin types. ### 9.
Summary - Supports creating diverse content types (Text, Markdown, Code, Video,
and Image). - Restricts modifications to Admins. - Maintains content block
sequencing with sequential ordering keys. - Leverages MapStruct to handle clean
DTO transformations. - Soft-deletes database records to preserve historic
integrity. ↑ Back to Table of Contents

<!-- ========================================== -->
<!-- FEATURE 7 -->
<!-- ========================================== -->

## 7. File & Media Upload System Handles uploading file attachments. The
frontend attempts direct uploads to Cloudinary. If that is not configured, it
gracefully falls back to the Spring Boot backend's local file storage. ### 1.
Data Flow & File Architecture (Flowchart) ```mermaid graph TD subgraph Frontend
U1[frontend/src/components/CourseWizard/WizardStep3.tsx] -->|uploads|
U2[Cloudinary API Endpoint] U1 -->|local fallback|
U3[frontend/src/lib/apiClient.ts] end subgraph Backend U3 -->|POST
/files/upload|
B1[backend/src/main/java/com/geeknito/geeknito_backend/course/controller/FileUploadController.java]
B2[Server filesystem directory: uploads/] -->|stores file binary| B1 end U2
-.->|returns CDN secure URL| U1 B1 -.->|returns download endpoint URL| U3 U3
-.->|updates form state| U1 ``` ### 2. Feature Entry Point & Lifecycle ```text
Admin drops or selects a file in WizardStep3
(frontend/src/components/CourseWizard/WizardStep3.tsx) ↓ Checks file
configurations to detect Cloudinary cloud settings
(frontend/src/components/CourseWizard/WizardStep3.tsx) ↓ If Cloudinary is
configured: - Packages file and upload preset into browser FormData - Sends a
direct browser POST request to the Cloudinary API - Captures the returned
Cloudinary secure URL on success ↓ If Cloudinary is NOT configured: - Falls back
to local storage - Posts FormData with file to Spring Boot's
"/api/v1/files/upload" endpoint via Axios/apiClient
(frontend/src/lib/apiClient.ts) - FileUploadController backend ensures the
"uploads/" directory exists locally
(backend/src/main/java/com/geeknito/geeknito_backend/course/controller/FileUploadController.java)
- Generates a unique file name using UUID prefixes - Saves file bytes to local
disk directory - Returns a structured download URL linking back to the backend ↓
Form state is updated with the returned URL to display a file preview
(frontend/src/components/CourseWizard/WizardStep3.tsx) ``` ### 3. Error Handling
& UI Feedback - **Backend Exceptions:** Throws `IOException` on read/write
failures. Throws `FileNotFoundException` if requested files are missing from
local directories. **HTTP Status Codes:** - `200 OK`: Upload succeeded, file
URLs generated. - `400 Bad Request`: Attempted uploads with empty files or
unsupported parameters. - `500 Internal Server Error`: Read/write disk IO
errors. Toast Messages: - Success: *"File uploaded successfully!"* - Error:
*"Failed to upload file. Fallback mechanism triggered."* / *"Upload failed: File
exceeds maximum permitted size."* Retry Logic: If an upload fails, the UI
prompts the user with an interactive retry button. ### 4. Security &
Authorization - **Backend Safeguards:** Files uploaded locally are prefixed with
UUIDs to prevent directory traversal and name collision attacks. - **Iframe
Considerations:** Direct uploads use CORS parameters, allowing browsers to
upload safely within sandboxed iframe views. ### 5. Important Classes & Methods
| File Path (Root) | Method Name | Brief Explanation | | --- | --- | --- | |
`backend/.../course/controller/FileUploadController.java` |
`uploadFile(@RequestParam MultipartFile)` | Receives files, generates unique
UUID filenames, saves files locally, and returns access URLs. | |
`backend/.../course/controller/FileUploadController.java` |
`downloadFile(@PathVariable String fileName)` | Resolves and serves local files
back to the client as downloadable attachments. | |
`frontend/.../CourseWizard/WizardStep3.tsx` | `uploadToCloudinary()` | Handles
direct browser-to-Cloudinary uploads with automatic fallbacks to local storage.
| ### 6. API Details | Method | Endpoint | Request Body | Response | Auth |
Notes | | --- | --- | --- | --- | --- | --- | | `POST` | `/api/v1/files/upload`
| `MultipartFile` (form-data) | `Map` (url, name) | Bearer | Saves files to
local folders if Cloudinary is not configured. | | `GET` |
`/api/v1/files/download/{fileName}` | None | `Resource` (File bytes) | None |
Serves local files back to the client as downloads. Serves all file bytes. | ###
7. Feature Dependencies - **Cloudinary CDN:** Direct image/attachment uploads
depend on valid Cloudinary keys. - **Server Disk Storage:** Local storage
fallbacks rely on file system write permissions. ### 8. Possible Improvements -
**Image compression:** Add client-side image compression before upload to reduce
size. - **File Type validation:** Whitelist file formats (such as PDFs and
images) to block malicious file uploads. ### 9. Summary - Supports direct
browser uploads to Cloudinary CDN. - Includes a local storage fallback using
Spring Boot. - Prefixes local files with unique UUIDs to prevent collisions. -
Features a customizable size validation guard. - Generates standard downloadable
file links. ↑ Back to Table of Contents

<!-- ========================================== -->
<!-- FEATURE 8 -->
<!-- ========================================== -->

## 8. Redis Caching Strategy Implements caching configurations inside Spring
Boot using Redis cache pools. Caches heavy queries (such as catalogs, category
lists, and lesson content) with custom expiration times (TTLs) to boost server
performance. ### 1. Data Flow & File Architecture (Flowchart) ```mermaid graph
TD subgraph Client R1[Client API calls] end subgraph Spring Caching Layer R1
-->|HTTP request| R2[Spring Service Method] R2 -->|checks cache| R3{Redis cache
HIT?} R3 -->|Yes| R4[Return cached JSON instantly] R3 -->|No| R5[Execute SQL
queries] end subgraph Postgres R5 -->|query| R6[(PostgreSQL DB)] end R6
-.->|return rows| R5 R5 -.->|populate Redis| R3 R3 -.->|return payload| R1 ```
### 2. Feature Entry Point & Lifecycle ```text Spring Boot bootup triggers
RedisConfig initialization
(backend/src/main/java/com/geeknito/geeknito_backend/config/RedisConfig.java) ↓
Spring loads @EnableCaching, activating cache manager pools ↓ Client executes
GET request to fetch course catalog ↓
CourseCatalogServiceImpl.getCatalogCourses()
(backend/src/main/java/com/geeknito/geeknito_backend/course/service/CourseCatalogServiceImpl.java)
is intercepted by Spring's Cacheable Aspect ↓ Checks Redis cache
"course-catalog" for matching pageable keys ↓ If Cache HIT: - Returns serialized
cached JSON instantly, bypassing Postgres queries ↓ If Cache MISS: - Executes
repository SQL queries against Postgres - Binds resulting rows, saving them to
Redis under key parameters - Returns fresh database records to the client ↓
Admin updates course information (PUT/POST/DELETE) via CourseAdminServiceImpl
(backend/src/main/java/com/geeknito/geeknito_backend/course/service/CourseAdminServiceImpl.java)
or CategoryAdminServiceImpl
(backend/src/main/java/com/geeknito/geeknito_backend/category/service/CategoryAdminServiceImpl.java)
↓ Service methods are intercepted by @CacheEvict ↓ Deletes corresponding key
structures from Redis to maintain data consistency ``` ### 3. Error Handling &
UI Feedback - **Backend Exceptions:** If Redis is offline, the custom
`CacheErrorHandler` intercepts runtime failures, logs warnings, and falls back
to Postgres. - **HTTP Status Codes:** No change in HTTP responses; cache
operations run transparently on the backend. - **Toast Messages:** None shown to
the user. Caching is a background performance enhancement. - **Retry Logic:** On
connection timeouts, Redis connection pools attempt automatic reconnects. ### 4.
Security & Authorization - **Serialization Safeguards:** Uses
`GenericJackson2JsonRedisSerializer` with type configurations (NON_FINAL) to
safely encode entities to JSON structures. - **Secure Connections:** Redis
connection URLs are populated using environment secrets, preventing sensitive
credentials leaks. ### 5. Important Classes & Methods | File Path (Root) |
Method Name | Brief Explanation | | --- | --- | --- | |
`backend/.../config/RedisConfig.java` | `cacheManager(RedisConnectionFactory)` |
Configures Redis serialization, serializer engines, and custom cache TTL
allocations. | | `backend/.../config/RedisConfig.java` | `errorHandler()` |
Custom error handler that intercepts connection failures, falling back to
database reads. | | `backend/.../config/StartupValidator.java` | `run()` |
Validates the active Redis connection at server boot, logging configurations. |
### 6. API Details | Cache Pool Name | Default TTL | Eviction Triggers | Cached
Classes | Notes | | --- | --- | --- | --- | --- | | `course-catalog` | 30
Minutes | Admin creates, updates, or deletes courses. | `PageImpl` | Uses custom
Page deserialization helpers. | | `course-details` | 1 Hour | Admin updates or
deletes specific courses. | `CourseCatalogDetailDTO` | Cached by course slug. |
| `categories` | 24 Hours | Admin creates, updates, or deletes categories. |
`List` | Evicts on category additions. | | `curriculum` | 1 Hour | Admin creates
modules or submodules. | `List` | Cached by course ID parameters. | ### 7.
Feature Dependencies - **Docker Redis Server:** Requires an active Redis
instance. Fallbacks allow server operations to continue if Redis is offline. -
**Jackson Polymorphic Engine:** Serialization relies on Jackson to store type
attributes correctly. ### 8. Possible Improvements - **Prefix Namespacing:**
Prefix cache keys with environments (e.g. `lms:dev:course-catalog`) to support
shared Redis nodes safely. - **Selective Evictions:** Refine evictions to delete
specific keys instead of clearing entire cache names on updates. ### 9. Summary
- Implements high-performance caching configurations using Redis. - Provides
custom TTL expiration structures for different data types. - Features a robust
error handling fallback to ensure zero-downtime database reads if Redis is
offline. - Maintains accurate data consistency using Spring `@CacheEvict`
annotations. - Uses custom deserializers to support complex Spring Page
implementations. ↑ Back to Table of Contents
