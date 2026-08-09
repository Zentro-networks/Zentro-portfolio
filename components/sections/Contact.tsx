'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
// Zod Validation Schema
const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  projectType: z.string().min(1, { message: 'Please select a project category.' }),
  budgetRange: z.string().min(1, { message: 'Please select your estimated budget.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
  website: z.string().optional(), // Honeypot spam protection
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      projectType: '',
      budgetRange: '',
      message: '',
      website: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // If the honeypot field is filled, silently discard as spam
    if (data.website) {
      setFormState('success');
      setStatusMessage('Inquiry sent successfully!');
      reset();
      return;
    }

    setFormState('loading');
    setStatusMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (response.ok) {
        setFormState('success');
        setStatusMessage('Your inquiry has been successfully sent! I will review your requirements and respond within 12 hours.');
        reset();
      } else {
        throw new Error(resData.message || 'Something went wrong. Please try again.');
      }
    } catch (error: any) {
      setFormState('error');
      setStatusMessage(error.message || 'Server error. Please use direct links.');
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-zinc-950/20 light:bg-zinc-50/40 relative z-10 border-t border-zinc-900/50 light:border-zinc-200/50">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display font-bold text-3xl md:text-5xl text-white light:text-zinc-950">
            Initialize Proposal
          </h2>
          <p className="text-xs text-muted mt-2 max-w-md mx-auto">
            Ready to build? Send your system specifications for an immediate feasibility report.
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-accent mx-auto mt-4 rounded-full w-20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Direct Details & GitHub Graph (5 columns) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="font-display font-bold text-lg md:text-xl text-white light:text-zinc-950 mb-3">
                Let&apos;s build together.
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Connect directly for emergency developer bookings, consulting arrangements, or general architecture reviews.
              </p>
            </div>

            {/* Direct Coordinates */}
            <div className="space-y-4 text-xs font-semibold">
              <a
                href="mailto:ranjithbharathwaj@gmail.com"
                className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 hover:border-accent/30 transition-all text-muted hover:text-white light:hover:text-zinc-950"
              >
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span>ranjithbharathwaj@gmail.com</span>
              </a>

              <a
                href="tel:+91 7305893249"
                className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 hover:border-accent/30 transition-all text-muted hover:text-white light:hover:text-zinc-950"
              >
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>7305893249</span>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900/40 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-muted">
                <MapPin className="w-5 h-5 text-accent shrink-0" />
                <span>Chennai, Tamil Nadu, </span>
              </div>
            </div>
          </div>

          {/* Form container (7 columns) */}
          <div className="lg:col-span-7 rounded-xl glass-panel p-6 md:p-8 border border-white/5 light:border-zinc-200">
            <h3 className="font-display font-bold text-base md:text-lg text-white light:text-zinc-950 mb-6 border-b border-zinc-900 pb-3">
              Proposal Details
            </h3>

            {/* Success/Error Notifications */}
            {statusMessage && (
              <div
                className={`flex gap-3 p-4 rounded-lg text-xs font-semibold mb-6 border ${formState === 'success'
                  ? 'bg-emerald-950/20 border-emerald-900 text-emerald-400'
                  : 'bg-red-950/20 border-red-900 text-red-400'
                  }`}
              >
                {formState === 'success' ? (
                  <CheckCircle className="w-5 h-5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0" />
                )}
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-xs">
              {/* Spam Honeypot Field (Hidden from human users, visible to bots) */}
              <div className="hidden">
                <label htmlFor="website">Skip this field</label>
                <input
                  type="text"
                  id="website"
                  autoComplete="off"
                  {...register('website')}
                />
              </div>

              {/* Row: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-muted font-bold uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Jane Doe"
                    {...register('name')}
                    className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                  />
                  {errors.name && <p className="text-red-400 mt-1 font-semibold">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-muted font-bold uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="jane@company.com"
                    {...register('email')}
                    className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                  />
                  {errors.email && <p className="text-red-400 mt-1 font-semibold">{errors.email.message}</p>}
                </div>
              </div>

              {/* Row: Project Category & Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="projectType" className="block text-muted font-bold uppercase tracking-wider">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    {...register('projectType')}
                    className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 focus:outline-none focus:border-accent"
                  >
                    <option value="" disabled className="text-zinc-500">
                      Select project type...
                    </option>
                    <option value="custom-web">Custom Web Application</option>
                    <option value="ai-integration">AI / LLM System</option>
                    <option value="backend-api">High-Performance API</option>
                    <option value="redesign-performance">Performance Optimization</option>
                    <option value="consulting">Hourly Consulting</option>
                  </select>
                  {errors.projectType && <p className="text-red-400 mt-1 font-semibold">{errors.projectType.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="budgetRange" className="block text-muted font-bold uppercase tracking-wider">
                    Estimated Budget
                  </label>
                  <select
                    id="budgetRange"
                    {...register('budgetRange')}
                    className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 focus:outline-none focus:border-accent"
                  >
                    <option value="" disabled className="text-zinc-500">
                      Select budget range...
                    </option>
                    <option value="starter">$3,500 - $6,000</option>
                    <option value="mid">$6,000 - $12,000</option>
                    <option value="high">$12,000 - $25,000</option>
                    <option value="enterprise">$25,000+</option>
                  </select>
                  {errors.budgetRange && <p className="text-red-400 mt-1 font-semibold">{errors.budgetRange.message}</p>}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="block text-muted font-bold uppercase tracking-wider">
                  Project Description
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="Outline your application features, technical dependencies, and deadline benchmarks..."
                  {...register('message')}
                  className="w-full p-3 rounded-lg bg-zinc-900/60 light:bg-zinc-100 border border-white/5 light:border-zinc-200 text-white light:text-zinc-950 placeholder-zinc-500 focus:outline-none focus:border-accent"
                />
                {errors.message && <p className="text-red-400 mt-1 font-semibold">{errors.message.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formState === 'loading'}
                className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-zinc-800 text-[#09090b] disabled:text-muted rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
              >
                {formState === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Validating Proposal Specifications...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Inquiry
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </section>
  );
}
