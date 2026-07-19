# Enterprise Test Data Guide

This directory contains production-quality, enterprise-grade test datasets specifically compiled for bulk API testing, performance auditing, integration validation, and database seeding of the Geeknito LMS.

---

## 📖 Directory Structure

The folder consists of structured JSON template collections and a high-performance dynamic generator:

| Dataset File | Target API Endpoint | Purpose |
| :--- | :--- | :--- |
| **`users.json`** | `POST /auth/register` | Global directory of all system accounts (Admin, Teacher, Student) |
| **`teachers.json`** | `POST /auth/register` | Exclusively Teacher accounts (for role-based curriculum ownership) |
| **`students.json`** | `POST /auth/register` | Exclusively Student accounts (for enrollment and submissions) |
| **`admins.json`** | `POST /auth/register` | Exclusively System Administrator accounts |
| **`categories.json`** | `POST /categories` | Taxonomy classifications with colors, descriptions, and vector icons |
| **`courses.json`** | `POST /admin/courses` | Core Course metadata with level, duration, and cover thumbnails |
| **`course-modules.json`** | `POST /admin/courses/{id}/modules` | Curriculum module structures and ordering sequences |
| **`submodules.json`** | `POST /admin/courses/{id}/modules/{id}/submodules` | Granular submodule lessons mapping to specific learning tracks |
| **`content.json`** | `POST /admin/submodules/{id}/contents` | Submodule learning components (Lectures, code, video blocks) |
| **`batches.json`** | `POST /admin/batches` | Active cohorts assigning courses and teaching instructors |
| **`enrollments.json`** | `POST /enrollments` | Enrolls students in respective courses |
| **`batch-students.json`**| `POST /students/batches/{id}/enroll`| Registers active students inside specific cohort batches |
| **`assignments.json`** | `POST /admin/assignments` | Formative assessments with due dates, attempts, and grade bounds |
| **`questions.json`** | `POST /admin/questions` | Assignment questions with nested options (MCQ, True/False, Essay) |
| **`question-options.json`**| `POST /admin/questions/{id}/options`| Alternative standalone option updates |
| **`submissions.json`** | `POST /api/submissions` | Student assignment attempts with answered options |
| **`student-answers.json`**| `POST /api/submissions/{id}/answers`| Answer recordings for direct grading audits |
| **`events.json`** | `POST /admin/events` | Extracurricular meetups, hackathons, and virtual seminars |
| **`notifications.json`** | `POST /api/notifications` | User alerts and system updates |
| **`certificates.json`** | `POST /api/certificates` | Certified accomplishments of learning tracks or events |

---

## 🔄 Dynamic Seeding Strategy & Referential Integrity

To perform continuous automated validation or performance auditing at high scale, the datasets use a **chained dynamic variable architecture** utilizing Postman’s internal collection runner variable store:

1. **Postman Dynamic Variables (`{{$random...}}`)**:
   Used in templates to ensure every iteration generates non-duplicate emails, unique full names, and realistic descriptions.
2. **Context-Aware Reference Keys (`{{courseId}}`, `{{categoryId}}`)**:
   Postman collection runner extracts returned primary IDs from upstream creation responses (e.g., `pm.environment.set("courseId", response.id);`) and passes them dynamically to downstream child requests. This maintains a 100% accurate, error-free database dependency graph.

---

## 📈 Dependency Graph & Recommended Execution Order

All API interactions must proceed strictly down the hierarchical dependency tree to avoid database constraint violations:

```
                  [ 1. Users / Roles ]
                           │
                 [ 2. Course Categories ]
                           │
                   [ 3. LMS Courses ]
                           │
                  [ 4. Course Modules ]
                           │
                 [ 5. Lesson Submodules ]
                ┌──────────┴──────────┐
      [ 6. Cohort Batches ]     [ 7. Content Blocks ]
        ┌───────┴───────┐
 [ 8. Enrollments ]  [ 9. Assignments ]
                        │
                [ 10. Questions ]
                        │
                [ 11. Question Options ]
                        │
                [ 12. Submissions ]
                        │
                [ 13. Student Answers ]
                        │
                [ 14. Extracurricular Events ]
                        │
                [ 15. System Notifications ]
                        │
                [ 16. Academic Certificates ]
```

---

## ⚡ High-Volume Dynamic Seeding Script

While the static templates provide seed frameworks with Postman variables, you can run our zero-dependency high-volume generator to output the literal massive collections (over **100,000+ realistic enterprise rows**):

### Dataset Row Counts

Executing the generator populates the following row volumes in this directory:
- **Users**: `1,000` (Admins: 20, Teachers: 200, Students: 780)
- **Categories**: `50`
- **Courses**: `300`
- **Modules**: `1,500`
- **Submodules**: `6,000`
- **Batches**: `200`
- **Batch Enrollments**: `5,000`
- **Assignments**: `1,200`
- **Questions**: `12,000`
- **Question Options**: `48,000`
- **Submissions**: `20,000`
- **Student Answers**: `80,000`
- **Events**: `500`
- **Notifications**: `2,000`
- **Certificates**: `5,000`
- **Curriculum Records**: `3,000`
- **Content Records**: `10,000`

### How to Run

Execute the generator script using Node.js:

```bash
node test-data/generate-bulk-data.cjs
```

The script dynamically links child entities to parent records via mathematically aligned primary keys (e.g., mapping question options to their respective questions, modules to courses, and student submissions to active batches) to guarantee **100% database schema compliance**.

---

## 🛠️ Postman Collection Runner Setup

1. Open Postman and import your Postman collection file (`Geeknito LMS.postman_collection.json`) and environment profile.
2. Select the targeted API folder (e.g., **"Courses Setup"**).
3. Click the **Run Folder** button.
4. Set the **Data** file selection to the respective JSON file in this directory (e.g., `courses.json` or `users.json`).
5. Choose your desired iteration count (e.g., `1000` iterations for a bulk user loading test).
6. Ensure **"Keep Variable Values"** is checked so returned environment IDs cascade correctly to children requests.
7. Click **Run Geeknito LMS** to initiate the bulk pipeline.
