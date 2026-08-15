'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { UtensilsCrossed, Building2, ShoppingBag, ArrowRight } from 'lucide-react';
import { projects } from '../../data/projects';

// Map slugs to icons for visual preview placeholders
const PREVIEW_ICONS: Record<string, React.ComponentType<any>> = {
  'restaurant-web-page': UtensilsCrossed,
  'enterprise': Building2,
  'ecommerce': ShoppingBag,
};

// Map slugs to gradient patterns for beautiful previews
const PREVIEW_GRADIENTS: Record<string, string> = {
  'restaurant-web-page': 'from-[#087F7B]/20 via-[#0B2929]/50 to-[#071415]',
  'enterprise': 'from-blue-600/10 via-[#0B2929]/50 to-[#071415]',
  'ecommerce': 'from-amber-500/10 via-[#0B2929]/50 to-[#071415]',
};

export default function OurWorks() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="projects" className="py-16 md:py-24 relative z-10 border-t border-white/5 light:border-black/5 overflow-hidden"
      style={{ paddingLeft: 'clamp(1rem, 4vw, 2rem)', paddingRight: 'clamp(1rem, 4vw, 2rem)' }}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10 md:mb-16 text-center">
          <h2
            className="font-display font-bold text-white light:text-zinc-950"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
          >
            Our Works
          </h2>
          <p className="text-xs text-muted mt-2 max-w-md mx-auto">
            A showcase of our premium web solutions built to drive business growth and satisfy clients.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        {/* Project Cards Grid: 1 col mobile → 2 col tablet → 3 col desktop */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
        >
          {projects.map((project, idx) => {
            const IconComponent = PREVIEW_ICONS[project.slug] || Building2;
            const gradientClass = PREVIEW_GRADIENTS[project.slug] || 'from-primary/10 via-[#0B2929]/50 to-[#071415]';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="rounded-xl glass-panel flex flex-col justify-between glass-card-hover interactive-card border border-white/5 light:border-zinc-200 relative overflow-hidden group h-full min-w-0"
              >
                <Link href={`/projects/${project.slug}`} className="flex flex-col h-full justify-between">
                  <div>
                    {/* Project Preview Area */}
                    <div className={`h-48 w-full bg-gradient-to-br ${gradientClass} flex items-center justify-center relative border-b border-white/5 light:border-zinc-200 overflow-hidden`}>
                      {/* Grid overlay for tech look */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
                      
                      {/* Floating glowing circle */}
                      <div className="absolute w-24 h-24 rounded-full bg-primary/10 blur-xl group-hover:scale-150 transition-all duration-500" />
                      
                      <div className="p-4 rounded-full bg-zinc-950/80 light:bg-white/80 border border-white/10 light:border-zinc-200 text-accent light:text-primary z-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                        <IconComponent className="w-8 h-8" />
                      </div>

                      {/* Code wireframe mockup decoration */}
                      <div className="absolute bottom-2 left-4 right-4 flex flex-col gap-1.5 opacity-40">
                        <div className="h-1.5 w-1/3 rounded-full bg-white/20 light:bg-black/20" />
                        <div className="h-1 w-2/3 rounded-full bg-white/10 light:bg-black/10" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-bold text-accent light:text-primary bg-accent/10 light:bg-primary/10 border border-accent/20 light:border-primary/20 px-2 py-0.5 rounded">
                          {project.category}
                        </span>
                        <div className="flex gap-1">
                          {project.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[8px] font-semibold text-muted bg-white/5 light:bg-black/5 px-1.5 py-0.5 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h3 className="font-display font-bold text-lg text-white light:text-zinc-950 mb-2 group-hover:text-accent light:group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      
                      <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* View Project Button */}
                  <div className="p-4 sm:p-6 pt-0 mt-auto">
                    <div className="w-full py-2.5 rounded-full border border-primary/20 bg-primary/5 group-hover:bg-primary text-white group-hover:border-transparent text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center min-h-[40px]">
                      <span>View Project Case Study</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
