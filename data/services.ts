import { Service } from '../types';

export const services: Service[] = [
  {
    id: 'custom-web-apps',
    title: 'Custom Web Applications',
    description: 'End-to-end development of interactive, secure, and fully responsive web systems built with React and Next.js.',
    benefits: [
      'Tailored architectural design to scale with your business growth.',
      'Optimized Core Web Vitals securing high ranking on search results.',
      'Clean state management and offline capability integrations.'
    ],
    iconName: 'Layout'
  },
  {
    id: 'ai-integrations',
    title: 'AI & LLM Integrations',
    description: 'Supercharge your existing platform or build new products with AI assistants, vector searches, and LLM automation.',
    benefits: [
      'Retrieval-Augmented Generation (RAG) using your custom company files.',
      'Automated semantic categorization and high-speed data extraction.',
      'Optimal system Prompts setup reducing LLM token consumption costs.'
    ],
    iconName: 'BrainCircuit'
  },
  {
    id: 'backend-apis',
    title: 'High-Performance APIs & Systems',
    description: 'Robust backend development using Node.js, Go, or Python to process large data loads with low latency.',
    benefits: [
      'Database normalization, structural caching, and speed optimizations.',
      'Secure token authorization (OAuth2/JWT) and API key dashboards.',
      'Fault-tolerant message queues handling background requests.'
    ],
    iconName: 'Cpu'
  },
  {
    id: 'performance-seo',
    title: 'Performance & Website Redesign',
    description: 'Convert slow legacy systems into ultra-fast static or SSR pages that look and feel like premium modern software.',
    benefits: [
      'Lighthouse performance scores bumped to 95+ guarantees.',
      'Complete responsiveness audits across all mobile and desktop widths.',
      'Refining layouts using premium glassmorphism and subtle animations.'
    ],
    iconName: 'Zap'
  }
];
