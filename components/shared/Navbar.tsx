'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Services', id: 'services' },
  { label: 'Projects', id: 'projects' },
  { label: 'Reviews', id: 'testimonials' },
  { label: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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

  // Logo / company name — navigate to home, reset all transient UI state
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);       // close mobile menu
    setActiveSection('');   // clear active section indicator
    if (pathname === '/') {
      // Already on home — just scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navigate to home, then scroll to top after mount
      router.push('/');
      // scrollTo after a tick so the page has navigated
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 overflow-x-hidden ${scrolled
        ? 'py-3 md:py-4 bg-[#09090b]/80 light:bg-[#ffffff]/80 backdrop-blur-md border-b border-white/5 light:border-black/5 shadow-lg'
        : 'py-4 md:py-6 bg-transparent'
        }`}
    >
      {/* 3-column layout: logo left | nav centre | burger right */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-3 items-center">
        {/* Logo — left: clicking returns to top of Home, closes menu, resets UI state */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="font-display font-bold text-base md:text-xl text-white light:text-zinc-950 flex items-center gap-1.5 shrink-0 justify-self-start cursor-pointer hover:opacity-80 transition-opacity duration-200"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent relative" />
          <span className="hidden xs:inline sm:inline">ZENTRONETWORKS</span>
        </Link>

        {/* Desktop Navigation — centre column */}
        <nav className="hidden lg:flex items-center justify-center">
          <div className="flex bg-zinc-900/50 light:bg-zinc-100/80 p-1.5 rounded-full border border-white/5 light:border-black/5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs transition-all font-medium ${isActive
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

        {/* Right side — burger (mobile only) */}
        <div className="flex items-center justify-end">
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
                  className={`px-4 py-3 rounded-lg text-sm transition-all font-semibold min-h-[44px] flex items-center ${isActive
                    ? 'text-accent bg-zinc-900 light:bg-zinc-100'
                    : 'text-muted hover:text-white light:hover:text-zinc-950'
                    }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
