import { Category, Course } from "../types";

export const initialCategories: Category[] = [
  {
    id: 1,
    name: "Software Development",
    code: "DEV-01",
    description:
      "Programming languages, software architecture, DevOps tools, and cloud platforms.",
    courseCount: 148,
    status: "Active",
  },
  {
    id: 2,
    name: "Leadership & Management",
    code: "LDR-02",
    description:
      "Soft skills, strategic planning, team coordination, and delegation principles.",
    courseCount: 52,
    status: "Active",
  },
  {
    id: 3,
    name: "Cybersecurity",
    code: "SEC-03",
    description:
      "Network safety, threat assessment, ethical hacking, and data protection practices.",
    courseCount: 89,
    status: "Inactive",
  },
  {
    id: 4,
    name: "Creative Arts",
    code: "CRT-04",
    description:
      "User experience design, digital media production, and creative writing workshops.",
    courseCount: 31,
    status: "Active",
  },
  {
    id: 5,
    name: "Business & Finance",
    code: "BUS-05",
    description:
      "Corporate strategy, project budgeting, and digital marketing systems.",
    courseCount: 18,
    status: "Active",
  },
  {
    id: 6,
    name: "Compliance & Ethics",
    code: "CMP-06",
    description:
      "Regulatory compliance, GDPR standards, and general workplace codes of conduct.",
    courseCount: 12,
    status: "Active",
  },
];

