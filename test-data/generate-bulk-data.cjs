/**
 * Enterprise Test Data Generator for Postman and Database Population
 * Generates exact high-volume record counts requested:
 * - Users: 1000 (Admins: 20, Teachers: 200, Students: 780)
 * - Categories: 50
 * - Courses: 300
 * - Modules: 1500
 * - Submodules: 6000
 * - Batches: 200
 * - Batch Students (Enrollments): 5000
 * - Assignments: 1200
 * - Questions: 12000
 * - Question Options: 48000
 * - Submissions: 20000
 * - Student Answers: 80000
 * - Events: 500
 * - Notifications: 2000
 * - Certificates: 5000
 * - Curriculum: 3000
 * - Content: 10000
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Enterprise LMS High-Volume Data Generator...');

const FIRST_NAMES = [
  'Alex', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Oliver', 'Sophia', 'Elijah', 'Isabella',
  'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Mia', 'Henry', 'Harper', 'Alexander', 'Evelyn',
  'Jack', 'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'William', 'Avery',
  'Grace', 'Ada', 'Alan', 'Grace', 'Linus', 'Tim', 'Dennis', 'Ken', 'Bjarne', 'Guido', 'James', 'Donald',
  'Richard', 'John', 'Claude', 'Margaret', 'Katherine', 'Dorothy', 'Elizabeth', 'Marie', 'Barbara', 'Susan'
];

const LAST_NAMES = [
  'Rivera', 'Watson', 'Smith', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson',
  'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez', 'King',
  'Turing', 'Lovelace', 'Hopper', 'Torvalds', 'Berners-Lee', 'Ritchie', 'Thompson', 'Stroustrup', 'van Rossum',
  'Gosling', 'Knuth', 'Stallman', 'McCarthy', 'Shannon', 'Hamilton', 'Johnson', 'Vaughan', 'Curie', 'Franklin'
];

const SUBJECTS = [
  'Cloud Architecture', 'Cybersecurity', 'Software Engineering', 'Programming', 'Artificial Intelligence',
  'Machine Learning', 'Web Development', 'Mobile Development', 'DevOps', 'Database Systems', 'Soft Skills',
  'Data Science', 'Blockchain Technologies', 'Systems Engineering', 'Quantum Computing', 'Data Structures',
  'Agile Methodologies', 'User Experience Design', 'Product Management', 'Computer Networks', 'Threat Hunting',
  'Penetration Testing', 'Serverless Architectures', 'Infrastructure as Code', 'Continuous Integration',
  'Parallel Computing', 'Compiler Design', 'Distributed Databases', 'Natural Language Processing', 'Deep Learning'
];

const ADJECTIVES = [
  'Advanced', 'Foundational', 'Enterprise', 'Scalable', 'Modern', 'Secure', 'High-Performance', 'Distributed',
  'Applied', 'Deep', 'Interactive', 'Practical', 'Professional', 'Automated', 'Certified', 'Zero-Trust'
];

const TOPICS = [
  'Kubernetes Orchestration', 'Microservices with Spring Boot', 'Python Machine Learning Pipelines', 'React with Next.js',
  'Ethical Hacking Methodologies', 'PostgreSQL Query Optimization', 'AWS Cloud Architectures', 'Apache Kafka Streaming',
  'API Security Best Practices', 'CI/CD Pipeline Automation', 'Docker Containers', 'Rust System Programming'
];

const EVENT_VENUES = [
  'Virtual Stage A', 'Virtual Stage B', 'Geeknito Innovation Room 404', 'EduCorp Main Conference Hall',
  'Silicon Valley Labs', 'Austin Campus Hub', 'London Tech Center'
];

// Seeded state trackers
let users = [];
let teachers = [];
let students = [];
let admins = [];
let categories = [];
let courses = [];
let modules = [];
let submodules = [];
let batches = [];
let batchStudents = [];
let enrollments = [];
let assignments = [];
let questions = [];
let questionOptions = [];
let submissions = [];
let studentAnswers = [];
let events = [];
let notifications = [];
let certificates = [];
let curriculum = [];
let content = [];

// Helper to generate unique emails
const emailsUsed = new Set();
function generateUniqueEmail(firstName, lastName, role) {
  let base = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
  if (role === 'admin') base = `admin.${base}`;
  let email = `${base}@educorp.com`;
  let idx = 1;
  while (emailsUsed.has(email)) {
    email = `${base}${idx}@educorp.com`;
    idx++;
  }
  emailsUsed.add(email);
  return email;
}

// 1. Generate 1000 Users
console.log('Generating 1000 Users...');
// 20 Admins
for (let i = 1; i <= 20; i++) {
  const fn = FIRST_NAMES[i % FIRST_NAMES.length];
  const ln = LAST_NAMES[i % LAST_NAMES.length];
  const email = generateUniqueEmail(fn, ln, 'admin');
  const user = {
    id: i,
    fullName: `${fn} ${ln}`,
    email: email,
    password: 'adminpass123',
    role: 'admin',
    isActive: true
  };
  users.push(user);
  admins.push(user);
}

// 200 Teachers
for (let i = 21; i <= 220; i++) {
  const fn = FIRST_NAMES[(i + 7) % FIRST_NAMES.length];
  const ln = LAST_NAMES[(i + 13) % LAST_NAMES.length];
  const email = generateUniqueEmail(fn, ln, 'teacher');
  const user = {
    id: i,
    fullName: `${fn} ${ln}`,
    email: email,
    password: 'teacherpass123',
    role: 'teacher',
    isActive: true
  };
  users.push(user);
  teachers.push(user);
}

// 780 Students (to reach 1000 users total)
for (let i = 221; i <= 1000; i++) {
  const fn = FIRST_NAMES[(i + 3) % FIRST_NAMES.length];
  const ln = LAST_NAMES[(i + 19) % LAST_NAMES.length];
  const email = generateUniqueEmail(fn, ln, 'student');
  const user = {
    id: i,
    fullName: `${fn} ${ln}`,
    email: email,
    password: 'studentpass123',
    role: 'student',
    isActive: true
  };
  users.push(user);
  students.push(user);
}

// Ensure first few match seeded data precisely
users[0].fullName = 'Alex Rivera';
users[0].email = 'admin@educorp.com';
users[2].fullName = 'Emma Watson';
users[2].email = 'student@educorp.com';
users[4].fullName = 'Teacher User';
users[4].email = 'teacher@educorp.com';

// 2. Generate 50 Categories
console.log('Generating 50 Categories...');
for (let i = 1; i <= 50; i++) {
  const name = SUBJECTS[(i - 1) % SUBJECTS.length] + (i > SUBJECTS.length ? ` III` : ` Specialization`);
  categories.push({
    id: i,
    name: name,
    icon: ['☁️', '🛡️', '💻', '🤖', '🌐', '📱', '⚙️', '🗄️', '💬', '📊'][i % 10],
    description: `Master high-level competencies in ${name} through production-grade curricula, active validation sandboxes, and expert mentoring.`,
    color: ['#0284C7', '#DC2626', '#059669', '#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#6B7280', '#3B82F6'][i % 10],
    isActive: true
  });
}

// 3. Generate 300 Courses
console.log('Generating 300 Courses...');
for (let i = 1; i <= 300; i++) {
  const category = categories[(i - 1) % categories.length];
  const adj = ADJECTIVES[i % ADJECTIVES.length];
  const topic = TOPICS[i % TOPICS.length];
  const title = `${adj} ${topic} Cohort ${Math.floor(i / 10) + 1}`;
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  courses.push({
    id: i,
    title: title,
    slug: slug,
    shortDescription: `Deploy and test highly resilient enterprise pipelines for ${topic}.`,
    description: `This comprehensive course focuses on ${topic}. Students will design, build, and audit architectures, with strict compliance validation and hands-on laboratory exercises.`,
    level: ['Beginner', 'Intermediate', 'Advanced'][i % 3],
    duration: `${20 + (i % 5) * 8} hours`,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    categoryId: category.id,
    isActive: true,
    isPublished: true,
    status: 'PUBLISHED'
  });
}

// 4. Generate 1500 Modules
console.log('Generating 1500 Modules...');
for (let i = 1; i <= 1500; i++) {
  const course = courses[(i - 1) % courses.length];
  const order = Math.floor((i - 1) / courses.length) + 1;
  modules.push({
    id: i,
    title: `Module ${order}: Deep Integration of ${TOPICS[i % TOPICS.length]}`,
    description: `Learn the theoretical and experimental mechanics required to operate at scale.`,
    moduleOrder: order,
    courseId: course.id
  });
}

// 5. Generate 6000 Submodules
console.log('Generating 6000 Submodules...');
for (let i = 1; i <= 6000; i++) {
  const mod = modules[(i - 1) % modules.length];
  const order = Math.floor((i - 1) / modules.length) + 1;
  const title = `Lesson ${order}: Scalability Patterns & Threat Vectors`;
  submodules.push({
    id: i,
    title: title,
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
    description: `A granular, hands-on workshop guiding technical deployment and execution.`,
    submoduleOrder: order,
    moduleId: mod.id
  });
}

// 6. Generate 200 Batches
console.log('Generating 200 Batches...');
for (let i = 1; i <= 200; i++) {
  const course = courses[(i - 1) % courses.length];
  const teacher = teachers[i % teachers.length];
  batches.push({
    id: i,
    name: `${course.title} - Cohort Alpha ${i}`,
    batchCode: `BATCH-${course.slug.toUpperCase()}_A${i}`,
    courseId: course.id,
    teacherId: teacher.id,
    startDate: '2026-06-01T00:00:00',
    endDate: '2026-09-30T23:59:59',
    isActive: true
  });
}

// 7. Generate 5000 Batch Students & Course Enrollments
console.log('Generating 5000 Batch Students and Enrollments...');
for (let i = 1; i <= 5000; i++) {
  const student = students[i % students.length];
  const batch = batches[i % batches.length];
  const progress = (i * 13) % 101;
  
  // Add batch registration
  batchStudents.push({
    id: i,
    batchId: batch.id,
    studentId: student.id,
    status: 'ACTIVE',
    enrolledAt: '2026-06-15T10:00:00'
  });

  // Add course enrollment
  enrollments.push({
    id: i,
    studentId: student.id,
    courseId: batch.courseId,
    status: progress >= 85 ? 'COMPLETED' : 'ENROLLED',
    progressPercentage: progress,
    enrolledAt: '2026-06-15T09:30:00'
  });
}

// 8. Generate 1200 Assignments
console.log('Generating 1200 Assignments...');
for (let i = 1; i <= 1200; i++) {
  const course = courses[i % courses.length];
  const teacher = teachers[i % teachers.length];
  const batch = batches[i % batches.length];
  assignments.push({
    id: i,
    title: `Unit ${Math.floor(i / courses.length) + 1} Assessment: ${TOPICS[i % TOPICS.length]}`,
    description: `Evaluate key implementation paradigms and operational constraints.`,
    instructions: `Answer all multiple-choice and descriptive questions. You have 60 minutes. Good luck.`,
    courseId: course.id,
    teacherId: teacher.id,
    status: 'PUBLISHED',
    availableFrom: '2026-06-10T00:00:00',
    dueDate: '2026-10-31T23:59:59',
    maxMarks: 100,
    passingMarks: 40,
    timeLimitMinutes: 60,
    allowLateSubmission: true,
    shuffleQuestions: true,
    showResultImmediately: true,
    maxAttempts: 2,
    autoSubmit: true,
    shuffleOptions: true,
    negativeMarking: false,
    showDetailedAnswers: true,
    enableCertificates: i % 2 === 0,
    batchIds: [batch.id]
  });
}

// 9. Generate 12000 Questions
console.log('Generating 12000 Questions...');
for (let i = 1; i <= 12000; i++) {
  const ass = assignments[(i - 1) % assignments.length];
  const order = Math.floor((i - 1) / assignments.length) + 1;
  const qType = ['MCQ', 'TRUE_FALSE', 'SHORT_ANSWER', 'MULTIPLE_CORRECT'][i % 4];
  questions.push({
    id: i,
    assignmentId: ass.id,
    title: `Verify implementation parameter #${order} for our active database/security topology.`,
    description: `This question evaluates compliance with standard deployment benchmarks.`,
    questionType: qType,
    marks: 10,
    displayOrder: order,
    required: true,
    negativeMarks: 0
  });
}

// 10. Generate 48000 Question Options (4 per MCQ / TRUE_FALSE question)
console.log('Generating 48000 Question Options...');
for (let i = 1; i <= 48000; i++) {
  const questionId = Math.floor((i - 1) / 4) + 1;
  const optionOrder = ((i - 1) % 4) + 1;
  questionOptions.push({
    id: i,
    questionId: questionId,
    optionText: `Enterprise Architectural Option Reference ${String.fromCharCode(64 + optionOrder)}`,
    isCorrect: optionOrder === 1, // First option is correct
    displayOrder: optionOrder
  });
}

// 11. Generate 20000 Submissions
console.log('Generating 20000 Submissions...');
for (let i = 1; i <= 20000; i++) {
  const ass = assignments[i % assignments.length];
  const student = students[i % students.length];
  submissions.push({
    id: i,
    assignmentId: ass.id,
    studentId: student.id,
    score: 60 + (i % 41),
    gradedBy: 'Automated Grading Engine',
    submittedAt: '2026-07-16T18:00:00',
    status: 'GRADED'
  });
}

// 12. Generate 80000 Student Answers (4 answers per submission)
console.log('Generating 80000 Student Answers...');
for (let i = 1; i <= 80000; i++) {
  const subId = Math.floor((i - 1) / 4) + 1;
  const questionId = ((i - 1) % 12000) + 1;
  const optionId = (questionId - 1) * 4 + 1; // Pick the correct option
  studentAnswers.push({
    id: i,
    submissionId: subId,
    questionId: questionId,
    selectedOptionId: i % 2 === 0 ? optionId : optionId + 1, // Mix correct/incorrect
    answerText: 'Descriptive deployment validation statement'
  });
}

// 13. Generate 500 Events
console.log('Generating 500 Events...');
for (let i = 1; i <= 500; i++) {
  const admin = admins[i % admins.length];
  events.push({
    id: i,
    title: `Global Hackathon & Tech Summit on ${TOPICS[i % TOPICS.length]}`,
    description: `Participate in high-intensity workshops, network with cloud engineering leads, and collaborate on rapid application design prototypes.`,
    locationMode: ['ONLINE', 'OFFLINE', 'HYBRID'][i % 3],
    venue: EVENT_VENUES[i % EVENT_VENUES.length],
    meetingLink: i % 2 === 0 ? 'https://meet.google.com/xyz-pdqr-abc' : null,
    meetingProvider: i % 2 === 0 ? 'GOOGLE_MEET' : null,
    startDate: '2026-09-10T10:00:00',
    endDate: '2026-09-10T14:00:00',
    registrationDeadline: '2026-09-09T23:59:59',
    capacity: 100 + (i % 5) * 50,
    organizerName: admin.fullName,
    organizerEmail: admin.email,
    status: 'PUBLISHED',
    createdById: admin.id
  });
}

// 14. Generate 2000 Notifications
console.log('Generating 2000 Notifications...');
for (let i = 1; i <= 2000; i++) {
  const recipient = users[i % users.length];
  notifications.push({
    id: i,
    recipientId: recipient.id,
    title: `System Alert: Resource Scalability Warning`,
    message: `Dear ${recipient.fullName}, please ensure your assignment answers have been validated before the final freeze window on October 31st.`,
    type: ['SYSTEM', 'ACADEMIC', 'COMMUNITY'][i % 3],
    read: i % 2 === 0,
    createdAt: '2026-07-16T12:00:00'
  });
}

// 15. Generate 5000 Certificates
console.log('Generating 5000 Certificates...');
for (let i = 1; i <= 5000; i++) {
  const enrollment = enrollments[i % enrollments.length];
  const student = students[enrollment.studentId % students.length];
  const course = courses[enrollment.courseId % courses.length];
  certificates.push({
    id: i,
    registrationId: enrollment.id,
    eventTitle: `${course.title} Comprehensive Course Complete`,
    studentName: student.fullName,
    studentEmail: student.email,
    issuedAt: '2026-07-16T22:00:00'
  });
}

// 16. Generate 3000 Curriculum Records
console.log('Generating 3000 Curriculum Records...');
for (let i = 1; i <= 3000; i++) {
  const course = courses[i % courses.length];
  curriculum.push({
    id: i,
    courseId: course.id,
    courseTitle: course.title,
    curriculumNode: `NODE-CURRICULUM-SECTION-${i}`
  });
}

// 17. Generate 10000 Content Records
console.log('Generating 10000 Content Records...');
for (let i = 1; i <= 10000; i++) {
  const sub = submodules[(i - 1) % submodules.length];
  content.push({
    id: i,
    submoduleId: sub.id,
    title: `Concept Walkthrough - Topic Lesson Reference #${i}`,
    type: ['text', 'code', 'video'][i % 3],
    text: `Learn standard orchestration patterns, security threat profiles, and scale mitigation pipelines.`,
    code: i % 3 === 1 ? `function auditPipeline() { console.log('Auditing submodule ID: ${sub.id}'); }` : null,
    language: i % 3 === 1 ? 'javascript' : null,
    videoUrl: i % 3 === 2 ? 'https://www.youtube.com/embed/dQw4w9WgXcQ' : null,
    contentOrder: Math.floor((i - 1) / submodules.length) + 1
  });
}

// Write arrays to files
const writeDataFile = (filename, dataArray) => {
  const targetPath = path.join(__dirname, filename);
  console.log(`Writing ${dataArray.length} records to ${filename}...`);
  fs.writeFileSync(targetPath, JSON.stringify(dataArray, null, 2), 'utf-8');
};

writeDataFile('users.json', users);
writeDataFile('teachers.json', teachers);
writeDataFile('students.json', students);
writeDataFile('admins.json', admins);
writeDataFile('categories.json', categories);
writeDataFile('courses.json', courses);
writeDataFile('course-modules.json', modules);
writeDataFile('submodules.json', submodules);
writeDataFile('batches.json', batches);
writeDataFile('batch-students.json', batchStudents);
writeDataFile('enrollments.json', enrollments);
writeDataFile('assignments.json', assignments);
writeDataFile('questions.json', questions);
writeDataFile('question-options.json', questionOptions);
writeDataFile('submissions.json', submissions);
writeDataFile('student-answers.json', studentAnswers);
writeDataFile('events.json', events);
writeDataFile('notifications.json', notifications);
writeDataFile('certificates.json', certificates);
writeDataFile('curriculum.json', curriculum);
writeDataFile('content.json', content);

console.log('🎉 Enterprise-Grade Bulk Data Generation Completed Successfully!');
