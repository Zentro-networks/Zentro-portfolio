'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full rounded-xl glass-panel p-8 text-center border border-white/5 shadow-2xl relative"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 bg-zinc-900 border border-red-500/20 text-red-500 rounded-full">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>

        <h1 className="font-display font-bold text-7xl md:text-8xl text-white tracking-tight mt-4">
          404
        </h1>
        
        <h2 className="font-display font-bold text-base text-accent uppercase tracking-wider mt-2">
          Route Not Found
        </h2>
        
        <p className="text-xs text-muted mt-4 leading-relaxed">
          The requested system route does not exist or has been refactored. Please verify the URL path or return home.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary/95 text-white text-xs font-bold transition-all cursor-pointer shadow-lg hover:shadow-primary/10"
          >
            <Home className="w-3.5 h-3.5" />
            Home Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/10 hover:bg-zinc-900 text-white text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}
