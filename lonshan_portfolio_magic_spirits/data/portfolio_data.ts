// ─── portfolio_data.ts ────────────────────────────────────────────────────────
//
// Single source of truth for all portfolio content.
// Edit this file to update the website — no need to touch UI components.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PersonalInfo {
  name: string;
  displayName: string;       // short name shown in hero
  title: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  bullets: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  categories: ('web' | 'mobile')[];
  link: string;
  symbol: string;
}

export interface SkillGroup {
  label: string;
  symbol: string;
  skills: { name: string; level: number }[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
}

export interface Language {
  name: string;
  level: string;
}

// ─── Personal Info ────────────────────────────────────────────────────────────

export const PERSONAL_INFO: PersonalInfo = {
  name:        'Lon Shan',
  displayName: 'Lon Shan',
  title:       'Software Engineer',
  summary:
    'Software Engineer with 3+ years of experience building mobile and full-stack applications. Experienced in developing production systems, building applications from scratch, and delivering projects on time. Proficient in modern frameworks and AI-assisted development workflows to improve productivity and software quality.',
  location:  'Bangkok 10260, Thailand',
  email:     'lonshan3010@gmail.com',
  phone:     '(+66) 0641618200',
  website:   'https://lonshan.com',
  linkedin:  'https://linkedin.com/in/lon-shan-336699db',
  github:    'https://github.com/lonshanworld',
};

// ─── Work Experience ──────────────────────────────────────────────────────────

export const EXPERIENCES: Experience[] = [
  {
    role:    'Mid-Level Full-Stack Developer',
    company: 'Singtecs Co., Ltd (Singapore) — Remote',
    period:  'Jan 2024 – Dec 2025',
    description:
      'Developed production applications using React, Next.js, Flutter, React Native and backend services with Node.js (NestJS, Express.js) and Laravel.',
    bullets: [
      'Designed and implemented APIs, database structures (MySQL, MongoDB, PostgreSQL), and system workflows for internal and clinical platforms.',
      'Built cross-platform features for web and mobile with consistent data integration and end-to-end delivery.',
      'Integrated AI-powered chat and automation features into internal tools.',
      'Maintained and optimised production systems including debugging, performance tuning, and feature enhancements.',
    ],
  },
  {
    role:    'Cross-Platform / Frontend Developer',
    company: 'Smthgood Co. (Singapore) — Remote',
    period:  'Oct 2023 – Jan 2025',
    description:
      'Migrated an existing Flutter mobile application into a scalable web platform using Next.js.',
    bullets: [
      'Built seller dashboards and admin systems with improved workflows and usability.',
      'Integrated frontend systems with backend APIs and improved data flow.',
      'Managed deployment pipelines and infrastructure using AWS and CI/CD (GitHub Actions, GitLab CI).',
      'Contributed to system architecture and performance optimisation.',
    ],
  },
  {
    role:    'Flutter Developer',
    company: 'EfficientSoft Co., Ltd — Onsite',
    period:  'Jan 2023 – Aug 2023',
    description:
      'Built QuickFood Rider and QuickFood Merchant mobile applications from scratch using Flutter, deployed to Google Play Store and App Store.',
    bullets: [
      'Implemented authentication, order management, support messaging, and navigation.',
      'Integrated backend APIs for payments, chat-messaging, and platform services.',
      'Implemented location tracking and real-time communication using WebSocket.',
      'Optimised application performance and implemented deep linking for navigation.',
    ],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────────────

export const PROJECTS: Project[] = [
  {
    id:    'living-spirit-world',
    title: 'AI-Powered Living Spirit World Portfolio',
    description:
      'Built an interactive portfolio world with elemental spirit characters, magic spell effects, real-time interactions, and AI-driven dialogue to turn a traditional resume site into an immersive product experience.',
    tech:       ['Next.js', 'NestJS', 'Socket.IO', 'Framer Motion', 'R3F', 'Generative AI'],
    categories: ['web'],
    link:       'https://lonshan.com',
    symbol:     '✨',
  },
  {
    id:    'smart-retail',
    title: 'Business Central — Smart Retail Platform',
    description:
      'Built a multi-portal retail management system for merchants, staff, and admins from scratch to production. Features POS workflows, dashboards, Bluetooth thermal printing (Classic + BLE), offline-first architecture with sync queue, and AI-assisted business analytics.',
    tech:       ['Flutter', 'Go Fiber', 'Next.js', 'PostgreSQL', 'AI'],
    categories: ['web', 'mobile'],
    link:       'https://smartretail.lonshan.com',
    symbol:     '🏪',
  },
  {
    id:    'pistil',
    title: 'Pistil — Women\'s Health Platform',
    description:
      'Contributed to frontend and full-stack development across mobile and web. Built user interfaces for customer, clinic, pharmacy, and admin systems. Developed and integrated APIs, improved system workflows and data handling.',
    tech:       ['Laravel', 'React Native', 'Express.js', 'MySQL'],
    categories: ['web', 'mobile'],
    link:       'https://pistil.io',
    symbol:     '🌸',
  },
  {
    id:    'singbox-manager',
    title: 'Singbox Manager',
    description:
      'A lightweight web panel for managing Sing-box VPN servers. Handles configuration generation, client management, and deployment. Designed for low-resource VPS environments.',
    tech:       ['Go', 'net/http', 'VPS'],
    categories: ['web'],
    link:       '',
    symbol:     '🔐',
  },
  {
    id:    'quickfood',
    title: 'QuickFood Merchant & Rider',
    description:
      'Developed the QuickFood merchant and rider mobile applications from scratch with core delivery workflows, real-time WebSocket communication, location tracking, and production-ready store deployments.',
    tech:       ['Flutter', 'WebSocket', 'Real-time', 'Mobile'],
    categories: ['mobile'],
    link:       'https://apps.apple.com/us/app/quick-food-merchant/id6477524082',
    symbol:     '🛵',
  },
];

// ─── Skills ───────────────────────────────────────────────────────────────────
//
// Level is a percentage (0–100). Adjust as you see fit.

export const SKILLS: SkillGroup[] = [
  {
    label:  'Mobile & Frontend',
    symbol: '📱',
    skills: [
      { name: 'Flutter / Dart',      level: 90 },
      { name: 'React Native',        level: 82 },
      { name: 'Next.js / React',     level: 88 },
      { name: 'TypeScript / JS',     level: 90 },
      { name: 'Tailwind CSS',        level: 85 },
    ],
  },
  {
    label:  'Backend & Databases',
    symbol: '⚙️',
    skills: [
      { name: 'Node.js / NestJS',    level: 88 },
      { name: 'Go / Go Fiber',       level: 75 },
      { name: 'Laravel / PHP',       level: 78 },
      { name: 'PostgreSQL / MySQL',  level: 82 },
      { name: 'MongoDB / Firebase',  level: 80 },
    ],
  },
  {
    label:  'DevOps & Cloud',
    symbol: '☁️',
    skills: [
      { name: 'Docker / CI/CD',      level: 80 },
      { name: 'AWS (EC2, S3, Lambda)', level: 75 },
      { name: 'Nginx / Redis',       level: 76 },
      { name: 'VPS (DO, OVH, Ionos)', level: 80 },
      { name: 'Vercel / Render',     level: 85 },
    ],
  },
];

// ─── Education ────────────────────────────────────────────────────────────────

export const EDUCATION: Education[] = [
  {
    degree:      'B.Sc. (Hons) Computing — NCC Education',
    institution: 'KMD University',
    period:      '2023 – 2025',
  },
];

// ─── Languages ────────────────────────────────────────────────────────────────

export const LANGUAGES: Language[] = [
  { name: 'Myanmar', level: 'Native' },
  { name: 'English', level: 'C1' },
  { name: 'Japanese', level: 'N5' },
];

// ─── Contact links (derived from PERSONAL_INFO for convenience) ───────────────

export const CONTACT_LINKS = [
  {
    label:  'Email',
    value:  PERSONAL_INFO.email,
    href:   `mailto:${PERSONAL_INFO.email}`,
    symbol: '📧',
  },
  {
    label:  'GitHub',
    value:  'github.com/lonshanworld',
    href:   PERSONAL_INFO.github,
    symbol: '🐙',
  },
  {
    label:  'LinkedIn',
    value:  'linkedin.com/in/lon-shan-336699db',
    href:   PERSONAL_INFO.linkedin,
    symbol: '💼',
  },
  {
    label:  'Website',
    value:  'lonshan.com',
    href:   PERSONAL_INFO.website,
    symbol: '🌐',
  },
];