export const initialCourses: Course[] = [
  {
    id: 1,
    title: "Cybersecurity Essentials",
    slug: "cybersecurity-essentials",
    category: "Cybersecurity",
    description:
      "Master the fundamentals of corporate data protection, phishing awareness, and secure remote work practices for all enterprise levels.",
    status: "Active",
    duration: "4.5 Hours",
    learnersCount: 1420,
    difficulty: "Beginner",
    language: "English",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBGfHZokk4rYTzu2-30ZZhWDtrexEGmB9TMld-NHnxxb0CwJXKOttg9Cpby77_AaA1wcNbOiNBO1ZRTT-HGj23znEP_YeifdA58pNun-Ngd2Mvq0LAQCXMyK9oyoKuQNPV0bmZ8eyD81g6Iz_XuhDPBckfkS7H39Nq_bMIfTW82jZTCBz6jtFNQMFsdWQMO-qGrAgzFPWB1yCJV01xnI103m4G1DDfrWFCmheWpNHwmsKIdGpkhuIzP-FlEvMwpETYYM9vWW0Weyg0",
    modules: [
      {
        id: 101,
        title: "Module 1: Introduction to Cybersecurity",
        isCollapsed: false,
        submodules: [
          {
            id: 1001,
            title: "1.1 The Threat Landscape",
            slug: "the-threat-landscape",
            description:
              "Understand current threat vectors, malicious actors, and the evolution of cybersecurity threats.",
            contentBlocks: [
              {
                id: 10001,
                type: "heading",
                value: "Understanding the Modern Cyber Landscape",
              },
              {
                id: 10002,
                type: "text",
                value:
                  "The threat landscape is shifting rapidly as bad actors leverage AI to automate sophisticated attacks...",
              },
              {
                id: 10003,
                type: "video",
                value: "https://vimeo.com/823719421",
                metadata: {
                  videoUrl: "https://vimeo.com/823719421",
                  caption: "An overview of modern cyber defense structures",
                },
              },
              {
                id: 10004,
                type: "code",
                value: `import socket

def scan_ports(target):
    for port in range(20, 81):
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        result = s.connect_ex((target, port))
        if result == 0:
            print(f"Port {port} is open")
        s.close()`,
                metadata: {
                  language: "Python",
                },
              },
              {
                id: 10005,
                type: "image",
                value:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVfxPOqrbAYF2TjkFu_3gctlDJwdWvn4Sm1C0iIOdWrNbZfkb6R_euORT3V9fZl2OcEL_29sppwr6xTntR8ysxi7YwIspRXPbTnMlO4OaohicFELiUnIhI-ECTVyr6MFGoEe2BH5triBpoczKlOFhxg5r6FSvx8oHmKVOl5vH0yWnVxxjXdA0b8Xuptj9q00UP6D77o1ta_yVhsny7r8_bbZXf4R3JPtT9mj2xehvBqZVzKFw_RzAUqTJJ4NS9ibRKuk3XEPO89U0",
                metadata: {
                  imageUrl:
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCVfxPOqrbAYF2TjkFu_3gctlDJwdWvn4Sm1C0iIOdWrNbZfkb6R_euORT3V9fZl2OcEL_29sppwr6xTntR8ysxi7YwIspRXPbTnMlO4OaohicFELiUnIhI-ECTVyr6MFGoEe2BH5triBpoczKlOFhxg5r6FSvx8oHmKVOl5vH0yWnVxxjXdA0b8Xuptj9q00UP6D77o1ta_yVhsny7r8_bbZXf4R3JPtT9mj2xehvBqZVzKFw_RzAUqTJJ4NS9ibRKuk3XEPO89U0",
                  altText: "Cybersecurity Shield",
                  caption: "Protecting digital assets",
                },
              },
              {
                id: 10006,
                type: "callout",
                value:
                  "Always simulate phishing campaigns regularly to keep employees' security awareness levels high and identify vulnerable departments.",
                metadata: {
                  calloutType: "lightbulb",
                },
              },
            ],
          },
          {
            id: 1002,
            title: "1.2 Security Fundamentals",
            slug: "security-fundamentals",
            description:
              "Dive into basic defense principles including defense-in-depth, least privilege access, and security controls.",
            contentBlocks: [
              {
                id: 10007,
                type: "heading",
                value: "Core Security Pillars",
              },
              {
                id: 10008,
                type: "text",
                value:
                  "Confidentiality, Integrity, and Availability form the CIA Triad which represents the foundational core of defense plans.",
              },
            ],
          },
          {
            id: 1003,
            title: "1.3 Ethics in Security",
            slug: "ethics-in-security",
            description:
              "Explore ethical considerations, legally mandated responsibilities, and appropriate usage policies.",
            contentBlocks: [],
          },
        ],
      },
      {
        id: 102,
        title: "Module 2: Network Infrastructure & Protocols",
        isCollapsed: true,
        submodules: [
          {
            id: 1004,
            title: "2.1 Port and Protocol Standards",
            slug: "port-and-protocol-standards",
            description:
              "Overview of standard firewall rules and TCP/IP protocol mapping.",
            contentBlocks: [],
          },
        ],
      },
    ],
    seo: {
      indexInSearch: true,
      metaTitle: "Cybersecurity Essentials | EduCorp LMS",
      metaDescription:
        "Master modern corporate data protection, remote work defense, and phishing mitigation strategies with expert certification.",
      canonicalUrl: "https://educorp.edu/courses/cybersecurity-essentials",
      keywords: "Cybersecurity, Phishing, Compliance, Enterprise Defense",
      ogImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KM6-T2A90avloq9FKPTn1I8uC1bi9sgHEymvVq9qTDaUA_de_rm5ZIIJ2mn2Fp4yAlM_szZS_JXUTwHxdhn3-O7JKs1yxdAI7gANCoyqUU6YnkRFjt8Nns_5afXjA2I2hDlUelOvBZ9Ssbgn9kRnUB1FwdLbexbWeoJDen10QrE2b-LUG57IkZeZhpgA2txG0fpe80QbdvQhgFXr1l9U4WQopzwzv_5l7IYcL4N_eJ5HnZ-rWK8UszpPcUPclaaXvGQp-gUwUBo",
      ogTitle: "Cybersecurity Essentials: Master the Enterprise Environment",
      ogDescription:
        "Become an active leader in defensive data systems. Protect critical channels with practical certifications.",
      xCardType: "Large Summary Card",
    },
  },
  {
    id: 2,
    title: "Leadership Principles",
    slug: "leadership-principles",
    category: "Leadership & Management",
    description:
      "Developing core competencies for first-time managers, focusing on delegation, conflict resolution, and strategic communication.",
    status: "Active",
    duration: "8.0 Hours",
    learnersCount: 890,
    difficulty: "Intermediate",
    language: "English",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC55bLS_GahWloPZgLsV3tdelaGb2PmodaAg5puhOMExFsJVhYOv7A5jTUr9PGrome4XVfTjfDig5JRyW4DW7bro7-PZfkqgjLR-IHur634D179AXapLwWdoaqm7tYuuFNxSm2JoE27LxcqfBwhcGlVV3pmFxVU1MOS5BZvShiofHVhdbzxtNP4oaaSWoKxd_oPBs7vlWefM-n9hm2T1aACs4PfifaIa8PZKXz2JRAWo8yHWLFtLcfDnJJYQ5QWoSzeLLzKsCXRGYE",
    modules: [],
    seo: {
      indexInSearch: true,
      metaTitle: "Leadership Principles Training | EduCorp LMS",
      metaDescription:
        "Develop your managerial framework and scale your leadership style with standard delegation systems.",
      canonicalUrl: "https://educorp.edu/courses/leadership-principles",
      keywords: "Leadership, Management, Corporate Soft Skills",
      ogImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KM6-T2A90avloq9FKPTn1I8uC1bi9sgHEymvVq9qTDaUA_de_rm5ZIIJ2mn2Fp4yAlM_szZS_JXUTwHxdhn3-O7JKs1yxdAI7gANCoyqUU6YnkRFjt8Nns_5afXjA2I2hDlUelOvBZ9Ssbgn9kRnUB1FwdLbexbWeoJDen10QrE2b-LUG57IkZeZhpgA2txG0fpe80QbdvQhgFXr1l9U4WQopzwzv_5l7IYcL4N_eJ5HnZ-rWK8UszpPcUPclaaXvGQp-gUwUBo",
      ogTitle: "Leadership Principles Guide",
      ogDescription:
        "Scale core delegation structures inside your engineering teams.",
      xCardType: "Large Summary Card",
    },
  },
  {
    id: 3,
    title: "GDPR & Data Privacy",
    slug: "gdpr-data-privacy",
    category: "Compliance & Ethics",
    description:
      "Comprehensive training on global data privacy regulations and compliance requirements for enterprise-level operations.",
    status: "Active",
    duration: "2.5 Hours",
    learnersCount: 528,
    difficulty: "Advanced",
    language: "English, French",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgovRZ3nxsBv-vmYZOfg3255xRZ2XX0Uv4C7MZqz-rH3faa35mnUp2_S61c405DxIo0SCPH1LR_MmFOSoTMnxRp85U0pqLddPah3C7DsYLraKWC8shX0M7lW2uT-cm5thokwxDpCp2cimMnevOTHzuBfGB9NBiW4MlbuOhq-8EvtQyvWWhf2iO1cRDj3IAo-LDqQtaH6K9SAfdVdTCsvpbfift5N2OZOADExaTmyf-iAQSvCQj_-Y_EF1Uul4xO_0VbkHFdDQFEhI",
    modules: [],
    seo: {
      indexInSearch: true,
      metaTitle: "GDPR & Data Privacy Essentials | EduCorp LMS",
      metaDescription:
        "Enterprise compliance certification. Protect customer metrics under international legal boundaries.",
      canonicalUrl: "https://educorp.edu/courses/gdpr-data-privacy",
      keywords: "GDPR, Compliance, Legal Privacy, Policy",
      ogImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KM6-T2A90avloq9FKPTn1I8uC1bi9sgHEymvVq9qTDaUA_de_rm5ZIIJ2mn2Fp4yAlM_szZS_JXUTwHxdhn3-O7JKs1yxdAI7gANCoyqUU6YnkRFjt8Nns_5afXjA2I2hDlUelOvBZ9Ssbgn9kRnUB1FwdLbexbWeoJDen10QrE2b-LUG57IkZeZhpgA2txG0fpe80QbdvQhgFXr1l9U4WQopzwzv_5l7IYcL4N_eJ5HnZ-rWK8UszpPcUPclaaXvGQp-gUwUBo",
      ogTitle: "GDPR & Data Privacy Framework",
      ogDescription:
        "Ensure enterprise data meets international sovereignty criteria.",
      xCardType: "Large Summary Card",
    },
  },
  {
    id: 4,
    title: "Diversity & Inclusion",
    slug: "diversity-inclusion",
    category: "Leadership & Management",
    description:
      "Building a more inclusive workplace through awareness, empathy training, and structural organizational changes.",
    status: "Active",
    duration: "3.0 Hours",
    learnersCount: 1040,
    difficulty: "Beginner",
    language: "English",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCk-9g2-SCgyxES8a_gljeTod4afvq5rOE8ipF_cUcJe_VuikfudqC3_zqGNQZ9Zh5hxxJx5MHj2k2NpCfYak74bvGlPNHp46ij4rP1XpivpFzsYparHZV-EG5Os88IeHCpN9lArZMw7X-H7URc5GC0hZ2rQl7XZnpByUZ5aslMsB73_M8VXyJ4JWxx8ewmhNeTdZABA3SHf5T2dHD50NeU2-eJjrDBQcF6Tp1U9pFaRXTzALZiajGIsU4loE_5tzfN6EAU9CLchiU",
    modules: [],
    seo: {
      indexInSearch: true,
      metaTitle: "Diversity & Inclusion Fundamentals | EduCorp LMS",
      metaDescription:
        "Nurture high-collaboration cultures with active inclusivity exercises and safe communication styles.",
      canonicalUrl: "https://educorp.edu/courses/diversity-inclusion",
      keywords: "Inclusion, HR Policy, Work Culture",
      ogImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KM6-T2A90avloq9FKPTn1I8uC1bi9sgHEymvVq9qTDaUA_de_rm5ZIIJ2mn2Fp4yAlM_szZS_JXUTwHxdhn3-O7JKs1yxdAI7gANCoyqUU6YnkRFjt8Nns_5afXjA2I2hDlUelOvBZ9Ssbgn9kRnUB1FwdLbexbWeoJDen10QrE2b-LUG57IkZeZhpgA2txG0fpe80QbdvQhgFXr1l9U4WQopzwzv_5l7IYcL4N_eJ5HnZ-rWK8UszpPcUPclaaXvGQp-gUwUBo",
      ogTitle: "Diversity & Inclusion Principles",
      ogDescription:
        "Foster higher retention by deploying collaborative culture safeguards.",
      xCardType: "Large Summary Card",
    },
  },
  {
    id: 5,
    title: "Advanced Project Management",
    slug: "advanced-project-management",
    category: "Software Development",
    description:
      "Scaling agile methodologies for large enterprise projects, resource forecasting, and risk mitigation strategies.",
    status: "Active",
    duration: "12.0 Hours",
    learnersCount: 785,
    difficulty: "Advanced",
    language: "English",
    thumbnailUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbFOfqUHCTLGTaHCnZG-9_cXC4fYAer7UvrBTkrjJpXC4fYAer7UvrBTkrjJpCxpyFdTAxTrPykJ_ng5jFgDy7CcmPXMxqu33fAUoL6JOrLSZ1BO8KuFiLkNn-UEyPtz2AFIiar7iQKMkrwFBPnFH7vZs09A0IdAcu0fFeH049MAlhdI2jpKWFkntmbiM8_fP3qpLpWFxOc61AKJq-KmTpSPVyiTi9kztzdB7XVVVAqEQyWEs_92HsO_EuiO-Y-nDER0fRooW_aMhe-hyw1EjGrwel9yzVIQ",
    modules: [],
    seo: {
      indexInSearch: true,
      metaTitle: "Advanced Project Management Certification | EduCorp LMS",
      metaDescription:
        "Scale scrum, establish portfolio risk assessments, and streamline product development workflows.",
      canonicalUrl: "https://educorp.edu/courses/advanced-project-management",
      keywords: "Agile, Portfolio, Scrum, Forecasting",
      ogImage:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD8KM6-T2A90avloq9FKPTn1I8uC1bi9sgHEymvVq9qTDaUA_de_rm5ZIIJ2mn2Fp4yAlM_szZS_JXUTwHxdhn3-O7JKs1yxdAI7gANCoyqUU6YnkRFjt8Nns_5afXjA2I2hDlUelOvBZ9Ssbgn9kRnUB1FwdLbexbWeoJDen10QrE2b-LUG57IkZeZhpgA2txG0fpe80QbdvQhgFXr1l9U4WQopzwzv_5l7IYcL4N_eJ5HnZ-rWK8UszpPcUPclaaXvGQp-gUwUBo",
      ogTitle: "Advanced Project Management Systems",
      ogDescription:
        "Ensure programmatic execution with predictive project metrics.",
      xCardType: "Large Summary Card",
    },
  },
];
