import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'omnibilling-ai',
    slug: 'omnibilling-ai',
    title: 'OmniBilling AI',
    subtitle: 'Next-Gen Supermarket POS & Predictive Inventory',
    description: 'An AI-powered retail POS and inventory dashboard that speeds up cashier transactions and forecasts product demand using historical sales data.',
    longDescription: 'OmniBilling AI is a high-availability, dual-mode (online/offline) supermarket billing platform. It integrates a fast, bar-code friendly checkout system with a background demand-forecasting model. Cashed-out transactions are batched and synced to a centralized cloud PostgreSQL DB, which feeds a Python-based forecasting microservice to predict stock-outs before they happen.',
    problem: 'Supermarkets suffer from cashier delays during peak hours and lost revenue from either overstocking perishables or running out of high-demand items. Existing enterprise resource planning (ERP) systems are expensive, slow, and lack proactive insights.',
    solution: 'Built a lightweight client-side React POS that runs locally in the browser with IndexedDB sync, ensuring zero downtime even if internet drops. Backed this with a Python forecasting service that analyzes transaction history and seasonality, outputting restocking alerts.',
    architecture: `1. Frontend Client: Next.js (App Router) + Tailwind CSS + IndexedDB (for local checkout storage).
2. Backend Services: Node.js (Express/TS) for billing APIs, Python (FastAPI + Scikit-Learn) for time-series forecasting.
3. Database: PostgreSQL (Prisma ORM) for relational transactions, Redis for active caching.
4. Deployment: Docker containers orchestrated on AWS ECS.`,
    features: [
      'High-speed bar-code reader scanning integration with < 100ms item lookup.',
      'Auto-sync engine that pushes local offline invoices to cloud DB when network restores.',
      'AI demand forecasting using time-series linear regression and seasonal models.',
      'Beautiful dashboard displaying real-time revenue, low-stock warnings, and cashiers performance metrics.'
    ],
    images: [
      '/projects/billing-dashboard.webp',
      '/projects/billing-checkout.webp'
    ],
    tags: ['Next.js', 'PostgreSQL', 'FastAPI', 'IndexedDB', 'TailwindCSS'],
    category: 'Full-Stack & AI',
    githubUrl: 'https://github.com/example/omnibilling-ai',
    liveUrl: 'https://omnibilling-demo.example.com',
    outcome: 'Reduced cashier checkout queues by 40% and improved inventory forecasting accuracy by 28%, minimizing fresh food waste.',
    dbDesign: `Table "invoices" {
  id varchar [primary key]
  total_amount decimal
  cashier_id varchar
  created_at timestamp
  synced_to_cloud boolean
}
Table "invoice_items" {
  id varchar [primary key]
  invoice_id varchar [ref: > invoices.id]
  product_id varchar
  quantity int
  price decimal
}`,
    challenges: 'Ensuring absolute data consistency between offline cashier devices and the main database when concurrent syncs occurred at peak times.',
    lessonsLearned: 'Implemented a robust conflict-free replicated data type (CRDT) logic for offline sync and partitioned database IDs using ULIDs to eliminate collisions.'
  },
  {
    id: 'medisched-sync',
    slug: 'medisched-sync',
    title: 'Medisched Sync',
    subtitle: 'HIPAA-Compliant Patient Portal & Smart Scheduling',
    description: 'An enterprise healthcare dashboard enabling multi-clinic appointment booking, automated SMS patient notifications, and doctor calendars management.',
    longDescription: 'Medisched Sync was built to modernize patient intake for mid-size private practices. The solution provides separate, highly secure portals for patients, clinic administrators, and doctors. It utilizes a custom scheduling algorithm that resolves appointment conflicts dynamically, considering doctor shifts, clinic room availability, and treatment lengths.',
    problem: 'Clinics lose up to 15% of daily slots due to patient no-shows and face administrative blockages from overlapping manual bookings.',
    solution: 'Designed an interactive calendar interface that allows patients to select slots, sends automated WhatsApp/SMS reminders, and offers clinics an admin dashboard with real-time room traffic and scheduling suggestions.',
    architecture: `1. Frontend: Next.js + Framer Motion (interactive schedules) + Tailwind.
2. Backend: Next.js Server Actions + Twilio API (notifications) + Resend (email confirmations).
3. Database: Supabase (PostgreSQL with Row Level Security) ensuring HIPAA compliant data partitions.
4. Security: AES-256 encryption on patient notes.`,
    features: [
      'Interactive, drag-and-drop clinic scheduler optimized for rapid rescheduling.',
      'Multi-tenant setup separating data cleanly across multiple physical clinics.',
      'Automated SMS reminders and confirmation loops via Twilio API.',
      'Audit log tracking every record read/write for strict security compliance.'
    ],
    images: [
      '/projects/medisched-calendar.webp',
      '/projects/medisched-portal.webp'
    ],
    tags: ['React', 'Supabase', 'Twilio API', 'Framer Motion', 'TypeScript'],
    category: 'Enterprise Web Apps',
    githubUrl: 'https://github.com/example/medisched-sync',
    liveUrl: 'https://medisched-demo.example.com',
    outcome: 'Reduced appointment no-shows from 18% to under 3% and saved clinic staff over 20 hours of booking administration weekly.',
    dbDesign: `Table "appointments" {
  id uuid [primary key]
  patient_id uuid
  doctor_id uuid
  clinic_room_id uuid
  start_time timestamp
  status varchar // pending, confirmed, cancelled
}`,
    challenges: 'Managing high concurrency where multiple patients tried to book the same hot slot simultaneously while maintaining database performance.',
    lessonsLearned: 'Leveraged PostgreSQL database-level locks (SELECT FOR UPDATE) and transaction isolations to prevent double-booking at the database tier.'
  },
  {
    id: 'logisticshub-api',
    slug: 'logisticshub-api',
    title: 'LogisticsHub Routing API',
    subtitle: 'High-Throughput Spatial Routing & Real-time Webhooks',
    description: 'A robust, load-balanced routing API that calculates optimal paths for delivery fleets and dispatches dispatch updates via webhooks.',
    longDescription: 'LogisticsHub Routing API was built to serve third-party logistics firms. It processes delivery coordinates, performs routing optimizations based on traffic and fuel efficiency, and monitors fleet progress. It handles thousands of requests per second with microsecond latency.',
    problem: 'Commercial delivery fleets lose millions annually due to inefficient routes and delayed updates in delivery status dispatching.',
    solution: 'Created an optimized Go and Node-based microservice network running Dijkstra-based search algorithms. Added a Redis-backed webhook queue that retries delivery status updates to client servers with exponential backoff.',
    architecture: `1. API Layer: Go (Gin Framework) for high-performance spatial queries + Node.js for webhook administration.
2. Cache & Queue: Redis cluster for caching common route patterns + BullMQ for background job queueing.
3. Hosting: AWS API Gateway + Lambda (Serverless route processing).`,
    features: [
      'Sub-50ms routing calculations for up to 100 delivery checkpoints.',
      'Webhook engine with automatic retries, signature security headers, and logs.',
      'Developer portal detailing API logs, usage graphs, and API key management.'
    ],
    images: [
      '/projects/logisticshub-api.webp'
    ],
    tags: ['Go', 'Node.js', 'Redis', 'AWS Lambda', 'GraphQL'],
    category: 'Backend & Systems',
    githubUrl: 'https://github.com/example/logisticshub-api',
    outcome: 'Powering over 5,000 active delivery vehicles daily with a 99.99% uptime SLA.',
    dbDesign: `Table "webhooks" {
  id varchar [primary key]
  client_id varchar
  target_url varchar
  event_type varchar
  status varchar // active, suspended
}`,
    challenges: 'Handling heavy peaks of webhook dispatches during standard 5 PM delivery shifts without exhausting system memory or database connections.',
    lessonsLearned: 'Decoupled API queries from webhook emission using Redis as a buffer, ensuring API threads remained free to process incoming HTTP traffic.'
  },
  {
    id: 'insightdocs-rag',
    slug: 'insightdocs-rag',
    title: 'InsightDocs RAG',
    subtitle: 'AI-Powered PDF Semantic Search & Citation Engine',
    description: 'An AI researcher dashboard that processes PDF reports, index text chunks into vector spaces, and allows users to query files using natural language.',
    longDescription: 'InsightDocs RAG is a Retrieval-Augmented Generation dashboard designed for research teams. Users upload complex regulatory reports or technical specs, and the platform extracts layouts, tables, and paragraphs. It embeds these segments into a vector database, enabling precise, cited answers to complex technical queries.',
    problem: 'Analysts spend countless hours reading thousands of pages of reports to find simple compliance answers, often missing buried details.',
    solution: 'Developed an automated pipeline that parses PDF layouts, chunks content with overlap, embeds text using OpenAI text-embedding models, and answers prompts backed by exact page citations.',
    architecture: `1. Frontend: Next.js + React Markdown (for formatted responses) + Lucide.
2. AI Pipeline: Python + LangChain + OpenAI GPT-4o API.
3. Vector Store: Pinecone for fast, index-based similarity searches.
4. Storage: AWS S3 for secure document hosting.`,
    features: [
      'Multi-document upload with real-time parsing progress updates.',
      'Vector semantic search yielding relevant quotes with exact page numbers.',
      'Interactive chat panel showing citation links that highlight the text source.'
    ],
    images: [
      '/projects/insightdocs-chat.webp'
    ],
    tags: ['Python', 'Pinecone', 'LangChain', 'OpenAI', 'Next.js'],
    category: 'AI & Data Engineering',
    githubUrl: 'https://github.com/example/insightdocs-rag',
    liveUrl: 'https://insightdocs-demo.example.com',
    outcome: 'Boosted legal research speeds by 72% and eliminated manual citation checking for policy analysts.',
    dbDesign: `Table "documents" {
  id varchar [primary key]
  user_id varchar
  filename varchar
  s3_key varchar
  vector_index_status varchar // processing, completed, failed
}`,
    challenges: 'Managing large PDF documents with multi-column formats and complex tables which traditional chunking algorithms fail to parse correctly.',
    lessonsLearned: 'Implemented a layout-aware PDF parser (using PyMuPDF and vision parsing) that splits text chronologically based on visual headers rather than raw characters.'
  }
];
