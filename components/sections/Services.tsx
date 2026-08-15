'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Layout, CheckCircle2 } from 'lucide-react';
import { services } from '../../data/services';

// Map icon strings to Lucide components
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Layout,
};

export default function Services() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const handleScrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      const top = el.offsetTop - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="services"
      className="relative z-10 overflow-hidden"
      style={{
        paddingTop: 'clamp(3rem, 8vw, 6rem)',
        paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        paddingLeft: 'clamp(1rem, 4vw, 2rem)',
        paddingRight: 'clamp(1rem, 4vw, 2rem)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <h2
            className="font-display font-bold text-white light:text-zinc-950"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
          >
            Professional Offerings
          </h2>
          <p className="text-xs text-muted mt-2 max-w-md mx-auto">
            High-integrity services designed to qualify leads and satisfy enterprise clients.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        {/* Services Grid */}
        <div
          ref={containerRef}
          className="max-w-2xl mx-auto"
        >
          {services.map((service, idx) => {
            const IconComponent = ICON_MAP[service.iconName] || Layout;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="rounded-xl glass-panel p-6 md:p-8 flex flex-col justify-between glass-card-hover interactive-card border border-white/5 light:border-zinc-200 relative overflow-hidden group"
              >
                {/* Background glow node on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-accent/15 transition-all duration-300" />
                
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-lg bg-zinc-900/50 light:bg-zinc-200/50 border border-white/5 light:border-black/5 text-accent light:text-primary group-hover:text-white group-hover:bg-accent/80 transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg md:text-xl text-white light:text-zinc-950 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs md:text-sm text-muted mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                        <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={handleScrollToContact}
                  className="w-full py-2.5 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary text-white hover:border-transparent rounded-full text-xs font-bold transition-all cursor-pointer text-center"
                >
                  Book Service Inquiry
                </button>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
