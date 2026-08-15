'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, ArrowUp } from 'lucide-react';
import { Whatsapp, Linkedin, Twitter } from './Icons';

const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Our Process', href: '#services' },
    { label: 'Reviews', href: '#testimonials' },
  ],
  services: [
    { label: 'Custom Web Application', href: '#services' },
    { label: 'UI/UX Design', href: '#services' },
    { label: 'E-Commerce Solutions', href: '#projects' },
    { label: 'Enterprise Systems', href: '#projects' },
  ],
  resources: [
    { label: 'Case Studies', href: '#projects' },
    { label: 'Our Works', href: '#projects' },
    { label: 'Contact Us', href: '#contact' },
    { label: 'Get a Quote', href: '#contact' },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const top = el.offsetTop - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="w-full bg-[#040d0d] light:bg-zinc-950 relative z-10 overflow-hidden">
      
      {/* Giant Brand Logo — onefolk.in style */}
      <div className="w-full border-t border-white/5 light:border-white/10 pt-10 md:pt-16 pb-8 md:pb-10 px-4 md:px-8 relative overflow-hidden">
        {/* Subtle teal glow behind text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[60%] h-[60%] rounded-full bg-primary/5 blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-display font-black leading-none tracking-tighter text-white/90 light:text-white select-none"
            aria-hidden="true"
            style={{ fontSize: 'clamp(3.5rem, 14vw, 10rem)' }}
          >
            ZENTRO
          </h2>
          <p className="text-xs md:text-sm text-white/40 light:text-white/50 font-medium mt-2 ml-0.5 tracking-wide">
            Connecting Networks. Powering Possibilities.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] light:border-white/10 mx-4 md:mx-8" />

      {/* Main Footer Grid — 2 cols on mobile, 4 cols on desktop */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
        
        {/* Company */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 light:text-white/40 mb-5">
            Company
          </h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.company.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/60 light:text-white/70 hover:text-white light:hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 light:text-white/40 mb-5">
            Services
          </h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.services.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/60 light:text-white/70 hover:text-white light:hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 light:text-white/40 mb-5">
            Resources
          </h3>
          <ul className="space-y-3">
            {FOOTER_LINKS.resources.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-sm text-white/60 light:text-white/70 hover:text-white light:hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 light:text-white/40 mb-5">
            Connect
          </h3>

          {/* Social Icons */}
          <div className="flex items-center gap-2.5 mb-6">
            <a
              href="https://wa.me/15550199"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-9 h-9 rounded-full border border-white/10 light:border-white/20 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <Whatsapp className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="w-9 h-9 rounded-full border border-white/10 light:border-white/20 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="w-9 h-9 rounded-full border border-white/10 light:border-white/20 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@zentronetworks.com"
              aria-label="Email"
              className="w-9 h-9 rounded-full border border-white/10 light:border-white/20 flex items-center justify-center text-white/50 hover:text-accent hover:border-accent/40 transition-all duration-200"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          {/* Contact Details */}
          <div className="space-y-2">
            <a
              href="mailto:hello@zentronetworks.com"
              className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-200 group"
            >
              <Mail className="w-3.5 h-3.5 text-accent/70 group-hover:text-accent shrink-0" />
              hello@zentronetworks.com
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors duration-200 group"
            >
              <Phone className="w-3.5 h-3.5 text-accent/70 group-hover:text-accent shrink-0" />
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/[0.06] light:border-white/10 mx-4 md:mx-8" />

      {/* Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-white/30 light:text-white/40">
          © {new Date().getFullYear()} Zentro Networks. All rights reserved.
        </p>

        <div className="flex items-center gap-5">
          <a
            href="#"
            className="text-xs text-white/30 light:text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs text-white/30 light:text-white/40 hover:text-white/70 transition-colors duration-200"
          >
            Terms &amp; Conditions
          </a>
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-8 h-8 rounded-full border border-white/10 light:border-white/20 flex items-center justify-center text-white/40 hover:text-white hover:border-white/40 transition-all duration-200 cursor-pointer"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

