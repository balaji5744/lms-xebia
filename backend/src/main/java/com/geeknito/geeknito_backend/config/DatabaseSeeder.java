package com.geeknito.geeknito_backend.config;

import com.geeknito.geeknito_backend.category.repository.CategoryRepository;
import com.geeknito.geeknito_backend.course.repository.*;
import com.geeknito.geeknito_backend.user.repository.UserRepository;
import com.geeknito.geeknito_backend.batch.repository.*;
import com.geeknito.geeknito_backend.assignment.repository.*;
import com.geeknito.geeknito_backend.event.repository.*;
import com.geeknito.geeknito_backend.entity.learning.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * DatabaseSeeder
 * 
 * Safely seeds the database with initial admin and curriculum data.
 * Managed by 'app.seed.enabled' property; will run if enabled.
 * Operations are fully idempotent and check for pre-existing records first.
 */
@Component
@org.springframework.boot.autoconfigure.condition.ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final SubmoduleRepository submoduleRepository;
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Additional fields for expanded seeding
    private final BatchRepository batchRepository;
    private final BatchStudentRepository batchStudentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentBatchRepository assignmentBatchRepository;
    private final QuestionRepository questionRepository;
    private final QuestionOptionRepository questionOptionRepository;
    private final SubmissionRepository submissionRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final EventRepository eventRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        long totalStart = System.currentTimeMillis();
        log.info("Starting Enterprise LMS Database Seeding process...");

        if (userRepository.count() > 0) {
            resetDemoPassword("admin@educorp.com", "adminpass123");
            resetDemoPassword("teacher@educorp.com", "teacherpass123");
            resetDemoPassword("student@educorp.com", "studentpass123");

            log.info("Demo account passwords updated.");
            return;
        }

        // 1. SEED USERS (ADMINS, TEACHERS, STUDENTS)
        log.info("Phase 1: Seeding users with strict idempotency...");
        long phase1Start = System.currentTimeMillis();

        List<UserEntity> existingUsersList = userRepository.findAll();
        Map<String, UserEntity> existingUsersByEmail = existingUsersList.stream()
                .collect(Collectors.toMap(u -> u.getEmail().toLowerCase(), u -> u, (u1, u2) -> u1));

        List<UserEntity> usersToSave = new ArrayList<>();

        // Seed default Admin & Student
        UserEntity defaultAdmin = getOrCreateUserInCache("Alex Rivera", "admin@educorp.com", "adminpass123", "admin", usersToSave, existingUsersByEmail);
        UserEntity defaultStudent = getOrCreateUserInCache("Emma Watson", "student@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity defaultTeacher = getOrCreateUserInCache("Teacher User", "teacher@educorp.com", "teacherpass123", "teacher", usersToSave, existingUsersByEmail);

        // Seed 4 additional Admins
        UserEntity admin2 = getOrCreateUserInCache("Sarah Jenkins", "admin2@educorp.com", "adminpass123", "admin", usersToSave, existingUsersByEmail);
        UserEntity admin3 = getOrCreateUserInCache("Marcus Vance", "admin3@educorp.com", "adminpass123", "admin", usersToSave, existingUsersByEmail);
        UserEntity admin4 = getOrCreateUserInCache("David Kim", "admin4@educorp.com", "adminpass123", "admin", usersToSave, existingUsersByEmail);
        UserEntity admin5 = getOrCreateUserInCache("Elena Rostova", "admin5@educorp.com", "adminpass123", "admin", usersToSave, existingUsersByEmail);

        // Seed 4 additional Teachers
        UserEntity teacher2 = getOrCreateUserInCache("Dr. Alan Turing", "teacher2@educorp.com", "teacherpass123", "teacher", usersToSave, existingUsersByEmail);
        UserEntity teacher3 = getOrCreateUserInCache("Grace Hopper", "teacher3@educorp.com", "teacherpass123", "teacher", usersToSave, existingUsersByEmail);
        UserEntity teacher4 = getOrCreateUserInCache("Ada Lovelace", "teacher4@educorp.com", "teacherpass123", "teacher", usersToSave, existingUsersByEmail);
        UserEntity teacher5 = getOrCreateUserInCache("Linus Torvalds", "teacher5@educorp.com", "teacherpass123", "teacher", usersToSave, existingUsersByEmail);

        // Seed 19 additional Students
        UserEntity s2 = getOrCreateUserInCache("Alice Smith", "student2@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s3 = getOrCreateUserInCache("Bob Jones", "student3@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s4 = getOrCreateUserInCache("Charlie Brown", "student4@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s5 = getOrCreateUserInCache("Diana Prince", "student5@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s6 = getOrCreateUserInCache("Evan Wright", "student6@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s7 = getOrCreateUserInCache("Fiona Gallagher", "student7@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s8 = getOrCreateUserInCache("George Clark", "student8@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s9 = getOrCreateUserInCache("Hannah Abbott", "student9@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s10 = getOrCreateUserInCache("Ian Malcolm", "student10@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s11 = getOrCreateUserInCache("Julia Roberts", "student11@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s12 = getOrCreateUserInCache("Kevin Bacon", "student12@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s13 = getOrCreateUserInCache("Laura Croft", "student13@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s14 = getOrCreateUserInCache("Michael Scott", "student14@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s15 = getOrCreateUserInCache("Nina Simone", "student15@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s16 = getOrCreateUserInCache("Oliver Twist", "student16@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s17 = getOrCreateUserInCache("Penelope Cruz", "student17@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s18 = getOrCreateUserInCache("Quinn Fabray", "student18@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s19 = getOrCreateUserInCache("Ryan Reynolds", "student19@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);
        UserEntity s20 = getOrCreateUserInCache("Sophia Loren", "student20@educorp.com", "studentpass123", "student", usersToSave, existingUsersByEmail);

        if (!usersToSave.isEmpty()) {
            List<UserEntity> savedUsers = userRepository.saveAll(usersToSave);
            for (UserEntity u : savedUsers) {
                existingUsersByEmail.put(u.getEmail().toLowerCase(), u);
            }
        }

        log.info("Total users count in database: {}", userRepository.count());
        log.info("Phase 1 completed in {} ms", System.currentTimeMillis() - phase1Start);


        // 2. SEED CATEGORIES
        log.info("Phase 2: Seeding categories...");
        long phase2Start = System.currentTimeMillis();

        Map<String, CategoryEntity> categoriesByName = categoryRepository.findAll().stream()
                .collect(Collectors.toMap(c -> c.getName().toLowerCase(), c -> c, (c1, c2) -> c1));

        List<CategoryEntity> categoriesToSave = new ArrayList<>();

        // Original Categories
        CategoryEntity cloudArchCat = getOrCreateCategoryInCache("Cloud Architecture", "☁️", "Master public and private cloud design, scalability, and security.", "#0284C7", categoriesToSave, categoriesByName);
        CategoryEntity cyberSecCat = getOrCreateCategoryInCache("Cybersecurity", "🛡️", "Learn modern threat intelligence, zero-trust network engineering, and compliance.", "#DC2626", categoriesToSave, categoriesByName);
        CategoryEntity devCat = getOrCreateCategoryInCache("Software Engineering", "💻", "Build highly scalable backend services, event-driven architectures, and modern web systems.", "#059669", categoriesToSave, categoriesByName);

        // Expand Categories to at least 10 unique, non-duplicate concepts
        CategoryEntity programmingCat = getOrCreateCategoryInCache("Programming", "💻", "Learn core languages like Python, C++, and Go.", "#4F46E5", categoriesToSave, categoriesByName);
        CategoryEntity aiCat = getOrCreateCategoryInCache("Artificial Intelligence", "🤖", "Explore neural networks, NLP, and computer vision.", "#8B5CF6", categoriesToSave, categoriesByName);
        CategoryEntity mlCat = getOrCreateCategoryInCache("Machine Learning", "📊", "Build and deploy predictive models using modern frameworks.", "#EC4899", categoriesToSave, categoriesByName);
        CategoryEntity webCat = getOrCreateCategoryInCache("Web Development", "🌐", "Master modern frontend and full-stack frameworks.", "#F59E0B", categoriesToSave, categoriesByName);
        CategoryEntity mobileCat = getOrCreateCategoryInCache("Mobile Development", "📱", "Build cross-platform and native mobile applications.", "#10B981", categoriesToSave, categoriesByName);
        CategoryEntity devopsCat = getOrCreateCategoryInCache("DevOps", "⚙️", "Master CI/CD pipelines, container orchestration, and IaC.", "#6B7280", categoriesToSave, categoriesByName);
        CategoryEntity dbCat = getOrCreateCategoryInCache("Database Systems", "🗄️", "Learn relational and NoSQL databases, indexing, and scaling.", "#3B82F6", categoriesToSave, categoriesByName);
        CategoryEntity softCat = getOrCreateCategoryInCache("Soft Skills", "💬", "Develop communication, leadership, and emotional intelligence.", "#14B8A6", categoriesToSave, categoriesByName);

        if (!categoriesToSave.isEmpty()) {
            List<CategoryEntity> savedCats = categoryRepository.saveAll(categoriesToSave);
            for (CategoryEntity c : savedCats) {
                categoriesByName.put(c.getName().toLowerCase(), c);
            }
        }

        log.info("Total categories count in database: {}", categoryRepository.count());
        log.info("Phase 2 completed in {} ms", System.currentTimeMillis() - phase2Start);


        // 3. SEED COURSES
        log.info("Phase 3: Seeding premium enterprise courses...");
        long phase3Start = System.currentTimeMillis();

        Map<String, CourseEntity> coursesBySlug = courseRepository.findAll().stream()
                .collect(Collectors.toMap(c -> c.getSlug().toLowerCase(), c -> c, (c1, c2) -> c1));

        List<CourseEntity> coursesToSave = new ArrayList<>();

        // Define course specs
        List<CourseSpec> specs = Arrays.asList(
            new CourseSpec("AWS Certified Solutions Architect", "aws-solutions-architect", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
                "Design highly available, cost-efficient, fault-tolerant, and secure systems on AWS.",
                "This comprehensive, production-grade course is designed for solutions architects and developers. Learn core AWS services including VPC subnets, secure IAM roles, EC2 autoscaling, ECS container deployment, serverless AWS Lambda, RDS replication, and highly persistent S3 storage buckets.",
                "Intermediate", "40 hours", cloudArchCat),
            new CourseSpec("Google Cloud Platform Fundamentals", "gcp-fundamentals", "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
                "Get started with GCP's computing power, container management, and scalable serverless runtimes.",
                "Explore Google Cloud Platform's key infrastructure options. Learn to manage Google Compute Engine instances, design high-performance networks, deploy enterprise-ready Kubernetes clusters with GKE, and execute fast, event-driven processes with Cloud Functions.",
                "Beginner", "15 hours", cloudArchCat),
            new CourseSpec("Zero-Trust Network Security", "zero-trust-security", "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
                "Design, implement, and validate robust zero-trust access structures for modern workspaces.",
                "As network perimeters dissolve, authentication is everything. Learn to implement micro-segmentation, configure dynamic Identity-Aware Proxies, enforce multi-factor continuous validation policies, and coordinate secure API gateways.",
                "Advanced", "30 hours", cyberSecCat),
            new CourseSpec("Certified Ethical Hacker Prep", "ethical-hacker-prep", "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
                "Master penetration testing methodologies, network vulnerability analysis, and payload delivery.",
                "Unlock industry-standard penetration testing techniques in highly controlled virtual laboratories. Understand packet analysis using Wireshark, map target topologies with Nmap, execute controlled exploits with Metasploit, and secure systems against active threat vectors.",
                "Intermediate", "35 hours", cyberSecCat),
            new CourseSpec("Modern Backend Architectures in Java", "modern-backend-java", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
                "Build resilient, high-throughput microservices using Spring Boot, Hibernate, and Apache Kafka.",
                "Take your backend Java skills to the enterprise level. Learn to structure scalable RESTful APIs, manage transaction safety with Spring Data JPA, containerize services using Docker, optimize query execution, and implement reliable microservices with distributed message brokers.",
                "Advanced", "25 hours", devCat),
            new CourseSpec("Advanced Python Engineering", "advanced-python-engineering", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
                "Master decorator patterns, context managers, async programming, and profiling tools in Python.",
                "Deep dive into advanced python topics including decorators, metaclasses, descriptors, multiprocessing, asyncio, memory management, garbage collection, and optimizing performance using Cython.",
                "Advanced", "30 hours", programmingCat),
            new CourseSpec("Go Programming for Systems", "go-programming-systems", "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=600&auto=format&fit=crop",
                "Build low-latency, high-performance network services and system utilities with Go.",
                "Go is built for performance and concurrency. Learn goroutine mechanics, channel patterns, memory profiling, writing fast web servers, custom system utilities, and dealing with pointers safely.",
                "Intermediate", "24 hours", programmingCat),
            new CourseSpec("Natural Language Processing", "natural-language-processing", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
                "Learn core NLP techniques, tokenization, text embeddings, and modern Transformer-based designs.",
                "Learn the core of textual AI. Topics include lexical analysis, tokenization, word vectors (Word2Vec, GloVe), Recurrent Neural Networks (LSTMs), Attention Mechanisms, and fine-tuning BERT or GPT-based LLMs.",
                "Advanced", "45 hours", aiCat),
            new CourseSpec("Computer Vision Foundations", "computer-vision-foundations", "https://images.unsplash.com/photo-1507146426996-ef05306b995a?q=80&w=600&auto=format&fit=crop",
                "Unlock image processing, feature detection, CNNs, and object detection frameworks.",
                "Implement state-of-the-art visual models. Understand kernels, edge detection, Convolutional Neural Networks (CNNs), transfer learning, ResNet architectures, image segmentation, and real-time object tracking using YOLO.",
                "Intermediate", "32 hours", aiCat),
            new CourseSpec("Applied Machine Learning", "applied-machine-learning", "https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop",
                "Build and deploy regression, classification, clustering, and ensemble learning systems.",
                "A core engineering approach to machine learning. Covers data cleaning, feature engineering, linear/logistic regression, decision trees, random forests, XGBoost, hyperparameter tuning, and pipeline deployment.",
                "Intermediate", "28 hours", mlCat),
            new CourseSpec("Deep Learning Specialization", "deep-learning-specialization", "https://images.unsplash.com/photo-1516116211223-4c599701b744?q=80&w=600&auto=format&fit=crop",
                "Master neural networks, backpropagation, optimization algorithms, and modern deep architectures.",
                "Explore deep neural networks. Learn backpropagation mathematics, weights initialization, regularizations (L2, Dropout), optimization (Adam, RMSprop), and building models in TensorFlow/Keras.",
                "Advanced", "50 hours", mlCat),
            new CourseSpec("Kubernetes in Production", "kubernetes-production", "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&auto=format&fit=crop",
                "Deploy, scale, monitor, and safeguard containerized enterprise services in production.",
                "Learn orchestration at scale. Implement core concepts including Pods, Deployments, Services, Ingress Controllers, Persistent Volumes, ConfigMaps, Helm charts, Prometheus/Grafana monitoring, and RBAC security policies.",
                "Advanced", "35 hours", cloudArchCat),
            new CourseSpec("Offensive Security Certified Professional", "oscp-prep", "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop",
                "Intensive security training covering manual exploitation, buffer overflows, and privilege escalation.",
                "Prepare for the ultimate pentesting certification. Topics include active enumeration, manual exploit modification, buffer overflow engineering, Linux/Windows privilege escalation, and lateral movement in Active Directory.",
                "Advanced", "60 hours", cyberSecCat),
            new CourseSpec("Full-Stack React & Next.js", "fullstack-react-nextjs", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
                "Master Next.js App Router, Server Components, Server Actions, and real-time state synchronization.",
                "Learn the ultimate modern frontend framework. Explore React Server Components, server-side rendering (SSR), static site generation (SSG), database querying using Prisma, authentication, and hosting on Vercel.",
                "Intermediate", "30 hours", webCat),
            new CourseSpec("Enterprise Angular Architect", "enterprise-angular-architect", "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
                "Build large-scale enterprise frontends using Angular RxJS state managers, and NgRx.",
                "Designed for enterprise frontends. Master RxJS observables, reactive form validation, custom routing preloading strategies, standalone components, NgRx global state management, and high-performance rendering.",
                "Advanced", "36 hours", webCat),
            new CourseSpec("Cross-Platform Flutter Apps", "cross-platform-flutter", "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=600&auto=format&fit=crop",
                "Develop highly interactive and fluid native applications for iOS and Android using Dart.",
                "Learn Flutter from absolute basics to advanced states. Understand the widget tree, state management using Provider/Riverpod, REST API ingestion, offline database caching, and custom device animations.",
                "Intermediate", "28 hours", mobileCat),
            new CourseSpec("CI/CD Pipelines with Jenkins", "cicd-jenkins", "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=600&auto=format&fit=crop",
                "Automate software building, continuous automated testing, security scanning, and deployment.",
                "Learn the industry-standard automation server. Build Declarative Pipelines, manage build triggers, integrate SonarQube quality gates, build container images, and deploy automatically to cloud servers.",
                "Intermediate", "20 hours", devopsCat),
            new CourseSpec("High-Performance PostgreSQL", "high-performance-postgresql", "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=600&auto=format&fit=crop",
                "Optimize queries, configure connection pools, map indexing strategies, and master partitioning.",
                "Deep dive into the world's most advanced relational database. Learn EXPLAIN query analysis, B-tree/GIN/GiST index tuning, connection pooling with PgBouncer, table partitioning, and high availability replication.",
                "Advanced", "32 hours", dbCat),
            new CourseSpec("Leadership for Tech Leads", "leadership-tech-leads", "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
                "Transition from developer to tech lead. Master mentoring, delegation, and architecture scoping.",
                "Lead engineering teams with confidence. Learn delegation techniques, resolving technical disputes, managing technical debt, mentoring developers, agile team coordination, and translating requirements for business stakeholders.",
                "Intermediate", "16 hours", softCat),
            new CourseSpec("Effective Remote Communication", "effective-remote-communication", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
                "Improve writing clarity, run productive meetings, and manage distributed operations.",
                "Unlock remote excellence. Focus on asynchronous communication, structuring readable emails/slack logs, running tight remote design sessions, building online trust, and documenting engineering architectures.",
                "Beginner", "12 hours", softCat)
        );

        List<CourseEntity> allCourses = new ArrayList<>();
        for (CourseSpec spec : specs) {
            CourseEntity course = getOrCreateCourseInCache(spec, coursesToSave, coursesBySlug);
            allCourses.add(course);
        }

        if (!coursesToSave.isEmpty()) {
            List<CourseEntity> savedCourses = courseRepository.saveAll(coursesToSave);
            for (CourseEntity c : savedCourses) {
                coursesBySlug.put(c.getSlug().toLowerCase(), c);
            }
        }

        // Re-read or reference complete courses with database IDs
        for (int i = 0; i < allCourses.size(); i++) {
            CourseEntity c = allCourses.get(i);
            if (c.getId() == null) {
                allCourses.set(i, coursesBySlug.get(c.getSlug().toLowerCase()));
            }
        }

        // Curriculum Seeding
        List<ModuleEntity> allExistingModules = moduleRepository.findAll();
        Set<Long> coursesWithModules = allExistingModules.stream()
                .map(m -> m.getCourse().getId())
                .collect(Collectors.toSet());

        List<ModuleEntity> modulesToSave = new ArrayList<>();
        for (CourseEntity course : allCourses) {
            if (!coursesWithModules.contains(course.getId())) {
                if (course.getSlug().equals("modern-backend-java")) {
                    modulesToSave.add(ModuleEntity.builder()
                            .title("Foundations of Spring Boot & JPA")
                            .description("Kickstart your backend development by understanding core dependency inversion, container lifecycles, and relational database integrations.")
                            .moduleOrder(1).isActive(true).course(course).build());
                    modulesToSave.add(ModuleEntity.builder()
                            .title("Advanced Microservices & Scaling")
                            .description("Transform monolithic Java systems into microservices utilizing container orchestration and asynchronous distributed messaging queues.")
                            .moduleOrder(2).isActive(true).course(course).build());
                } else {
                    modulesToSave.add(ModuleEntity.builder()
                            .title("Module 1: Introduction and Core Principles")
                            .description("Foundations and fundamental concepts of " + course.getTitle() + ".")
                            .moduleOrder(1).isActive(true).course(course).build());
                    modulesToSave.add(ModuleEntity.builder()
                            .title("Module 2: Advanced Concepts and Best Practices")
                            .description("Deep dive and industry-standard workflows for " + course.getTitle() + ".")
                            .moduleOrder(2).isActive(true).course(course).build());
                }
            }
        }

        if (!modulesToSave.isEmpty()) {
            moduleRepository.saveAll(modulesToSave);
        }

        // Re-read all modules and build courseOrderToModuleMap
        List<ModuleEntity> updatedModules = moduleRepository.findAll();
        Map<String, ModuleEntity> courseOrderToModuleMap = updatedModules.stream()
                .collect(Collectors.toMap(m -> m.getCourse().getId() + ":" + m.getModuleOrder(), m -> m, (m1, m2) -> m1));

        List<SubmoduleEntity> allExistingSubmodules = submoduleRepository.findAll();
        // Index submodules by moduleId + ":" + submoduleOrder
        Map<String, SubmoduleEntity> moduleOrderToSubmoduleMap = allExistingSubmodules.stream()
                .collect(Collectors.toMap(s -> s.getModule().getId() + ":" + s.getSubmoduleOrder(), s -> s, (existingSubmodule, submodule) -> existingSubmodule));

        List<SubmoduleEntity> submodulesToSave = new ArrayList<>();
        for (CourseEntity course : allCourses) {
            ModuleEntity m1 = courseOrderToModuleMap.get(course.getId() + ":1");
            ModuleEntity m2 = courseOrderToModuleMap.get(course.getId() + ":2");

            if (m1 != null && !moduleOrderToSubmoduleMap.containsKey(m1.getId() + ":1")) {
                if (course.getSlug().equals("modern-backend-java")) {
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Dependency Injection & Bean Lifecycle")
                            .slug("spring-core-di")
                            .description("Dive into how the Spring Inversion of Control (IoC) Container instantiates, configures, manages, and resolves dependencies.")
                            .submoduleOrder(1).isActive(true).module(m1).build());
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Mapping Relationships and Cascade Operations")
                            .slug("mapping-entities-jpa")
                            .description("Understand how to cleanly map database relationships using Hibernate's One-to-Many, Many-to-One, and cascade types.")
                            .submoduleOrder(2).isActive(true).module(m1).build());
                } else {
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Fundamentals Overview")
                            .slug(course.getSlug() + "-fundamentals")
                            .description("Getting started with core components and setups.")
                            .submoduleOrder(1).isActive(true).module(m1).build());
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("First Practical Steps")
                            .slug(course.getSlug() + "-practical")
                            .description("Hands-on projects and guided exercises.")
                            .submoduleOrder(2).isActive(true).module(m1).build());
                }
            }

            if (m2 != null && !moduleOrderToSubmoduleMap.containsKey(m2.getId() + ":1")) {
                if (course.getSlug().equals("modern-backend-java")) {
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Containerizing Java with Multi-Stage Dockerfiles")
                            .slug("dockerizing-java-apps")
                            .description("Package compiled bytecode securely. Build optimized JRE-only final execution containers with multi-stage build strategies.")
                            .submoduleOrder(1).isActive(true).module(m2).build());
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Asynchronous Messaging with Apache Kafka")
                            .slug("kafka-event-driven")
                            .description("Learn event-driven publishing and subscribing patterns. Implement resilient message consumption with consumer groups and deserialization.")
                            .submoduleOrder(2).isActive(true).module(m2).build());
                } else {
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Enterprise Integration")
                            .slug(course.getSlug() + "-enterprise")
                            .description("Scaling, deploying, and securing your applications.")
                            .submoduleOrder(1).isActive(true).module(m2).build());
                    submodulesToSave.add(SubmoduleEntity.builder()
                            .title("Optimization and Performance")
                            .slug(course.getSlug() + "-optimization")
                            .description("Advanced performance tuning, debugging, and diagnostics.")
                            .submoduleOrder(2).isActive(true).module(m2).build());
                }
            }
        }

        if (!submodulesToSave.isEmpty()) {
            submoduleRepository.saveAll(submodulesToSave);
        }

        // Re-read all submodules and rebuild moduleOrderToSubmoduleMap
        List<SubmoduleEntity> updatedSubmodules = submoduleRepository.findAll();
        moduleOrderToSubmoduleMap = updatedSubmodules.stream()
                .collect(Collectors.toMap(s -> s.getModule().getId() + ":" + s.getSubmoduleOrder(), s -> s, (existingSubmodule, submodule) -> existingSubmodule));

        List<ContentEntity> allExistingContents = contentRepository.findAll();
        Map<String, ContentEntity> contentsKeyMap = allExistingContents.stream()
                .collect(Collectors.toMap(c -> c.getSubmodule().getId() + ":" + c.getTitle().toLowerCase(), c -> c, (c1, c2) -> c1));

        List<ContentEntity> contentsToSave = new ArrayList<>();
        for (CourseEntity course : allCourses) {
            ModuleEntity m1 = courseOrderToModuleMap.get(course.getId() + ":1");
            if (m1 == null) continue;

            SubmoduleEntity s1_1 = moduleOrderToSubmoduleMap.get(m1.getId() + ":1");
            SubmoduleEntity s1_2 = moduleOrderToSubmoduleMap.get(m1.getId() + ":2");

            if (s1_1 != null) {
                if (course.getSlug().equals("modern-backend-java")) {
                    addContentIfMissing("Inversion of Control (IoC) Explained", "text",
                            "In traditional programming, objects explicitly instantiate their dependencies. In Spring, the framework takes over this lifecycle management, a design principle known as **Inversion of Control (IoC)**. By annotating Java classes with `@Component`, `@Service`, or `@Repository`, you register them as Spring beans. Spring then handles the constructor wiring automatically.",
                            null, null, null, 1, s1_1, contentsToSave, contentsKeyMap);
                    addContentIfMissing("Visualizing Dependency Injection and Configuration Options", "video",
                            null, "https://www.youtube.com/embed/dQw4w9WgXcQ", null, null, 2, s1_1, contentsToSave, contentsKeyMap);
                    addContentIfMissing("Declaring a Service with Constructor-Based Autowiring", "code",
                            null, null, "@Service\npublic class EnrollmentService {\n\n    private final StudentRepository studentRepository;\n    private final CourseRepository courseRepository;\n\n    @Autowired\n    public EnrollmentService(StudentRepository studentRepo, CourseRepository courseRepo) {\n        this.studentRepository = studentRepo;\n        this.courseRepository = courseRepo;\n    }\n\n    public boolean isStudentEnrolled(Long studentId, Long courseId) {\n        return studentRepository.existsByIdAndEnrolledCoursesId(studentId, courseId);\n    }\n}",
                            "java", 3, s1_1, contentsToSave, contentsKeyMap);
                } else {
                    addContentIfMissing("Course Introduction", "text",
                            "Welcome to **" + course.getTitle() + "**. This course is designed to take you from a beginner to a highly confident professional. In this lesson, we will cover the roadmap, objectives, and prerequisites.",
                            null, null, null, 1, s1_1, contentsToSave, contentsKeyMap);
                    addContentIfMissing("Core Architecture Walkthrough", "video",
                            null, "https://www.youtube.com/embed/dQw4w9WgXcQ", null, null, 2, s1_1, contentsToSave, contentsKeyMap);
                    addContentIfMissing("Getting Started Code Example", "code",
                            null, null, "// Setup configuration example\nconsole.log(\"Initializing " + course.getTitle() + "...\");\n",
                            "javascript", 3, s1_1, contentsToSave, contentsKeyMap);
                }
            }

            if (s1_2 != null && !course.getSlug().equals("modern-backend-java")) {
                addContentIfMissing("Hands-on Exercise", "text",
                        "Follow the guided instructions in the video and write your first integration code block. Test it locally and push your changes.",
                        null, null, null, 1, s1_2, contentsToSave, contentsKeyMap);
            }
        }

        if (!contentsToSave.isEmpty()) {
            contentRepository.saveAll(contentsToSave);
        }

        log.info("Total courses count in database: {}", courseRepository.count());
        log.info("Total modules count in database: {}", moduleRepository.count());
        log.info("Total submodules count in database: {}", submoduleRepository.count());
        log.info("Total content blocks count in database: {}", contentRepository.count());
        log.info("Phase 3 completed in {} ms", System.currentTimeMillis() - phase3Start);


        // 4. SEED BATCHES (approximately 20 batches)
        log.info("Phase 4: Seeding student batches...");
        long phase4Start = System.currentTimeMillis();

        List<UserEntity> teachers = List.of(defaultTeacher, teacher2, teacher3, teacher4, teacher5);
        Map<String, BatchEntity> batchesByCode = batchRepository.findAll().stream()
                .collect(Collectors.toMap(b -> b.getBatchCode().toLowerCase(), b -> b, (b1, b2) -> b1));

        List<BatchEntity> batchesToSave = new ArrayList<>();
        List<BatchEntity> allBatches = new ArrayList<>();

        for (int i = 0; i < allCourses.size(); i++) {
            CourseEntity course = allCourses.get(i);
            UserEntity teacher = teachers.get(i % teachers.size());
            String batchName = course.getTitle() + " Cohort " + (i / teachers.size() + 1);
            String batchCode = "BATCH-" + course.getSlug().toUpperCase().replace("-", "_") + "_" + (i / teachers.size() + 1);

            BatchEntity existing = batchesByCode.get(batchCode.toLowerCase());
            if (existing != null) {
                allBatches.add(existing);
            } else {
                BatchEntity batch = BatchEntity.builder()
                        .name(batchName)
                        .batchCode(batchCode)
                        .course(course)
                        .teacher(teacher)
                        .startDate(LocalDateTime.now().minusDays(30))
                        .endDate(LocalDateTime.now().plusDays(60))
                        .isActive(true)
                        .build();
                batchesToSave.add(batch);
                allBatches.add(batch);
                batchesByCode.put(batchCode.toLowerCase(), batch);
            }
        }

        if (!batchesToSave.isEmpty()) {
            List<BatchEntity> savedBatches = batchRepository.saveAll(batchesToSave);
            for (BatchEntity b : savedBatches) {
                batchesByCode.put(b.getBatchCode().toLowerCase(), b);
            }
        }

        // Update allBatches list with persisted entities containing database IDs
        for (int i = 0; i < allBatches.size(); i++) {
            BatchEntity b = allBatches.get(i);
            if (b.getId() == null) {
                allBatches.set(i, batchesByCode.get(b.getBatchCode().toLowerCase()));
            }
        }

        log.info("Total student batches count in database: {}", batchRepository.count());
        log.info("Phase 4 completed in {} ms", System.currentTimeMillis() - phase4Start);


        // 5. SEED ENROLLMENTS AND BATCH STUDENTS (Assign enrolled students into appropriate batches)
        log.info("Phase 5: Seeding course enrollments and batch students...");
        long phase5Start = System.currentTimeMillis();

        List<UserEntity> students = List.of(
                defaultStudent, s2, s3, s4, s5, s6, s7, s8, s9, s10,
                s11, s12, s13, s14, s15, s16, s17, s18, s19, s20
        );

        Map<String, EnrollmentEntity> enrollmentsKeyMap = enrollmentRepository.findAll().stream()
                .collect(Collectors.toMap(e -> e.getStudent().getId() + ":" + e.getCourse().getId(), e -> e, (e1, e2) -> e1));

        Map<String, BatchStudentEntity> batchStudentsKeyMap = batchStudentRepository.findAll().stream()
                .collect(Collectors.toMap(bs -> bs.getBatch().getId() + ":" + bs.getStudent().getId(), bs -> bs, (b1, b2) -> b1));

        Map<Long, BatchEntity> batchesByCourseId = allBatches.stream()
                .collect(Collectors.toMap(b -> b.getCourse().getId(), b -> b, (b1, b2) -> b1));

        List<EnrollmentEntity> enrollmentsToSave = new ArrayList<>();
        List<BatchStudentEntity> batchStudentsToSave = new ArrayList<>();

        for (int studentIdx = 0; studentIdx < students.size(); studentIdx++) {
            UserEntity student = students.get(studentIdx);

            // Enroll in 5 different courses based on student index to guarantee exactly 5 students per batch
            for (int k = 0; k < 5; k++) {
                int courseIdx = (studentIdx * 5 + k) % allCourses.size();
                CourseEntity course = allCourses.get(courseIdx);

                // Find corresponding batch
                BatchEntity batch = batchesByCourseId.get(course.getId());
                if (batch == null) {
                    batch = allBatches.get(0);
                }

                // Distribute progress realistically
                int progress = (studentIdx * 17 + k * 23) % 100;
                EnrollmentStatus enrollStatus = progress >= 80 ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ENROLLED;

                // Create enrollment if missing
                String enrollmentKey = student.getId() + ":" + course.getId();
                if (!enrollmentsKeyMap.containsKey(enrollmentKey)) {
                    EnrollmentEntity enrollment = EnrollmentEntity.builder()
                            .student(student)
                            .course(course)
                            .status(enrollStatus)
                            .progressPercentage(progress)
                            .enrolledAt(LocalDateTime.now().minusDays(15))
                            .build();
                    enrollmentsToSave.add(enrollment);
                    enrollmentsKeyMap.put(enrollmentKey, enrollment);
                }

                // Create batch student assignment if missing
                String batchStudentKey = batch.getId() + ":" + student.getId();
                if (!batchStudentsKeyMap.containsKey(batchStudentKey)) {
                    BatchStudentEntity batchStudent = BatchStudentEntity.builder()
                            .batch(batch)
                            .student(student)
                            .status(BatchStatus.ACTIVE)
                            .enrolledAt(LocalDateTime.now().minusDays(14))
                            .build();
                    batchStudentsToSave.add(batchStudent);
                    batchStudentsKeyMap.put(batchStudentKey, batchStudent);
                }
            }
        }

        if (!enrollmentsToSave.isEmpty()) {
            enrollmentRepository.saveAll(enrollmentsToSave);
        }
        if (!batchStudentsToSave.isEmpty()) {
            batchStudentRepository.saveAll(batchStudentsToSave);
        }

        log.info("Total enrollments count in database: {}", enrollmentRepository.count());
        log.info("Total batch-student assignments in database: {}", batchStudentRepository.count());
        log.info("Phase 5 completed in {} ms", System.currentTimeMillis() - phase5Start);


        // 6. SEED ASSIGNMENTS (exactly 20 assignments, 1 per course, with realistic combinations of features)
        log.info("Phase 6: Seeding assignments with varied configurations...");
        long phase6Start = System.currentTimeMillis();

        Map<String, AssignmentEntity> assignmentsKeyMap = assignmentRepository.findAll().stream()
                .collect(Collectors.toMap(a -> a.getCourse().getId() + ":" + a.getTitle().toLowerCase(), a -> a, (a1, a2) -> a1));

        Map<String, AssignmentBatchEntity> assignmentBatchKeys = assignmentBatchRepository.findAll().stream()
                .collect(Collectors.toMap(ab -> ab.getAssignment().getId() + ":" + ab.getBatch().getId(), ab -> ab, (ab1, ab2) -> ab1));

        List<AssignmentEntity> assignmentsToSave = new ArrayList<>();
        List<AssignmentEntity> allAssignments = new ArrayList<>();

        for (int i = 0; i < allCourses.size(); i++) {
            CourseEntity course = allCourses.get(i);
            String title;
            String description;
            String instructions;

            boolean autoSubmit;
            boolean allowLateSubmission;
            boolean shuffleQuestions;
            boolean shuffleOptions;
            Integer maxAttempts;
            boolean enableCertificates;
            int timeLimitMinutes;
            int passingMarks;
            LocalDateTime dueDate;

            if (i % 4 == 0) {
                title = "Comprehensive Quiz - " + course.getTitle();
                description = "This quiz evaluates your understanding of the foundational modules. Read all questions carefully.";
                instructions = "Select the best answer for each question. You have 60 minutes to complete.";
                autoSubmit = true;
                allowLateSubmission = true;
                shuffleQuestions = true;
                shuffleOptions = true;
                maxAttempts = 2;
                enableCertificates = true;
                timeLimitMinutes = 60;
                passingMarks = 40;
                dueDate = LocalDateTime.now().plusDays(15);
            } else if (i % 4 == 1) {
                title = "MCQ Examination on " + course.getTitle();
                description = "Mid-term MCQ examination covering the core principles, syntax, and architectures.";
                instructions = "Answer all questions. Show your reasoning where appropriate.";
                autoSubmit = false;
                allowLateSubmission = false;
                shuffleQuestions = false;
                shuffleOptions = false;
                maxAttempts = 1;
                enableCertificates = false;
                timeLimitMinutes = 45;
                passingMarks = 50;
                dueDate = LocalDateTime.now().plusDays(10);
            } else if (i % 4 == 2) {
                title = "Hands-on Coding Challenge: " + course.getTitle();
                description = "Practical coding assignment. Implement the specified requirements in clean, modular, and optimized code.";
                instructions = "Write clean code, add comments, and handle all edge cases. Submit your repository/source files.";
                autoSubmit = true;
                allowLateSubmission = true;
                shuffleQuestions = false;
                shuffleOptions = true;
                maxAttempts = 3;
                enableCertificates = true;
                timeLimitMinutes = 120;
                passingMarks = 60;
                dueDate = LocalDateTime.now().minusDays(2); // In the PAST to facilitate realistic LATE submissions
            } else {
                title = "Technical Essay: " + course.getTitle() + " Case Study";
                description = "Write a comprehensive technical essay analyzing real-world architectural design, trade-offs, and scaling bottlenecks.";
                instructions = "Your essay must be at least 1500 words, structured with clear headings, references, and diagrams where necessary.";
                autoSubmit = false;
                allowLateSubmission = true;
                shuffleQuestions = true;
                shuffleOptions = false;
                maxAttempts = null; // Unlimited attempts
                enableCertificates = false;
                timeLimitMinutes = 90;
                passingMarks = 45;
                dueDate = LocalDateTime.now().minusDays(1); // In the PAST to facilitate realistic LATE submissions
            }

            UserEntity teacher = allBatches.get(i).getTeacher();

            String assignmentKey = course.getId() + ":" + title.toLowerCase();
            AssignmentEntity existing = assignmentsKeyMap.get(assignmentKey);
            if (existing != null) {
                allAssignments.add(existing);
            } else {
                AssignmentEntity assignment = AssignmentEntity.builder()
                        .title(title)
                        .description(description)
                        .instructions(instructions)
                        .course(course)
                        .teacher(teacher)
                        .status(AssignmentStatus.PUBLISHED)
                        .maxMarks(100)
                        .passingMarks(passingMarks)
                        .availableFrom(LocalDateTime.now().minusDays(10))
                        .dueDate(dueDate)
                        .timeLimitMinutes(timeLimitMinutes)
                        .allowLateSubmission(allowLateSubmission)
                        .shuffleQuestions(shuffleQuestions)
                        .shuffleOptions(shuffleOptions)
                        .maxAttempts(maxAttempts)
                        .enableCertificates(enableCertificates)
                        .autoSubmit(autoSubmit)
                        .showResultImmediately(true)
                        .isActive(true)
                        .build();
                assignmentsToSave.add(assignment);
                allAssignments.add(assignment);
                assignmentsKeyMap.put(assignmentKey, assignment);
            }
        }

        if (!assignmentsToSave.isEmpty()) {
            List<AssignmentEntity> savedAssignments = assignmentRepository.saveAll(assignmentsToSave);
            for (AssignmentEntity a : savedAssignments) {
                assignmentsKeyMap.put(a.getCourse().getId() + ":" + a.getTitle().toLowerCase(), a);
            }
        }

        // Re-reference with database IDs
        for (int i = 0; i < allAssignments.size(); i++) {
            AssignmentEntity a = allAssignments.get(i);
            if (a.getId() == null) {
                allAssignments.set(i, assignmentsKeyMap.get(a.getCourse().getId() + ":" + a.getTitle().toLowerCase()));
            }
        }

        // Save AssignmentBatch bindings
        List<AssignmentBatchEntity> assignmentBatchesToSave = new ArrayList<>();
        for (int i = 0; i < allAssignments.size(); i++) {
            AssignmentEntity assignment = allAssignments.get(i);
            BatchEntity batch = allBatches.get(i);
            String linkKey = assignment.getId() + ":" + batch.getId();
            if (!assignmentBatchKeys.containsKey(linkKey)) {
                AssignmentBatchEntity ab = AssignmentBatchEntity.builder()
                        .assignment(assignment)
                        .batch(batch)
                        .build();
                assignmentBatchesToSave.add(ab);
                assignmentBatchKeys.put(linkKey, ab);
            }
        }

        if (!assignmentBatchesToSave.isEmpty()) {
            assignmentBatchRepository.saveAll(assignmentBatchesToSave);
        }

        log.info("Total assignments count in database: {}", assignmentRepository.count());
        log.info("Total assignment-batch bindings in database: {}", assignmentBatchRepository.count());
        log.info("Phase 6 completed in {} ms", System.currentTimeMillis() - phase6Start);


        // 7. SEED QUESTIONS (at least 100 questions, 5 per assignment)
        log.info("Phase 7: Seeding questions and question options...");
        long phase7Start = System.currentTimeMillis();

        List<QuestionEntity> allExistingQuestions = questionRepository.findAll();
        Map<String, QuestionEntity> questionsKeyMap = allExistingQuestions.stream()
                .collect(Collectors.toMap(q -> q.getAssignment().getId() + ":" + q.getDisplayOrder(), q -> q, (q1, q2) -> q1));

        List<QuestionOptionEntity> allExistingOptions = questionOptionRepository.findAll();
        Set<String> optionsKeys = allExistingOptions.stream()
                .map(o -> o.getQuestion().getId() + ":" + o.getOptionText().toLowerCase())
                .collect(Collectors.toSet());

        List<QuestionEntity> questionsToSave = new ArrayList<>();

        for (AssignmentEntity assignment : allAssignments) {
            String checkKey = assignment.getId() + ":1";
            if (!questionsKeyMap.containsKey(checkKey)) {
                String courseTitle = assignment.getCourse().getTitle();

                // Question 1: MCQ
                questionsToSave.add(QuestionEntity.builder()
                        .assignment(assignment)
                        .title("Which of the following best describes the core design pattern or primary architecture used in " + courseTitle + "?")
                        .description("Review the architectural patterns and choose the one most aligned with standard guidelines.")
                        .questionType(QuestionType.MCQ)
                        .marks(20)
                        .displayOrder(1)
                        .required(true)
                        .build());

                // Question 2: MCQ (Multiple correct)
                questionsToSave.add(QuestionEntity.builder()
                        .assignment(assignment)
                        .title("Select all core benefits and advantages of implementing " + courseTitle + " in an enterprise environment.")
                        .description("Choose all that apply. Consider scalability, security, and developer productivity.")
                        .questionType(QuestionType.MULTIPLE_CORRECT)
                        .marks(20)
                        .displayOrder(2)
                        .required(true)
                        .build());

                // Question 3: TRUE_FALSE
                questionsToSave.add(QuestionEntity.builder()
                        .assignment(assignment)
                        .title("True or False: " + courseTitle + " requires continuous validation and zero-trust verification of all integrated systems.")
                        .description("Consider security controls, identity assertion, and continuous posture assessment.")
                        .questionType(QuestionType.TRUE_FALSE)
                        .marks(20)
                        .displayOrder(3)
                        .required(true)
                        .build());

                // Question 4: SHORT_ANSWER
                questionsToSave.add(QuestionEntity.builder()
                        .assignment(assignment)
                        .title("State the primary tool or command-line utility used to initialize or configure a default workspace in " + courseTitle + ".")
                        .description("Provide a one-word or short phrase answer. Be specific.")
                        .questionType(QuestionType.SHORT_ANSWER)
                        .marks(20)
                        .displayOrder(4)
                        .required(true)
                        .build());

                // Question 5: PARAGRAPH
                questionsToSave.add(QuestionEntity.builder()
                        .assignment(assignment)
                        .title("Provide a detailed architectural breakdown and critique of a real-world implementation of " + courseTitle + ".")
                        .description("Describe potential scaling bottlenecks, load-balancing strategies, and how to safeguard against common system failures.")
                        .questionType(QuestionType.PARAGRAPH)
                        .marks(20)
                        .displayOrder(5)
                        .required(true)
                        .build());
            }
        }

        if (!questionsToSave.isEmpty()) {
            List<QuestionEntity> savedQs = questionRepository.saveAll(questionsToSave);
            for (QuestionEntity q : savedQs) {
                questionsKeyMap.put(q.getAssignment().getId() + ":" + q.getDisplayOrder(), q);
            }
        }

        // Build a complete questionsByAssignmentId map for the next step (options and answers)
        List<QuestionEntity> updatedQuestions = questionRepository.findAll();
        Map<Long, List<QuestionEntity>> questionsByAssignmentId = updatedQuestions.stream()
                .collect(Collectors.groupingBy(q -> q.getAssignment().getId()));

        List<QuestionOptionEntity> optionsToSave = new ArrayList<>();

        for (AssignmentEntity assignment : allAssignments) {
            List<QuestionEntity> questions = questionsByAssignmentId.getOrDefault(assignment.getId(), List.of());
            for (QuestionEntity q : questions) {
                if (q.getDisplayOrder() == 1) {
                    addOptionIfMissing(q, "Microservices and decoupled event-driven systems", true, 1, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Monolithic tightly coupled design", false, 2, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Client-server without secondary abstraction", false, 3, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Shared-nothing batch-oriented processing", false, 4, optionsToSave, optionsKeys);
                } else if (q.getDisplayOrder() == 2) {
                    addOptionIfMissing(q, "Increased fault tolerance and isolation", true, 1, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Shorter deployment cycles and continuous integration", true, 2, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Zero operational overhead and zero cost", false, 3, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "Instant automated refactoring with no developer input", false, 4, optionsToSave, optionsKeys);
                } else if (q.getDisplayOrder() == 3) {
                    addOptionIfMissing(q, "True", true, 1, optionsToSave, optionsKeys);
                    addOptionIfMissing(q, "False", false, 2, optionsToSave, optionsKeys);
                }
            }
        }

        if (!optionsToSave.isEmpty()) {
            questionOptionRepository.saveAll(optionsToSave);
        }

        log.info("Total questions count in database: {}", questionRepository.count());
        log.info("Total options count in database: {}", questionOptionRepository.count());
        log.info("Phase 7 completed in {} ms", System.currentTimeMillis() - phase7Start);


        // 8. SEED SUBMISSIONS AND ANSWERS (Realistic student submissions, pending, completed, graded)
        log.info("Phase 8: Seeding student submissions and responses...");
        long phase8Start = System.currentTimeMillis();

        List<BatchStudentEntity> allBatchStudentsList = batchStudentRepository.findAll();
        Map<Long, List<BatchStudentEntity>> batchStudentsByBatchId = allBatchStudentsList.stream()
                .collect(Collectors.groupingBy(bs -> bs.getBatch().getId()));

        List<SubmissionEntity> allExistingSubmissions = submissionRepository.findAll();
        Map<String, SubmissionEntity> submissionsKeyMap = allExistingSubmissions.stream()
                .collect(Collectors.toMap(s -> s.getAssignment().getId() + ":" + s.getStudent().getId(), s -> s, (existingSubmission, submission) -> existingSubmission));

        List<StudentAnswerEntity> allExistingAnswers = studentAnswerRepository.findAll();
        Set<String> answersKeys = allExistingAnswers.stream()
                .map(a -> a.getSubmission().getId() + ":" + a.getQuestion().getId())
                .collect(Collectors.toSet());

        // Refresh existing options
        List<QuestionOptionEntity> updatedOptions = questionOptionRepository.findAll();
        Map<Long, List<QuestionOptionEntity>> optionsByQuestionId = updatedOptions.stream()
                .collect(Collectors.groupingBy(o -> o.getQuestion().getId()));

        List<SubmissionEntity> submissionsToSave = new ArrayList<>();

        for (int i = 0; i < allAssignments.size(); i++) {
            AssignmentEntity assignment = allAssignments.get(i);
            BatchEntity batch = allBatches.get(i);
            List<BatchStudentEntity> batchStudents = batchStudentsByBatchId.getOrDefault(batch.getId(), List.of());

            for (int j = 0; j < batchStudents.size(); j++) {
                UserEntity student = batchStudents.get(j).getStudent();

                SubmissionStatus status;
                int score = 0;
                boolean isLate = false;

                if (j == 0) {
                    status = SubmissionStatus.GRADED;
                    score = 90;
                } else if (j == 1) {
                    status = SubmissionStatus.GRADED;
                    score = 85;
                } else if (j == 2) {
                    status = SubmissionStatus.SUBMITTED;
                } else if (j == 3) {
                    status = SubmissionStatus.LATE_SUBMITTED;
                    isLate = true;
                } else {
                    status = SubmissionStatus.IN_PROGRESS;
                }

                String submissionKey = assignment.getId() + ":" + student.getId();
                if (!submissionsKeyMap.containsKey(submissionKey)) {
                    LocalDateTime startedAt = LocalDateTime.now().minusDays(2);
                    LocalDateTime submittedAt = null;
                    if (status != SubmissionStatus.IN_PROGRESS) {
                        if (isLate) {
                            submittedAt = assignment.getDueDate().plusHours(5);
                        } else {
                            LocalDateTime normalSub = assignment.getDueDate().minusDays(1);
                            if (normalSub.isAfter(LocalDateTime.now())) {
                                submittedAt = LocalDateTime.now().minusMinutes(30);
                            } else {
                                submittedAt = normalSub;
                            }
                        }
                    }
                    SubmissionEntity submission = SubmissionEntity.builder()
                            .assignment(assignment)
                            .student(student)
                            .status(status)
                            .startedAt(startedAt)
                            .submittedAt(submittedAt)
                            .totalMarks(assignment.getMaxMarks())
                            .obtainedMarks(status == SubmissionStatus.GRADED ? score : null)
                            .percentage(status == SubmissionStatus.GRADED ? BigDecimal.valueOf(score) : null)
                            .isLateSubmission(isLate)
                            .build();
                    submissionsToSave.add(submission);
                    submissionsKeyMap.put(submissionKey, submission);
                }
            }
        }

        if (!submissionsToSave.isEmpty()) {
            List<SubmissionEntity> savedSubmissions = submissionRepository.saveAll(submissionsToSave);
            for (SubmissionEntity s : savedSubmissions) {
                submissionsKeyMap.put(s.getAssignment().getId() + ":" + s.getStudent().getId(), s);
            }
        }

        List<StudentAnswerEntity> answersToSave = new ArrayList<>();

        for (int i = 0; i < allAssignments.size(); i++) {
            AssignmentEntity assignment = allAssignments.get(i);
            BatchEntity batch = allBatches.get(i);
            List<BatchStudentEntity> batchStudents = batchStudentsByBatchId.getOrDefault(batch.getId(), List.of());
            List<QuestionEntity> questions = questionsByAssignmentId.getOrDefault(assignment.getId(), List.of());

            for (int j = 0; j < batchStudents.size(); j++) {
                UserEntity student = batchStudents.get(j).getStudent();

                SubmissionStatus status;
                int score = 0;
                if (j == 0) {
                    status = SubmissionStatus.GRADED;
                    score = 90;
                } else if (j == 1) {
                    status = SubmissionStatus.GRADED;
                    score = 85;
                } else if (j == 2) {
                    status = SubmissionStatus.SUBMITTED;
                } else if (j == 3) {
                    status = SubmissionStatus.LATE_SUBMITTED;
                } else {
                    status = SubmissionStatus.IN_PROGRESS;
                }

                if (status != SubmissionStatus.IN_PROGRESS) {
                    SubmissionEntity submission = submissionsKeyMap.get(assignment.getId() + ":" + student.getId());
                    if (submission != null) {
                        for (QuestionEntity question : questions) {
                            String answerKey = submission.getId() + ":" + question.getId();
                            if (!answersKeys.contains(answerKey)) {
                                QuestionOptionEntity selectedOption = null;
                                String answerText = null;
                                int obtainedMarks = 0;

                                if (question.getQuestionType() == QuestionType.MCQ || question.getQuestionType() == QuestionType.TRUE_FALSE) {
                                    List<QuestionOptionEntity> options = optionsByQuestionId.getOrDefault(question.getId(), List.of());
                                    selectedOption = options.stream()
                                            .filter(QuestionOptionEntity::isCorrect)
                                            .findFirst()
                                            .orElse(null);
                                    obtainedMarks = status == SubmissionStatus.GRADED ? 20 : 0;
                                } else if (question.getQuestionType() == QuestionType.SHORT_ANSWER) {
                                    answerText = "The standard CLI utility or configuration script.";
                                    obtainedMarks = status == SubmissionStatus.GRADED ? 20 : 0;
                                } else {
                                    answerText = "In this architectural analysis, we look at high-performance load balancers, caching layers (Redis/Memcached), and secure containerized runtimes that underpin modern scalable systems.";
                                    obtainedMarks = status == SubmissionStatus.GRADED ? (score == 90 ? 10 : 5) : 0;
                                }

                                answersToSave.add(StudentAnswerEntity.builder()
                                        .submission(submission)
                                        .question(question)
                                        .selectedOption(selectedOption)
                                        .answerText(answerText)
                                        .obtainedMarks(obtainedMarks)
                                        .teacherFeedback("Excellent response and demonstration.")
                                        .build());
                                answersKeys.add(answerKey);
                            }
                        }
                    }
                }
            }
        }

        if (!answersToSave.isEmpty()) {
            studentAnswerRepository.saveAll(answersToSave);
        }

        log.info("Total submissions count in database: {}", submissionRepository.count());
        log.info("Total student answers in database: {}", studentAnswerRepository.count());
        log.info("Phase 8 completed in {} ms", System.currentTimeMillis() - phase8Start);

        long totalDuration = System.currentTimeMillis() - totalStart;
        log.info("All premium and expanded LMS datasets seeded successfully!");
        log.info("TOTAL SEEDING DURATION: {} ms", totalDuration);
    }

    // Helper methods for clean, fully idempotent seeding
    private UserEntity getOrCreateUserInCache(String fullName, String email, String password, String role, List<UserEntity> usersToSave, Map<String, UserEntity> existingUsersByEmail) {
        UserEntity existing = existingUsersByEmail.get(email.toLowerCase());
        if (existing != null) {
            return existing;
        }
        UserEntity user = UserEntity.builder()
                .fullName(fullName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .role(role)
                .isActive(true)
                .build();
        usersToSave.add(user);
        existingUsersByEmail.put(email.toLowerCase(), user);
        return user;
    }

    private CategoryEntity getOrCreateCategoryInCache(String name, String icon, String description, String color, List<CategoryEntity> categoriesToSave, Map<String, CategoryEntity> categoriesByName) {
        CategoryEntity existing = categoriesByName.get(name.toLowerCase());
        if (existing != null) {
            return existing;
        }
        CategoryEntity category = CategoryEntity.builder()
                .name(name)
                .icon(icon)
                .description(description)
                .color(color)
                .isActive(true)
                .build();
        categoriesToSave.add(category);
        categoriesByName.put(name.toLowerCase(), category);
        return category;
    }

    private CourseEntity getOrCreateCourseInCache(CourseSpec spec, List<CourseEntity> coursesToSave, Map<String, CourseEntity> coursesBySlug) {
        CourseEntity existing = coursesBySlug.get(spec.slug.toLowerCase());
        if (existing != null) {
            return existing;
        }
        CourseEntity course = CourseEntity.builder()
                .title(spec.title)
                .slug(spec.slug)
                .thumbnail(spec.thumbnail)
                .shortDescription(spec.shortDesc)
                .description(spec.desc)
                .level(spec.level)
                .duration(spec.duration)
                .isActive(true)
                .category(spec.category)
                .build();
        coursesToSave.add(course);
        coursesBySlug.put(spec.slug.toLowerCase(), course);
        return course;
    }

    private void addContentIfMissing(String title, String type, String text, String videoUrl, String code, String language, int order, SubmoduleEntity submodule, List<ContentEntity> contentsToSave, Map<String, ContentEntity> contentsKeyMap) {
        String key = submodule.getId() + ":" + title.toLowerCase();
        if (!contentsKeyMap.containsKey(key)) {
            ContentEntity content = ContentEntity.builder()
                    .title(title)
                    .type(type)
                    .text(text)
                    .videoUrl(videoUrl)
                    .code(code)
                    .language(language)
                    .contentOrder(order)
                    .isActive(true)
                    .submodule(submodule)
                    .build();
            contentsToSave.add(content);
            contentsKeyMap.put(key, content);
        }
    }

    private void addOptionIfMissing(QuestionEntity question, String optionText, boolean isCorrect, int displayOrder, List<QuestionOptionEntity> optionsToSave, Set<String> optionsKeys) {
        String key = question.getId() + ":" + optionText.toLowerCase();
        if (!optionsKeys.contains(key)) {
            QuestionOptionEntity option = QuestionOptionEntity.builder()
                    .question(question)
                    .optionText(optionText)
                    .isCorrect(isCorrect)
                    .displayOrder(displayOrder)
                    .build();
            optionsToSave.add(option);
            optionsKeys.add(key);
        }
    }

    private void resetDemoPassword(String email, String rawPassword) {
        userRepository.findByEmail(email).ifPresent(user -> {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
        });
    }

    private static class CourseSpec {
        String title;
        String slug;
        String thumbnail;
        String shortDesc;
        String desc;
        String level;
        String duration;
        CategoryEntity category;

        CourseSpec(String title, String slug, String thumbnail, String shortDesc, String desc, String level, String duration, CategoryEntity category) {
            this.title = title;
            this.slug = slug;
            this.thumbnail = thumbnail;
            this.shortDesc = shortDesc;
            this.desc = desc;
            this.level = level;
            this.duration = duration;
            this.category = category;
        }
    }
}
