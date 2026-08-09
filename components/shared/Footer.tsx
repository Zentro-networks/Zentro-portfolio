'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUp, Mail } from 'lucide-react';
import { Whatsapp, Linkedin, Twitter } from './Icons';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full bg-[#050507] light:bg-zinc-100 border-t border-zinc-900 light:border-zinc-200 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Info */}
        <div className="text-center md:text-left">
          <Link href="/" className="font-display font-bold text-lg text-white light:text-zinc-950">
            ZENTRO NETWORKS
          </Link>
          <p className="text-xs text-muted mt-2">
            © {new Date().getFullYear()} Agency-Grade Sotware Developer. All Rights Reserved.
          </p>
        </div>

        {/* Socials & Top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/15550199"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-zinc-900 light:bg-white text-muted hover:text-white light:hover:text-zinc-950 border border-zinc-800 light:border-zinc-300 transition-all hover:scale-110"
              aria-label="WhatsApp"
            >
              <Whatsapp className="w-4 h-4" />
            </a>
            <a
              href="mailto:developer@example.com"
              className="p-2.5 rounded-full bg-zinc-900 light:bg-white text-muted hover:text-white light:hover:text-zinc-950 border border-zinc-800 light:border-zinc-300 transition-all hover:scale-110"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-full bg-primary text-white shadow-lg hover:shadow-primary/20 transition-all hover:scale-110 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
