'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Award, Briefcase, GraduationCap, Users } from 'lucide-react';
import { experiences } from '../../data/experience';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1500;
    const incrementTime = 16;
    const totalSteps = duration / incrementTime;
    const stepIncrement = end / totalSteps;

    const timer = setInterval(() => {
      start += stepIncrement;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display font-bold text-4xl md:text-5xl text-white light:text-zinc-950">
      {count}
      {suffix}
    </span>
  );
}

export default function About() {
  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true });

  const timelineItems = experiences.slice(0, 3); // show top 3 experiences

  return (
    <section id="about" className="py-24 px-4 bg-zinc-950/20 light:bg-zinc-50/40 relative z-10 border-t border-zinc-900/50 light:border-zinc-200/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div ref={titleRef} className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display font-bold text-3xl md:text-5xl text-white light:text-zinc-950"
          >
            Engineering With Purpose
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={isTitleInView ? { width: '80px' } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full"
          />
        </div>

        {/* Narrative & Counters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Narrative */}
          <div className="lg:col-span-7 space-y-6 text-muted text-sm md:text-base leading-relaxed">
            <h3 className="font-display font-bold text-xl md:text-2xl text-white light:text-zinc-950 mb-4">
              I build software that resolves business bottlenecks.
            </h3>
            <p>
              My journey as a developer is centered on technical reliability and visual polish. I believe a site should load instantly, feel alive with micro-interactions, and have a database design structured for rapid queries under heavy loads.
            </p>
            <p>
              Whether transitioning server clusters to containerized Docker environments, creating real-time sync databases for supermarkets, or engineering layout-aware PDF parsers to fuel custom AI retrieval engines, I specialize in resolving high-concurrency and spatial computation limits.
            </p>
            
            {/* Counter Grid */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-black/5 flex items-center gap-4">
                <Briefcase className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <AnimatedCounter value={5} suffix="+" />
                  <span className="block text-xs uppercase tracking-wider mt-1 text-muted">Years Coding</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-black/5 flex items-center gap-4">
                <Users className="w-8 h-8 text-accent shrink-0" />
                <div>
                  <AnimatedCounter value={40} suffix="+" />
                  <span className="block text-xs uppercase tracking-wider mt-1 text-muted">Projects Shipped</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-black/5 flex items-center gap-4">
                <Award className="w-8 h-8 text-accent shrink-0" />
                <div>
                  <AnimatedCounter value={99} suffix="%" />
                  <span className="block text-xs uppercase tracking-wider mt-1 text-muted">Uptime SLA</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-black/5 flex items-center gap-4">
                <GraduationCap className="w-8 h-8 text-primary shrink-0" />
                <div>
                  <AnimatedCounter value={18} suffix="+" />
                  <span className="block text-xs uppercase tracking-wider mt-1 text-muted">Skills Mastered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Experience/Education Timeline */}
          <div className="lg:col-span-5 space-y-6">
            <h4 className="font-display font-bold text-lg text-white light:text-zinc-950 mb-4 border-b border-zinc-900 light:border-zinc-200 pb-2">
              Career Highlights
            </h4>
            
            <div className="relative pl-6 border-l border-zinc-800 light:border-zinc-200 space-y-8">
              {timelineItems.map((item) => (
                <div key={item.id} className="relative">
                  {/* Dot */}
                  <span className="absolute -left-[30px] top-1.5 w-4 h-4 rounded-full bg-[#09090b] light:bg-[#ffffff] border-2 border-primary flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </span>
                  
                  <span className="text-[10px] uppercase font-bold text-accent tracking-wider bg-zinc-900/80 light:bg-zinc-100 border border-white/5 light:border-black/5 px-2 py-0.5 rounded">
                    {item.period}
                  </span>
                  <h5 className="font-display font-bold text-sm text-white light:text-zinc-950 mt-2">
                    {item.role}
                  </h5>
                  <p className="text-xs text-muted font-medium mt-1">
                    {item.company}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                    {item.description[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
