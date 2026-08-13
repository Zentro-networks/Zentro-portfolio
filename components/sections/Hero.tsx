'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Code2, Sparkles, Send } from 'lucide-react';

const ROLES = ['Full Stack Engineer', 'Software Architect', 'AI Integration Expert'];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Custom typing animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentRole = ROLES[roleIndex];
    const typingSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && displayedText === currentRole) {
      // Pause at full word
      timer = setTimeout(() => setIsDeleting(true), 2500);
    } else if (isDeleting && displayedText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    } else {
      timer = setTimeout(() => {
        setDisplayedText(
          isDeleting
            ? currentRole.substring(0, displayedText.length - 1)
            : currentRole.substring(0, displayedText.length + 1)
        );
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, roleIndex]);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Sub-header badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-wider text-accent font-semibold mb-6 border border-accent/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Crafting Production-Grade Systems
        </motion.div>

        {/* Display Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display font-bold text-5xl md:text-8xl tracking-tight text-white light:text-zinc-950 max-w-4xl"
        >
          <span className="bg-gradient-to-r from-primary via-blue-500 to-accent bg-clip-text text-transparent">
            Zentro Networks
          </span>
        </motion.h1>

        {/* Rotating Role typing animation 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="h-12 mt-6 flex items-center text-lg md:text-3xl font-display font-medium text-muted"
        >
          <span>I am a&nbsp;</span>
          <span className="text-white light:text-zinc-900 border-r-2 border-accent pr-1 font-semibold text-glow-accent">
            {displayedText}
          </span>
        </motion.div>
*/}
        {/* Brief value proposition */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-6 text-sm md:text-base text-muted max-w-xl leading-relaxed font-medium"
        >
          Building agency-grade web apps, high-throughput APIs, and vector-backed AI solutions that turn technical complexity into business revenue.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button
            onClick={() => handleScrollTo('services')}
            className="px-8 py-3.5 bg-white light:bg-zinc-900 text-[#09090b] light:text-white rounded-full font-bold text-xs hover:bg-[#00f5d4] hover:text-[#09090b] light:hover:bg-[#5146e5] light:hover:text-white transition-all shadow-xl shadow-white/5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Code2 className="w-4 h-4" />
            View Services
          </button>
          
          <button
            onClick={() => handleScrollTo('contact')}
            className="px-8 py-3.5 bg-primary hover:bg-primary/95 text-white rounded-full font-bold text-xs shadow-lg hover:shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Hire Me
          </button>

          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 border border-white/10 light:border-zinc-300 bg-zinc-950/40 hover:bg-zinc-900 light:hover:bg-zinc-100 text-white light:text-zinc-950 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Resume
          </a>
        </motion.div>
      </div>

      {/* Down indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted">
        <span className="text-[10px] uppercase tracking-wider font-semibold">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <ArrowDown className="w-4 h-4 text-accent" />
        </motion.div>
      </div>
    </section>
  );
}
