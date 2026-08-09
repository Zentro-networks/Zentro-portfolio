'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay handler
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const active = testimonials[index];

  return (
    <section id="testimonials" className="py-24 px-4 bg-transparent relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white light:text-zinc-950">
            Client Review
          </h2>
          <p className="text-xs text-muted mt-2">
            Read what previous collaborators and engineering managers have to say.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        {/* Carousel Window */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.4 }}
              className="w-full rounded-xl glass-panel p-6 md:p-10 border border-white/5 light:border-zinc-200 relative flex flex-col justify-between"
            >
              {/* Giant Background Quote Icon */}
              <Quote className="absolute right-6 top-6 w-20 h-20 text-white/[0.02] light:text-black/[0.02] pointer-events-none" />

              <div>
                {/* Rating */}
                <div className="flex gap-1.5 mb-6 text-yellow-500 justify-center md:justify-start">
                  {Array.from({ length: active.rating }).map((_, idx) => (
                    <Star key={idx} className="w-4.5 h-4.5 fill-yellow-500" />
                  ))}
                </div>

                {/* Quote text */}
                <blockquote className="text-sm md:text-lg text-white light:text-zinc-800 leading-relaxed font-medium italic mb-8 text-center md:text-left">
                  &ldquo;{active.quote}&rdquo;
                </blockquote>
              </div>

              {/* User Bio */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-auto border-t border-zinc-900/60 light:border-zinc-200 pt-6">
                <div className="flex items-center gap-4 text-center md:text-left">
                  {/* Avatar */}
                  <img
                    src={active.avatar}
                    alt={active.name}
                    className="w-12 h-12 rounded-full border border-primary/40 object-cover"
                  />
                  <div>
                    <h4 className="font-display font-bold text-sm text-white light:text-zinc-950">
                      {active.name}
                    </h4>
                    <p className="text-[10px] text-muted font-medium">
                      {active.role} &bull; <span className="text-accent">{active.company}</span>
                    </p>
                  </div>
                </div>

                {/* Navigation Dots & Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrev}
                    className="p-2 rounded-full border border-white/5 light:border-zinc-200 bg-zinc-900/40 light:bg-zinc-100 hover:bg-zinc-800 light:hover:bg-zinc-200 hover:text-white light:hover:text-zinc-950 transition-all text-muted cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex gap-1.5">
                    {testimonials.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => {
                          setDirection(dotIdx > index ? 1 : -1);
                          setIndex(dotIdx);
                        }}
                        className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                          dotIdx === index ? 'bg-accent w-4' : 'bg-zinc-800 light:bg-zinc-300'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-2 rounded-full border border-white/5 light:border-zinc-200 bg-zinc-900/40 light:bg-zinc-100 hover:bg-zinc-800 light:hover:bg-zinc-200 hover:text-white light:hover:text-zinc-950 transition-all text-muted cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
