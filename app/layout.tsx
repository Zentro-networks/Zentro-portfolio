import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';

import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';
import CommandPalette from '../components/shared/CommandPalette';
import LenisProvider from '../components/shared/LenisProvider';

import ThreeBackground from '../components/shared/ThreeBackground';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#071415',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: 'Zentro Networks',
    template: '%s | Senior Full-Stack & AI Engineer',
  },
  description: 'Agency-grade portfolio of a senior developer specializing in Next.js, high-throughput APIs, database optimization, and AI RAG systems.',
  metadataBase: new URL('https://portfolio-agency.example.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Zentro Networks',
    description: 'Agency-grade portfolio of a senior developer specializing in Next.js, high-throughput APIs, database optimization, and AI RAG systems.',
    url: 'https://portfolio-agency.example.com',
    siteName: 'Developer Portfolio',
    images: [
      {
        url: '/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zentro Networks',
    description: 'Agency-grade portfolio of a senior developer specializing in Next.js, high-throughput APIs, database optimization, and AI RAG systems.',
    images: ['/og-image.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        {/* Anti-flash scripts for local storage themes */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })()
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#071415] light:bg-[#F4F7F3] text-white light:text-zinc-950 font-sans selection:bg-accent/30 selection:text-white transition-colors duration-300">
        {/* Generative Noise Overlay */}
        <div className="noise-overlay" />
        
        {/* 3D Network Background — contains canvas + glow layers */}
        <ThreeBackground />

        {/* Global smooth scroll wrapper */}
        <LenisProvider>
          <Navbar />
          <main className="flex-1 w-full relative z-10">{children}</main>
          <Footer />
          
          <CommandPalette />
        </LenisProvider>
      </body>
    </html>
  );
}
