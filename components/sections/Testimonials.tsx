'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { testimonials } from '../../data/testimonials';

// ---------------------------------------------------------------------------
// Review form state types
// ---------------------------------------------------------------------------
interface ReviewFormData {
  clientName: string;
  companyName: string;
  projectName: string;
  rating: number;      // 0 = unset
  feedback: string;
  website: string;     // honeypot
}

interface ReviewFormErrors {
  clientName?: string;
  projectName?: string;
  rating?: string;
  feedback?: string;
}

const INITIAL_FORM: ReviewFormData = {
  clientName: '',
  companyName: '',
  projectName: '',
  rating: 0,
  feedback: '',
  website: '',
};

// ---------------------------------------------------------------------------
// StarRating sub-component — click to set, hover to preview
// ---------------------------------------------------------------------------
function StarRating({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div>
      <div
        className="flex items-center gap-1.5"
        role="group"
        aria-label="Star rating"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded transition-transform duration-100 active:scale-90"
          >
            <Star
              className={`w-6 h-6 transition-colors duration-100 ${
                star <= (hovered || value)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-transparent text-zinc-600 light:text-zinc-300'
              }`}
            />
          </button>
        ))}
        {value > 0 && (
          <span className="text-xs text-muted ml-1 font-medium">
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][value]}
          </span>
        )}
      </div>
      {error && (
        <p className="text-red-400 text-xs mt-1.5 font-semibold">{error}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Input / Textarea shared className helpers
// ---------------------------------------------------------------------------
const inputCls =
  'w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent text-xs';

// ---------------------------------------------------------------------------
// Main Testimonials section
// ---------------------------------------------------------------------------
export default function Testimonials() {
  // ── Carousel state ──────────────────────────────────────────────────────
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev

  const handleNext = useCallback(() => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Autoplay handler
  useEffect(() => {
    const timer = setInterval(handleNext, 6000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const active = testimonials[index];

  // ── Review form state ────────────────────────────────────────────────────
  const [formData, setFormData]     = useState<ReviewFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<ReviewFormErrors>({});
  const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const handleFieldChange = (
    field: keyof ReviewFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for the field being edited
    if (field in formErrors) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field as keyof ReviewFormErrors];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const errors: ReviewFormErrors = {};

    if (!formData.clientName.trim() || formData.clientName.trim().length < 2) {
      errors.clientName = 'Please enter your name (at least 2 characters).';
    }
    if (!formData.projectName.trim() || formData.projectName.trim().length < 2) {
      errors.projectName = 'Please enter the project or service name.';
    }
    if (formData.rating === 0) {
      errors.rating = 'Please select a star rating.';
    }
    if (!formData.feedback.trim() || formData.feedback.trim().length < 10) {
      errors.feedback = 'Please write at least 10 characters of feedback.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setSubmitState('loading');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName:  formData.clientName.trim(),
          companyName: formData.companyName.trim(),
          projectName: formData.projectName.trim(),
          rating:      formData.rating,
          feedback:    formData.feedback.trim(),
          website:     formData.website, // honeypot
        }),
      });

      const resData = await response.json();

      if (response.ok) {
        setSubmitState('success');
        setSubmitMessage(
          resData.message ?? 'Thank you for your feedback! We\'ll review your submission shortly.'
        );
        setFormData(INITIAL_FORM);
        setFormErrors({});
      } else {
        throw new Error(resData.message || 'Something went wrong. Please try again.');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Server error. Please try again.';
      setSubmitState('error');
      setSubmitMessage(message);
    }
  };

  return (
    <section
      id="testimonials"
      className="relative z-10 overflow-hidden"
      style={{
        paddingTop: 'clamp(3rem, 8vw, 6rem)',
        paddingBottom: 'clamp(3rem, 8vw, 6rem)',
        paddingLeft: 'clamp(1rem, 4vw, 2rem)',
        paddingRight: 'clamp(1rem, 4vw, 2rem)',
      }}
    >
      <div className="max-w-4xl mx-auto">

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-10 md:mb-16 text-center">
          <h2
            className="font-display font-bold text-white light:text-zinc-950"
            style={{ fontSize: 'clamp(1.75rem, 4vw, 3.25rem)' }}
          >
            Client Review
          </h2>
          <p className="text-xs text-muted mt-2">
            Read what previous collaborators and engineering managers have to say.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        {/* ── Carousel Window ───────────────────────────────────────────── */}
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

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="relative flex items-center gap-4 mt-14 mb-10">
          <div className="flex-1 h-px bg-white/[0.06] light:bg-zinc-200" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted shrink-0">
            Share Your Experience
          </span>
          <div className="flex-1 h-px bg-white/[0.06] light:bg-zinc-200" />
        </div>

        {/* ── Review Submission Form ────────────────────────────────────── */}
        <div className="rounded-xl glass-panel p-6 md:p-8 border border-white/5 light:border-zinc-200">
          <h3 className="font-display font-bold text-base md:text-lg text-white light:text-zinc-950 mb-1">
            Leave a Review
          </h3>
          <p className="text-xs text-muted mb-6">
            Worked with us? Your feedback helps others make informed decisions.
          </p>

          {/* Success / Error notification */}
          {submitMessage && (
            <div
              className={`flex gap-3 p-4 rounded-lg text-xs font-semibold mb-6 border ${
                submitState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400'
                  : 'bg-red-950/20 border-red-900 text-red-400'
              }`}
            >
              {submitState === 'success' ? (
                <CheckCircle className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{submitMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Honeypot — hidden from humans, visible to bots */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="review-website">Skip this field</label>
              <input
                type="text"
                id="review-website"
                autoComplete="off"
                tabIndex={-1}
                value={formData.website}
                onChange={(e) => handleFieldChange('website', e.target.value)}
              />
            </div>

            {/* Row: Client Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="review-clientName"
                  className="block text-muted font-bold uppercase tracking-wider text-xs"
                >
                  Your Name <span className="text-accent">*</span>
                </label>
                <input
                  type="text"
                  id="review-clientName"
                  placeholder="Jane Doe"
                  value={formData.clientName}
                  onChange={(e) => handleFieldChange('clientName', e.target.value)}
                  className={inputCls}
                  aria-required="true"
                />
                {formErrors.clientName && (
                  <p className="text-red-400 text-xs mt-1 font-semibold">{formErrors.clientName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="review-companyName"
                  className="block text-muted font-bold uppercase tracking-wider text-xs"
                >
                  Company <span className="text-zinc-600 normal-case tracking-normal font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  id="review-companyName"
                  placeholder="Acme Corp"
                  value={formData.companyName}
                  onChange={(e) => handleFieldChange('companyName', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Project / Service */}
            <div className="space-y-2">
              <label
                htmlFor="review-projectName"
                className="block text-muted font-bold uppercase tracking-wider text-xs"
              >
                Project / Service <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                id="review-projectName"
                placeholder="E.g. E-Commerce Platform, AI Dashboard..."
                value={formData.projectName}
                onChange={(e) => handleFieldChange('projectName', e.target.value)}
                className={inputCls}
                aria-required="true"
              />
              {formErrors.projectName && (
                <p className="text-red-400 text-xs mt-1 font-semibold">{formErrors.projectName}</p>
              )}
            </div>

            {/* Star Rating */}
            <div className="space-y-2">
              <span className="block text-muted font-bold uppercase tracking-wider text-xs">
                Rating <span className="text-accent">*</span>
              </span>
              <StarRating
                value={formData.rating}
                onChange={(v) => handleFieldChange('rating', v)}
                error={formErrors.rating}
              />
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <label
                htmlFor="review-feedback"
                className="block text-muted font-bold uppercase tracking-wider text-xs"
              >
                Your Review <span className="text-accent">*</span>
              </label>
              <textarea
                id="review-feedback"
                rows={5}
                placeholder="Tell us about your experience working with us — what went well, what you achieved, and why you'd recommend us..."
                value={formData.feedback}
                onChange={(e) => handleFieldChange('feedback', e.target.value)}
                className={inputCls}
                aria-required="true"
              />
              {formErrors.feedback && (
                <p className="text-red-400 text-xs mt-1 font-semibold">{formErrors.feedback}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="review-submit"
              disabled={submitState === 'loading'}
              className="w-full py-3.5 bg-accent hover:bg-accent/90 disabled:bg-zinc-800 text-[#071415] disabled:text-muted rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-xs min-h-[48px]"
            >
              {submitState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Review
                </>
              )}
            </button>

            <p className="text-[10px] text-muted text-center">
              All reviews are moderated before being published.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}
