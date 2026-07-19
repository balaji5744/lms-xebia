-- ==========================================
-- V11__Seed_Events_Data.sql
-- Seed Events and Event Registrations data
-- ==========================================

-- 0. Ensure referenced users exist in the database (ON CONFLICT DO NOTHING to remain idempotent)
INSERT INTO users (
    full_name, email, password, role, is_active, created_at, updated_at
) VALUES
-- Admins
('Alex Rivera', 'admin@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sarah Jenkins', 'admin2@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marcus Vance', 'admin3@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('David Kim', 'admin4@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Elena Rostova', 'admin5@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'admin', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Teachers
('Teacher User', 'teacher@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'teacher', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dr. Alan Turing', 'teacher2@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'teacher', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Grace Hopper', 'teacher3@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'teacher', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ada Lovelace', 'teacher4@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'teacher', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Linus Torvalds', 'teacher5@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'teacher', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Students
('Emma Watson', 'student@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Alice Smith', 'student2@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Bob Jones', 'student3@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Charlie Brown', 'student4@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Diana Prince', 'student5@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Evan Wright', 'student6@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Fiona Gallagher', 'student7@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('George Clark', 'student8@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hannah Abbott', 'student9@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ian Malcolm', 'student10@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Julia Roberts', 'student11@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kevin Bacon', 'student12@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Laura Croft', 'student13@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Michael Scott', 'student14@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Nina Simone', 'student15@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Oliver Twist', 'student16@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Penelope Cruz', 'student17@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Quinn Fabray', 'student18@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Ryan Reynolds', 'student19@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sophia Loren', 'student20@educorp.com', '$2a$10$8.UnVuG9HHgRE3I62bVJ6u3U.7q413H2v/2W/X2LzX3F6L3vP978q', 'student', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (email) DO NOTHING;

-- 1. Insert 20 Events
INSERT INTO events (
    title, slug, description, banner_url, banner_file_name,
    location_mode, venue, meeting_link, meeting_provider,
    start_date, end_date, registration_deadline, capacity,
    registered_count, organizer_name, organizer_email, status,
    created_by, version, created_at, updated_at
) VALUES
-- Event 1: AI & ML Summit 2026
(
    'AI & ML Summit 2026', 'ai-ml-summit-2026',
    'Join industry leaders to discuss the latest advancements in Deep Learning, Large Language Models, and Artificial Intelligence safety regulations.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600', 'ai_summit.jpg',
    'HYBRID', 'Tech Auditorium, Silicon Valley', 'https://zoom.us/j/987654321', 'ZOOM',
    '2026-08-15 09:00:00', '2026-08-15 17:00:00', '2026-08-14 18:00:00', 200,
    3, 'Alex Rivera', 'admin@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'admin@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 2: Cybersecurity Hands-on Workshop
(
    'Cybersecurity Hands-on Workshop', 'cybersecurity-workshop',
    'An intensive, hands-on workshop focused on zero-trust configuration, pen-testing strategies, and packet-level threat analysis.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600', 'cyber_workshop.jpg',
    'ONLINE', 'Virtual Class 1', 'https://meet.google.com/abc-defg-hij', 'GOOGLE_MEET',
    '2026-08-22 10:00:00', '2026-08-22 13:00:00', '2026-08-21 23:59:59', 50,
    3, 'Grace Hopper', 'teacher3@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher3@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 3: Cloud Computing Trends Seminar
(
    'Cloud Computing Trends Seminar', 'cloud-computing-seminar',
    'A retrospective analysis of serverless architectures, cost optimization patterns, and distributed multi-cloud orchestration strategies.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600', 'cloud_seminar.jpg',
    'OFFLINE', 'Conference Hall B, New York', NULL, NULL,
    '2026-06-10 14:00:00', '2026-06-10 16:30:00', '2026-06-09 17:00:00', 100,
    3, 'Alex Rivera', 'admin@educorp.com', 'COMPLETED',
    (SELECT id FROM users WHERE email = 'admin@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 4: Enterprise Backend Meetup (Java & Go)
(
    'Enterprise Backend Meetup (Java & Go)', 'backend-java-meetup',
    'Connect with fellow backend engineers to discuss Spring Boot 3 optimizations, Go concurrency patterns, and distributed tracing.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600', 'backend_meetup.jpg',
    'HYBRID', 'Developer Lounge, Austin', 'https://teams.microsoft.com/l/meetup-join/123', 'MICROSOFT_TEAMS',
    '2026-08-05 18:00:00', '2026-08-05 20:00:00', '2026-08-04 12:00:00', 75,
    3, 'Dr. Alan Turing', 'teacher2@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher2@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 5: DevOps Bootcamp: Docker & K8s
(
    'DevOps Bootcamp: Docker & K8s', 'devops-bootcamp-2026',
    'Master container packaging, multi-stage builds, local registry deployment, and Kubernetes horizontal scaling configurations.',
    'https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600', 'devops_bootcamp.jpg',
    'ONLINE', 'Virtual Lab 2', 'https://zoom.us/j/123456789', 'ZOOM',
    '2026-09-01 09:00:00', '2026-09-03 17:00:00', '2026-08-31 18:00:00', 150,
    3, 'Linus Torvalds', 'teacher5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 6: Full-Stack React & Next.js Hackathon
(
    'Full-Stack React & Next.js Hackathon', 'fullstack-react-hackathon',
    'A 48-hour collaborative hacking event to build elegant, fully persistent web applications using Next.js App Router and Tailwind CSS.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600', 'react_hackathon.jpg',
    'HYBRID', 'Innovation Hub, Chicago', 'https://zoom.us/j/111222333', 'ZOOM',
    '2026-08-28 09:00:00', '2026-08-30 18:00:00', '2026-08-27 12:00:00', 120,
    3, 'Teacher User', 'teacher@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 7: Kubernetes Deep Dive and Scaling
(
    'Kubernetes Deep Dive and Scaling', 'kubernetes-deep-dive',
    'A highly advanced technical session covering custom resources (CRDs), ingress controller setups, and automatic node provisioning.',
    'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600', 'k8s_deepdive.jpg',
    'ONLINE', 'Virtual Classroom B', 'https://meet.google.com/k8s-deep-dive', 'GOOGLE_MEET',
    '2026-09-15 13:00:00', '2026-09-15 16:00:00', '2026-09-14 23:59:59', 80,
    3, 'Linus Torvalds', 'teacher5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 8: Database Performance Optimization & Tuning
(
    'Database Performance Optimization & Tuning', 'database-optimization-tuning',
    'Deep dive into query planner analysis, composite indexing design, vacuum operations, and connection pooling bottlenecks.',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600', 'db_tuning.jpg',
    'ONLINE', 'Database Tech Room', 'https://zoom.us/j/444555666', 'ZOOM',
    '2026-05-20 15:00:00', '2026-05-20 17:30:00', '2026-05-19 12:00:00', 60,
    3, 'Dr. Alan Turing', 'teacher2@educorp.com', 'COMPLETED',
    (SELECT id FROM users WHERE email = 'teacher2@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 9: UX/UI Design Best Practices
(
    'UX/UI Design Best Practices', 'ux-design-principles',
    'Understand user journey mapping, design systems creation, high-contrast layouts, and typographic hierarchy guidelines.',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600', 'ux_design.jpg',
    'OFFLINE', 'Design Studio, San Francisco', NULL, NULL,
    '2026-08-10 10:00:00', '2026-08-10 12:00:00', '2026-08-09 17:00:00', 40,
    3, 'Ada Lovelace', 'teacher4@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher4@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 10: Agile & Scrum Product Management
(
    'Agile & Scrum Product Management', 'agile-project-management',
    'Learn practical frameworks for scoping product requirements, coordinating sprint cycles, and addressing cross-team dependency risks.',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600', 'agile_scrum.jpg',
    'ONLINE', 'Agile Workspace', 'https://meet.google.com/agile-scrum', 'GOOGLE_MEET',
    '2026-08-18 11:00:00', '2026-08-18 13:00:00', '2026-08-17 12:00:00', 100,
    3, 'Sarah Jenkins', 'admin2@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'admin2@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 11: Ethical Hacking and Penetration Testing
(
    'Ethical Hacking and Penetration Testing', 'ethical-hacking-seminar',
    'An introduction to manual privilege escalation, OWASP Top 10 auditing, and safe payload development inside virtual laboratories.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600', 'hacking_seminar.jpg',
    'HYBRID', 'Security Lab, Seattle', 'https://zoom.us/j/777888999', 'ZOOM',
    '2026-08-25 14:00:00', '2026-08-25 17:00:00', '2026-08-24 18:00:00', 90,
    2, 'Grace Hopper', 'teacher3@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher3@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 12: Blockchain & The Future of Technology
(
    'Blockchain & The Future of Technology', 'blockchain-future-tech',
    'A structural exploration of distributed consensus engines, smart contract security risks, and decentralized scaling layers.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', 'blockchain_tech.jpg',
    'ONLINE', 'Virtual Hall 3', 'https://zoom.us/j/999000111', 'ZOOM',
    '2026-10-10 10:00:00', '2026-10-10 12:00:00', '2026-10-09 17:00:00', 150,
    2, 'David Kim', 'admin4@educorp.com', 'DRAFT',
    (SELECT id FROM users WHERE email = 'admin4@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 13: Mobile App Development with Flutter
(
    'Mobile App Development with Flutter', 'mobile-dev-flutter',
    'Master cross-platform responsive widget designs, local SQLite caching, and asynchronous Riverpod state synchronization.',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600', 'flutter_dev.jpg',
    'ONLINE', 'Mobile Dev Arena', 'https://meet.google.com/flutter-dev', 'GOOGLE_MEET',
    '2026-09-05 14:00:00', '2026-09-05 16:30:00', '2026-09-04 12:00:00', 50,
    2, 'Ada Lovelace', 'teacher4@educorp.com', 'CANCELLED',
    (SELECT id FROM users WHERE email = 'teacher4@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 14: Data Science Industry Panel
(
    'Data Science Industry Panel', 'data-science-panel',
    'Distinguished data science professionals discuss business metric translation, custom feature engineering, and model deployment hurdles.',
    'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600', 'data_panel.jpg',
    'HYBRID', 'Tech Auditorium, Silicon Valley', 'https://zoom.us/j/888777666', 'ZOOM',
    '2026-08-30 15:00:00', '2026-08-30 17:00:00', '2026-08-29 12:00:00', 200,
    2, 'Elena Rostova', 'admin5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'admin5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 15: Introduction to Quantum Computing
(
    'Introduction to Quantum Computing', 'quantum-computing-intro',
    'A basic mathematical introduction to qubits, superposition, entanglement, and quantum gates.',
    'https://images.unsplash.com/photo-1516116211223-4c599701b744?q=80&w=600', 'quantum_intro.jpg',
    'ONLINE', 'Physics Lab', 'https://teams.microsoft.com/l/quantum-meet', 'MICROSOFT_TEAMS',
    '2026-09-20 10:00:00', '2026-09-20 12:00:00', '2026-09-19 18:00:00', 100,
    2, 'Dr. Alan Turing', 'teacher2@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher2@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 16: Internet of Things (IoT) Smart Devices
(
    'Internet of Things (IoT) Smart Devices', 'iot-smart-devices',
    'Hands-on sensor integrations, MQTT micro-broker communication, and local low-power device communication protocols.',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600', 'iot_devices.jpg',
    'OFFLINE', 'Robotics Club, Boston', NULL, NULL,
    '2026-09-25 14:00:00', '2026-09-25 17:00:00', '2026-09-24 12:00:00', 30,
    0, 'Linus Torvalds', 'teacher5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 17: Tech Leadership and Career Growth
(
    'Tech Leadership and Career Growth', 'tech-leadership-panel',
    'Transitioning from an individual engineer to a leader: mentoring strategies, delegation structures, and aligning engineering outcomes to business.',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600', 'tech_leadership.jpg',
    'ONLINE', 'Virtual Hall 1', 'https://zoom.us/j/222333444', 'ZOOM',
    '2026-10-05 16:00:00', '2026-10-05 18:00:00', '2026-10-04 12:00:00', 150,
    0, 'Marcus Vance', 'admin3@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'admin3@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 18: Microservices Design Patterns
(
    'Microservices Design Patterns', 'microservices-patterns',
    'Learn saga patterns, outbox patterns, CQRS architectures, and resilience controls like circuit breakers and bulkheads.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600', 'microservices_patterns.jpg',
    'ONLINE', 'Virtual Lab 5', 'https://zoom.us/j/555666777', 'ZOOM',
    '2026-11-12 13:00:00', '2026-11-12 16:00:00', '2026-11-11 12:00:00', 100,
    0, 'Teacher User', 'teacher@educorp.com', 'DRAFT',
    (SELECT id FROM users WHERE email = 'teacher@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 19: Rust Programming Language Essentials
(
    'Rust Programming Language Essentials', 'rust-programming-intro',
    'Understand safe memory handling mechanics, compiler borrow checker validation, and robust type safety concepts in Rust.',
    'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600', 'rust_intro.jpg',
    'HYBRID', 'Mozilla Hub, Berlin', 'https://meet.google.com/rust-intro', 'GOOGLE_MEET',
    '2026-10-18 10:00:00', '2026-10-18 13:00:00', '2026-10-17 18:00:00', 80,
    0, 'Linus Torvalds', 'teacher5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'teacher5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
-- Event 20: AI Ethics and Policy Dialogue
(
    'AI Ethics and Policy Dialogue', 'ai-ethics-discussion',
    'Discuss regulatory policy structures, copyright considerations in generative AI models, and algorithmic bias safeguards.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600', 'ai_ethics.jpg',
    'HYBRID', 'Ethics Council, Washington', 'https://zoom.us/j/333444555', 'ZOOM',
    '2026-08-01 14:00:00', '2026-08-01 16:00:00', '2026-07-31 12:00:00', 120,
    0, 'Elena Rostova', 'admin5@educorp.com', 'PUBLISHED',
    (SELECT id FROM users WHERE email = 'admin5@educorp.com'), 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);


-- 2. Insert 40 Event Registrations
INSERT INTO event_registrations (
    event_id, student_id, registered_at, attendance_status,
    certificate_issued, certificate_issued_at, remarks,
    created_at, updated_at
) VALUES
-- Event 1: AI & ML Summit 2026 (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'ai-ml-summit-2026'),
    (SELECT id FROM users WHERE email = 'student@educorp.com'),
    '2026-07-10 10:00:00', 'REGISTERED', FALSE, NULL, 'Interested in LLM panel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'ai-ml-summit-2026'),
    (SELECT id FROM users WHERE email = 'student2@educorp.com'),
    '2026-07-11 11:30:00', 'REGISTERED', FALSE, NULL, 'Will attend physically', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'ai-ml-summit-2026'),
    (SELECT id FROM users WHERE email = 'student3@educorp.com'),
    '2026-07-12 14:15:00', 'REGISTERED', FALSE, NULL, 'Will join online', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 2: Cybersecurity Hands-on Workshop (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'cybersecurity-workshop'),
    (SELECT id FROM users WHERE email = 'student4@educorp.com'),
    '2026-07-09 09:15:00', 'REGISTERED', FALSE, NULL, 'Pre-configuring kali vm', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'cybersecurity-workshop'),
    (SELECT id FROM users WHERE email = 'student5@educorp.com'),
    '2026-07-10 16:45:00', 'REGISTERED', FALSE, NULL, 'Needs workshop lab access link', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'cybersecurity-workshop'),
    (SELECT id FROM users WHERE email = 'student6@educorp.com'),
    '2026-07-12 10:00:00', 'REGISTERED', FALSE, NULL, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 3: Cloud Computing Trends Seminar (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'cloud-computing-seminar'),
    (SELECT id FROM users WHERE email = 'student7@educorp.com'),
    '2026-06-01 10:00:00', 'ATTENDED', TRUE, '2026-06-10 17:00:00', 'Excellent participation', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'cloud-computing-seminar'),
    (SELECT id FROM users WHERE email = 'student8@educorp.com'),
    '2026-06-02 11:00:00', 'ATTENDED', TRUE, '2026-06-10 17:00:00', 'Engaged during QA session', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'cloud-computing-seminar'),
    (SELECT id FROM users WHERE email = 'student9@educorp.com'),
    '2026-06-03 14:00:00', 'ABSENT', FALSE, NULL, 'No-show', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 4: Enterprise Backend Meetup (Java & Go) (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'backend-java-meetup'),
    (SELECT id FROM users WHERE email = 'student10@educorp.com'),
    '2026-07-01 10:00:00', 'REGISTERED', FALSE, NULL, 'Wants to learn about virtual threads', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'backend-java-meetup'),
    (SELECT id FROM users WHERE email = 'student11@educorp.com'),
    '2026-07-02 11:30:00', 'REGISTERED', FALSE, NULL, 'Offline attendance confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'backend-java-meetup'),
    (SELECT id FROM users WHERE email = 'student12@educorp.com'),
    '2026-07-03 15:20:00', 'REGISTERED', FALSE, NULL, 'Joining online via Teams', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 5: DevOps Bootcamp: Docker & K8s (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'devops-bootcamp-2026'),
    (SELECT id FROM users WHERE email = 'student13@educorp.com'),
    '2026-07-05 10:00:00', 'REGISTERED', FALSE, NULL, 'Requesting Kubernetes cluster guidelines', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'devops-bootcamp-2026'),
    (SELECT id FROM users WHERE email = 'student14@educorp.com'),
    '2026-07-06 14:00:00', 'REGISTERED', FALSE, NULL, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'devops-bootcamp-2026'),
    (SELECT id FROM users WHERE email = 'student15@educorp.com'),
    '2026-07-07 16:30:00', 'REGISTERED', FALSE, NULL, 'Excited for hands-on sessions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 6: Full-Stack React & Next.js Hackathon (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'fullstack-react-hackathon'),
    (SELECT id FROM users WHERE email = 'student16@educorp.com'),
    '2026-07-10 09:00:00', 'REGISTERED', FALSE, NULL, 'Looking for team members', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'fullstack-react-hackathon'),
    (SELECT id FROM users WHERE email = 'student17@educorp.com'),
    '2026-07-11 12:00:00', 'REGISTERED', FALSE, NULL, 'Bringing teammate', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'fullstack-react-hackathon'),
    (SELECT id FROM users WHERE email = 'student18@educorp.com'),
    '2026-07-12 15:00:00', 'REGISTERED', FALSE, NULL, 'Remote participant', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 7: Kubernetes Deep Dive and Scaling (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'kubernetes-deep-dive'),
    (SELECT id FROM users WHERE email = 'student19@educorp.com'),
    '2026-07-11 10:30:00', 'REGISTERED', FALSE, NULL, 'Will ask about multi-cluster scaling', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'kubernetes-deep-dive'),
    (SELECT id FROM users WHERE email = 'student20@educorp.com'),
    '2026-07-12 14:20:00', 'REGISTERED', FALSE, NULL, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'kubernetes-deep-dive'),
    (SELECT id FROM users WHERE email = 'student@educorp.com'),
    '2026-07-13 09:15:00', 'REGISTERED', FALSE, NULL, 'Very eager', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 8: Database Performance Optimization & Tuning (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'database-optimization-tuning'),
    (SELECT id FROM users WHERE email = 'student2@educorp.com'),
    '2026-05-10 10:00:00', 'ATTENDED', TRUE, '2026-05-20 18:00:00', 'Completed hands-on tuning labs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'database-optimization-tuning'),
    (SELECT id FROM users WHERE email = 'student3@educorp.com'),
    '2026-05-11 12:00:00', 'ATTENDED', TRUE, '2026-05-20 18:00:00', 'Very engaged', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'database-optimization-tuning'),
    (SELECT id FROM users WHERE email = 'student4@educorp.com'),
    '2026-05-12 15:30:00', 'ABSENT', FALSE, NULL, 'Could not join', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 9: UX/UI Design Best Practices (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'ux-design-principles'),
    (SELECT id FROM users WHERE email = 'student5@educorp.com'),
    '2026-07-08 11:15:00', 'REGISTERED', FALSE, NULL, 'Bringing notebook', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'ux-design-principles'),
    (SELECT id FROM users WHERE email = 'student6@educorp.com'),
    '2026-07-09 14:30:00', 'REGISTERED', FALSE, NULL, 'Looking to learn design systems', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'ux-design-principles'),
    (SELECT id FROM users WHERE email = 'student7@educorp.com'),
    '2026-07-10 16:00:00', 'REGISTERED', FALSE, NULL, 'Physical seat confirmed', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 10: Agile & Scrum Product Management (3 registrations)
(
    (SELECT id FROM events WHERE slug = 'agile-project-management'),
    (SELECT id FROM users WHERE email = 'student8@educorp.com'),
    '2026-07-05 10:00:00', 'CHECKED_IN', FALSE, NULL, 'In person presence', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'agile-project-management'),
    (SELECT id FROM users WHERE email = 'student9@educorp.com'),
    '2026-07-06 11:30:00', 'REGISTERED', FALSE, NULL, 'Joining online', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'agile-project-management'),
    (SELECT id FROM users WHERE email = 'student10@educorp.com'),
    '2026-07-07 14:00:00', 'REGISTERED', FALSE, NULL, 'Needs syllabus pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 11: Ethical Hacking and Penetration Testing (2 registrations)
(
    (SELECT id FROM events WHERE slug = 'ethical-hacking-seminar'),
    (SELECT id FROM users WHERE email = 'student11@educorp.com'),
    '2026-07-01 10:00:00', 'REGISTERED', FALSE, NULL, 'Needs VPN config instructions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'ethical-hacking-seminar'),
    (SELECT id FROM users WHERE email = 'student12@educorp.com'),
    '2026-07-02 12:00:00', 'REGISTERED', FALSE, NULL, 'Will attend remotely', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 12: Blockchain & The Future of Technology (2 registrations)
(
    (SELECT id FROM events WHERE slug = 'blockchain-future-tech'),
    (SELECT id FROM users WHERE email = 'student13@educorp.com'),
    '2026-07-02 09:15:00', 'REGISTERED', FALSE, NULL, 'Excited to learn solidity concepts', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'blockchain-future-tech'),
    (SELECT id FROM users WHERE email = 'student14@educorp.com'),
    '2026-07-03 14:00:00', 'REGISTERED', FALSE, NULL, 'Will read whitepapers beforehand', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 13: Mobile App Development with Flutter (2 registrations)
(
    (SELECT id FROM events WHERE slug = 'mobile-dev-flutter'),
    (SELECT id FROM users WHERE email = 'student15@educorp.com'),
    '2026-07-05 10:00:00', 'REGISTERED', FALSE, NULL, 'Disappointed that it is cancelled', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'mobile-dev-flutter'),
    (SELECT id FROM users WHERE email = 'student16@educorp.com'),
    '2026-07-06 15:45:00', 'REGISTERED', FALSE, NULL, 'Hoping for reschedule date', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 14: Data Science Industry Panel (2 registrations)
(
    (SELECT id FROM events WHERE slug = 'data-science-panel'),
    (SELECT id FROM users WHERE email = 'student17@educorp.com'),
    '2026-07-10 11:00:00', 'CHECKED_IN', FALSE, NULL, 'Has 3 questions for panelists', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'data-science-panel'),
    (SELECT id FROM users WHERE email = 'student18@educorp.com'),
    '2026-07-11 13:30:00', 'REGISTERED', FALSE, NULL, '', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),

-- Event 15: Introduction to Quantum Computing (2 registrations)
(
    (SELECT id FROM events WHERE slug = 'quantum-computing-intro'),
    (SELECT id FROM users WHERE email = 'student19@educorp.com'),
    '2026-07-12 10:15:00', 'REGISTERED', FALSE, NULL, 'Needs linear algebra notes', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
),
(
    (SELECT id FROM events WHERE slug = 'quantum-computing-intro'),
    (SELECT id FROM users WHERE email = 'student20@educorp.com'),
    '2026-07-13 14:00:00', 'REGISTERED', FALSE, NULL, 'Excited to learn quantum logic gates', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
);
