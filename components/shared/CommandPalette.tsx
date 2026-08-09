'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, Hash, Star, Mail, Laptop } from 'lucide-react';
import { Whatsapp, Linkedin } from './Icons';
import { projects } from '../../data/projects';

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle shortcuts: Ctrl + J toggles palette, Ctrl + K scrolls through sections
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (e.repeat) return;

        // If not on home page, redirect home first
        if (window.location.pathname !== '/') {
          router.push('/');
          return;
        }

        const sectionIds = ['hero', 'about', 'services', 'testimonials', 'contact'];
        let nextSectionEl: HTMLElement | null = null;

        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Find the first section whose top boundary is below the viewport top with a threshold of 50px
            if (rect.top > 50) {
              nextSectionEl = el;
              break;
            }
          }
        }

        // If we are at the last section or near the bottom, wrap around to hero
        if (!nextSectionEl) {
          nextSectionEl = document.getElementById(sectionIds[0]);
        }

        if (nextSectionEl) {
          nextSectionEl.setAttribute('tabindex', '-1');
          nextSectionEl.focus({ preventScroll: true });

          const targetTop = nextSectionEl.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: targetTop,
            behavior: 'smooth',
          });
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSearch('');
      setActiveIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Command items definition
  const sections = [
    { name: 'About Section', action: () => scrollToSection('about'), icon: Hash },
    { name: 'Services Section', action: () => scrollToSection('services'), icon: Hash },
    { name: 'Testimonials Section', action: () => scrollToSection('testimonials'), icon: Hash },
    { name: 'Contact Section', action: () => scrollToSection('contact'), icon: Hash },
  ];

  const projectItems = projects.map((p) => ({
    name: `View Project: ${p.title}`,
    action: () => {
      setIsOpen(false);
      router.push(`/projects/${p.slug}`);
    },
    icon: Star,
  }));

  const utils = [
    {
      name: 'Toggle Dark / Light Theme',
      action: () => {
        const isLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        setIsOpen(false);
      },
      icon: Laptop,
    },
  ];

  const socials = [
    { name: 'WhatsApp Profile', action: () => window.open('https://wa.me/15550199', '_blank'), icon: Whatsapp },
    { name: 'LinkedIn Profile', action: () => window.open('https://linkedin', '_blank'), icon: Linkedin },
    { name: 'Email Developer', action: () => window.open('mailto:developer@example.com'), icon: Mail },
  ];

  const allItems = [...utils, ...projectItems, ...sections, ...socials];

  // Filter items
  const filteredItems = allItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToSection = (id: string) => {
    setIsOpen(false);
    // If not on home page, redirect home first
    if (window.location.pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation inside list
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          filteredItems[activeIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredItems]);

  // Adjust scroll when index changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        const container = scrollContainerRef.current;
        const activeTop = activeEl.offsetTop;
        const activeBottom = activeTop + activeEl.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.offsetHeight;

        if (activeTop < containerTop) {
          container.scrollTop = activeTop;
        } else if (activeBottom > containerBottom) {
          container.scrollTop = activeBottom - container.offsetHeight;
        }
      }
    }
  }, [activeIndex]);

  return (
    <>
      {/* Floating J Icon Indicator in corner (optional helper) */}
      <div className="fixed bottom-4 right-4 z-40 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs text-muted hover:text-white transition-all pointer-events-auto"
        >
          <span>Press</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[10px]">Ctrl + J</kbd>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg mx-4 rounded-xl border border-zinc-800 bg-zinc-950/90 shadow-2xl overflow-hidden glass-panel flex flex-col max-h-[50vh]"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/30">
                <Search className="w-5 h-5 text-muted shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Type a command or search projects..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setActiveIndex(0);
                  }}
                  className="w-full bg-transparent border-0 outline-none text-sm text-white placeholder-zinc-500 focus:ring-0"
                />
                <kbd className="px-1.5 py-0.5 text-[10px] rounded bg-zinc-800 border border-zinc-700 text-muted">ESC</kbd>
              </div>

              {/* Items List */}
              <div
                ref={scrollContainerRef}
                className="overflow-y-auto flex-1 p-2 space-y-0.5"
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                          isActive
                            ? 'bg-primary text-white font-medium'
                            : 'text-muted hover:bg-zinc-900/50 hover:text-white'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-muted'}`} />
                        <span>{item.name}</span>
                      </button>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-zinc-600">
                    No results found for &ldquo;{search}&rdquo;
                  </div>
                )}
              </div>

              {/* Footer Helper */}
              <div className="flex justify-between items-center px-4 py-2 border-t border-zinc-900/60 bg-zinc-950 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  Use ↑↓ keys to navigate, <kbd className="px-1 rounded bg-zinc-900 text-zinc-400">Enter</kbd> to select
                </span>
                <span>{filteredItems.length} options</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
