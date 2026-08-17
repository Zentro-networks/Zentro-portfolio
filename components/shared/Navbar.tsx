'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useLenis } from 'lenis/react';

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
  const [headerHeight, setHeaderHeight] = useState(72);
  const pathname = usePathname();
  const router = useRouter();
  const headerRef = useRef<HTMLElement>(null);
  const lenis = useLenis();

  // Measure the header height so the drawer can anchor exactly below it
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Lock / unlock Lenis scroll while mobile menu is open
  useEffect(() => {
    if (!lenis) return;
    if (isOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
    // Safety: always restore scroll on unmount
    return () => {
      lenis.start();
    };
  }, [isOpen, lenis]);

  // Close mobile menu on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

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
    <>
      {/* ── Header bar ───────────────────────────────────────────────────── */}
      {/* NOTE: No overflow-x-hidden here — it would clip the mobile drawer  */}
      <header
        ref={headerRef}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
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
            className="font-display font-bold text-base md:text-xl text-white light:text-zinc-950 flex items-center gap-1.5 shrink-0 justify-self-start cursor-pointer hover:opacity-80 transition-opacity duration-200 min-w-0"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute" />
            <span className="w-2.5 h-2.5 rounded-full bg-accent relative shrink-0" />
            {/* Always visible — no xs breakpoint (xs is not a standard Tailwind v4 breakpoint) */}
            <span className="truncate">ZENTRONETWORKS</span>
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

          {/* Right side — burger (mobile/tablet only, hidden at lg+) */}
          <div className="flex items-center justify-end">
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="p-2.5 rounded-full border border-white/10 light:border-black/10 bg-zinc-900/50 light:bg-zinc-100/60 text-muted hover:text-white light:hover:text-zinc-950 hover:border-white/20 transition-all lg:hidden pointer-events-auto"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-drawer"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────── */}
      {/*
        Rendered as a fixed element OUTSIDE the header so it is never clipped
        by the header's own overflow constraints. Anchored at `top: headerHeight`
        which is dynamically measured via ResizeObserver.
      */}
      <div
        id="mobile-nav-drawer"
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isOpen}
        style={{ top: `${headerHeight}px` }}
        className={`fixed inset-x-0 z-[49] lg:hidden transition-all duration-200 ease-in-out ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="bg-[#09090b]/96 light:bg-white/98 border-b border-white/5 light:border-black/5 shadow-2xl backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`px-4 py-3.5 rounded-lg text-sm font-semibold transition-all min-h-[48px] flex items-center select-none ${
                    isActive
                      ? 'text-accent bg-zinc-900/80 light:bg-zinc-100'
                      : 'text-muted hover:text-white light:hover:text-zinc-950 hover:bg-zinc-800/50 light:hover:bg-zinc-100/70 active:bg-zinc-800/80'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </div>
      </div>

      {/* ── Backdrop overlay ──────────────────────────────────────────────── */}
      {/* Dims the page behind the open menu and closes it on tap-outside     */}
      <div
        aria-hidden={true}
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-[48] lg:hidden bg-black/50 backdrop-blur-[2px] transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
    </>
  );
}
