'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sun, Moon, Menu, X, FileText } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'About', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Load and apply theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (storedTheme === 'light') {
      setTheme('light');
      document.documentElement.classList.add('light');
    } else {
      setTheme('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Scroll spy & scrolled state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      if (pathname !== '/') return;

      const scrollPosition = window.scrollY + 120; // offset

      // Find which section is currently active
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger immediately
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({
        top,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'py-4 bg-[#09090b]/75 light:bg-[#ffffff]/75 backdrop-blur-md border-b border-white/5 light:border-black/5 shadow-lg'
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="font-display font-bold text-xl text-white light:text-zinc-950 flex items-center gap-1.5"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent relative" />
          <span>DEV.PORTFOLIO</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          <div className="flex bg-zinc-900/50 light:bg-zinc-100/80 p-1.5 rounded-full border border-white/5 light:border-black/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs transition-all font-medium ${
                    isActive
                      ? 'text-white light:text-zinc-950 bg-white/10 light:bg-black/10'
                      : 'text-muted hover:text-white light:hover:text-zinc-950'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Theme, Resume & Burger */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-white/5 light:border-black/5 bg-zinc-900/40 light:bg-zinc-100/50 text-muted hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800 light:hover:bg-zinc-200 transition-all pointer-events-auto"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Resume Trigger */}
          <a
            href="/resume.pdf"
            download
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-semibold shadow-lg hover:shadow-primary/20 transition-all cursor-pointer pointer-events-auto"
          >
            <FileText className="w-3.5 h-3.5" />
            Resume
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full border border-white/5 light:border-black/5 bg-zinc-900/40 light:bg-zinc-100/50 text-muted hover:text-white light:hover:text-zinc-950 lg:hidden pointer-events-auto"
            aria-label="Toggle Navigation menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden absolute top-full inset-x-0 bg-[#09090b]/95 light:bg-[#ffffff]/98 border-b border-white/5 light:border-black/5 shadow-2xl p-6 backdrop-blur-lg flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-all font-semibold ${
                    isActive
                      ? 'text-accent bg-zinc-900 light:bg-zinc-100'
                      : 'text-muted hover:text-white light:hover:text-zinc-950'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <a
            href="/resume.pdf"
            download
            className="flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/95 text-white rounded-lg text-sm font-semibold cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}
