import { Experience, Certificate } from '../types';

export const experiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Senior Full-Stack & AI Engineer',
    company: 'TechFlow Solutions',
    period: '2024 - Present',
    description: [
      'Led the transition of a legacy React application to Next.js 15 App Router, improving initial load speed by 35%.',
      'Architected and implemented a RAG-based search engine using LangChain and pgvector, boosting company search accuracy by 60%.',
      'Mentored 4 junior engineers and standardized strict TypeScript guidelines and automated GitHub CI/CD pipelines.'
    ],
    type: 'work'
  },
  {
    id: 'exp-2',
    role: 'Full-Stack Developer',
    company: 'CodeVantage Labs',
    period: '2021 - 2024',
    description: [
      'Built and maintained high-throughput REST/GraphQL APIs in Go and Node.js serving 2M+ daily requests.',
      'Designed and normalized PostgreSQL database structures, reducing P99 latency on heavy search queries from 1.2s to 85ms.',
      'Developed pixel-perfect, responsive client dashboards with Tailwind CSS and Redux Toolkit.'
    ],
    type: 'work'
  },
  {
    id: 'exp-3',
    role: 'Software Engineer Intern',
    company: 'InnovateCorp',
    period: '2020 - 2021',
    description: [
      'Collaborated in an agile team of 6 to write unit tests for Java Spring Boot APIs and React components.',
      'Migrated container configurations from local VM scripts to Docker, cutting onboarding setup time for new hires by 50%.'
    ],
    type: 'work'
  },
  {
    id: 'edu-1',
    role: 'Bachelor of Science in Computer Science',
    company: 'State University',
    period: '2017 - 2021',
    description: [
      'Graduated with Honors (GPA: 3.8/4.0).',
      'Specialized in Software Engineering, Database Management Systems, and Artificial Intelligence.'
    ],
    type: 'education'
  }
];

export const certificates: Certificate[] = [
  {
    id: 'cert-1',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services (AWS)',
    date: '2025',
    credentialUrl: 'https://aws.amazon.com',
    pdfUrl: '#'
  },
  {
    id: 'cert-2',
    title: 'MongoDB Certified Developer Associate',
    issuer: 'MongoDB Inc.',
    date: '2024',
    credentialUrl: 'https://mongodb.com',
    pdfUrl: '#'
  },
  {
    id: 'cert-3',
    title: 'Next.js Professional Certification',
    issuer: 'Vercel',
    date: '2023',
    credentialUrl: 'https://vercel.com',
    pdfUrl: '#'
  }
];
