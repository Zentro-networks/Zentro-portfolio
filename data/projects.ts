import { Project } from '../types';

// ==========================================
// CLIENT WORK PROJECT URL CONFIGURATION
// Replace these placeholders with your actual client URLs when available.
// ==========================================
export const PROJECT_URLS = {
  restaurant: 'https://restaurantapp-psi-beryl.vercel.app/',
  enterprise: 'https://building-web-zeta.vercel.app/',
  ecommerce: 'https://e-commerce-teal-nine-73.vercel.app/',
};

export const projects: Project[] = [
  {
    id: 'restaurant-web-page',
    slug: 'restaurant-web-page',
    title: 'Restaurant Web Page',
    subtitle: 'Premium Dining Experience & Smart Reservation System',
    description: 'An elegant, high-converting website for a fine dining restaurant, featuring a real-time table booking system, interactive digital menus, and reviews synchronization.',
    longDescription: 'Restaurant Web Page is a modern, high-performance web solution built for premium culinary venues. It offers customers an immersive visual dining experience, an easy-to-use menu browser, and an automated reservation manager. Administrators get a dashboard to oversee seating arrangements, menu availability, and peak-hour reservation metrics.',
    problem: 'Traditional restaurant websites are often slow, not optimized for mobile browsing, and rely on clunky third-party reservation systems that charge hefty per-cover commission fees.',
    solution: 'Created a static-generation first web application using Next.js for sub-second page loads, integrated with a custom database-backed booking API and local confirmation notifications.',
    architecture: `1. Frontend: Next.js (App Router) + Tailwind CSS + Framer Motion.
2. Booking Server: Serverless Next.js API Routes.
3. Database: Supabase PostgreSQL for reservation tracking and menu structures.`,
    features: [
      'Interactive dynamic menu filtering by dietary preferences.',
      'Real-time table reservation wizard with instant SMS verification.',
      'Responsive visual layout optimized for high-quality food galleries.'
    ],
    images: [
      '/projects/restaurant.webp'
    ],
    tags: ['Next.js', 'TailwindCSS', 'PostgreSQL', 'Framer Motion'],
    category: 'Web Application',
    githubUrl: '',
    liveUrl: PROJECT_URLS.restaurant,
    outcome: 'Helped the client eliminate third-party booking commissions, resulting in a 15% increase in direct reservation profit margins.',
    challenges: 'Ensuring high-speed image rendering for high-resolution food assets without damaging SEO or Core Web Vitals performance.',
    lessonsLearned: 'Leveraged Next.js Image component optimized next-generation formats (AVIF/WebP) and utilized blur-up placeholders to deliver seamless visual loading.'
  },
  {
    id: 'enterprise',
    slug: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Scalable Business Portal & Automated Workflow Engine',
    description: 'A secure, HIPAA-compliant enterprise web portal facilitating multi-department employee collaboration, document management, and client onboarding workflows.',
    longDescription: 'The Enterprise platform provides a centralized workspace for mid-to-large scale businesses. It integrates single sign-on (SSO) authentication, role-based access control, file sharing with audit trails, and automatic notification dispatch. The system streamlines customer relations and internal workflow executions.',
    problem: 'Corporate clients suffer from fragmented toolchains, where document sharing, security checks, and client pipelines are handled in separate, insecure web interfaces.',
    solution: 'Designed a unified enterprise dashboard with strict data encryption, role-based page visibility, and real-time activity logs.',
    architecture: `1. Frontend: Next.js Client Layer.
2. Backend Services: Node.js API gateway.
3. Cache & Database: Redis + PostgreSQL.
4. Security: JWT token controls and SSL data encryption.`,
    features: [
      'Role-based dashboards with separate views for admins, managers, and clients.',
      'Document upload pipeline with automated file metadata categorization.',
      'Integrations with corporate Slack/Teams channels for automated workflow logs.'
    ],
    images: [
      '/projects/enterprise.webp'
    ],
    tags: ['Next.js', 'Node.js', 'PostgreSQL', 'Redis'],
    category: 'Enterprise Systems',
    githubUrl: '',
    liveUrl: PROJECT_URLS.enterprise,
    outcome: 'Consolidated 4 separate SaaS tools into a single platform, cutting software licensing expenses by 35% and saving administration hours.',
    challenges: 'Optimizing database performance for large, complex queries tracking thousands of multi-tier employee document permissions.',
    lessonsLearned: 'Implemented deep indexing and materialized views in PostgreSQL, reducing query latency by 45% during peak usage times.'
  },
  {
    id: 'ecommerce',
    slug: 'ecommerce',
    title: 'E-Commerce',
    subtitle: 'High-Conversion Online Store & Stripe Checkout Gateway',
    description: 'A fast-loading digital commerce storefront with instantaneous product searching, shopping cart syncing, and secure Stripe payment processing.',
    longDescription: 'This E-Commerce solution leverages static-site generation (SSG) with incremental static regeneration (ISR) to load product catalogs in under 100 milliseconds. It features a responsive layout, a global shopping cart, checkout validations, and a webhook system updating order statuses inside databases.',
    problem: 'Slow loading times on online store product pages lead to cart abandonment and direct loss of potential transaction sales.',
    solution: 'Engineered an ultra-fast Next.js store with static product page generation, coupled with global edge caching and Stripe Checkout webhook integrations.',
    architecture: `1. Storefront Client: Next.js + Tailwind CSS.
2. Payment Gateway: Stripe Checkout Integration.
3. DB & Webhook: Supabase Database + Serverless background webhook handlers.`,
    features: [
      'Lightning-fast client-side product catalog filtering and search autocomplete.',
      'Global shopping cart state persistence with offline recovery.',
      'Safe, webhook-verified Stripe transaction invoice processing.'
    ],
    images: [
      '/projects/ecommerce.webp'
    ],
    tags: ['Next.js', 'Stripe API', 'TailwindCSS', 'Supabase'],
    category: 'E-Commerce',
    githubUrl: '',
    liveUrl: PROJECT_URLS.ecommerce,
    outcome: 'Drove customer average session durations up by 25% and lowered checkout cart abandonment by 18% in the first month.',
    challenges: 'Handling race conditions where multiple customers attempt to purchase the final remaining inventory item at the exact same split-second.',
    lessonsLearned: 'Utilized database transactions and row lockouts in Supabase to secure inventory counts before confirming final Stripe transactions.'
  }
];
